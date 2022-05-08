import config from '../config';

const sendImagesUrl = async (urls, user_id) => {
  let body_ = {
    "foto_0": urls[0],
    "foto_1": urls[1],
    "foto_2": urls[2]
  }
  const requestOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body_),
  };
  try {
    const response = await fetch(
      `${config.API_URL}/users/${user_id}/update_images`,
      requestOptions
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