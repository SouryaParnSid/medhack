'use client';

import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { getChatResponse } from '@/utils/gemini';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI healthcare assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatResponse(userMessage.content);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error. Please try asking your question again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl py-16 sm:py-24">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl slide-up">
              <span className="gradient-text">AI Healthcare</span> Assistant
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get instant guidance on medical conditions, treatments, and health-related questions from our intelligent AI assistant.
            </p>
          </div>

          <div className="mt-8 flex h-[600px] flex-col rounded-xl bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-800/20 border border-gray-200 dark:border-gray-700 overflow-hidden glass">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h2 className="text-white font-medium">SwasthyaAI Assistant</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  } fade-in`}
                >
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white mr-2 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-4 py-3 max-w-[80%] shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }} />
                    <p className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 ml-2 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start fade-in">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white mr-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div className="flex space-x-2 rounded-lg bg-white dark:bg-gray-800 px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 dark:bg-indigo-500"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 dark:bg-indigo-500" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 dark:bg-indigo-500" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full rounded-full border-0 py-3 pl-4 pr-12 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-indigo-600 p-2 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:scale-105"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                Ask me anything about medical conditions, treatments, or health advice.
              </p>
            </form>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Suggested Questions</h3>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <button 
                onClick={() => setInput("What are the symptoms of dehydration?")}
                className="px-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
              >
                Symptoms of dehydration
              </button>
              <button 
                onClick={() => setInput("How to treat a fever in children?")}
                className="px-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
              >
                Treating fever in children
              </button>
              <button 
                onClick={() => setInput("What are signs of malnutrition?")}
                className="px-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
              >
                Signs of malnutrition
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 