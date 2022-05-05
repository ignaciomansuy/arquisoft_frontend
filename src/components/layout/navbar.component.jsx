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
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            F.R.I.E.N.D.S.
          </Typography>
          <Box>
            {currentUser ? (
              <>
              <Button color="inherit" onClick={handleUserLogout}>
                Cerrar sesión
              </Button>
              </>
            ) : (
              <>
              <Button color="inherit" onClick={() => navigate('/session/login')}>
                Iniciar sesión
              </Button>
              <Button color="inherit" onClick={() => navigate('/session/signup')}>
                Registrarse
              </Button>   
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}