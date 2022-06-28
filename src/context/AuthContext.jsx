import React, {
  createContext, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const { children } = props;
  const [currentUser, storeUser, clearStoredUser] = useLocalStorage('user');
  const [accessToken, storeAccessToken, clearStoredAccessToken] = useLocalStorage('accessToken');
  const [auth0Token, storeAuth0Token, clearStoredAuth0Token] = useLocalStorage('auth0Token');


  const handleUserLogin = (user) => {
    storeUser(user);
  };

  const saveAccessToken = (token) => {
    storeAccessToken(token);
  };

  const saveAuth0Token = (token) => {
    storeAuth0Token(token);
  };

  const handleUserLogout = () => {
    clearStoredUser();
    clearStoredAccessToken();
    clearStoredAuth0Token();
  };


  useEffect(() => {
  }, [currentUser, accessToken, auth0Token]);

  return (
    <AuthContext.Provider value={{
      currentUser, handleUserLogin, handleUserLogout,
      accessToken, saveAccessToken,
      auth0Token, saveAuth0Token,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};
AuthContextProvider.propTypes = {
  children: PropTypes.string.isRequired,
};
export default AuthContextProvider;