---
title: "Checkout"
permalink: /checkout/
---

# Checkout

<div class="page__content">
  <h2>Complete el formulario y proceda al pago:</h2>
  
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
  
  // Set up Stripe.js with your publishable key
  const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');

  // Create an instance of Elements
  const elements = stripe.elements();

  // Create an instance of the card Element
  const cardElement = elements.create('card');

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
      
      // TODO: Send payment method to your server to process payment
      // For now, you can display a success message or redirect to a success page
      alert('Pago exitoso. Redirigiendo a página de éxito...');
      window.location.href = '/pago-exitoso';
    }
  });
});
</script>
