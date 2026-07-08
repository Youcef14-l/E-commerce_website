import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, Search, User, Heart, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { classNames } from '../lib/utils'

const navLinks = [
  { label: 'Shop All', to: '/products' },
  { label: 'Keyboards', to: '/products?category=keyboards' },
  { label: 'GPUs', to: '/products?category=graphics-cards' },
  { label: 'Mice', to: '/products?category=mice' },
  { label: 'Laptops', to: '/products?category=laptops' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { count } = useCart()
  const { ids: wishIds } = useWishlist()
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const submitSearch = (e) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`)
      setSearchOpen(false)
      setSearchValue('')
    }
  }

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink-950 text-white text-center text-[11px] font-semibold uppercase tracking-[0.2em] py-2.5">
        Free express shipping on orders over $99 — Built for Performance
      </div>

      <header
        className={classNames(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-white'
        )}
      >
        <nav className="container-wide flex items-center justify-between h-16 lg:h-20">
          {/* Left: mobile menu + logo */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-1 -ml-1"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="font-display text-2xl lg:text-3xl tracking-tighter">
              VOLT
              <span className="text-accent-500">.</span>
            </Link>
          </div>

          {/* Center: nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  classNames(
                    'relative text-sm font-semibold uppercase tracking-wider transition-colors group',
                    isActive ? 'text-ink-950' : 'text-ink-600 hover:text-ink-950'
                  )
                }
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-500 transition-all duration-300 group-hover:w-full" />
              </NavLink>
            ))}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="p-2 hover:bg-ink-100 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link
              to="/profile?tab=wishlist"
              className="p-2 hover:bg-ink-100 transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {wishIds.length}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="p-2 hover:bg-ink-100 transition-colors" aria-label="Account">
                  <User size={20} />
                </button>
                <div className="absolute right-0 top-full pt-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                  <div className="bg-white border border-ink-100 shadow-xl w-52 py-2">
                    <div className="px-4 py-2 border-b border-ink-100">
                      <p className="text-xs text-ink-500 uppercase tracking-wider">Signed in</p>
                      <p className="text-sm font-semibold truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-ink-50 transition-colors">
                      <User size={16} /> My Account
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-ink-50 transition-colors">
                        <LayoutDashboard size={16} /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-ink-50 transition-colors w-full text-left text-accent-600"
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-ink-100 transition-colors" aria-label="Login">
                <User size={20} />
              </Link>
            )}
            <Link
              to="/cart"
              className="p-2 hover:bg-ink-100 transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {/* Search bar dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-ink-100 bg-white"
            >
              <form onSubmit={submitSearch} className="container-wide py-5 flex items-center gap-4">
                <Search size={22} className="text-ink-400" />
                <input
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search for GPUs, keyboards, laptops…"
                  className="flex-1 bg-transparent outline-none text-lg font-medium placeholder-ink-300"
                />
                <button type="submit" className="btn-primary">Search</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink-950/40 z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between h-16 px-5 border-b border-ink-100">
                <span className="font-display text-2xl">VOLT<span className="text-accent-500">.</span></span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      classNames(
                        'block px-5 py-3.5 text-base font-semibold uppercase tracking-wider border-b border-ink-50',
                        isActive ? 'text-accent-500' : 'text-ink-800'
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
              <div className="p-5 border-t border-ink-100 space-y-3">
                {user ? (
                  <>
                    <Link to="/profile" className="btn-outline w-full">My Account</Link>
                    {isAdmin && <Link to="/admin" className="btn-primary w-full">Admin Panel</Link>}
                    <button onClick={() => signOut()} className="btn-outline w-full text-accent-600 border-accent-500">Sign out</button>
                  </>
                ) : (
                  <Link to="/login" className="btn-primary w-full">Sign In</Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
