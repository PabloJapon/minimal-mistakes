const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Error: Stripe secret key is missing!');
} else {
  console.log('Stripe secret key:', stripeSecretKey);
}
const stripe = require('stripe')(stripeSecretKey);

exports.handler = async (event, context) => {
  try {
    // Parse the incoming request body
    const { payment_method, amount, seller_account_id, return_url } = JSON.parse(event.body);
    
    // Validate input
    if (!payment_method || !amount || isNaN(amount) || amount <= 0 || !seller_account_id || !return_url) {
      console.error('Invalid input:', { payment_method, amount, seller_account_id, return_url });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid input. Please provide valid payment method, amount, seller account ID, and return URL.' }),
      };
    }

    // Ensure amount is an integer
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount)) {
      console.error('Invalid amount:', amount);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount. Please provide a valid amount.' }),
      };
    }

    // Log input parameters
    console.log('Received payment method:', payment_method);
    console.log('Received amount:', parsedAmount);
    console.log('Received seller account ID:', seller_account_id);
    console.log('Received return URL:', return_url);

    // Log payload to be sent to Stripe
    const paymentIntentData = {
      amount: parsedAmount,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      confirm: true,
      confirmation_method: 'manual',
      return_url: return_url,
      receipt_email: 'forbiddenplaces96@gmail.com',
    };
    console.log('Payment Intent Payload:', paymentIntentData);

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData, {
      stripeAccount: seller_account_id
    });

    // Log payment intent details for monitoring and debugging
    console.log('Payment Intent created:', paymentIntent);

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Payment processed successfully.', paymentIntent: paymentIntent }),
    };
  } catch (error) {
    // Log and return an error response if any error occurs
    console.error('Error creating payment intent:', error);

    // Extract and log specific error details if available
    if (error.raw && error.raw.message) {
      console.error('Stripe Error:', error.raw.message);
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while processing the payment.', details: error.raw ? error.raw.message : error.message }),
    };
  }
};
