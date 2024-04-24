---
layout: default
permalink: /payment_form/
---

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Introduzca sus datos de pago</title>
  <script src="https://js.stripe.com/v3/"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 400px;
      margin: 50px auto; /* Ajustar margen según sea necesario */
      padding: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
      text-align: center;
      color: #333;
    }

    input[type="text"],
    input[type="email"],
    button {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-sizing: border-box;
    }

    button {
      background-color: #6699ff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #0056b3;
    }

    /* Estilo personalizado para los elementos de Stripe */
    .stripe-element {
      width: 100%; /* Establecer el ancho para ocupar el 100% del contenedor */
      margin-bottom: 15px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-sizing: border-box;
    }
    .stripe-element-50 {
      width: 50%; /* Establecer el ancho para ocupar el 50% del contenedor */
      margin-bottom: 15px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-sizing: border-box;
    }

    .element-label {
      font-weight: bold;
      margin-bottom: 5px;
      font-size: 14px; /* Ajustar el tamaño de fuente de las etiquetas */
    }

    .inline-elements{
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .inline-labels {
      display: flex;
      align-items: center;
      gap: 49px;
    }
  </style>
</head>
<body>

<div class="container">
  <h1>Introduzca sus datos de pago</h1>

  <label for="card-number-element" class="element-label">Número de Tarjeta</label>
  <div id="card-number-element" class="stripe-element"></div>

  <div class="inline-labels">
    <label for="card-expiry-element" class="element-label">Fecha de Expiración</label>
    <label for="card-cvc-element" class="element-label">Código de Seguridad</label>
  </div>

  <div class="inline-elements">
    <div id="card-expiry-element" class="stripe-element-50"></div>
    <div id="card-cvc-element" class="stripe-element-50"></div>
  </div>

  <button id="card-button" type="submit">Pagar Ahora</button>

  {% assign plan = page.query.plan %}
  {% if plan %}
    El usuario ha seleccionado el plan: {{ plan }}
  {% endif %}
</div>

<script>
  var stripe = Stripe('pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo');
  var elements = stripe.elements();

  // Estilo personalizado para los elementos de Stripe
  var style = {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
    },
  };

  var cardNumberElement = elements.create('cardNumber', { style: style });
  cardNumberElement.mount('#card-number-element');

  var cardExpiryElement = elements.create('cardExpiry', { style: style });
  cardExpiryElement.mount('#card-expiry-element');

  var cardCvcElement = elements.create('cardCvc', { style: style });
  cardCvcElement.mount('#card-cvc-element');

  var cardButton = document.getElementById('card-button');

  cardButton.addEventListener('click', function(ev) {
    ev.preventDefault();

    // Usar Netlify Identity para obtener los datos del usuario
    var user = netlifyIdentity && netlifyIdentity.currentUser();
    if (!user) {
      // Si el usuario no ha iniciado sesión, pedirle que inicie sesión
      alert('Por favor, inicia sesión para continuar con el pago.');
      return;
    }

    // Obtener el correo electrónico y el nombre del usuario
    var userEmail = user.email;
    var userName = user.user_metadata && user.user_metadata.full_name ? user.user_metadata.full_name : '';

    // Si el usuario ha iniciado sesión, proceder con el pago
    var paymentMethod = 'card'; // Utilizar tarjeta como método de pago
    var priceId = 'price_1On33zE2UvP4xcDsDD9jPJzw'; // Reemplazar con el ID de precio real
    
    // Crear método de pago con Stripe
    stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
      billing_details: {
        name: userName,
      },
    }).then(function(result) {
      if (result.error) {
        // Error al crear método de pago
        console.error(result.error.message);
        alert('Error al crear método de pago: ' + result.error.message);
      } else {
        // Método de pago creado con éxito, proceder con el pago
        var paymentMethodId = result.paymentMethod.id;
        
        // Hacer solicitud AJAX al punto final de la Función de Netlify
        fetch('https://gastrali.netlify.app/.netlify/functions/server', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: userEmail,
            name: userName,
            payment_method: paymentMethodId,
            priceId: priceId
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al crear suscripción');
          }
          return response.json();
        })
        .then(data => {
          // Manejar la creación exitosa de la suscripción
          alert('¡Suscripción creada con éxito!');
        })
        .catch(error => {
          // Manejar errores
          console.error('Error al crear suscripción:', error);
          alert('Error al crear suscripción. Por favor, inténtalo de nuevo más tarde.');
        });
      }
    });
  });
</script>

</body>
</html>
