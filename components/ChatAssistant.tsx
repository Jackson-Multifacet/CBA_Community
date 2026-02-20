import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, User, Bot } from 'lucide-react';
import { chatWithSpiritualCompanion } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Blessings! I am the Christ Believers Assembly spiritual assistant. How can I pray for you or help you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Format history for Gemini API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithSpiritualCompanion(inputValue, history);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I'm having trouble connecting right now, but God is always listening.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I apologize, but I'm currently unable to respond. Please try again later.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-church-600 text-white p-4 rounded-full shadow-lg hover:bg-church-700 transition-all duration-300 transform hover:scale-110 active:scale-95 hover:rotate-3 shadow-church-500/30 ${isOpen ? 'scale-0 opacity-0 rotate-180' : 'scale-100 opacity-100'}`}
        aria-label="Open Chat"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-96 h-[600px] flex flex-col overflow-hidden transition-all duration-500 ease-in-out transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <div className="flex-1 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col border border-white/20 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-church-600 to-church-800 p-4 flex justify-between items-center text-white shadow-md">
                <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-full backdrop-blur-md">
                    <Sparkles size={18} className="text-gold-400" />
                </div>
                <div>
                    <h3 className="font-bold text-sm">Ministry Assistant</h3>
                    <p className="text-[10px] text-church-200 font-medium tracking-wide flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        ONLINE
                    </p>
                </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="hover:bg-white/10 p-2 rounded-full transition duration-200"
                >
                  <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-thin">
                {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-church-100 text-church-600' : 'bg-gold-50 text-gold-600'} shadow-sm`}>
                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div
                    className={`max-w-[75%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user'
                        ? 'bg-church-600 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    }`}
                    >
                    {msg.text}
                    </div>
                </div>
                ))}
                {isLoading && (
                <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center shadow-sm">
                        <Bot size={14} />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1.5 items-center">
                    <div className="w-2 h-2 bg-church-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-church-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-church-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 pl-4 border border-transparent focus-within:border-church-300 focus-within:ring-2 focus-within:ring-church-100 transition-all">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-0 text-sm focus:ring-0 outline-none placeholder-gray-400 text-gray-800"
                />
                <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    className="p-2.5 bg-church-600 text-white rounded-full hover:bg-church-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md transform active:scale-90"
                >
                    <Send size={16} />
                </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-2">
                    AI can make mistakes. For urgent pastoral care, please call the church office.
                </p>
            </div>
        </div>
      </div>
    </>
  );
};

export default ChatAssistant;