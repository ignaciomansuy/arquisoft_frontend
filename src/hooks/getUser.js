import config from '../config';

const getUser = async (userId) => {
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
    const user = await response.json();
    return user;
  } catch (error) {
    return null;
  }
};

export default getUser;
