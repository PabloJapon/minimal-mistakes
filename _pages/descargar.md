---
permalink: /descargar/
layout: splash
---

<h2> Descarga los softwares de Gastrali para</h2>

<style>

/* Aplicar un poco de margen superior al elemento <main> */
main {
    padding-top: 1000px; /* Ajusta este valor según sea necesario para evitar el solapamiento */
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

.plan-button2 {
  background-color: #6699ff; /* Cambio de color */
  color: white;
  border: none;
  padding: 10px 50px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

.plan-button2:hover {
  background-color: #4c80d9; /* Cambio de color en el hover */
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
  
  .table-container {
  margin-top: 60px; /* Ajusta el margen superior según sea necesario */
}

.table-container table {
  border-collapse: collapse;
   border: none; /* elimina los bordes de la tabla */
}

 .table-container td {
  padding: 8px;
  border: 1px solid #ccc;
  text-align: left;
}

  .table-container th {
  padding: 8px;
  background-color: transparent !important; /* Fondo transparente */
  border: none; /* Sin bordes */
}

.table-container thead th {
  background-color: transparent !important; /* Fondo transparente */
}
  
  
  .table-container tbody tr:nth-child(even) {
  background-color: #e0e0e0; /* Cambia el color de fondo para las filas pares */
}

/* Elimina los bordes de las celdas exteriores */
.table-container th:first-child,
.table-container td:first-child {
  border-left: none;
}

.table-container th:last-child,
.table-container td:last-child {
  border-right: none;
}

  
/* Elimina la última línea horizontal */
.table-container tr:last-child th,
.table-container tr:last-child td {
  border-bottom: none;
}

/* Elimina la primera línea horizontal */
.table-container tr:first-child th,
.table-container tr:first-child td {
  border-top: none;
}

  /* Elimina la segunda línea horizontal */
.table-container tr:nth-child(2) th,
.table-container tr:nth-child(2) td {
  border-top: none;
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

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th style="width: 400px; "></th>
        <th style="width: 200px;text-align: center;">
          <h2>Básico</h2>
          <button class="plan-button2" onclick="location.href='/payment_form/?plan=Gratis'">Empieza</button>  
        </th>
        <th style="width: 200px;text-align: center;">
        <h2>Estándar</h2>
          <button class="plan-button2" onclick="location.href='/payment_form/?plan=Gratis'">Empieza</button>    
        </th>
        <th style="width: 200px;text-align: center;">
          <h2>Pro</h2>
          <button class="plan-button2" onclick="location.href='/payment_form/?plan=Gratis'">Empieza</button>  
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="width: 400px;">Platos ilimitados</td>
        <td style="width: 200px;text-align: center;">v</td>
        <td style="width: 200px;text-align: center;">v</td>
        <td style="width: 200px;text-align: center;">v</td>
      </tr>
      <tr>
        <td style="width: 400px;">Parsonaliza tu marca</td>
        <td style="width: 200px;text-align: center;">x</td>
        <td style="width: 200px;text-align: center;">v</td>
        <td style="width: 200px;text-align: center;">v</td>
      </tr>
      <tr>
        <td style="width: 400px;">Consulta estadísticas</td>
        <td style="width: 200px;text-align: center;">x</td>
        <td style="width: 200px;text-align: center;">x</td>
        <td style="width: 200px;text-align: center;">v</td>
      </tr>
    </tbody>
  </table>
</div>

