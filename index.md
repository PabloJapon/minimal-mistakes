---
title: "Slogan descriptivo"
layout: splash
header:
  overlay_image: /assets/images/service.jpg
  overlay_filter: rgba(102,153,255,0.5)
excerpt: "Descripción corta"
intro: 
  - excerpt: 'Nullam suscipit et nam, tellus velit pellentesque at malesuada, enim eaque. Quis nulla, netus tempor in diam gravida tincidunt, *proin faucibus* voluptate felis id sollicitudin. Centered with `type="center"`'
---

# Bienvenido a mi sitio

Esto es el contenido principal de mi página de inicio.

<iframe width="560" height="315" src="https://www.youtube.com/embed/4xd4k43obXE?controls=1&showinfo=0&modestbranding=1" frameborder="0" allowfullscreen></iframe>

<div id="faq" class="faq">
  <button class="accordion">¿Pregunta 1?
   <img src="/assets/images/angulo-derecho.svg" width="20" height="20" style="vertical-align: middle;">
  </button>
  <div class="panel">
    <p>Respuesta a la pregunta 1.</p>
  </div>

  <button class="accordion">¿Pregunta 2?
   <img src="/assets/images/angulo-derecho.svg" width="20" height="20" style="vertical-align: middle;">
  </button>
  <div class="panel">
    <p>Respuesta a la pregunta 2.</p>
  </div>

  <!-- Agrega más botones y respuestas aquí según sea necesario -->
</div>

<style>
  .faq {
    width: 800px;
    text-align: left;
    border-bottom: 1px solid #ccc
  }

  /* Estilo para los botones */
  .accordion {
    padding: 20px 20px;
    padding-left: 20px;
    padding-right: 20px;
    width: 780px;
    text-align: left;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;
    line-height: 40px;
    outline: none;
    border-top: 1px solid #ccc;
  }

  /* Estilo CSS para alinear la imagen a la derecha */
  img {
    float: right; /* Alinea la imagen a la derecha */
    margin-left: 10px; /* Agrega un margen izquierdo para separar la imagen del texto */
    margin-bottom: 10px; /* Espacio inferior entre cada plan */
    margin-top: 10px;
  }

  .accordion img {
    transition: transform 0.3s ease;
  }

  /* Asegura que la rotación de la imagen se aplique correctamente */
  #faq .accordion.clicked img {
    transform: rotate(180deg);
  }

  .accordion:hover {
    /* background-color: #f4f4f4; */
  }
  .accordion:focus, .boton:active {
    /* background-color: #f4f4f4 */; 
    outline: none; /* Quita el borde azul al hacer foco en el botón */
  }

  .active, .accordion:hover {
    /*background-color: #ccc;*/
  }

  /* Estilo para las secciones de respuestas */
  .panel {
    padding: 0 18px;
    /* background-color: white; */
    display: none;
    overflow: hidden;
  }

</style>


<script>
  var acc = document.querySelectorAll(".accordion");

  acc.forEach(function(item) {
    item.addEventListener("click", function() {
      this.classList.toggle("active");
      this.querySelector("img").classList.toggle("clicked");

      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  });
</script>
