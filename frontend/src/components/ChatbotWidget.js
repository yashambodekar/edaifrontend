import React, { useState } from "react";
import "./ChatbotWidget.css";

const ChatbotWidget = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatHistory((prev) => [...prev, { sender: "user", text: userMessage }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || data.error || "Sorry, I couldn't answer that." },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: "Network error. Please try again." },
      ]);
    }
    setChatLoading(false);
  };

  return (
    <>
      <button
        className="chatbot-fab"
        onClick={() => setShowChatbot((v) => !v)}
        aria-label="Open chatbot"
      >
        <span role="img" aria-label="Chatbot" className="chatbot-icon">💬</span>
        <span className="chatbot-label">Chatbot</span>
      </button>
      {showChatbot && (
        <div className="chatbot-card">
          <div className="chatbot-header">
            <span>Education Loan Chatbot</span>
            <button className="chatbot-close" onClick={() => setShowChatbot(false)}>&times;</button>
          </div>
          <div className="chatbot-messages">
            {chatHistory.length === 0 && (
              <div className="chatbot-message bot">Hi! Ask me anything about education loans.</div>
            )}
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-message ${msg.sender}`}
              >
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <div className="chatbot-message bot">Typing...</div>
            )}
          </div>
          <form className="chatbot-input-row" onSubmit={handleChatSubmit}>
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type your question..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={chatLoading}
            />
            <button type="submit" className="chatbot-send" disabled={chatLoading || !chatInput.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;