import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DollarSign, ShoppingBag, Users, Package, ArrowUpRight, TrendingUp } from 'lucide-react'
import { adminFetchOrders, adminFetchProducts, adminFetchProfiles } from '../../lib/api'
import { formatPrice, formatDate, classNames } from '../../lib/utils'
import { Reveal } from '../../components/motion/Reveal'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, customers: 0, products: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [salesData, setSalesData] = useState([])

  useEffect(() => {
    async function load() {
      const [orders, products, profiles] = await Promise.all([
        adminFetchOrders(),
        adminFetchProducts(),
        adminFetchProfiles(),
      ])

      const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0)
      setStats({
        revenue,
        orders: orders.length,
        customers: profiles.length,
        products: products.length,
      })
      setRecentOrders(orders.slice(0, 6))

      const top = [...products].sort((a, b) => (b.review_count || 0) - (a.review_count || 0)).slice(0, 5)
      setTopProducts(top)

      // Build simple 7-day sales chart data from orders
      const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        return d
      })
      const dayData = days.map((d) => {
        const dayOrders = orders.filter((o) => {
          const od = new Date(o.created_at)
          return od.toDateString() === d.toDateString()
        })
        return {
          label: d.toLocaleDateString('en-US', { weekday: 'short' }),
          value: dayOrders.reduce((s, o) => s + Number(o.total), 0),
          count: dayOrders.length,
        }
      })
      setSalesData(dayData)
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    { label: 'Revenue', value: formatPrice(stats.revenue), icon: DollarSign, change: '+12.5%', color: 'bg-ink-950' },
    { label: 'Orders', value: stats.orders, icon: ShoppingBag, change: '+8.2%', color: 'bg-accent-500' },
    { label: 'Customers', value: stats.customers, icon: Users, change: '+5.1%', color: 'bg-electric-500' },
    { label: 'Products', value: stats.products, icon: Package, change: '0%', color: 'bg-ink-800' },
  ]

  const maxSale = Math.max(...salesData.map((d) => d.value), 1)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl tracking-tight">Dashboard</h1>
        <p className="text-ink-500 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="bg-white p-5 lg:p-6 border border-ink-100">
              <div className="flex items-start justify-between mb-4">
                <div className={classNames('w-10 h-10 flex items-center justify-center text-white', s.color)}>
                  <s.icon size={20} />
                </div>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <TrendingUp size={12} /> {s.change}
                </span>
              </div>
              <p className="text-2xl lg:text-3xl font-display tracking-tight">{loading ? '—' : s.value}</p>
              <p className="text-xs text-ink-500 uppercase tracking-wider font-semibold mt-1">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales chart */}
        <div className="lg:col-span-2 bg-white p-6 border border-ink-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl">Sales — Last 7 Days</h2>
            <span className="text-sm text-ink-500">{formatPrice(salesData.reduce((s, d) => s + d.value, 0))} total</span>
          </div>
          <div className="flex items-end justify-between gap-2 lg:gap-4 h-48">
            {salesData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.value / maxSale) * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                    className="w-full bg-ink-950 hover:bg-accent-500 transition-colors min-h-[2px] relative group"
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatPrice(d.value)}
                    </span>
                  </motion.div>
                </div>
                <span className="text-xs text-ink-500 font-semibold">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white p-6 border border-ink-100">
          <h2 className="font-display text-xl mb-5">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <Link key={p.id} to={`/admin/products`} className="flex items-center gap-3 group">
                <span className="font-display text-lg text-ink-300 w-6">{i + 1}</span>
                <div className="w-10 h-10 bg-ink-50 overflow-hidden shrink-0">
                  <img src={p.images?.[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate group-hover:text-accent-600 transition-colors">{p.name}</p>
                  <p className="text-xs text-ink-500">{p.review_count} reviews</p>
                </div>
                <ArrowUpRight size={14} className="text-ink-300 group-hover:text-accent-500 transition-colors" />
              </Link>
            ))}
            {topProducts.length === 0 && <p className="text-sm text-ink-400">No data yet.</p>}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white p-6 border border-ink-100 mt-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm font-semibold uppercase tracking-wider text-accent-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-ink-400 border-b border-ink-100">
                <th className="pb-3 pr-4">Order</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-ink-400">No orders yet.</td></tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-ink-50 text-sm">
                    <td className="py-3 pr-4 font-mono text-xs">#{o.id.slice(0, 8).toUpperCase()}</td>
                    <td className="py-3 pr-4 text-ink-600">{formatDate(o.created_at)}</td>
                    <td className="py-3 pr-4 text-ink-600 truncate max-w-[160px]">{o.shipping_email || '—'}</td>
                    <td className="py-3 pr-4 font-bold">{formatPrice(o.total)}</td>
                    <td className="py-3">
                      <span className="badge bg-ink-100 text-ink-700">{o.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
