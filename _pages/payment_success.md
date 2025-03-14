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

          // Ensure the user metadata update persists
          const updatedUser = await user.update({
            user_metadata: { subscription_plan: plan }
          });

          console.log('Subscription plan updated successfully:', updatedUser);

          // Manually refresh the user session
          netlifyIdentity.refresh().then((newUser) => {
            console.log('User metadata after refresh:', newUser);
          }).catch((error) => {
            console.error('Error refreshing user session:', error);
          });

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
  }, 30000); // Reduced to 5 seconds for better UX
</script>
