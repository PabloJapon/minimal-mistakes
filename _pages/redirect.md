---
title: Redirect
permalink: /redirect/
layout: splash
---

<script>
    // Extract the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    // Store the token in local storage
    if (token) {
        localStorage.setItem('authToken', token);
        window.close(); // Close the browser window
    }
</script>
<p>Redirecting...</p>
