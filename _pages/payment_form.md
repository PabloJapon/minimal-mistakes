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

<style>
  /* Circular progress animation */
  .progress-button {
    position: relative;
    overflow: hidden;
    background: none;
    border: none;
  }
  /* Adjust the progress circle styles */
  .progress-circle {
    position: relative; /* Set position to relative */
    top: -50%; /* Position vertically at -50% */
    left: 50%; /* Position horizontally at 50% */
    transform: translateX(-50%); /* Center horizontally */
    border: 2px solid transparent; /* Transparent border */
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    display: none; /* Initially hidden */
  }

  @keyframes spin {
    0% { border-color: transparent transparent transparent #fff; }
    25% { border-color: #fff transparent transparent transparent; }
    50% { border-color: transparent #fff transparent transparent; }
    75% { border-color: transparent transparent #fff transparent; }
    100% { border-color: transparent transparent transparent #fff; }
  }
</style>

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

  var cardButton = document.getElementById('card-button');
  var progressCircle = document.querySelector('.progress-circle');

  // Fetch the client secret from the server
  fetch('/.netlify/functions/server', {
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
  }).then(response => {
    return response.json();
  }).then(data => {
    const clientSecret = data.clientSecret;

    // Opciones para el diseño del acordeón
    const options = {
      layout: {
        type: 'accordion',
        defaultCollapsed: false,
        radios: true,
        spacedAccordionItems: false
      }
    };

    var elements = stripe.elements({ clientSecret });
    var paymentElement = elements.create('payment', options);
    paymentElement.mount('#payment-element');

    cardButton.addEventListener('click', function(ev) {
      ev.preventDefault();

      // Show the progress circle and hide the button text
      progressCircle.style.display = 'block';
      document.getElementById('button-text').style.display = 'none';

      var user = netlifyIdentity && netlifyIdentity.currentUser();
      if (!user) {
        progressCircle.style.display = 'none';
        document.getElementById('button-text').style.display = 'inline-block';
        alert('Por favor, inicia sesión para continuar con el pago.');
        return;
      }

      var userEmail = user.email;
      var userName = user.user_metadata && user.user_metadata.full_name ? user.user_metadata.full_name : '';

      stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: 'https://your-website.com/confirmation',
          payment_method_data: {
            billing_details: {
              name: userName,
              email: userEmail
            }
          }
        }
      }).then(function(result) {
        if (result.error) {
          console.error(result.error.message);
          alert('Error al crear método de pago: ' + result.error.message);
          progressCircle.style.display = 'none';
          document.getElementById('button-text').style.display = 'inline-block';
        } else {
          fetch('https://gastrali.netlify.app/.netlify/functions/server', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: userEmail,
              name: userName,
              payment_method: result.paymentIntent.payment_method,
              priceId: data.priceId
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
                alert('Error al crear suscripción. El cliente ya tiene una suscripción activa.');
              } else if (response.status === 500) {
                // If server.js returns a status code 500
                console.log('Server returned status 500');
                alert('Error al crear suscripción. Error interno del servidor. Por favor, inténtalo de nuevo más tarde.');
              } else if (response.ok) {
                // If server.js returns a success message or other data
                console.log('Server response:', data);
                // Update user metadata with subscription plan
                console.log('User:', user);
                user.update({
                  data: { subscription_plan: plan }
                }).then(updatedUser => {
                  console.log('User metadata updated successfully:', updatedUser);
                  alert('¡Suscripción creada con éxito!');
                }).catch(error => {
                  console.error('Error updating user metadata:', error);
                });
              }
            });
          })
        }
      });
    });
  });
</script>

</body>
</html>
