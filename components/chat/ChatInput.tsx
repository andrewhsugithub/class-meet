import { useState } from "react";

const ChatInput = () => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <form action="">
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
