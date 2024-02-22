---
title: "Mi Cuenta"
permalink: /miCuenta/
---

Hola, hola

¡Bienvenido, <span id="username"></span>!


<!-- Your logout content here -->
<button onclick="logout()">Cerrar Sesión</button>


<script>
  // Netlify Identity script and event handling
  netlifyIdentity.on('login', user => {
    // Additional actions after login if needed

    // Muestra el mensaje de bienvenida y el nombre de usuario
    const usernameSpan = document.getElementById('username');

    if (usernameSpan) {
      usernameSpan.innerText = user.user_metadata.full_name || user.email;
    }
  });

  netlifyIdentity.on('logout', () => {
    // Additional actions after logout if needed

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
