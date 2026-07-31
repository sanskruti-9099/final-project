import { useState, useContext, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineBell,
  HiOutlineMagnifyingGlass,
  HiOutlineAcademicCap,
  HiOutlineBars3,
} from 'react-icons/hi2'
import { useTheme } from '../../context/ThemeContext'
import ThemeToggle from './ThemeToggle'
import { AuthContext } from '../../context/AuthContext'

export default function Navbar({ onMenuToggle }) {
  const { isDark } = useTheme()
  const { user, logout } = useContext(AuthContext)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header
      id="navbar"
      className={`
        sticky top-0 z-30 flex items-center justify-between
        h-16 px-6 border-b backdrop-blur-xl transition-colors duration-300
        ${isDark
          ? 'bg-surface-900/70 border-surface-800'
          : 'bg-white/70 border-surface-200'}
      `}
    >
      {/* ── Left: Brand (Visible mainly on mobile/tablet or as requested) ── */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onMenuToggle}
          className={`
            md:hidden p-2 rounded-xl transition-all duration-200 cursor-pointer
            ${isDark
              ? 'text-surface-200 hover:bg-surface-800 hover:text-white'
              : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'}
          `}
          aria-label="Open sidebar"
        >
          <HiOutlineBars3 className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2 group md:hidden">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 shadow-md shadow-primary-500/25 group-hover:scale-105 transition-transform">
            <HiOutlineAcademicCap className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight group-hover:text-primary-500 transition-colors">StudyAI</h1>
        </Link>
        
        {/* Desktop Search */}
        <div className="hidden md:flex items-center relative ml-4">
          <HiOutlineMagnifyingGlass className="absolute left-3 w-4 h-4 text-surface-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className={`
              pl-10 pr-12 py-1.5 w-64 rounded-lg text-sm font-medium outline-none transition-all focus:ring-1 focus:ring-primary-500
              ${isDark ? 'bg-surface-800 text-surface-100 placeholder-surface-500 border border-surface-700' : 'bg-surface-100/80 hover:bg-surface-200/50 text-surface-900 placeholder-surface-500 border border-surface-200/50'}
            `}
          />
          <div className="absolute right-2 flex items-center gap-1">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-surface-400 dark:text-surface-500 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded shadow-sm">⌘</kbd>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-surface-400 dark:text-surface-500 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded shadow-sm">K</kbd>
          </div>
        </div>
      </div>

      {/* ── Right actions ────────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon */}
        <button
          aria-label="Search"
          className={`
            md:hidden p-2 rounded-xl transition-all duration-200 cursor-pointer
            ${isDark
              ? 'text-surface-200 hover:bg-surface-800 hover:text-white'
              : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'}
          `}
        >
          <HiOutlineMagnifyingGlass className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className={`
            relative p-2 rounded-xl transition-all duration-200 cursor-pointer
            ${isDark
              ? 'text-surface-200 hover:bg-surface-800 hover:text-white'
              : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'}
          `}
        >
          <HiOutlineBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500 animate-pulse-soft" />
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Avatar / User Dropdown */}
        <div className="relative ml-1 sm:ml-2 pl-2 sm:pl-3 border-l border-surface-200 dark:border-surface-700 flex items-center" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary-500/25 cursor-pointer hover:ring-2 hover:ring-primary-400 hover:ring-offset-2 hover:ring-offset-surface-50 dark:hover:ring-offset-surface-900 transition-all overflow-hidden"
          >
            {user?.profile_image ? (
              <img src={`http://localhost:8000${user.profile_image}`} alt={user?.full_name} className="w-full h-full object-cover" />
            ) : (
              <span>{user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}</span>
            )}
          </button>

          {dropdownOpen && (
            <div className={`absolute right-0 top-12 mt-2 w-48 rounded-xl shadow-lg border overflow-hidden ${isDark ? 'bg-surface-800 border-surface-700' : 'bg-white border-surface-200'}`}>
              <div className="px-4 py-3 border-b border-surface-700 dark:border-surface-700">
                <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.full_name || 'User'}</p>
                <p className={`text-xs font-medium truncate ${isDark ? 'text-surface-400' : 'text-gray-500'}`}>
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              <ul className="py-1">
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-primary-500/10 hover:text-primary-500 transition-colors ${isDark ? 'text-surface-200' : 'text-gray-700'}`}
                  >
                    Profile Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left block px-4 py-2 text-sm hover:bg-red-500/10 hover:text-red-500 transition-colors ${isDark ? 'text-surface-200' : 'text-gray-700'}`}
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
