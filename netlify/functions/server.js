const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Error: Stripe secret key is missing!');
} else {
  console.log('Stripe secret key:', stripeSecretKey);
}

const stripe = require('stripe')(stripeSecretKey);

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    // Check if user exists with the provided email
    const existingCustomer = await stripe.customers.list({ email: body.email, limit: 1 });

    let customerId;

    if (existingCustomer.data.length > 0) {
      // If customer exists, use existing customer ID
      customerId = existingCustomer.data[0].id;
    } else {
      // If customer doesn't exist, create a new customer
      const customer = await stripe.customers.create({
        email: body.email,
        name: body.name,
        payment_method: body.payment_method,
        invoice_settings: {
          default_payment_method: body.payment_method
        }
      });

      customerId = customer.id;
    }

    // Create a subscription for the customer using the customer ID
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: body.priceId }]
    });

    // Subscription created successfully
    return {
      statusCode: 200,
      body: JSON.stringify({ subscription })
    };
  } catch (error) {
    // Handle errors
    console.error('Error creating subscription:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create subscription' })
    };
  }
};
