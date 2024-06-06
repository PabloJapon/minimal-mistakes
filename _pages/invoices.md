---
title: "Mis Facturas"
permalink: /misFacturas/
layout: splash
---

<style>
/* Your CSS styles */
table {
  border-collapse: collapse;
  margin: 20px 0;
}

table, th, td {
  border: 1px solid black;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

th, td {
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>

<h2 style="margin-top: 4em;text-align: center;"> Mis Facturas</h2>

<!-- Display invoices list -->
<table id="invoices-table">
  <thead>
    <tr>
      <th id="th-description"></th>
      <th id="th-invoice-number"></th>
      <th id="th-amount"></th>
      <th id="th-status"></th>
      <th id="th-date-of-issue"></th>
      <th id="th-action"></th>
    </tr>
  </thead>
  <tbody>
    <!-- Invoices will be dynamically added here -->
  </tbody>
</table>

<script>
// Translation dictionary for Spanish
const translationDict = {
  'Invoice': 'Factura',
  'Invoice number': 'Número de factura',
  'Amount': 'Importe',
  'Status': 'Estado',
  'Date of issue': 'Fecha de emisión',
  'Date due': 'Fecha de vencimiento',
  'Description': 'Descripción',
  'Pay online': 'Pagar en línea',
  'Download': 'Descargar',
  // Add more translations as needed
};

// Function to translate text
function translate(text) {
  return translationDict[text] || text; // If translation is not found, return original text
}

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
            <td><button onclick="downloadInvoice('${invoice.invoice_pdf}')">${translate('Download')}</button></td>
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

// Function to get description from invoice lines
function getDescription(invoice) {
  if (invoice.lines && invoice.lines.data.length > 0) {
    // Assuming the description is available in the first line item
    let description = invoice.lines.data[0].description || '';

    // Translation dictionary for description
    const descriptionTranslationDict = {
      'at €': '€', // Translate 'at €' to '€'
      'month': 'mes' // Translate 'month' to 'mes'
      // Add more translations as needed
    };

    // Perform translation for description
    for (const [key, value] of Object.entries(descriptionTranslationDict)) {
      description = description.replace(new RegExp(key, 'g'), value);
    }

    return description;
  }
  return ''; // Return an empty string if description is not available
}

// Function to download invoice in PDF format
function downloadInvoice(invoicePdfUrl) {
  console.log('Downloading invoice:', invoicePdfUrl);
  window.open(invoicePdfUrl, '_blank');
}

// Fetch and display invoices when the page loads
netlifyIdentity.on('login', user => {
  fetchAndDisplayInvoices(user.email);
});
</script>
