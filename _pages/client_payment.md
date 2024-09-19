---
layout: default
permalink: /client_payment/
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
      box-sizing: border-box;
    }

    .element-label {
      font-weight: bold;
      margin-bottom: 5px;
      font-size: 14px;
    }

    .inline-elements {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .inline-labels {
      display: flex;
      align-items: center;
      gap: 49px;
    }
  </style>
</head>
<body>

<div class="container">
  <h1>Introduzca sus datos de pago</h1>

  <!-- Placeholder para mostrar la cantidad -->
  <p id="amount-display">Cantidad: </p>

  <!-- Campos ocultos para datos adicionales -->
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

  <!-- Campo de correo electrónico -->
  <label for="email" class="element-label">Correo Electrónico</label>
  <input type="email" id="email" placeholder="tuemail@ejemplo.com" required="" style="font-size: 14px;background-color: white;box-shadow: none;">

  <!-- Botón de Pagar -->
  <button id="card-button" type="submit">Pagar Ahora</button>
</div>

<script>
  // Function to get query parameters from the URL
  function getQueryParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }
    return params;
  }

  // Function to decode Base64
  function decodeBase64(base64) {
    return decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  // Retrieve parameters from URL
  const queryParams = getQueryParams();
  const encryptedAmount = queryParams['amount'];
  const encryptedId = queryParams['id']; // Extract the encoded 'id' from URL

  // Decode the 'amount' and 'id'
  const amount = decodeBase64(encryptedAmount);
  const id = decodeBase64(encryptedId); // Decode the 'id'

  // Log the decoded 'id' to the console for debugging
  console.log('Decoded ID from URL:', id);

  // Decode the 'amount' and display it
  document.getElementById('amount').value = amount;
  const amountDecimal = (amount / 100).toFixed(2);
  const formattedAmount = amountDecimal.toLocaleString('es-ES', { minimumFractionDigits: 2 });
  document.getElementById('amount-display').textContent = Cantidad: ${formattedAmount} €;

  async function getSellerAccountId(id) {
  console.log('Fetching seller account ID for ID:', id); // Log the ID being fetched

    try {
      const response = await fetch(https://pablogastrali.pythonanywhere.com/personalizacion?id=${id});
      
      console.log('Response Status:', response.status); // Log the response status

      // Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error(Network response was not ok: ${response.statusText});
      }
      
      const data = await response.json();
      
      console.log('Response Data:', data); // Log the response data

      // Check if data is an array and has at least one item
      if (Array.isArray(data) && data.length > 0) {
        console.log('Seller Account ID Found:', data[0].id_connect); // Log the ID being returned
        return data[0].id_connect; // Make sure this correctly points to id_connect
      } else {
        throw new Error('Seller account ID not found');
      }
    } catch (error) {
      console.error('Error fetching seller account ID:', error);
      alert('Error fetching seller account ID. Please try again later.');
    }
  }


  // Get the seller account ID from the database
  getSellerAccountId(id).then(sellerAccountId => {
    if (!sellerAccountId) return;

    // Initialize Stripe with the retrieved seller-account-id
    var stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo', {
      stripeAccount: sellerAccountId
    });
    
    var elements = stripe.elements();
    var cardNumber = elements.create('cardNumber');
    cardNumber.mount('#card-number-element');
    var cardExpiry = elements.create('cardExpiry');
    cardExpiry.mount('#card-expiry-element');
    var cardCvc = elements.create('cardCvc');
    cardCvc.mount('#card-cvc-element');

    // Handle the payment button click event
    var payButton = document.getElementById('card-button');
    payButton.addEventListener('click', function() {
      // Create payment method with Stripe
      stripe.createPaymentMethod({
        type: 'card',
        card: cardNumber,
        billing_details: {
          // Include billing details if needed
        }
      }).then(function(result) {
        if (result.error) {
          console.error(result.error.message);
          alert('Error: ' + result.error.message);
        } else {
          var paymentMethod = result.paymentMethod.id;
          var amount = document.getElementById('amount').value;
          var returnUrl = document.getElementById('return-url').value;

          // Send payment details and decoded 'id' to the server
          fetch('/.netlify/functions/client_payment_server', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              payment_method: paymentMethod,
              amount: amount,
              seller_account_id: sellerAccountId, // Use retrieved seller account ID
              return_url: returnUrl,
              receipt_email: document.getElementById('email').value,
              id: id // Send the decoded 'id' to the server
            }),
          }).then(function(response) {
            return response.json();
          }).then(function(data) {
            if (data.error) {
              alert('Error: ' + data.error);
            } else {
              // Confirm the payment with the received client_secret
              confirmPayment(data.clientSecret, returnUrl);
            }
          }).catch(function(error) {
            console.error('Error:', error);
            alert('Error procesando el pago. Por favor, inténtelo de nuevo más tarde.');
          });
        }
      });

      function confirmPayment(clientSecret, returnUrl) {
        stripe.confirmCardPayment(clientSecret).then(function(result) {
          if (result.error) {
            console.error(result.error.message);
            alert('Error: ' + result.error.message);
          } else {
            alert('Payment successful!');
            window.location.href = returnUrl; // Redirect to the success URL
          }
        });
      }
    });
  });

</script>

</body>
</html>