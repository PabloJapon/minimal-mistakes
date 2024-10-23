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
          <h3 style="margin-left: 0.5em;">Método de Pago</h3>
        </div>
        <h6 style="font-weight: normal;margin-bottom: 3em;margin-left: 2.5em;">Selecciona el método de pago deseado</h6>
        <hr>

        <!-- This is where the Payment Element will be mounted -->
        <div id="payment-element" class="stripe-element"></div>
      </div>

      <button id="card-button" type="submit">
        <span id="button-text">Realizar pago</span>
        <div class="progress-circle"></div>
      </button>

    </div>

    <div class="sub-container" style="background-color: #e7e7e7;padding: 30px;">
      <h4>Resumen</h4>
      <p>Plan: <b><span class="plan"></span></b></p>
      <p>Duración: <b>1 mes</b></p>
      <p>Próxima renovación automática: <b>00/00/2024</b></p>

      <hr>

      <div class="container-line">
        <p>Plan <span class="plan"></span></p>
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
  // Initialize Stripe with your publishable API key
  const stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo'); // Ensure correct publishable key
  const elements = stripe.elements();

  // Extract the plan from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const plan = urlParams.get('plan');
  console.log('Plan extracted from URL:', plan); // Debug log for plan

  // Fetch clientSecret from your backend
  fetch('/.netlify/functions/server', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'create_payment_intent',
      plan: plan
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Response from payment server:', data); // Log server response

    if (data.error) {
      alert('Error en el servidor: ' + data.error);
    } else {
      const clientSecret = data.clientSecret;
      console.log('Client secret received:', clientSecret); // Log client secret

      // Create and mount the payment element
      const paymentElement = elements.create('payment');
      paymentElement.mount('#payment-element');
      console.log('Payment element mounted successfully.'); // Confirm payment element mount
    }
  })
  .catch(err => {
    console.error('Error en la solicitud:', err);
    alert('Error al comunicarse con el servidor');
  });

  // Handle payment button click
  const cardButton = document.getElementById('card-button');
  const progressCircle = document.getElementById('progress-circle');

  cardButton.addEventListener('click', function (ev) {
    ev.preventDefault();
    console.log('Payment button clicked.'); // Log button click event

    progressCircle.style.display = 'block';
    document.getElementById('button-text').style.display = 'none';
    cardButton.disabled = true; // Disable button on click

    var user = netlifyIdentity && netlifyIdentity.currentUser();
    if (!user) {
      console.log('User not logged in.'); // Log user state
      progressCircle.style.display = 'none';
      document.getElementById('button-text').style.display = 'inline-block';
      cardButton.disabled = false;
      alert('Por favor, inicia sesión para continuar con el pago.');
      return;
    }

    // Confirm the payment
    stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href, // Optionally, handle the result on the backend
      },
    }).then(function (result) {
      console.log('Payment confirmation result:', result); // Log the result of payment confirmation

      if (result.error) {
        alert('Error al confirmar el pago: ' + result.error.message);
        progressCircle.style.display = 'none';
        document.getElementById('button-text').style.display = 'inline-block';
        cardButton.disabled = false;
      } else {
        alert('Pago exitoso');
        progressCircle.style.display = 'none';
        document.getElementById('button-text').style.display = 'inline-block';
        cardButton.disabled = false;
      }
    });
  });
</script>
</body>
</html>
