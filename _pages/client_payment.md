---
layout: default
permalink: /client_payment/
---

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enter Payment Details</title>
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
  
  <!-- Hidden input for the seller account ID -->
  <input type="hidden" id="seller-account-id" value="acct_1PNXgvE7aK3gOt9K">

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
  var stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');
  var elements = stripe.elements();

  var cardNumber = elements.create('cardNumber');
  cardNumber.mount('#card-number');

  var cardExpiry = elements.create('cardExpiry');
  cardExpiry.mount('#card-expiry');

  var cardCvc = elements.create('cardCvc');
  cardCvc.mount('#card-cvc');

  var payButton = document.getElementById('pay-button');

  payButton.addEventListener('click', function() {
    stripe.createPaymentMethod({
      type: 'card',
      card: cardNumber,
    }).then(function(result) {
      if (result.error) {
        console.error(result.error.message);
        alert('Error: ' + result.error.message);
      } else {
        // Send payment method and amount to server
        var paymentMethod = result.paymentMethod.id;
        var amount = 5000; // Fixed amount of €50 in cents
        var sellerAccountId = document.getElementById('seller-account-id').value;

        fetch('/client_payment_server', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_method: paymentMethod,
            amount: amount,
            seller_account_id: sellerAccountId
          }),
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          console.log(data);
          alert(data.message);
        }).catch(function(error) {
          console.error('Error:', error);
          alert('Error processing payment. Please try again later.');
        });
      }
    });
  });
</script>

</body>
</html>
