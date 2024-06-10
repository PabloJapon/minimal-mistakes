exports.handler = async (event, context) => {
    try {
        console.log("Received request:", event);

        const requestBody = JSON.parse(event.body);
        console.log("Request body:", requestBody);

        const inputData = JSON.stringify(requestBody.data); // Stringify the input data
        console.log("Input data:", inputData);

        // Do something with inputData...

        const responseData = { message: "Data received successfully", inputData: inputData };
        console.log("Response data:", responseData);

        return {
            statusCode: 200,
            body: JSON.stringify(responseData)
        };
    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};
