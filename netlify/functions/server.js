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
      const { plan } = body;
      console.log('Creating payment intent for plan:', plan); // Log plan

      // Define price IDs and amounts for each plan
      const priceIds = {
        Gratis: 'price_1On5B9E2UvP4xcDsTat7ZHhV',
        Avanzado: 'price_1On33zE2UvP4xcDsDD9jPJzw',
        Premium: 'price_1On5CAE2UvP4xcDso6epRdMs'
      };

      const amounts = {
        Gratis: 0, // In cents
        Avanzado: 3000, // 30€
        Premium: 5000 // 50€
      };

      // Check if the plan exists
      if (!priceIds[plan]) {
        console.error('Invalid plan:', plan); // Log invalid plan error
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid plan' })
        };
      }

      try {
        console.log('Creating payment intent with amount:', amounts[plan]); // Log amount
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amounts[plan], // Amount in cents
          currency: 'eur',
          metadata: {
            plan: plan, // Attach the selected plan as metadata
          },
        });

        console.log('Payment intent created successfully:', paymentIntent); // Log successful creation
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            clientSecret: paymentIntent.client_secret,
            priceId: priceIds[plan]
          })
        };
      } catch (error) {
        console.error('Error creating payment intent:', error); // Log error during payment intent creation
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to create payment intent' })
        };
      }
    }

    if (body.action === 'create_setup_intent') {
      const customerEmail = body.email;
    
      // Fetch the Stripe customer
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      const customer = customers.data[0];
    
      if (!customer) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Customer not found' })
        };
      }
    
      // Create SetupIntent for updating payment method
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
      });
    
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ clientSecret: setupIntent.client_secret })
      };
    }    
  
    if (body.action === 'get_payment_method') {
      const customerEmail = body.email;
    
      try {
        // Retrieve customer using email
        const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
        const customer = customers.data[0];
    
        if (!customer) {
          return {
            statusCode: 400,
            headers,  // Include CORS headers
            body: JSON.stringify({ error: 'Customer not found' })
          };
        }
    
        // Get the default payment method attached to the customer
        const paymentMethods = await stripe.paymentMethods.list({
          customer: customer.id,
          type: 'card'
        });
    
        // Check if there's at least one payment method and retrieve the first one
        if (paymentMethods.data.length > 0) {
          const paymentMethod = paymentMethods.data[0];
          return {
            statusCode: 200,
            headers,  // Include CORS headers
            body: JSON.stringify({ paymentMethod })
          };
        } else {
          return {
            statusCode: 400,
            headers,  // Include CORS headers
            body: JSON.stringify({ error: 'No payment method found for the customer' })
          };
        }
      } catch (error) {
        console.error('Error retrieving payment method:', error);
        return {
          statusCode: 500,
          headers,  // Include CORS headers
          body: JSON.stringify({ error: 'Failed to retrieve payment method' })
        };
      }
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (body.action === 'get_subscription_plan') {
            const customerEmail = body.email;

            // Fetch customer by email
            const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
            const customer = customers.data[0];

            if (!customer) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Customer not found' })
                };
            }

            // Fetch active subscription
            const subscriptions = await stripe.subscriptions.list({
                customer: customer.id,
                status: 'active',
                limit: 1
            });

            if (subscriptions.data.length === 0) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'No active subscription found for the customer' })
                };
            }

            const subscription = subscriptions.data[0];

            // Get the product ID from the subscription
            const productId = subscription.items.data[0].price.product;

            // Fetch the product details
            const product = await stripe.products.retrieve(productId);

            // Return only the product name
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ product_name: product.name })
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
