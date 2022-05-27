import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate, Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import CovidStats from '../covi.api.component';
import LoginButton from "../auth/LoginButton"
import LogoutButton from "../auth/LogoutButton"
import { useAuth0 } from "@auth0/auth0-react";


export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const { currentUser, handleUserLogout } = useAuth();
  
  // useEffect(() => {
  //   if (!currentUser) {
  //     navigate('/'); 
  //   }
  // }, [currentUser, handleUserLogout]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {isAuthenticated ? (
            <>
              <Box>
                <Button
                  color="inherit"
                  onClick={() => navigate('/map/show')}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ cursor: 'pointer' }}
                  >
                    F.R.I.E.N.D.S.
                  </Typography>
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/users/list')}
                >
                  Lista de usuarios
                </Button>
              </Box>
              {/* aqui van los pings nuevitos */}
              <Box>
                <CovidStats />
              </Box>
              <Box>
                <Button
                  color="inherit"
                  onClick={() => navigate('/map/show_ubications')}
                >
                  Ver mis ubicaciones
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/pings/send')}
                >
                  Enviar Ping
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/pings/show_received')}
                >
                  pings recibidos
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/pings/show_send')}
                >
                  pings enviados
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/map/compare')}
                >
                  Comparar
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate('/perfil')}
                >
                  Perfil
                </Button>
                <LogoutButton />
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
                <LoginButton />
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
