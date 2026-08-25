import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Mail, Calendar, ShoppingBag, DollarSign, Users } from 'lucide-react'
import { adminFetchProfiles, adminFetchAllOrders } from '../../lib/api'
import { formatPrice, formatDate, classNames } from '../../lib/utils'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function load() {
      const [profiles, orderRows] = await Promise.all([
        adminFetchProfiles(),
        adminFetchAllOrders(),
      ])
      const orderMap = {}
      orderRows.forEach((o) => {
        if (!orderMap[o.user_id]) orderMap[o.user_id] = []
        orderMap[o.user_id].push(o)
      })
      setOrders(orderMap)
      setCustomers(profiles)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = customers.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return c.email?.toLowerCase().includes(q) || c.full_name?.toLowerCase().includes(q)
  })

  const customerStats = (id) => {
    const list = orders[id] || []
    return {
      count: list.length,
      total: list.reduce((s, o) => s + Number(o.total), 0),
      orders: list,
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl lg:text-4xl tracking-tight">Customers</h1>
        <p className="text-ink-500 mt-1">{customers.length} registered customers</p>
      </div>

      <div className="bg-white p-4 border border-ink-100 mb-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-10 pr-4 py-2.5 bg-ink-50 border border-transparent focus:border-ink-300 outline-none text-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-ink-100 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left text-xs font-bold uppercase tracking-wider text-ink-400 border-b border-ink-100 bg-ink-50">
              <th className="p-4">Customer</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Role</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Spent</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-ink-50"><td colSpan={6} className="p-4"><div className="h-8 skeleton" /></td></tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-12 text-center">
                <Users size={40} className="mx-auto text-ink-200 mb-3" />
                <p className="text-ink-500">No customers found.</p>
              </td></tr>
            ) : (
              filtered.map((c) => {
                const stats = customerStats(c.id)
                return (
                  <tr key={c.id} className="border-b border-ink-50 hover:bg-ink-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-ink-950 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {(c.full_name || c.email || 'U')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm">{c.full_name || 'Member'}</p>
                          <p className="text-xs text-ink-500 truncate">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-ink-600">{formatDate(c.created_at)}</td>
                    <td className="p-4">
                      <span className={classNames(
                        'badge capitalize',
                        c.role === 'admin' ? 'bg-accent-100 text-accent-700' : 'bg-ink-100 text-ink-700'
                      )}>
                        {c.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-semibold">{stats.count}</td>
                    <td className="p-4 text-sm font-bold">{formatPrice(stats.total)}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => setSelected({ ...c, ...stats })} className="text-sm font-semibold uppercase tracking-wider text-accent-600 hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Customer detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink-950/50 z-50 flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-lg w-full max-h-[85vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-ink-950 text-white flex items-center justify-center font-display text-xl">
                      {(selected.full_name || selected.email || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-display text-xl">{selected.full_name || 'Member'}</h3>
                      <p className="text-sm text-ink-500 flex items-center gap-1.5"><Mail size={13} /> {selected.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)}><X size={20} /></button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <Stat icon={ShoppingBag} label="Orders" value={selected.count} />
                  <Stat icon={DollarSign} label="Spent" value={formatPrice(selected.total)} />
                  <Stat icon={Calendar} label="Joined" value={formatDate(selected.created_at)} />
                </div>

                <div>
                  <p className="label-over mb-3">Order History</p>
                  {selected.orders?.length === 0 ? (
                    <p className="text-sm text-ink-400 py-4 text-center bg-ink-50">No orders yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {selected.orders?.map((o) => (
                        <div key={o.id} className="flex items-center justify-between p-3 bg-ink-50 text-sm">
                          <div>
                            <p className="font-mono text-xs">#{o.id.slice(0, 8).toUpperCase()}</p>
                            <p className="text-xs text-ink-500">{formatDate(o.created_at)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="badge bg-white text-ink-700 capitalize">{o.status}</span>
                            <span className="font-bold">{formatPrice(o.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="bg-ink-50 p-3 text-center">
      <Icon size={18} className="mx-auto text-ink-400 mb-1.5" />
      <p className="font-display text-lg leading-none">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold mt-1">{label}</p>
    </div>
  )
}
