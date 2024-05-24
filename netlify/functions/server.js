const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Error: Stripe secret key is missing!');
} else {
  console.log('Stripe secret key:', stripeSecretKey);
}

const stripe = require('stripe')(stripeSecretKey);

exports.handler = async (event) => {
  try {
    console.log('Incoming request:', event);

    const body = JSON.parse(event.body);

    // Log the incoming request body
    console.log('Incoming request body:', body);

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

      const nextInvoiceDate = upcomingInvoice.next_payment_attempt;
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
      //await stripe.subscriptions.update(subscription.id, { cancel_at_period_end: true });
      await stripe.subscriptions.cancel(subscription.id);

      // Subscription cancellation scheduled successfully
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Subscription cancellation scheduled successfully' })
      };
    } else {
      // Create subscription action

      // Check if user exists with the provided email
      const existingCustomer = await stripe.customers.list({ email: body.email, limit: 1 });

      let customerId;

      if (existingCustomer.data.length > 0) {
        // If customer exists, use existing customer ID
        customerId = existingCustomer.data[0].id;
        console.log('Existing customer found. Customer ID:', customerId);

        // Check if the customer has an active subscription
        const existingSubscription = await stripe.subscriptions.list({
          customer: customerId,
          status: 'active',
          limit: 1
        });

        if (existingSubscription.data.length > 0) {
          // If customer has an active subscription, handle it accordingly
          console.log('Customer already has an active subscription:', existingSubscription.data[0].id);
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Customer already has an active subscription' })
          };
        }
      } else {
        // If customer doesn't exist, create a new customer
        console.log('No existing customer found. Creating a new customer...');

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

      // Create a subscription for the customer using the customer ID
      console.log('Creating subscription for customer:', customerId);

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: body.priceId }]
      });

      console.log('Subscription created successfully:', subscription);

      // Subscription created successfully
      return {
        statusCode: 200,
        body: JSON.stringify({ subscription })
      };
    }
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
