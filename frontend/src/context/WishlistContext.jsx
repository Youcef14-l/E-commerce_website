import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const WishlistContext = createContext(null)
const WISH_KEY = 'volt-wishlist'

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState([])

  useEffect(() => {
    try {
      const local = localStorage.getItem(WISH_KEY)
      setIds(local ? JSON.parse(local) : [])
    } catch {
      setIds([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(WISH_KEY, JSON.stringify(ids))
  }, [ids])

  const toggle = useCallback((productId) => {
    setIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }, [])

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
