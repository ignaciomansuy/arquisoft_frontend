import React, { useEffect, useState } from 'react';
import {
  Divider,
  Typography,
  Grid,
  ImageListItem,
  ImageList,
} from '@mui/material';
import Hero from '../../components/layout/hero.component';
import { styled } from '@mui/material/styles';
import useAuth from '../../hooks/useAuth';

const Img = styled('img')({
  margin: 'auto',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function ShowUserUbicationsPage() {
  const { currentUser } = useAuth();

  console.log(currentUser);
  return (
    <Hero navbar>
      <Typography
        variant="h3"
        component="h2"
        textAlign="center"
        sx={{ color: 'primary.main' }}
      >
        Perfil
      </Typography>
      <Divider />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs>
          Nombre
        </Grid>
        <Grid item xs>
          {currentUser.data.attributes.firstname}{' '}
          {currentUser.data.attributes.lastname}
        </Grid>
      </Grid>
      <Divider />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs>
          Nombre usuario
        </Grid>
        <Grid item xs>
          {currentUser.data.attributes.username}
        </Grid>
      </Grid>
      <Divider />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs>
          Email
        </Grid>
        <Grid item xs>
          {currentUser.data.attributes.email}
        </Grid>
      </Grid>
      <Divider />
      <Typography variant="h5" textAlign="left" sx={{ color: 'primary.main' }}>
        Tus fotos de perfil
      </Typography>
      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        <ImageListItem>
          <img
            src={currentUser.data.attributes.photos[0]}
            loading="lazy"
          />
        </ImageListItem>
        <ImageListItem>
          <img
            src={currentUser.data.attributes.photos[1]}
            loading="lazy"
          />
        </ImageListItem>
        <ImageListItem>
          <img
            src={currentUser.data.attributes.photos[2]}
            loading="lazy"
          />
        </ImageListItem>
      </ImageList>
    </Hero>
  );
}
