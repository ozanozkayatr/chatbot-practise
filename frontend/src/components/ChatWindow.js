import React, { useEffect, useRef } from "react";
import MessageCard from "./MessageCard";
import "./ChatWindow.css";

function ChatWindow({ messages, isTyping }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return (
    <div className="chat-window">
      {messages.map((msg, index) => (
        <MessageCard key={index} user={msg.user} text={msg.text} />
      ))}
      {isTyping && <div className="typing-indicator">Chatbot is typing...</div>}
      <div ref={chatEndRef} />
    </div>
  );
}

export default ChatWindow;
