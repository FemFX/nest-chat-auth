"use client";
import { FC, useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const Chat: FC<any> = ({ chat, receiverId }) => {
  const [messages, setMessages] = useState(chat.messages);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    socket.emit(
      "getMessages",

      (messages: any) => {
        console.log(messages);

        setMessages(messages);
      }
    );
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("msg_to_client", (data) => {
      // setMessages(messages.concat(data.newMessage));
      console.log(data);

      setMessages([...messages, data.message]);
    });

    return () => {
      socket.off("msg_to_client");
    };
  }, [messages, socket]);
  return (
    <div className="h-screen flex justify-center items-center flex-col w-full">
      <div className="overflow-y-auto border px-16 py-5 flex flex-col max-h-[500px] min-h-[300px]">
        {messages.map((m: any) => (
          <div key={m.id}>
            {m.user.username}:{m.text}
          </div>
        ))}
      </div>
      <input
        className="border"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={() =>
          socket.emit("msg_to_server", {
            text: message,
            receiverId,
          })
        }
      >
        send
      </button>
    </div>
  );
};

export default Chat;
