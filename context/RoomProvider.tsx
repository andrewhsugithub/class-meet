"use client";

import {
  addPeerStream,
  removePeer,
  peerReducer,
  addPeerNameAction,
  PeerState,
} from "@/hooks/usePeer";
import { useRouter } from "next/navigation";
import Peer, { MediaConnection } from "peerjs";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { io, type Socket } from "socket.io-client";
import { useSocketContext } from "./SocketProvider";
import { MessageType } from "@/common/types";
import {
  ChatState,
  addHistoryAction,
  addMessageAction,
  chatReducer,
  toggleChatAction,
} from "@/hooks/chatReduces";

interface RoomContextType {
  socket: Socket;
  peer: Peer | undefined;
  stream: MediaStream | undefined;
  peers: PeerState;
  shareScreen: () => void;
  screenSharingId: string;
  setRoomId: Dispatch<SetStateAction<string>>;
  sendMessage: (message: string) => void;
  chat: ChatState;
  toggleChat: (isChatOpen: boolean) => void;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
}

const RoomContext = createContext<RoomContextType | null>(null);

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomContextProvider");
  }
  return context;
};

const socket = io(process.env.NEXT_PUBLIC_SITE_URL!, {
  path: "/api/blablasocket",
});

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [peer, setPeer] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peerReducer, {});
  const [chat, chatDispatch] = useReducer(chatReducer, {
    messages: [],
    isChatOpen: false,
  });
  const [username, setUsername] = useState(
    typeof window !== "undefined"
      ? window.localStorage.getItem("username") || ""
      : ""
  );
  const [screenSharingId, setScreenSharingId] = useState("");
  const [roomId, setRoomId] = useState("");

  const createPeer = async () => {
    // https://github.com/peers/peerjs/issues/819#issuecomment-1110823223
    //! don't know why i can't put peerjs id in local storage it will be stored correctly at first but after the component re-render the id will be changed to null and the correct id will be stored in the lastServerId
    //! so i will just give metadata to identify the person
    const peer = new (await import("peerjs")).default(uuidv4(), {
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });
    setPeer(peer);
    console.log("peer created", peer);
  };

  const shareScreen = () => {
    stream?.getTracks().forEach((track) => track.stop());
    if (screenSharingId) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          switchStream(stream);
          console.log("get user screen");
        });
    } else {
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then((stream) => {
          console.log("get display media");
          switchStream(stream);
        })
        .catch((e: any) => console.log(e));
    }
  };

  const sendMessage = (message: string) => {
    const messageData: MessageType = {
      content: message,
      timestamp: new Date().getTime(),
      author: peer?.id!,
    };

    chatDispatch(addMessageAction(messageData));
    socket.emit("send-message", { roomId, message: messageData });
  };

  const toggleChat = (isChatOpen: boolean) => {
    chatDispatch(toggleChatAction(!isChatOpen));
  };

  useEffect(() => {
    if (typeof window !== "undefined")
      window.localStorage.setItem("username", username);
  }, [username]);

  const switchStream = (stream: MediaStream) => {
    console.log("clicked");
    setStream(stream);
    if (screenSharingId) setScreenSharingId("");
    else setScreenSharingId(peer?.id!);
    console.log("screen sharing id:", peer?.id, screenSharingId);

    //! tell other peers to change their mediastream
    Object.values(peer?.connections ?? {}).forEach((connection: any) => {
      // your stream
      const videoTrack = stream
        ?.getTracks()
        .find((track) => track.kind === "video");
      connection[0].peerConnection
        ?.getSenders()[1]
        .replaceTrack(videoTrack)
        .catch((e: any) => console.log(e));
    });
  };

  useEffect(() => {
    if (screenSharingId)
      socket.emit("start-sharing", { peerId: screenSharingId, roomId });
    else socket.emit("stop-sharing", { roomId });
  }, [screenSharingId, roomId]);

  useEffect(() => {
    createPeer();

    try {
      // TODO: need to move to client, so this runs only when user clicks on "join room" or sth not immediately when page loads
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (e: any) {
      throw new Error(e);
    }

    const createRoom = (roomId: string) => {
      console.log("room created", roomId);
      router.push(`/${roomId}`);
    };
    socket.on("room-created", createRoom); // listen for room-created event from socket server

    const getUsers = ({
      roomId,
      participants,
    }: {
      roomId: string;
      participants: string[];
    }) => {
      console.log("hello", { participants });
    };
    socket.on("get-users", getUsers); // listen for get-users event from socket server

    const removeUser = (peerId: string) => dispatch(removePeer(peerId));
    socket.on("user-left-the-room", removeUser);

    socket.on("user-started-sharing", (peerId) => {
      setScreenSharingId(peerId);
    });
    socket.on("user-stopped-sharing", () => {
      console.log("stopped sharing");
      setScreenSharingId("");
    });

    const addMessage = (message: MessageType) => {
      console.log("new message: ", message);
      chatDispatch(addMessageAction(message));
    };
    socket.on("add-message", addMessage);

    socket.on("get-messages", (messages: MessageType[]) => {
      console.log("messages:", messages);
      chatDispatch(addHistoryAction(messages));
    });

    return () => {
      socket.off("add-message");
      socket.off("room-created");
      socket.off("get-users");
      socket.off("user-left-the-room");
      socket.off("user-started-sharing");
      socket.off("user-stopped-sharing");
    };
  }, []);

  useEffect(() => {
    if (!peer) return;
    if (!stream) return;
    console.log("peer:", peer, "stream:", stream, "peer id", peer.id);

    socket.on("user-joined", ({ peerId, username: name }) => {
      dispatch(addPeerNameAction(peerId, name));
      console.log("username: ", username, "peer name: ", name);
      const call = peer.call(peerId, stream, {
        metadata: username,
      });
      console.log("calling", peerId, call, username);
      call.on("stream", (peerStream) =>
        dispatch(addPeerStream(peerId, peerStream))
      );
    });

    peer.on("call", (call: MediaConnection) => {
      const peerName = call.metadata;
      console.log("username", peerName);
      dispatch(addPeerNameAction(call.peer, peerName));
      call.answer(stream);
      console.log("answered");
      call.on("stream", (peerStream: MediaStream) =>
        dispatch(addPeerStream(call.peer, peerStream))
      );
    });

    return () => {
      socket.off("user-joined");
      peer.off("call");
    };
  }, [peer, stream, username]);

  console.log("peers:", { peers });

  return (
    <RoomContext.Provider
      value={{
        socket,
        peer,
        stream,
        peers,
        shareScreen,
        screenSharingId,
        setRoomId,
        sendMessage,
        chat,
        toggleChat,
        username,
        setUsername,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
