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

    .wrap {
      max-width: 1000px;
      margin: 3em auto;
    }

    .container-master {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .sub-container {
      background-color: #fff;
      padding: 36px 50px;
      margin-bottom: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    input, button {
      width: 100%;
      padding: 10px;
      margin-top: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    button {
      background-color: #6699ff;
      color: white;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }

    .progress-circle {
      margin: 10px auto;
      border: 3px solid #ccc;
      border-top: 3px solid #6699ff;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      display: none;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .price { font-weight: bold; }
  </style>
</head>
<body>

<div class="wrap">
  <h2>Elige un método de pago</h2>
  <p>Introduce los datos de la tarjeta con la que quieras realizar los pagos de tu plan</p>

  <div class="container-master">
    <div class="sub-container" style="width: 60%;">
      <div id="payment-element-container"></div>
      <button id="pay-button">
        Realizar pago
      </button>
      <div class="progress-circle" id="loader"></div>
    </div>

    <div class="sub-container" style="background-color: #e7e7e7; width: 35%;">
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
  document.addEventListener("DOMContentLoaded", () => {
    const stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');
    const appearance = { theme: 'stripe', labels: 'floating' };
    const options = {
      layout: {
        type: 'accordion',
        defaultCollapsed: false,
        radios: true,
        spacedAccordionItems: false
      }
    };

    let elements;

    netlifyIdentity.init();
    const user = netlifyIdentity.currentUser();
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');

    if (!user) {
      netlifyIdentity.open();
      alert("Por favor inicia sesión para continuar con el pago.");
      return;
    }

    // Show plan and pricing info
    document.querySelectorAll('.plan').forEach(el => el.textContent = plan);

    let price = plan === 'Premium' ? 80 : 50;
    document.querySelectorAll('.price').forEach(el => el.textContent = price + '€');

    // Show renewal date
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    document.getElementById("renewal-date").textContent =
      `${String(nextMonth.getDate()).padStart(2, '0')}/${String(nextMonth.getMonth() + 1).padStart(2, '0')}/${nextMonth.getFullYear()}`;

    // Handle payment only when button is clicked
    const payButton = document.getElementById("pay-button");
    const loader = document.getElementById("loader");

    payButton.addEventListener("click", async (e) => {
      e.preventDefault();
      loader.style.display = "block";
      payButton.disabled = true;

      const token = await user.jwt();
      const fullName = user.user_metadata.full_name;
      const email = user.email;

      fetch('/.netlify/functions/restaurant_payment_server', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'create_subscription',
          plan,
          customerName: fullName,
          customerEmail: email
        })
      })
      .then(res => res.json())
      .then(async data => {
        if (data.error) {
          alert('Error creando la suscripción: ' + data.error);
          loader.style.display = "none";
          payButton.disabled = false;
          return;
        }

        const clientSecret = data.clientSecret;

        elements = stripe.elements({ clientSecret, appearance });
        const paymentElement = elements.create('payment', options);
        paymentElement.mount("#payment-element-container");

        // Delay confirmPayment to let element mount
        setTimeout(() => {
          stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: `${window.location.origin}/payment_success?payment_success=true&plan=${plan}`
            }
          }).catch(err => {
            console.error('Error confirmando pago:', err);
            loader.style.display = "none";
            payButton.disabled = false;
          });
        }, 500);
      })
      .catch(err => {
        console.error('Error conectando al servidor:', err);
        alert('Hubo un error al conectar con el servidor.');
        loader.style.display = "none";
        payButton.disabled = false;
      });
    });
  });
</script>

</body>
</html>
