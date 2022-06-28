import React, { useState, useEffect, createRef } from "react";
import "./chat.css";
import { decodeToken, useJwt } from "react-jwt";
import "react-chat-elements/dist/main.css";
import { MessageList, Input, Button } from "react-chat-elements";
import Modal from "react-modal";
import { hashString, hashArray } from "react-hash-string";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import sign from "jwt-encode";

import useAuth from "../../hooks/useAuth";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const chat_service_url = "3.223.98.40";
// const chat_service_url = "localhost:7777";

const ws_url = `wss://${chat_service_url}/chat`;
export const ws_api_url = `http://${chat_service_url}`;

export default function ShowChatPage() {
  const [messages, setMessages] = useState([]);

  const inputReferance = createRef();
  const messageListReferance = createRef();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedSentimentMessage, setSelectedSentimentMessage] = useState();
  const [roomId, setRoomId] = useState();
  const [chatToken, setChatToken] = useState();
  const [uuid, setUUID] = useState();

  // TODO: set this in .env
  const { id } = useParams();
  const { user, getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const domain = "arqui-soft-grupo09.us.auth0.com";
  const { currentUser } = useAuth();
  const [ws, setWs] = useState(new WebSocket(ws_url));

  const sendToken = async () => {
    console.log(chatToken);
    const message = {
      type: "token",
      content: chatToken,
    };
    ws.send(JSON.stringify(message));
  };

  const selectRoom = async () => {
    console.log(roomId);
    const message = {
      type: "select_room",
      room_id: roomId,
    };
    ws.send(JSON.stringify(message));
  };

  const getMessages = async () => {
    var requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatToken}`,
      },
    };

    await fetch(`${ws_api_url}/rooms/${roomId}/messages`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          setError(true);
          return [];
        }
        return response.json();
      })
      .then((data) => setInitialMessages(data.content));
  };

  const analyseMessage = async (message) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        currentIntent: {
          name: "ChatMessage",
          confirmationStatus: "None",
        },
        inputTranscript: message.text,
      },
    };
    await fetch(
      "https://k22ok5vv55.execute-api.us-east-1.amazonaws.com/index/chat/sentiment_analysis",
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          setError(true);
          return [];
        }
        // TODO:
        console.log(response);
        const sentiment = response.json().sessionAttributes.sentiment
        const sentiment_message =
        `This message has a ${sentiment} sentiment.`;
        openModal(sentiment_message)
      })
  };

  function openModal(sentiment) {
    setSelectedSentimentMessage(sentiment);
    setIsOpen(true);
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
  }

  let inputClear = () => {
    inputReferance.current.value = "";
  };

  const submitMessage = (msg) => {
    const text = msg.replace(/(\r\n|\n|\r)/gm, "");
    const message = { type: "message", content: text };
    ws.send(JSON.stringify(message));
    inputClear();
  };

  let sortByDate = (item, other) => {
    return item["date"] < other["date"];
  };

  const formatMessageText = (message_data) => {
    const date_ = message_data.createdAt
      ? new Date(message_data.createdAt)
      : new Date();
    return {
      position: message_data.emitter == uuid ? "right" : "left",
      type: "text",
      text: message_data.content,
      date: new Date(date_),
    };
  };

  const setInitialMessages = (messages_list) => {
    const messages_list_formated = messages_list.map(formatMessageText);
    setMessages(messages_list_formated);
  };

  const handleMessage = (message_data) => {
    setMessages([...messages, formatMessageText(message_data)]);
  };
  useEffect(() => {
    // build room id
    const sender_id = currentUser.data.id;
    const receiver_id = id;
    setRoomId(
      Math.abs(
        hashArray(
          [
            hashString(String(sender_id) + "-" + String(receiver_id)),
            hashString(String(receiver_id) + "-" + String(sender_id)),
          ].sort()
        )
      )
    );

    setUUID(currentUser.data.attributes.uuid);

    // build token
    const secret = "NOTASECRETANYMORE";
    const data = {
      aud: "https://chat.nano.net",
      iss: "https://api.nano.net",
      iat: 1000000,
      exp: 21475878357,
      entityUUID: currentUser.data.attributes.uuid, // For this project, this will be equal to userUUID
      userUUID: currentUser.data.attributes.uuid,
      levelOnEntity: 100,
    };
    setChatToken(sign(data, secret));
  }, []);
  useEffect(() => {
    ws.onopen = async () => {
      await sendToken();
      await selectRoom();
      await getMessages();
    };

    ws.onmessage = (data) => {
      if (data.type == "message") {
        const message_data = JSON.parse(data.data);
        handleMessage(message_data.data);
      } else {
        console.log(e);
      }
    };

    return () => {
      ws.onclose = () => {
        console.log("WebSocket Disconnected");
        setWs(new WebSocket(ws_url));
      };
    };
  }, [ws.onmessage, ws.onopen, ws.onclose, messages]);

  return (
    <div className="box">
      <h1>Chat con usuario {id}</h1>
      <div className="grid">
        <div>
          <MessageList
            referance={messageListReferance}
            className="message-list"
            lockable={true}
            toBottomHeight={"100%"}
            dataSource={messages.sort(sortByDate)}
            onClick={(message) => analyseMessage(message)}
          />
        </div>
        <div>
          <Input
            referance={inputReferance}
            placeholder="Type here..."
            multiline={true}
            clear={(clear) => (inputClear = clear)}
            rightButtons={[
              <Button
                color="white"
                backgroundColor="black"
                text="Send"
                onClick={() => submitMessage(inputReferance.current.value)}
              />,
            ]}
            onKeyPress={(e) => {
              if (e.charCode === 13) {
                submitMessage(inputReferance.current.value);
              }
            }}
          />
        </div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
          style={customStyles}
        >
          {selectedSentimentMessage && <h1>{selectedSentimentMessage}</h1>}
        </Modal>
      </div>
    </div>
  );
}
