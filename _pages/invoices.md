---
title: "Mis Facturas"
permalink: /misFacturas/
layout: single
---

<style>
/* Your CSS styles */
</style>

# Mis Facturas

<!-- Display invoices list -->
<ul id="invoices-list">
  <!-- Invoices will be dynamically added here -->
</ul>

<script>
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
      const invoicesList = document.getElementById('invoices-list');
      if (data && data.invoices) {
        data.invoices.forEach(invoice => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            <span>Factura #${invoice.number}</span>
            <button onclick="downloadInvoice('${invoice.invoice_pdf}')">Descargar</button>
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
function downloadInvoice(invoicePdfUrl) {
  console.log('Downloading invoice:', invoicePdfUrl);
  window.open(invoicePdfUrl, '_blank');
}

// Fetch and display invoices when the page loads
fetchAndDisplayInvoices();
</script>
