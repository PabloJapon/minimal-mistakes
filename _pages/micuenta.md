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
    getSubscriptionPlan(user);
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
  function getSubscriptionPlan(user) {
    // Retrieve the user's Stripe customer ID from Netlify Identity
    const customerId = user.user_metadata.stripe_customer_id;

    // Fetch the subscription details from Stripe using the customer ID
    fetch('/.netlify/functions/getSubscription', {
      method: 'POST',
      body: JSON.stringify({ customerId }),
    })
    .then(response => response.json())
    .then(data => {
      // Extract the subscription plan name from the response
      const planName = data.plan_name;

      // Update the subscription-plan element with the plan name
      const subscriptionPlanElement = document.getElementById('subscription-plan');
      subscriptionPlanElement.innerText = 'Plan: ' + planName;
    })
    .catch(error => {
      console.error('Error fetching subscription information:', error);
    });
  }
</script>
