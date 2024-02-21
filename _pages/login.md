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
  });

  netlifyIdentity.on('logout', () => {
    console.log('User logged out');
    // Additional actions after logout if needed
  });

  function openLoginModal() {
    netlifyIdentity.open('login');
  }
</script>
