import { NavLink, Outlet, Link, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Plus,
  Home, Menu, X, LogOut, ExternalLink,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { classNames } from '../../lib/utils'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/products/new', label: 'Add Product', icon: Plus },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: Users },
]

export default function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse font-display text-2xl">VOLT Admin</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login?redirect=/admin" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-ink-950 text-white sticky top-0 h-screen">
        <AdminSidebarContent signOut={() => { signOut(); navigate('/') }} />
      </aside>

      {/* Sidebar — mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink-950/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-ink-950 text-white z-50 lg:hidden flex flex-col"
            >
              <AdminSidebarContent signOut={() => { signOut(); navigate('/') }} onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b border-ink-100 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1">
              <Menu size={22} />
            </button>
            <span className="font-display text-lg tracking-tight">VOLT Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm font-semibold uppercase tracking-wider text-ink-500 hover:text-ink-950 transition-colors flex items-center gap-1.5">
              <ExternalLink size={14} /> View Store
            </Link>
            <div className="w-8 h-8 bg-ink-950 text-white flex items-center justify-center font-bold text-sm">
              {(user.email || 'A')[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function AdminSidebarContent({ signOut, onClose }) {
  return (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
        <Link to="/admin" className="font-display text-xl tracking-tighter">
          VOLT<span className="text-accent-500">.</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={onClose}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded',
                isActive
                  ? 'bg-accent-500 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )
            }
          >
            <l.icon size={18} /> {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors rounded">
          <Home size={18} /> Storefront
        </Link>
        <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors rounded w-full text-left">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  )
}
