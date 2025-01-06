import { Channel } from 'amqplib';

const userQueues: Record<string, string[]> = {}; // Map preferences to user queues
const roomAssignments: Record<string, string> = {}; // Map users to room IDs

export const createOrJoinRoom = async (
  userId: string,
  preferences: string,
  channel: Channel
): Promise<string | null> => {
  if (!userQueues[preferences]) {
    userQueues[preferences] = [];
  }

  userQueues[preferences].push(userId);

  // If enough users for a room (e.g., 3 users per room)
  if (userQueues[preferences].length >= 3) {
    const roomId = `room-${Date.now()}`;
    const matchedUsers = userQueues[preferences].splice(0, 3); // Remove users from queue

    matchedUsers.forEach((user) => {
      roomAssignments[user] = roomId;
      channel.emit('joinRoom', { userId: user, roomId }); // Notify users to join
    });

    console.log(`Room ${roomId} created for users:`, matchedUsers);
    return roomId;
  }

  console.log(`User ${userId} added to queue for preference ${preferences}`);
  return null; // Not enough users yet
};
