import React, { useState, useEffect } from 'react';
import { Deserializer } from 'jsonapi-serializer';
import config from '../../config';

const ChatMenu = () => {
  const chat_service_url = "3.223.98.40"; // TODO: set this in .env
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('Tarzan');
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  // setLoading(true);

  // TODO: build this token from scratch using only the user Auth0 uuid (can be find in local storage as auth0Token)
  // see chat_service readme for more info on how to build this token
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJodHRwczovL2NoYXQubmFuby5uZXQiLCJpc3MiOiJodHRwczovL2FwaS5uYW5vLm5ldCIsImlhdCI6MTAwMDAwMCwiZXhwIjoyMTQ3NTg3ODM1Nywic3ViIjoiMSIsImVudGl0eVVVSUQiOiJiOWI4M2Q4OS00YmI5LTQwYmYtOWUzYS00MmQ5NzllZGE0ZGIiLCJ1c2VyVVVJRCI6ImE1MmNjNjUzLTIzNTgtNGI4Mi1iZTk0LWY2NWM4NWEyNTVhZiIsImxldmVsT25FbnRpdHkiOjEwMH0.Od_CzP8jkVT7RwcgF9RQYhkAwxQKyAVk2wjhuMi72ao";
  const ws_url = `ws://${chat_service_url}/chat`; 
  const ws_api_url = `http://${chat_service_url}`;
  // TODO: get the room id from ... (not sure how to handle this yet)
  const room_id = 1;
  const [ws, setWs] = useState(new WebSocket(ws_url));

  const sendToken = async () => {
    const message = { 
      type: "token",
      content: token
    };
    ws.send(JSON.stringify(message));
  }

  const openMessages = (content) => {
    content.forEach(data => setMessages((prevState) => [...prevState, data]));
  }
  
  const selectRoom = async () => {
    const message = { 
      type: "select_room",
      room_id: room_id
    };
    ws.send(JSON.stringify(message));
  }

  const getMessages = async () => {
    var requestOptions = {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    };
    
    fetch(`${ws_api_url}/rooms/${room_id}/messages`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        setError(true);
        return [];
      }
      return response.json();
    })
    .then((data) => openMessages(data.content))
  }
  

  const submitMessage = (type, msg) => {
    const message = { type: type, message: msg };
    ws.send(JSON.stringify(message));
    setMessages([message, ...messages]);
  }

  useEffect(() => {
    ws.onopen = async () => {
      console.log('WebSocket Connected');
      await sendToken();
      await selectRoom();
      await getMessages();
    }

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      if (message.type == 'message') {
        setMessages([data.data, ...messages]);
      }
      else{
        console.log(e);
      }
    }

    return () => {
      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        setWs(new WebSocket(ws_url));
      }
    }
  }, [ws.onmessage, ws.onopen, ws.onclose, messages]);

  if (loading) {
    return (
      <section className='container'>
        <h2>Loading...</h2>
      </section>
    );
  }

  if (error != '') {
    return (
      <section className='container'>
        {error}
      </section>
    )
  }

  return (
    <section>
      <ul>
        {messages.reverse().map((message, index) =>
          <li key={index}>
            {message.content}
          </li>
        )}
      </ul>
      <form
        action=""
        onSubmit={e => {
          e.preventDefault();
          submitMessage(user, message);
          setMessage([]);
        }}
      >
        <input
          type="text"
          placeholder={'Type a message ...'}
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <input type="submit" value={'Send'} />
      </form>
    </section>
  );
};

export default ChatMenu;