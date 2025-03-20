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
      <p>Próxima renovación automática: <b id="renewal-date">00/00/2024</b></p>

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
    const stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');

    const appearance = {
        theme: 'stripe',
        labels: 'floating',
    };

    let elements;

    const options = {
        layout: {
          type: 'accordion',
          defaultCollapsed: false,
          radios: true,
          spacedAccordionItems: false
        }
    };

    // Initialize Netlify Identity
    netlifyIdentity.init();

    const user = netlifyIdentity.currentUser();

    if (!user) {
      // Show the Netlify Identity login widget if no user is logged in
      netlifyIdentity.open();
      alert('Please log in to proceed with the payment.');
      return;
    }

    // Fetch token and set up payment element once user is confirmed to be logged in
    user.jwt().then((token) => {
      const fullName = user.user_metadata.full_name;
      const email = user.email;
      const urlParams = new URLSearchParams(window.location.search);
      const plan = urlParams.get('plan');

      // Update all elements with class "plan" to display the plan name
      document.querySelectorAll('.plan').forEach(el => {
        el.textContent = plan;
      });
      
      // Calculate next month's date dynamically
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      // Format date as MM/DD/YYYY (adjust if you prefer a different format)
      const formattedDate = `${(nextMonth.getMonth() + 1).toString().padStart(2, '0')}/${nextMonth.getDate().toString().padStart(2, '0')}/${nextMonth.getFullYear()}`;
      // Update the renewal date element
      document.getElementById('renewal-date').textContent = formattedDate;

      // Send request to create subscription and retrieve clientSecret
      fetch('/.netlify/functions/restaurant_payment_server', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'create_subscription',
          plan: plan,
          customerName: fullName,
          customerEmail: email
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert('Error creating subscription: ' + data.error);
        } else {
          const clientSecret = data.clientSecret;
          
          elements = stripe.elements({ clientSecret, appearance });
          const paymentElement = elements.create('payment', options);
          paymentElement.mount('#payment-element'); // Mount payment element immediately if clientSecret is available
        }
      })
      .catch(error => {
        console.error('Error during subscription setup:', error);
        alert('There was an error connecting to the server.');
      });
    });

    const cardButton = document.getElementById('card-button');
    const progressCircle = document.querySelector('.progress-circle');

    cardButton.addEventListener('click', function (ev) {
      ev.preventDefault();
      progressCircle.style.display = 'block';

      // Get the selected plan from the URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const plan = urlParams.get('plan');

      stripe.confirmPayment({
        elements,
        confirmParams: {
          // Append parameters to be used by the success page
          return_url: `${window.location.origin}/payment_success?payment_success=true&plan=${plan}`,
        },
      })
      .catch((error) => {
        console.error('Error confirming payment:', error);
        progressCircle.style.display = 'none';
      });
    });
  });
</script>


</body>
</html>
