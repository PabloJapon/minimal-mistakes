const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET; // Your webhook secret

if (!stripeSecretKey) {
  console.error('Error: Stripe secret key is missing!');
}

const stripe = require('stripe')(stripeSecretKey);

// Function to create a payment intent
exports.createPaymentIntent = async (event, context) => {
  try {
    const { payment_method, amount, seller_account_id, receipt_email, id_customer } = JSON.parse(event.body);

    // Validate input
    if (!payment_method || !amount || isNaN(amount) || amount <= 0 || !seller_account_id || !payment_method.startsWith('pm_') || !id_customer) {
      console.error('Invalid input:', { payment_method, amount, seller_account_id, id_customer });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid input. Please provide a valid payment method, amount, seller account ID, and customer ID.' }),
      };
    }

    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.error('Invalid amount:', amount);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount. Please provide a valid amount.' }),
      };
    }

    // Log critical info for debugging
    console.log('Seller Account ID:', seller_account_id);
    console.log('Payment Method ID:', payment_method);
    console.log('Customer ID:', id_customer);

    const paymentIntentData = {
      amount: parsedAmount,
      currency: 'eur',
      receipt_email, // Use provided email
      payment_method,
      confirmation_method: 'manual', // Set to manual to handle confirmation securely
      metadata: {
        customer_id: id_customer, // Include customer_id in metadata
      },
    };

    console.log('Payment Intent Payload:', paymentIntentData);

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData, {
      stripeAccount: seller_account_id,
    });

    console.log('Payment Intent Created:', paymentIntent);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Payment processed successfully. Waiting for confirmation...',
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
};

// Webhook endpoint to handle Stripe events
exports.webhookHandler = async (event, context) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, stripeWebhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  // Handle different types of webhook events
  if (stripeEvent.type === 'payment_intent.succeeded') {
    const paymentIntent = stripeEvent.data.object;
    console.log('PaymentIntent was successful!', paymentIntent.id);

    // Retrieve customer_id from metadata
    const customerId = paymentIntent.metadata.customer_id;
    console.log('Payment was made by customer ID:', customerId);

    // Here you can use customerId to send a confirmation email or perform other actions
  } else if (stripeEvent.type === 'payment_intent.payment_failed') {
    const paymentIntent = stripeEvent.data.object;
    console.error('PaymentIntent failed:', paymentIntent.id);
    
    // Handle payment failure and log for debugging
  }

  return {
    statusCode: 200,
    body: 'Webhook received and processed successfully',
  };
};
