"use client";

import { useRoomContext } from "@/context/RoomProvider";

interface NameProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Name = ({}: NameProps) => {
  const { username, setUsername, peer } = useRoomContext();
  return (
    <input
      placeholder="Enter your name"
      onChange={(e) => {
        setUsername(e.target.value);
        console.log(peer);
      }}
      value={username}
    />
  );
};

export default Name;
