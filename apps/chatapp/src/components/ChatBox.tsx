import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const ChatBox = ({ roomId }: { roomId: string }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize socket inside useEffect
    const socketInstance = io();

    // Emit joinRoom event with roomId
    socketInstance.emit('joinRoom', { roomId });

    // Listen for incoming messages
    socketInstance.on('receiveMessage', (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Set the socket to state
    setSocket(socketInstance);

    // Cleanup function to disconnect socket when component unmounts or roomId changes
    return () => {
      socketInstance.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit('sendMessage', { roomId, message });
      setMessages((prev) => [...prev, message]);
      setMessage('');
    }
  };

  return (
    <div>
      <div style={{ border: '1px solid gray', height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
