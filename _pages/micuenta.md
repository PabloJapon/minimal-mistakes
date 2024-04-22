---
title: "Mi Cuenta"
permalink: /miCuenta/
layout: splash
---

# ¡Bienvenido, <span id="username"></span>!

<!-- Subscription Plan Name -->
<div id="subscription-plan"></div>

<!-- Cierre de sesión -->
<button onclick="logout()">Cerrar Sesión</button>

<script src="https://js.stripe.com/v3/"></script>
<script>
  // Netlify Identity script y manejo de eventos
  netlifyIdentity.on('login', user => {
    // Acciones adicionales después del inicio de sesión si es necesario

    // Muestra el mensaje de bienvenida y el nombre de usuario
    const usernameSpan = document.getElementById('username');

    if (usernameSpan) {
      usernameSpan.innerText = user.user_metadata.full_name || user.email;
    }

    // Retrieve subscription information and display the plan name
    getSubscriptionPlan();
  });

  netlifyIdentity.on('logout', () => {
    // Acciones adicionales después del cierre de sesión si es necesario

    // Borra el nombre de usuario al cerrar sesión
    const usernameSpan = document.getElementById('username');
    if (usernameSpan) {
      usernameSpan.innerText = '';
    }
  });

  function logout() {
    netlifyIdentity.logout();
  }

  // Function to retrieve subscription information
  function getSubscriptionPlan() {
    // Fetch the subscription details from Stripe using the token or session ID
    fetch('/.netlify/functions/getSubscription', {
      method: 'POST',
      // Pass the token or session ID received from Stripe Checkout
      body: JSON.stringify({ paymentToken: 'your_payment_token_or_session_id' }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Subscription data:', data);
      if (data.planName) {
        // Update the subscription-plan element with the plan name
        const subscriptionPlanElement = document.getElementById('subscription-plan');
        subscriptionPlanElement.innerText = 'Plan: ' + data.planName;
      } else {
        // Display an error message if no active subscription found
        const subscriptionPlanElement = document.getElementById('subscription-plan');
        subscriptionPlanElement.innerText = 'No active subscription found';
      }
    })
    .catch(error => {
      // Log and display any errors that occur
      console.error('Error fetching subscription information:', error);
      const subscriptionPlanElement = document.getElementById('subscription-plan');
      subscriptionPlanElement.innerText = 'Error fetching subscription information';
    });
  }
</script>
