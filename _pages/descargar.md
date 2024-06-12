---
title: "Descargar"
permalink: /descargar/
layout: splash
---

<h2 style="text-align: center; margin-top: 4em;">Descarga los softwares de Gastrali para 
  <div class="dropdown" style="display: inline-block;">
    <button class="dropbtn" id="dropdownButton">
      <span id="osText">Windows</span>
      <img src="/assets/images/angulo-hacia-abajo.png" width="20" height="20" style="vertical-align: middle; margin-left: 20px;">
    </button>
    <div class="dropdown-content">
      <a href="#" onclick="selectOS('Windows')">Windows</a>
      <a href="#" onclick="selectOS('Linux')">Linux</a>
      <a href="#" onclick="selectOS('Mac')">Mac</a>
    </div>
  </div>
</h2>

<style>
img {
  float: right;
  margin-left: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}
  
.plan-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.plan {
  width: 400px; /* Ancho deseado de cada plan */
  padding: 20px;
  border-left: 1px solid #ccc;
  text-align: center;
  margin-bottom: 60px; /* Espacio inferior entre cada plan */
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  padding: 15px 80px;
  margin: 40px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
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

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #6699ff;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  font-size: 16px;
}

.dropdown-content a:hover {
  background-color: #4c80d9;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: #4c80d9;
}

.dropbtn {
  background-color: #6699ff;
  color: white;
  padding: 10px 30px 10px 50px; /* Increased padding to accommodate the image */
  margin-left: 0.2em;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
}

.dropbtn img {
  margin-left: 20px;
  vertical-align: middle;
}
</style>

<div class="plan-container">
  <div class="plan" style="border-left: 0px;">
    <h2>App camareros/clientes</h2>
    <p>Esta App móvil sirve para que los camareros supervisen las comandas, y puedan comunicarse con cocineros y clientes</p>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=Gratis'">Ir a Playstore</button>
    <img src="/assets/images/unsplash-gallery-image-1.jpg" alt="">
  </div>

  <div class="plan">
    <h2>Software para cocinas</h2>
    <p>Este es el software que debes instalar en una pantalla de la cocina para que tus cocineros vean las comandas</p>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=Pro'">Descargar</button>
    <img src="/assets/images/unsplash-gallery-image-2.jpg" alt="">
  </div>

  <div class="plan">
    <h2>Software para responsable</h2>
    <p>Este es el software que instalará el responsable designado, con el que podrá personalizar la app, crear y editar el menú y consultar las estadísticas y datos</p>
    <button class="plan-button" onclick="location.href='/payment_form/?plan=Premium'">Descargar</button>
    <img src="/assets/images/unsplash-gallery-image-3.jpg" alt="">
  </div>
</div>

<script>
function selectOS(os) {
  document.getElementById('osText').textContent = os;
}
</script>
