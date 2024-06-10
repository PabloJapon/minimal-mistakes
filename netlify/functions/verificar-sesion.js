exports.handler = async (event, context) => {
    const requestBody = JSON.parse(event.body);
    const inputData = requestBody.data; // Access the sent data

    // Do something with inputData...

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Data received successfully" })
    };
};
