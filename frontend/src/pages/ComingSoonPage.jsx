import { useTheme } from '../context/ThemeContext'
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2'

/**
 * Generic placeholder for feature pages that haven't been built yet.
 */
export default function ComingSoonPage({ title = 'Coming Soon' }) {
  const { isDark } = useTheme()

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
      <div className={`
        p-6 rounded-3xl transition-colors duration-300
        ${isDark ? 'bg-surface-850 border border-surface-800' : 'bg-white border border-surface-200 shadow-sm'}
      `}>
        <div className="flex flex-col items-center text-center space-y-4 max-w-sm">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20">
            <HiOutlineWrenchScrewdriver className={`w-8 h-8 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
          </div>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <p className={`text-sm ${isDark ? 'text-surface-200' : 'text-surface-700'}`}>
            This feature is under construction. Check back soon!
          </p>
        </div>
      </div>
    </div>
  )
}
