const express = require('express');
const app = express();
const stripe = require('stripe')('process.env.STRIPE_SECRET_KEY');

// Middleware to parse JSON bodies
app.use(express.json());

// Route to create a subscription
app.post('/create-subscription', async (req, res) => {
  try {
    // Create a customer
    const customer = await stripe.customers.create({
      email: req.body.email,
      payment_method: req.body.payment_method,
      invoice_settings: {
        default_payment_method: req.body.payment_method
      }
    });

    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: req.body.priceId }]
    });

    // Subscription created successfully
    res.status(200).json({ subscription });
  } catch (error) {
    // Handle errors
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
