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
import Modal from 'react-modal';

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

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

export default function pingsSend() {
  const [pings_send, setPings_send] = useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(
      `${config.API_URL}/ping/sended_by/${currentUser.data.id}`,
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
          (_error, pings_send) => setPings_send(pings_send)
        );
      })
      .catch((error) => console.log(error));
  }, []);
  
  const [pingId, setPingId] = useState();
  const [IndexResultState, setIndexResultState] = useState();
  const [sidi, setSidi] = useState();
  const [siin, setSiin] = useState();
  const [dindin, setDindin] = useState();
  // const [lastUpdate, setlastUpdated] = useState();

  function openModal(ping_id) {
    setPingId(ping_id);
    setIsOpen(true);
  }

  function afterOpenModal() {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(
      `${config.API_URL}/index-result/${pingId}`,
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
        );
        const atrs = data.data.attributes
        setSidi(atrs.sidi)
        setSiin(atrs.siin)
        setDindin(atrs.dindin)
        setIndexResultState(atrs.state)
      })
      .catch((error) => console.log(error));
  }

  function closeModal() {
    setIsOpen(false);
  }

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
              <StyledTableCell>id de quien recibe</StyledTableCell>
              <StyledTableCell align="left">Indices</StyledTableCell>
              <StyledTableCell align="right">Estado</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pings_send.map((ping) => (
              <StyledTableRow key={ping.id}>
                <StyledTableCell component="th" scope="row">
                  {ping.receiverUserId}
                </StyledTableCell>
                <StyledTableCell>
                  <Button onClick={() => openModal(ping.id)}>Ver indices</Button>
                  <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    style={customStyles}
                  >
                    <h3>Ping {pingId}</h3>
                    {IndexResultState === 'ready' && 
                      <div className='index-results'>
                        <p>Indice Sidi (distancia) : {sidi}</p>
                        <p>Indice Siin (intereses comunes) : {siin}</p>
                        <p>Indice DinDin (sidi x siin) : {dindin}</p>
                      </div>
                    }
                    {IndexResultState !== 'ready' && 
                      <h4>Aún no termina el calculo de los indices, te notificaremos via email cuando esten listos!</h4>
                    }
                    <button onClick={closeModal}>Cerrar</button>
                  </Modal>
                </StyledTableCell>
                {ping.active ? (
                  <StyledTableCell align="right">No respondido</StyledTableCell>
                ) : (
                  ping.approved ? (
                  <StyledTableCell align="right">Aprobado</StyledTableCell>
                  ) : (
                    <StyledTableCell align="right">Rechazado</StyledTableCell>
                    )
                )}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Hero>
  );
}
