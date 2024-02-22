---
title: "Mi Cuenta"
permalink: /miCuenta/
---

<!-- Your logout content here -->
<button onclick="openLoginModal()">Cerrar Sesión</button>

<div id="welcome-message" style="display: none;">
  ¡Bienvenido, <span id="username"></span>!
</div>

<script>
  // Netlify Identity script and event handling
  netlifyIdentity.on('login', user => {
    // Additional actions after login if needed
  });

  netlifyIdentity.on('logout', () => {
    // Additional actions after logout if needed
  });

  function openLoginModal() {
    netlifyIdentity.open('login');
  }
</script>
