import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useSetUserLocal from  '../../hooks/auth/setUserLocal';
import getAuth0ApiToken from '../../hooks/auth/getAuth0ApiToken';

const CheckUser= () => {
  const navigate = useNavigate();
  const { handleUserLogin, saveAccessToken } = useAuth();
  const { user, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const domain = "arqui-soft-grupo09.us.auth0.com";

  useEffect(() => {
    setLoading(true);
    const getUserMetadata = async () => {
      try {
        saveAccessToken(await getAuth0ApiToken());

        const accessToken = await getAccessTokenSilently({
          audience: `https://${domain}/api/v2/`,
          scope: "read:current_user",
        });
  
        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;
  
        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        const { user_metadata } = await metadataResponse.json();
  
        setUserMetadata(user_metadata);
        if (user_metadata && user_metadata.user_id) {
          useSetUserLocal(user_metadata.user_id, handleUserLogin)
          .then(() => {
            navigate('/');
          });
        }
        else{
          navigate('/register')
        }
      } catch (e) {
        console.log(e.message);
      }
    };
  
    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);

  if (loading) {
    return (
      <section className='container'>
        <h2>Loading...</h2>
      </section>
    );
  }
}

export default CheckUser;
