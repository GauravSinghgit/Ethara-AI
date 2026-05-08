import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FolderKanban, CheckSquare, LogOut,
  Menu, X, ChevronRight, Zap
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
]

export default function AppLayout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-ink-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-glow rounded-lg flex items-center justify-center glow-dot">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-display font-700 text-lg text-ink-50 tracking-tight">TaskFlow</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-glow/10 text-glow border border-glow/20'
                  : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800'
              }`
            }
          >
            <Icon size={16} />
            {label}
            <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-ink-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-ink-800/50 mb-2">
          <div className="w-7 h-7 rounded-full bg-glow/20 border border-glow/30 flex items-center justify-center text-xs font-medium text-glow">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-ink-200 truncate">{user?.name}</p>
            <p className="text-xs text-ink-500 capitalize">{user?.role}</p>
          </div>
          {isAdmin && (
            <span className="text-[10px] bg-glow/20 text-glow border border-glow/30 px-1.5 py-0.5 rounded font-medium">
              Admin
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ink-500 hover:text-red-400 hover:bg-red-900/10 transition-all duration-150"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ink-950 grid-bg flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-col bg-ink-950 border-r border-ink-800 fixed h-full z-20">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 bg-ink-950 border-r border-ink-800 z-40">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-ink-800 bg-ink-950">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-glow rounded-md flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="font-display font-700 text-base text-ink-50">TaskFlow</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-ink-400 hover:text-ink-200 p-1">
            <Menu size={20} />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
