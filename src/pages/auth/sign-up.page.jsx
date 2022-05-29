import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from 'react';
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
import useSendImagesUrl from '../../hooks/sendImagesUrl';
import getUser from '../../hooks/getUser';
import useUpdateUserId from '../../hooks/auth/updateUserId';
import loginUser from '../../hooks/auth/loginUser';
import Loading from '../../components/ui/loading.component';



const validationSchema = Yup.object({
  firstname: Yup.string().required('Required'),
  lastname: Yup.string().required('Required'),
  username: Yup.string().required('Required'),
  email: Yup.string().email('Debe ser un mail válido').required('Required'),
  foto_1: Yup.string().required('Requiered'),
  foto_2: Yup.string().required('Requiered'),
  foto_3: Yup.string().required('Requiered'),
  acceptConditions: Yup.bool().oneOf(
    [true],
    'You must agree to the terms and conditions'
  ),
});
export default function SignUpPage() {
  const { currentUser, handleUserLogin, accessToken, saveAccessToken } = useAuth();
  const [message, setMessage] = useState('');
  const { user, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <section className="container">
        <Loading />
      </section>
    );
  }

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
            email: user.email,
            foto_1: '',
            foto_2: '',
            foto_3: '',
            acceptConditions: false,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setLoading(true);
            const requestOptions = {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
              body: JSON.stringify(values),
            };
              const response = await fetch(
                `${config.API_URL}/user/register`,
                requestOptions
              );
              if (!response.ok) {
                const error = await response.text();
                setLoading(false);
                throw new Error(error);
              }
              const backendUser = await response.json();
              var urls = await uploadFilesFunction(backendUser.data.id);
              const newToken = await loginUser(accessToken, saveAccessToken);
              await useSendImagesUrl(urls, backendUser.data.id, setMessage, newToken);
              const user_with_photos = await getUser(backendUser.data.id);
              handleUserLogin(user_with_photos);
              useUpdateUserId(user_with_photos.data.id, user, getAccessTokenSilently);
              setLoading(false);
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
              <Typography variant="title2">Tienes que llenar estos datos para poder utilizar la página</Typography>      
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
              <UploadFile id={1} setFieldValue={setFieldValue}/>      
              <UploadFile id={2} setFieldValue={setFieldValue}/>      
              <UploadFile id={3} setFieldValue={setFieldValue}/>
              <Typography variant="body2">Tienes que subir 3 fotos para poder registrarte</Typography>      
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
                Guardar datos
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Hero>
  );
}

