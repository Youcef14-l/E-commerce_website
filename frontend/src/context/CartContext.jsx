import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const CartContext = createContext(null)
const CART_KEY = 'volt-cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const local = localStorage.getItem(CART_KEY)
      setItems(local ? JSON.parse(local) : [])
    } catch {
      setItems([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { id: product.id, quantity, product }]
    })
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== productId))
      return
    }
    setItems((prev) => prev.map((i) => (i.id === productId ? { ...i, quantity } : i)))
  }, [])

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem(CART_KEY)
  }, [])

  const subtotal = items.reduce(
    (sum, i) => sum + (Number(i.product?.price) || 0) * i.quantity,
    0
  )
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, loading: false, addToCart, updateQuantity, removeFromCart, clearCart, subtotal, count, reload: () => {} }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
