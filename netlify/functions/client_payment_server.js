const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

exports.createPaymentIntent = async (event, context) => {
  try {
    const { payment_method, amount, seller_account_id, receipt_email, id_customer } = JSON.parse(event.body);

    if (!payment_method || !amount || isNaN(amount) || amount <= 0 || !seller_account_id || !payment_method.startsWith('pm_') || !id_customer) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid input. Provide valid payment details.' }),
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount, 10),
      currency: 'eur',
      payment_method,
      confirmation_method: 'manual',
      receipt_email: receipt_email,
      description: `Payment for customer ${id_customer}`,
      confirm: true,
      transfer_data: {
        destination: seller_account_id,
      },
    });

    console.log('Payment Intent Client Secret:', paymentIntent.client_secret); // For debugging

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Payment processed successfully. Waiting for confirmation...',
        clientSecret: paymentIntent.client_secret, // Send this to the frontend
      }),
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process payment. ' + error.message }),
    };
  }
};
