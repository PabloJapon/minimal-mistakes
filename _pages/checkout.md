---
title: "Checkout"
permalink: /checkout/
---

# Checkout

<!-- Include Stripe.js -->
<script src="https://js.stripe.com/v3/"></script>

<!-- HTML content for the checkout form -->
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

<!-- JavaScript code for handling Stripe Elements and form submission -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Set up Stripe.js with your publishable key
  const stripe = Stripe('YOUR_PUBLISHABLE_KEY');

  // Create an instance of the card Element
  const elements = stripe.elements();
  const cardElement = elements.create('card');

  // Add the card Element to the form
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

  // Display selected plan dynamically
  const urlParams = new URLSearchParams(window.location.search);
  const plan = urlParams.get('plan');
  if (plan) {
    const selectedPlanElement = document.getElementById('selected-plan');
    selectedPlanElement.innerHTML = `<h3>Plan Seleccionado: ${plan}</h3>`;
  }
});
</script>

<!-- Custom CSS to style the form -->
<style>
/* Add your custom CSS styles here */
</style>
