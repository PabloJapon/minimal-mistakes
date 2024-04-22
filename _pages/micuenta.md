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
    // Check if subscription plan metadata exists
    if (user.user_metadata && user.user_metadata.subscription_plan) {
        // Get the subscription plan from Netlify Identity metadata
        const planName = user.user_metadata.subscription_plan;

        // Display the plan name
        const subscriptionPlanElement = document.getElementById('subscription-plan');
        subscriptionPlanElement.innerText = 'Plan: ' + planName;
    } else {
        // If subscription plan metadata doesn't exist, display a message
        const subscriptionPlanElement = document.getElementById('subscription-plan');
        subscriptionPlanElement.innerText = 'Todavía no has elegido ningún plan';
    }
}

// Function to initiate subscription checkout
async function initiateSubscriptionCheckout() {
  try {
    // Make a request to your server to create a Checkout session
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ planId: 'your_plan_id' }) // Replace 'your_plan_id' with the actual plan ID
    });

    const session = await response.json();

    // Redirect to the Checkout page with success and cancel URLs
    stripe.redirectToCheckout({
      sessionId: session.id,
      successUrl: 'https://yourwebsite.com/success',
      cancelUrl: 'https://yourwebsite.com/miCuenta' // Redirect back to the account page
    });
  } catch (error) {
    console.error('Error initiating subscription checkout:', error);
  }
}

// Call the function when the page loads or when the user clicks a button to initiate checkout
initiateSubscriptionCheckout();
</script>
