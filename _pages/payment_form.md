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
// This is your test publishable API key.
const stripe = Stripe("pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo");

// The items the customer wants to buy
const items = [{ id: "xl-tshirt", amount: 1000 }];

let elements;

initialize();

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
  const response = await fetch("/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  const { clientSecret, dpmCheckerLink } = await response.json();

  const appearance = {
    theme: 'stripe',
  };
  elements = stripe.elements({ appearance, clientSecret });

  const paymentElementOptions = {
    layout: "tabs",
  };

  const paymentElement = elements.create("payment", paymentElementOptions);
  paymentElement.mount("#payment-element");

  // [DEV] For demo purposes only
  setDpmCheckerLink(dpmCheckerLink);
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: "http://gastrali.coml",
    },
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageContainer.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}

function setDpmCheckerLink(url) {
  document.querySelector("#dpm-integration-checker").href = url;
}
</script>


</body>
</html>
