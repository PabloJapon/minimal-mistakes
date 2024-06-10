exports.handler = async (event, context) => {
    const { user } = context.clientContext;

    if (user) {
        return {
            statusCode: 200,
            body: JSON.stringify({ isLoggedIn: true })
        };
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({ isLoggedIn: false })
        };
    }
};