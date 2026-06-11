"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { products, Product } from "@/lib/products"

function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/products/${product.id}`} className="group block">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary mb-4">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.new && (
              <span className="px-3 py-1 text-xs font-medium bg-foreground text-background rounded-full">
                New
              </span>
            )}
            {product.originalPrice && (
              <span className="px-3 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                Sale
              </span>
            )}
          </div>

          {/* Quick View */}
          <motion.div
            className="absolute bottom-4 left-4 right-4"
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            <Button
              className="w-full rounded-full bg-background/90 text-foreground backdrop-blur-sm hover:bg-background transition-all opacity-0 group-hover:opacity-100 duration-300"
            >
              Quick View
            </Button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-base group-hover:text-accent transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span className="text-xs text-muted-foreground">{product.rating}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-1">
            {product.category}
          </p>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Colors */}
          <div className="flex items-center gap-1 pt-1">
            {product.colors.slice(0, 3).map((color, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function FeaturedProducts() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4)

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Curated Selection
            </p>
            <h2 className="text-4xl lg:text-5xl font-serif font-medium tracking-tight text-balance">
              Featured Pieces
            </h2>
          </div>
          <Link href="/products">
            <Button
              variant="outline"
              className="group rounded-full px-6 border-foreground/20 hover:border-foreground/50"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
