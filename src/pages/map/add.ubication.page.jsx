import React, { useState } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import Hero from '../../components/layout/hero.component';
import config from '../../config';
import useAuth from '../../hooks/useAuth';

const validationSchema = Yup.object({
  name: Yup.string().required('Este campo es requerido'),
  lat: Yup.string().required('Este campo es requerido'),
  lng: Yup.string().required('Este campo es requerido'),
});

export default function AddUbicationPage() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  console.log(currentUser.data.id);
  return (
    <Hero navbar>
      <Typography
        variant="h2"
        component="h1"
        textAlign="center"
        sx={{ color: 'primary.main' }}
      >
        Agrega una ubicación al mapa
      </Typography>
      <Typography variant="h4" textAlign="center">
        Te damos las coordenadas de donde hiciste doble click. O puedes editar y
        poner otra de tu preferencia.
      </Typography>
      <Box sx={{ my: 2 }}>
        <Formik
          initialValues={{
            name: '',
            lat: location.state.lat,
            lng: location.state.lng,
            id: currentUser.data.id,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            console.log(values.name);
            console.log(values.id);
            const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
            };
            try {
              const response = await fetch(
                `${config.API_URL}/map/add_ubication`,
                requestOptions
              );
              if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
              }
              setMessage('Se ha guardado la ubicación correctamente.');
              navigate('/map/show');
            } catch (error) {
              console.log(error);
              setMessage(error.message);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <Form>
              <TextField
                sx={{ my: 1 }}
                label="Nombre usuario"
                name="name"
                size="large"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                error={errors.name && touched.name}
                helperText={errors.name && touched.name ? errors.name : null}
                fullWidth
              />
              <TextField
                sx={{ my: 1 }}
                label="Latitud"
                name="lat"
                size="large"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lat}
                error={errors.lat && touched.lat}
                helperText={errors.lat && touched.lat ? errors.lat : null}
                fullWidth
              />
              <TextField
                sx={{ my: 1 }}
                label="Longitud"
                name="lng"
                size="large"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lng}
                error={errors.lng && touched.lng}
                helperText={errors.lng && touched.lng ? errors.lng : null}
                fullWidth
              />
              <p className="Errors">{message}</p>
              <Button
                sx={{ my: 1 }}
                variant="contained"
                size="large"
                onClick={handleSubmit}
              >
                Agregar ubicación{' '}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Hero>
  );
}
