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
  Button,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Hero from '../../components/layout/hero.component';
import config from '../../config';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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

export default function PingsReceived() {
  const [pings_received, setPings_received] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  function acceptPing(ping_id) {
    setLoading(true);
    const info = {
      approved: true,
      active: false,
    };
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    };
    fetch(`${config.API_URL}/ping/${ping_id}/update_ping`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          setMessage(response);
          return [];
        }
        window.location.reload(false);
        return [];
      })
      .catch((catchedError) => {
        setMessage(catchedError);
      })
      .finally(() => setLoading(false));
  }

  function rejectPing(ping_id) {
    setLoading(true);
    const info = {
      approved: false,
      active: false,
    };
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    };
    fetch(`${config.API_URL}/ping/${ping_id}/update_ping`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          setMessage(response);
          return [];
        }
        window.location.reload(false);
        return [];
      })
      .catch((catchedError) => {
        setMessage(catchedError);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(
      `${config.API_URL}/ping/received_by/${currentUser.data.id}`,
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
          (_error, pings_received) => setPings_received(pings_received)
        );
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
        Tus pings recibidos
      </Typography>
      <Typography variant="h6" textAlign="left">
        Aquí puedes encontrar los pings que te han enviado
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>id de quien manda</StyledTableCell>
              <StyledTableCell align="right">Aceptar/Rechazar</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pings_received.map((ping) =>
              ping.active ? (
                <StyledTableRow key={ping.id}>
                  <StyledTableCell component="th" scope="row">
                    {ping.senderUserId}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {' '}
                    <Button
                      onClick={() => acceptPing(ping.id)}
                      variant="contained"
                      color="success"
                    >
                      Aceptar
                    </Button>
                    <Button
                      onClick={() => rejectPing(ping.id)}
                      variant="outlined"
                      color="error"
                    >
                      Rechazar
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ) : ping.approved ? (
                <StyledTableRow key={ping.id}>
                  <StyledTableCell component="th" scope="row">
                    {ping.senderUserId}
                  </StyledTableCell>
                  <StyledTableCell align="right"><Button onClick={() => navigate('/chat/' + ping.senderUserId)}>Chat</Button></StyledTableCell>
                </StyledTableRow>
              ) : (
                <StyledTableRow key={ping.id}>
                  <StyledTableCell component="th" scope="row">
                    {ping.senderUserId}
                  </StyledTableCell>
                  <StyledTableCell align="right">Lo rechazastes</StyledTableCell>
                </StyledTableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Hero>
  );
}
