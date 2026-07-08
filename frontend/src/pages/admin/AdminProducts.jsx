import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Pencil, Trash2, ArrowUpDown, Filter, X, Package } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useToast } from '../../context/ToastContext'
import { formatPrice, classNames } from '../../lib/utils'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sort, setSort] = useState({ key: 'created_at', dir: 'desc' })
  const [deleteId, setDeleteId] = useState(null)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })
    setProducts(data || [])
    const { data: cats } = await supabase.from('categories').select('*').order('name')
    setCategories(cats || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let list = products
    if (search) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (categoryFilter) {
      list = list.filter((p) => p.categories?.name === categoryFilter)
    }
    list = [...list].sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      if (sort.dir === 'asc') return av > bv ? 1 : -1
      return av < bv ? 1 : -1
    })
    return list
  }, [products, search, categoryFilter, sort])

  const toggleSort = (key) => {
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc' }))
  }

  const confirmDelete = async () => {
    const { error } = await supabase.from('products').delete().eq('id', deleteId)
    if (error) {
      toast.error('Could not delete product')
    } else {
      toast.success('Product deleted')
      load()
    }
    setDeleteId(null)
  }

  const stockBadge = (stock) => {
    if (stock <= 0) return <span className="badge bg-red-100 text-red-700">Out</span>
    if (stock < 20) return <span className="badge bg-amber-100 text-amber-700">Low</span>
    return <span className="badge bg-emerald-100 text-emerald-700">In stock</span>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl tracking-tight">Products</h1>
          <p className="text-ink-500 mt-1">{products.length} total products</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {/* Filters bar */}
      <div className="bg-white p-4 border border-ink-100 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or brand…"
            className="w-full pl-10 pr-4 py-2.5 bg-ink-50 border border-transparent focus:border-ink-300 outline-none text-sm transition-colors"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-ink-50 border border-transparent focus:border-ink-300 outline-none text-sm appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-ink-100 overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left text-xs font-bold uppercase tracking-wider text-ink-400 border-b border-ink-100 bg-ink-50">
              <th className="p-4">
                <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-ink-950">
                  Product <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="p-4">Category</th>
              <th className="p-4">
                <button onClick={() => toggleSort('price')} className="flex items-center gap-1 hover:text-ink-950">
                  Price <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-ink-50">
                  <td colSpan={6} className="p-4"><div className="h-8 skeleton" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <Package size={40} className="mx-auto text-ink-200 mb-3" />
                  <p className="text-ink-500">No products found.</p>
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-b border-ink-50 hover:bg-ink-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-ink-100 overflow-hidden shrink-0">
                        <img src={p.images?.[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{p.name}</p>
                        <p className="text-xs text-ink-500">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-ink-600">{p.categories?.name || '—'}</td>
                  <td className="p-4">
                    <span className="font-bold text-sm">{formatPrice(p.price)}</span>
                    {p.compare_at_price && (
                      <span className="block text-xs text-ink-400 line-through">{formatPrice(p.compare_at_price)}</span>
                    )}
                  </td>
                  <td className="p-4 text-sm font-semibold">{p.stock}</td>
                  <td className="p-4">{stockBadge(p.stock)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="w-8 h-8 flex items-center justify-center hover:bg-ink-100 transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink-950/50 z-50 flex items-center justify-center p-6"
              onClick={() => setDeleteId(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-6 max-w-sm w-full"
              >
                <div className="w-12 h-12 bg-red-100 text-red-600 flex items-center justify-center mb-4">
                  <Trash2 size={22} />
                </div>
                <h3 className="font-display text-xl mb-2">Delete product?</h3>
                <p className="text-sm text-ink-500 mb-6">This action cannot be undone. The product will be permanently removed.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
                  <button onClick={confirmDelete} className="btn-accent flex-1">Delete</button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
