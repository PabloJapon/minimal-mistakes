---
layout: default
permalink: /payment_success/
---

# Pago Exitoso 🎉

Tu pago ha sido procesado con éxito. Gracias por tu compra.

<script>
  document.addEventListener('DOMContentLoaded', function () {
    console.log('Success page loaded.');
    
    const urlParams = new URLSearchParams(window.location.search);
    console.log('URL Parameters:', Object.fromEntries(urlParams.entries()));
    
    const paymentSuccess = urlParams.get('payment_success');
    const plan = urlParams.get('plan');
    
    if (paymentSuccess === 'true' && plan) {
      const user = netlifyIdentity.currentUser();
      if (user) {
        console.log('User found:', user);
        user.jwt().then((token) => {
          console.log('Token received. Attempting to update user metadata with plan:', plan);
          user.update({
            user_metadata: { subscription_plan: 'Premium' }
          })
          .then((updatedUser) => {
            console.log('Subscription plan updated successfully:', updatedUser);
            // window.location.href = '/dashboard'; // Uncomment once you confirm the update works
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

<p>Check the console for update logs. You will be redirected soon...</p>

<script>
  // Temporarily increase delay for debugging
  setTimeout(() => {
    window.location.href = '/dashboard';
  }, 30000); // 30 seconds
</script>
