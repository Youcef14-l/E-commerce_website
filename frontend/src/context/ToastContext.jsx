import { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message, type = 'success') => {
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => remove(id), 3000)
    },
    [remove]
  )

  const toast = {
    success: (msg) => push(msg, 'success'),
    error: (msg) => push(msg, 'error'),
    info: (msg) => push(msg, 'info'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              className={`pointer-events-auto flex items-center gap-3 px-5 py-4 min-w-[260px] max-w-sm shadow-2xl ${
                t.type === 'success'
                  ? 'bg-ink-950 text-white'
                  : t.type === 'error'
                  ? 'bg-accent-500 text-white'
                  : 'bg-white text-ink-950 border border-ink-200'
              }`}
            >
              {t.type === 'success' ? (
                <CheckCircle2 size={18} className="shrink-0" />
              ) : t.type === 'error' ? (
                <AlertCircle size={18} className="shrink-0" />
              ) : null}
              <span className="text-sm font-medium flex-1">{t.message}</span>
              <button
                onClick={() => remove(t.id)}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
