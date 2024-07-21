---
permalink: /precios/
layout: default
---

<h2 style="margin-top: 5em; text-align: center;">Elige tu plan ideal</h2>

<style>
img {
  float: right;
  margin: 10px 0 10px 10px;
}

.plan-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.plan {
  width: 380px;
  padding: 60px 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  text-align: center;
  margin: 60px 14px;
}

.plan-button, .plan-button2 {
  background-color: #6699ff;
  color: white;
  border: none;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  border-radius: 5px;
  cursor: pointer;
}

.plan-button {
  padding: 15px 100px;
  font-size: 20px;
  margin: 30px;
}

.plan-button2 {
  padding: 10px 50px;
  font-size: 16px;
}

.plan-button:hover, .plan-button2:hover {
  background-color: #4c80d9;
}

.plan .tick-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: #4c80d9;
  mask: url('tick-icon.svg') no-repeat center / contain; /* Replace with actual tick icon path */
  margin-right: 8px;
}

.plan-container .plan:nth-child(1) {
  border-color: #6699ff;
}

.plan-container .plan:nth-child(2) {
  border-color: #ffc368;
}

.plan-container .plan:nth-child(3) {
  border-color: #081655;
  background: #081655;
}

.plan-container .plan:nth-child(3) h2, .plan-container .plan:nth-child(3) h1, .plan-container .plan:nth-child(3) p {
  color: white;
}

.plan-container .plan:nth-child(3) .plan-button {
  background-color: #ffc368;
}

.table-container {
  margin-top: 60px;
}

.table-container table {
  border-collapse: collapse;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.table-container td, .table-container th {
  padding: 8px;
}

.table-container td {
  border: 1px solid #ccc;
  text-align: left;
}

.table-container thead th {
  background-color: transparent !important;
  border: none;
}

.table-container tbody tr:nth-child(even) {
  background-color: #e0e0e0;
}

.table-container th:first-child, .table-container td:first-child {
  border-left: none;
}

.table-container th:last-child, .table-container td:last-child {
  border-right: none;
}

.table-container tr:last-child th, .table-container tr:last-child td {
  border-bottom: none;
}

.table-container tr:first-child th, .table-container tr:first-child td {
  border-top: none;
}

.table-container tr:nth-child(2) th, .table-container tr:nth-child(2) td {
  border-top: none;
}
</style>

<div class="plan-container">
  <div class="plan">
    <h2 style="margin-bottom: 2em;">Gratis</h2>
    <h1 style="font-weight: normal;">0€</h1>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=Gratis'">Empieza</button>
    <p style="text-align: left; margin-left: 2em;">
      <span class="tick-icon"></span>Gratis. Para siempre
    </p>
  </div>

  <div class="plan">
    <h2 style="margin-bottom: 2em;">Pro</h2>
    <h1 style="font-weight: normal;">0€</h1>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=Pro'" style="background-color: #ffc368;">Empieza</button>
    <p style="text-align: left; margin-left: 2em;">
      <span class="tick-icon"></span>Este pues mejor tu sabe
    </p>
  </div>

  <div class="plan">
    <h2 style="margin-bottom: 2em;">Premium</h2>
    <h1 style="font-weight: normal;">0€</h1>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=Premium'" style="background-color: #ffc368;">Empieza</button>
    <p style="text-align: left; margin-left: 2em;">
      <span class="tick-icon"></span>Y este buenisimo del to
    </p>
  </div>
</div>

<h3 style="text-align: center;">Compara los planes</h3>

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th style="width: 400px;"></th>
        <th style="width: 200px; text-align: center;">
          <h2>Básico</h2>
          <button class="plan-button2" onclick="location.href='/payment_form/?plan=Gratis'">Empieza</button>
        </th>
        <th style="width: 200px; text-align: center;">
          <h2>Estándar</h2>
          <button class="plan-button2" onclick="location.href='/payment_form/?plan=Gratis'">Empieza</button>
        </th>
        <th style="width: 200px; text-align: center;">
          <h2>Pro</h2>
          <button class="plan-button2" onclick="location.href='/payment_form/?plan=Gratis'">Empieza</button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Platos ilimitados</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>Personaliza tu marca</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>Consulta estadísticas</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✓</td>
      </tr>
    </tbody>
  </table>
</div>
