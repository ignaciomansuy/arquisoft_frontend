import React from 'react';
import './chat.css'
import { Box } from '@mui/material';
// RCE CSS
import "react-chat-elements/dist/main.css";
// MessageBox component
import { MessageBox, MessageList, Input, Button } from "react-chat-elements";



// // Clear text, e.g.:

// inputClear = () => { };
// // ...
// <Input clear={(clear) => (inputClear = clear)} placeholder="Type here..." />;
// // ...
// inputClear();

export default function ShowChatPage() {

  const inputReferance = React.createRef();

  const messageListReferance = React.createRef();

  const messagesList = [];
  const [messages, setMessages] = React.useState(messagesList);

  let inputClear = () => { inputReferance.current.value = '' };

  let sortByDate = (item, other) => {
    return item['date'] < other['date']
  }

  const handleSendMessage = (text) => {
    text = text.replace(/(\r\n|\n|\r)/gm, '');
    if (text === '' || text.length === 0) {
      inputClear();
      return;
    }
    const newList = messages.concat({
      position: 'right',
      type: 'text',
      text: text,
      date: new Date(),
    });
    setMessages(newList);
    inputClear();
  }

  const handleReceiveMessage = (text) => {
    text = text.replace(/(\r\n|\n|\r)/gm, '');
    if (text === '' || text.length === 0) {
      inputClear();
      return;
    }
    const newList = messages.concat({
      position: 'left',
      type: 'text',
      text: text,
      date: new Date(),
    });
    setMessages(newList);
    inputClear();
  }


  return (
    <div className='box'>
      <div className='grid'>
        <div>
          <MessageList
            referance={messageListReferance}
            className='message-list'
            lockable={true}
            toBottomHeight={'100%'}
            dataSource={messages.sort(sortByDate)} />
        </div>
        <div>
          <Input
            referance={inputReferance}
            placeholder="Type here..."
            multiline={true}
            clear={(clear) => (inputClear = clear)}
            rightButtons={[
              <Button color="white" backgroundColor="black" text="Send" onClick={() => handleSendMessage(inputReferance.current.value)} />,
              <Button color="white" backgroundColor="black" text="Receive (Debug)" onClick={() => handleReceiveMessage(inputReferance.current.value)} />
            ]}
            onKeyPress={(e) => {
              if (e.charCode === 13) {
                handleSendMessage(inputReferance.current.value);
              }
            }}
          />

        </div>
      </div>
    </div>
  );
}
