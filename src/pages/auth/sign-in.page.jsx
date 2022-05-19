import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Navigate } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Hero from '../../components/layout/hero.component';
import useAuth from '../../hooks/useAuth';
import config from '../../config';

const validationSchema = Yup.object({
  username: Yup.string().required('Required'),
  password: Yup.string()
    .min(6, 'Your password must be at least 6 characters long')
    .required('Required'),
});

export default function SignInPage() {
  const { currentUser, handleUserLogin } = useAuth();
  const [message, setMessage] = useState('');
  return (
    <Hero navbar>
      {currentUser && <Navigate to="/" />}
      <Breadcrumbs sx={{ my: 4 }}>
        <Link color="inherit" to="/" component={RouterLink}>
          Home
        </Link>
        <Typography color="text.primary">Iniciar sesión</Typography>
      </Breadcrumbs>
      <Typography variant="h3" component="h1" sx={{ color: 'primary.main' }}>
        Iniciar sesión
      </Typography>
      <Box sx={{ my: 2 }}>
        <Formik
          initialValues={{
            username: '',
            password: '',
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
                `${config.API_URL}/login`,
                requestOptions
              );
              if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
              }
              const user = await response.json();
              handleUserLogin(user);
              setMessage('Ha iniciado sesión correctamente');
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
                name="username"
                size="large"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                error={errors.username && touched.username}
                helperText={
                  errors.username && touched.username ? errors.username : null
                }
                fullWidth
              />
              <TextField
                sx={{ my: 1 }}
                label="Contraseña"
                name="password"
                size="large"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                error={errors.password && touched.password}
                helperText={
                  errors.password && touched.password ? errors.password : null
                }
                type="password"
                fullWidth
              />
              <p className="Errors">{message}</p>
              <Button
                sx={{ my: 1 }}
                variant="contained"
                size="large"
                onClick={handleSubmit}
              >
                Iniciar sesión{' '}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
      <Typography variant="body1">
        No tienes cuenta?{' '}
        <Link to="/sign-up" component={RouterLink}>
          Registrarse{' '}
        </Link>
      </Typography>
    </Hero>
  );
}
