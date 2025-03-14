---
layout: default
permalink: /payment_success/
---

# Pago Exitoso 🎉

Tu pago ha sido procesado con éxito. Gracias por tu compra.

<script>
  document.addEventListener('DOMContentLoaded', function () {
    console.log('Success page loaded.');
    
    // Log the current URL parameters for debugging
    const urlParams = new URLSearchParams(window.location.search);
    console.log('Query parameters:', Object.fromEntries(urlParams.entries()));
    
    const paymentSuccess = urlParams.get('payment_success');
    const plan = urlParams.get('plan');

    if (paymentSuccess === 'true' && plan) {
      const user = netlifyIdentity.currentUser();
      if (user) {
        console.log('User found:', user);
        user.jwt().then((token) => {
          console.log('Token received. Attempting to update user metadata with plan:', plan);
          user.update({
            user_metadata: { subscription_plan: plan }
          })
          .then((updatedUser) => {
            console.log('Subscription plan updated successfully:', updatedUser);
          })
          .catch((error) => {
            console.error('Error updating user metadata:', error);
          });
        });
      } else {
        console.error('No user logged in.');
      }
    } else {
      console.warn('Missing required query parameters (payment_success and/or plan).');
    }
  });
</script>

<p>Serás redirigido en unos segundos...</p>

<script>
  setTimeout(() => {
    window.location.href = '/dashboard'; // Change this to your desired redirect path
  }, 5000);
</script>
