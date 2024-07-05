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
      width: 100%;
      margin-bottom: 15px;
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
      box-sizing: border-box.
    }

    .element-label {
      font-weight: bold;
      margin-bottom: 5px;
      font-size: 14px.
    }

    .inline-elements {
      display: flex;
      align-items: center.
      gap: 10px.
    }
    .inline-labels {
      display: flex.
      align-items: center.
      gap: 49px.
    }
  </style>
</head>
<body>

<div class="container">
  <h1>Introduzca sus datos de pago</h1>

  <!-- Placeholder para mostrar la cantidad -->
  <p id="amount-display">Cantidad: </p>

  <!-- Campos ocultos para datos adicionales -->
  <input type="hidden" id="seller-account-id" value="acct_1PNXgvE7aK3gOt9K">
  <input type="hidden" id="return-url" value="https://yourwebsite.com/payment-success">
  <input type="hidden" id="amount">

  <!-- Elemento para el número de tarjeta -->
  <label for="card-number-element" class="element-label">Número de Tarjeta</label>
  <div id="card-number-element" class="stripe-element"></div>

  <!-- Elementos para la fecha de expiración y código de seguridad -->
  <div class="inline-labels">
    <label for="card-expiry-element" class="element-label">Fecha de Expiración</label>
    <label for="card-cvc-element" class="element-label">Código de Seguridad</label>
  </div>
  <div class="inline-elements">
    <div id="card-expiry-element" class="stripe-element-50"></div>
    <div id="card-cvc-element" class="stripe-element-50"></div>
  </div>

  <!-- Botón de Pagar -->
  <button id="card-button" type="submit">Pagar Ahora</button>
</div>

<script>
  // Función para obtener parámetros de la consulta en la URL
  function getQueryParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
      console.log(`Parámetro encontrado: ${key} = ${value}`);
    }
    return params;
  }

  // Función para decodificar Base64
  function decodeBase64(base64) {
    console.log(`Decodificando Base64: ${base64}`);
    return decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  // Obtener el parámetro 'amount' de la URL y decodificarlo
  const queryParams = getQueryParams();
  const encryptedAmount = queryParams['amount'];
  console.log(`Cantidad encriptada: ${encryptedAmount}`);
  const amount = decodeBase64(encryptedAmount);

  // Establecer el monto en el campo de entrada oculto y mostrarlo
  document.getElementById('amount').value = amount;
  const amountDecimal = (amount / 100).toFixed(2);
  const formattedAmount = amountDecimal.toLocaleString('es-ES', { minimumFractionDigits: 2 });
  document.getElementById('amount-display').textContent = `Cantidad: ${formattedAmount} €`;
  console.log(`Cantidad mostrada: ${formattedAmount} €`);

  // Inicializar Stripe y los elementos de Stripe
  var stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');
  var elements = stripe.elements();
  var cardNumber = elements.create('cardNumber');
  cardNumber.mount('#card-number-element');
  var cardExpiry = elements.create('cardExpiry');
  cardExpiry.mount('#card-expiry-element');
  var cardCvc = elements.create('cardCvc');
  cardCvc.mount('#card-cvc-element');
  console.log('Elementos de Stripe inicializados');

  // Manejar el evento click del botón de Pagar
  var payButton = document.getElementById('card-button');
  payButton.addEventListener('click', function() {
    console.log('Botón de pagar clicado');
    const sellerAccountId = document.getElementById('seller-account-id').value;
    console.log(`Seller Account ID: ${sellerAccountId}`);

    stripe.createPaymentMethod({
      type: 'card',
      card: cardNumber,
      billing_details: {
        // Aquí podrías incluir detalles adicionales de facturación si los recopilas
      }
    }, {
      stripeAccount: sellerAccountId
    }).then(function(result) {
      if (result.error) {
        console.error(result.error.message);
        alert('Error: ' + result.error.message);
      } else {
        console.log('Método de pago creado exitosamente');
        var paymentMethod = result.paymentMethod.id;
        console.log(`Payment Method ID: ${paymentMethod}`);
        var amount = document.getElementById('amount').value;
        var returnUrl = document.getElementById('return-url').value;

        fetch('/.netlify/functions/client_payment_server', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_method: paymentMethod,
            amount: amount,
            seller_account_id: sellerAccountId,
            return_url: returnUrl
          }),
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          console.log(data);
          if (data.error) {
            alert('Error: ' + data.error);
          } else {
            alert(data.message);
            window.location.href = returnUrl;
          }
        }).catch(function(error) {
          console.error('Error:', error);
          alert('Error procesando el pago. Por favor, inténtelo de nuevo más tarde.');
        });
      }
    });
  });
</script>

</body>
</html>
