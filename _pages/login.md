---
title: "Log In"
permalink: /login/
---

<!-- Your login content here -->
<div id="login-container">
  <p>This is your login page.</p>
  <button onclick="openLoginModal()">Login</button>
</div>

<script>
  // Netlify Identity script and event handling
  netlifyIdentity.on('login', user => {
    console.log('User logged in', user);
    // Additional actions after login if needed
    updateLoginContainer(user);
  });

  netlifyIdentity.on('logout', () => {
    console.log('User logged out');
    // Additional actions after logout if needed
    updateLoginContainer(null);
  });

  function openLoginModal() {
    netlifyIdentity.open('login');
  }

  function updateLoginContainer(user) {
    const loginContainer = document.getElementById('login-container');

    if (user) {
      // Usuario autenticado, muestra el nombre
      loginContainer.innerHTML = `<p>Bienvenido, ${user.user_metadata.full_name}!</p>`;
    } else {
      // Usuario no autenticado, muestra el botón de login
      loginContainer.innerHTML = `
        <p>This is your login page.</p>
        <button onclick="openLoginModal()">Login</button>
      `;
    }
  }
</script>
