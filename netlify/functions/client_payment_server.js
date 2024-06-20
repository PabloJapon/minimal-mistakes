const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Error: Stripe secret key is missing!');
} else {
  console.log('Stripe secret key:', stripeSecretKey);
}
const stripe = require('stripe')(stripeSecretKey);

exports.handler = async (event, context) => {
    try {
        const { payment_method, amount, seller_account_id, return_url } = JSON.parse(event.body);

        if (!payment_method || !amount || isNaN(amount) || amount <= 0 || !seller_account_id || !return_url) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input. Please provide valid payment method, amount, seller account ID, and return URL.' }),
            };
        }

        const parsedAmount = parseInt(amount);
        if (isNaN(parsedAmount)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid amount. Please provide a valid amount.' }),
            };
        }

        console.log('Received payment method:', payment_method);
        console.log('Received amount:', parsedAmount);
        console.log('Received seller account ID:', seller_account_id);
        console.log('Received return URL:', return_url);

        const paymentIntentData = {
            amount: parsedAmount,
            currency: 'eur',
            payment_method: payment_method,
            confirm: true,
            confirmation_method: 'manual',
            stripeAccount: seller_account_id,
            return_url: return_url,
            receipt_email: 'forbiddenplaces96@gmail.com',
        };
        console.log('Payment Intent Payload:', paymentIntentData);

        const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

        console.log('Payment Intent created:', paymentIntent);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Payment processed successfully.', paymentIntent: paymentIntent }),
        };
    } catch (error) {
        console.error('Error details:', error.raw ? error.raw : error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred while processing the payment.', details: error.raw ? error.raw : error }),
        };
    }
};
