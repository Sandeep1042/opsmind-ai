import React, { useState, useRef, useEffect } from "react";
import { Send, Loader, Brain, FileText } from "lucide-react";
import api, { getChatHistory, saveMessage, clearChat } from "../api/apiClient";

const sessionId = "opsmind-default-session"; // later replaced with user-specific id (after auth)

// Small delay helper (controls typing speed)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const ChatUI = ({ stats, setStats }) => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [shake, setShake] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
      (async () => {
        try {
          const res = await getChatHistory(sessionId);
          const data = res.data;
        // Defensive check: make sure we always set an array
        if (Array.isArray(data)) {
          setMessages(data);
        } else if (data && Array.isArray(data.messages)) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("⚠️ Failed to load chat history:", err);
        setMessages([]); // fallback to empty chat
      }
    })();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handler: if user focuses/clicks input but no docs uploaded, show shake + AI message
  const handleInputInteraction = (e) => {
    const docs = (stats && typeof stats.totalDocs !== 'undefined') ? stats.totalDocs : 0;
    if (docs === 0) {
      // prevent focus
      try { e.target.blur(); } catch (err) {}

      // animate
      setShake(true);
      setTimeout(() => setShake(false), 650);

      // avoid duplicate message
      setMessages((prev) => {
        const assistantMsg = { role: 'assistant', content: 'Please upload a document first', warning: true };
        // persist message (best-effort)
        saveMessage({ sessionId, ...assistantMsg }).catch(() => {});
        return [...prev, assistantMsg];
      });
    }
  };

  const handleAsk = async () => {
  if (!query.trim()) return;

  const userMessage = { role: "user", content: query };
  setMessages((prev) => [...prev, userMessage]);
  await saveMessage({ sessionId, ...userMessage });

  setQuery("");
  setIsAnswering(true);

  // Show temporary assistant message
  const tempAssistant = { role: "assistant", content: "Thinking...", thinking: true };
  setMessages((prev) => [...prev, tempAssistant]);

  try {
    const res = await api.post("/ask", { query });
    const { answer, sources } = res.data;

    const fullAnswer = answer || "No response generated.";
    // Expect sources to be an array of objects: { source, page, lineStart, lineEnd, chunk, match, text }
    const citations = (sources || []).map((s, idx) => ({ id: idx + 1, ...s }));

    // Replace "Thinking..." bubble with empty assistant message
    setMessages((prev) => {
      const updated = [...prev];
      updated.pop(); // remove the temporary thinking message
      return [...updated, { role: "assistant", content: "", citations }];
    });

    // Token-by-token typing effect
    const words = fullAnswer.split(" ");
    for (let i = 0; i < words.length; i++) {
      await sleep(70); // speed: smaller = faster typing
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        lastMsg.content = words.slice(0, i + 1).join(" ");
        return [...updated];
      });
    }

    // Save final completed message
    await saveMessage({
      sessionId,
      role: "assistant",
      content: fullAnswer,
      citations,
    });

    setStats((prev) => ({ ...prev, queries: prev.queries + 1 }));
  } catch (err) {
    console.error("❌ Chat error:", err.message);
    setMessages((prev) => {
      const updated = [...prev];
      updated.pop(); // remove temporary message
      return [
        ...updated,
        {
          role: "assistant",
          content: "⚠️ Error: Could not get a response from AI.",
        },
      ];
    });

  }

  setIsAnswering(false);
  };



  const handleClearChat = async () => {
    try {
      await clearChat(sessionId);
      setMessages([]);
    } catch (err) {
      console.error("⚠️ Failed to clear chat:", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-950 text-white">
      {/* Chat Header */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-gray-800 bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-200">Chat Session</h2>
        <button
          onClick={handleClearChat}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Clear Chat
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 float">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Welcome to OpsMind AI</h3>
              <p className="text-gray-400 mb-6">
                Upload your documents and ask me anything related to your
                enterprise SOPs.
              </p>
              <div className="space-y-2 text-left max-w-sm mx-auto">
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <p className="text-xs text-purple-400 font-semibold mb-1">
                    Example
                  </p>
                  <p className="text-sm text-gray-300">
                    "Summarize the HR onboarding policy"
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <p className="text-xs text-purple-400 font-semibold mb-1">
                    Example
                  </p>
                  <p className="text-sm text-gray-300">
                    "What’s the escalation process for IT issues?"
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="flex flex-col space-y-2">
              {msg.role === "user" && (
                <div className="chat-bubble chat-user">{msg.content}</div>
              )}
              {msg.role === "assistant" && (
                <div className={msg.warning ? "chat-bubble border border-red-500 bg-red-900/60 text-red-100" : "chat-bubble chat-assistant"}>
                  {msg.thinking ? (
                    <div className="flex items-center gap-3 text-gray-400">
                      <Loader className="w-5 h-5 animate-spin" /> <span className="typing">Thinking...</span>
                    </div>
                  ) : (
                    <>
                      <p>
                          {msg.content}
                          {isAnswering && idx === messages.length - 1 && (
                            <span className="typing text-purple-400">█</span>
                          )}
                      </p>

                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-3 border-t border-gray-700 pt-2">
                          <p className="text-xs text-gray-400 mb-1 uppercase">
                            Sources
                          </p>
                          {msg.citations.map((c, i) => (
                            <div key={i} className="mb-3 bg-gray-800 rounded-lg p-3 border border-gray-700">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-purple-400" />
                                  <div className="text-sm text-purple-300 font-semibold">{c.source}</div>
                                </div>
                                <div className="text-xs text-gray-400">
                                  {c.match !== undefined ? `${(c.match > 1 ? c.match : c.match * 100).toFixed(1)}% match` : ''}
                                </div>
                              </div>
                                <div className="text-xs text-gray-400 mt-1">
                                Page {c.page ?? '-'} • Line {c.lineStartPage ?? c.lineStart ?? '-'}-{c.lineEndPage ?? c.lineEnd ?? '-'} • Chunk {c.chunk ?? c.chunkIndex ?? '-'}
                              </div>
                                {c.text && (
                                <div className="mt-2 text-sm text-gray-300 italic">{c.text.length > 320 ? c.text.slice(0, 320) + '…' : c.text}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={handleInputInteraction}
            placeholder="Ask a question..."
            className={`input-field ${shake ? 'animate-shake' : ''}`}
            disabled={isAnswering}
          />
          <button
            onClick={handleAsk}
            disabled={!query.trim() || isAnswering}
            className="btn-gradient"
          >
            {isAnswering ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
