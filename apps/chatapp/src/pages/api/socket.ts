import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Socket } from "net";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: {
      io?: SocketIOServer;
    };
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log("Socket.IO server initializing...");

    const io = new SocketIOServer(res.socket.server, {
      cors: {
        origin: "*", // Adjust for production with proper origin
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on("joinRoom", (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
        io.to(roomId).emit("receiveMessage", `User ${socket.id} joined the room.`);
      });

      socket.on(
        "sendMessage",
        ({ roomId, message }: { roomId: string; message: string }) => {
          console.log(`Message from ${socket.id} in room ${roomId}: ${message}`);
          io.to(roomId).emit("receiveMessage", message);
        }
      );

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  } else {
    console.log("Socket.IO server already running.");
  }

  res.end();
}
