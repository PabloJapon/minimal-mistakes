---
layout: default
permalink: /payment_form/
---

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Introduzca sus datos de pago</title>
  <script src="https://js.stripe.com/v3/"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 400px;
      margin: 50px auto; /* Ajustar margen según sea necesario */
      padding: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
      text-align: center;
      color: #333;
    }

    button {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #6699ff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #0056b3;
    }

    .stripe-element {
      width: 100%;
      margin-bottom: 15px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-sizing: border-box;
    }

    .progress-button {
      position: relative;
      overflow: hidden;
      background: none;
      border: none;
    }

    .progress-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 2px solid #ccc;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      display: none; /* Initially hidden */
    }

    @keyframes spin {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
  </style>
</head>
<body>

<div class="container">
  <h1>Introduzca sus datos de pago</h1>
  <p id="plan"></p>
  
  <!-- Display the price of the selected plan -->
  <p id="price"></p>

  <div id="payment-element" class="stripe-element"></div>

  <button id="card-button" type="submit">
    <span id="button-text">Pagar Ahora</span>
    <div class="progress-circle"></div>
  </button>
</div>

<script>
  // Retrieve plan from URL
  const urlParams = new URLSearchParams(window.location.search);
  const plan = urlParams.get('plan');
  document.getElementById('plan').textContent = "Plan: " + plan;

  // Define the price for each plan
  const prices = {
    Gratis: '$0',
    Pro: '$30',
    Premium: '$50'
  };

  // Display the price of the selected plan
  document.getElementById('price').textContent = "Precio: " + prices[plan];

  var stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');
  var elements = stripe.elements();

  // Create payment element
  var paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');

  var cardButton = document.getElementById('card-button');
  var progressCircle = document.querySelector('.progress-circle');

  cardButton.addEventListener('click', function(ev) {
    ev.preventDefault();

    // Show the progress circle and hide the button text
    progressCircle.style.display = 'block';
    document.getElementById('button-text').style.display = 'none';

    // Make AJAX request to Netlify Function endpoint
    fetch('https://gastrali.netlify.app/.netlify/functions/server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        plan: plan,
        payment_method: 'card', // Use card as the payment method
        payment_element: paymentElement
      })
    })
    .then(response => {
      // Hide the progress circle and show the button text
      progressCircle.style.display = 'none';
      document.getElementById('button-text').style.display = 'inline-block';

      // Parse JSON response
      return response.json().then(data => {
        console.log('Response status data:', response.status);
        // Handle the response from server.js
        if (response.status === 400) {
          // If server.js returns a status code 400
          console.log('Server returned status 400');
          alert('Error creating subscription. The customer already has an active subscription.');
        } else if (response.status === 500) {
          // If server.js returns a status code 500
          console.log('Server returned status 500');
          alert('Error creating subscription. Internal server error. Please try again later.');
        } else if (response.ok) {
          // If server.js returns a success message or other data
          console.log('Server response:', data);
          alert('Subscription created successfully!');
        }
      });
    })
    .catch(error => {
      // Handle other errors
      console.error('Unexpected error creating subscription:', error);
    });
  });
</script>

</body>
</html>
