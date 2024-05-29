const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Error: Stripe secret key is missing!');
} else {
  console.log('Stripe secret key:', stripeSecretKey);
}

const stripe = require('stripe')(stripeSecretKey);
const pdfkit = require('pdfkit');
const fs = require('fs');

// Function to generate PDF invoice
const generatePdfInvoice = (invoiceData) => {
  const doc = new pdfkit();
  // Customize PDF content based on invoice data
  doc.text(`Invoice #: ${invoiceData.number}`);
  doc.text(`Amount Due: ${invoiceData.amount_due}`);
  // Add more invoice details as needed
  doc.end();
  return doc;
};

exports.handler = async (event) => {
  try {
    console.log('Incoming request:', event);

    const body = JSON.parse(event.body);

    // Log the incoming request body
    console.log('Incoming request body:', body);

    // Check if action is to create payment intent
    if (body.action === 'create_payment_intent') {
      const { plan } = body;

      // Define the price ID for each plan
      const priceIds = {
        Gratis: 'price_1On5B9E2UvP4xcDsTat7ZHhV',
        Pro: 'price_1On33zE2UvP4xcDsDD9jPJzw',
        Premium: 'price_1On5CAE2UvP4xcDso6epRdMs'
      };

      if (!priceIds[plan]) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid plan' })
        };
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000, // replace with the actual amount in cents
        currency: 'usd',
        payment_method_types: ['card'],
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          clientSecret: paymentIntent.client_secret,
          priceId: priceIds[plan]
        })
      };
    }

    // Check if action is to retrieve next invoice date
    if (body.action === 'next_invoice_date') {
      console.log('Request to retrieve next invoice date received.');
      const customerEmail = body.email;
      console.log('Customer email:', customerEmail);

      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      const customer = customers.data[0];
      console.log('Customer data:', customer);

      if (!customer) {
        console.log('Customer not found.');
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Customer not found' })
        };
      }

      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 1
      });
      console.log('Subscriptions data:', subscriptions.data);

      if (subscriptions.data.length === 0) {
        console.log('No active subscription found for the customer.');
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'No active subscription found for the customer' })
        };
      }

      const subscription = subscriptions.data[0];
      console.log('Subscription data:', subscription);

      // Fetch the upcoming invoice
      const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
        customer: customer.id,
        subscription: subscription.id
      });
      console.log('Upcoming invoice data:', upcomingInvoice);

      if (!upcomingInvoice) {
        console.log('No upcoming invoice found for the customer.');
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'No upcoming invoice found for the customer' })
        };
      }

      const nextInvoiceDateTimestamp = upcomingInvoice.next_payment_attempt;
      const nextInvoiceDate = new Date(nextInvoiceDateTimestamp * 1000).toLocaleString();
      console.log('Next invoice date:', nextInvoiceDate);

      if (!nextInvoiceDate) {
        console.log('Next invoice date not found.');
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Next invoice date not found' })
        };
      }

      console.log('Request processed successfully.');
      return {
        statusCode: 200,
        body: JSON.stringify({ nextInvoiceDate })
      };
    }

    // Check if action is to get invoices
    if (body.action === 'get_invoices') {
      console.log('Request to get invoices received.');
      const customerEmail = body.email;
      console.log('Customer email:', customerEmail);

      // Retrieve the customer from Stripe using the email
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      const customer = customers.data[0];

      if (!customer) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Customer not found' })
        };
      }

      // Retrieve invoices for the customer
      const invoices = await stripe.invoices.list({ customer: customer.id });

      // Return the list of invoices
      return {
        statusCode: 200,
        body: JSON.stringify({ invoices: invoices.data })
      };
    }

    // Check if action is to cancel subscription
    if (body.action === 'cancel_subscription') {
      const customerEmail = body.email;

      // Retrieve the customer from Stripe using the email
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      const customer = customers.data[0];

      if (!customer) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Customer not found' })
        };
      }

      // Retrieve the active subscription for the customer
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 1
      });

      if (subscriptions.data.length === 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'No active subscription found for the customer' })
        };
      }

      const subscription = subscriptions.data[0];

      // Cancel the subscription using Stripe's API
      await stripe.subscriptions.cancel(subscription.id);

      // Subscription cancellation scheduled successfully
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Subscription cancellation scheduled successfully' })
      };
    }

    // Default action: Create a subscription
    const existingCustomer = await stripe.customers.list({ email: body.email, limit: 1 });

    let customerId;

    if (existingCustomer.data.length > 0) {
      customerId = existingCustomer.data[0].id;
      console.log('Existing customer found. Customer ID:', customerId);

      const existingSubscription = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1
      });

      if (existingSubscription.data.length > 0) {
        console.log('Customer already has an active subscription:', existingSubscription.data[0].id);
        return {
          statusCode: 400,
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
        }
      });

      customerId = customer.id;
      console.log('New customer created. Customer ID:', customerId);
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: body.priceId }]
    });

    console.log('Subscription created successfully:', subscription);

    return {
      statusCode: 200,
      body: JSON.stringify({ subscription })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
