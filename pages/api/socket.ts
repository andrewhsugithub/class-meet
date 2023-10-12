// https://github.com/vercel/next.js/issues/49334#issuecomment-1744135951
import { Server as NetServer, Socket as NetSocket } from "net";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer, type Socket } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { SocketIOResponse } from "@/common/types";
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

  const rooms: Record<string, string[]> = {}; // store room id and users in room

  io.on("connection", (socket: Socket) => {
    console.log("user connected to server");

    socket.on(
      "join-room",
      ({ roomId, peerId }: { roomId: string; peerId: string }) => {
        if (rooms[roomId]) {
          console.log("user", peerId, "joined the room", roomId);
          rooms[roomId].push(peerId); // TODO db
          console.log(rooms[roomId]);
          socket.join(roomId);
          socket.to(roomId).emit("user-joined", { peerId }); // broadcast to all users in room except sender
          socket.emit("get-users", {
            roomId,
            participants: rooms[roomId],
          });
        }

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
          rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
          socket.to(roomId).emit("user-left-the-room", peerId);
        };
      }
    );

    socket.on("create-room", () => {
      const roomId = uuidv4();
      rooms[roomId] = [];
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
  });

  console.log("Socket server started successfully!");
  res.end();
}
