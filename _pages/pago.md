---
title: "Realizar Pago"
permalink: /realizar-pago/
---

<!-- Agrega la biblioteca Stripe.js -->
<script src="https://js.stripe.com/v3/"></script>

<!-- Tu formulario de pago y script aquí -->
<form id="payment-form">
  <!-- Utiliza un div para montar el campo de la tarjeta -->
  <div id="card-element"></div>

  <!-- Otros campos del formulario, como el número de tarjeta, la fecha de vencimiento, el código CVC, etc. -->
  <!-- ... -->

  <!-- Botón de pago -->
  <button type="button" id="submit-payment">Pagar</button>
</form>

<!-- Script para manejar el pago con Stripe.js -->
<script>
  var stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');
  var elements = stripe.elements();

  // Utiliza el div 'card-element' para montar el campo de la tarjeta
  var card = elements.create('card', {
    hidePostalCode: true,
    style: {
      base: {
        fontSize: '16px',
      },
    },
  });

  card.mount('#card-element');

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

        // Establecer la cantidad del pago (en centavos)
        var amount = 1000; // 10 euros en centavos (1 euro = 100 centavos)

        // Realizar la transacción en tu servidor con la cantidad
        // Aquí deberías enviar el paymentMethodId y la cantidad al servidor
        // y completar la transacción utilizando la clave secreta de Stripe
        console.log('Payment Method ID:', paymentMethodId);
        console.log('Cantidad del Pago:', amount);
      }
    });
  });
</script>
