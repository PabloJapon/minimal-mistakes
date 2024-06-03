---
title: "Mis Facturas"
permalink: /misFacturas/
layout: single
---

<style>
/* Your CSS styles */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

table, th, td {
  border: 1px solid black;
}

th, td {
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>

# Mis Facturas

<!-- Display invoices list -->
<table id="invoices-table">
  <thead>
    <tr>
      <th>Concepto</th>
      <th>Numero de factura</th>
      <th>Importe</th>
      <th>Estado</th>
      <th>Creación</th>
      <th>Acción</th>
    </tr>
  </thead>
  <tbody>
    <!-- Invoices will be dynamically added here -->
  </tbody>
</table>

<script>
// Function to format amount
function formatAmount(amount) {
  return (amount / 100).toFixed(2).replace('.', ',') + ' €';
}

// Function to translate status
function translateStatus(status) {
  if (status === 'paid') {
    return 'Pagada';
  }
  return status;
}

// Function to format creation date
function formatCreationDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString();
}

// Function to fetch and display invoices
function fetchAndDisplayInvoices(email) {
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
      const invoicesTableBody = document.querySelector('#invoices-table tbody');
      if (data && data.invoices) {
        data.invoices.forEach(invoice => {
          const formattedAmount = formatAmount(invoice.amount_due);
          const translatedStatus = translateStatus(invoice.status);
          const formattedCreationDate = formatCreationDate(invoice.created);
          const description = getDescription(invoice); // Get description from invoice lines
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${description}</td>
            <td>${invoice.number}</td>
            <td>${formattedAmount}</td>
            <td>${translatedStatus}</td>
            <td>${formattedCreationDate}</td>
            <td><button onclick="downloadInvoice('${invoice.invoice_pdf}')">Descargar</button></td>
          `;
          invoicesTableBody.appendChild(row);
        });
      } else {
        console.error('Error fetching invoices:', data);
      }
    })
    .catch(error => {
      console.error('Error fetching invoices:', error);
    });
}

// Función para obtener la descripción de las líneas de factura
function getDescription(invoice) {
  if (invoice.lines && invoice.lines.data.length > 0) {
    // Suponiendo que la descripción está disponible en el primer ítem de línea
    let description = invoice.lines.data[0].description || '';
    
    // Diccionario de traducción
    const translationDict = {
      'at €': '€', // Traduce 'at €' a 'a €'
      'month': 'mes' // Traduce 'month' a 'mes'
      // Agrega más traducciones según sea necesario
    };
    
    // Realiza la traducción
    for (const [key, value] of Object.entries(translationDict)) {
      description = description.replace(new RegExp(key, 'g'), value);
    }
    
    return description;
  }
  return ''; // Devuelve una cadena vacía si la descripción no está disponible
}

// Function to download invoice in PDF format
function downloadInvoice(invoicePdfUrl) {
  console.log('Downloading invoice:', invoicePdfUrl);
  window.open(invoicePdfUrl, '_blank');
}

// Fetch and display invoices when the page loads
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
    
    fetchAndDisplayInvoices(user.email);
  });


</script>
