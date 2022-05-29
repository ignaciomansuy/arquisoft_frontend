import config from '../../config';


const loginUser = async (access_token, saveAccessToken) => {
  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
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