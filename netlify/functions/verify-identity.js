exports.handler = async (event, context) => {
    const fetch = (await import('node-fetch')).default;
    
    try {
      const { email, password } = JSON.parse(event.body);
      console.log(`Received email: ${email}`);
      console.log(`Received password: ${password}`);
  
      const response = await fetch('https://gastrali.netlify.app/.netlify/identity/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grant_type: 'password', username: email, password: password })
      });
  
      const responseBody = await response.text();
      console.log(`Response status: ${response.status}`);
      console.log(`Response body: ${responseBody}`);
  
      if (!response.ok) {
        return {
          statusCode: response.status,
          body: JSON.stringify({ error: responseBody }),
        };
      }
  
      const data = JSON.parse(responseBody);
      return {
        statusCode: 200,
        body: JSON.stringify({ token: data.access_token }),
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      };
    }
  };
  