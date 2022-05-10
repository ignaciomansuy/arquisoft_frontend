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

export default function AddPingPage() {
  const [pings_received, setPings_received] = useState([]);
  const { currentUser } = useAuth();
  return (
    <Hero navbar>
      <Typography
        variant="h2"
        component="h1"
        textAlign="center"
        sx={{ color: 'primary.main' }}
      >
        Manda un ping a un amigo
      </Typography>
      <Typography variant="h4" textAlign="center">
        Escribe el id de a quien se los vas a mandar
      </Typography>
      <Box sx={{ my: 2 }}>
        <Formik
          initialValues={{
            id: currentUser.data.id,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
            };
            try {
              const response = await fetch(
                `${config.API_URL}/pings/create`,
                requestOptions
              );
              if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
              }
              setMessage('Se ha guardado el ping correctamente.');
              navigate('/');
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
                label="id"
                name="id"
                size="large"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.id}
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
                Mandar Ping{' '}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Hero>
  );
}
