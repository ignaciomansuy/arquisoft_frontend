import React, { useState, useEffect, Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Typography, Box, Container } from '@mui/material';
import config from '../../config';
import { Deserializer } from 'jsonapi-serializer';
import Hero from '../../components/layout/hero.component';
import UserMap from '../../components/user.map.component';

export default function CompareMapPage() {
  const animatedComponents = makeAnimated();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`${config.API_URL}/user/index`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          return [];
        }
        return response.json();
      })
      .then((data) => {
        new Deserializer({ keyForAttribute: 'camelCase' }).deserialize(data, (_error, users)=> setUsers(users));
      })
      .catch((error) =>  console.log(error));
  }, []);

  let Users = [];
  users.forEach((user) => Users.push({value: user.id, label: user.username}));

  const [selectedOption, setSelectedOption] = useState([]);
  const maxOptions = 5;

  // handle onChange event of the dropdown
  const handleChange = e => {
    setSelectedOption(e);
  }

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
        Selecciona usuarios para ver sus ubicaciones
      </Typography>
      
      <Container sx={{ my: 2 }} >
      <Select
        styles={{
            // Fixes the overlapping problem of the component
            menu: provided => ({ ...provided, zIndex: 9999 })
          }}
        isMulti
        placeholder="Selección de usuarios"
        value={selectedOption} // set selected value
        options={selectedOption.length === maxOptions ? [] : Users}
        noOptionsMessage={() => {
        return selectedOption.length === maxOptions ? 'No se pueden elegir más usuarios' : 'No hay más usuarios' ;
        }} // set list of the data
        onChange={handleChange} // assign onChange function
        components={animatedComponents}
      />
      </Container>

      <Typography variant="h4" textAlign="left">
        En estos mapas verás las ubicaciones de los usuarios seleccionados.
      </Typography>

      <Box sx={{ my: 2 }}>
          {selectedOption.map((value) =>
          <Typography variant="h6" textAlign="left">
          <div>Mapa del usuario {value.label}</div>
          <div><UserMap value={value.value} /></div>
          </Typography>
          )}
      </Box>
    </Hero>
  );
}
  
