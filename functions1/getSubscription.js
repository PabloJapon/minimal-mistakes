// functions/getSubscription.js

// Import the Stripe SDK
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Handler function for the serverless function
exports.handler = async (event) => {
  console.log('Function invoked with event:', event);

  // Parse the incoming request body as JSON
  const requestBody = JSON.parse(event.body);
  console.log('Request body:', requestBody);

  try {
    // Retrieve the customer ID from the request body
    const customerId = requestBody.customerId;
    console.log('Customer ID:', customerId);

    // Retrieve the customer's subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1, // Limit to one active subscription
    });
    console.log('Subscriptions:', subscriptions);

    // If the customer has an active subscription, return the plan name
    if (subscriptions && subscriptions.data && subscriptions.data.length > 0) {
      const planName = subscriptions.data[0].plan.nickname; // Change 'nickname' to the appropriate field containing the plan name
      console.log('Plan name:', planName);
      return {
        statusCode: 200,
        body: JSON.stringify({ planName }),
      };
    } else {
      // If the customer does not have an active subscription, return an error
      console.log('No active subscription found');
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No active subscription found' }),
      };
    }
  } catch (error) {
    // If an error occurs, return an error response
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

