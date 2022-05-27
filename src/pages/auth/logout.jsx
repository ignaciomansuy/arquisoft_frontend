import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Logout= () => {
  const navigate = useNavigate();
  const { handleUserLogout } = useAuth();

  useEffect(() => {
    handleUserLogout();
    navigate('/');
  }, []);

}

export default Logout;
