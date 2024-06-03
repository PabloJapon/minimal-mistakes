document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('connected-account-form');

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

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const email = formData.get('email');
        const businessName = formData.get('business_name');

        try {
            const response = await fetch('/.netlify/functions/server', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'create_connected_account', email, business_name: businessName })
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe's hosted onboarding flow
            } else {
                console.error('Error:', data.error);
            }
        } catch (error) {
            console.error('Error creating connected account:', error);
        }
    });
});
