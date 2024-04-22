// functions1/webhook.js

// Handler function for the webhook endpoint
exports.handler = async (event) => {
  // Parse the incoming event body as JSON
  const data = JSON.parse(event.body);
  
  // Check if the event type is checkout.session.completed
  if (data.type === 'checkout.session.completed') {
    // Extract relevant information from the event
    const sessionId = data.data.object.id;
    const userId = data.data.object.client_reference_id; // Assuming you stored the Netlify Identity ID as the client reference ID during checkout
  
    // Extract plan information from the event, e.g., data.data.object.display_items[0].plan.nickname
    
    // Update user metadata with the subscribed plan information
    // Use Netlify Identity API to update user metadata
  
    // Log the event and processed data
    console.log('Checkout session completed:', sessionId);
    console.log('User ID:', userId);
    console.log('Subscribed plan:', subscribedPlan);
  }
  
  // Return a success response
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Webhook received and processed' }),
  };
};
