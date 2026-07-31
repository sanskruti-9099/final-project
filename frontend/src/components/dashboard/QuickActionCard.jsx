import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickActionCard({ title, icon: Icon, path, colorClass }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="flex flex-col items-center justify-center gap-3 p-4 bg-white dark:bg-surface-850 border border-surface-200 dark:border-surface-800 rounded-2xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-all duration-200 group shadow-sm hover:shadow-md hover:border-primary-500/30 cursor-pointer w-full h-full"
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-sm font-medium text-surface-800 dark:text-surface-200 text-center">
        {title}
      </span>
    </button>
  );
}
