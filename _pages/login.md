---
title: "Log In"
permalink: /login/
---

<!-- Your login content here -->
<p>This is your login page.</p>
<button onclick="openLoginModal()">Login</button>

<script>
  // Netlify Identity script and event handling
  netlifyIdentity.on('login', user => {
    console.log('User logged in', user);
    window.user_authenticated = true; // Actualiza el estado de autenticación
    // Additional actions after login if needed
  });

  netlifyIdentity.on('logout', () => {
    console.log('User logged out');
    window.user_authenticated = false; // Actualiza el estado de autenticación
    // Additional actions after logout if needed
  });

  function openLoginModal() {
    netlifyIdentity.open('login');
  }
</script>
