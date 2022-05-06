import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, handleUserLogout } = useAuth();
  const logOut = () => {
    handleUserLogout;
    navigate('/map/show');
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {currentUser ? (
            <>
              <Typography
                variant="h6"
                component="div"
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate('/map/show')}
              >
                F.R.I.E.N.D.S.
              </Typography>
              <Box>
                <Button
                  color="inherit"
                  onClick={() => navigate('/map/show_ubications')}
                >
                  Ver mis ubicaciones
                </Button>
                <Button color="inherit" onClick={() => logOut()}>
                  Cerrar sesión
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography
                variant="h6"
                component="div"
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate('/')}
              >
                F.R.I.E.N.D.S.
              </Typography>
              <Box>
                <Button
                  color="inherit"
                  onClick={() => navigate('/session/login')}
                >
                  Iniciar sesión
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/session/signup')}
                >
                  Registrarse
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
