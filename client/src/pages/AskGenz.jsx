import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { MessageCircle, Send, User, Bot, Sparkles, Trophy, Brain, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AskGenz = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m GenZ AI, your personal growth accelerator. Ask me anything about your current rank, accuracy, or how to dominate your career goals!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSend = async e => {
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
      console.error('Error in chat:', err);
      setMessages(prev => [...prev, { role: 'bot', text: "I hit a snag in the intelligence field. Could you repeat that for me?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col gap-6 py-4 animate-in">
      {/* Premium Header */}
      <section className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden flex items-center justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50"></div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
            <Sparkles className="w-3 h-3 text-primary-glow" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-glow">Next-Gen Intelligence</span>
          </div>
          <h1 className="text-3xl font-display font-black text-white tracking-tighter">
            Ask <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-glow to-secondary-glow">GenZ AI</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium">Your personalized guide to mastering the platform and your career.</p>
        </div>

        <div className="hidden md:flex items-center gap-4 relative z-10">
          <div className="p-4 bg-surfaceHighlight/50 border border-glass-border rounded-2xl flex flex-col items-center backdrop-blur-md">
            <Trophy className="w-5 h-5 text-yellow-500 mb-1" />
            <span className="text-[10px] font-black text-gray-400 uppercase">Rank Aware</span>
          </div>
          <div className="p-4 bg-surfaceHighlight/50 border border-glass-border rounded-2xl flex flex-col items-center backdrop-blur-md">
            <Brain className="w-5 h-5 text-purple-500 mb-1" />
            <span className="text-[10px] font-black text-gray-400 uppercase">Proactive AI</span>
          </div>
        </div>
      </section>

      {/* Main Chat Interface */}
      <div className="flex-1 glass-card rounded-[2.5rem] flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-[0.02] pointer-events-none"></div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar relative z-10">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border border-glass-border shadow-lg ${msg.role === 'user' ? 'bg-primary/20' : 'bg-surfaceHighlight'
                    }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5 text-primary-glow" /> : <Bot className="w-5 h-5 text-secondary-glow" />}
                  </div>

                  <div className={`p-5 rounded-[2rem] text-sm leading-relaxed font-bold backdrop-blur-md shadow-lg ${msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-none shadow-primary/20'
                      : 'bg-surfaceHighlight/80 text-gray-200 rounded-tl-none border border-glass-border'
                    }`}>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-4 max-w-[75%]">
                <div className="shrink-0 w-10 h-10 rounded-2xl bg-surfaceHighlight flex items-center justify-center border border-glass-border">
                  <Bot className="w-5 h-5 text-secondary-glow" />
                </div>
                <div className="bg-surfaceHighlight/80 text-gray-200 p-5 rounded-[2rem] rounded-tl-none border border-glass-border shadow-sm">
                  <div className="flex gap-1.5 items-center h-full">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-surfaceHighlight/30 backdrop-blur-md border-t border-glass-border relative z-20">
          <form onSubmit={onSend} className="relative group max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about your rank, interview prep, or new courses..."
              className="glass-input w-full pl-8 pr-16 py-5 rounded-3xl bg-surfaceHighlight border-glass-border focus:border-primary/50 focus:bg-surfaceHighlight/80 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-primary-dark text-white p-3.5 rounded-2xl hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 transition-all active:scale-95 group-hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-4 flex items-center justify-center gap-2 opacity-50">
            <Zap className="w-3 h-3 text-secondary-glow" />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
              Powered by GenZ Intelligence • Smart Knowledge Engine Alpha
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};

export default AskGenz;
