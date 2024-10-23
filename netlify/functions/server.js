const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const axios = require('axios');

if (!stripeSecretKey) {
  console.error('Error: Stripe secret key is missing!');
} else {
  console.log('Stripe secret key:', stripeSecretKey);
}

const stripe = require('stripe')(stripeSecretKey);
const pdfkit = require('pdfkit');
const fs = require('fs');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*', // You can replace '*' with 'https://gastrali.com' to restrict to your domain
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,  // Include CORS headers
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,  // Include CORS headers
        body: JSON.stringify({ error: 'Missing event body' })
      };
    }

    console.log('Event Body:', event.body);
    
    const body = JSON.parse(event.body);

    if (body.action === 'create_connected_account') {
      const { email, business_name, restaurant_id } = body; // Destructure restaurant_id

      // Log context for debugging
      console.log('Context:', context);

      // Check if restaurant ID is provided
      if (!restaurant_id) {
          return {
              statusCode: 400,
              body: JSON.stringify({ error: 'Restaurant ID not provided' }),
          };
      }

      const account = await stripe.accounts.create({
        type: 'standard',
        email,
        business_profile: {
          name: business_name,
          url: 'https://gastrali.com',
        }
      });

      const accountId = account.id; // Connected account ID

      // Step to store the connected account ID in your external API
      try {
        await axios.post(`https://pablogastrali.pythonanywhere.com/personalizacion/restaurant/${restaurant_id}`, {
          id_connect: accountId // This will store the connected account ID
        });
        console.log('Connected account ID stored successfully.');
      } catch (storeError) {
        console.error('Error storing connected account ID:', storeError);
        // Optionally handle the error (e.g., return an error response)
      }

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'https://gastrali.com',
        return_url: 'https://gastrali.com',
        type: 'account_onboarding',
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ url: accountLink.url }),
      };
    }

    if (body.action === 'check_connected_account') {
      const { email } = body;

      const accounts = await stripe.accounts.list({ limit: 100 });
      const connectedAccount = accounts.data.find(account => account.email === email);

      return {
        statusCode: 200,
        headers,  // Include CORS headers
        body: JSON.stringify({ hasConnectedAccount: !!connectedAccount })
      };
    }

    if (body.action === 'create_payment_intent') {
      const calculateOrderAmount = (items) => {
        // Calculate the order total on the server to prevent
        // people from directly manipulating the amount on the client
        let total = 0;
        items.forEach((item) => {
          total += item.amount;
        });
        return total;
      };

      const { items } = req.body;
    
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
      });
    
      res.send({
        clientSecret: paymentIntent.client_secret,
        // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
        dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
      });
    }

    

    if (body.action === 'next_invoice_date') {
      const customerEmail = body.email;

      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      const customer = customers.data[0];

      if (!customer) {
        return {
          statusCode: 400,
          headers,  // Include CORS headers
          body: JSON.stringify({ error: 'Customer not found' })
        };
      }

      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 1
      });

      if (subscriptions.data.length === 0) {
        return {
          statusCode: 400,
          headers,  // Include CORS headers
          body: JSON.stringify({ error: 'No active subscription found for the customer' })
        };
      }

      const subscription = subscriptions.data[0];

      const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
        customer: customer.id,
        subscription: subscription.id
      });

      const nextInvoiceDateTimestamp = upcomingInvoice.next_payment_attempt;
      const nextInvoiceDate = new Date(nextInvoiceDateTimestamp * 1000).toLocaleString();

      return {
        statusCode: 200,
        headers,  // Include CORS headers
        body: JSON.stringify({ nextInvoiceDate })
      };
    }

    if (body.action === 'get_invoices') {
      const customerEmail = body.email;

      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      const customer = customers.data[0];

      if (!customer) {
        return {
          statusCode: 400,
          headers,  // Include CORS headers
          body: JSON.stringify({ error: 'Customer not found' })
        };
      }

      const invoices = await stripe.invoices.list({ customer: customer.id });

      return {
        statusCode: 200,
        headers,  // Include CORS headers
        body: JSON.stringify({ invoices: invoices.data })
      };
    }

    if (body.action === 'cancel_subscription') {
      const customerEmail = body.email;

      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      const customer = customers.data[0];

      if (!customer) {
        return {
          statusCode: 400,
          headers,  // Include CORS headers
          body: JSON.stringify({ error: 'Customer not found' })
        };
      }

      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 1
      });

      if (subscriptions.data.length === 0) {
        return {
          statusCode: 400,
          headers,  // Include CORS headers
          body: JSON.stringify({ error: 'No active subscription found for the customer' })
        };
      }

      const subscription = subscriptions.data[0];

      await stripe.subscriptions.cancel(subscription.id);

      return {
        statusCode: 200,
        headers,  // Include CORS headers
        body: JSON.stringify({ message: 'Subscription cancellation scheduled successfully' })
      };
    }

    const existingCustomer = await stripe.customers.list({ email: body.email, limit: 1 });

    let customerId;

    if (existingCustomer.data.length > 0) {
      customerId = existingCustomer.data[0].id;

      const existingSubscription = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1
      });

      if (existingSubscription.data.length > 0) {
        return {
          statusCode: 400,
          headers,  // Include CORS headers
          body: JSON.stringify({ error: 'Customer already has an active subscription' })
        };
      }
    } else {
      const customer = await stripe.customers.create({
        email: body.email,
        name: body.name,
        payment_method: body.payment_method,
        invoice_settings: {
          default_payment_method: body.payment_method
        },
        preferred_locales: ['es']
      });

      customerId = customer.id;
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: body.priceId }]
    });

    return {
      statusCode: 200,
      headers,  // Include CORS headers
      body: JSON.stringify({ subscription })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,  // Include CORS headers
      body: JSON.stringify({ error: error.message })
    };
  }
};
