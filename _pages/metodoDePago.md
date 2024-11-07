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

/* Overlay styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Slightly dark background */
  z-index: 1000; /* Ensures it covers everything */
  display: none; /* Initially hidden */
}

/* Modal styling */
.payment-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff; /* Modal background color */
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  z-index: 1001; /* Above the overlay */
  width: 600px; /* Set a fixed width for the modal */
  max-width: 90%;
}

/* Error styling */
.card-errors {
  color: #e63946;
  font-size: 0.9em;
  margin-top: 10px;
}

/* Button styling */
.submit-button {
  background-color: #007bff; /* Primary button color */
  color: #fff;
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}

/* Responsive styling for smaller screens */
@media (max-width: 600px) {
  .payment-modal {
    padding: 20px;
    width: 90%;
  }
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

  <div class="modal-overlay" id="overlay"></div>
  <div class="payment-modal" id="update-payment-modal" style="display: none;">
    <form id="payment-form">
      <div id="card-element"><!-- Stripe card input --></div>
      <div class="card-errors" id="card-errors" role="alert"></div> <!-- For displaying card errors -->
      <button type="submit" class="submit-button">Guardar</button>
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
