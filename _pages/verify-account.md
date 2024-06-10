---
title: "verify-account"
permalink: /verifyAccount/
layout: splash
---

<script>
  // Netlify identity
  let usernameSpan;

  netlifyIdentity.on('login', user => {
    usernameSpan = document.getElementById('username').textContent;
    sendData();
  });

  async function sendData() {
    try {
      const response = await fetch("/.netlify/functions/verificar-sesion", {
        method: "POST",
        body: JSON.stringify({ message: usernameSpan }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response from server:", responseData);
      } else {
        console.error("Failed to send data to server.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
</script>
