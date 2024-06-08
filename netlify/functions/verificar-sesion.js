exports.handler = async (event, context) => {
    const data = JSON.parse(event.body);
    console.log("Received data:", data);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data received successfully', receivedData: data })
    };
};
