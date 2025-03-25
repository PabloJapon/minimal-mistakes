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

      if (!user) {
        console.error('No user logged in. Cannot update metadata.');
        return;
      }

      console.log('User found:', user);

      try {
        // Get the JWT token (some updates require authentication)
        const token = await user.jwt();
        console.log('JWT Token received:', token);

        console.log('Updating user metadata with subscription_plan:', plan);

        // Update user metadata
        const updatedUser = await user.update({
          user_metadata: { subscription_plan: plan }
        });

        console.log('Subscription plan updated successfully:', updatedUser);

        // Verify if the update was successful
        if (updatedUser?.user_metadata?.subscription_plan === plan) {
          console.log('User metadata confirmed with updated subscription plan:', updatedUser.user_metadata.subscription_plan);
        } else {
          console.error('User metadata update failed, plan mismatch:', updatedUser.user_metadata);
        }

        // Manually refresh the user session to ensure persistence
        const refreshedUser = await netlifyIdentity.refresh();
        console.log('User metadata after refresh:', refreshedUser);

        if (refreshedUser?.user_metadata?.subscription_plan === plan) {
          console.log('User metadata confirmed after refresh:', refreshedUser.user_metadata.subscription_plan);
        } else {
          console.error('Subscription plan did not persist after refresh:', refreshedUser.user_metadata);
        }

      } catch (error) {
        console.error('Error updating subscription plan:', error);
      }
    } else {
      console.warn('Missing required query parameters (payment_success and/or plan).');
    }
  });
</script>

<p id="message">Serás redirigido en <span id="countdown">5</span> segundos...</p>

<script>
  let timeLeft = 5;
  const countdownElement = document.getElementById("countdown");

  let timer = setInterval(() => {
    timeLeft--;
    countdownElement.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      window.location.href = "/micuenta";
    }
  }, 1000);
</script>
