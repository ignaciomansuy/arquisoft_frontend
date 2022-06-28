import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Deserializer } from 'jsonapi-serializer';
import config from '../../config';
import useAuth from '../../hooks/useAuth';
import { Typography, Grid, Button, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { DataGrid } from '@mui/x-data-grid';
import Loading from '../../components/ui/loading.component';
import Hero from '../../components/layout/hero.component';
import { decodeToken, useJwt } from "react-jwt";
import sign from 'jwt-encode';
import { hashString, hashArray } from 'react-hash-string';

const ws_api_url = `http://3.223.98.40`;


export default function sendPings() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { currentUser } = useAuth();

  // URL to index calculation service
  const INDEX_SERVICE_URL = 'https://k22ok5vv55.execute-api.us-east-1.amazonaws.com/index/dindin/';

  useEffect(() => {
    var requestOptions = {
      method: 'GET',
    };
    setLoading(true);
    fetch(`${config.API_URL}/user/index`, requestOptions)
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
          (_error, userList) => setUsers(userList)
        );
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // creates an empty index result instance, that will be later updated by the index calculation service
  const create_index_result = (ping_id) => {
    const info = {
      siin: null,
      sidi: null,
      dindin: null,
      state: 'pending',
      pingId: ping_id,
    };
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    };
    fetch(`${config.API_URL}/index-result/create`, requestOptions)
    .catch((error) =>  console.log(error));
  }

  const calculate_indexes = (sender_id, receiver_id, ping_id) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(INDEX_SERVICE_URL + `${sender_id}/${receiver_id}/${ping_id}/`, requestOptions)
    .catch((error) =>  console.log(error));
  }

  const inviteToRoom = async (uuid, room_id, token) => {
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ entity_UUID: uuid })
    };
    fetch(`${ws_api_url}/rooms/${room_id}/invitation`, requestOptions)
    .catch(err => console.log(err))
  }


  const createRoom = async (sender_id, receiver) => {
    const receiver_id = receiver.id;
    const receiver_uuid = receiver.uuid;
    const secret = 'NOTASECRETANYMORE'
    const data = {
      "aud": "https://chat.nano.net",
      "iss": "https://api.nano.net",
      "iat": 1000000,
      "exp": 21475878357,
      "entityUUID": currentUser.data.attributes.uuid, // For this project, this will be equal to userUUID 
      "userUUID": currentUser.data.attributes.uuid,
      "levelOnEntity": 100
    };
    const token = sign(data, secret);
    // console.log(Math.abs([hashString(String(sender_id) + '-' + String(receiver_id)), hashString(String(receiver_id) + '-' +String(sender_id))].sort()));
    const room_id = Math.abs(hashArray([hashString(String(sender_id) + '-' + String(receiver_id)), hashString(String(receiver_id) + '-' +String(sender_id))].sort()));
    const data_body = {
      name: `chat between user: ${sender_id} and user: ${receiver_id} `,
      level_admin: 100,
      type: 'group',
      id: room_id, 
    }
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data_body),
    };

    fetch(`${ws_api_url}/rooms`, requestOptions)
    .then(() => {
      inviteToRoom(receiver_uuid, room_id, token)
    })
    .catch(err => console.log(err))


  }

  function makePing(receiver) {
    setLoading(true);
    const info = {
      sender_user_id: currentUser.data.id,
      receiver_user_id: receiver.id,
      active: true,
    };
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    };
    fetch(`${config.API_URL}/ping/create`, requestOptions)
      .then(async (response) => {
        const pingData = await response.json()
        if (!response.ok) {
          setMessage(response);
          setError(true);
          return [];
        }
        createRoom(info.sender_user_id, receiver)
        create_index_result(pingData.data.id);
        calculate_indexes(info.sender_user_id, receiver_id, pingData.data.id);
        window.location.reload(false);
        return [];
      })
      .catch((catchedError) => {
        setMessage(catchedError);
        setError(true);
      })
      .finally(() => {
        setLoading(false)
      });
  }

  const addUser = (user) => setUsers((prevState) => [...prevState, user]);

  if (loading) {
    return (
      <section className="container">
        <Loading />
      </section>
    );
  }

  return (
    <div className="container box">
      {error ? (
        <ErrorTitle error={message} />
      ) : (
        <Hero navbar>
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            sx={{ color: 'primary.main' }}
          >
            Send ping list
          </Typography>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs>
              Nombre usuario
            </Grid>
            <Grid item xs>
              Enviar ping
            </Grid>
          </Grid>
          <Divider />
          {users.map((user) => (
            user.id!=currentUser.data.id ? (
            <>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs>
                  {user?.username}
                </Grid>
                <Grid item xs>
                  <Button
                    onClick={() => makePing(user)}
                    variant="contained"
                    endIcon={<SendIcon />}
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            </>
            ) : null
          ))}
        </Hero>
      )}
    </div>
  );
}
