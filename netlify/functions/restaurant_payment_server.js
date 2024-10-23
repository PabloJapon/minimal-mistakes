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

    // Define price IDs and amounts for each plan
    const priceIds = {
      Gratis: 'price_1On5B9E2UvP4xcDsTat7ZHhV',
      Pro: 'price_1On33zE2UvP4xcDsDD9jPJzw',
      Premium: 'price_1On5CAE2UvP4xcDso6epRdMs'
    };

    const amounts = {
      Gratis: 0, // In cents
      Pro: 3000, // 30€
      Premium: 5000 // 50€
    };

    // Create payment intent
    const paymentIntentData = {
      amount: amounts[plan],
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      confirmation_method: 'automatic',
    };

    console.log('Payment Intent Payload:', paymentIntentData);

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    console.log('Payment Intent Created:', paymentIntent);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Payment processed successfully.',
        clientSecret: paymentIntent.client_secret,
      }),
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    const errorMessage = error.raw ? error.raw.message : error.message;

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'An error occurred while processing the payment.',
        details: errorMessage,
      }),
    };
  }
}