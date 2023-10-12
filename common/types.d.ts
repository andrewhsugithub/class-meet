import { Server as NetServer, Socket as NetSocket } from "net";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer, type Socket } from "socket.io";

export type SocketIOResponse = NextApiResponse & {
  socket: NetSocket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

type MessageType = {
  content: string;
  author: string;
  timestamp: string;
};
