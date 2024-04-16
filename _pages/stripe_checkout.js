var stripe = Stripe('tu_clave_publica_de_stripe');

stripe.redirectToCheckout({
  sessionId: 'id_de_la_sesion_de_pago',
  successUrl: 'https://tupaginaweb.com/pagina-de-confirmacion',
  cancelUrl: 'https://tupaginaweb.com/pago-cancelado',
}).then(function (result) {
  // Manejar errores, si los hay
});
