import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import Button from '@mui/material/Button';


const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button color='inherit' onClick={() => logout({ returnTo: `${window.location.origin}/logout` })}>
      Log Out
    </Button>
  );
};

export default LogoutButton;