---
title: "Elige el plan ideal para ti"
permalink: /precios/
---

# Elige tu plan ideal.

<style>
.plan-container {
  display: flex;
  justify-content: space-around;
}

.plan {
  width: 300px; /* Ancho deseado de cada plan */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}

.plan h2 {
  margin-bottom: 10px;
}

.plan-button {
  background-color: #6699ff; /* Cambio de color */
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

.plan-button:hover {
  background-color: #4c80d9; /* Cambio de color en el hover */
}
</style>

<div class="plan-container">
  <div class="plan">
    <h2>Plan Básico</h2>
    <p>Precio: $10/mes</p>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=basico'">Elegir Plan</button>
  </div>

  <div class="plan">
    <h2>Plan Estándar</h2>
    <p>Precio: $20/mes</p>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=estandar'">Elegir Plan</button>
  </div>

  <div class="plan">
    <h2>Plan Premium</h2>
    <p>Precio: $30/mes</p>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=premium'">Elegir Plan</button>
  </div>
</div>



[Go to Payment Page MD](/payment_form/)
