import Redis from 'ioredis';

const redis = new Redis("rediss://default:AWpYAAIjcDFiNTIzM2ExZjQ2MzM0ZGNjOGJiYTZkNTFmYWMzNmRhNnAxMA@proven-chamois-27224.upstash.io:6379");

// Function to create match (find matching users in queue)
export const createMatch = async (userId: string, preferences: string): Promise<{ roomId: string } | null> => {
  const queueKey = `matchmakingQueue:${preferences}`; // Use preference-specific queues
  const user = { userId, preferences };

  // Attempt to find a match in the queue
  const matchingUser = await redis.lpop(queueKey);

  if (matchingUser) {
    // Parse the matched user's data
    const match = JSON.parse(matchingUser);

    // Generate a unique chat room ID (e.g., using timestamp or UUID)
    const roomId = `room_${Date.now()}`;

    // Store chat room data in Redis
    await redis.hset(roomId, 'users', JSON.stringify([userId, match.userId]));

    console.log(`Match found: Room ID ${roomId}, Users: [${userId}, ${match.userId}]`);
    return { roomId };
  }

  // No match found, add user to the queue
  await redis.rpush(queueKey, JSON.stringify(user));

  // Wait for a match to be found
  console.log(`No match found yet. User ${userId} is waiting in the queue for preference: ${preferences}`);
  return await waitForMatch(userId, preferences, queueKey);
};

// Helper function to wait for a match
const waitForMatch = (userId: string, preferences: string, queueKey: string): Promise<{ roomId: string } | null> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.log(`No match found for user ${userId} within the timeout period.`);
      resolve(null);
    }, 30000); // 30-second timeout for finding a match

    const interval = setInterval(async () => {
      const matchingUser = await redis.lpop(queueKey);
      if (matchingUser) {
        const match = JSON.parse(matchingUser);
        const roomId = `room_${Date.now()}`;
        await redis.hset(roomId, 'users', JSON.stringify([userId, match.userId]));

        console.log(`Match found: Room ID ${roomId}, Users: [${userId}, ${match.userId}]`);
        clearInterval(interval);
        clearTimeout(timeout);
        resolve({ roomId });
      }
    }, 1000); // Poll every 1 second
  });
};

export default redis;
