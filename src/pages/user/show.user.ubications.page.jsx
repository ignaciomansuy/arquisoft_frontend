import React, { useEffect, useState } from 'react';
import { Deserializer } from 'jsonapi-serializer';
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
import useAuth from '../../hooks/useAuth';
import UbicationTags from '../../components/ubication.tags.component'

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
  const { currentUser } = useAuth();
  // function getUbicationTags(ubication_id) {
  //   const requestOptions = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   };
  //   fetch(`${config.API_URL}/show_tags/${ubication_id}`, requestOptions)
  //     .then((response) => {
  //       if (!response.ok) {
  //         return [];
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((catchedError) => {
  //       console.log(catchedError);
  //       return null;
  //     });
  // }
  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(
      `${config.API_URL}/map/show_ubications/${currentUser.data.id}`,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          return [];
        }
        return response.json();
      })
      .then((data) => {
        new Deserializer({ keyForAttribute: 'camelCase' }).deserialize(
          data,
          (_error, ubications) => setUbications(ubications)
        );
      })
      .catch((error) => console.log(error));
  }, []);

  // useEffect(() => {
  //   const requestOptions = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   };
  //   fetch(
  //     `${config.API_URL}/show_tags/${ubication_id}`,
  //     requestOptions
  //   )
  //     .then((response) => {
  //       if (!response.ok) {
  //         return [];
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       new Deserializer({ keyForAttribute: 'camelCase' }).deserialize(
  //         data,
  //         (_error, ubications) => setUbications(ubications)
  //       );
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

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
              <StyledTableCell align="right">Tags</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ubications.map((ubi) => (
              <StyledTableRow key={ubi.id}>
                <StyledTableCell component="th" scope="row">
                  {ubi.name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {ubi.coordinate.coordinates[0]}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {ubi.coordinate.coordinates[1]}
                </StyledTableCell>
                {/* <StyledTableCell align="right">
                  nada
                </StyledTableCell> */}
                <UbicationTags
                    ubicationId={ubi.id}
                  />
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Hero>
  );
}
