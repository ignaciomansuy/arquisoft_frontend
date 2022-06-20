import React, { useState, useEffect } from 'react';
import { Deserializer } from 'jsonapi-serializer';
import config from '../../config';

const ChatMenu = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('Tarzan');
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(new WebSocket("ws://3.223.98.40"));

  const submitMessage = (usr, msg) => {
    const message = { user: usr, message: msg };
    ws.send(JSON.stringify(message));
    setMessages([message, ...messages]);
  }

  useEffect(() => {
    ws.onopen = () => {
      console.log('WebSocket Connected');
    }

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log(e);
      setMessages([message, ...messages]);
    }

    return () => {
      ws.onclose = () => {
        console.log('WebSocket Disconnected');
        // setWs(new WebSocket(URL));
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

  return (
    <section>
      Connect to a chat room
    </section>
  );
};

export default ChatMenu;