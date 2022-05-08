import config from '../config';

const sendImagesUrl = async (urls, userId, setMessage) => {
  const info = {
    foto_0: urls[0],
    foto_1: urls[1],
    foto_2: urls[2],
  };
  const requestOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(info),
  };
  try {
    const response = await fetch(
      `${config.API_URL}/users/${userId}/update_images`,
      requestOptions,
    );
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
  } catch (error) {
    setMessage(error.message);
  }
};

export default sendImagesUrl;
