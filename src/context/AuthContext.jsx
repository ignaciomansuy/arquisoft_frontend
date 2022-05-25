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

  const handleUserLogin = (user) => {
    storeUser(user);
  };

  const saveAccessToken = (token) => {
    storeAccessToken(token);
  };

  const handleUserLogout = () => {
    clearStoredUser();
    clearStoredAccessToken();
  };


  useEffect(() => {
  }, [currentUser, accessToken]);

  return (
    <AuthContext.Provider value={{
      currentUser, handleUserLogin, handleUserLogout,
      accessToken, saveAccessToken,
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