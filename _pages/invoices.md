---
title: "Mis Facturas"
permalink: /misFacturas/
layout: single
---

<style>
/* Your CSS styles */
</style>

# Mis Facturas

Mi cuenta 

<div class="plan">
  <div class="plan-contenido">
    <h2><span id="subscription-plan"></span></h2>
    <h6><span id="next-invoice-date"></span></h6>
  </div>
</div>


<!-- Display invoices list -->
<ul id="invoices-list">
  <!-- Invoices will be dynamically added here -->
</ul>

<script>
// Function to fetch and display invoices
function fetchAndDisplayInvoices() {
  console.log('Fetching invoices...');
  fetch('/.netlify/functions/server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'get_invoices', email: email })
    })
    .then(response => {
      console.log('Response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Fetched data:', data);
      const invoicesList = document.getElementById('invoices-list');
      if (data && data.invoices) {
        data.invoices.forEach(invoice => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            <span>Factura #${invoice.invoice_number}</span>
            <button onclick="downloadInvoice('${invoice.invoice_id}')">Descargar</button>
          `;
          invoicesList.appendChild(listItem);
        });
      } else {
        console.error('Error fetching invoices:', data);
      }
    })
    .catch(error => {
      console.error('Error fetching invoices:', error);
    });
}

// Function to download invoice in PDF format
function downloadInvoice(invoiceId) {
  console.log('Downloading invoice:', invoiceId);
  window.open(`/.netlify/functions/download_invoice?invoice_id=${invoiceId}`, '_blank');
}

// Fetch and display invoices when the page loads
fetchAndDisplayInvoices();
</script>



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
  }
</script>