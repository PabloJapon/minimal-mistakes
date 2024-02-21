---
title: "Log In"
permalink: /login/
---

<!-- Your login content here -->
<button onclick="openLoginModal()">Login</button>

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

    if (loginButton) {
      if (user) {
        // Usuario autenticado, actualiza el texto del enlace
        loginButton.innerText = `Bienvenido, ${user.user_metadata.full_name}!`;
      } else {
        // Usuario no autenticado, restaura el texto del enlace
        loginButton.innerText = 'Log In';
      }
    }
  }
</script>
