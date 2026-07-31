import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi2';

export default function FeatureCard({ title, description, icon: Icon, path, colorClass }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(path)}
      className="group h-full flex flex-col bg-white dark:bg-surface-850 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-primary-500/30 dark:hover:border-primary-500/50 transition-all duration-300 cursor-pointer"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 flex-1 leading-relaxed">
        {description}
      </p>
      <div className="mt-4 flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Open Tool <HiOutlineArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
