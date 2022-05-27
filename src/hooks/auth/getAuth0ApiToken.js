const getAuth0ApiToken = async () => {
  const requestOptions = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: '{"client_id":"Xv5AbCUIohlbqQOXOtBVbmIgt0dcjrec","client_secret":"XTMwPgUr8sUfFWwr2mo-Bw4edWgDUlTBSNCn62jKR9fzgqGXW22XW9sVQio5qJ5x","audience":"http://localhost","grant_type":"client_credentials"}' 
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