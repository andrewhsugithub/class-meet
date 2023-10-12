import { MessageType } from "@/common/types";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

const Chat = () => {
  const messages: MessageType[] = [];

  return (
    <div className="flex flex-col h-full">
      <div>
        {messages.map((message) => (
          <ChatBubble key={message.timestamp} message={message} />
        ))}
      </div>
      <ChatInput />
    </div>
  );
};

export default Chat;
