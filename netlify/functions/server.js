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
    
    // Create a customer
    const customer = await stripe.customers.create({
      email: body.email,
      payment_method: body.payment_method,
      invoice_settings: {
        default_payment_method: body.payment_method
      }
    });

    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: body.priceId }]
    });

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
