import React, {
  createContext, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const { children } = props;
  const [currentUser, storeUser, clearStoredUser] = useLocalStorage('user');

  const handleUserLogin = (user) => {
    storeUser(user);
  };

  const handleUserLogout = () => {
    clearStoredUser();
  };

  useEffect(() => {
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{
      currentUser, handleUserLogin, handleUserLogout,
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