import React, { useState, useRef, useEffect } from "react";
import "./InputForm.css";

function InputForm({ onSubmit, loading }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;

    onSubmit(input);
    setInput("");

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={loading ? "Loading..." : "Type your message..."}
        disabled={loading}
        ref={inputRef}
        autoFocus
      />
      <button type="submit" disabled={loading}>
        {loading ? "..." : "Send"}
      </button>
    </form>
  );
}

export default InputForm;
