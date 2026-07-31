import React from 'react';

export default function ProgressCard({ title, completed, total }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/25 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-primary-100 text-sm mb-6">
          {completed} of {total} tasks completed
        </p>

        <div className="flex justify-between items-end mb-2">
          <span className="text-3xl font-extrabold">{percentage}%</span>
          <span className="text-sm font-medium text-primary-100">Progress</span>
        </div>

        <div className="w-full bg-black/20 rounded-full h-2.5 backdrop-blur-sm">
          <div 
            className="bg-white h-2.5 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
