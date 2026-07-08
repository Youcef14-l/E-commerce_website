import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../lib/utils'

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal, count } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const shipping = subtotal > 99 ? 0 : subtotal > 0 ? 12 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="container-wide py-24 lg:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <ShoppingBag size={64} className="mx-auto text-ink-200 mb-6" strokeWidth={1.5} />
          <h1 className="heading-lg mb-4">Your bag is empty.</h1>
          <p className="text-ink-500 mb-8">
            Time to gear up. Browse the catalog and find your next upgrade.
          </p>
          <Link to="/products" className="btn-primary">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container-wide py-10 lg:py-14">
        <h1 className="heading-lg mb-2">Your Bag</h1>
        <p className="text-ink-500 mb-10">{count} {count === 1 ? 'item' : 'items'}</p>

        <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -40 }}
                  className="flex gap-4 lg:gap-6 py-6 border-b border-ink-100"
                >
                  <Link
                    to={`/product/${item.product?.slug}`}
                    className="shrink-0 w-24 h-24 lg:w-32 lg:h-32 overflow-hidden bg-ink-50"
                  >
                    <img
                      src={item.product?.images?.[0]}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                          {item.product?.brand}
                        </p>
                        <Link
                          to={`/product/${item.product?.slug}`}
                          className="font-bold text-base lg:text-lg leading-snug hover:text-accent-600 transition-colors line-clamp-2"
                        >
                          {item.product?.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-ink-400 hover:text-accent-500 transition-colors shrink-0"
                        aria-label="Remove"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center border-2 border-ink-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-ink-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-9 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-ink-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-bold text-lg">
                        {formatPrice((Number(item.product?.price) || 0) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider hover:text-accent-500 transition-colors"
            >
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="bg-ink-50 p-6 lg:p-8">
              <h2 className="font-display text-2xl mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <Row label="Subtotal" value={formatPrice(subtotal)} />
                <Row
                  label="Shipping"
                  value={shipping === 0 ? 'Free' : formatPrice(shipping)}
                  highlight={shipping === 0}
                />
                <Row label="Tax (8%)" value={formatPrice(tax)} />
              </div>
              <div className="border-t border-ink-200 mt-4 pt-4 flex justify-between items-baseline">
                <span className="font-bold text-lg">Total</span>
                <span className="font-display text-2xl">{formatPrice(total)}</span>
              </div>
              {subtotal < 99 && (
                <p className="mt-4 text-xs text-ink-500 bg-white p-3">
                  Add {formatPrice(99 - subtotal)} more for free shipping.
                </p>
              )}
              <button
                onClick={() => navigate(user ? '/checkout' : '/login?redirect=/checkout')}
                className="btn-primary w-full mt-6 text-base py-4"
              >
                {user ? 'Checkout' : 'Sign In to Checkout'}
                <ArrowRight size={18} />
              </button>
              <p className="mt-4 text-xs text-ink-400 text-center">
                Secure checkout · 30-day returns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-600">{label}</span>
      <span className={highlight ? 'font-bold text-emerald-600' : 'font-semibold text-ink-950'}>
        {value}
      </span>
    </div>
  )
}
