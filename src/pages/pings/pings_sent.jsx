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

export default function sendPings() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { currentUser } = useAuth();

  // URL to index calculation service
  const INDEX_SERVICE_URL = 'http://localhost:40/dindin/';

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
    console.log(info);
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

  function makePing(receiver_id) {
    setLoading(true);
    const info = {
      sender_user_id: currentUser.data.id,
      receiver_user_id: receiver_id,
      active: true,
    };
    console.log(info);
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
        create_index_result(pingData.data.id);
        // calculate_indexes(info.sender_user_id, receiver_id, pingData.data.id);
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
                    onClick={() => makePing(user.id)}
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
