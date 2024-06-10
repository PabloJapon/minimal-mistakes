---
title: "verify-account"
permalink: /verifyAccount/
layout: splash
---

<p id="username" style="display: none;"></p> <!-- Hidden element to store username -->
<p id="plan" style="display: none;"></p> <!-- Hidden element to store plan -->

<script>
  // Netlify identity
  let usernameSpan;
  let plan;

  // Function to update username and plan
  function updateUserData(user) {
    const usernameElement = document.getElementById('username');
    const planElement = document.getElementById('plan');
    if (usernameElement && planElement) {
      usernameElement.textContent = user.user_metadata.full_name || user.email;
      planElement.textContent = user.user_metadata.plan || ''; // Assuming plan is stored in user metadata
    }
  }

  // Function to send data to server
  async function sendData(username, plan) {
    try {
      const response = await fetch("/.netlify/functions/verificar-sesion", {
        method: "POST",
        body: JSON.stringify({ username, plan }),
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
    updateUserData(user);
    sendData(user.user_metadata.full_name || user.email, user.user_metadata.plan); // Send username and plan to server
  });

  // Initial data send when the page loads
  window.addEventListener('DOMContentLoaded', () => {
    const usernameElement = document.getElementById('username');
    const planElement = document.getElementById('plan');
    if (usernameElement.textContent.trim() !== '' && planElement.textContent.trim() !== '') {
      sendData(usernameElement.textContent, planElement.textContent);
    }
  });
</script>
