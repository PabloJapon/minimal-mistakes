---
title: "Checkout"
permalink: /checkout/
---

<script>
document.addEventListener('DOMContentLoaded', async function() {
  console.log('Checkout page loaded');

  try {
    const response = await fetch('/.netlify/functions/get-wallet-config');
    const data = await response.json();

    // Use data returned by the server (wallet config) here
    console.log('Wallet config:', data);
  } catch (error) {
    console.error('Error fetching wallet config:', error);
  }
});
</script>

# Checkout

<div class="page__content">
  <h2>Complete el formulario y proceda al pago:</h2>
  
  <!-- Selected Plan Section -->
  <div id="selected-plan"></div>
  
  <!-- Payment Form -->
  <form id="payment-form">
    <div>
      <label for="name">Nombre:</label>
      <input type="text" id="name" name="name" required>
    </div>
    <div>
      <label for="email">Correo Electrónico:</label>
      <input type="email" id="email" name="email" required>
    </div>
    <div>
      <label for="card-element">Información de la Tarjeta:</label>
      <div id="card-element"></div>
    </div>
    
    <button type="submit">Pagar Ahora</button>
  </form>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  console.log('Checkout page loaded');
  
  // Get the Stripe publishable key from environment variable
  const stripePublishableKey = '{{ site.stripe_publishable_key }}';

  // Set up Stripe.js with the publishable key
  const stripe = Stripe(stripePublishableKey);

  // Create an instance of Elements
  const elements = stripe.elements();

  // Create an instance of the card Element
  const cardElement = elements.create('card', {
    style: {
      base: {
        fontSize: '16px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        color: '#32325d',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  });

  // Add an instance of the card Element into the `card-element` div
  cardElement.mount('#card-element');

  // Handle form submission
  const form = document.getElementById('payment-form');
  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Retrieve user input from the form
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    // Create payment method using card element
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: name,
        email: email
      }
    });

    if (error) {
      console.error('Error creating payment method:', error);
    } else {
      console.log('Payment method created:', paymentMethod);
      
      // Send payment method to serverless function for processing
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 1000, // amount in cents
          currency: 'usd',
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Client secret:', data.clientSecret);
        
        // Use client secret to confirm payment (optional)
      } else {
        console.error('Failed to create payment intent:', response.statusText);
      }
    }
  });

  // Display selected plan dynamically
  const urlParams = new URLSearchParams(window.location.search);
  const plan = urlParams.get('plan');
  if (plan) {
    const selectedPlanElement = document.getElementById('selected-plan');
    selectedPlanElement.innerHTML = `<h3>Plan Seleccionado: ${plan}</h3>`;
  }
});
</script>

<style>
  /* Custom CSS to style the form */
  .page__content {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  label {
    display: block;
    margin-bottom: 10px;
  }

  input[type="text"],
  input[type="email"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  #card-element {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button[type="submit"] {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button {
    /* Add custom styles for button */
  }
</style>
