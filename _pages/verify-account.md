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
  async function sendData(username, plan) {
    try {
      if (username === "notUserLoggedIn") {
        // If user is not logged in, display a message instead of sending data
        document.getElementById('loginMessage').textContent = "Inicia sesión para usar el software responsable";
        return;
      }
      
      const response = await fetch("/.netlify/functions/verificar-sesion", {
        method: "POST",
        body: JSON.stringify({ message: username, subscription_plan: plan }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response from server:", responseData);
        document.getElementById('loginMessage').textContent = "Usuario verificado. Ya puedes volver a tu software responsable";
      } else {
        console.error("Failed to send data to server.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Event listener for login event
  netlifyIdentity.on('login', user => {
    const username = user.user_metadata.full_name || user.email;
    const plan = user.user_metadata.subscription_plan;
    updateUsername(user);
    sendData(username, plan); // Send username and plan to server
  });

  // Initial data send when the page loads
  window.addEventListener('DOMContentLoaded', () => {
    const usernameElement = document.getElementById('username');
    if (usernameElement.textContent.trim() !== '') {
      // Assume a default plan if none is provided
      sendData(usernameElement.textContent, 'default_plan');
    } else {
      sendData("notUserLoggedIn", 'no_plan'); // Send default message if no user logged in
    }
  });
</script>

<!-- Message element to display login prompt -->
<p id="loginMessage"></p>
