import { Star } from 'lucide-react'
import { classNames } from '../lib/utils'

export default function StarRating({ value = 0, size = 16, className = '' }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <div className={classNames('flex items-center gap-0.5', className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full
        const isHalf = i === full && half
        return (
          <Star
            key={i}
            size={size}
            className={classNames(
              filled || isHalf ? 'text-accent-500 fill-accent-500' : 'text-ink-200 fill-ink-200'
            )}
          />
        )
      })}
    </div>
  )
}
