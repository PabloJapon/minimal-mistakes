---
title: "Mi Cuenta"
permalink: /miCuenta/
layout: splash
---

# ¡Bienvenido, <span id="username"></span>!

<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
<stripe-pricing-table pricing-table-id="prctbl_1On5HBE2UvP4xcDs5mx40eVF"
publishable-key="pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo">
</stripe-pricing-table>

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

    // Display the subscription plan
    displaySubscriptionPlan(user);
  });

  netlifyIdentity.on('logout', () => {
    // Acciones adicionales después del cierre de sesión si es necesario

    // Borra el nombre de usuario al cerrar sesión
    const usernameSpan = document.getElementById('username');
    if (usernameSpan) {
      usernameSpan.innerText = '';
    }

    // Clear the subscription plan when the user logs out
    const subscriptionPlanElement = document.getElementById('subscription-plan');
    if (subscriptionPlanElement) {
      subscriptionPlanElement.innerText = '';
    }
  });

  function logout() {
    netlifyIdentity.logout();
  }

  // Function to display the subscription plan
  function displaySubscriptionPlan(user) {
    // Get the subscription plan from Netlify Identity metadata
    const planName = user.user_metadata.subscription_plan;
    
    // Display the plan name
    const subscriptionPlanElement = document.getElementById('subscription-plan');
    subscriptionPlanElement.innerText = 'Plan: ' + planName;
  }
</script>
