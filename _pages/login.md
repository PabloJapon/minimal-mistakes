---
title: "Log In"
permalink: /login/
---

<!-- Your login content here -->
<p>This is your login page.</p>
<a id="login-link" href="#" onclick="toggleLogin()">Log In</a>

<script>
  // Netlify Identity script and event handling
  netlifyIdentity.on('login', user => {
    console.log('User logged in', user);
    // Additional actions after login if needed
    updateLoginButton(user);
  });

  netlifyIdentity.on('logout', () => {
    console.log('User logged out');
    // Additional actions after logout if needed
    updateLoginButton(null);
  });

  function openLoginModal() {
    netlifyIdentity.open('login');
  }

  function updateLoginButton(user) {
    const loginButton = document.getElementById('login-button');
    const loginNavItem = document.getElementById('login-nav-item');

    if (loginButton && loginNavItem) {
      if (user) {
        // Usuario autenticado, actualiza el texto del enlace
        loginButton.innerText = `Bienvenido, ${user.user_metadata.full_name}!`;
        // Actualiza el título de la navegación
        loginNavItem.innerText = 'Log Out';
      } else {
        // Usuario no autenticado, restaura el texto del enlace y el título de la navegación
        loginButton.innerText = 'Log In';
        loginNavItem.innerText = 'Log In';
      }
    }
  }
</script>
