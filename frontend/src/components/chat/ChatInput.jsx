import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const SUGGESTIONS = [
  "Deep Dive: Decorators",
  "Quiz me on this",
  "Summary"
];

export default function ChatInput({ onSendMessage, isLoading }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-[#10141a] p-4 pb-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        
        {/* Suggestion Chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => {
                setMessage(sug);
                if (textareaRef.current) textareaRef.current.focus();
              }}
              className="shrink-0 px-4 py-2 bg-[#1e2329] hover:bg-[#2a3038] text-surface-300 text-xs font-semibold rounded-full border border-surface-800 transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>

        <form 
          onSubmit={handleSubmit}
          className="relative flex items-end bg-[#1e2329] border border-surface-800 rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-[#5b8cff] transition-all shadow-sm"
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a study question..."
            disabled={isLoading}
            className="w-full max-h-[120px] bg-transparent text-surface-100 placeholder-surface-500 p-4 pr-14 resize-none outline-none overflow-y-auto font-medium"
            rows="1"
          />
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`absolute right-3 bottom-2.5 p-2 rounded-xl flex items-center justify-center transition-colors duration-200 ${
              message.trim() && !isLoading
                ? 'bg-[#a3bdfa] text-primary-900 hover:bg-[#5b8cff] hover:text-white'
                : 'bg-surface-800 text-surface-600 cursor-not-allowed'
            }`}
          >
            <FaPaperPlane size={14} className={isLoading ? 'animate-pulse' : ''} />
          </button>
        </form>
        
        <div className="text-center mt-1">
          <span className="text-[9px] text-surface-500 uppercase tracking-widest font-semibold">
            AI Assistant can make mistakes. Verify important info.
          </span>
        </div>
      </div>
    </div>
  );
}
