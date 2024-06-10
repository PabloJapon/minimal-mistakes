exports.handler = async (event, context) => {
    const { user } = context.clientContext;

    console.log("User:", user); // Log the user object for debugging

    if (user) {
        console.log("User is logged in"); // Log that user is logged in
        return {
            statusCode: 200,
            body: JSON.stringify({ isLoggedIn: true })
        };
    } else {
        console.log("User is not logged in"); // Log that user is not logged in
        return {
            statusCode: 200,
            body: JSON.stringify({ isLoggedIn: false })
        };
    }
};
