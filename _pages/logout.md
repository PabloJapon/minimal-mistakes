---
title: "Mi Cuenta"
permalink: /miCuenta/
---

<!-- Your logout content here -->
<button onclick="openLoginModal()">Cerrar Sesión</button>

¡Bienvenido, <span id="username"></span>!

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
