---
layout: default
permalink: /payment_success/
---

# Pago Exitoso 🎉

Tu pago ha sido procesado con éxito. Gracias por tu compra.

<script>
  document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');
    const plan = urlParams.get('plan');

    if (paymentSuccess === 'true' && plan) {
      const user = netlifyIdentity.currentUser();

      if (user) {
        user.jwt().then((token) => {
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
      }
    }
  });
</script>

<p>Serás redirigido en unos segundos...</p>

<script>
  setTimeout(() => {
    window.location.href = '/dashboard'; // Change this to your desired redirect path
  }, 5000);
</script>
