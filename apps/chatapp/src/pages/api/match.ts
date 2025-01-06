import { NextApiRequest, NextApiResponse } from "next";
import { createMatch } from "../../lib/redis"; // Ensure this is implemented
import { connectRabbitMQ } from "../../lib/rabbitmq";
import { createOrJoinRoom } from "../../lib/matchmaking";

const matchHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end("Method Not Allowed");
  }

  const { userId, preferences } = req.body;

  if (!userId || !preferences) {
    return res.status(400).json({ message: "Both userId and preferences are required" });
  }

  try {
    // await connectMongoDB(); (if you need this, uncomment it)
    const match = await createMatch(userId, preferences);
    const channel = await connectRabbitMQ();
    const roomId = await createOrJoinRoom(userId, preferences, channel);

    if (match) {
      return res.status(200).json({ message: "Match found", roomId });
    }

    return res.status(200).json({ message: "Added to queue" });
  } catch (error) {
    console.error("Error in matchmaking:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default matchHandler;
