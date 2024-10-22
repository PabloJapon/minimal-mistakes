---
permalink: /precios/
layout: default
---

<h1 style="margin-top: 5em; text-align: center;">Elige tu plan ideal</h1>

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
  width: 26px;
  height: 26px;
  background-color: #6699ff;
  mask: url('/assets/images/done.png') no-repeat center / contain;
}

.plan .tick-icon-yellow {
  display: inline-block;
  width: 26px;
  height: 26px;
  background-color: #ffc368;
  mask: url('/assets/images/done.png') no-repeat center / contain;
}

.fancy-label {
  width: 150px; 
  margin: 0;
  padding: 0;
  text-align: left;
  float: none;
}

.item-container {
    display: flex;
    align-items: center; /* This centers the items vertically */
    margin: 0.5em 2em; /* Adjusting margin for better spacing */
}

.item-container p {
    margin: 0;
    padding-left: 10px; /* Adds space between the icon and the text */
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
  <div class="plan" style="padding-top: 4.7em;">
    <h2 style="margin-bottom: 2em;">Gratis</h2>
    <h1 style="font-weight: normal;">0€</h1>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=Gratis'">Empieza</button>

    <div class="item-container">
      <span class="tick-icon"></span>
      <p>Feature 1 description</p>
    </div>
  </div>

  <div class="plan" style="padding: 0px 20px;">
  <p style="background-color: #ffc368;color: white; margin: 2em auto; border-radius: 4px; width: 10em;"> Recomendado </p>
    <h2 style="margin-bottom: 2em;">Básico/Pro</h2>
    <h1 style="font-weight: normal;">30€ - 50€/mes</h1>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=Pro'" style="background-color: #ffc368;">Empieza</button>
    
    <div class="item-container">
      <span class="tick-icon-yellow"></span>
      <p>Feature 2 description</p>
    </div>
  </div>

  <div class="plan" style="padding-top: 4.7em;">
    <h2 style="margin-bottom: 2em;">Premium</h2>
    <h1 style="font-weight: normal;">100€ - 150€/mes</h1>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=Premium'" style="background-color: #ffc368;">Empieza</button>
    
    <div class="item-container">
      <span class="tick-icon-yellow"></span>
      <p>Feature 3 description</p>
    </div>
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
      <tr>
        <td>Precio mensual</td>
        <td style="text-align: center;">Gratis</td>
        <td style="text-align: center;">30€ - 50€/mes</td>
        <td style="text-align: center;">100€ - 150€/mes</td>
      </tr>
      <tr>
        <td>Software completo</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>Accesos a software básico</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>Procesamiento de pagos</td>
        <td style="text-align: center;">Disponible, con tarifa 2%</td>
        <td style="text-align: center;">Disponible, con cargo 1%</td>
        <td style="text-align: center;">Disponible, sin comisión</td>
      </tr>
      <tr>
        <td>Procesamiento de pagos</td>
        <td style="text-align: center;">Disponible, con cargo</td>
        <td style="text-align: center;">Disponible, con cargo</td>
        <td style="text-align: center;">Disponible, sin cargo</td>
      </tr>
      <tr>
        <td>Imágenes en el menú</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✓</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>Personalización (colores, texto)</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">Parcial</td>
        <td style="text-align: center;">Completa</td>
      </tr>
      <tr>
        <td>Estadísticas y análisis</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>Análisis/informes</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>Fuentes personalizadas/marca completa</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✗</td>
        <td style="text-align: center;">✓</td>
      </tr>
      <tr>
        <td>Tarifa de transacción</td>
        <td style="text-align: center;">2% - 3% adicional a Stripe</td>
        <td style="text-align: center;">1% - 1.5% adicional a Stripe</td>
        <td style="text-align: center;">Ninguna, solo Stripe</td>
      </tr>
    </tbody>
  </table>
</div>
