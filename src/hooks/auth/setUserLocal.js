import config from '../../config';

const useSetUserLocal = async (user_id, handleUserLogin) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const response = await fetch(
      `${config.API_URL}/user/${user_id}`,
      requestOptions
    );
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    const user = await response.json();
    handleUserLogin(user);
  } catch (error) {
    console.log(error);
  }
}

export default useSetUserLocal;