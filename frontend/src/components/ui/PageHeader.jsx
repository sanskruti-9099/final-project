import React from 'react';

export default function PageHeader({ title, description }) {
  return (
    <div className="mb-8 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white mb-2">
        {title}
      </h1>
      <p className="text-surface-600 dark:text-surface-400">
        {description}
      </p>
    </div>
  );
}
