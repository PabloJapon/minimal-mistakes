const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Error: Stripe secret key is missing!');
}

const stripe = require('stripe')(stripeSecretKey);

exports.handler = async (event, context) => {
  try {
    // Parse the request body
    const { payment_method, amount, seller_account_id, return_url, receipt_email, table_number } = JSON.parse(event.body);

    // Validate input
    if (!payment_method || !amount || isNaN(amount) || amount <= 0 || !seller_account_id || !return_url || !payment_method.startsWith('pm_')) {
      console.error('Invalid input:', { payment_method, amount, seller_account_id, return_url, table_number });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid input. Please provide a valid payment method, amount, seller account ID, and return URL.' }),
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
    console.log('Table Number:', table_number); 

    // Create payment intent
    const paymentIntentData = {
      amount: parsedAmount,
      currency: 'eur',
      receipt_email, // Use provided email
      payment_method,
      confirmation_method: 'automatic',
      metadata: {
        table_number: table_number, // Store table number
        // Add any other custom fields you want
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