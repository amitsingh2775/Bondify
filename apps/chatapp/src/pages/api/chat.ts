import { NextApiRequest, NextApiResponse } from 'next';
import { connectRabbitMQ, sendMessageToRoom } from '../../lib/rabbitmq'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message, roomId } = req.body;

    try {
      const channel = await connectRabbitMQ(); // Get the channel here
      await sendMessageToRoom(channel, roomId, message);
      res.status(200).json({ message: 'Message sent' });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}