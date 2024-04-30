---
title: "Elige el plan ideal para ti"
permalink: /precios/
layout: splash
---

# Elige tu plan ideal.

<style>

/* Aplicar un poco de margen superior al elemento <main> */
main {
    padding-top: 200px; /* Ajusta este valor según sea necesario para evitar el solapamiento */
}
  
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
    <h2>Gratis</h2>
    <h3>0€</h3>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=Gratis'">Empieza</button>
    <p>Gratis. Para siempre</p>
  </div>

  <div class="plan">
    <h2>Pro</h2>
    <h3>30€</h3>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=Pro'">Empieza</button>
    <p>Este pues mejor tu sabe</p>
  </div>

  <div class="plan">
    <h2>Premium</h2>
    <h3>50€</h3>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=Premium'">Empieza</button>
    <p>Y este buenisimo del to</p>
  </div>
</div>



<h3> Compara los planes </h3>
<style>

.table-container {
  margin-top: 200px; /* Ajusta el margen superior según sea necesario */
}

.table-container table {
  width: 100%;
  border-collapse: collapse;
}

.table-container th, .table-container td {
  padding: 8px;
  border: 1px solid #ccc;
  text-align: left;
}
</style>

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th style="width: 40%;"></th>
        <th style="width: 20%;">Básico</th>
        <th style="width: 20%;">Estándar</th>
        <th style="width: 20%;">Pro</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Platos ilimitados</td>
        <td>v</td>
        <td>v</td>
        <td>v</td>
      </tr>
      <tr>
        <td>Parsonaliza tu marca</td>
        <td>x</td>
        <td>v</td>
        <td>v</td>
      </tr>
      <tr>
        <td>Consulta estadísticas</td>
        <td>x</td>
        <td>x</td>
        <td>v</td>
      </tr>
    </tbody>
  </table>
</div>

