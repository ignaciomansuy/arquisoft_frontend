import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Hero from '../../components/layout/hero.component';
import config from '../../config';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.info.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ShowUserUbicationsPage() {
  const [ubications, setUbications] = useState([]);

//   useEffect(async () => {
//     const requestOptions = {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     };
//     try {
//       const response = await fetch(
//         `${config.API_URL}/map/show_ubications`,
//         requestOptions
//       );
//       if (!response.ok) {
//         const error = await response.text();
//         throw new Error(error);
//       }
//       console.log("**************************");
//       console.log(response);
//       setUbications(response);
//     } catch (error) {
//       console.log(error);
//     }
//   }, []);

useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`${config.API_URL}/map/show_ubications`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          return [];
        }
        return response.json();
      })
      .then((data) => {
        console.log(data)
        setUbications(data);
      })
      .catch((error) =>  console.log(error));
  }, []);

  return (
    <Hero navbar>
      <Typography
        variant="h3"
        component="h2"
        textAlign="center"
        sx={{ color: 'primary.main' }}
      >
        Tus ubicaciones guardadas
      </Typography>
      <Typography variant="h6" textAlign="left">
        Aquí puedes encontrar las ubicaciones que haz guardado.
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Nombre</StyledTableCell>
              <StyledTableCell align="right">Latitud</StyledTableCell>
              <StyledTableCell align="right">Longitud</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ubications.map((ubi) => (
              <StyledTableRow key={ubi.name}>
                <StyledTableCell component="th" scope="row">
                  {ubi.name}
                </StyledTableCell>
                <StyledTableCell align="right">{ubi.lat_lng.coordinates[0]}</StyledTableCell>
                <StyledTableCell align="right">{ubi.lat_lng.coordinates[1]}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Hero>
  );
}
