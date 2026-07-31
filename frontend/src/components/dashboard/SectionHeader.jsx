import React from 'react';

export default function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-50 flex items-center gap-2">
        {Icon && <Icon className="text-primary-500 w-6 h-6" />}
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
