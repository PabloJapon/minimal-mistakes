---
title: "Mi Cuenta"
permalink: /miCuenta/
layout: splash
---

<style>
.plan {
  width: 60%; /* Ancho deseado de cada plan */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  text-align: left;
  margin-bottom: 20px; /* Espacio inferior entre cada plan */
  margin-top: 0px;
  margin-left: auto;
  margin-right: auto;
}

.plan-contenido {
  padding-left: 20px; /* Añade un margen a la izquierda del contenido */
}
  
.linea {
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
  margin-bottom: 10px; /* Espacio inferior entre cada plan */
  margin-top: 10px;
}

.boton {
  display: inline-block;
  padding: 10px 20px;
  width: 100%; /* Establece el ancho deseado para el botón */
  text-align: left; /* Alinea el texto a la izquierda dentro del botón */
  color: #222831;
  background: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  line-height: 40px; /* Centra verticalmente el texto */
  outline: none; /* Quita el borde azul al hacer clic en el botón */
}

.button-log-out {
  background-color: transparent;
  color: #69f;
  border: none;
  text-decoration: none;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center; /* Alinea la imagen y el texto verticalmente */ */
  padding: 0;
  margin-left: auto;
  margin-right: auto;
}

.button-log-out img.icon {
  width: 20px; /* Ajusta el tamaño de la imagen según tus necesidades */
  height: 20px;
  margin-right: 10px; /* Añade espacio entre la imagen y el texto */
}

.button-log-out:hover {
  background-color: transparent;
  color: #417ef7;
}

.boton:hover {
  background-color: #e7e7e7;
}
</style>

<p style="margin-top: 4em;margin-left: 20%;">Mi cuenta</p>

<div class="plan">
  <div class="plan-contenido">
    <h2><span id="subscription-plan"></span></h2>
    <h6><span id="next-invoice-date"></span></h6>
  </div>
</div>

<p style="margin-top: 2em;margin-left: 20%;">Acciones</p>

<div class="plan">
  <button class="boton" onclick="window.location.href='/precios/'">
    Cambiar de plan
    <img src="/assets/images/angulo-derecho.svg" width="20" height="20" style="vertical-align: middle;">
  </button>
  <div class="linea"></div>
  <button class="boton" onclick="window.location.href='/metodoDePago/'">
    Administrar formas de pago
    <img src="/assets/images/angulo-derecho.svg" width="20" height="20" style="vertical-align: middle;">
  </button>
  <div class="linea"></div>
  <button class="boton" onclick="window.location.href='/misFacturas/'">
    Mis Facturas
    <img src="/assets/images/angulo-derecho.svg" width="20" height="20" style="vertical-align: middle;">
  </button>
  <div class="linea"></div> <!-- Line after "Mis Facturas" -->
  <button class="boton" id="stripe-button-manage">
    <span id="stripe-button-text"></span>
    <img src="/assets/images/angulo-derecho.svg" width="20" height="20" style="vertical-align: middle;">
  </button>
</div>


<!-- Logout button -->
<button class="button-log-out">
  <img src="/assets/images/log-out-azul.png" alt="Log Out Icon" class="icon"> Cerrar Sesión
</button>

<!-- Unsubscribe button -->
<!-- <button onclick="cancelSubscription()">Cancelar Suscripción</button> -->

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
  
  // Function to update the subscription plan on the UI
  function updateSubscriptionPlan(productName) {
    const subscriptionElement = document.getElementById('subscription-plan');
    if (subscriptionElement) {
      subscriptionElement.textContent = `Plan: ${productName}`;
      console.log('Subscribed Plan:', subscriptionElement.textContent);
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
  
  // Function to fetch subscription plan (product name)
  function fetchSubscriptionPlan(email) {
    fetch('/.netlify/functions/server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'get_subscription_plan', email: email })
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.product_name) {
        updateSubscriptionPlan(data.product_name); // Function to update the UI with the product name
      } else {
        console.error('Subscription plan (product name) not found in response:', data);
      }
    })
    .catch(error => {
      console.error('Error fetching subscription plan:', error);
    });
  }

  // Check if user has a connected account
  function fetchCheckConnectedAccount(email) {
    fetch('/.netlify/functions/server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'check_connected_account', email: email })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Response from check_connected_account:', data);
      const stripeButton = document.getElementById('stripe-button-manage');
      const stripeButtonText = document.getElementById('stripe-button-text');

      if (data && data.hasConnectedAccount) {
        console.log('User has a connected Stripe account.');
        // Change button text to manage account on Stripe
        stripeButtonText.textContent = 'Gestionar cuenta de Stripe'; // Set button text
        stripeButton.onclick = () => window.open('https://dashboard.stripe.com/', '_blank'); // Open in new tab
        stripeButton.style.display = 'block'; // Make the button visible
      } else {
        console.log('User does not have a connected Stripe account.');
        // Change button text to create a connected account
        stripeButtonText.textContent = 'Crear cuenta conectada de Stripe'; // Set button text
        stripeButton.onclick = () => window.location.href = '/create_account_stripe/'; // Redirect to create account
        stripeButton.style.display = 'block'; // Make the button visible
      }
    })
    .catch(error => console.error('Error checking connected account:', error));
  }

  // Function to generate a random alphanumeric ID
  function generateRandomID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // Function to add or update ID in user metadata
  function addIDToUserMetadata(user) {
    if (!user.user_metadata.id) { // Check if the ID already exists
      const newID = generateRandomID(6); // Generate a random ID with 6 characters
      const updatedMetadata = {
        ...user.user_metadata,
        id: newID
      };

      user.update({
        data: updatedMetadata
      }).then(() => {
        console.log('User metadata updated successfully with new ID:', updatedMetadata);
      }).catch(error => {
        console.error('Error updating user metadata:', error);
      });
    } else {
      console.log('User already has an ID:', user.user_metadata.id);
    }
  }

  // Netlify identity
  netlifyIdentity.on('login', user => {
    const usernameSpan = document.getElementById('username');
    if (usernameSpan) {
      usernameSpan.innerText = user.user_metadata.full_name || user.email;
    }

    fetchNextInvoiceDate(user.email);
    fetchSubscriptionPlan(user.email);
    fetchCheckConnectedAccount(user.email); // Fetch connected account status on login

    // Add or update ID in user metadata
    addIDToUserMetadata(user);
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
      if (data && data.message) { // Check if `data.message` exists
        // Update user metadata to set subscription_plan to "Sin Plan"
        user.update({ data: { subscription_plan: "Sin Plan" } })
          .then(() => {
            alert('¡Tu suscripción ha sido cancelada con éxito!');
            window.location.reload();
          })
          .catch(error => {
            console.error('Error updating user metadata:', error);
            alert('¡La suscripción ha sido cancelada, pero no se pudo actualizar el plan! Por favor, inténtalo de nuevo más tarde.');
          });
      } else {
        alert('Error al cancelar la suscripción: ' + (data.error || 'Error desconocido'));
      }
    })
    .catch(error => {
      console.error('Error al cancelar la suscripción:', error);
      alert('Error al cancelar la suscripción. Por favor, inténtalo de nuevo más tarde.');
    });
  }
}
</script>
