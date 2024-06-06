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
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid input. Please provide valid payment method, amount, seller account ID, and return URL.' }),
            };
        }

        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'eur',
            payment_method: payment_method,
            confirm: true,
            confirmation_method: 'manual',
            stripeAccount: seller_account_id, // Seller's account ID
            return_url: return_url, // URL to which the customer will be redirected after payment
            receipt_email: 'forbiddenplaces96@gmail.com',
        });

        // Log payment details for monitoring and debugging
        console.log('Payment Method:', payment_method);
        console.log('Amount:', amount);
        console.log('Seller Account ID:', seller_account_id);

        // Return a success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Payment processed successfully.', paymentIntent: paymentIntent }),
        };
    } catch (error) {
        // Log and return an error response if any error occurs
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred while processing the payment.' }),
        };
    }
};
