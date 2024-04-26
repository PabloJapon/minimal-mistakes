---
title: "Mi Cuenta"
permalink: /miCuenta/
layout: splash
---

# ¡Bienvenido, <span id="username"></span>!

<!-- Logout button -->
<button onclick="logout()">Cerrar Sesión</button>

<!-- Display subscription plan -->
<p id="subscription-plan"></p>

<!-- Unsubscribe button -->
<button onclick="cancelSubscription()">Cancelar Suscripción</button>

<script>
  // Netlify Identity script and event handling
  netlifyIdentity.on('login', user => {
    // Additional actions after login if needed

    // Display welcome message and username
    const usernameSpan = document.getElementById('username');
    if (usernameSpan) {
      usernameSpan.innerText = user.user_metadata.full_name || user.email;
    }

    // Display subscription plan
    const subscriptionPlan = user.user_metadata.subscription_plan;
    if (subscriptionPlan) {
      const subscriptionPlanElement = document.getElementById('subscription-plan');
      subscriptionPlanElement.textContent = "Plan de Suscripción: " + subscriptionPlan;
      console.log('Subscription plan:', subscriptionPlan);
    } else {
      console.log('User', user);
      console.log('sin plan de suscripción');
    }
  });

  netlifyIdentity.on('logout', () => {
    // Additional actions after logout if needed

    // Clear username on logout
    const usernameSpan = document.getElementById('username');
    if (usernameSpan) {
      usernameSpan.innerText = '';
    }
  });

  function logout() {
    netlifyIdentity.logout();
  }

  function cancelSubscription() {
    // Confirm cancellation
    const confirmation = confirm('¿Estás seguro de que quieres cancelar tu suscripción?');

    if (confirmation) {
      // Get current user
      const user = netlifyIdentity.currentUser();

      // Check if user is logged in
      if (!user) {
        alert('Por favor, inicia sesión para cancelar tu suscripción.');
        return;
      }

      // Get subscription ID from user metadata
      const subscriptionId = user.user_metadata.subscription_plan;

      // Check if subscription ID exists
      if (!subscriptionId) {
        alert('No se encontró ninguna suscripción asociada a tu cuenta.');
        return;
      }

      // Send request to cancel subscription
      fetch('/.netlify/functions/server', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'cancel_subscription',
          subscriptionId: subscriptionId
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Handle cancellation response
        if (response.ok) {
          // Remove subscription_plan from user metadata
          user.update({
            data: { subscription_plan: null }
          })
          alert('¡Tu suscripción ha sido cancelada con éxito!');
          // Refresh the page to reflect changes
          window.location.reload();
        } else {
          alert('Error al cancelar la suscripción: ' + data.error);
        }
      })
      .catch(error => {
        console.error('Error al cancelar la suscripción:', error);
        alert('Error al cancelar la suscripción. Por favor, inténtalo de nuevo más tarde.');
      });
    }
  }
</script>
