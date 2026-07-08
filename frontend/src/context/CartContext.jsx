import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  // Load cart from Supabase when user logs in, otherwise from localStorage
  const loadCart = useCallback(async () => {
    if (user) {
      setLoading(true)
      const { data } = await supabase
        .from('cart')
        .select('id, product_id, quantity, products(*)')
        .eq('user_id', user.id)
      if (data) {
        setItems(
          data.map((row) => ({
            cartId: row.id,
            id: row.product_id,
            quantity: row.quantity,
            product: row.products,
          }))
        )
      }
      setLoading(false)
    } else {
      try {
        const local = localStorage.getItem('volt-cart')
        setItems(local ? JSON.parse(local) : [])
      } catch {
        setItems([])
      }
    }
  }, [user])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  // Persist guest cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('volt-cart', JSON.stringify(items))
    }
  }, [items, user])

  const addToCart = useCallback(
    async (product, quantity = 1) => {
      if (user) {
        const existing = items.find((i) => i.id === product.id)
        if (existing) {
          const { data } = await supabase
            .from('cart')
            .update({ quantity: existing.quantity + quantity })
            .eq('id', existing.cartId)
            .select()
            .maybeSingle()
          if (data) {
            setItems((prev) =>
              prev.map((i) =>
                i.id === product.id ? { ...i, quantity: data.quantity } : i
              )
            )
          }
        } else {
          const { data } = await supabase
            .from('cart')
            .insert({ user_id: user.id, product_id: product.id, quantity })
            .select()
            .maybeSingle()
          if (data) {
            setItems((prev) => [
              ...prev,
              { cartId: data.id, id: product.id, quantity, product },
            ])
          }
        }
      } else {
        setItems((prev) => {
          const existing = prev.find((i) => i.id === product.id)
          if (existing) {
            return prev.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
            )
          }
          return [...prev, { id: product.id, quantity, product }]
        })
      }
    },
    [user, items]
  )

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity <= 0) return removeFromCart(productId)
      if (user) {
        const item = items.find((i) => i.id === productId)
        if (item) {
          await supabase.from('cart').update({ quantity }).eq('id', item.cartId)
        }
      }
      setItems((prev) =>
        prev.map((i) => (i.id === productId ? { ...i, quantity } : i))
      )
    },
    [user, items]
  )

  const removeFromCart = useCallback(
    async (productId) => {
      if (user) {
        const item = items.find((i) => i.id === productId)
        if (item) {
          await supabase.from('cart').delete().eq('id', item.cartId)
        }
      }
      setItems((prev) => prev.filter((i) => i.id !== productId))
    },
    [user, items]
  )

  const clearCart = useCallback(async () => {
    if (user) {
      await supabase.from('cart').delete().eq('user_id', user.id)
    }
    setItems([])
    localStorage.removeItem('volt-cart')
  }, [user])

  const subtotal = items.reduce(
    (sum, i) => sum + (Number(i.product?.price) || 0) * i.quantity,
    0
  )
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  const value = {
    items,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    count,
    reload: loadCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
