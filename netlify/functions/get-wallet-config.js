// netlify/functions/get-wallet-config.js

exports.handler = async (event, context) => {
    try {
        const response = await fetch('https://merchant-ui-api.stripe.com/elements/wallet-config');
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
