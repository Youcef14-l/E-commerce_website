import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ShoppingBag } from 'lucide-react'
import { adminFetchOrders, adminUpdateOrderStatus } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import { formatPrice, formatDate, classNames } from '../../lib/utils'

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const statusColors = {
  pending: 'bg-ink-100 text-ink-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-amber-100 text-amber-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    const data = await adminFetchOrders()
    setOrders(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = orders.filter((o) => {
    if (statusFilter && o.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        o.id.toLowerCase().includes(q) ||
        o.shipping_name?.toLowerCase().includes(q) ||
        o.shipping_email?.toLowerCase().includes(q)
      )
    }
    return true
  })

  const updateStatus = async (orderId, status) => {
    const { error } = await adminUpdateOrderStatus(orderId, status)
    if (error) { toast.error('Could not update status'); return }
    toast.success(`Order marked ${status}`)
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o))
    setSelected((s) => s?.id === orderId ? { ...s, status } : s)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl lg:text-4xl tracking-tight">Orders</h1>
        <p className="text-ink-500 mt-1">{orders.length} total orders</p>
      </div>

      <div className="bg-white p-4 border border-ink-100 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, name, email…"
            className="w-full pl-10 pr-4 py-2.5 bg-ink-50 border border-transparent focus:border-ink-300 outline-none text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-ink-50 border border-transparent focus:border-ink-300 outline-none text-sm cursor-pointer"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-ink-100 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-left text-xs font-bold uppercase tracking-wider text-ink-400 border-b border-ink-100 bg-ink-50">
              <th className="p-4">Order</th>
              <th className="p-4">Date</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-ink-50"><td colSpan={6} className="p-4"><div className="h-8 skeleton" /></td></tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-12 text-center">
                <ShoppingBag size={40} className="mx-auto text-ink-200 mb-3" />
                <p className="text-ink-500">No orders found.</p>
              </td></tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id} className="border-b border-ink-50 hover:bg-ink-50/50 transition-colors">
                  <td className="p-4 font-mono text-xs">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="p-4 text-sm text-ink-600">{formatDate(o.created_at)}</td>
                  <td className="p-4">
                    <p className="text-sm font-semibold">{o.shipping_name || '—'}</p>
                    <p className="text-xs text-ink-500">{o.shipping_email}</p>
                  </td>
                  <td className="p-4 font-bold text-sm">{formatPrice(o.total)}</td>
                  <td className="p-4">
                <span className={classNames('badge capitalize', statusColors[o.status] || statusColors.pending)}>
                  {o.status}
                </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setSelected(o)} className="text-sm font-semibold uppercase tracking-wider text-accent-600 hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order detail drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink-950/50 z-50"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-ink-100 p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl">Order Detail</h3>
                  <p className="font-mono text-xs text-ink-500">#{selected.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <button onClick={() => setSelected(null)}><X size={22} /></button>
              </div>
              <div className="p-5 space-y-6">
                {/* Status */}
                <div>
                  <p className="label-over mb-2">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        className={classNames(
                          'px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all capitalize',
                          selected.status === s
                            ? 'bg-ink-950 text-white'
                            : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer */}
                <div>
                  <p className="label-over mb-2">Customer</p>
                  <div className="bg-ink-50 p-4 text-sm space-y-1">
                    <p className="font-semibold">{selected.shipping_name}</p>
                    <p className="text-ink-600">{selected.shipping_email}</p>
                    <p className="text-ink-600 pt-2">{selected.shipping_address}</p>
                    <p className="text-ink-600">{selected.shipping_city}, {selected.shipping_zip}</p>
                    <p className="text-ink-600">{selected.shipping_country}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="label-over mb-3">Items</p>
                  <div className="space-y-3">
                    {selected.order_items?.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center">
                        <div className="w-12 h-12 bg-ink-50 overflow-hidden shrink-0">
                          {item.image_url && <img src={item.image_url} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{item.name}</p>
                          <p className="text-xs text-ink-500">Qty {item.quantity} × {formatPrice(item.price)}</p>
                        </div>
                        <span className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-ink-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-ink-600">Subtotal</span><span>{formatPrice(selected.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-ink-600">Shipping</span><span>{formatPrice(selected.shipping)}</span></div>
                  <div className="flex justify-between"><span className="text-ink-600">Tax</span><span>{formatPrice(selected.tax)}</span></div>
                  <div className="flex justify-between pt-2 border-t border-ink-100 font-display text-lg"><span>Total</span><span>{formatPrice(selected.total)}</span></div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
