document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('connected-account-form');

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
