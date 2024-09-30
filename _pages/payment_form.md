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
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }

    .tick-icon {
      display: inline-block;
      width: 18px;
      height: 18px;
      background-color: #6699ff;
      mask: url('/assets/images/circle-outline-of-small-size.png') no-repeat center / contain;
    }

    .item-container {
      display: flex;
      align-items: center;
    }

    .wrap {
      max-width: 1000px;
      margin-left: auto;
      margin-right: auto;
    }

    .container-master {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .sub-container {
      margin: 50px 0 20px;
      padding: 36px 50px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .container-line {
        display: flex;
        justify-content: space-between;
        width: 100%;
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

    .stripe-element {
      width: 100%;
      margin-bottom: 35px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-sizing: border-box;
    }

    .stripe-element-50 {
      width: 50%;
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

    .inline-elements{
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .inline-labels {
      display: flex;
      gap: 68px;
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

<div class="wrap">

<h2 style="margin-top: 3em;">Elige un método de pago</h2>
<p>Introduce los datos de la tarjeta con la que quieras realizar los pagos de tu plan</p>

<div class="container-master">
  <div class="container">
    <div class="sub-container" style="width: 32em;">
      <div class="item-container">
        <span class="tick-icon"></span>
        <h3 style="margin-left: 0.5em;">Tarjeta de crédito</h3>
      </div>
      <h6 style="font-weight: normal;margin-bottom: 3em;margin-left: 2.5em;">Mastercard, Visa, Maestro, American Express, ...</h6>
      <hr>

      <label for="card-number-element" class="element-label" style="margin-top: 2em;">Número de Tarjeta</label>
      <div id="card-number-element" class="stripe-element"></div>

      <div class="inline-labels">
        <label for="card-expiry-element" class="element-label">Fecha de Expiración</label>
        <label for="card-cvc-element" class="element-label">Código de Seguridad</label>
      </div>

      <div class="inline-elements">
        <div id="card-expiry-element" class="stripe-element-50"></div>
        <div id="card-cvc-element" class="stripe-element-50"></div>
      </div>
    </div>

    <button id="card-button" type="submit">
      <span id="button-text">Realizar pago</span>
      <div class="progress-circle"></div>
    </button>
  </div>

  <div class="sub-container" style="background-color: #e7e7e7;padding: 30px;">
    <h4>Resumen</h4>
    <p class="plan"></p>
    <p>Duración: <b>1 mes</b></p>
    <p>Próxima renovación automática: <b>00/00/2024</b></p>

    <hr>

    <div class="container-line">
      <p class="plan"></p>
      <p class="price"></p>
    </div>

    <div class="container-line">
      <p>Descuento</p>
      <p>0€</p>
    </div>

    <hr>

    <div class="container-line">
      <h4 style="color: #6699ff;">Total</h4>
      <h4 style="color: #6699ff;" class="price"></h4>
    </div>
  </div>
</div>
</div>

<script>
  // Retrieve the plan from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const plan = urlParams.get('plan'); // Example: 'Pro'
  
  // Price object based on the plan
  const prices = {
    Gratis: '0€',
    Pro: '30€',
    Premium: '50€'
  };

  // Update all elements with the class "price"
  document.querySelectorAll('.price').forEach(function(el) {
    el.textContent = prices[plan];
  });

  // Update all elements with the class "plan"
  document.querySelectorAll('.plan').forEach(function(el) {
    el.textContent = plan ? plan : 'Ningún plan seleccionado';
  });

  var stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');
  var elements = stripe.elements();

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
    cardButton.disabled = true; // Disable button on click

    // Use Netlify Identity to get user data
    var user = netlifyIdentity && netlifyIdentity.currentUser();
    if (!user) {
      progressCircle.style.display = 'none';
      document.getElementById('button-text').style.display = 'inline-block';
      cardButton.disabled = false; // Re-enable button if not logged in
      alert('Por favor, inicia sesión para continuar con el pago.');
      return;
    }

    var userEmail = user.email;
    var userName = user.user_metadata && user.user_metadata.full_name ? user.user_metadata.full_name : '';

    var paymentMethod = 'card';
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

    stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
      billing_details: {
        name: userName,
      },
    }).then(function(result) {
      if (result.error) {
        console.error(result.error.message);
        alert('Error al crear método de pago: ' + result.error.message);
        progressCircle.style.display = 'none';
        document.getElementById('button-text').style.display = 'inline-block';
        cardButton.disabled = false; // Re-enable button on error
      } else {
        console.log('Método de pago creado exitosamente');
        progressCircle.style.display = 'none';
        document.getElementById('button-text').style.display = 'inline-block';
        // Proceed with Stripe payment or subscription
      }
    });
  });
</script>

</body>
</html>
