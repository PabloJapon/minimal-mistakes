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

<div class="faq">
  <button class="accordion">¿Pregunta 1?</button>
  <div class="panel">
    <p>Respuesta a la pregunta 1.</p>
  </div>

  <button class="accordion">¿Pregunta 2?</button>
  <div class="panel">
    <p>Respuesta a la pregunta 2.</p>
  </div>

  <!-- Agrega más botones y respuestas aquí según sea necesario -->
</div>

<style>
  .faq {
    width: 800px;
    padding: 10px;
    text-align: left;
  }

  /* Estilo para los botones */
  .accordion {
    padding: 0px 0px;
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
    border-top: 1px solid #ccc; /* Línea separadora entre las preguntas */
  }

  /* Añade una línea adicional arriba de la primera pregunta */
  .accordion:first-child {
    /* border-top: 1px solid #ccc; */
  }

  /* Añade una línea adicional debajo de la última pregunta */
  .accordion:last-child {
    /* border-bottom: 1px solid #ccc; */
  }


  .accordion:hover {
    /* background-color: #f4f4f4; */
  }
  .accordion:focus, .boton:active {
    /* background-color: #f4f4f4 */; /* Cambia el color de fondo al hacer foco o clic en el botón */
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
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }
</script>
