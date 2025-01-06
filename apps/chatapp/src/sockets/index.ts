// src/sockets.ts
import { Server } from 'socket.io';

let io: Server | undefined; // Keep a reference for reuse if needed

export function setupSocket(server: any): Server {
  if (!io) {
    // Initialize the Socket.IO server
    io = new Server(server, {
      cors: {
        origin: '*', // Replace '*' with specific domains for better security
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Handle joining a room
      socket.on('joinRoom', (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
        io?.to(roomId).emit('receiveMessage', `User ${socket.id} has joined the room.`);
      });

      // Handle sending messages
      socket.on('sendMessage', ({ roomId, message }: { roomId: string; message: string }) => {
        console.log(`Message from ${socket.id} in room ${roomId}: ${message}`);
        io?.to(roomId).emit('receiveMessage', message);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }

  return io;
}
