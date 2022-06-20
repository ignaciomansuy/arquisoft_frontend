import config from '../../config';


const loginUser = async (auth0Token, saveAccessToken) => {
  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth0Token}`
    },
  };
  try {
    const response = await fetch(
      `${config.API_URL}/auth/login`,
      requestOptions
    );
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    const data = await response.json();
    saveAccessToken(data.token);
    return data.token;
  } catch (error) {
    console.log(error.message);
  }
};

export default loginUser;