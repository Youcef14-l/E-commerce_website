import { Link } from 'react-router-dom'
import { AtSign, Send, Globe, Gamepad2 } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '../context/ToastContext'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [sub, setSub] = useState(false)
  const toast = useToast()

  const subscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    // store in a lightweight table-less approach: just simulate success
    setSub(true)
    toast.success('You are on the list. Welcome to VOLT.')
    setEmail('')
    setTimeout(() => setSub(false), 3000)
  }

  return (
    <footer className="bg-ink-950 text-white">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="container-wide py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="label-over text-white/50 mb-4">Join the squad</p>
            <h2 className="heading-md text-white max-w-md">
              Get early drops, deals, and performance tips.
            </h2>
          </div>
          <form onSubmit={subscribe} className="w-full">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent border-b-2 border-white/30 py-4 px-0 text-white placeholder-white/40 focus:border-accent-500 outline-none transition-colors text-lg"
              />
              <button type="submit" className="btn-accent shrink-0">
                {sub ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>
            <p className="text-xs text-white/40 mt-3">
              By subscribing you agree to our privacy policy.
            </p>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="container-wide py-14 grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="col-span-2 lg:col-span-1">
          <Link to="/" className="font-display text-3xl tracking-tighter">
            VOLT<span className="text-accent-500">.</span>
          </Link>
          <p className="text-sm text-white/60 mt-4 max-w-xs">
            Premium computer parts, PC accessories, and peripherals. Built for performance.
          </p>
          <div className="flex gap-3 mt-6">
            {[AtSign, Send, Globe, Gamepad2].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 flex items-center justify-center border border-white/20 hover:bg-accent-500 hover:border-accent-500 transition-colors"
                aria-label="Social link"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Shop" links={[
          { label: 'All Products', to: '/products' },
          { label: 'Graphics Cards', to: '/products?category=graphics-cards' },
          { label: 'Keyboards', to: '/products?category=keyboards' },
          { label: 'Laptops', to: '/products?category=laptops' },
          { label: 'Storage', to: '/products?category=storage' },
        ]} />
        <FooterCol title="Company" links={[
          { label: 'About VOLT', to: '/' },
          { label: 'Careers', to: '/' },
          { label: 'Press', to: '/' },
          { label: 'Sustainability', to: '/' },
        ]} />
        <FooterCol title="Support" links={[
          { label: 'Help Center', to: '/' },
          { label: 'Shipping', to: '/' },
          { label: 'Returns', to: '/' },
          { label: 'Warranty', to: '/' },
          { label: 'Track Order', to: '/profile?tab=orders' },
        ]} />
        <FooterCol title="Account" links={[
          { label: 'Sign In', to: '/login' },
          { label: 'My Profile', to: '/profile' },
          { label: 'Wishlist', to: '/profile?tab=wishlist' },
          { label: 'Cart', to: '/cart' },
        ]} />
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {new Date().getFullYear()} VOLT Technologies. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-4">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="text-sm text-white/80 hover:text-accent-500 transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
