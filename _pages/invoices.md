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
function fetchAndDisplayInvoices() {
  console.log('Fetching invoices...');
  fetch('/.netlify/functions/get_invoices')
    .then(response => {
      console.log('Response:', response);
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
