"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"

export function BrandStorySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"])
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"])

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[500px] lg:h-[600px]"
          >
            <motion.div
              className="absolute top-0 left-0 w-2/3 h-2/3 rounded-2xl overflow-hidden"
              style={{ y: y1 }}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: "url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80)",
                }}
              />
            </motion.div>
            <motion.div
              className="absolute bottom-0 right-0 w-2/3 h-2/3 rounded-2xl overflow-hidden shadow-2xl"
              style={{ y: y2 }}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: "url(https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80)",
                }}
              />
            </motion.div>
            
            {/* Floating Element */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass px-8 py-6 rounded-2xl text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              <p className="text-4xl font-serif font-medium">15+</p>
              <p className="text-sm text-muted-foreground">Years of Excellence</p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
                Our Story
              </p>
              <h2 className="text-4xl lg:text-5xl font-serif font-medium tracking-tight mb-6 text-balance">
                Crafted with Intention
              </h2>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2010, LUXE began as a vision to bridge the gap between 
                timeless craftsmanship and contemporary design. We believe that 
                true luxury lies not in excess, but in the meticulous attention 
                to detail and the pursuit of perfection.
              </p>
              <p>
                Every piece in our collection is thoughtfully designed and 
                ethically produced, partnering with artisans who share our 
                commitment to quality and sustainability. We source only the 
                finest materials from around the world.
              </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              {[
                { value: "100%", label: "Sustainable Materials" },
                { value: "50+", label: "Global Artisans" },
                { value: "12", label: "Countries Served" },
                { value: "25k+", label: "Happy Customers" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="border-l-2 border-accent pl-4"
                >
                  <p className="text-2xl font-serif font-medium">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
