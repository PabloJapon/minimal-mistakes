const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

exports.handler = async (event, context) => {
  const sig = event.headers['stripe-signature'];
  const webhookEvent = event.body;

  let eventData;

  try {
    eventData = stripe.webhooks.constructEvent(webhookEvent, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook error' }),
    };
  }

  switch (eventData.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = eventData.data.object;
      console.log('PaymentIntent was successful!', paymentIntent);
      // Handle successful payment (e.g., update database, notify Unity)
      break;
    case 'payment_intent.failed':
      const failedPaymentIntent = eventData.data.object;
      console.log('PaymentIntent failed:', failedPaymentIntent);
      // Handle failed payment
      break;
    // Add other cases for different event types if needed
    default:
      console.warn(`Unhandled event type ${eventData.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
