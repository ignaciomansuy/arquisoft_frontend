import React from 'react';
import Typography from '@mui/material/Typography';
import Hero from '../../components/layout/hero.component';

export default function ShowMapPage() {
  return (
    <Hero navbar>
      <Typography
        variant="h2"
        component="h1"
        textAlign="center"
        sx={{ color: 'primary.main' }}
      >
        Bienvenido a F.R.I.E.N.D.S.
      </Typography>
      <Typography variant="h4" textAlign="center">
      Navega por el mapa para encontrar nuevos amigos :)
      </Typography>
      <Typography variant="h6" textAlign="left">
      En este mapa puedes agregar nuevas ubicaciones y a la vez puedes ver todas las ubicaciones de otros usuarios (y también las tuyas).
      </Typography>
      <Typography variant="h6" textAlign="left">
      Para agregar una ubicación haz doble click en el lugar que deseas
      agregarla.
      </Typography>
      <Typography variant="h6" textAlign="left">
      Para moverte por el mapa haz un click y mueve donde desees. Para hacer zoom apreta rueda del mouse o apreta los íconos +/-.
      </Typography>
    </Hero>
  );
}