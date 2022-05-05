import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Deserializer } from 'jsonapi-serializer';
import config from '../../config';
import useAuth from '../../hooks/useAuth';

const UserList = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${config.API_URL}/users`)
      .then((response) => {
        if (!response.ok) {
          setError(true);
          return [];
        }
        return response.json();
      })
      .then((data) => new Deserializer({keyForAttribute: 'camelCase'}).deserialize(data, (_error, userList) => setUsers(userList)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const addUser = (user) => setUsers((prevState) => [...prevState, user]);

  if (loading) {
    return (
      <section className='container'>
        <h2>Loading...</h2>
      </section>
    );
  }

  return (
    <section>
      <Link to='/'>Home</Link>
      {error ? (
        <h2>Error</h2>
      ) : (
        <>
          <h2>Users</h2>
          {users.map(({id, name, username}) => (
           <table>
            <tr>
              <th>Name</th>
              <th>Username</th>
            </tr>
            <div>
            </div>
          </table>
          ))}
        </>
      )
      }
    </section>
  );
};

export default UserList;