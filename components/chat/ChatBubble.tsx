import { MessageType } from "@/common/types";

interface ChatBubbleProps {
  message: MessageType;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  return <div>{message.content}</div>;
};

export default ChatBubble;
