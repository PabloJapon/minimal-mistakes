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

  // Debug: Log the event type
  console.log(`DEBUG: Stripe event type received: ${eventData.type}`);

  switch (eventData.type) {
    case 'payment_intent.succeeded':
      // Extract the paymentIntent from the event
      const paymentIntent = eventData.data.object;

      // Debug: Log the raw paymentIntent
      console.log('DEBUG: Full paymentIntent object:', JSON.stringify(paymentIntent, null, 2));

      console.log('PaymentIntent was successful!');

      // Convert amount from cents to euros
      const amount = paymentIntent.amount_received / 100;
      // Pull table_number and id from metadata
      const tableNumber = paymentIntent.metadata.table_number;
      const id = paymentIntent.metadata.id;
      // The unique PaymentIntent ID
      const paymentIntentId = paymentIntent.id;

      // Debug: Confirm values
      console.log('DEBUG: paymentIntentId:', paymentIntentId);
      console.log('DEBUG: tableNumber:', tableNumber);
      console.log('DEBUG: id:', id);
      console.log('DEBUG: amount:', amount);

      // Send confirmation to your Python backend
      try {
        const response = await axios.post(
          'https://pablogastrali.pythonanywhere.com/confirm_payment',
          {
            id: id,
            amount: amount,
            table_number: tableNumber,
            id_payment: paymentIntentId, // Here is the unique PaymentIntent ID
          }
        );

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
