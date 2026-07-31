import React from 'react';

export default function StatCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-white dark:bg-surface-850 border border-surface-200 dark:border-surface-800 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-primary-500/20 transition-all duration-300 h-full">
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
          {title}
        </p>
        <p className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-50 mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}
