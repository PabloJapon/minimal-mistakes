const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Error: Stripe secret key is missing!');
}

const stripe = require('stripe')(stripeSecretKey);

exports.handler = async (event, context) => {
  try {
    const { payment_method, amount, seller_account_id, return_url, receipt_email } = JSON.parse(event.body);

    // Validate input
    if (!payment_method || !amount || isNaN(amount) || amount <= 0 || !seller_account_id || !return_url || !payment_method.startsWith('pm_')) {
      console.error('Invalid input:', { payment_method, amount, seller_account_id, return_url });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid input. Provide a valid payment method, amount, seller account ID, and return URL.' }),
      };
    }

    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount)) {
      console.error('Invalid amount:', amount);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount. Please provide a valid amount.' }),
      };
    }

    // Log critical info for debugging
    console.log('Seller Account ID:', seller_account_id);
    console.log('Payment Method ID:', payment_method);

    const paymentIntentData = {
      amount: parsedAmount,
      currency: 'eur',
      receipt_email: receipt_email, // Use provided email
      payment_method: payment_method,
      confirmation_method: 'automatic',
    };

    console.log('Payment Intent Payload:', paymentIntentData);

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData, {
      stripeAccount: seller_account_id,
    });

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
    if (error.raw && error.raw.message) {
      console.error('Stripe error:', error.raw.message);
      if (error.raw.param) {
        console.error('Error in parameter:', error.raw.param);
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'An error occurred while processing the payment.',
        details: error.raw ? error.raw.message : error.message,
      }),
    };
  }
};
