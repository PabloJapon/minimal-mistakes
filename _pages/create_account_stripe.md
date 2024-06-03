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
    body {
      font-family: Arial, sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
      text-align: center;
      color: #333;
    }

    input[type="text"],
    input[type="email"],
    button {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-sizing: border-box;
    }

    button {
      background-color: #6699ff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #0056b3;
    }
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
<script src="/assets/js/create-account.js"></script> <!-- Ensure the path matches the location of your JS file -->

</body>
</html>
