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
      margin: 50px auto;
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

    .element-label {
      font-weight: bold;
      margin-bottom: 5px;
      font-size: 14px;
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
      display: none;
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

  // Stripe initialization
  var stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');
  var elements = stripe.elements();

  // Payment Element
  var paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');

  var cardButton = document.getElementById('card-button');
  var progressCircle = document.querySelector('.progress-circle');

  cardButton.addEventListener('click', function(ev) {
    ev.preventDefault();

    // Show the progress circle and hide the button text
    progressCircle.style.display = 'block';
    document.getElementById('button-text').style.display = 'none';

    // Use Netlify Identity to get user data
    var user = netlifyIdentity && netlifyIdentity.currentUser();
    if (!user) {
      progressCircle.style.display = 'none';
      document.getElementById('button-text').style.display = 'inline-block';
      // Prompt user to log in if not logged in
      alert('Por favor, inicia sesión para continuar con el pago.');
      return;
    }

    // Get user email and name
    var userEmail = user.email;
    var userName = user.user_metadata && user.user_metadata.full_name ? user.user_metadata.full_name : '';

    // Determine price ID based on plan
    var priceId;
    switch (plan) {
      case 'Gratis':
        priceId = 'price_1On5B9E2UvP4xcDsTat7ZHhV';
        break;
      case 'Pro':
        priceId = 'price_1On33zE2UvP4xcDsDD9jPJzw';
        break;
      case 'Premium':
        priceId = 'price_1On5CAE2UvP4xcDso6epRdMs';
        break;
      default:
        console.error('Unsupported plan or no plan specified');
        return;
    }

    // Create payment method with Stripe
    stripe.createPaymentMethod({
      type: 'card',
      card: paymentElement,
      billing_details: {
        name: userName,
      },
    }).then(function(result) {
      if (result.error) {
        console.error(result.error.message);
        alert('Error al crear método de pago: ' + result.error.message);
      } else {
        var paymentMethodId = result.paymentMethod.id;
        
        fetch('https://gastrali.netlify.app/.netlify/functions/server', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: userEmail,
            name: userName,
            payment_method: paymentMethodId,
            priceId: priceId
          })
        })
        .then(response => {
          progressCircle.style.display = 'none';
          document.getElementById('button-text').style.display = 'inline-block';

          return response.json().then(data => {
            if (response.status === 400) {
              alert('Error al crear suscripción. El cliente ya tiene una suscripción activa.');
            } else if (response.status === 500) {
              alert('Error al crear suscripción. Error interno del servidor. Por favor, inténtalo de nuevo más tarde.');
            } else if (response.ok) {
              user.update({
                data: { subscription_plan: plan }
              }).then(updatedUser => {
                alert('¡Suscripción creada con éxito!');
              }).catch(error => {
                console.error('Error updating user metadata:', error);
              });
            }
          });
        })
        .catch(error => {
          console.error('Error inesperado al crear suscripción:', error);
        });
      }
    });
  });
</script>

</body>
</html>
