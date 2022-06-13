import React from 'react';
import Typography from '@mui/material/Typography';
import Hero from '../../components/layout/hero.component';

export default function HomePage() {
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
      amigos para toda la vida. Probando2
      </Typography>
    </Hero>
  );
}
