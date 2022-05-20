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

export default function pingsSend() {
  const [pings_send, setPings_send] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`${config.API_URL}/ping/sended_by/${currentUser.data.id}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          return [];
        }
        return response.json();
      })
      .then((data) => {
        new Deserializer({ keyForAttribute: 'camelCase' }).deserialize(data, (_error, pings_send) => setPings_send(pings_send));
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Hero navbar>
      <Typography
        variant="h3"
        component="h2"
        textAlign="center"
        sx={{ color: 'primary.main' }}
      >
        Tus pings enviados
      </Typography>
      <Typography variant="h6" textAlign="left">
        Aquí puedes encontrar los pings que haz enviado
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>id de quien manda</StyledTableCell>
              <StyledTableCell align="right">id de quien recibe</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pings_send.map((ping) => (
              <StyledTableRow key={ping.id}>
                <StyledTableCell component="th" scope="row">
                  {ping.senderUserId}
                </StyledTableCell>
                <StyledTableCell align="right">{ping.receiverUserId}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Hero>
  );
}
