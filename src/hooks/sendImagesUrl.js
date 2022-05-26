import config from '../config';
import useAuth from '../../hooks/useAuth';

const sendImagesUrl = async (urls, userId, setMessage) => {
  const { accessToken } = useAuth();

  const info = { photos: urls };
  const requestOptions = {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(info),
  };
  try {
    const response = await fetch(
      `${config.API_URL}/user/${userId}/update_images`,
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
