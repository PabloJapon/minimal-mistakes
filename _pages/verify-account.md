---
title: "verify-account"
permalink: /verifyAccount/
layout: splash
---

<p id="username" style="display: none;"></p> <!-- Hidden element to store username -->

<script>
  // Netlify identity
  let usernameSpan;

  // Function to update username
  function updateUsername(user) {
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
      usernameElement.textContent = user.user_metadata.full_name || user.email;
    }
  }

  // Function to send data to server
  async function sendData(username) {
    try {
      const response = await fetch("/.netlify/functions/verificar-sesion", {
        method: "POST",
        body: JSON.stringify({ message: username, "venga" }),
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

  // Event listener for login event
  netlifyIdentity.on('login', user => {
    updateUsername(user);
    sendData(user.user_metadata.full_name || user.email); // Send username to server
  });

  // Initial data send when the page loads
  window.addEventListener('DOMContentLoaded', () => {
    const usernameElement = document.getElementById('username');
    if (usernameElement.textContent.trim() !== '') {
      sendData(usernameElement.textContent);
    }
  });
</script>
