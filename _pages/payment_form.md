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
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
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

    .inline-elements {
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

        <!-- This is where the Payment Element will be mounted -->
        <div id="payment-element"></div>
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
  document.addEventListener('DOMContentLoaded', function () {
    // Initialize Stripe with your publishable API key
    const stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');

    // Appearance settings for the payment element
    const appearance = {
        theme: 'stripe', // Choose a theme: 'stripe', 'flat', or 'night'
        labels: 'floating', // Choose labels: 'floating' or 'inline'
    };

    // Declare `elements` variable globally so it can be accessed anywhere
    let elements;

    // Options for the payment element
    const options = {
        layout: {
          type: 'accordion',
          defaultCollapsed: false,
          radios: true,
          spacedAccordionItems: false
        }
    };

    // Ensure Netlify Identity is initialized
    netlifyIdentity.init();

    // Check if the user is logged in
    const user = netlifyIdentity.currentUser();
    if (user) {
      user.jwt().then((token) => {
          const fullName = user.user_metadata.full_name;
          const email = user.email;

          console.log('User Name:', fullName);  // Debug: Log the user's full name
          console.log('User Email:', email);    // Debug: Log the user's email

          // Extract the plan from the URL
          const urlParams = new URLSearchParams(window.location.search);
          const plan = urlParams.get('plan');
          console.log('Plan extracted from URL:', plan); // Debug log for plan

          // Send request to backend to retrieve clientSecret and plan details
          fetch('/.netlify/functions/restaurant_payment_server', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`  // Pass the user's token for authentication
              },
              body: JSON.stringify({
                  action: 'create_subscription',
                  plan: plan,               // Extracted plan from URL params
                  customerName: fullName,   // User's full name from Netlify Identity
                  customerEmail: email      // User's email from Netlify Identity
              })
          })
          .then(response => response.json())
          .then(data => {
              if (data.error) {
                  alert('Error in creating subscription: ' + data.error);
              } else {
                  // Process clientSecret and handle Stripe payment
                  const clientSecret = data.clientSecret;
                  console.log('Client secret received:', clientSecret); // Log client secret
                  
                  // Create an instance of Elements with clientSecret and appearance
                  elements = stripe.elements({ clientSecret, appearance });

                  // Create and mount the payment element immediately after the client secret is received
                  const paymentElement = elements.create('payment', options);
                  paymentElement.mount('#payment-element');
              }
          })
          .catch(err => {
              console.error('Error:', err);
              alert('Error connecting to the server.');
          });
      });
    } else {
      alert('User is not logged in. Please log in to continue.');
    }

    // Handle payment button click for processing the payment
    const cardButton = document.getElementById('card-button');
    const progressCircle = document.querySelector('.progress-circle');

    cardButton.addEventListener('click', function (ev) {
      ev.preventDefault();

      // Show loading spinner
      progressCircle.style.display = 'block';

      // Confirm the payment with Stripe
      stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/payment_success',
        },
      })
      .then((result) => {
        if (result.error) {
          alert('Payment failed: ' + result.error.message);
        } else {
          console.log('Payment successful');
        }
        progressCircle.style.display = 'none'; // Hide the spinner after processing
      })
      .catch((error) => {
        console.error('Error confirming payment:', error);
        progressCircle.style.display = 'none'; // Hide spinner in case of error
      });
    });
  });
</script>

</body>
</html>
