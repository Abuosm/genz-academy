import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { MessageCircle, Send, X, Bot, User, Sparkles, Minimize2, Maximize2, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'System Online. I am GenZ AI. Ready to assist with your learning protocols.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const onSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/support/ask', { message: userMsg });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Connection interrupted. Please retry.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`glass-panel rounded-3xl flex flex-col overflow-hidden mb-4 transition-all duration-300 ${isMinimized ? 'h-16 w-72' : 'h-[550px] w-[380px]'
              }`}
          >
            {/* Header */}
            <div className="p-4 bg-primary/10 border-b border-glass-border flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-xl border border-primary/30 relative">
                  <Bot className="w-5 h-5 text-primary-glow animate-pulse" />
                  <div className="absolute inset-0 bg-primary/20 blur-md rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    GenZ AI <span className="px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[9px] border border-green-500/30">V2.0</span>
                  </h3>
                  {!isMinimized && (
                    <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Neural Link Active
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-background/50">
                  {messages.map((msg, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${msg.role === 'user'
                            ? 'bg-primary/20 border-primary/30 text-primary-glow'
                            : 'bg-secondary/20 border-secondary/30 text-secondary-glow'
                          }`}>
                          {msg.role === 'user' ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                        </div>
                        <div className={`p-4 rounded-2xl text-xs leading-relaxed font-medium border backdrop-blur-sm ${msg.role === 'user'
                            ? 'bg-primary/10 border-primary/20 text-white rounded-tr-none'
                            : 'bg-surfaceHighlight/50 border-glass-border text-gray-200 rounded-tl-none'
                          }`}>
                          {msg.text}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-surfaceHighlight/50 p-4 rounded-2xl rounded-tl-none border border-glass-border flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-surfaceHighlight/30 border-t border-glass-border backdrop-blur-md">
                  <form onSubmit={onSend} className="relative group">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Execute command or ask question..."
                      className="w-full bg-background/50 border border-glass-border rounded-xl pl-4 pr-12 py-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity blur-md -z-10"></div>
                    <button
                      disabled={loading || !input.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:hover:bg-primary transition-all shadow-lg shadow-primary/20"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(112,69,255,0.4)] transition-all border border-glass-border relative overflow-hidden group ${isOpen ? 'bg-accent rotate-90' : 'bg-surfaceHighlight backdrop-blur-xl'
          }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:opacity-100 opacity-50 transition-opacity"></div>
        {isOpen ? (
          <X className="w-7 h-7 text-white relative z-10" />
        ) : (
          <>
            <MessageCircle className="w-7 h-7 text-white relative z-10 group-hover:text-primary-glow transition-colors" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e] animate-pulse"></span>
          </>
        )}
      </motion.button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(112, 69, 255, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(112, 69, 255, 0.5); }
      `}</style>
    </div>
  );
};

export default ChatWidget;
