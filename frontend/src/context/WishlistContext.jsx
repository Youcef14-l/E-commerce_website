import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [ids, setIds] = useState([])

  const load = useCallback(async () => {
    if (user) {
      const { data } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user.id)
      setIds(data ? data.map((r) => r.product_id) : [])
    } else {
      try {
        const local = localStorage.getItem('volt-wishlist')
        setIds(local ? JSON.parse(local) : [])
      } catch {
        setIds([])
      }
    }
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!user) localStorage.setItem('volt-wishlist', JSON.stringify(ids))
  }, [ids, user])

  const toggle = useCallback(
    async (productId) => {
      if (user) {
        if (ids.includes(productId)) {
          await supabase
            .from('wishlist')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId)
          setIds((prev) => prev.filter((id) => id !== productId))
        } else {
          await supabase
            .from('wishlist')
            .insert({ user_id: user.id, product_id: productId })
          setIds((prev) => [...prev, productId])
        }
      } else {
        setIds((prev) =>
          prev.includes(productId)
            ? prev.filter((id) => id !== productId)
            : [...prev, productId]
        )
      }
    },
    [user, ids]
  )

  return (
    <WishlistContext.Provider value={{ ids, toggle, has: (id) => ids.includes(id) }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
