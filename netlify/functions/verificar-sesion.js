exports.handler = async (event, context) => {
    if (event.httpMethod === 'POST') {
      try {
        const requestBody = JSON.parse(event.body);
        const message = requestBody.value;
  
        return {
          statusCode: 200,
          body: JSON.stringify({ message: message }),
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to parse request body' }),
        };
      }
    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }
  };
  