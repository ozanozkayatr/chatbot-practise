import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import ChatWindow from "./components/ChatWindow";
import InputForm from "./components/InputForm";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [answerCount, setAnswerCount] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const chatWindowRef = useRef(null);

  // Scroll to the bottom whenever new messages are added
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Start the session only once when the component mounts
  useEffect(() => {
    if (!sessionStarted) {
      startSession();
      setSessionStarted(true);
    }
  }, [sessionStarted]);

  const startSession = () => {
    const newSessionId = uuidv4();
    const newSessionStartTime = new Date().toISOString();

    // Reset session states for a new conversation
    setSessionId(newSessionId);
    setSessionStartTime(newSessionStartTime);
    setAnswerCount(0); // Reset answer count
    setMessages([]); // Clear old messages
    setSessionEnded(false);
    setSessionStarted(true);

    // Trigger the first question right after starting the session
    getNextQuestion(newSessionId, newSessionStartTime);
  };

  const getNextQuestion = async (sessionId, sessionStartTime) => {
    setIsTyping(true);

    try {
      const response = await fetch(
        "http://localhost:3001/chat/randomQuestion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            sessionStartTime,
            answerCount, // Include answer count to track the session progress
          }),
        }
      );

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "Chatbot", text: data.question },
      ]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error fetching random question:", error);
      setIsTyping(false);
    }
  };

  const submitAnswer = async (input) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: "You", text: input },
    ]);
    setLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:3001/chat/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          questionIndex: answerCount, // Use answer count to keep track of answers
          answer: input,
          sessionStartTime,
        }),
      });

      await response.json();

      // Increment the answer count and check if session should end
      setAnswerCount((prevCount) => prevCount + 1);

      if (answerCount + 1 < 10) {
        getNextQuestion(sessionId, sessionStartTime);
      } else {
        setSessionEnded(true); // End session after all answers are received
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }

    setLoading(false);
    setIsTyping(false);
  };

  return (
    <div className={`chat-container ${sessionEnded ? "session-ended" : ""}`}>
      <h1>Bolt Chat</h1>
      <div
        className={`chat-window-wrapper ${sessionEnded ? "session-ended" : ""}`}
        ref={chatWindowRef}
      >
        <ChatWindow messages={messages} isTyping={isTyping} />
      </div>
      {!sessionEnded && <InputForm onSubmit={submitAnswer} loading={loading} />}

      {sessionEnded && (
        <div className="closing-message">
          <p>
            Thank you for your contribution! Your answers will be evaluated
            quickly.
          </p>
          <p>To start a new session, please feel free to continue.</p>
          <button className="start-session-button" onClick={startSession}>
            Start New Session
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
