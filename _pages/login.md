---
title: "Log In"
permalink: /login/
date: 2016-02-24T03:02:20+00:00
---

<!-- Your login content here -->
<h1>Login Page</h1>
<p>This is your login page.</p>
<button data-netlify-identity-button>Login</button>

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
</script>