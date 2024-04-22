---
title: "Mi Cuenta"
permalink: /miCuenta/
layout: splash
---

# ¡Bienvenido, <span id="username"></span>!

<!-- Tabla de Tarifas -->
<script async src="https://js.stripe.com/v3/pricing-table.js"></script>

<stripe-pricing-table pricing-table-id="prctbl_1On5HBE2UvP4xcDs5mx40eVF"
publishable-key="pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo">
</stripe-pricing-table>

<!-- Cierre de sesión -->
<button onclick="logout()">Cerrar Sesión</button>

<script>
  // Netlify Identity script y manejo de eventos
  netlifyIdentity.on('login', user => {
    // Acciones adicionales después del inicio de sesión si es necesario

    // Muestra el mensaje de bienvenida y el nombre de usuario
    const usernameSpan = document.getElementById('username');

    if (usernameSpan) {
      usernameSpan.innerText = user.user_metadata.full_name || user.email;
    }
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
</script>
