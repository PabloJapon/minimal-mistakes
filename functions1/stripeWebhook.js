// functions/stripeWebhook.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const payload = event.body;
  const sigHeader = event.headers['Stripe-Signature'];

  try {
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(payload, sigHeader, process.env.STRIPE_WEBHOOK_SECRET);

    // Handle valid event
    console.log('Received webhook event:', event.type);
    // Add logic to handle the event (e.g., update user metadata)

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Error verifying webhook event:', error);

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid webhook event' }),
    };
  }
};
