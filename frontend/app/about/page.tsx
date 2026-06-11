"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const team = [
  {
    name: "Elena Vasquez",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    bio: "Former fashion editor with 15 years of industry experience.",
  },
  {
    name: "Marcus Chen",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    bio: "Award-winning designer passionate about sustainable fashion.",
  },
  {
    name: "Sofia Laurent",
    role: "Head of Product",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    bio: "Expert in luxury goods and customer experience.",
  },
  {
    name: "James Wright",
    role: "Operations Director",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    bio: "Logistics specialist with a focus on ethical supply chains.",
  },
]

const timeline = [
  {
    year: "2010",
    title: "The Beginning",
    description: "LUXE was founded with a vision to redefine luxury through intentional design.",
  },
  {
    year: "2014",
    title: "Global Expansion",
    description: "Expanded to 12 countries, partnering with artisans worldwide.",
  },
  {
    year: "2018",
    title: "Sustainability Pledge",
    description: "Committed to 100% sustainable materials and carbon-neutral shipping.",
  },
  {
    year: "2022",
    title: "Digital Evolution",
    description: "Launched our reimagined digital experience for the modern consumer.",
  },
  {
    year: "2026",
    title: "The Future",
    description: "Continuing to innovate while staying true to our core values.",
  },
]

const values = [
  {
    title: "Quality First",
    description: "Every piece is crafted with meticulous attention to detail using only the finest materials.",
  },
  {
    title: "Sustainable Practice",
    description: "We are committed to ethical sourcing and environmentally conscious production.",
  },
  {
    title: "Timeless Design",
    description: "Our designs transcend trends, creating pieces that last for generations.",
  },
  {
    title: "Human Connection",
    description: "We value the artisans behind our products and the customers who wear them.",
  },
]

function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80)",
          y,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 container mx-auto px-6 lg:px-12 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6"
        >
          Our Story
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl lg:text-7xl font-serif font-medium tracking-tight mb-8 text-balance"
        >
          Crafting Luxury with Purpose
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          For over a decade, we&apos;ve been redefining what luxury means—creating pieces that honor tradition while embracing innovation.
        </motion.p>
      </motion.div>
    </section>
  )
}

function MissionSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80"
              alt="Our mission"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
                Our Mission
              </p>
              <h2 className="text-4xl lg:text-5xl font-serif font-medium tracking-tight mb-6 text-balance">
                Elevating Everyday Elegance
              </h2>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                At LUXE, we believe that true luxury is not about excess—it&apos;s about intention. 
                Every piece we create is designed to be cherished, worn, and passed down through generations.
              </p>
              <p>
                We partner with skilled artisans around the world who share our commitment to excellence 
                and sustainability. Together, we&apos;re proving that beautiful design and responsible 
                production can coexist.
              </p>
              <p>
                Our mission is simple: to create timeless pieces that bring joy to those who wear them, 
                while respecting the planet and people who make them possible.
              </p>
            </div>

            <Link href="/products">
              <Button
                size="lg"
                className="group rounded-full bg-foreground text-background hover:bg-foreground/90"
              >
                Explore Our Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ValuesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
            What We Stand For
          </p>
          <h2 className="text-4xl lg:text-5xl font-serif font-medium tracking-tight text-balance">
            Our Values
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center p-8 rounded-2xl bg-background"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-serif font-medium text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-xl font-serif font-medium mb-4">{value.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Our Journey
          </p>
          <h2 className="text-4xl lg:text-5xl font-serif font-medium tracking-tight text-balance">
            A Timeline of Excellence
          </h2>
        </motion.div>

        <div className="relative">
          {/* Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-16 ${
                  i % 2 === 0 ? "" : "lg:direction-rtl"
                }`}
              >
                <div className={`${i % 2 === 0 ? "lg:text-right lg:pr-16" : "lg:col-start-2 lg:pl-16"}`}>
                  <div className="glass p-8 rounded-2xl inline-block w-full">
                    <span className="text-3xl font-serif font-medium text-accent mb-2 block">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>

                {/* Dot */}
                <div className="absolute left-1/2 top-8 -translate-x-1/2 w-4 h-4 rounded-full bg-accent hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TeamSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
            The People Behind LUXE
          </p>
          <h2 className="text-4xl lg:text-5xl font-serif font-medium tracking-tight text-balance">
            Meet Our Team
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="text-lg font-medium mb-1">{member.name}</h3>
              <p className="text-sm text-accent mb-2">{member.role}</p>
              <p className="text-sm text-muted-foreground">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-foreground text-background">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl lg:text-5xl font-serif font-medium tracking-tight mb-6 text-balance">
            Join the LUXE Experience
          </h2>
          <p className="text-xl text-background/70 mb-10">
            Discover a world where craftsmanship meets contemporary design. 
            Start your journey with us today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button
                size="lg"
                className="group px-8 py-6 rounded-full bg-background text-foreground hover:bg-background/90"
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#contact">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 rounded-full border-background/20 text-background hover:bg-background/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <MissionSection />
      <ValuesSection />
      <TimelineSection />
      <TeamSection />
      <CTASection />
      <Footer />
    </main>
  )
}
