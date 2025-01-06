// types/next.d.ts
import { IncomingMessage } from 'http';

declare module 'next' {
  interface NextApiRequest extends IncomingMessage {
    socket: {
      server: any; // Define 'server' property on 'socket'
    };
  }
}
