---
title: "Método de Pago"
permalink: /metodoDePago/
layout: splash
---

<script src="https://js.stripe.com/v3/"></script>
<style>
/* Main container */
.wrap {
    max-width: 1000px;
    margin: 0 auto;
}

/* Payment details box */
.payment-details {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background: #f9f9f9;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 80%;
    margin: 2em auto;
    transition: box-shadow 0.3s;
}

.payment-details:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Payment icon */
.payment-icon {
    width: 60px;
    height: 60px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-size: cover;
    background-position: center;
    padding: 10px;
    margin-right: 15px;
}

/* Payment text */
.payment-info {
    display: flex;
    gap: 15px;
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
#overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

/* Modal styling */
#update-payment-modal {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 500px;
    width: 90%;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    z-index: 1001;
    text-align: center;
}

/* Payment form styling */
#payment-form {
    margin-top: 20px;
}

.stripe-element {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#submit-payment {
    margin-top: 20px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #6699ff;
    color: white;
    font-size: 1em;
    cursor: pointer;
}

/* Spinner */
.progress-circle {
    display: none;
    width: 20px;
    height: 20px;
    border: 3px solid #ccc;
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>

<div class="wrap">

  <h2 style="margin-top: 3em; text-align: center;">Configurar forma de pago</h2>
  <p style="text-align: center;">Controla cómo pagas tu plan.</p>

  <div class="payment-details">
    <img id="payment-icon" class="payment-icon" src="" alt="Payment Method Icon" style="display: none;">
    <div class="payment-info">
      <p><strong><span id="payment-type"></span></strong></p>
      <p>*******<span id="payment-last4"></span></p>
      <p class="expiry">Cad. <span id="payment-expiry"></span></p>
      <button onclick="openUpdatePaymentModal()">Cambiar</button>
    </div>
  </div>

  <div id="overlay"></div>
  <div id="update-payment-modal">
      <h2>Elige un método de pago</h2>
      <div id="payment-form">
          <div id="card-element" class="stripe-element"></div>
          <div id="card-errors" role="alert" style="color: red; margin-top: 10px;"></div>
          <button type="submit" id="submit-payment">
              Guardar
              <div class="progress-circle"></div>
          </button>
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
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('update-payment-modal').style.display = 'block';

    const response = await fetch('/.netlify/functions/server', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_setup_intent', email: userEmail })
    });

    const { clientSecret } = await response.json();
    setupStripeElements(clientSecret);
  }

  function closeUpdatePaymentModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('update-payment-modal').style.display = 'none';
  }

  document.getElementById('overlay').onclick = closeUpdatePaymentModal;

  function setupStripeElements(clientSecret) {
    const stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');
    const elements = stripe.elements();
    const cardElement = elements.create('card', {
      hidePostalCode: true
    });
    cardElement.mount('#card-element');

    document.getElementById('submit-payment').addEventListener('click', async (event) => {
      console.log('Guardar button clicked'); // Log when clicked

      event.preventDefault();  // Prevent the default form submission
      
      const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement }
      });

      if (error) {
        console.error('Stripe error:', error);
        document.getElementById('card-errors').textContent = error.message;
      } else {
        console.log('Payment method updated successfully');
        alert('Método de pago actualizado con éxito');
        closeUpdatePaymentModal();
      }
    });


  }
</script>
