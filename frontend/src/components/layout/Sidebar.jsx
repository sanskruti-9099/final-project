import { useContext, useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineAcademicCap,
  HiOutlineHome,
  HiOutlineChatBubbleLeftRight,
  HiOutlineDocumentText,
  HiOutlineQuestionMarkCircle,
  HiOutlineSquare2Stack,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCog6Tooth,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineXMark,
} from 'react-icons/hi2'
import { useTheme } from '../../context/ThemeContext'
import { AuthContext } from '../../context/AuthContext'
import api from '../../services/api'


const NAV_ITEMS = [
  { label: 'Dashboard',        path: '/dashboard',  icon: HiOutlineHome },
  { label: 'AI Chat',          path: '/chat',       icon: HiOutlineChatBubbleLeftRight },
  { label: 'Notes Summarizer', path: '/study',      icon: HiOutlineDocumentText },
  { label: 'Quiz Generator',   path: '/quizzes',    icon: HiOutlineQuestionMarkCircle },
  { label: 'Flashcards',       path: '/flashcards', icon: HiOutlineSquare2Stack },
  { label: 'Study Planner',    path: '/planner',    icon: HiOutlineCalendar },
  { label: 'Settings',         path: '/settings',   icon: HiOutlineCog6Tooth },
]

/**
 * Sidebar
 *
 * Props:
 *  - collapsed: boolean — whether the sidebar is in narrow mode on desktop
 *  - onToggle: () => void — callback to toggle collapsed state on desktop
 *  - mobileOpen: boolean — whether mobile menu is toggled open
 *  - onCloseMobile: () => void — callback to close mobile menu
 */
export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  const { isDark } = useTheme()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [historyItems, setHistoryItems] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true)
      try {
        const res = await api.get('/history/all')
        if (res.data) {
          setHistoryItems(res.data)
        }
      } catch (err) {
        console.error("Failed to load sidebar history", err)
      } finally {
        setLoadingHistory(false)
      }
    }
    fetchHistory()
  }, [])

  return (
    <aside
      id="sidebar"
      className={`
        fixed md:relative top-0 left-0 z-50 md:z-auto h-screen flex flex-col
        border-r transition-all duration-300 ease-in-out shrink-0
        ${isDark
          ? 'bg-surface-950 border-surface-800'
          : 'bg-white border-surface-200'}
        ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}
      style={{ width: `${collapsed && !mobileOpen ? 72 : 260}px` }}
    >
      {/* ── Brand ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 h-16 shrink-0">
        <Link to="/" className="flex items-center gap-3 group" onClick={onCloseMobile}>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
            <HiOutlineAcademicCap className="w-5 h-5 text-white" />
          </div>
          {(!collapsed || mobileOpen) && (
            <span className="text-base font-bold tracking-tight truncate animate-fade-in group-hover:text-primary-500 transition-colors">
              StudyAI
            </span>
          )}
        </Link>
        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className={`
              md:hidden p-2 rounded-xl transition-all duration-200 cursor-pointer
              ${isDark
                ? 'text-surface-400 hover:bg-surface-800 hover:text-white'
                : 'text-surface-500 hover:bg-surface-100 hover:text-surface-900'}
            `}
            aria-label="Close menu"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── Navigation ────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/dashboard'}
            onClick={onCloseMobile}
            className={({ isActive }) => `
              group flex items-center gap-3 px-3 py-2 rounded-lg
              text-sm font-medium transition-all duration-200
              ${isActive
                ? isDark
                  ? 'bg-primary-500/15 text-primary-400 font-semibold'
                  : 'bg-primary-50 text-primary-700 font-semibold'
                : isDark
                  ? 'text-surface-300 hover:bg-surface-800/60 hover:text-surface-100'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'}
            `}
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 shrink-0 transition-all duration-200 ${isActive ? 'stroke-2' : ''} group-hover:scale-105`} />
                {(!collapsed || mobileOpen) && (
                  <span className="truncate animate-fade-in">{label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* ── Dynamic History Sidebar Section ────────────────────────────── */}
        <div className="pt-4 mt-4 border-t border-surface-200 dark:border-surface-800/50">
           <div className={`px-3 mb-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
             {(!collapsed || mobileOpen) ? 'Recent History' : 'Hist'}
           </div>
           
           {loadingHistory ? (
             <div className="px-3 py-2 text-xs text-surface-400">Loading...</div>
           ) : historyItems.length > 0 ? (
             <div className="space-y-1">
               {historyItems.map((item) => (
                 <div
                   key={`${item.feature}-${item.id}`}
                   onClick={() => {
                     if (item.feature === 'AI Chat') navigate('/chat');
                     else if (item.feature === 'Summarizer') navigate('/study');
                     else if (item.feature === 'Quiz Generator') navigate('/quizzes');
                     else if (item.feature === 'Flashcards') navigate('/flashcards');
                     else if (item.feature === 'Study Planner') navigate('/planner');
                     if (mobileOpen) onCloseMobile();
                   }}
                   className={`
                     group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                     text-sm font-medium transition-all duration-200
                     ${isDark
                       ? 'text-surface-300 hover:bg-surface-800/60 hover:text-surface-100'
                       : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'}
                   `}
                 >
                   <HiOutlineClock className={`w-4 h-4 shrink-0 transition-all duration-200 group-hover:scale-105 ${collapsed && !mobileOpen ? 'mx-auto' : ''}`} />
                   {(!collapsed || mobileOpen) && (
                     <div className="flex flex-col overflow-hidden w-full">
                       <span className="truncate text-[13px]">{item.title}</span>
                       <span className="text-[10px] opacity-70 truncate">
                         {new Date(item.created_at).toLocaleDateString()} &middot; {item.feature}
                       </span>
                     </div>
                   )}
                 </div>
               ))}
             </div>
           ) : (
             <div className="px-3 py-2 text-xs text-surface-400">
               {(!collapsed || mobileOpen) ? 'No history yet' : '-'}
             </div>
           )}
        </div>
      </nav>

      {/* ── User Card ───────────────────────────────────── */}
      <div className="px-3 py-3 border-t border-surface-200 dark:border-surface-800/50">
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isDark ? 'bg-surface-800/50' : 'bg-surface-50'} transition-all`}>
          <div className="w-9 h-9 rounded-full shrink-0 bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold shadow-sm overflow-hidden">
             {user?.profile_image ? (
               <img src={`http://localhost:8000${user.profile_image}`} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <span>{user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}</span>
             )}
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col min-w-0 animate-fade-in">
              <span className={`text-sm font-medium truncate ${isDark ? 'text-surface-100' : 'text-surface-900'}`}>{user?.full_name || 'User'}</span>
              <span className={`text-xs truncate ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{user?.email || 'Loading...'}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Collapse toggle ───────────────────────────── */}
      <div className="px-3 py-3 border-t border-surface-200 dark:border-surface-800/50 hidden md:block">
        <button
          id="sidebar-toggle"
          onClick={onToggle}
          className={`
            flex items-center justify-center w-full py-2 rounded-xl
            text-xs font-medium transition-all duration-200 cursor-pointer
            ${isDark
              ? 'text-surface-200 hover:bg-surface-800'
              : 'text-surface-700 hover:bg-surface-100'}
          `}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <HiOutlineChevronRight className="w-4 h-4" />
            : (
              <>
                <HiOutlineChevronLeft className="w-4 h-4 mr-2" />
                Collapse
              </>
            )
          }
        </button>
      </div>
    </aside>
  )
}
