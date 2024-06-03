const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
    try {
        const { email, business_name } = JSON.parse(event.body);

        // Create the connected account
        const account = await stripe.accounts.create({
            type: 'express',
            email: email,
            business_profile: {
                name: business_name,
            },
        });

        // Return the account ID or any other information you need
        return {
            statusCode: 200,
            body: JSON.stringify({ account }),
        };
    } catch (error) {
        console.error('Error creating connected account:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
