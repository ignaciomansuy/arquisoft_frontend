const updateMetadata = async () => {
  const domain = "arqui-soft-grupo09.us.auth0.com";

  const accessToken = await getAccessTokenSilently({
    audience: `https://${domain}/api/v2/`,
    scope: "read:current_user",
  });

  const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

  const metadataResponse = await fetch(userDetailsByIdUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_metadata: {
        user_id: 1,
      },
    })
  });

  const { user_metadata } = await metadataResponse.json();
  return user_metadata;
}

export default updateMetadata;

