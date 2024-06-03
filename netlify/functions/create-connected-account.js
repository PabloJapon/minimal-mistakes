// create-connected-account.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const { email, business_name } = JSON.parse(event.body);

    if (!email || !business_name) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Email and business name are required' })
        };
    }

    try {
        // Create the Express account
        const account = await stripe.accounts.create({
            type: 'express',
            email: email,
            business_profile: {
                name: business_name,
                url: 'https://your-platform-url.com'
            },
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true }
            }
        });

        console.log('Created account:', account);

        // Create the Account Link
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: 'https://your-platform-url.com/reauth',
            return_url: 'https://your-platform-url.com/return',
            type: 'account_onboarding'
        });

        console.log('Created account link:', accountLink);

        return {
            statusCode: 200,
            body: JSON.stringify({ url: accountLink.url })
        };
    } catch (error) {
        console.error('Error creating connected account:', error);

        return {
            statusCode: error.statusCode || 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
