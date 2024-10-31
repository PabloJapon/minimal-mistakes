---
title: "Método de Pago"
permalink: /metodoDePago/
layout: splash
---

<script src="https://js.stripe.com/v3/"></script>
<style>
/* Container styling */
.wrap {
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
}

/* Payment details box styling */
.payment-details {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 80%;
    margin: 2em 0;
    transition: box-shadow 0.3s;
}

.payment-details:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Icon styling */
.payment-icon {
    width: 60px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 10px;
    margin: 0.5em 1em;
}

/* Payment text styling */
.payment-info {
    display: flex;
    gap: 50px;
    align-items: center;
}

.payment-info p {
    margin: 0;
    color: #444;
    font-size: 1.1em;
}

.payment-info .expiry {
    color: #888;
    font-size: 0.9em;
}

</style>

<div class="wrap">

  <h2 style="margin-top: 3em;">Configurar forma de pago</h2>
  <p>Controla cómo pagas tu plan.</p>

  <div class="payment-details">
    <img id="payment-icon" class="payment-icon" src="" alt="Payment Method Icon" style="display: none;">
    <div class="payment-info">
      <p><strong><span id="payment-type"></span></strong></p>
      <p>*******<span id="payment-last4"></span></p>
      <p class="expiry">Cad. <span id="payment-expiry"></span></p>
      <button onclick="openUpdatePaymentModal()">Cambiar</button>
    </div>
  </div>
  <div id="update-payment-modal" style="display: none;">
    <form id="payment-form">
      <div id="card-element"><!-- Stripe card input --></div>
      <button type="submit">Guardar</button>
    </form>
  </div>
</div>

<script>
  function fetchPaymentMethod(email) {
    fetch('/.netlify/functions/server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'get_payment_method', email: email })
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.paymentMethod) {
        const paymentTypeElement = document.getElementById('payment-type');
        const paymentLast4Element = document.getElementById('payment-last4');
        const paymentExpiryElement = document.getElementById('payment-expiry');
        const paymentIconElement = document.getElementById('payment-icon');

        const brand = data.paymentMethod.card.brand || 'Desconocido';
        paymentTypeElement.textContent = brand.charAt(0).toUpperCase() + brand.slice(1);
        paymentLast4Element.textContent = data.paymentMethod.card.last4;
        paymentExpiryElement.textContent = data.paymentMethod.card.exp_month + '/' + data.paymentMethod.card.exp_year;

        // Display the correct icon based on the payment type
        if (brand === 'visa') {
            paymentIconElement.src = "/assets/images/visa.png";
            console.log('visa');
        } else if (brand === 'mastercard') {
            paymentIconElement.src = "/assets/images/mastercard.jpg";
            console.log('mastercard');
        } else {
            paymentIconElement.src = ""; // Placeholder if no icon is available
            console.log('none');
        }

        paymentIconElement.style.display = paymentIconElement.src ? "block" : "none";
      } else {
        console.error('Error fetching payment method:', data.error);
      }
    })
    .catch(error => console.error('Error:', error));
  }

  let userEmail = "";
  netlifyIdentity.on('login', user => {
    userEmail = user.email;
    fetchPaymentMethod(user.email);
  });

  async function openUpdatePaymentModal() {
    document.getElementById('update-payment-modal').style.display = 'block';

    // Fetch SetupIntent client secret
    const response = await fetch('/.netlify/functions/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_setup_intent', email: userEmail })
    });

    const { clientSecret } = await response.json();
    setupStripeElements(clientSecret);
    }

    function setupStripeElements(clientSecret) {
    const stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    document.getElementById('payment-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement }
        });

        if (error) {
        alert('Error: ' + error.message);
        } else {
        alert('Método de pago actualizado con éxito');
        document.getElementById('update-payment-modal').style.display = 'none';
        }
    });
    }

</script>
