# Custom Payment Form

<input type="text" id="card-holder-name" placeholder="Cardholder Name">
<input type="email" id="email" placeholder="Email Address">
<div id="card-element"></div>
<button id="card-button" type="submit">Pay Now</button>

```markdown
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
