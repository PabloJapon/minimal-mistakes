---
title: Contacto
permalink: /contacto/
---

<!-- markdownlint-disable MD033 -->
<style>
  form {
    max-width: 600px;
    margin: 0 auto;
    padding: 1em;
    background: #f9f9f9;
    border-radius: 5px;
  }
  form p {
    margin-bottom: 1em;
  }
  label {
    margin-bottom: .5em;
    color: #333333;
    display: block;
  }
  input, textarea {
    border: 1px solid #CCCCCC;
    padding: .5em;
    font-size: 1em;
    width: 100%;
    box-sizing: border-box;
    border-radius: 4px;
  }
  button {
    padding: 0.7em;
    color: #fff;
    background-color: #007BFF;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
  }
  button:hover {
    background-color: #0056b3;
  }
</style>

<form name="contact" action="/_pages/success.html" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <p>
    <label for="name">Tu Nombre:</label><br />
    <input type="text" id="name" name="name" required />
  </p>
  <p>
    <label for="email">Tu Correo Electrónico:</label><br />
    <input type="email" id="email" name="email" required />
  </p>
  <p>
    <label for="message">Mensaje:</label><br />
    <textarea id="message" name="message" rows="5" required></textarea>
  </p>
  <p>
    <button type="submit">Enviar</button>
  </p>
</form>
