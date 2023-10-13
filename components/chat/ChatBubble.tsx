import { MessageType } from "@/common/types";
import { useRoomContext } from "@/context/RoomProvider";

interface ChatBubbleProps {
  message: MessageType;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const { peer, peers } = useRoomContext();
  const author = message.author && peers[message.author]?.username;
  const isSelf = message.author === peer?.id;
  const time = new Date(message.timestamp).toLocaleTimeString();

  return (
    <div>
      <div>
        {message.content}
        {time}
      </div>
      <div>{isSelf ? "You" : author}</div>
    </div>
  );
};

export default ChatBubble;
