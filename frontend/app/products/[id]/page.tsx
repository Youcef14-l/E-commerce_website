"use client"

import { useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Share2, 
  Minus, 
  Plus, 
  Check,
  ChevronDown,
  Truck,
  RotateCcw,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { products, Product } from "@/lib/products"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <motion.div
        className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
        layoutId="product-image"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[selectedImage]}
              alt={name}
              fill
              className={`object-cover transition-transform duration-500 ${
                isZoomed ? "scale-150" : "scale-100"
              }`}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Thumbnails */}
      <div className="flex gap-4">
        {images.map((image, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(i)}
            className={`relative w-20 h-24 rounded-xl overflow-hidden transition-all ${
              selectedImage === i
                ? "ring-2 ring-foreground"
                : "ring-1 ring-border opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={image}
              alt={`${name} view ${i + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function RelatedProducts({ currentId, category }: { currentId: string; category: string }) {
  const related = products
    .filter((p) => p.id !== currentId && p.category === category)
    .slice(0, 4)

  if (related.length === 0) return null

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-3xl font-serif font-medium tracking-tight mb-12">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/products/${product.id}`} className="group block">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary mb-4">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <h3 className="font-medium group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">${product.price}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const product = products.find((p) => p.id === resolvedParams.id)
  
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [isWishlisted, setIsWishlisted] = useState(false)

  if (!product) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-24 text-center">
          <h1 className="text-2xl font-medium mb-4">Product not found</h1>
          <Link href="/products">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const tabs = [
    { id: "description", label: "Description" },
    { id: "details", label: "Details" },
    { id: "reviews", label: `Reviews (${product.reviews})` },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <section className="pt-28 pb-8 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </motion.div>
        </div>
      </section>

      {/* Product Details */}
      <section className="pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ProductGallery images={product.images} name={product.name} />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-28 lg:self-start space-y-8"
            >
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {product.new && (
                    <span className="px-3 py-1 text-xs font-medium bg-foreground text-background rounded-full">
                      New Arrival
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">{product.category}</span>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-serif font-medium tracking-tight mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-accent text-accent"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-medium">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Colors */}
              <div>
                <p className="text-sm font-medium mb-3">Color</p>
                <div className="flex items-center gap-3">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      className={`relative w-10 h-10 rounded-full transition-all ${
                        selectedColor === i
                          ? "ring-2 ring-offset-2 ring-offset-background ring-foreground"
                          : "ring-1 ring-border"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${i + 1}`}
                    >
                      {selectedColor === i && (
                        <Check className={`absolute inset-0 m-auto h-4 w-4 ${
                          color === "#1a1a1a" || color === "#3d3d3d" ? "text-white" : "text-black"
                        }`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">Size</p>
                  <button className="text-sm text-muted-foreground hover:text-foreground underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                        selectedSize === size
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <p className="text-sm font-medium mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-secondary transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-secondary transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 h-14 rounded-full bg-foreground text-background hover:bg-foreground/90"
                  disabled={!product.inStock || !selectedSize}
                >
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={`h-14 w-14 rounded-full border-foreground/20 ${
                    isWishlisted ? "bg-accent/10 border-accent" : ""
                  }`}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-accent text-accent" : ""}`} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 w-14 rounded-full border-foreground/20"
                  aria-label="Share product"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                {[
                  { icon: Truck, label: "Free Shipping", desc: "On orders over $200" },
                  { icon: RotateCcw, label: "Easy Returns", desc: "30 day return policy" },
                  { icon: Shield, label: "Secure Payment", desc: "100% protected" },
                ].map((feature, i) => (
                  <div key={i} className="text-center">
                    <feature.icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs font-medium">{feature.label}</p>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <div className="flex gap-8 border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="py-8">
              <AnimatePresence mode="wait">
                {activeTab === "description" && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="prose prose-neutral dark:prose-invert max-w-none"
                  >
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </motion.div>
                )}
                {activeTab === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid sm:grid-cols-2 gap-8"
                  >
                    <div>
                      <h3 className="font-medium mb-4">Materials</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>Premium Italian materials</li>
                        <li>Sustainably sourced</li>
                        <li>Handcrafted details</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-4">Care Instructions</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>Dry clean recommended</li>
                        <li>Store in provided dust bag</li>
                        <li>Avoid direct sunlight</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center py-12"
                  >
                    <p className="text-muted-foreground mb-4">
                      {product.reviews} customers have reviewed this product
                    </p>
                    <Button variant="outline" className="rounded-full">
                      Write a Review
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      <RelatedProducts currentId={product.id} category={product.category} />
      <Footer />
    </main>
  )
}
