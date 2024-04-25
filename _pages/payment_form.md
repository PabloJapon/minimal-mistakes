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

    input[type="text"],
    input[type="email"],
    button {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-sizing: border-box;
    }

    button {
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

    /* Estilo personalizado para los elementos de Stripe */
    .stripe-element {
      width: 100%; /* Establecer el ancho para ocupar el 100% del contenedor */
      margin-bottom: 15px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-sizing: border-box;
    }
    .stripe-element-50 {
      width: 50%; /* Establecer el ancho para ocupar el 50% del contenedor */
      margin-bottom: 15px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-sizing: border-box;
    }

    .element-label {
      font-weight: bold;
      margin-bottom: 5px;
      font-size: 14px; /* Ajustar el tamaño de fuente de las etiquetas */
    }

    .inline-elements{
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .inline-labels {
      display: flex;
      align-items: center;
      gap: 49px;
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

  <label for="card-number-element" class="element-label">Número de Tarjeta</label>
  <div id="card-number-element" class="stripe-element"></div>

  <div class="inline-labels">
    <label for="card-expiry-element" class="element-label">Fecha de Expiración</label>
    <label for="card-cvc-element" class="element-label">Código de Seguridad</label>
  </div>

  <div class="inline-elements">
    <div id="card-expiry-element" class="stripe-element-50"></div>
    <div id="card-cvc-element" class="stripe-element-50"></div>
  </div>

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
    width: 40px;
    height: 40px;
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
    basico: '$0',
    estandar: '$30',
    premium: '$50'
  };

  // Display the price of the selected plan
  document.getElementById('price').textContent = "Precio: " + prices[plan];
  
</script>


<script>
  var stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');
  var elements = stripe.elements();

  // Estilo personalizado para los elementos de Stripe
  var style = {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
    },
  };

  var cardNumberElement = elements.create('cardNumber', { style: style });
  cardNumberElement.mount('#card-number-element');

  var cardExpiryElement = elements.create('cardExpiry', { style: style });
  cardExpiryElement.mount('#card-expiry-element');

  var cardCvcElement = elements.create('cardCvc', { style: style });
  cardCvcElement.mount('#card-cvc-element');

  var cardButton = document.getElementById('card-button');
  var progressCircle = document.querySelector('.progress-circle');

  cardButton.addEventListener('click', function(ev) {
    ev.preventDefault();

    // Show the progress circle and hide the button text
    progressCircle.style.display = 'block';
    document.getElementById('button-text').style.display = 'none';

    // Usar Netlify Identity para obtener los datos del usuario
    var user = netlifyIdentity && netlifyIdentity.currentUser();
    if (!user) {
      // Si el usuario no ha iniciado sesión, pedirle que inicie sesión
      alert('Por favor, inicia sesión para continuar con el pago.');
      return;
    }

    // Obtener el correo electrónico y el nombre del usuario
    var userEmail = user.email;
    var userName = user.user_metadata && user.user_metadata.full_name ? user.user_metadata.full_name : '';

    // Si el usuario ha iniciado sesión, proceder con el pago
    var paymentMethod = 'card'; // Utilizar tarjeta como método de pago
    var priceId;
    switch (plan) {
      case 'basico':
        priceId = 'price_1On5B9E2UvP4xcDsTat7ZHhV';
        break;
      case 'estandar':
        priceId = 'price_1On33zE2UvP4xcDsDD9jPJzw';
        break;
      case 'premium':
        priceId = 'price_1On5CAE2UvP4xcDso6epRdMs';
        break;
      default:
        console.error('Unsupported plan or no plan specified');
        return; // Exit early if plan is unsupported
    }
    
    // Crear método de pago con Stripe
    stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
      billing_details: {
        name: userName,
      },
    }).then(function(result) {
      if (result.error) {
        // Error al crear método de pago
        console.error(result.error.message);
        alert('Error al crear método de pago: ' + result.error.message);
      } else {
        // Método de pago creado con éxito, proceder con el pago
        var paymentMethodId = result.paymentMethod.id;
        
        // Hacer solicitud AJAX al punto final de la Función de Netlify
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
          if (!response.ok) {
            throw new Error('Error al crear suscripción');
          }
          return response.json();
        })
        .then(data => {
          // Manejar la creación exitosa de la suscripción
          alert('¡Suscripción creada con éxito!');
        })
        .catch(error => {
          // Manejar errores
          console.error('Error al crear suscripción:', error);
          alert('Error al crear suscripción. Por favor, inténtalo de nuevo más tarde.');
        });
      }
    });
  });
</script>

</body>
</html>
