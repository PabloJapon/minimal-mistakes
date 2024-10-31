---
title: "Cambiar contraseña"
permalink: /cambioContraseña/
layout: splash
---

<style>
  /* Basic styles for the form */
  #change-password-form {
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input[type="password"] {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    background-color: #28a745;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #218838;
  }
</style>

<div id="change-password-container">
  <h2>Cambiar contraseña</h2>
  <form id="change-password-form">
    <label for="current-password">Contraseña actual:</label>
    <input type="password" id="current-password" required>
    
    <label for="new-password">Nueva contraseña:</label>
    <input type="password" id="new-password" required>
    
    <button type="submit">Cambiar contraseña</button>
  </form>
</div>

<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
<script>
  // Initialize the Netlify Identity Widget
  netlifyIdentity.init();

  document.getElementById('change-password-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;

    // Get the current user
    const user = netlifyIdentity.currentUser();

    if (user) {
      user.authenticate(currentPassword).then(() => {
        // If authentication is successful, change the password
        user.update({ password: newPassword })
          .then(() => {
            alert('Contraseña cambiada con éxito');
          })
          .catch((error) => {
            alert('Error al cambiar la contraseña: ' + error.message);
          });
      }).catch((error) => {
        alert('La contraseña actual es incorrecta: ' + error.message);
      });
    } else {
      alert('Usuario no conectado');
    }
  });
</script>
