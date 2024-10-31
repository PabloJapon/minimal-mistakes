---
title: "Método de Pago"
permalink: /metodoDePago/
layout: splash
---

<style>
/* Container styling */
.wrap {
    max-width: 800px;
    margin: 3em auto;
    padding: 0 20px;
}

/* Title and info styling */
.wrap h2 {
    text-align: center;
    color: #444;
    font-weight: 600;
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
    flex-direction: column;
    gap: 5px;
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
  <h2>Configurar forma de pago</h2>
  <p>Controla cómo pagas tu plan.</p>

  <div class="payment-details">
    <!-- Placeholder for payment icon -->
    <div class="payment-icon" id="payment-icon"></div>

    <!-- Payment Information -->
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

        // Map brand to icon URL or default icon
        const icons = {
          'Visa': 'url(/path-to-icons/visa-icon.png)',
          'MasterCard': 'url(/path-to-icons/mastercard-icon.png)',
          'American Express': 'url(/path-to-icons/amex-icon.png)',
          'Desconocido': 'url(/path-to-icons/default-icon.png)'
        };
        
        paymentIconElement.style.backgroundImage = icons[brand] || icons['Desconocido'];
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
