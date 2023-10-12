"use client";

import ChatButton from "@/components/ChatButton";
import ShareScreen from "@/components/ShareScreen";
import VideoPlayer from "@/components/VideoPlayer";
import Chat from "@/components/chat/Chat";
import { useRoomContext } from "@/context/RoomProvider";
import { PeerState } from "@/hooks/usePeer";
import { useEffect } from "react";

const Page = ({ params }: { params: { roomId: string } }) => {
  const roomId = params.roomId;
  const {
    socket,
    peer,
    stream,
    peers,
    shareScreen,
    setRoomId,
    screenSharingId,
  } = useRoomContext();

  useEffect(() => {
    setRoomId(roomId);
  }, [roomId, setRoomId]);

  useEffect(() => {
    if (peer) {
      console.log("emit join room event");
      socket.emit("join-room", { roomId, peerId: peer?.id });
    }
  }, [roomId, socket, peer]);

  const screenSharingVid =
    screenSharingId === peer?.id ? stream : peers[screenSharingId]?.stream;

  const { [screenSharingId]: _, ...otherPeers } = peers;
  console.log("shared screen: ", screenSharingId, "me:", peer?.id);

  return (
    <>
      <pre className="text-white text-5xl text-center">
        Class {roomId.slice(0, 8)}
      </pre>
      <div className="flex">
        {screenSharingId && (
          <div className="w-4/5 pr-4">
            <VideoPlayer stream={screenSharingVid} />
          </div>
        )}
        <div
          className={`grid gap-4 ${
            screenSharingVid ? "w-1/5 grid-col-1" : "grid-cols-4"
          }`}
        >
          {stream && screenSharingId !== peer?.id && (
            <VideoPlayer stream={stream} />
          )}
          {Object.values(otherPeers as PeerState).map((peer) => {
            return (
              <div key={peer.stream.id}>
                {peer.stream && <VideoPlayer stream={peer.stream} />}
              </div>
            );
          })}
        </div>
        <div className="border-l-2">
          <Chat />
        </div>
      </div>
      <div>
        <ChatButton />
        <ShareScreen handleShare={shareScreen} />
      </div>
    </>
  );
};

export default Page;
