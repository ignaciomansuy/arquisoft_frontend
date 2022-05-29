import config from '../../config';


const getAuth0ApiToken = async () => {
  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: `{"client_id":"${config.AUTH0_CLIENT_ID}","client_secret":"${config.AUTH0_CLIENT_SECRET}","audience":"${config.AUDIENCE}","grant_type":"client_credentials"}` 
  };
  try {
    const response = await fetch(
      `https://arqui-soft-grupo09.us.auth0.com/oauth/token`,
      requestOptions
    );
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.log(error.message);
  }
};

export default getAuth0ApiToken;