exports.handler = async (event, context) => {
    const hello = "Hello, world!";
    return {
        statusCode: 200,
        body: JSON.stringify({ hello })
    };
};
