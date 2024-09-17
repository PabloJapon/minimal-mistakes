let storedInputData = null;

exports.handler = async (event, context) => {
    try {
        console.log("Received request:", event);

        if (event.httpMethod === "POST") {
            const requestBody = JSON.parse(event.body);
            console.log("Request body:", requestBody);

            // Store the input data from the POST request
            storedInputData = {
                message: requestBody.message,
                subscription_plan: requestBody.subscription_plan,
                id: requestBody.id // Store the ID from the POST request
            }; 
            console.log("Input data stored:", storedInputData);

            // Prepare response data
            const responseData = { 
                message: "Data received successfully", 
                inputData: storedInputData
            };

            return {
                statusCode: 200,
                body: JSON.stringify(responseData)
            };
        } else if (event.httpMethod === "GET") {
            // Handle GET request (return stored data)
            if (storedInputData !== null) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ 
                        message: "Data retrieved successfully from previous POST request",
                        inputData: storedInputData
                    })
                };
            } else {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ 
                        message: "No data available from previous POST request"
                    })
                };
            }
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
