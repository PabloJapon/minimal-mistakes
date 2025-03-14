---
title: "verify-account"
permalink: /verifyAccount/
layout: splash
---

<p id="username" style="display: none;"></p> <!-- Hidden element to store username -->

<!-- Add some top margin to the message element to avoid being hidden behind the masthead -->
<p id="loginMessage" style="margin-top: 100px;"></p> <!-- Adjust the 100px value as needed -->

<script>
  // Function to generate a random alphanumeric ID
  function generateRandomID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // Function to add or update ID in user metadata
  function addIDToUserMetadata(user) {
    if (!user.user_metadata.id) { // Check if the ID already exists
      const newID = generateRandomID(6); // Generate a random ID with 6 characters
      const updatedMetadata = {
        ...user.user_metadata,
        id: newID
      };

      user.update({
        data: updatedMetadata
      }).then(() => {
        console.log('User metadata updated successfully with new ID:', updatedMetadata);
      }).catch(error => {
        console.error('Error updating user metadata:', error);
      });
    } else {
      console.log('User already has an ID:', user.user_metadata.id);
    }
  }

  // Function to update username
  function updateUsername(user) {
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
      usernameElement.textContent = user.user_metadata.full_name || user.email;
    }
  }

  // Function to send data to server
  async function sendData(username, plan, id) {
    try {
      if (!username) {
        // If user is not logged in, display a message instead of sending data
        console.log("User not logged in");
        document.getElementById('loginMessage').textContent = "Inicia sesión para usar el software responsable";
        return;
      }

      // Update message to show data is being sent
      document.getElementById('loginMessage').textContent = "Enviando datos...";

      // Send POST request to server
      const response = await fetch("/.netlify/functions/verificar-sesion", {
        method: "POST",
        body: JSON.stringify({ message: username, subscription_plan: plan, id: id }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response from server:", responseData);

        // Show success message once the server confirms
        document.getElementById('loginMessage').textContent = "Ya puedes cerrar esta ventana, inicio de sesión válido.";
      } else {
        // If the response is not OK, show error message
        console.error("Failed to send data to server.");
        document.getElementById('loginMessage').textContent = "Error al verificar. Inténtalo de nuevo.";
      }
    } catch (error) {
      // Catch any network errors or other unexpected errors
      console.error("Error:", error);
      document.getElementById('loginMessage').textContent = "Error de conexión. Por favor, inténtalo de nuevo más tarde.";
    }
  }

  // Function to fetch subscription plan (product name)
  function fetchSubscriptionPlan(email) {
    return fetch('/.netlify/functions/server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'get_subscription_plan', email: email })
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.product_name) {
        updateSubscriptionPlan(data.product_name); // Update UI with product name
        return data.product_name; // Return product name for further use
      } else {
        console.error('Subscription plan (product name) not found in response:', data);
        return null;
      }
    })
    .catch(error => {
      console.error('Error fetching subscription plan:', error);
      return null;
    });
  }
  
  // Function to update the UI with the subscription plan
  function updateSubscriptionPlan(productName) {
    const subscriptionElement = document.getElementById('subscription-plan');
    if (subscriptionElement) {
      subscriptionElement.textContent = `${productName}`;
    }
  }
  
  // Event listener for login event
  netlifyIdentity.on('login', async (user) => {
    addIDToUserMetadata(user); // Ensure user has an ID
    const id = user.user_metadata.id;
    const username = user ? (user.user_metadata.full_name || user.email) : null;
  
    try {
      // Fetch the updated subscription plan dynamically
      const plan = await fetchSubscriptionPlan(user.email);
  
      updateUsername(user);
      sendData(username, plan, id); // Send username, updated plan, and id to server
    } catch (error) {
      console.error('Error fetching subscription plan:', error);
    }
  });
</script>

<!-- Message element to display login prompt or success message -->
<p id="loginMessage"></p>
