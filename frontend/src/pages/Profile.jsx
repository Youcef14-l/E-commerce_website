import { useEffect, useState } from 'react'
import { Link, useSearchParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Settings, MapPin, Heart, LogOut, Plus, Trash2, Check, ArrowRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { supabase } from '../lib/supabaseClient'
import { fetchProductsByIds } from '../lib/api'
import { formatPrice, formatDate, classNames } from '../lib/utils'
import ProductCard from '../components/ProductCard'

const tabs = [
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'addresses', label: 'Addresses', icon: MapPin },
  { key: 'wishlist', label: 'Wishlist', icon: Heart },
]

export default function Profile() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const { ids, toggle } = useWishlist()
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'orders'

  if (!user) return <Navigate to="/login?redirect=/profile" replace />

  const setTab = (key) => setSearchParams({ tab: key })

  return (
    <div className="bg-white min-h-screen">
      <div className="container-wide py-10 lg:py-14">
        {/* Header */}
        <div className="mb-10">
          <p className="label-over mb-2">My Account</p>
          <h1 className="heading-lg">Hello, {profile?.full_name || user.email?.split('@')[0]}.</h1>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28">
              <div className="bg-ink-50 p-5 mb-4">
                <div className="w-12 h-12 bg-ink-950 text-white flex items-center justify-center font-display text-xl mb-3">
                  {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
                <p className="font-bold text-sm">{profile?.full_name || 'Member'}</p>
                <p className="text-xs text-ink-500 truncate">{user.email}</p>
              </div>
              <nav className="space-y-1">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={classNames(
                      'w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors text-left',
                      activeTab === t.key
                        ? 'bg-ink-950 text-white'
                        : 'text-ink-600 hover:bg-ink-50'
                    )}
                  >
                    <t.icon size={18} /> {t.label}
                    {t.key === 'wishlist' && ids.length > 0 && (
                      <span className="ml-auto bg-accent-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                        {ids.length}
                      </span>
                    )}
                  </button>
                ))}
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-accent-600 hover:bg-accent-50 transition-colors text-left"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'orders' && <OrdersTab userId={user.id} />}
                {activeTab === 'settings' && <SettingsTab user={user} profile={profile} refreshProfile={refreshProfile} />}
                {activeTab === 'addresses' && <AddressesTab userId={user.id} />}
                {activeTab === 'wishlist' && <WishlistTab ids={ids} toggle={toggle} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrdersTab({ userId }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data || [])
        setLoading(false)
      })
  }, [userId])

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 skeleton" />)}</div>
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        sub="Your purchases will show up here."
        cta={{ label: 'Start Shopping', to: '/products' }}
      />
    )
  }

  const statusColors = {
    pending: 'bg-ink-100 text-ink-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-amber-100 text-amber-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Order History</h2>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="border border-ink-100">
            <button
              onClick={() => setExpanded(expanded === o.id ? null : o.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-ink-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-ink-950 text-white flex items-center justify-center font-mono text-xs">
                  #{o.id.slice(0, 4).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-sm">{formatDate(o.created_at)}</p>
                  <p className="text-xs text-ink-500">{o.order_items?.length || 0} items · {formatPrice(o.total)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={classNames('badge', statusColors[o.status] || statusColors.pending)}>
                  {o.status}
                </span>
              </div>
            </button>
            <AnimatePresence>
              {expanded === o.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-ink-100"
                >
                  <div className="p-5 space-y-3">
                    {o.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-ink-50 overflow-hidden shrink-0">
                          {item.image_url && <img src={item.image_url} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-ink-500">Qty {item.quantity} · {formatPrice(item.price)}</p>
                        </div>
                        <span className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-ink-100 flex justify-between text-sm">
                      <span className="text-ink-500">Shipping to: {o.shipping_address}, {o.shipping_city}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab({ user, profile, refreshProfile }) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone })
      .eq('id', user.id)
    setSaving(false)
    if (error) {
      toast.error('Could not save settings')
      return
    }
    refreshProfile()
    toast.success('Settings updated')
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Account Settings</h2>
      <form onSubmit={save} className="max-w-lg space-y-6">
        <div>
          <label className="label-over mb-2 block">Email</label>
          <input
            type="email"
            value={user.email || ''}
            disabled
            className="w-full bg-ink-50 border-2 border-ink-100 px-4 py-3 text-sm text-ink-500"
          />
        </div>
        <div>
          <label className="label-over mb-2 block">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border-2 border-ink-200 px-4 py-3 text-sm focus:border-ink-950 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="label-over mb-2 block">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full border-2 border-ink-200 px-4 py-3 text-sm focus:border-ink-950 outline-none transition-colors"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

function AddressesTab({ userId }) {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ label: 'Home', full_name: '', address: '', city: '', zip: '', country: 'United States', phone: '' })
  const toast = useToast()

  const load = () => {
    supabase.from('addresses').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      .then(({ data }) => {
        setAddresses(data || [])
        setLoading(false)
      })
  }

  useEffect(load, [userId])

  const add = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('addresses').insert({ user_id: userId, ...form })
    if (error) {
      toast.error('Could not add address')
      return
    }
    toast.success('Address added')
    setAdding(false)
    setForm({ label: 'Home', full_name: '', address: '', city: '', zip: '', country: 'United States', phone: '' })
    load()
  }

  const remove = async (id) => {
    await supabase.from('addresses').delete().eq('id', id)
    load()
    toast.info('Address removed')
  }

  if (loading) return <div className="space-y-4">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-32 skeleton" />)}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl">Saved Addresses</h2>
        <button onClick={() => setAdding(true)} className="btn-outline py-2.5">
          <Plus size={16} /> Add New
        </button>
      </div>

      {adding && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={add}
          className="border-2 border-ink-200 p-6 mb-6 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Label" value={form.label} onChange={(v) => setForm({ ...form, label: v })} />
            <Field label="Full Name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
            <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} className="sm:col-span-2" />
            <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
            <Field label="ZIP" value={form.zip} onChange={(v) => setForm({ ...form, zip: v })} />
            <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">Save Address</button>
            <button type="button" onClick={() => setAdding(false)} className="btn-outline">Cancel</button>
          </div>
        </motion.form>
      )}

      {addresses.length === 0 && !adding ? (
        <EmptyState title="No saved addresses" sub="Add an address for faster checkout." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div key={a.id} className="border border-ink-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="badge bg-ink-950 text-white">{a.label}</span>
                <button onClick={() => remove(a.id)} className="text-ink-400 hover:text-accent-500">
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="font-bold text-sm">{a.full_name}</p>
              <p className="text-sm text-ink-600 mt-1">{a.address}</p>
              <p className="text-sm text-ink-600">{a.city}, {a.zip}</p>
              <p className="text-sm text-ink-600">{a.country}</p>
              {a.phone && <p className="text-sm text-ink-500 mt-2">{a.phone}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function WishlistTab({ ids, toggle }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    fetchProductsByIds(ids).then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [ids])

  if (loading) return <div className="grid grid-cols-2 md:grid-cols-3 gap-6">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-[4/5] skeleton" />)}</div>

  if (products.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        sub="Tap the heart on any product to save it here."
        cta={{ label: 'Discover Products', to: '/products' }}
      />
    )
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Wishlist</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}

function EmptyState({ title, sub, cta }) {
  return (
    <div className="text-center py-16 bg-ink-50">
      <p className="font-display text-2xl mb-2">{title}</p>
      <p className="text-ink-500 mb-6">{sub}</p>
      {cta && (
        <Link to={cta.to} className="btn-primary">
          {cta.label} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  )
}

function Field({ label, value, onChange, className = '' }) {
  return (
    <div className={className}>
      <label className="label-over mb-2 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 border-ink-200 px-4 py-3 text-sm focus:border-ink-950 outline-none transition-colors"
      />
    </div>
  )
}
