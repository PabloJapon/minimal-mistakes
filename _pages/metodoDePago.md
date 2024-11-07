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

/* Modal and overlay styling */
#overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

#update-payment-modal {
    display: none;
    max-width: 500px;
    margin: 5% auto;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Loading animation for the save button */
.progress-circle {
    display: none;
    width: 40px;
    height: 40px;
    border: 3px solid #ccc;
    border-top-color: #6699ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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

  <div id="overlay" onclick="closeUpdatePaymentModal()"></div>
  <div id="update-payment-modal">
      <div class="sub-container">
          <h2>Elige un método de pago</h2>
          <div id="payment-form">
              <div id="card-element" class="stripe-element"></div>
              <div id="card-errors" role="alert"></div>
              <button type="submit" id="submit-payment">
                  Guardar
                  <div class="progress-circle"></div>
              </button>
          </div>
      </div>
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
        } else if (brand === 'mastercard') {
            paymentIconElement.src = "/assets/images/mastercard.jpg";
        } else {
            paymentIconElement.src = ""; // Placeholder if no icon is available
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
    document.getElementById('overlay').style.display = 'block'; // Show overlay
    document.getElementById('update-payment-modal').style.display = 'block'; // Show modal

    // Fetch SetupIntent client secret
    const response = await fetch('/.netlify/functions/server', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_setup_intent', email: userEmail })
    });

    const { clientSecret } = await response.json();
    setupStripeElements(clientSecret);
  }

  function closeUpdatePaymentModal() {
    document.getElementById('overlay').style.display = 'none'; // Hide overlay
    document.getElementById('update-payment-modal').style.display = 'none'; // Hide modal
  }

  // Add a close event to the overlay
  document.getElementById('overlay').onclick = closeUpdatePaymentModal;

  function setupStripeElements(clientSecret) {
    const stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');
    const elements = stripe.elements();
    const cardElement = elements.create('card', {
      hidePostalCode: true, // This hides the postal code field
    });
    cardElement.mount('#card-element');

    document.getElementById('payment-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement }
      });

      if (error) {
        document.getElementById('card-errors').textContent = error.message; // Display error in the modal
      } else {
        alert('Método de pago actualizado con éxito');
        closeUpdatePaymentModal(); // Hide modal after successful update
      }
    });
  }

</script> 
