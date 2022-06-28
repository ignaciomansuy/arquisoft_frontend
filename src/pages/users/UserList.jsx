import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Deserializer } from 'jsonapi-serializer';
import config from '../../config';
import useAuth from '../../hooks/useAuth';
import { DataGrid } from '@mui/x-data-grid'; 
import Button from '@mui/material/Button';
import { useNavigate, Navigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const navigate = useNavigate();

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

  const addUser = (user) => setUsers((prevState) => [...prevState, user]);

  if (loading) {
    return (
      <section className='container'>
        <h2>Loading...</h2>
      </section>
    );
  }
  
  let columns = [{
    field: 'firstname',
    headerName: 'Nombre',
    width: 250,
    editable: false,
  },
  {
    field: 'lastname',
    headerName: 'Apellido',
    width: 250,
    editable: false,
  },
  {
      field: 'username',
      headerName: 'Nombre de Usuario',
      width: 300,
      editable: false,

  }]
  return (
    <section>
      <center>
        <div style={{ height: 400, width: '70%' }}>
          <DataGrid
            rows={users}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            />
        </div>
      </center>
      
    </section>
  );
};

export default UserList;