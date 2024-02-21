---
title: "Log Out"
permalink: /logout/
---

<!-- Your logout content here -->
<button onclick="openLoginModal()">Login</button>

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
