import React, { useState, useEffect, Component } from 'react';
import { Typography, Box, Container } from '@mui/material';
import config from '../config';
import { Deserializer } from 'jsonapi-serializer';

export default function CovidStats() {
    const [covidStats, setCovidStats] = useState({active: null, total: null, new: null});

useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`${config.API_URL}/covid/stats`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          return [];
        }
        return response.json();
      })
      .then((data) => {
          setCovidStats({...covidStats, active: data.active, total: data.total, new: data.new});
      })
      .catch((error) =>  console.log(error));
  }, []);

    return (
      <Box>
          <Typography
            variant="h6"
            component="div"
            textAlign="center"
            >
            Casos Covid
        </Typography>
        <Typography
            variant="h8"
            component="div"
            >
            Nuevos: {(covidStats.new) ? covidStats.new: "No hay datos"}, Activos: {covidStats.active}, Total: {covidStats.total}
        </Typography>
      </Box>
    );
  }
