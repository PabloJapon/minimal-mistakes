exports.handler = async (event, context) => {
    // Use dynamic import for node-fetch
    const fetch = (await import('node-fetch')).default;
    
    const { email, password } = JSON.parse(event.body);
    
    try {
      const response = await fetch('https://gastrali.netlify.app/.netlify/identity/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grant_type: 'password', username: email, password: password })
      });
  
      if (!response.ok) {
        return {
          statusCode: response.status,
          body: JSON.stringify({ error: 'Invalid credentials' }),
        };
      }
  
      const data = await response.json();
      return {
        statusCode: 200,
        body: JSON.stringify({ token: data.access_token }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      };
    }
  };
  