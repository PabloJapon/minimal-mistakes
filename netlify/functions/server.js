const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Error: Stripe secret key is missing!');
} else {
  console.log('Stripe secret key:', stripeSecretKey);
}

const stripe = require('stripe')(stripeSecretKey);

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    // Log the incoming request body
    console.log('Incoming request body:', body);

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
  } catch (error) {
    // Handle errors
    console.error('Error creating subscription:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create subscription' })
    };
  }
};
