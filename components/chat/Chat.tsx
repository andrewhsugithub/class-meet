import { MessageType } from "@/common/types";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { useRoomContext } from "@/context/RoomProvider";

const Chat = () => {
  const { chat } = useRoomContext();

  return (
    <div className="flex flex-col h-full">
      <div>
        {chat.messages?.map((message) => (
          <ChatBubble message={message} />
        ))}
      </div>
      <ChatInput />
    </div>
  );
};

export default Chat;
