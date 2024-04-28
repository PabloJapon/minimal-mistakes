---
title: "Mi Cuenta"
permalink: /miCuenta/
layout: single
---

<h1> ¡Bienvenido, <span id="username"></span>! </h1>


<style>

.plan {
  width: 800px; /* Ancho deseado de cada plan */
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  text-align: left;
  margin-bottom: 20px; /* Espacio inferior entre cada plan */
  margin-top: 0px;
  margin-left: 0px;
  margin-right: 12px;
}
  
.linea {
  width: 760px;
  height: 1px;
  background: linear-gradient(to right, #ccc 0%, #ccc 100%, transparent 50%, transparent 100%);
  margin-bottom: 5px; /* Espacio inferior entre cada plan */
  margin-top: 5px;
  margin-right: 20px;
}

/* Estilo CSS para alinear la imagen a la derecha */
img {
  float: right; /* Alinea la imagen a la derecha */
  margin-left: 10px; /* Agrega un margen izquierdo para separar la imagen del texto */
  /*margin-top: 10.125px;*/
  margin-bottom: 15px; /* Espacio inferior entre cada plan */
  margin-top: 15px;
}

.boton {
  display: inline-block;
  padding: 0px 0px;
  padding-left: 20px; /* Añade un margen a la izquierda del texto dentro del botón */
  padding-right: 20px; /* Añade un margen a la izquierda del texto dentro del botón */
  width: 790px; /* Establece el ancho deseado para el botón */
  text-align: left; /* Alinea el texto a la izquierda dentro del botón */
  background: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  line-height: 50px; /* Centra verticalmente el texto */
}

.boton:hover {
  background-color: #c3c3c3;
}
  
</style>



Mi cuenta 

<div class="plan">
  <h2>Plan Estándar</h2>
  <h6>Próximo pago: 27 mayo 2024</h6>
</div>



Acciones

<div class="plan">
  <button class="boton">
  Cambiar de plan
  <img src="/assets/images/angulo-derecho.svg" width="20" height="20" style="vertical-align: middle;">
  </button>
  <div class="linea"></div>
  <button class="boton">
    Administrar formas de pago
    <img src="/assets/images/angulo-derecho.svg" width="20" height="20" style="vertical-align: middle;">
  </button>
  <div class="linea"></div>
  <button class="boton">
    Editar datos del perfil
    <img src="/assets/images/angulo-derecho.svg" width="20" height="20" style="vertical-align: middle;">
  </button>
  <div class="linea"></div>
  <button class="boton">
    Cambiar contraseña
    <img src="/assets/images/angulo-derecho.svg" width="20" height="20" style="vertical-align: middle;">
  </button>

</div>

<!-- Logout button -->
<button onclick="logout()">Cerrar Sesión</button>

<!-- Display subscription plan -->
<p id="subscription-plan"></p>

<!-- Unsubscribe button -->
<button onclick="cancelSubscription()">Cancelar Suscripción</button>

<script>
  // Netlify Identity script and event handling
  netlifyIdentity.on('login', user => {
    // Additional actions after login if needed

    // Display welcome message and username
    const usernameSpan = document.getElementById('username');
    if (usernameSpan) {
      usernameSpan.innerText = user.user_metadata.full_name || user.email;
    }

    // Display subscription plan
    const subscriptionPlan = user.user_metadata.subscription_plan;
    if (subscriptionPlan) {
      const subscriptionPlanElement = document.getElementById('subscription-plan');
      subscriptionPlanElement.textContent = "Plan de Suscripción: " + subscriptionPlan;
      console.log('Subscription plan:', subscriptionPlan);
    } else {
      console.log('User', user);
      console.log('sin plan de suscripción');
    }
  });

  netlifyIdentity.on('logout', () => {
    // Additional actions after logout if needed

    // Clear username on logout
    const usernameSpan = document.getElementById('username');
    if (usernameSpan) {
      usernameSpan.innerText = '';
    }
  });

  function logout() {
    netlifyIdentity.logout();
  }

  function cancelSubscription() {
    // Confirm cancellation
    const confirmation = confirm('¿Estás seguro de que quieres cancelar tu suscripción?');

    if (confirmation) {
      // Get current user
      const user = netlifyIdentity.currentUser();

      // Check if user is logged in
      if (!user) {
        alert('Por favor, inicia sesión para cancelar tu suscripción.');
        return;
      }

      // Get subscription ID from user metadata
      const subscriptionPlan = user.user_metadata.subscription_plan;

      // Check if subscription ID exists
      if (!subscriptionPlan) {
        alert('No se encontró ninguna suscripción asociada a tu cuenta.');
        return;
      }

      // Send request to cancel subscription
      fetch('/.netlify/functions/server', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'cancel_subscription'
        })
      })
      .then(response => {
        if (response.ok) {
          // Remove subscription_plan from user metadata
          console.log('User', user);
          user.update({
            data: { subscription_plan: null }
          })
          console.log('User', user);
          alert('¡Tu suscripción ha sido cancelada con éxito!');
          // Refresh the page to reflect changes
          window.location.reload();
        } else {
          alert('Error al cancelar la suscripción: ' + data.error);
        }
      })
      .catch(error => {
        console.error('Error al cancelar la suscripción:', error);
        alert('Error al cancelar la suscripción. Por favor, inténtalo de nuevo más tarde.');
      });
    }
  }
</script>
