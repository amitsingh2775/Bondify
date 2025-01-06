import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import io, { Socket } from "socket.io-client";
import MatchForm from "./MatchForm";

let socket: Socket | null = null;

const MatchFinder: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:3000"); // Correct Socket.IO connection URL
    }

    socket.on("connect", () => {
      setUserId(socket.id); // Directly set user ID when connected
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setUserId(null);
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  const handleMatchMaking = async (preferences: string) => {
    setLoading(true);

    if (!userId) {
      console.error("User ID is not available");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, preferences }),
      });

      const data = await response.json();
      if (data.roomId) {
        setMatch(true);
        router.push(`/chat/${data.roomId}`);
      } else {
        setMatch(false);
      }
    } catch (error) {
      console.error("Error matchmaking:", error);
      setMatch(false);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Matchmaking</h1>
      {!match && !loading && <MatchForm onMatchMaking={handleMatchMaking} />}
      {loading && <p>Finding a match...</p>}
      {match === false && !loading && <p>No match found. Try again later.</p>}
    </div>
  );
};

export default MatchFinder;
