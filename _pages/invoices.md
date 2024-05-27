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
      <th>Numero de factura</th>
      <th>Importe</th>
      <th>Estado</th>
      <th>Acción</th>
    </tr>
  </thead>
  <tbody>
    <!-- Invoices will be dynamically added here -->
  </tbody>
</table>

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
      const invoicesTableBody = document.querySelector('#invoices-table tbody');
      if (data && data.invoices) {
        data.invoices.forEach(invoice => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${invoice.number}</td>
            <td>${invoice.amount_due}</td>
            <td>${invoice.status}</td>
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

// Function to download invoice in PDF format
function downloadInvoice(invoicePdfUrl) {
  console.log('Downloading invoice:', invoicePdfUrl);
  window.open(invoicePdfUrl, '_blank');
}

// Fetch and display invoices when the page loads
fetchAndDisplayInvoices();
</script>
