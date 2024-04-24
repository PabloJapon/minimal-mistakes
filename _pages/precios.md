---
title: "Elige el plan ideal para ti"
permalink: /precios/
layout: splash
---

# Elige tu plan ideal.

<style>
.plan-container {
  display: flex;
  justify-content: center;
}

.plan {
  width: 400px; /* Ancho deseado de cada plan */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  text-align: center;
  margin-bottom: 60px; /* Espacio inferior entre cada plan */
  margin-top: 60px;
  margin-left: 12px;
  margin-right: 12px;
}

.plan-button {
  background-color: #6699ff; /* Cambio de color */
  color: white;
  border: none;
  padding: 15px 100px;
  margin: 40px;
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
    <h2>Básico</h2>
    <h3>0€</h3>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=basico'">Empieza</button>
    <p>Gratis. Para siempre</p>
  </div>

  <div class="plan">
    <h2>Estándar</h2>
    <h3>30€</h3>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=estandar'">Empieza</button>
    <p>Este pues mejor tu sabe</p>
  </div>

  <div class="plan">
    <h2>Premium</h2>
    <h3>50€</h3>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=premium'">Empieza</button>
    <p>Y este buenisimo del to</p>
  </div>
</div>



[Go to Payment Page MD](/payment_form/)
