const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Error: Stripe secret key is missing!');
}

const stripe = require('stripe')(stripeSecretKey);

exports.handler = async (event, context) => {
  try {
    // Parse the request body
    const { plan } = JSON.parse(event.body);

    // Validate input
    if (!plan) {
      console.error('Invalid input:', { plan });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid input. Please provide a valid plan.' }),
      };
    }

    // Define price IDs for each subscription plan (Stripe price IDs for subscriptions)
    const priceIds = {
      Gratis: 'price_1On5B9E2UvP4xcDsTat7ZHhV', // Free tier
      Pro: 'price_1On33zE2UvP4xcDsDD9jPJzw',   // Pro tier
      Premium: 'price_1On5CAE2UvP4xcDso6epRdMs' // Premium tier
    };

    // Check if the selected plan is valid
    if (!priceIds[plan]) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid plan selected.' }),
      };
    }

    // Create a new customer (if not already existing in your system)
    const customer = await stripe.customers.create({
      description: `Customer for ${plan} plan`,
      // Optionally, collect more customer info here (e.g., email)
    });

    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceIds[plan] }],
      payment_behavior: 'default_incomplete', // Ensures customer must complete payment setup
      expand: ['latest_invoice.payment_intent'], // Expands to get the client secret
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        subscriptionId: subscription.id, // Send the subscription ID if needed
      }),
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'An error occurred while creating the subscription.',
        details: error.message,
      }),
    };
  }
}
