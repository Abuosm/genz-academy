import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { MessageCircle, Send, User, Bot, Sparkles, Trophy, Brain } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col gap-6 py-4">
      {/* Premium Header */}
      <section className="bg-white border border-slate-200 p-8 rounded-[2.5rem] relative overflow-hidden flex items-center justify-between shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/5 border border-indigo-500/10 rounded-full">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Next-Gen Intelligence</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Ask <span className="text-indigo-600">GenZ AI</span></h1>
          <p className="text-slate-500 text-sm font-medium">Your personalized guide to mastering the platform and your career.</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center">
            <Trophy className="w-5 h-5 text-yellow-500 mb-1" />
            <span className="text-[10px] font-black text-slate-400 uppercase">Rank Aware</span>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center">
            <Brain className="w-5 h-5 text-purple-500 mb-1" />
            <span className="text-[10px] font-black text-slate-400 uppercase">Proactive AI</span>
          </div>
        </div>
      </section>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] flex flex-col overflow-hidden shadow-sm">
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-slate-50/50">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-100'
                    }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                  </div>
                  <div className={`p-5 rounded-[2rem] text-sm leading-relaxed font-bold ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-600/10'
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-200 shadow-sm'
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
                <div className="shrink-0 w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white text-slate-700 p-5 rounded-[2rem] rounded-tl-none border border-slate-200 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-100">
          <form onSubmit={onSend} className="relative group max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about your rank, interview prep, or new courses..."
              className="w-full pl-8 pr-16 py-5 bg-slate-50 border border-slate-200 rounded-3xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3.5 rounded-2xl hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
              Powered by GenZ Intelligence • Smart Knowledge Engine Alpha
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
};

export default AskGenz;
