// apps/chat-app/pages/chat/[roomId].tsx
import { useRouter } from 'next/router';
import React from 'react';
import ChatBox from '../../components/ChatBox'; // Adjusted the import path to match your structure

const ChatRoom = () => {
  const router = useRouter();
  const { roomId } = router.query; // Grabbing the roomId from the URL

  if (!roomId) return <div>Loading...</div>; // Handle loading state when roomId is not available yet

  return (
    <div>
      <h1>Chat Room {roomId}</h1> {/* Display the roomId */}
      <ChatBox roomId={roomId as string} /> {/* Pass the roomId to the ChatBox component */}
    </div>
  );
};

export default ChatRoom;
