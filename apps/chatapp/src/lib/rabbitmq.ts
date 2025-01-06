import amqplib, { Connection, Channel } from 'amqplib';

export const connectRabbitMQ = async (): Promise<Channel> => {
  try {
    const connection: Connection = await amqplib.connect(
      process.env.RABBITMQ_URL || 'amqps://fkhudsog:5YkKllS1RAMJltr8k18nbXOqLkXP1WFb@rabbit.lmq.cloudamqp.com/fkhudsog'
    );
    const channel: Channel = await connection.createChannel();
    console.log('RabbitMQ connected!');
    return channel;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
};

export const sendMessageToRoom = async (channel: Channel, roomId: string, message: string) => {
  try {
    const exchange = 'chat-room-exchange';
    await channel.assertExchange(exchange, 'direct', { durable: true });
    channel.publish(exchange, roomId, Buffer.from(message));
    console.log(`Message sent to room ${roomId}:`, message);
  } catch (error) {
    console.error('Error sending message to RabbitMQ:', error);
    throw error;
  }
};
