// https://github.com/vercel/next.js/issues/49334#issuecomment-1744135951
import { Server as NetServer, Socket as NetSocket } from "net";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer, type Socket } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { MessageType, SocketIOResponse } from "@/common/types";
import { v4 as uuidv4 } from "uuid";

export default function socketHandler(
  req: NextApiRequest,
  res: SocketIOResponse
) {
  if (res.socket.server.io) {
    console.log("Server already started!");
    res.end();
    return;
  }

  const httpServer: HttpServer = res.socket.server;
  const io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    path: "/api/blablasocket", // need to match client
  });
  res.socket.server.io = io;

  interface User {
    peerId: string;
    username: string;
  }

  const rooms: Record<string, Record<string, User>> = {}; // store room id and users in room
  const chat: Record<string, MessageType[]> = {}; // store room id and messages in room

  io.on("connection", (socket: Socket) => {
    console.log("user connected to server");

    socket.on(
      "join-room",
      ({
        roomId,
        peerId,
        username,
      }: {
        roomId: string;
        peerId: string;
        username: string;
      }) => {
        if (!rooms[roomId]) rooms[roomId] = {};
        if (!chat[roomId]) chat[roomId] = [];
        console.log("user", peerId, "joined the room", roomId, username);
        rooms[roomId][peerId] = { peerId, username }; // TODO db
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", { peerId, username }); // broadcast to all users in room except sender
        socket.emit("get-users", {
          roomId,
          participants: rooms[roomId],
        });
        socket.emit("get-messages", chat[roomId]);

        socket.on("disconnect", () => {
          console.log("user", peerId, "left the room", roomId);
          leaveRoom({ roomId, peerId });
        });
        const leaveRoom = ({
          roomId,
          peerId,
        }: {
          roomId: string;
          peerId: string;
        }) => {
          // rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
          socket.to(roomId).emit("user-left-the-room", peerId);
        };
      }
    );

    socket.on("create-room", () => {
      const roomId = uuidv4(); //! use db to load messages before
      rooms[roomId] = {};
      socket.emit("room-created", roomId);
      socket.join(roomId);
      console.log("user created room", roomId);
    });

    const startSharing = ({
      peerId,
      roomId,
    }: {
      peerId: string;
      roomId: string;
    }) => {
      socket.to(roomId).emit("user-started-sharing", peerId);
    };

    const stopSharing = ({ roomId }: { roomId: string }) => {
      socket.to(roomId).emit("user-stopped-sharing");
    };
    socket.on("start-sharing", startSharing);
    socket.on("stop-sharing", stopSharing);

    socket.on(
      "send-message",
      ({ roomId, message }: { roomId: string; message: MessageType }) => {
        console.log("message received", message);
        if (chat[roomId]) chat[roomId].push(message);
        else chat[roomId] = [message];
        socket.to(roomId).emit("add-message", message);
      }
    );
  });

  console.log("Socket server started successfully!");
  res.end();
}
