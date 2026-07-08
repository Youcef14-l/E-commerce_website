import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { formatPrice, discountPercent, classNames } from '../lib/utils'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart()
  const { toggle, has } = useWishlist()
  const toast = useToast()
  const wished = has(product.id)
  const img = product.images?.[0] || ''
  const img2 = product.images?.[1] || img
  const discount = discountPercent(product.price, product.compare_at_price)
  const outOfStock = product.stock <= 0

  const quickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock) {
      toast.error('Out of stock')
      return
    }
    addToCart(product, 1)
    toast.success(`${product.name} added to bag`)
  }

  const toggleWish = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(product.id)
    toast.info(wished ? 'Removed from wishlist' : 'Saved to wishlist')
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-ink-50 aspect-[4/5]">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.is_bestseller && (
              <span className="badge bg-ink-950 text-white">Bestseller</span>
            )}
            {discount > 0 && (
              <span className="badge bg-accent-500 text-white">-{discount}%</span>
            )}
            {outOfStock && (
              <span className="badge bg-white text-ink-950 border border-ink-200">Sold out</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={toggleWish}
            className={classNames(
              'absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center transition-all duration-300',
              wished
                ? 'bg-accent-500 text-white'
                : 'bg-white/80 backdrop-blur text-ink-700 opacity-0 group-hover:opacity-100 hover:bg-accent-500 hover:text-white'
            )}
            aria-label="Toggle wishlist"
          >
            <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
          </button>

          {/* Image swap on hover */}
          <div className="absolute inset-0">
            <img
              src={img}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {img2 !== img && (
              <img
                src={img2}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </div>

          {/* Quick add */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
            <button
              onClick={quickAdd}
              disabled={outOfStock}
              className="w-full bg-ink-950 text-white py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent-500 transition-colors disabled:opacity-50"
            >
              <ShoppingBag size={15} /> Quick Add
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="pt-4 pb-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-400">
            {product.brand}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-ink-950 leading-snug line-clamp-2 group-hover:text-accent-600 transition-colors">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star size={13} className="fill-ink-950 text-ink-950" />
              <span className="text-xs font-medium text-ink-600">{product.rating || 'New'}</span>
            </div>
            {product.review_count > 0 && (
              <span className="text-xs text-ink-400">({product.review_count})</span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-ink-950">{formatPrice(product.price)}</span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-sm text-ink-400 line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
