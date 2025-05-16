import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Ticket,
  UserCircle,
  Code,
} from 'lucide-react'
import { useCustomTheme } from '@/components/ui/theme-provider'

const Layout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const pathname = usePathname()
  // We're using the theme provider but don't need to access currentTheme directly
  useCustomTheme()
  
  return (
    <div className="flex w-full min-h-screen bg-background text-primary">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card shadow-md">
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold text-primary tracking-wider">
            SaaSaS<span className="text-secondary">/</span>Projects
          </h1>
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
          <Link href="/development"
            className={`flex items-center p-3 my-1 rounded-md transition-all ${
              pathname === '/development'
                ? 'bg-muted text-primary border border-primary/50 shadow-sm'
                : 'hover:bg-muted hover:text-primary'
            }`}
          >
            <Code className="mr-3 h-5 w-5" />
            <span>Development</span>
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
      {/* Main content */}
      <div className="flex-1 bg-background">
        <div className="w-full h-full min-h-screen">{children}</div>
      </div>
    </div>
  )
}

export default Layout