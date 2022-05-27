import Button from '@mui/material/Button';
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <Button color='inherit' onClick={() => loginWithRedirect()}>Iniciar sesión</Button>;
};

export default LoginButton;