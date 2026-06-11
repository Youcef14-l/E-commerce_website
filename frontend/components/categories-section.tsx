"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const categories = [
  {
    name: "Outerwear",
    description: "Tailored elegance",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    count: 24,
  },
  {
    name: "Accessories",
    description: "Finishing touches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    count: 48,
  },
  {
    name: "Knitwear",
    description: "Luxurious comfort",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
    count: 18,
  },
  {
    name: "Footwear",
    description: "Step forward",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    count: 32,
  },
]

function CategoryCard({ category, index }: { category: typeof categories[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/products?category=${category.name.toLowerCase()}`}
        className="group block relative aspect-[4/5] rounded-2xl overflow-hidden"
      >
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${category.image})` }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-foreground/70 mb-1">{category.description}</p>
              <h3 className="text-2xl font-serif font-medium">{category.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{category.count} items</p>
            </div>
            <motion.div
              className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function CategoriesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Browse by Category
          </p>
          <h2 className="text-4xl lg:text-5xl font-serif font-medium tracking-tight text-balance">
            Shop Collections
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.name} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
