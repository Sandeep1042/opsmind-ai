import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader, Brain, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api/apiClient';

const ChatUI = ({ stats, setStats }) => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async () => {
    if (!query.trim()) return;
    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage, { role: 'assistant', content: 'Thinking...', thinking: true }]);
    setQuery('');
    setIsAnswering(true);

    try {
      const res = await api.post('/ask', { query });
      const { answer, sources } = res.data;

      const citations = (sources || []).map((src, idx) => ({
        id: idx + 1,
        name: src,
      }));

      setMessages(prev => {
        const updated = [...prev];
        updated.pop();
        return [...updated, { role: 'assistant', content: answer, citations }];
      });

      setStats(prev => ({ ...prev, queries: prev.queries + 1 }));
    } catch (err) {
      console.error(err);
      setMessages(prev => {
        const updated = [...prev];
        updated.pop();
        return [...updated, { role: 'assistant', content: 'Error: Could not get response from server.' }];
      });
    }

    setIsAnswering(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-950 text-white">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Welcome to OpsMind AI</h3>
              <p className="text-gray-400 mb-6">Ask questions about your uploaded documents.</p>
              <p className="text-sm text-gray-500 italic">Example: “What is the refund process?”</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx}>
              {msg.role === 'user' && (
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl px-5 py-3 max-w-2xl">
                    {msg.content}
                  </div>
                </div>
              )}
              {msg.role === 'assistant' && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 rounded-2xl p-5 max-w-3xl">
                    {msg.thinking ? (
                      <div className="flex items-center gap-3 text-gray-400">
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>{msg.content}</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-white leading-relaxed">{msg.content}</p>
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-4 border-t border-gray-700 pt-3">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Sources</p>
                            {msg.citations.map((c, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-purple-400">
                                <FileText className="w-3 h-3" /> {c.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            disabled={isAnswering}
            className="flex-1 bg-gray-800 text-white rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
          />
          <button
            onClick={handleAsk}
            disabled={!query.trim() || isAnswering}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2"
          >
            {isAnswering ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
