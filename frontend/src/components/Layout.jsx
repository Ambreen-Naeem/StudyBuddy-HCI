import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

// App shell shared by all authenticated pages. Provides a skip link, the top
// navbar, a responsive sidebar (drawer on mobile, fixed on desktop) and the
// routed page content in a semantic <main>.
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-canvas text-content">
      {/* Skip link for keyboard users — first focusable element on the page. */}
      <a href="#main-content" className="sr-only sr-only-focusable">
        Skip to main content
      </a>

      <Navbar onMenuClick={() => setSidebarOpen((o) => !o)} />

      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
