import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

/**
 * DashboardLayout
 *
 * Shell layout used by all authenticated pages.
 * Locks layout height to viewport, using flex flow and internal page scrolling.
 */
export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100 transition-colors duration-300">
      {/* Mobile Sidebar Backdrop overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - relative flex child on desktop, fixed slide-over on mobile */}
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed((p) => !p)} 
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar onMenuToggle={() => setMobileOpen((p) => !p)} />

        <main className="flex-1 p-4 sm:p-6 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
