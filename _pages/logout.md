---
title: "Log Out"
permalink: /logout/
---

<!-- Your logout content here -->
<p>This is your logout page.</p>
<button onclick="logout()">Logout</button>

<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
<script>
  function logout() {
    netlifyIdentity.logout();
  }
</script>
