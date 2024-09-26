import React from "react";
import "./MessageCard.css";

function MessageCard({ user, text }) {
  return (
    <div
      className={`message-card ${
        user === "You" ? "user-message" : "bot-message"
      }`}
    >
      {text}
    </div>
  );
}

export default MessageCard;
