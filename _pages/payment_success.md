---
layout: default
permalink: /payment_success/
---

# Pago Exitoso 🎉

Tu pago ha sido procesado con éxito. Gracias por tu compra.

<script>
  document.addEventListener('DOMContentLoaded', async function () {
    console.log('Success page loaded.');

    const urlParams = new URLSearchParams(window.location.search);
    console.log('URL Parameters:', Object.fromEntries(urlParams.entries()));

    const paymentSuccess = urlParams.get('payment_success');
    const plan = urlParams.get('plan');

    if (paymentSuccess === 'true' && plan) {
      const user = netlifyIdentity.currentUser();

      if (user) {
        console.log('User found:', user);

        try {
          const token = await user.jwt();
          console.log('JWT Token received:', token);

          const response = await fetch('/.netlify/identity/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_metadata: { subscription_plan: plan }
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to update metadata: ${response.statusText}`);
          }

          const updatedUser = await response.json();
          console.log('Subscription plan updated successfully:', updatedUser);

          // Refresh user object to reflect changes
          await netlifyIdentity.refresh();
          console.log('User metadata after refresh:', netlifyIdentity.currentUser());

        } catch (error) {
          console.error('Error updating subscription plan:', error);
        }

      } else {
        console.error('No user logged in.');
      }
    } else {
      console.warn('Missing required query parameters (payment_success and/or plan).');
    }
  });
</script>

<p>Check the console for update logs. You will be redirected soon...</p>

<script>
  setTimeout(() => {
    window.location.href = '/dashboard';
  }, 5000); // Reduced to 5 seconds for better UX
</script>
