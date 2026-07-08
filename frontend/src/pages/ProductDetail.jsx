import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, Heart, Star, Minus, Plus, Truck, ShieldCheck, RotateCcw,
  ChevronRight, Check, ArrowLeft, ArrowRight,
} from 'lucide-react'
import {
  fetchProductBySlug, fetchRelatedProducts, fetchReviews, addReview,
} from '../lib/api'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { formatPrice, discountPercent, classNames, formatDate } from '../lib/utils'
import StarRating from '../components/StarRating'
import ProductCard from '../components/ProductCard'
import { Reveal, StaggerContainer, StaggerItem } from '../components/motion/Reveal'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { toggle, has } = useWishlist()
  const { user } = useAuth()
  const toast = useToast()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [variant, setVariant] = useState(null)
  const [tab, setTab] = useState('specs')
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' })
  const [submitting, setSubmitting] = useState(false)
  const carouselRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setActiveImg(0)
    setQty(1)
    setVariant(null)
    window.scrollTo({ top: 0 })
    Promise.all([
      fetchProductBySlug(slug),
    ]).then(async ([p]) => {
      if (!p) {
        setLoading(false)
        return
      }
      setProduct(p)
      setVariant(p.specs?.Color ? p.specs.Color : null)
      const [rel, revs] = await Promise.all([
        fetchRelatedProducts(p.category_id, p.id, 6),
        fetchReviews(p.id),
      ])
      setRelated(rel)
      setReviews(revs)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="container-wide py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-square skeleton" />
          <div className="space-y-4">
            <div className="h-6 w-24 skeleton" />
            <div className="h-10 w-full skeleton" />
            <div className="h-6 w-32 skeleton" />
            <div className="h-24 w-full skeleton" />
            <div className="h-12 w-full skeleton" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-wide py-32 text-center">
        <h1 className="heading-lg mb-4">Product not found</h1>
        <Link to="/products" className="btn-primary">Back to Shop</Link>
      </div>
    )
  }

  const discount = discountPercent(product.price, product.compare_at_price)
  const outOfStock = product.stock <= 0
  const wished = has(product.id)
  const specsArray = Object.entries(product.specs || {})
  const variantEntry = specsArray.find(([k]) => {
    const lk = k.toLowerCase()
    return lk.includes('color') || lk.includes('layout') || lk.includes('switches')
  })
  const variantOptions =
    variantEntry && typeof variantEntry[1] === 'string'
      ? variantEntry[1].split(',').map((s) => s.trim())
      : []

  const handleAdd = () => {
    if (outOfStock) return
    addToCart(product, qty)
    toast.success(`${qty} × ${product.name} added to bag`)
  }

  const handleBuyNow = () => {
    if (outOfStock) return
    addToCart(product, qty)
    navigate('/cart')
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Sign in to leave a review')
      navigate('/login')
      return
    }
    setSubmitting(true)
    const { data, error } = await addReview({
      product_id: product.id,
      rating: reviewForm.rating,
      title: reviewForm.title,
      body: reviewForm.body,
      author_name: user.email,
    })
    setSubmitting(false)
    if (error) {
      toast.error('Could not submit review')
      return
    }
    setReviews((prev) => [data, ...prev])
    setReviewForm({ rating: 5, title: '', body: '' })
    toast.success('Review posted')
  }

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="container-wide pt-6">
        <nav className="flex items-center gap-2 text-xs text-ink-400">
          <Link to="/" className="hover:text-ink-950">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-ink-950">Shop</Link>
          <ChevronRight size={12} />
          <Link to={`/products?category=${product.categories?.slug}`} className="hover:text-ink-950">
            {product.categories?.name}
          </Link>
          <ChevronRight size={12} />
          <span className="text-ink-950 font-medium truncate">{product.name}</span>
        </nav>
      </div>

      {/* Main */}
      <div className="container-wide py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={classNames(
                    'shrink-0 w-20 h-20 lg:w-24 lg:h-24 overflow-hidden border-2 transition-colors',
                    activeImg === i ? 'border-ink-950' : 'border-transparent hover:border-ink-300'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Main image */}
            <div className="flex-1 relative overflow-hidden bg-ink-50 aspect-square">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={product.images[activeImg]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              {discount > 0 && (
                <span className="absolute top-4 left-4 badge bg-accent-500 text-white">-{discount}%</span>
              )}
              {product.is_bestseller && (
                <span className="absolute top-4 right-4 badge bg-ink-950 text-white">Bestseller</span>
              )}
            </div>
          </div>

          {/* Sticky info */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ink-400 mb-3">
              {product.brand}
            </p>
            <h1 className="font-display text-3xl lg:text-5xl leading-tight tracking-tight mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-6">
              <StarRating value={product.rating} size={18} />
              <span className="text-sm text-ink-600">
                {product.rating || 'New'} · {product.review_count} reviews
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-lg text-ink-400 line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>

            <p className="text-ink-600 leading-relaxed mb-8">{product.description}</p>

            {/* Variant selector */}
            {variantOptions.length > 0 && (
              <div className="mb-8">
                <p className="label-over mb-3">{variantEntry[0]}</p>
                <div className="flex flex-wrap gap-2">
                  {variantOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setVariant(opt)}
                      className={classNames(
                        'px-4 py-2.5 text-sm font-medium border-2 transition-all',
                        variant === opt
                          ? 'border-ink-950 bg-ink-950 text-white'
                          : 'border-ink-200 hover:border-ink-950'
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add */}
            <div className="flex items-stretch gap-3 mb-4">
              <div className="flex items-center border-2 border-ink-200">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-12 h-full flex items-center justify-center hover:bg-ink-50 transition-colors"
                  aria-label="Decrease"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-12 h-full flex items-center justify-center hover:bg-ink-50 transition-colors"
                  aria-label="Increase"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={outOfStock}
                className="btn-primary flex-1 text-base py-4 disabled:opacity-40"
              >
                <ShoppingBag size={18} />
                {outOfStock ? 'Sold Out' : 'Add to Bag'}
              </button>
              <button
                onClick={() => {
                  toggle(product.id)
                  toast.info(wished ? 'Removed from wishlist' : 'Saved to wishlist')
                }}
                className={classNames(
                  'w-14 flex items-center justify-center border-2 transition-all',
                  wished ? 'border-accent-500 bg-accent-500 text-white' : 'border-ink-200 hover:border-ink-950'
                )}
                aria-label="Wishlist"
              >
                <Heart size={20} fill={wished ? 'currentColor' : 'none'} />
              </button>
            </div>

            {!outOfStock && (
              <button onClick={handleBuyNow} className="btn-outline w-full mb-8">
                Buy Now
              </button>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm mb-6">
              {outOfStock ? (
                <span className="text-accent-600 font-semibold">Out of stock</span>
              ) : product.stock < 20 ? (
                <span className="text-accent-600 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-accent-500 rounded-full" />
                  Only {product.stock} left
                </span>
              ) : (
                <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                  <Check size={15} /> In stock
                </span>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 py-6 border-y border-ink-100">
              {[
                { icon: Truck, label: 'Free Shipping' },
                { icon: RotateCcw, label: '30-Day Returns' },
                { icon: ShieldCheck, label: '2-Year Warranty' },
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2">
                  <f.icon size={22} className="text-ink-700" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-600">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Specs / Reviews */}
        <div className="mt-16 lg:mt-24">
          <div className="flex gap-8 border-b border-ink-100 mb-8">
            {[
              { key: 'specs', label: 'Specifications' },
              { key: 'reviews', label: `Reviews (${reviews.length})` },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={classNames(
                  'pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative',
                  tab === t.key ? 'text-ink-950' : 'text-ink-400 hover:text-ink-700'
                )}
              >
                {t.label}
                {tab === t.key && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute -bottom-px left-0 right-0 h-0.5 bg-accent-500"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'specs' ? (
              <motion.div
                key="specs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-3xl"
              >
                <table className="w-full">
                  <tbody>
                    {specsArray.map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? 'bg-ink-50' : ''}>
                        <td className="py-4 px-6 text-sm font-semibold uppercase tracking-wider text-ink-500 w-1/3">
                          {key}
                        </td>
                        <td className="py-4 px-6 text-sm text-ink-950">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div
                key="reviews"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid lg:grid-cols-3 gap-10"
              >
                {/* Review list */}
                <div className="lg:col-span-2 space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-16 bg-ink-50">
                      <p className="font-display text-2xl mb-2">No reviews yet</p>
                      <p className="text-ink-500">Be the first to share your experience.</p>
                    </div>
                  ) : (
                    reviews.map((r) => (
                      <div key={r.id} className="border-b border-ink-100 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-ink-950 text-white flex items-center justify-center font-bold text-sm">
                              {(r.author_name || 'A')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{r.author_name || 'Anonymous'}</p>
                              <p className="text-xs text-ink-400">{formatDate(r.created_at)}</p>
                            </div>
                          </div>
                          <StarRating value={r.rating} size={14} />
                        </div>
                        {r.title && <h4 className="font-bold mb-1">{r.title}</h4>}
                        <p className="text-ink-600 text-sm leading-relaxed">{r.body}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Review form */}
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <h3 className="font-display text-xl mb-4">Write a Review</h3>
                  <form onSubmit={submitReview} className="space-y-4">
                    <div>
                      <p className="label-over mb-2">Rating</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                          >
                            <Star
                              size={24}
                              className={classNames(
                                n <= reviewForm.rating
                                  ? 'text-accent-500 fill-accent-500'
                                  : 'text-ink-200 fill-ink-200'
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Title"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Share your experience…"
                        rows={4}
                        value={reviewForm.body}
                        onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                        className="input-field resize-none"
                      />
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full">
                      {submitting ? 'Posting…' : 'Post Review'}
                    </button>
                    {!user && (
                      <p className="text-xs text-ink-400 text-center">
                        You need to be <Link to="/login" className="underline">signed in</Link> to review.
                      </p>
                    )}
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20 lg:mt-28">
            <div className="flex items-end justify-between mb-10">
              <h2 className="heading-md">You might also like</h2>
              <div className="hidden lg:flex gap-2">
                <button onClick={() => scrollCarousel(-1)} className="w-11 h-11 border-2 border-ink-200 flex items-center justify-center hover:border-ink-950 transition-colors">
                  <ArrowLeft size={18} />
                </button>
                <button onClick={() => scrollCarousel(1)} className="w-11 h-11 border-2 border-ink-200 flex items-center justify-center hover:border-ink-950 transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <div
              ref={carouselRef}
              className="flex gap-4 lg:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
            >
              {related.map((p) => (
                <div key={p.id} className="shrink-0 w-[70%] sm:w-[45%] lg:w-[23%] snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
