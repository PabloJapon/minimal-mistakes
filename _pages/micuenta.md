---
title: "Mi Cuenta"
permalink: /miCuenta/
layout: splash
---

# ¡Bienvenido, <span id="username"></span>!

<!-- Cierre de sesión -->
<button onclick="logout()">Cerrar Sesión</button>

<!-- Mostrar el plan de suscripción -->
<p>Plan de Suscripción: <span id="subscriptionPlan"></span></p>

<script>
  // Netlify Identity script y manejo de eventos
  netlifyIdentity.on('login', user => {
    // Acciones adicionales después del inicio de sesión si es necesario

    // Muestra el mensaje de bienvenida y el nombre de usuario
    const usernameSpan = document.getElementById('username');

    if (usernameSpan) {
      usernameSpan.innerText = user.user_metadata.full_name || user.email;
    }

    // Mostrar el plan de suscripción si está disponible
    const subscriptionPlanSpan = document.getElementById('subscriptionPlan');

    if (subscriptionPlanSpan && user.user_metadata.subscription_plan) {
      subscriptionPlanSpan.innerText = user.user_metadata.subscription_plan;
    }
  });

  netlifyIdentity.on('logout', () => {
    // Acciones adicionales después del cierre de sesión si es necesario

    // Borra el nombre de usuario al cerrar sesión
    const usernameSpan = document.getElementById('username');
    if (usernameSpan) {
      usernameSpan.innerText = '';
    }

    // Limpiar el plan de suscripción al cerrar sesión
    const subscriptionPlanSpan = document.getElementById('subscriptionPlan');
    if (subscriptionPlanSpan) {
      subscriptionPlanSpan.innerText = '';
    }
  });

  function logout() {
    netlifyIdentity.logout();
  }

</script>
