import React, {useEffect} from 'react';
import Typography from '@mui/material/Typography';
import Hero from '../../components/layout/hero.component';
import config from "../../config"

export default function HomePage() {
  useEffect(() => {
    fetch(`${config.API_URL}`)
      .then((response) => {
        if (!response.ok) {
          console.log(response);
          return [];
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <Hero
      navbar
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        textAlign="center"
        sx={{ color: 'primary.main' }}
      >
        F.R.I.E.N.D.S.
      </Typography>
      <Typography variant="h4" textAlign="center">
      Regístrate o inicia sesión para tener la mejor experiencia y encontrar
      amigos para toda la vida.
      </Typography>
    </Hero>
  );
}
