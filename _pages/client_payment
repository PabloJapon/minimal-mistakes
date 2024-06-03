---
layout: default
permalink: /client_payment/
---

<!DOCTYPE html>
<html lang="en">
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
  </style>
</head>
<body>

<div class="container">
  <h1>Enter Payment Details</h1>
  
  <!-- Hidden input for the seller account ID -->
  <input type="hidden" id="seller-account-id" value="acct_1PNXgvE7aK3gOt9K">

  <label for="card-number">Card Number</label>
  <input type="text" id="card-number" placeholder="1234 5678 9012 3456">
  
  <label for="card-expiry">Expiration Date</label>
  <input type="text" id="card-expiry" placeholder="MM/YY">

  <label for="card-cvc">CVC</label>
  <input type="text" id="card-cvc" placeholder="123">

  <button id="pay-button">Pay Now</button>
</div>

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
