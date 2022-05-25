import useAuth from '../../hooks/useAuth';

const setUserLocal = async (accessToken) => {
  const { handleUserLogin, saveAccessToken } = useAuth();
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(values),
  };
  try {
    const response = await fetch(
      `${config.API_URL}/login/`,
      requestOptions
    );
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    const user = await response.json();
    handleUserLogin(user);
    saveAccessToken(accessToken);
  } catch (error) {
    console.log(error);
    setMessage(error.message);
  }
}

export default setUserLocal;