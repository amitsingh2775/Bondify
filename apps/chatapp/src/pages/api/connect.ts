import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';

// Import the WebSocket server setup

import { setupSocket } from '../../sockets';

let io: Server;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { roomId, userId } = req.body;

    try {
      // Initialize WebSocket server if not already initialized
      if (!io) {
        const server = req.socket.server; // Now the 'server' property is available
        io = new Server(server);
        setupSocket(server); // Set up socket handlers
      }

      // Emit user join room event to WebSocket server
      io.emit('joinRoom', { roomId, userId });

      res.status(200).json({ message: 'User connected to room' });
    } catch (error) {
      console.error("Error connecting to room:", error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
