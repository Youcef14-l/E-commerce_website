import { motion, useScroll, useTransform } from 'framer-motion'

// Scroll-triggered reveal wrapper
export function Reveal({ children, delay = 0, y = 40, className = '', once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Stagger container for grids
export function StaggerContainer({ children, className = '', stagger = 0.08, once = true }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-60px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '', y = 30 }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}

// Parallax wrapper
export function Parallax({ children, speed = 0.3, className = '' }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 800], [0, speed * 800])
  return (
    <motion.div className={className} style={{ y }}>
      {children}
    </motion.div>
  )
}
