import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
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
import useAuth from '../../hooks/useAuth';
import Hero from '../../components/layout/hero.component';
import config from '../../config';
import UploadFile from '../../components/ui/upload.file';
import uploadFilesFunction from '../../hooks/uploadFile';
import sendImagesUrl from '../../hooks/sendImagesUrl';

const validationSchema = Yup.object({
  firstname: Yup.string().required('Required'),
  lastname: Yup.string().required('Required'),
  username: Yup.string().required('Required'),
  email: Yup.string().email('Debe ser un mail válido').required('Required'),
  foto_1: Yup.string().required('Requiered'),
  foto_2: Yup.string().required('Requiered'),
  foto_3: Yup.string().required('Requiered'),
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
  const { currentUser, handleUserLogin } = useAuth();
  const [message, setMessage] = useState('');
  return (
    <Hero navbar>
      {currentUser && <Navigate to="/" />}
      <Breadcrumbs sx={{ my: 4 }}>
        <Link color="inherit" to="/" component={RouterLink}>
          Home
        </Link>
        <Typography color="text.primary">Sign up</Typography>
      </Breadcrumbs>
      <Typography variant="h3" component="h1" sx={{ color: 'primary.main' }}>
        Registrarse
        {' '}
      </Typography>
      <Box sx={{ my: 2 }}>
        <Formik
          initialValues={{
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            foto_1: '',
            foto_2: '',
            foto_3: '',
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
              const response = await fetch(
                `${config.API_URL}/user/register`,
                requestOptions
              );
              if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
              }
              const user = await response.json();
              var urls = await uploadFilesFunction(user.data.id);
              sendImagesUrl(urls, user.data.id, setMessage);
              handleUserLogin(user);
              setMessage('El usuario se ha creado correctamente');
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
            setFieldValue
          }) => (
            <Form encType="multipart/form-data">
              <TextField
                sx={{ my: 1 }}
                label="Nombre"
                name="firstname"
                size="large"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstname}
                error={errors.firstname && touched.firstname}
                helperText={errors.firstname && touched.firstname ? errors.firstname : null}
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
                helperText={
                  errors.lastname && touched.lastname ? errors.lastname : null
                }
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
                helperText={
                  errors.username && touched.username ? errors.username : null
                }
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
              <UploadFile id={1} setFieldValue={setFieldValue}/>      
              <UploadFile id={2} setFieldValue={setFieldValue}/>      
              <UploadFile id={3} setFieldValue={setFieldValue}/>
              <Typography variant="body2">Tienes que subir 3 fotos para poder registrarte</Typography>      
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
