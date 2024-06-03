---
title: "Mi Cuenta"
permalink: /miCuenta/
layout: single
---

<style>
.plan {
  width: 800px; /* Ancho deseado de cada plan */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  text-align: left;
  margin-bottom: 20px; /* Espacio inferior entre cada plan */
  margin-top: 0px;
  margin-left: 0px;
  margin-right: 12px;
}

.plan-contenido {
padding-left: 20px; /* Añade un margen a la izquierda del contenido */
}
  
.linea {
  width: 750px;
  height: 1px;
  background: linear-gradient(to right, #ccc 0%, #ccc 100%, transparent 50%, transparent 100%);
  margin-bottom: 10px; /* Espacio inferior entre cada plan */
  margin-top: 10px;
  margin-left: 20px;
}

/* Estilo CSS para alinear la imagen a la derecha */
img {
  float: right; /* Alinea la imagen a la derecha */
  margin-left: 10px; /* Agrega un margen izquierdo para separar la imagen del texto */
  /*margin-top: 10.125px;*/
  margin-bottom: 10px; /* Espacio inferior entre cada plan */
  margin-top: 10px;
}

.boton {
  display: inline-block;
  padding: 0px 0px;
  padding-left: 20px; /* Añade un margen a la izquierda del texto dentro del botón */
  padding-right: 20px; /* Añade un margen a la izquierda del texto dentro del botón */
  width: 780px; /* Establece el ancho deseado para el botón */
  text-align: left; /* Alinea el texto a la izquierda dentro del botón */
  background: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  line-height: 40px; /* Centra verticalmente el texto */
  outline: none; /* Quita el borde azul al hacer clic en el botón */
}

.boton:hover {
background-color: #f4f4f4;
}
.boton:focus, .boton:active {
  background-color: #c3c3c3; /* Cambia el color de fondo al hacer foco o clic en el botón */
outline: none; /* Quita el borde azul al hacer foco en el botón */
}
</style>


Mi cuenta 

<div class="plan">
  <div class="plan-contenido">
    <h2><span id="subscription-plan"></span></h2>
    <h6><span id="next-invoice-date"></span></h6>
  </div>
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

<!-- Link to view invoices -->
<a href="/misFacturas/" class="button">Ver mis facturas</a>

<!-- Conditional button based on connected Stripe account -->
<div id="stripe-button"></div>


<script>
  // Function to update next invoice date in HTML
  function updateNextInvoiceDate(nextInvoiceDate) {
    const nextInvoiceDateElement = document.getElementById('next-invoice-date');
    if (nextInvoiceDateElement) {
      const formattedDate = new Date(nextInvoiceDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
      nextInvoiceDateElement.textContent = 'Próximo pago: ' + formattedDate;
      console.log('Next invoice date:', formattedDate); // Log the next invoice date
    }
  }

  // Function to fetch next invoice date
  function fetchNextInvoiceDate(email) {
    fetch('/.netlify/functions/server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'next_invoice_date', email: email })
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.nextInvoiceDate) {
        updateNextInvoiceDate(data.nextInvoiceDate);
      } else {
        console.error('Next invoice date not found in response:', data);
      }
    })
    .catch(error => {
      console.error('Error fetching next invoice date:', error);
    });
  }

  netlifyIdentity.on('login', user => {
    const usernameSpan = document.getElementById('username');
    if (usernameSpan) {
      usernameSpan.innerText = user.user_metadata.full_name || user.email;
    }

    const subscriptionPlan = user.user_metadata.subscription_plan;
    if (subscriptionPlan) {
      const subscriptionPlanElement = document.getElementById('subscription-plan');
      subscriptionPlanElement.textContent = "Plan " + subscriptionPlan;
      console.log('Subscription plan:', subscriptionPlan);
    } else {
      console.log('User', user);
      console.log('sin plan de suscripción');
    }

    fetchNextInvoiceDate(user.email);
  });

  netlifyIdentity.on('logout', () => {
    const usernameSpan = document.getElementById('username');
    if (usernameSpan) {
      usernameSpan.innerText = '';
    }
  });

  function logout() {
    netlifyIdentity.logout();
  }

  function cancelSubscription() {
    const confirmation = confirm('¿Estás seguro de que quieres cancelar tu suscripción?');
    if (confirmation) {
      const user = netlifyIdentity.currentUser();
      if (!user) {
        alert('Por favor, inicia sesión para cancelar tu suscripción.');
        return;
      }

      const subscriptionPlan = user.user_metadata.subscription_plan;
      if (!subscriptionPlan) {
        alert('No se encontró ninguna suscripción asociada a tu cuenta.');
        return;
      }

      fetch('/.netlify/functions/server', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'cancel_subscription', email: user.email })
      })
      .then(response => response.json())
      .then(data => {
        if (response.ok) {
          user.update({ data: { subscription_plan: null } });
          alert('¡Tu suscripción ha sido cancelada con éxito!');
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
    
    // Check if user has a connected account
    fetch('/.netlify/functions/server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'check_connected_account', email: user.email })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Response from check_connected_account:', data);
      if (data && data.hasConnectedAccount) {
        console.log('User has a connected Stripe account.');
        // Show button to manage things on stripe.com
        const stripeButton = document.createElement('a');
        stripeButton.classList.add('button');
        stripeButton.textContent = 'Administrar cosas en Stripe';
        stripeButton.href = 'https://stripe.com'; // Link to manage Stripe account
        stripeButton.target = '_blank'; // Open in new tab
        const stripeDiv = document.getElementById('stripe-button');
        if (stripeDiv) {
          stripeDiv.appendChild(stripeButton);
        }
      } else {
        console.log('User does not have a connected Stripe account.');
        // Show button to create a connected account
        const createAccountButton = document.createElement('a');
        createAccountButton.classList.add('button');
        createAccountButton.textContent = 'Crear cuenta conectada de Stripe';
        createAccountButton.href = '/create_account_stripe/'; // Link to create connected account
        const stripeDiv = document.getElementById('stripe-button');
        if (stripeDiv) {
          stripeDiv.appendChild(createAccountButton);
        }
      }
    })
    .catch(error => {
      console.error('Error checking connected account:', error);
    });
  }
}