"use client";

import { Button } from "./ui/button";
import { useRoomContext } from "@/context/RoomProvider";

const NewMeetingBtn = () => {
  const { socket } = useRoomContext();

  const createRoom = () => {
    console.log("creating room", socket);
    socket.emit("create-room", socket.id);
  };

  return (
    // <Link href={`/${roomId}`}>
    <Button onClick={createRoom}>New Meeting</Button>
    // </Link>
  );
};

export default NewMeetingBtn;
