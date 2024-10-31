---
title: "Método de Pago"
permalink: /metodoDePago/
layout: splash
---

<style>
/* Container styling */
.wrap {
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
}

.wrap p {
    text-align: center;
    color: #666;
    margin-bottom: 1.5em;
    font-size: 1.1em;
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
    margin: auto;
    transition: box-shadow 0.3s;
}

.payment-details:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Icon styling */
.payment-icon {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

/* Payment text styling */
.payment-info {
    display: flex;
    gap: 50px;
    align-items: flex-end;
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

.boton {
    display: inline-block;
    padding: 12px 25px;
    color: #222;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1em;
    text-align: center;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.2s, border-color 0.2s;
}

.boton:hover {
    background-color: #eee;
    border-color: #ccc;
}
</style>

<div class="wrap">
  <h4>Configurar forma de pago</h4>
  <p>Controla cómo pagas tu plan.</p>

  <div class="payment-details">
    <img id="payment-icon" class="payment-icon" src="" alt="Payment Method Icon" style="display: none;">
    <div class="payment-info">
      <p><strong><span id="payment-type"></span></strong></p>
      <p>*******<span id="payment-last4"></span></p>
      <p class="expiry">Cad. <span id="payment-expiry"></span></p>
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
        paymentTypeElement.textContent = brand;
        paymentLast4Element.textContent = data.paymentMethod.card.last4;
        paymentExpiryElement.textContent = data.paymentMethod.card.exp_month + '/' + data.paymentMethod.card.exp_year;

        // Display the correct icon based on the payment type
        if (brand === 'visa') {
          paymentIcon.src = "/assets/images/visa.png";
        } else if (brand === 'mastercard') {
          paymentIcon.src = "/assets/images/mastercard.jpg";
        } else {
          paymentIcon.src = ""; // Placeholder if no icon is available
        }

        paymentIcon.style.display = paymentIcon.src ? "block" : "none";
      } else {
        console.error('Error fetching payment method:', data.error);
      }
    })
    .catch(error => console.error('Error:', error));
  }

  netlifyIdentity.on('login', user => {
    fetchPaymentMethod(user.email);
  });
</script>
