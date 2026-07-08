import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Zap, Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import { Reveal, StaggerContainer, StaggerItem } from '../components/motion/Reveal'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeletons'
import { fetchCategories, fetchProducts } from '../lib/api'

export default function Landing() {
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState([])
  const [bestsellers, setBestsellers] = useState([])
  const [loading, setLoading] = useState(true)

  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, 180])
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.15])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  useEffect(() => {
    Promise.all([
      fetchCategories(),
      fetchProducts({ featured: true, perPage: 8 }),
      fetchProducts({ bestseller: true, perPage: 4, sort: 'rating' }),
    ]).then(([cats, feat, best]) => {
      setCategories(cats)
      setFeatured(feat.data)
      setBestsellers(best.data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="bg-white">
      {/* ===== HERO ===== */}
      <section className="relative h-[92vh] min-h-[600px] overflow-hidden bg-ink-950">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1800"
            alt="VOLT hero"
            className="w-full h-full object-cover opacity-60"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-ink-950/30 to-ink-950" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative h-full container-wide flex flex-col justify-end pb-20 lg:pb-28"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white/70 text-sm font-semibold uppercase tracking-[0.3em] mb-5"
          >
            New Season Drop — 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-white text-[clamp(3rem,11vw,11rem)] leading-[0.85] tracking-tighter max-w-5xl"
          >
            BUILT FOR<br />
            <span className="text-accent-500">PERFORMANCE.</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Link to="/products" className="btn-accent text-base px-8 py-4">
              Shop the Drop <ArrowRight size={18} />
            </Link>
            <Link to="/products?category=graphics-cards" className="btn-outline text-base px-8 py-4 border-white/40 text-white hover:bg-white hover:text-ink-950">
              Explore GPUs
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-[10px] uppercase tracking-[0.3em] flex flex-col items-center gap-2"
        >
          <span>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-white/40"
          />
        </motion.div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="border-b border-ink-100">
        <div className="container-wide grid grid-cols-2 lg:grid-cols-4 divide-x divide-ink-100">
          {[
            { icon: Truck, title: 'Free Shipping', sub: 'On orders over $99' },
            { icon: RotateCcw, title: '30-Day Returns', sub: 'No questions asked' },
            { icon: ShieldCheck, title: '2-Year Warranty', sub: 'On all hardware' },
            { icon: Zap, title: 'Same-Day Dispatch', sub: 'Order by 3pm' },
          ].map((f, i) => (
            <Reveal key={i} delay={i * 0.1} className="flex items-center gap-4 px-6 py-7">
              <f.icon size={26} className="text-accent-500 shrink-0" />
              <div>
                <p className="font-bold text-sm uppercase tracking-wider">{f.title}</p>
                <p className="text-xs text-ink-500 mt-0.5">{f.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== CATEGORY SHOWCASE ===== */}
      <section className="section-pad">
        <div className="container-wide">
          <Reveal className="flex items-end justify-between mb-10 lg:mb-14">
            <div>
              <p className="label-over mb-3">Shop by category</p>
              <h2 className="heading-lg">Find your gear.</h2>
            </div>
            <Link to="/products" className="hidden sm:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-accent-500 transition-colors">
              View All <ArrowUpRight size={18} />
            </Link>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
            {categories.slice(0, 8).map((cat, i) => (
              <Reveal key={cat.id} delay={i * 0.06}>
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden bg-ink-100"
                >
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                    <h3 className="text-white font-display text-lg lg:text-2xl leading-tight">
                      {cat.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-white/80 text-[11px] font-semibold uppercase tracking-widest mt-2 group-hover:text-accent-400 transition-colors">
                      Shop <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section-pad bg-ink-50">
        <div className="container-wide">
          <Reveal className="flex items-end justify-between mb-10 lg:mb-14">
            <div>
              <p className="label-over mb-3">Featured</p>
              <h2 className="heading-lg">Engineered to win.</h2>
            </div>
            <Link to="/products" className="hidden sm:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-accent-500 transition-colors">
              View All <ArrowUpRight size={18} />
            </Link>
          </Reveal>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
              {featured.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* ===== EDITORIAL PROMO 1 ===== */}
      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[60vh]">
          <div className="relative bg-ink-950 flex items-center order-2 lg:order-1">
            <Reveal className="p-10 lg:p-20 max-w-xl">
              <p className="text-accent-500 text-sm font-bold uppercase tracking-[0.3em] mb-5">
                Volt Apex Series
              </p>
              <h2 className="heading-lg text-white mb-6">
                Type at the speed of thought.
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Hot-swap switches. Gasket-mount feel. A 75% layout that disappears under your fingers. The Apex is what a keyboard should feel like.
              </p>
              <Link to="/products?category=keyboards" className="btn-accent">
                Shop Keyboards <ArrowRight size={18} />
              </Link>
            </Reveal>
          </div>
          <div className="relative order-1 lg:order-2 min-h-[300px] overflow-hidden">
            <img
              src="https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt="Apex keyboard"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== BESTSELLERS ===== */}
      <section className="section-pad">
        <div className="container-wide">
          <Reveal className="flex items-end justify-between mb-10 lg:mb-14">
            <div>
              <p className="label-over mb-3">Top Rated</p>
              <h2 className="heading-lg">The fan favorites.</h2>
            </div>
          </Reveal>
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
              {bestsellers.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* ===== EDITORIAL PROMO 2 ===== */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-ink-950">
        <motion.img
          initial={{ scale: 1.2 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          src="https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=1800"
          alt="Performance"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/60 to-transparent" />
        <div className="relative h-full container-wide flex items-center">
          <Reveal className="max-w-2xl">
            <p className="text-accent-500 text-sm font-bold uppercase tracking-[0.3em] mb-5">
              The Volt Standard
            </p>
            <h2 className="font-display text-white text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] tracking-tight mb-6">
              No compromises.<br />Just performance.
            </h2>
            <p className="text-white/70 text-lg max-w-lg mb-8">
              Every product in our catalog is benchmarked, tortured, and approved by engineers who refuse to ship anything slow.
            </p>
            <Link to="/products" className="btn-accent">
              Shop All Products <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===== BRAND MARQUEE ===== */}
      <section className="bg-white border-y border-ink-100 py-8 overflow-hidden">
        <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex items-center gap-16">
              {['VOLT', 'NEXUS', 'APEX', 'GLIDE', 'SONIC', 'BLADE', 'STRIKE', 'PULSE'].map((brand, i) => (
                <span
                  key={`${dup}-${i}`}
                  className="font-display text-3xl lg:text-5xl text-ink-200 hover:text-ink-950 transition-colors cursor-default tracking-tighter"
                >
                  {brand}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
