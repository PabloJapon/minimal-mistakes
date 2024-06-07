exports.handler = async (event, context) => {
    // Verificar si hay un usuario autenticado
    const { user } = context.clientContext;

    if (!user) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: "Usuario no autenticado" })
        };
    }

    try {
        // Acceder a los detalles del usuario
        const username = user.user_metadata.full_name || user.email;
        const subscriptionPlan = user.user_metadata.subscription_plan;

        // Devolver los detalles del usuario en la respuesta
        return {
            statusCode: 200,
            body: JSON.stringify({ username, subscriptionPlan })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error al procesar la solicitud" })
        };
    }
};
