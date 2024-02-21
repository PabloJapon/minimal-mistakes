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
    updateLoginLink(user);
  });

  netlifyIdentity.on('logout', () => {
    console.log('User logged out');
    // Additional actions after logout if needed
    updateLoginLink(null);
  });

  function toggleLogin() {
    netlifyIdentity.open('login');
  }

  function updateLoginLink(user) {
    const loginLink = document.getElementById('login-link');

    if (loginLink) {
      if (user) {
        // Usuario autenticado, actualiza el texto del enlace
        loginLink.innerText = 'Log Out';
      } else {
        // Usuario no autenticado, restaura el texto del enlace
        loginLink.innerText = 'Log In';
      }
    }
  }
</script>
