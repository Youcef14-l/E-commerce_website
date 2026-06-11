"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PromoBanner() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"])

  return (
    <section ref={ref} className="py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden bg-foreground text-background"
        >
          {/* Background Image */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80)",
              y,
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70" />

          {/* Content */}
          <div className="relative z-10 py-20 lg:py-32 px-8 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-center lg:text-left max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="text-sm uppercase tracking-[0.3em] text-background/70 mb-4"
              >
                Limited Time Offer
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-4xl lg:text-6xl font-serif font-medium tracking-tight mb-6 text-balance"
              >
                Up to 40% Off Selected Items
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="text-lg text-background/70 mb-8"
              >
                Discover exceptional pieces at exceptional prices. Our seasonal sale brings you curated luxury at unparalleled value.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                <Link href="/products">
                  <Button
                    size="lg"
                    className="group px-8 py-6 text-base rounded-full bg-background text-foreground hover:bg-background/90 transition-all duration-300"
                  >
                    Shop the Sale
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-8"
            >
              {[
                { value: "200+", label: "Products" },
                { value: "40%", label: "Max Discount" },
                { value: "7", label: "Days Left" },
                { value: "Free", label: "Shipping" },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <p className="text-3xl lg:text-4xl font-serif font-medium">{stat.value}</p>
                  <p className="text-sm text-background/70">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
