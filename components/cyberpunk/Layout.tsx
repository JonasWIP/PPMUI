import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Ticket,
  UserCircle,
} from 'lucide-react'
import { useCustomTheme } from '@/components/ui/theme-provider'

const Layout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const pathname = usePathname()
  // We're using the theme provider but don't need to access currentTheme directly
  useCustomTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  return (
    <div className="flex w-full min-h-screen bg-background text-primary">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 border-r border-border bg-card shadow-md relative z-20">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary tracking-wider">
              SaaSaS<span className="text-secondary">/</span>Projects
            </h1>
            <button
              className="ml-2 p-1 rounded hover:bg-muted transition-colors"
              onClick={() => setSidebarOpen(false)}
              aria-label="Hide sidebar"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          </div>
          <nav className="p-2">
            <Link href="/"
              className={`flex items-center p-3 my-1 rounded-md transition-all ${
                pathname === '/'
                  ? 'bg-muted text-primary border border-primary/50 shadow-sm'
                  : 'hover:bg-muted hover:text-primary'
              }`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/projects"
              className={`flex items-center p-3 my-1 rounded-md transition-all ${
                pathname === '/projects'
                  ? 'bg-muted text-primary border border-primary/50 shadow-sm'
                  : 'hover:bg-muted hover:text-primary'
              }`}
            >
              <FolderKanban className="mr-3 h-5 w-5" />
              <span>Projects</span>
            </Link>
            <Link href="/chat"
              className={`flex items-center p-3 my-1 rounded-md transition-all ${
                pathname === '/chat'
                  ? 'bg-muted text-primary border border-primary/50 shadow-sm'
                  : 'hover:bg-muted hover:text-primary'
              }`}
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              <span>Chat</span>
            </Link>
            <Link href="/tickets"
              className={`flex items-center p-3 my-1 rounded-md transition-all ${
                pathname === '/tickets'
                  ? 'bg-muted text-primary border border-primary/50 shadow-sm'
                  : 'hover:bg-muted hover:text-primary'
              }`}
            >
              <Ticket className="mr-3 h-5 w-5" />
              <span>Tickets</span>
            </Link>
            <div className="mt-auto pt-4 border-t border-border mt-4">
              <Link href="/account"
                className={`flex items-center p-3 my-1 rounded-md transition-all ${
                  pathname === '/account'
                    ? 'bg-muted text-primary border border-primary/50 shadow-sm'
                    : 'hover:bg-muted hover:text-primary'
                }`}
              >
                <UserCircle className="mr-3 h-5 w-5" />
                <span>Account</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
      {/* Sidebar Toggle Button (Floating) */}
      {!sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-30 p-2 bg-card border border-border rounded-full shadow hover:bg-muted transition-colors"
          onClick={() => setSidebarOpen(true)}
          aria-label="Show sidebar"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      )}
      {/* Main content */}
      <div className="flex-1 bg-background">
        <div className="w-full h-full min-h-screen">{children}</div>
      </div>
    </div>
  )
}

export default Layout