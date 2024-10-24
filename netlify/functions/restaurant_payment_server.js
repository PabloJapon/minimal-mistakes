const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Error: Stripe secret key is missing!');
}

const stripe = require('stripe')(stripeSecretKey);

exports.handler = async (event, context) => {
  try {
    // Parse the request body
    const { action, plan, customerName, customerEmail } = JSON.parse(event.body);

    console.log('Received action:', action); // Debugging log
    console.log('Received plan:', plan); // Debugging log
    console.log('Received customer name:', customerName); // Debugging log
    console.log('Received customer email:', customerEmail); // Debugging log

    // Validate input
    if (!plan || !customerName || !customerEmail) {
      console.log('Invalid input. Returning error response.'); // Debugging log
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid input. Please provide a valid plan, name, and email.' }),
      };
    }

    // Define price IDs for the subscription plan
    const priceIds = {
      Gratis: 'price_1On5B9E2UvP4xcDsTat7ZHhV',
      Pro: 'price_1On33zE2UvP4xcDsDD9jPJzw',
      Premium: 'price_1On5CAE2UvP4xcDso6epRdMs',
    };

    // Create a new customer with the provided name and email
    const customer = await stripe.customers.create({
      name: customerName,
      email: customerEmail,
    });
    console.log('Customer created:', customer); // Debugging log

    // Create a subscription for the customer
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceIds[plan] }],
      payment_behavior: 'default_incomplete', // Customer needs to complete payment setup
      expand: ['latest_invoice.payment_intent'],
    });

    console.log('Subscription created:', subscription); // Debugging log

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        subscriptionId: subscription.id,
      }),
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'An error occurred while processing the subscription.',
        details: error.message,
      }),
    };
  }
};
