import config from '../config';

const sendImagesUrl = async (userId) => {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  try {
    const response = await fetch(
      `${config.API_URL}/user/${userId}`,
      requestOptions,
    );
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    const user = response.json();
    return user;
  } catch (error) {
    setMessage(error.message);
  }
};

export default sendImagesUrl;