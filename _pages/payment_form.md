---
layout: default
permalink: /payment_form/
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custom Payment Form</title>
  <script src="https://js.stripe.com/v3/"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .container {
      max-width: 400px;
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
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>

<div class="container">
  <h1>Custom Payment Form</h1>

  <form id="payment-form">
    <input type="text" id="card-holder-name" placeholder="Cardholder Name">
    <input type="email" id="email" placeholder="Email Address">
    <div id="card-element"></div>
    <button id="card-button" type="submit">Pay Now</button>
  </form>
</div>

<script>
  var stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');
  var elements = stripe.elements();
  var cardElement = elements.create('card');
  cardElement.mount('#card-element');

  var cardButton = document.getElementById('card-button');

  cardButton.addEventListener('click', function(ev) {
    ev.preventDefault();

    // Collect form data
    var cardHolderName = document.getElementById('card-holder-name').value;
    var email = document.getElementById('email').value; // Assuming you have an input field for email
    var paymentMethod = 'pm_card_visa'; // Replace with actual payment method ID
    var priceId = 'price_1On33zE2UvP4xcDsDD9jPJzw'; // Replace with actual price ID
    
    // Make AJAX request to Netlify Function endpoint
    fetch('https://gastrali.netlify.app/.netlify/functions/server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        payment_method: paymentMethod,
        priceId: priceId
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }
      return response.json();
    })
    .then(data => {
      // Handle successful subscription creation
      alert('Subscription created successfully!');
    })
    .catch(error => {
      // Handle errors
      console.error('Error creating subscription:', error);
      alert('Failed to create subscription. Please try again later.');
    });
  });
</script>

</body>
</html>
