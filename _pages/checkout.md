---
layout: default
permalink: /checkout/
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Accept a payment</title>
    <meta name="description" content="A demo of a payment on Stripe" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://gastrali.com/_pages/checkout.css" />
    <script src="https://js.stripe.com/v3/"></script>
    <script src="https://gastrali.com/_pages/checkout.js" defer></script>
  </head>
  <body>
    <!-- Display a payment form -->
    <form id="payment-form">
      <div id="payment-element">
        <!--Stripe.js injects the Payment Element-->
      </div>
      <button id="submit">
        <div class="spinner hidden" id="spinner"></div>
        <span id="button-text">Pay now</span>
      </button>
      <div id="payment-message" class="hidden"></div>
    </form>
    <!-- [DEV]: For demo purposes only, display dynamic payment methods annotation and integration checker -->
    <div id="dpm-annotation">
      <p>
        Payment methods are dynamically displayed based on customer location, order amount, and currency.&nbsp;
        <a href="#" target="_blank" rel="noopener noreferrer" id="dpm-integration-checker">Preview payment methods by transaction</a>
      </p>
    </div>
  </body>
</html>