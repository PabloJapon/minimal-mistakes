---
title: "Log Out"
permalink: /logout/
---

<!-- Your logout content here -->
<p>This is your logout page.</p>
<button onclick="logout()">Logout</button>

<script>
  function logout() {
    netlifyIdentity.logout();
  }
</script>
