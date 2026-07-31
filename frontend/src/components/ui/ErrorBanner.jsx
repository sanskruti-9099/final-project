import React from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';

export default function ErrorBanner({ error }) {
  if (!error) return null;
  
  return (
    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 rounded-xl flex items-center gap-3 text-sm animate-fade-in shadow-sm">
      <FaCircleExclamation className="flex-shrink-0 text-red-500 dark:text-red-400" size={16} />
      <span>{error}</span>
    </div>
  );
}
