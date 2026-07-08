import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const [mode, setMode] = useState('login') // login | register
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (mode === 'login') {
      const { error } = await signIn(email, password)
      setLoading(false)
      if (error) {
        setError(error.message.includes('Invalid login')
          ? 'Invalid email or password.'
          : error.message)
        return
      }
      toast.success('Welcome back.')
      navigate(redirectTo)
    } else {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        setLoading(false)
        return
      }
      const { error } = await signUp(email, password, fullName || email.split('@')[0])
      setLoading(false)
      if (error) {
        setError(error.message)
        return
      }
      toast.success('Account created. Welcome to VOLT.')
      navigate(redirectTo)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Image side */}
      <div className="relative hidden lg:block overflow-hidden bg-ink-950">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          src="https://images.pexels.com/photos/2588757/pexels-photo-2588757.jpeg?auto=compress&cs=tinysrgb&w=1400"
          alt="VOLT"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-between p-12 xl:p-16">
          <Link to="/" className="font-display text-3xl text-white tracking-tighter">
            VOLT<span className="text-accent-500">.</span>
          </Link>
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-white text-5xl xl:text-7xl leading-[0.9] tracking-tight max-w-md"
            >
              Built for<br />performance.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/70 mt-6 max-w-sm"
            >
              Join the VOLT squad for early drops, member pricing, and faster checkout.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-col items-center justify-center px-6 py-12 lg:p-16">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden font-display text-3xl tracking-tighter mb-12 inline-block">
            VOLT<span className="text-accent-500">.</span>
          </Link>

          <p className="label-over mb-3">{mode === 'login' ? 'Welcome back' : 'Join VOLT'}</p>
          <h1 className="font-display text-4xl lg:text-5xl tracking-tight mb-2">
            {mode === 'login' ? 'Sign in.' : 'Create account.'}
          </h1>
          <p className="text-ink-500 mb-10">
            {mode === 'login' ? "Don't have an account? " : 'Already a member? '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setError('')
              }}
              className="font-bold text-ink-950 underline underline-offset-4 hover:text-accent-500 transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <form onSubmit={submit} className="space-y-6">
            {mode === 'register' && (
              <Field
                icon={User}
                label="Full Name"
                type="text"
                value={fullName}
                onChange={setFullName}
                placeholder="Alex Carter"
              />
            )}
            <Field
              icon={Mail}
              label="Email"
              type="email"
              required
              value={email}
              onChange={setEmail}
              placeholder="you@email.com"
            />
            <Field
              icon={Lock}
              label="Password"
              type="password"
              required
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-accent-600 font-medium bg-accent-50 border border-accent-100 px-4 py-3"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-4">
              {loading ? 'Please wait…' : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-950 transition-colors">
            <ArrowLeft size={15} /> Back to home
          </Link>

          <p className="mt-10 text-xs text-ink-400 leading-relaxed">
            By continuing you agree to VOLT's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, type, value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label className="label-over mb-2 block">{label}</label>
      <div className={`relative flex items-center border-b-2 transition-colors ${focused ? 'border-ink-950' : 'border-ink-200'}`}>
        <Icon size={18} className={`absolute left-0 transition-colors ${focused ? 'text-accent-500' : 'text-ink-300'}`} />
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent pl-8 py-3 outline-none text-ink-950 placeholder-ink-300"
        />
      </div>
    </div>
  )
}
