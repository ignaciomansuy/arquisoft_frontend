import React, { useState, useEffect } from 'react';
import './chat.css'
import { decodeToken } from "react-jwt";
import "react-chat-elements/dist/main.css";
import { MessageList, Input, Button } from "react-chat-elements";

export default function ShowChatPage() {

  const [messages, setMessages] = useState([]);

  const inputReferance = React.createRef();
  const messageListReferance = React.createRef();

  // TODO: set this in .env
  const chat_service_url = "3.223.98.40";

  // TODO: build this token from scratch using only the user Auth0 uuid (can be find in local storage as auth0Token)
  // see chat_service readme for more info on how to build this token
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJodHRwczovL2NoYXQubmFuby5uZXQiLCJpc3MiOiJodHRwczovL2FwaS5uYW5vLm5ldCIsImlhdCI6MTAwMDAwMCwiZXhwIjoyMTQ3NTg3ODM1Nywic3ViIjoiMSIsImVudGl0eVVVSUQiOiJiOWI4M2Q4OS00YmI5LTQwYmYtOWUzYS00MmQ5NzllZGE0ZGIiLCJ1c2VyVVVJRCI6ImE1MmNjNjUzLTIzNTgtNGI4Mi1iZTk0LWY2NWM4NWEyNTVhZiIsImxldmVsT25FbnRpdHkiOjEwMH0.Od_CzP8jkVT7RwcgF9RQYhkAwxQKyAVk2wjhuMi72ao";
  const myDecodedToken = decodeToken(token);
  const uuid = myDecodedToken.userUUID;
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

    await fetch(`${ws_api_url}/rooms/${room_id}/messages`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          setError(true);
          return [];
        }
        return response.json();
      }).then((data) => setInitialMessages(data.content));
  }

  const analyseMessage = async (message) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        "currentIntent": {
          "name": "ChatMessage",
          "confirmationStatus": "None"
        },
        "inputTranscript": message.text
      }
    };
    await fetch("https://k22ok5vv55.execute-api.us-east-1.amazonaws.com/index/chat/sentiment_analysis", requestOptions).then((response) => {
      if (!response.ok) {
        setError(true);
        return [];
      }
      // TODO: 
      // const sentiment = response.json()['sessionAttributes']['sentiment']
      const sentiment_message = "This message has a {insert sentiment here} sentiment."
      console.log(sentiment_message)
    }).then((data) => setInitialMessages(data.content));

  }

  let inputClear = () => { inputReferance.current.value = '' };

  const submitMessage = (msg) => {
    const text = msg.replace(/(\r\n|\n|\r)/gm, '');
    const message = { type: "message", content: text };
    ws.send(JSON.stringify(message));
    inputClear();
  }


  let sortByDate = (item, other) => {
    return item['date'] < other['date']
  }

  const formatMessageText = (message_data) => {
    const date_ = message_data.createdAt ? new Date(message_data.createdAt) : new Date();
    return {
      position: message_data.emitter == uuid ? 'right' : 'left',
      type: 'text',
      text: message_data.content,
      date: new Date(date_),
    };
  }

  const setInitialMessages = (messages_list) => {
    const messages_list_formated = messages_list.map(formatMessageText);
    setMessages(messages_list_formated);
  }

  const handleMessage = (message_data) => {
    setMessages([...messages, formatMessageText(message_data)]);
  }

  useEffect(() => {
    ws.onopen = async () => {
      await sendToken();
      await selectRoom();
      await getMessages();
    }

    ws.onmessage = (data) => {
      if (data.type == 'message') {
        const message_data = JSON.parse(data.data);
        handleMessage(message_data.data);
      }
      else {
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


  return (
    <div className='box'>
      <div className='grid'>
        <div>
          <MessageList
            referance={messageListReferance}
            className='message-list'
            lockable={true}
            toBottomHeight={'100%'}
            dataSource={messages.sort(sortByDate)}
            onClick={(message) => analyseMessage(message)} />
        </div>
        <div>
          <Input
            referance={inputReferance}
            placeholder="Type here..."
            multiline={true}
            clear={(clear) => (inputClear = clear)}
            rightButtons={[
              <Button color="white" backgroundColor="black" text="Send" onClick={() => submitMessage(inputReferance.current.value)} />,
            ]}
            onKeyPress={(e) => {
              if (e.charCode === 13) {
                submitMessage(inputReferance.current.value);
              }
            }}
          />

        </div>
      </div>
    </div>
  );
}
