---
title: "Log In"
permalink: /login/
---

# Login Page

This is your login page.

<button data-netlify-identity-button>Login</button>

<script>
  // Netlify Identity script and event handling
  netlifyIdentity.on('login', user => {
    console.log('User logged in', user);
  });

  netlifyIdentity.on('logout', () => {
    console.log('User logged out');
  });
</script>
