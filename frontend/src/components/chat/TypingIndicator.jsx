import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex w-full justify-start mb-6">
      <div className="flex max-w-[80%] flex-row">
        {/* Avatar Placeholder */}
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-surface-200 dark:bg-surface-700 text-primary-600 dark:text-primary-400 mr-3 shadow-sm">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        
        {/* Animated Dots */}
        <div className="flex items-center px-5 py-4 bg-white dark:bg-surface-850 border border-surface-200 dark:border-surface-700 rounded-2xl rounded-tl-none shadow-sm">
          <div className="flex space-x-1.5">
            <div className="w-2 h-2 bg-surface-400 dark:bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-surface-400 dark:bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-surface-400 dark:bg-surface-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
