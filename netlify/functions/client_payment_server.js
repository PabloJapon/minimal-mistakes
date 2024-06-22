const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Error: Stripe secret key is missing!');
} else {
  console.log('Stripe secret key:', stripeSecretKey);
}

const stripe = require('stripe')(stripeSecretKey);

exports.handler = async (event, context) => {
  try {
    // Parsear el cuerpo de la solicitud entrante
    const { payment_method, amount, seller_account_id, return_url } = JSON.parse(event.body);
    
    // Validar la entrada
    if (!payment_method || !amount || isNaN(amount) || amount <= 0 || !seller_account_id || !return_url) {
      console.error('Entrada inválida:', { payment_method, amount, seller_account_id, return_url });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Entrada inválida. Proporcione un método de pago válido, cantidad, ID de cuenta de vendedor y URL de retorno.' }),
      };
    }

    // Asegurarse de que la cantidad sea un número entero
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount)) {
      console.error('Cantidad inválida:', amount);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Cantidad inválida. Proporcione una cantidad válida.' }),
      };
    }

    // Registro del payload que se enviará a Stripe
    const paymentIntentData = {
      amount: parsedAmount,
      currency: 'eur',
      receipt_email: 'forbiddenplaces96@gmail.com', // Correo electrónico para el recibo
      payment_method: payment_method, // Método de pago proporcionado por el cliente
      confirm: true, // Confirmar automáticamente el intento de pago
      confirmation_method: 'automatic', // Método de confirmación automático
    };
    console.log('Payload del intento de pago:', paymentIntentData);

    // Crear un intento de pago con Stripe
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData, {
      stripeAccount: seller_account_id // Cuenta de vendedor a la que se transferirá el pago
    });

    // Registrar detalles del intento de pago para monitoreo y depuración
    console.log('Intento de pago creado:', paymentIntent);

    // Retornar una respuesta de éxito
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Pago procesado exitosamente.', paymentIntent: paymentIntent }),
    };
  } catch (error) {
    // Registrar y devolver una respuesta de error si ocurre algún problema
    console.error('Error al crear el intento de pago:', error);

    // Extraer y registrar detalles específicos del error si están disponibles
    if (error.raw && error.raw.message) {
      console.error('Error de Stripe:', error.raw.message);
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Se produjo un error al procesar el pago.', details: error.raw ? error.raw.message : error.message }),
    };
  }
};
