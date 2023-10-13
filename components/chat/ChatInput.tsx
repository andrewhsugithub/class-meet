import { useRoomContext } from "@/context/RoomProvider";
import { useState } from "react";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useRoomContext();

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message);
          setMessage("");
        }}
      >
        <textarea
          className="border rounded"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          value={message}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatInput;
