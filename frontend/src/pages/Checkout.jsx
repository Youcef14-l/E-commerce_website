import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, ArrowLeft, CreditCard, Truck, ShoppingBag, Lock } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { supabase } from '../lib/supabaseClient'
import { formatPrice } from '../lib/utils'

const steps = [
  { key: 'cart', label: 'Cart', icon: ShoppingBag },
  { key: 'shipping', label: 'Shipping', icon: Truck },
  { key: 'payment', label: 'Payment', icon: CreditCard },
]

export default function Checkout() {
  const { user } = useAuth()
  const { items, subtotal, clearCart } = useCart()
  const toast = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 0=cart, 1=shipping, 2=payment
  const [shipping, setShipping] = useState({
    name: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
    country: 'United States',
  })
  const [payment, setPayment] = useState({
    card: '',
    name: '',
    expiry: '',
    cvc: '',
  })
  const [placing, setPlacing] = useState(false)
  const [order, setOrder] = useState(null)

  if (!user) return <Navigate to="/login?redirect=/checkout" replace />
  if (items.length === 0 && !order) return <Navigate to="/cart" replace />

  const shippingCost = subtotal > 99 ? 0 : 12
  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  const next = () => setStep((s) => Math.min(2, s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))

  const canProceed = () => {
    if (step === 1) {
      return shipping.name && shipping.email && shipping.address && shipping.city && shipping.zip
    }
    if (step === 2) {
      return payment.card && payment.name && payment.expiry && payment.cvc
    }
    return true
  }

  const placeOrder = async () => {
    setPlacing(true)
    const { data: orderRow, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'processing',
        total,
        subtotal,
        shipping: shippingCost,
        tax,
        shipping_name: shipping.name,
        shipping_email: shipping.email,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_zip: shipping.zip,
        shipping_country: shipping.country,
      })
      .select()
      .maybeSingle()

    if (error || !orderRow) {
      setPlacing(false)
      toast.error('Could not place order. Try again.')
      return
    }

    const orderItems = items.map((i) => ({
      order_id: orderRow.id,
      product_id: i.id,
      name: i.product?.name,
      price: i.product?.price,
      quantity: i.quantity,
      image_url: i.product?.images?.[0],
    }))
    await supabase.from('order_items').insert(orderItems)

    await clearCart()
    setPlacing(false)
    setOrder(orderRow)
    toast.success('Order placed!')
  }

  // Confirmation screen
  if (order) {
    return (
      <div className="container-wide py-20 lg:py-32 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <Check size={40} />
        </motion.div>
        <h1 className="heading-lg mb-4">Order confirmed.</h1>
        <p className="text-ink-500 mb-2">Order number</p>
        <p className="font-mono text-lg font-bold mb-8">#{order.id.slice(0, 8).toUpperCase()}</p>
        <p className="text-ink-600 mb-10 max-w-md mx-auto">
          We've sent a confirmation to {shipping.email}. Your gear is being prepped for dispatch.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/products" className="btn-primary">Continue Shopping</Link>
          <Link to="/profile?tab=orders" className="btn-outline">View Orders</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container-wide py-10 lg:py-14">
        <h1 className="heading-lg mb-10">Checkout</h1>

        {/* Progress */}
        <div className="flex items-center max-w-2xl mb-12">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    i < step
                      ? 'bg-ink-950 text-white border-ink-950'
                      : i === step
                      ? 'border-ink-950 text-ink-950'
                      : 'border-ink-200 text-ink-300'
                  }`}
                >
                  {i < step ? <Check size={18} /> : <s.icon size={18} />}
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${
                    i <= step ? 'text-ink-950' : 'text-ink-300'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 transition-colors ${i < step ? 'bg-ink-950' : 'bg-ink-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Form area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="font-display text-2xl mb-6">Shipping Details</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <Input label="Full Name" value={shipping.name} onChange={(v) => setShipping({ ...shipping, name: v })} />
                    <Input label="Email" type="email" value={shipping.email} onChange={(v) => setShipping({ ...shipping, email: v })} />
                    <Input label="Address" value={shipping.address} onChange={(v) => setShipping({ ...shipping, address: v })} className="sm:col-span-2" />
                    <Input label="City" value={shipping.city} onChange={(v) => setShipping({ ...shipping, city: v })} />
                    <Input label="ZIP / Postal Code" value={shipping.zip} onChange={(v) => setShipping({ ...shipping, zip: v })} />
                    <Input label="Country" value={shipping.country} onChange={(v) => setShipping({ ...shipping, country: v })} className="sm:col-span-2" />
                  </div>
                  <div className="flex justify-between mt-8">
                    <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider hover:text-accent-500">
                      <ArrowLeft size={16} /> Back to Cart
                    </Link>
                    <button onClick={next} disabled={!canProceed()} className="btn-primary">
                      Continue to Payment <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="font-display text-2xl mb-2">Payment</h2>
                  <p className="text-sm text-ink-400 mb-6 flex items-center gap-2">
                    <Lock size={14} /> This is a demo — no real payment is processed.
                  </p>
                  <div className="space-y-6 max-w-lg">
                    <Input label="Card Number" placeholder="4242 4242 4242 4242" value={payment.card} onChange={(v) => setPayment({ ...payment, card: v })} />
                    <Input label="Name on Card" value={payment.name} onChange={(v) => setPayment({ ...payment, name: v })} />
                    <div className="grid grid-cols-2 gap-6">
                      <Input label="Expiry" placeholder="MM / YY" value={payment.expiry} onChange={(v) => setPayment({ ...payment, expiry: v })} />
                      <Input label="CVC" placeholder="123" value={payment.cvc} onChange={(v) => setPayment({ ...payment, cvc: v })} />
                    </div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <button onClick={back} className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider hover:text-accent-500">
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button onClick={placeOrder} disabled={placing || !canProceed()} className="btn-accent text-base py-4">
                      {placing ? 'Placing Order…' : `Place Order · ${formatPrice(total)}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary sidebar */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="bg-ink-50 p-6 lg:p-8">
              <h2 className="font-display text-xl mb-5">Order Summary</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative shrink-0 w-14 h-14 bg-white overflow-hidden">
                      <img src={item.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 bg-ink-950 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold line-clamp-2 leading-tight">{item.product?.name}</p>
                      <p className="text-xs text-ink-500 mt-1">{formatPrice(item.product?.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm border-t border-ink-200 pt-4">
                <Row label="Subtotal" value={formatPrice(subtotal)} />
                <Row label="Shipping" value={shippingCost === 0 ? 'Free' : formatPrice(shippingCost)} highlight={shippingCost === 0} />
                <Row label="Tax" value={formatPrice(tax)} />
              </div>
              <div className="border-t border-ink-200 mt-3 pt-3 flex justify-between items-baseline">
                <span className="font-bold">Total</span>
                <span className="font-display text-2xl">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Input({ label, value, onChange, type = 'text', placeholder, className = '' }) {
  return (
    <div className={className}>
      <label className="label-over mb-2 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-2 border-ink-200 px-4 py-3 text-sm focus:border-ink-950 outline-none transition-colors"
      />
    </div>
  )
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-600">{label}</span>
      <span className={highlight ? 'font-bold text-emerald-600' : 'font-semibold'}>
        {value}
      </span>
    </div>
  )
}
