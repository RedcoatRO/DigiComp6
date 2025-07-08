import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable';
import { Bot, User, Send, X, Loader } from 'lucide-react';
import { Message } from '../types';
import { getChatResponse } from '../services/geminiService';

interface ChatWindowProps {
    onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: 'Bună ziua! Sunt asistentul dumneavoastră virtual. Cum vă pot ajuta cu programarea medicală?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const nodeRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        try {
            const botResponseText = await getChatResponse(currentInput);
            setMessages(prev => [...prev, { sender: 'bot', text: botResponseText }]);
        } catch (error) {
            console.error("Error getting chat response:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Ne pare rău, a apărut o eroare. Vă rugăm să încercați mai târziu.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Draggable handle=".handle" bounds="parent" nodeRef={nodeRef}>
            <motion.div
                ref={nodeRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="w-full max-w-md h-[70vh] max-h-[600px] bg-slate-100/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-lg shadow-2xl flex flex-col border border-white/20 dark:border-white/10 overflow-hidden pointer-events-auto"
            >
              <div className="handle flex-shrink-0 h-10 bg-slate-200/50 dark:bg-gray-900/50 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing">
                  <div className="flex items-center gap-2">
                      <Bot size={18} className="text-purple-600 dark:text-purple-400" />
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-200">Asistent Virtual</p>
                  </div>
                  <button onClick={onClose} className="p-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors" aria-label="Close chat window">
                      <X size={18} />
                  </button>
              </div>
              <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'bot' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-900 flex items-center justify-center"><Bot size={20} className="text-purple-600 dark:text-purple-400" /></div>}
                        <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'}`}>{msg.text}</div>
                        {msg.sender === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center"><User size={20} className="text-gray-700 dark:text-gray-200" /></div>}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-900 flex items-center justify-center"><Bot size={20} className="text-purple-600 dark:text-purple-400" /></div>
                        <div className="max-w-xs md:max-w-sm px-4 py-2 rounded-2xl bg-white dark:bg-gray-700 rounded-bl-none">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Loader size={16} className="animate-spin" /><span>Gândește...</span></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex-shrink-0 p-3 border-t border-slate-300 dark:border-gray-700 bg-slate-100 dark:bg-gray-800/80">
                  <div className="relative">
                      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Scrieți mesajul..." disabled={isLoading} className="w-full p-2 pr-12 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                          <Send size={16}/>
                      </button>
                  </div>
              </div>
            </motion.div>
        </Draggable>
    );
};

export default ChatWindow;