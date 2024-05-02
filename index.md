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
    border-top: 1px solid #ccc; /* Línea separadora entre las preguntas */
    background-image: url('/assets/images/angulo-derecho.svg'); /* Agrega la imagen de chevron como fondo */
    background-repeat: no-repeat; /* Evita que la imagen se repita */
    background-position: right 20px center; /* Ajusta la posición de la imagen a la derecha */background-size: 20px;
    transition: all 0.3s ease; /* Agrega una transición suave */
}

/* Define the animation */
@keyframes rotate180 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
}

/* Aplica la animación cuando se hace clic */
.accordion.clicked {
  animation: rotate180 0.3s ease;
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
      this.classList.toggle("clicked"); // Add or remove the "clicked" class
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }
</script>
