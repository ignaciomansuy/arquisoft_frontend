import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Hero from '../../components/layout/hero.component';
import config from '../../config';


const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  lastname: Yup.string().required('Required'),
  username: Yup.string().required('Required'),
  email: Yup.string().email('Debe ser un mail válido').required('Required'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener mínimo 6 caracteres.')
    .required('Required'),
  confirmPassword: Yup.string()
    .min(6, 'La contraseña debe tener mínimo 6 caracteres.')
    .required('Required')
    .oneOf([Yup.ref('password'), null], 'Contraseñas no coinciden'),
  acceptConditions: Yup.bool().oneOf(
    [true],
    'You must agree to the terms and conditions'
  ),
});
export default function SignUpPage() {
  const [message, setMessage] = useState('');
  return (
    <Hero navbar>
      <Breadcrumbs sx={{ my: 4 }}>
        <Link color="inherit" to="/" component={RouterLink}>
          Home
        </Link>
        <Typography color="text.primary">Sign up</Typography>
      </Breadcrumbs>
      <Typography variant="h3" component="h1" sx={{ color: 'primary.main' }}>
        Registrarse{' '}
      </Typography>
      <Box sx={{ my: 2 }}>
        <Formik
          initialValues={{
            name: '',
            lastname: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptConditions: false,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
            };
            try {
              const response = await fetch(`${config.API_URL}/session/register`, requestOptions);
              if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
              }
              setMessage('El usuario se ha creado correctamente');
              window.location.replace('/map/show');
            } catch (error) {
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
                label="Nombre"
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
                label="Apellido"
                name="lastname"
                size="large"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastname}
                error={errors.lastname && touched.lastname}
                helperText={errors.lastname && touched.lastname ? errors.lastname : null}
                fullWidth
              />
              <TextField
                sx={{ my: 1 }}
                label="Nombre usuario"
                name="username"
                size="large"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                error={errors.username && touched.username}
                helperText={errors.username && touched.username ? errors.username : null}
                fullWidth
              />
              <TextField
                sx={{ my: 1 }}
                label="Email"
                name="email"
                size="large"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                error={errors.email && touched.email}
                helperText={errors.email && touched.email ? errors.email : null}
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
              <TextField
                sx={{ my: 1 }}
                label="Confirma tu contraseña"
                name="confirmPassword"
                size="large"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
                error={errors.confirmPassword && touched.confirmPassword}
                helperText={
                  errors.confirmPassword && touched.confirmPassword
                    ? errors.confirmPassword
                    : null
                }
                type="password"
                fullWidth
              />
              <FormGroup sx={{ my: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.acceptConditions}
                      onChange={handleChange}
                      name="acceptConditions"
                    />
                  }
                  label="I agree to the terms and conditions"
                />
                {errors.acceptConditions && touched.acceptConditions ? (
                  <FormHelperText
                    error={errors.acceptConditions && touched.acceptConditions}
                  >
                    {errors.acceptConditions}
                  </FormHelperText>
                ) : null}
              </FormGroup>
              <p className="Errors">{message}</p>
              <Button variant="contained" size="large" onClick={handleSubmit}>
                Registrarse
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
      <Typography variant="body1">
        Ya tienes una cuenta?{' '}
        <Link to="/sign-in" component={RouterLink}>
          Iniciar sesión
        </Link>
      </Typography>
    </Hero>
  );
}
