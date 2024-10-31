---
title: "Método de Pago"
permalink: /metodoDePago/
layout: splash
---

<style>
.payment-details {
  width: 60%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  text-align: left;
  margin: 2em auto;
}

.payment-info {
  font-size: 1em;
  line-height: 1.6em;
  color: #333;
}

.boton {
  display: inline-block;
  padding: 10px 20px;
  width: 100%;
  text-align: left;
  color: #222831;
  background: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  line-height: 40px;
  outline: none;
  margin-top: 20px;
}
.boton:hover {
  background-color: #e7e7e7;
}
</style>

<div class="payment-details">
  <h2>Método de Pago</h2>
  <p class="payment-info">
    Tipo: <span id="payment-type"></span><br>
    Últimos 4 dígitos: <span id="payment-last4"></span><br>
    Fecha de vencimiento: <span id="payment-expiry"></span>
  </p>
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

        paymentTypeElement.textContent = data.paymentMethod.card.brand || 'Desconocido';
        paymentLast4Element.textContent = data.paymentMethod.card.last4;
        paymentExpiryElement.textContent = data.paymentMethod.card.exp_month + '/' + data.paymentMethod.card.exp_year;
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
