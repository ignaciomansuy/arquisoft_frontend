import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Deserializer } from 'jsonapi-serializer';
import config from '../../config';
import useAuth from '../../hooks/useAuth';
import { DataGrid } from '@mui/x-data-grid';
import Loading from '../../components/ui/loading.component'; 

export default function sendPings() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { currentUser } = useAuth();

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
      .then((data) => {new Deserializer({keyForAttribute: 'camelCase'}).deserialize(data, (_error, userList) => setUsers(userList))})
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  function makePing(receiver_id) {
    setLoading(true);
    const info = {
      "sender_user_id": currentUser.data.id,
      "receiver_user_id": receiver_id, 
      "active": true,
    }
    console.log(info)
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    };
    fetch(`${config.API_URL}/ping/create`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          setMessage(response);
          setError(true);
          return [];
        }
        window.location.reload(false);
        return [];
      })
      .catch((catchedError) => {
        setMessage(catchedError);
        setError(true);
      })
      .finally(() => setLoading(false));
  }

  const addUser = (user) => setUsers((prevState) => [...prevState, user]);

  if (loading) {
    return (
      <section className='container'>
        <Loading/>
      </section>
    );
  }
  
  return (
    <div className="container box">
      {
        error ? (
          <ErrorTitle error={message} />
        ) : (
          <div className="block has-text-centered">
            <h2 className="title is-2">Send ping list</h2>
            <table className="table container">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Send ping</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={`${user?.id}`}>
                    <td>
                      {`${user?.firstname}`}
                    </td>
                    <td>
                      {`${user?.username}`}
                    </td>
                    <td>
                      <button type="button" onClick={() => makePing(user.id)} className="button is-primary is-small">Send ping</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  );
};
