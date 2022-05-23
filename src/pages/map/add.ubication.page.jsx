import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Checkbox } from '@mui/material';
import { Formik, Form } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import Hero from '../../components/layout/hero.component';
import config from '../../config';
import Loading from '../../components/ui/loading.component';
import { Deserializer } from 'jsonapi-serializer';
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
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    var requestOptions = {
      method: 'GET',
    };
    setLoading(true);
    fetch(`${config.API_URL}/tag/all`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          setError(true);
          return [];
        }
        return response.json();
      })
      .then((data) => {
        new Deserializer({ keyForAttribute: 'camelCase' }).deserialize(
          data,
          (_error, tags) => setTags(tags)
        );
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return (
      <section className="container">
        <Loading />
      </section>
    );
  }
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
            user_id: `${currentUser.data.id}`,
            lat: location.state.lat,
            lng: location.state.lng,
            tags: [],
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
                label="Nombre ubicación"
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
              <div role="group" aria-labelledby="checkbox-group">
                <Typography variant="h5" textAlign="left">
                  Ingresa tags a tu ubicación:
                </Typography>
                {tags.forEach((tag) => (
                  console.log(tag.name),
                  <label>
                    <Checkbox type="checkbox" name="checked" value={tag.id} />
                    {tag.name}
                  </label>
                ))}
              </div>
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
