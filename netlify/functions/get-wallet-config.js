// netlify/functions/get-wallet-config.js

exports.handler = async (event, context) => {
    try {
        const response = await fetch('https://merchant-ui-api.stripe.com/elements/wallet-config', {
            headers: {
                'Authorization': 'Bearer pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo' // Replace 'YOUR_PUBLISHABLE_KEY' with your actual Stripe publishable key
            }
        });
        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
