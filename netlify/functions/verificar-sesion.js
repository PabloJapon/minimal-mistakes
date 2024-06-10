exports.handler = async (event, context) => {
    try {
        console.log("Received request:", event);

        if (event.httpMethod === "POST") {
            const requestBody = JSON.parse(event.body);
            console.log("Request body:", requestBody);

            const inputData = requestBody.message; // Extract the message field
            console.log("Input data:", inputData);

            const responseData = { message: "Data received successfully", inputData: inputData };
            console.log("Response data:", responseData);

            return {
                statusCode: 200,
                body: JSON.stringify(responseData)
            };
        } else if (event.httpMethod === "GET") {
            // Handle GET request (sending data to Unity)
            const responseData = { message: "Hello from server" };
            return {
                statusCode: 200,
                body: JSON.stringify(responseData)
            };
        } else {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: "Method Not Allowed" })
            };
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};
