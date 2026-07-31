import React from 'react';
import { FaRobot } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

export default function ChatBubble({ message, isUser, timestamp = "10:42 AM" }) {
  return (
    <div className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'} mb-6`}>
      {/* AI Header */}
      {!isUser && (
        <div className="flex items-center gap-2 mb-2 ml-1">
          <div className="w-5 h-5 rounded-full bg-surface-700 flex items-center justify-center text-surface-300">
            <FaRobot size={10} />
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-surface-400">
            AI Study Assistant
          </span>
        </div>
      )}

      {/* Bubble */}
      <div className={`flex max-w-[85%] md:max-w-[75%]`}>
        <div 
          className={`px-5 py-4 rounded-3xl shadow-sm ${
            isUser 
              ? 'bg-[#5b8cff] text-white rounded-tr-sm' 
              : 'bg-[#1e2329] text-surface-100 rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{message}</p>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none text-[15px] leading-relaxed prose-p:my-2 prose-headings:text-white prose-headings:mb-2 prose-headings:mt-4 prose-code:bg-surface-700 prose-code:text-surface-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:before:content-none prose-code:after:content-none">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
      
      {/* User Footer (Read status) */}
      {isUser && (
        <div className="mt-1.5 mr-1 text-[10px] text-surface-500 font-medium tracking-wide">
          Read {timestamp}
        </div>
      )}
    </div>
  );
}
