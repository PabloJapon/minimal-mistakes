---
title: "Realizar Pago"
permalink: /realizar-pago/
---

<!-- Agrega la biblioteca Stripe.js -->
<script src="https://js.stripe.com/v3/"></script>

<!-- Tu formulario de pago y script aquí -->
<form id="payment-form">
  <!-- Campos del formulario, como el número de tarjeta, la fecha de vencimiento, el código CVC, etc. -->
  <input type="text" id="card-number" placeholder="Número de tarjeta" required>
  <input type="text" id="card-expiry" placeholder="Fecha de vencimiento" required>
  <input type="text" id="card-cvc" placeholder="CVC" required>

  <!-- Botón de pago -->
  <button type="button" id="submit-payment">Pagar</button>
</form>

<!-- Script para manejar el pago con Stripe.js -->
<script>
  var stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');
  var elements = stripe.elements();

  var card = elements.create('card', {
    hidePostalCode: true,
    style: {
      base: {
        fontSize: '16px',
      },
    },
  });

  card.mount('#card-number');

  // Manejar el evento de clic en el botón de pago
  document.getElementById('submit-payment').addEventListener('click', function() {
    stripe.createPaymentMethod({
      type: 'card',
      card: card,
    }).then(function(result) {
      if (result.error) {
        // Manejar errores durante el proceso de pago
        console.error(result.error.message);
      } else {
        // Enviar el ID de pago a tu servidor para completar la transacción
        var paymentMethodId = result.paymentMethod.id;
        // Puedes usar Ajax o Fetch para enviar el paymentMethodId a tu servidor
        // y completar la transacción con la clave secreta de Stripe
        console.log('Payment Method ID:', paymentMethodId);
      }
    });
  });
</script>
