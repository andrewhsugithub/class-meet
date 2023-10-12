"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

interface SocketContextType {
  socket?: Socket;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketContext must be used within a SocketContextProvider"
    );
  }
  return context;
};

// const socket = io(process.env.NEXT_PUBLIC_SITE_URL!, {
//   path: "/api/blablasocket",
// });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const connectToSocketServer = async () => {
    // console.log("connecting");
    await fetch("/api/socket");
  };

  useEffect(() => {
    connectToSocketServer();
    // const socket = io(process.env.NEXT_PUBLIC_SITE_URL!, {
    //   path: "/api/blablasocket",
    // });
    // socket.on("connect", () => {
    //   // socket.broadcast.emit("user connected", socket.id)
    //   console.log("user connected", socket.id);
    // });
    // socket.on("disconnect", () => {
    //   console.log("user disconnected", socket.id);
    // });
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};
