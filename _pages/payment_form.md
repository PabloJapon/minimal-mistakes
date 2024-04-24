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
    }

    .container {
      max-width: 400px;
      margin: 50px auto; /* Adjust margin as needed */
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

    /* Custom styling for Stripe elements */
    .stripe-element {
      margin-bottom: 15px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  </style>
</head>
<body>

<div class="container">
  <h1>Custom Payment Form</h1>

  <form id="payment-form">
    <div id="card-number-element" class="stripe-element"></div>
    <div id="card-expiry-element" class="stripe-element"></div>
    <div id="card-cvc-element" class="stripe-element"></div>
    <button id="card-button" type="submit">Pay Now</button>
  </form>
</div>

<script>
  var stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');
  var elements = stripe.elements();

  // Custom styling for Stripe elements
  var style = {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
    },
  };

  var cardNumberElement = elements.create('cardNumber', { style: style });
  cardNumberElement.mount('#card-number-element');

  var cardExpiryElement = elements.create('cardExpiry', { style: style });
  cardExpiryElement.mount('#card-expiry-element');

  var cardCvcElement = elements.create('cardCvc', { style: style });
  cardCvcElement.mount('#card-cvc-element');

  var cardButton = document.getElementById('card-button');

  cardButton.addEventListener('click', function(ev) {
    ev.preventDefault();

    // Use Netlify Identity to get user data
    var user = netlifyIdentity && netlifyIdentity.currentUser();
    if (!user) {
      // If the user is not logged in, prompt them to log in
      alert('Please log in to proceed with the payment.');
      return;
    }

    // Get the user's email and name
    var userEmail = user.email;
    var userName = user.user_metadata && user.user_metadata.full_name ? user.user_metadata.full_name : '';

    // If the user is logged in, proceed with payment
    var paymentMethod = 'card'; // Use card as payment method
    var priceId = 'price_1On33zE2UvP4xcDsDD9jPJzw'; // Replace with actual price ID
    
    // Create payment method with Stripe
    stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
      billing_details: {
        name: userName,
      },
    }).then(function(result) {
      if (result.error) {
        // Error creating payment method
        console.error(result.error.message);
        alert('Failed to create payment method: ' + result.error.message);
      } else {
        // Payment method created successfully, proceed with payment
        var paymentMethodId = result.paymentMethod.id;
        
        // Make AJAX request to Netlify Function endpoint
        fetch('https://gastrali.netlify.app/.netlify/functions/server', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: userEmail,
            name: userName,
            payment_method: paymentMethodId,
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
      }
    });
  });
</script>

</body>
</html>
