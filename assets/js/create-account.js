document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('connected-account-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const email = formData.get('email');
        const businessName = formData.get('business_name');

        try {
            const response = await fetch('/.netlify/functions/create-connected-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, business_name: businessName })
            });

            const data = await response.json();
            console.log('Connected account created:', data.account);
            // Optionally, redirect the user or show a success message
        } catch (error) {
            console.error('Error creating connected account:', error);
            // Optionally, display an error message to the user
        }
    });
});
