---
layout: default
permalink: /create_account_stripe/
---

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Crear Cuenta Conectada</title>
  <script src="https://js.stripe.com/v3/"></script>
  <style>
    /* Add your CSS styles here */
  </style>
</head>
<body>

<div class="container">
  <h1>Crear Cuenta Conectada</h1>
  <form id="connected-account-form">
    <label for="email">Correo Electrónico:</label>
    <input type="email" id="email" name="email" required><br>
    <label for="business_name">Nombre del Negocio:</label>
    <input type="text" id="business_name" name="business_name" required><br>
    <button type="submit">Crear Cuenta</button>
  </form>
</div>

<!-- Include the JavaScript file -->
<script src="/create-account.js"></script>

</body>
</html>
