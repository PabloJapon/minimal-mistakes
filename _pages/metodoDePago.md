---
title: "Método de Pago"
permalink: /metodoDePago/
layout: splash
---

<style>
.wrap {
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
}

.payment-details {
  width: 60%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  text-align: left;
  margin: 2em auto;
  display: flex;
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


<div class="wrap">
  <h2 style="margin-top: 3em;">Configurar forma de pago</h2>
  <p>Controla como pagas tu plan.</p>

    <div class="payment-details">
    <h4><span id="payment-type"></span><br></h4>
    <p>*******<span id="payment-last4"></span><br></p>
    <p>Cad. <span id="payment-expiry"></span></p>
    
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
