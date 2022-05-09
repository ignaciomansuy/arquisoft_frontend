import React, { useState, useEffect, Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Typography, Box } from '@mui/material';
import config from '../../config';
import { Deserializer } from 'jsonapi-serializer';
import Hero from '../../components/layout/hero.component';
import Map from '../../components/map.component';

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
    fetch(`${config.API_URL}/users/list`, requestOptions)
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
    console.log(users);
    users.forEach((user) => Users.push({value: user.id, label: user.username}));
    console.log(Users);

    const [selectedOption, setSelectedOption] = useState([]);
    const maxOptions = 5;
 
    // handle onChange event of the dropdown
    const handleChange = e => {
      setSelectedOption(e);
      console.log(e);
    }

    return (
      <Hero navbar>
        <Box sx={{ my: 2 }}>
        <Select
        isMulti
        placeholder="Select Option"
        value={selectedOption} // set selected value
        //options={Users} // set list of the data
        options={selectedOption.length === maxOptions ? [] : Users}
        noOptionsMessage={() => {
        return selectedOption.length === maxOptions ? 'You have reached the max options value' : 'No options available' ;
        }}
        onChange={handleChange} // assign onChange function
        selectionLimit="5"
        components={animatedComponents}
        />
        </Box>
        <Typography
          variant="h2"
          component="h1"
          textAlign="center"
          sx={{ color: 'primary.main' }}
        >
          Hola a F.R.I.E.N.D.S.
        </Typography>
        <Typography variant="h4" textAlign="center">
          Navega por el mapa para encontrar nuevos amigos :)
        </Typography>
        <Typography variant="h6" textAlign="left">
          En este mapa puedes agregar nuevas ubicaciones y a la vez puedes ver
          todas las ubicaciones de otros usuarios (y también las tuyas).
        </Typography>
        <Typography variant="h6" textAlign="left">
          Para agregar una ubicación haz doble click en el lugar que deseas
          agregarla.
        </Typography>
        <Typography variant="h6" textAlign="left">
          Para moverte por el mapa haz un click y mueve donde desees. Para hacer
          zoom apreta ctr + la rueda del mouse, o apreta los íconos +/-.
        </Typography>
        <Box sx={{ my: 2 }}>
          <Map />
        </Box>
      </Hero>
    );
  }
  
