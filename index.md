---
title: "El software que comunica clientes, camareros y cocina"
layout: splash
header:
  overlay_image: /assets/images/service.jpg
  overlay_filter: rgba(102,153,255,0.5)
---

<div style="text-align:center;">
    Descubre la herramienta digital personalizable que unifica TODAS las funciones que necesita tu establecimiento: carta digital, pedidos automáticos, pagos, comandas y análisis de datos
  </div>

  <div style="text-align:center;">
    <button class="plan-button" id="login-link" onclick="openNetlifyIdentity()">COMENZAR</button>
  </div>

  <div style="margin: 0 auto; text-align:center;">
    <video width="900" height="544" style="border-radius: 8px; max-width: 900px; max-height: 100%; width: 100%;" autoplay loop muted>
      <source src="/assets/videos/your-video.mp4" type="video/mp4">
    </video>
  </div>

  <div style="text-align:center;">
    Preguntas frecuentes
  </div>

  <div style="margin: 0 auto; text-align:center;">
    <div id="faq" class="faq" style="margin-top: 20px; margin: 0 auto;">
      <button class="accordion">¿Pregunta 1?
       <img src="/assets/images/angulo-derecho.svg" width="20" height="20" class="butImagen" style="vertical-align: middle;">
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
  </div>

  <style>
    .plan-button {
      background-color: #6699ff;
      color: white;
      border: none;
      padding: 15px 80px;
      margin: 40px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 22px;
      border-radius: 5px;
      cursor: pointer;
    }

    .faq {
      width: 100%;
      max-width: 41rem;
      margin-left: auto;
      margin-right: auto;
      margin-top: 4em;
      text-align: left;
      border-bottom: 1px solid #ccc
    }

    .faq1_question {
        border-top: 1px solid var(--gray-200);
        cursor: pointer;
        justify-content: space-between;
        align-items: center;
        padding-top: 1.5rem;
        padding-bottom: 1rem;
        display: flex;
    }

    .accordion {
      width: 100%;
      padding: 20px 20px;
      text-align: left;
      border: none;
      cursor: pointer;
      text-decoration: none;
      line-height: 40px;
      outline: none;
      border-top: 1px solid #ccc;
    }

    .butImagen {
      transition: transform 0.3s ease;
    }

    .butImagen.rotated {
      transform: rotate(180deg);
    }

    img {
      float: right;
      margin-left: 10px;
      margin-bottom: 10px;
      margin-top: 10px;
    }

    .accordion:hover {}

    .accordion:focus, .accordion:active {
      outline: none;
    }

    .active, .accordion:hover {}

    .panel {
      padding: 20px 18px;
      display: none;
      overflow: hidden;
    }
  </style>

  <script>
    var acc = document.querySelectorAll(".accordion");

    acc.forEach(function(item) {
      item.addEventListener("click", function() {
        this.classList.toggle("active");
        this.querySelector("img").classList.toggle("rotated");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
    });
  </script>