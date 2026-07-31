import React from 'react';
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineXCircle } from 'react-icons/hi2';

export default function ActivityCard({ activity, isLast }) {
  const { feature_name, title, created_at, status } = activity;
  
  // Format date
  const dateObj = new Date(created_at);
  const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

  // Status icon and color
  let StatusIcon = HiOutlineClock;
  let statusColor = 'text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 border-surface-200 dark:border-surface-700';
  
  if (status === 'completed' || status === 'success') {
    StatusIcon = HiOutlineCheckCircle;
    statusColor = 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
  } else if (status === 'failed' || status === 'error') {
    StatusIcon = HiOutlineXCircle;
    statusColor = 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  }

  return (
    <div className={`relative flex items-start gap-4 py-4 px-2 group ${!isLast ? '' : ''}`}>
      {/* Timeline Node */}
      <div className="relative z-10 mt-1 shrink-0">
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${statusColor}`}>
          <StatusIcon className="w-4 h-4" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 bg-white dark:bg-surface-850 border border-transparent hover:border-surface-200 dark:hover:border-surface-700 hover:shadow-sm rounded-xl p-3 -mt-2 transition-all duration-200">
        <p className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 mb-0.5 uppercase tracking-wider">
          {feature_name}
        </p>
        <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
          {title}
        </p>
        <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
          {dateString} at {timeString}
        </p>
      </div>
    </div>
  );
}
