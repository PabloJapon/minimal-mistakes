---
title: "Mi Cuenta"
permalink: /miCuenta/
---

# ¡Bienvenido, <span id="username"></span>!

<script async src="https://js.stripe.com/v3/buy-button.js"></script>

<stripe-buy-button
  buy-button-id="buy_btn_1On4bYE2UvP4xcDsYEY1nabe"
  publishable-key="pk_test_51OmfAYE2UvP4xcDs92nWGG93clovJ2N6OBjuvPv9k26lrUnU0VDdS4ra32km006KbVhlHGygobi4SQpTbpBTeyGa00FwesDfwo"
>
</stripe-buy-button>

<!-- Tu contenido de cierre de sesión aquí -->
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
