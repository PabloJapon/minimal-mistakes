---
title: "El software que comunica clientes, camareros y cocina"
layout: splash
header:
  overlay_image: /assets/images/page-header-teaser.png
  #overlay_filter: rgba(102,153,255,0.5)
---

<div style="text-align:center;">
  Descubre la herramienta digital personalizable que unifica TODAS las funciones que necesita tu establecimiento: carta digital, pedidos automáticos, pagos, comandas y análisis de datos
</div>

<div style="text-align:center;">
  <button class="plan-button" id="login-link" onclick="openNetlifyIdentity()">COMENZAR</button>
</div>

<div style="margin: 0 auto; text-align:center;">
  <video style="border-radius: 20px; width: 100%; height: auto;" autoplay loop muted>
    <source src="/assets/videos/your-video.mp4" type="video/mp4">
  </video>
</div>

<div class="plan-container">
  <div class="plan" style="border-left: 0px;">
    <video width="900" height="544" style="border-radius: 40px; width: 100%; height: auto; padding: 1em;" autoplay loop muted>
      <source src="/assets/videos/your-video.mp4" type="video/mp4">
    </video>
    <div class="plan" style="display: flex; flex-direction: column;">
      <h2>Actualiza tu menú automáticamente y en cualquier momento</h2>
      <p>Personalízalo usando las imágenes, colores e iconos que más te representen. Y si un día no puedes servir un plato, no te preocupes, desactívalo para que no aparezca en el menú!</p>
    </div>
  </div>

  <div class="plan">
    <div class="plan" style="display: flex; flex-direction: column;">
      <h2>Máxima sincronización, ¡no pierdas más tiempo!</h2>
      <p>Cuando un cliente realice un pedido, este irá directamente a las pantallas de la cocina, donde los cocineros tan solo haciendo un click, harán saber al camarero cuando puede ir a recogerlo.</p>
    </div>
    <video width="900" height="544" style="border-radius: 40px; width: 100%; height: auto; padding: 1em;" autoplay loop muted>
      <source src="/assets/videos/your-video.mp4" type="video/mp4">
    </video>
  </div>

  <div class="plan" style="border-left: 0px;">
    <video width="900" height="544" style="border-radius: 40px; width: 100%; height: auto; padding: 1em;" autoplay loop muted>
      <source src="/assets/videos/your-video.mp4" type="video/mp4">
    </video>
    <div class="plan" style="display: flex; flex-direction: column;">
      <h2>Saca el mayor provecho a tus datos</h2>
      <p>Consulta estadísticas de todo tipo: a qué horas generas más dinero, cuál fue el plato más pedido la semana pasada, ¿tienen tus postres el precio óptimo?</p>
    </div>
  </div>

  <div class="plan">
    <div class="plan" style="display: flex; flex-direction: column;">
      <h2>¡Sin líos!</h2>
      <p>¿Tienes varios menús? No te preocupes, añádelos todos y tú decides cuándo se muestra cada uno.</p>
    </div>
    <video width="900" height="544" style="border-radius: 40px; width: 100%; height: auto; padding: 1em;" autoplay loop muted>
      <source src="/assets/videos/your-video.mp4" type="video/mp4">
    </video>
  </div>
</div>



<div style="text-align:center; margin-top:7em">
  ¿Dudas? No te las guardes, pregúntanos.
</div>

<form name="contact" action="/_pages/success.html" method="POST" data-netlify="true" class="contact-form">
  <input type="hidden" name="subject" id="subject" value="Mensaje de (nombre)" />
  
  <p>
    <label for="name">Nombre:</label><br />
    <input type="text" id="name" name="name" required />
  </p>
  
  <p>
    <label for="email">Correo Electrónico:</label><br />
    <input type="email" id="email" name="email" required />
  </p>
  
  <p>
    <label for="phone">Teléfono:</label><br />
    <input type="tel" id="phone" name="phone" required />
  </p>
  
  <p>
    <label for="message">Mensaje:</label><br />
    <textarea id="message" name="message" rows="5" required></textarea>
  </p>
  
  <p style="text-align: center;">
    <button type="submit">Enviar</button>
  </p>
</form>

<script>
  document.querySelector('form').addEventListener('submit', function(event) {
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var subjectField = document.getElementById('subject');
    subjectField.value = `Mensaje de ${name} - Teléfono: ${phone}`;
  });
</script>



<div style="text-align:center; margin: 2em;">
  Preguntas frecuentes
</div>

<div style="margin: 4em auto; text-align:center;">
  <div id="faq" class="faq" style="margin-top: 20px; margin: 0 auto;">
    <button class="accordion">¿Pregunta 1?
      <img src="/assets/images/angulo-hacia-abajo.png" width="20" height="20" class="butImagen" style="vertical-align: middle;">
    </button>
    <div class="panel">
      <p>Respuesta a la pregunta 1.</p>
    </div>

    <button class="accordion">¿Pregunta 2?
      <img src="/assets/images/angulo-hacia-abajo.png" width="20" height="20" class="butImagen" style="vertical-align: middle;">
    </button>
    <div class="panel">
      <p>Respuesta a la pregunta 2.</p>
    </div>

    <button class="accordion">¿Pregunta 3?
      <img src="/assets/images/angulo-hacia-abajo.png" width="20" height="20" class="butImagen" style="vertical-align: middle;">
    </button>
    <div class="panel">
      <p>Respuesta a la pregunta 3.</p>
    </div>

    <button class="accordion">¿Pregunta 4?
      <img src="/assets/images/angulo-hacia-abajo.png" width="20" height="20" class="butImagen" style="vertical-align: middle;">
    </button>
    <div class="panel">
      <p>Respuesta a la pregunta 4.</p>
    </div>
  </div>
</div>

<style>
.plan-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: center;
}

.plan {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}

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
  border-bottom: 1px solid #ccc;
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

.accordion:focus, .accordion:active {
  outline: none;
}

.panel {
  padding: 0 18px;
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease;
}

.panel.open {
  height: auto;
}
</style>

<script>
  var acc = document.querySelectorAll(".accordion");

  acc.forEach(function(item) {
    item.addEventListener("click", function() {
      this.classList.toggle("active");
      this.querySelector("img").classList.toggle("rotated");

      var panel = this.nextElementSibling;
      if (panel.style.height) {
        panel.style.height = null;
      } else {
        panel.style.height = panel.scrollHeight + "px";
      }
    });
  });
</script>
