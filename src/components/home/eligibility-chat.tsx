"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'; // Removing User unused import
import { motion, AnimatePresence } from 'framer-motion';

// Mock service since the original was in an external file
const getChatResponse = async (text: string): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple keyword-based mock interactions
    const lower = text.toLowerCase();
    if (lower.includes('eligible') || lower.includes('can i donate')) {
        return "To be eligible, you generally need to be at least 17 years old, weigh at least 110 lbs, and be in good health. Have you donated before?";
    }
    if (lower.includes('age') || lower.includes('old')) {
        return "You must be at least 17 years old to donate in most states (16 with parental consent in some areas). There is no upper age limit as long as you are healthy!";
    }
    if (lower.includes('weight')) {
        return "Donors must weigh at least 110 lbs (50 kg) to ensure donor safety.";
    }
    if (lower.includes('food') || lower.includes('eat')) {
        return "It's important to eat a healthy meal and drink plenty of water before your appointment. Avoid fatty foods just before donating.";
    }
    
    return "That's a great question. While I'm an AI assistant, I recommend checking our detailed eligibility page or speaking with a nurse at the center for specific medical questions. Would you like to schedule a screening?";
};

interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
}

export const EligibilityChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi there! I'm LifeBot 🤖. I can help you check if you're eligible to donate or answer questions about the process. How can I help today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await getChatResponse(userMsg.text);
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      // Fallback
      setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: "I'm having trouble connecting right now. Please try again later.",
          timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl bg-rose-600 text-white hover:bg-rose-700 transition-colors ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="sr-only">Open Chat</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-rose-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">LifeFlow Assistant</h3>
                  <p className="text-xs text-rose-100">Powered by Gemini AI</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-rose-600 text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about eligibility..."
                  className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-slate-800"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-400 mt-2">
                AI can make mistakes. Consult a medical professional.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
