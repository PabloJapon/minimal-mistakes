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

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);

    if (body.action === 'create_connected_account') {
      const { email, business_name } = body;

      const account = await stripe.accounts.create({
        type: 'standard',
        email,
        business_profile: {
          name: business_name,
          url: 'https://gastrali.com',  // replace with your website
        }
      });

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'https://yourdomain.com/reauth',
        return_url: 'https://yourdomain.com/return',
        type: 'account_onboarding',
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ url: accountLink.url }),
      };
    }

    if (body.action === 'check_connected_account') {
      const { email } = body;

      const accounts = await stripe.accounts.list({ limit: 100 });
      const connectedAccount = accounts.data.find(account => account.email === email);

      return {
        statusCode: 200,
        body: JSON.stringify({ hasConnectedAccount: !!connectedAccount })
      };
    }

    if (body.action === 'create_payment_intent') {
      const { plan } = body;

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

    if (body.action === 'next_invoice_date') {
      const customerEmail = body.email;

      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      const customer = customers.data[0];

      if (!customer) {
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

      if (subscriptions.data.length === 0) {
        return {
          statusCode: 400,
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
          body: JSON.stringify({ error: 'Customer not found' })
        };
      }

      const invoices = await stripe.invoices.list({ customer: customer.id });

      return {
        statusCode: 200,
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
          body: JSON.stringify({ error: 'No active subscription found for the customer' })
        };
      }

      const subscription = subscriptions.data[0];

      await stripe.subscriptions.cancel(subscription.id);

      return {
        statusCode: 200,
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
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: body.priceId }]
    });

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
