const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
const axios = require('axios'); // Import axios

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

    const amount = paymentIntent.amount_received / 100; // Convert amount from cents to euros
    const tableNumber = paymentIntent.metadata.table_number;
    const id = paymentIntent.metadata.id;
    const paymentIntentId = paymentIntent.id; // The unique PaymentIntent ID

    // Send confirmation to your Python backend
    try {
      const response = await axios.post('https://pablogastrali.pythonanywhere.com/confirm_payment', {
        id: id,
        amount: amount,
        table_number: tableNumber,
        id_payment: paymentIntentId  // <-- Add this line
      });

      if (response.status !== 200) {
        console.error('Failed to send payment confirmation:', response.statusText);
      } else {
        console.log('Payment confirmation sent to the database successfully.');
      }
    } catch (error) {
      console.error('Error sending payment confirmation:', error);
    }
    break;

    case 'payment_intent.failed':
      const failedPaymentIntent = eventData.data.object;
      console.log('PaymentIntent failed:', failedPaymentIntent);
      // Handle failed payment
      break;

    default:
      console.warn(`Unhandled event type ${eventData.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
