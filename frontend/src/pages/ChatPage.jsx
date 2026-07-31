import React, { useState, useRef, useEffect } from 'react';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';
import TypingIndicator from '../components/chat/TypingIndicator';
import { chatService } from '../services/chatService';
import api from '../services/api';
import { FaExclamationTriangle, FaSpinner, FaUser } from 'react-icons/fa';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I've prepared some common Python interview questions to help you study. What would you like to explore first?", isUser: false }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);

  // Auto-scroll to the bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isFetchingHistory]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await api.get('/history');
        if (response.data && response.data.success && response.data.history) {
          const historyData = response.data.history.reverse();
          const historyMessages = [];
          historyData.forEach((record) => {
            historyMessages.push({ id: `q-${record.id}`, text: record.question, isUser: true });
            historyMessages.push({ id: `a-${record.id}`, text: record.answer, isUser: false });
          });
          
          if (historyMessages.length > 0) {
            setMessages([
              { id: 1, text: "Welcome back! Here is your previous conversation.", isUser: false },
              ...historyMessages
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setIsFetchingHistory(false);
      }
    };
    
    loadHistory();
  }, []);

  const handleSendMessage = async (text) => {
    setError(null);
    const newUserMsg = { id: Date.now(), text, isUser: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const answer = await chatService.askQuestion(text);
      const newAIMsg = { id: Date.now() + 1, text: answer, isUser: false };
      setMessages((prev) => [...prev, newAIMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      let errorMessage = "I'm sorry, I'm having trouble connecting to the server right now. Please try again later.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#10141a] rounded-none sm:rounded-xl overflow-hidden animate-fade-in -m-6 sm:m-0">
      
      {/* Header */}
      <div className="bg-[#10141a] p-4 flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-white tracking-wide">Ai Chat</h2>
        <div className="w-8 h-8 rounded-full bg-[#a3bdfa] flex items-center justify-center text-primary-900 shadow-sm">
          <FaUser size={12} />
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        <div className="max-w-4xl mx-auto">
          {isFetchingHistory ? (
            <div className="flex flex-col items-center justify-center py-12 text-surface-500">
              <FaSpinner className="animate-spin text-3xl mb-3 text-primary-500" />
              <p>Loading your chat history...</p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg.text} isUser={msg.isUser} timestamp={msg.timestamp} />
              ))}
              
              {isLoading && <TypingIndicator />}
              
              {error && (
                <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-surface-800 dark:text-red-400 dark:border-red-800/50 shadow-sm" role="alert">
                  <FaExclamationTriangle className="flex-shrink-0 inline w-4 h-4 mr-3" />
                  <span className="sr-only">Error</span>
                  <div>
                    <span className="font-medium">Connection Error:</span> {error}
                  </div>
                </div>
              )}
            </>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
