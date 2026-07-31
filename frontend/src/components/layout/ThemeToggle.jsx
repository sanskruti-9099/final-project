import React from 'react';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`
        p-2 rounded-xl transition-all duration-200 cursor-pointer
        ${isDark
          ? 'text-surface-200 hover:bg-surface-800 hover:text-amber-400'
          : 'text-surface-700 hover:bg-surface-100 hover:text-primary-600'}
      `}
    >
      {isDark ? (
        <HiOutlineSun className="w-5 h-5" />
      ) : (
        <HiOutlineMoon className="w-5 h-5" />
      )}
    </button>
  );
}
