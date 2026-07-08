import { useEffect, useState, useCallback, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, ChevronDown, Check, Home } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeletons'
import { fetchProducts, fetchCategories, fetchBrands } from '../lib/api'
import { classNames } from '../lib/utils'

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'A–Z' },
]

const PER_PAGE = 12

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortOpen, setSortOpen] = useState(false)
  const [mobileFilters, setMobileFilters] = useState(false)

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'newest'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const selectedBrands = searchParams.get('brands')?.split(',').filter(Boolean) || []

  useEffect(() => {
    fetchCategories().then(setCategories)
    fetchBrands().then(setBrands)
  }, [])

  const doFetch = useCallback(async () => {
    setLoading(true)
    const { data, total: t } = await fetchProducts({
      category: category || null,
      search: search || null,
      brand: selectedBrands.length ? selectedBrands : null,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      sort,
      page,
      perPage: PER_PAGE,
    })
    setProducts(data)
    setTotal(t)
    setLoading(false)
  }, [category, search, sort, page, minPrice, maxPrice, selectedBrands])

  useEffect(() => {
    doFetch()
  }, [doFetch])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setSearchParams(next)
  }

  const toggleBrand = (brand) => {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand]
    updateParam('brands', next.join(','))
  }

  const clearAll = () => setSearchParams({})

  const totalPages = Math.ceil(total / PER_PAGE)
  const activeCat = categories.find((c) => c.slug === category)

  const activeFilters = [
    category && { key: 'category', label: activeCat?.name || category },
    search && { key: 'search', label: `"${search}"` },
    minPrice && { key: 'minPrice', label: `Min $${minPrice}` },
    maxPrice && { key: 'maxPrice', label: `Max $${maxPrice}` },
    ...selectedBrands.map((b) => ({ key: 'brands', label: b, brand: b })),
  ].filter(Boolean)

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-ink-100 bg-ink-50">
        <div className="container-wide py-10 lg:py-14">
          <nav className="flex items-center gap-2 text-xs text-ink-400 mb-4">
            <Link to="/" className="hover:text-ink-950 flex items-center gap-1"><Home size={12} /> Home</Link>
            <span>/</span>
            <span className="text-ink-950 font-medium">Shop</span>
            {activeCat && (
              <>
                <span>/</span>
                <span className="text-ink-950 font-medium">{activeCat.name}</span>
              </>
            )}
          </nav>
          <h1 className="heading-lg">
            {activeCat ? activeCat.name : search ? `Results for "${search}"` : 'All Products'}
          </h1>
          <p className="mt-3 text-ink-500">
            {loading ? 'Loading…' : `${total} ${total === 1 ? 'product' : 'products'}`}
          </p>
        </div>
      </div>

      <div className="container-wide py-8 lg:py-12">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <button
            onClick={() => setMobileFilters(true)}
            className="lg:hidden inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider border border-ink-200 px-4 py-2.5"
          >
            <SlidersHorizontal size={16} /> Filters
            {activeFilters.length > 0 && (
              <span className="bg-accent-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {activeFilters.length}
              </span>
            )}
          </button>

          <div className="hidden lg:flex items-center gap-3 flex-wrap">
            {activeFilters.length > 0 && (
              <>
                {activeFilters.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (f.brand) toggleBrand(f.brand)
                      else updateParam(f.key, '')
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-ink-100 px-3 py-1.5 hover:bg-ink-200 transition-colors"
                  >
                    {f.label} <X size={12} />
                  </button>
                ))}
                <button onClick={clearAll} className="text-xs font-semibold uppercase tracking-wider text-accent-600 hover:underline">
                  Clear all
                </button>
              </>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((s) => !s)}
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider border border-ink-200 px-4 py-2.5 hover:border-ink-950 transition-colors"
            >
              Sort: {sortOptions.find((o) => o.value === sort)?.label}
              <ChevronDown size={16} className={classNames('transition-transform', sortOpen && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-2 z-20 bg-white border border-ink-100 shadow-xl w-56 py-2"
                  >
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          updateParam('sort', opt.value)
                          setSortOpen(false)
                        }}
                        className="flex items-center justify-between w-full px-4 py-2.5 text-sm hover:bg-ink-50 transition-colors text-left"
                      >
                        {opt.label}
                        {sort === opt.value && <Check size={15} className="text-accent-500" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterPanel
              categories={categories}
              brands={brands}
              category={category}
              selectedBrands={selectedBrands}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onCategory={(v) => updateParam('category', v)}
              onBrand={toggleBrand}
              onPrice={(key, v) => updateParam(key, v)}
              onClear={clearAll}
            />
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display text-4xl text-ink-200 mb-4">No matches.</p>
                <p className="text-ink-500 mb-6">Try adjusting your filters.</p>
                <button onClick={clearAll} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12"
              >
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="mt-14 flex items-center justify-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => updateParam('page', String(page - 1))}
                  className="px-4 py-2.5 text-sm font-semibold border border-ink-200 disabled:opacity-30 hover:border-ink-950 transition-colors"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).slice(0, 6).map((_, i) => {
                  const p = i + 1
                  return (
                    <button
                      key={p}
                      onClick={() => updateParam('page', String(p))}
                      className={classNames(
                        'w-10 h-10 text-sm font-semibold border transition-colors',
                        p === page
                          ? 'bg-ink-950 text-white border-ink-950'
                          : 'border-ink-200 hover:border-ink-950'
                      )}
                    >
                      {p}
                    </button>
                  )
                })}
                <button
                  disabled={page >= totalPages}
                  onClick={() => updateParam('page', String(page + 1))}
                  className="px-4 py-2.5 text-sm font-semibold border border-ink-200 disabled:opacity-30 hover:border-ink-950 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink-950/40 z-50 lg:hidden"
              onClick={() => setMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between h-16 px-5 border-b border-ink-100 sticky top-0 bg-white">
                <h3 className="font-display text-xl">Filters</h3>
                <button onClick={() => setMobileFilters(false)}><X size={24} /></button>
              </div>
              <div className="p-5">
                <FilterPanel
                  categories={categories}
                  brands={brands}
                  category={category}
                  selectedBrands={selectedBrands}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onCategory={(v) => updateParam('category', v)}
                  onBrand={toggleBrand}
                  onPrice={(key, v) => updateParam(key, v)}
                  onClear={clearAll}
                />
              </div>
              <div className="p-5 sticky bottom-0 bg-white border-t border-ink-100">
                <button onClick={() => setMobileFilters(false)} className="btn-primary w-full">
                  Show {total} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterPanel({ categories, brands, category, selectedBrands, minPrice, maxPrice, onCategory, onBrand, onPrice, onClear }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg">Filters</h3>
        <button onClick={onClear} className="text-xs font-semibold uppercase tracking-wider text-accent-600 hover:underline">
          Clear
        </button>
      </div>

      {/* Category */}
      <div>
        <h4 className="label-over mb-4">Category</h4>
        <div className="space-y-2.5">
          <button
            onClick={() => onCategory('')}
            className={classNames(
              'block text-sm w-full text-left py-1 transition-colors',
              !category ? 'font-bold text-ink-950' : 'text-ink-600 hover:text-ink-950'
            )}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onCategory(c.slug)}
              className={classNames(
                'block text-sm w-full text-left py-1 transition-colors',
                category === c.slug ? 'font-bold text-ink-950' : 'text-ink-600 hover:text-ink-950'
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="label-over mb-4">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice || ''}
            onChange={(e) => onPrice('minPrice', e.target.value)}
            className="w-full border border-ink-200 px-3 py-2 text-sm focus:border-ink-950 outline-none"
          />
          <span className="text-ink-400">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice || ''}
            onChange={(e) => onPrice('maxPrice', e.target.value)}
            className="w-full border border-ink-200 px-3 py-2 text-sm focus:border-ink-950 outline-none"
          />
        </div>
      </div>

      {/* Brand */}
      <div>
        <h4 className="label-over mb-4">Brand</h4>
        <div className="space-y-2.5">
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-3 cursor-pointer group">
              <span
                className={classNames(
                  'w-4 h-4 border flex items-center justify-center transition-colors',
                  selectedBrands.includes(b)
                    ? 'bg-ink-950 border-ink-950'
                    : 'border-ink-300 group-hover:border-ink-950'
                )}
              >
                {selectedBrands.includes(b) && <Check size={12} className="text-white" />}
              </span>
              <input
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() => onBrand(b)}
                className="sr-only"
              />
              <span className="text-sm text-ink-700 group-hover:text-ink-950">{b}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
