export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  category: string
  images: string[]
  colors: string[]
  sizes: string[]
  rating: number
  reviews: number
  inStock: boolean
  featured?: boolean
  new?: boolean
}

export const products: Product[] = [
  {
    id: "1",
    name: "Midnight Essence Jacket",
    price: 489,
    originalPrice: 599,
    description: "Crafted from premium Italian wool, this jacket embodies sophistication with its clean lines and impeccable tailoring. Perfect for the modern professional.",
    category: "Outerwear",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    ],
    colors: ["#1a1a1a", "#4a4a4a", "#8b7355"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 124,
    inStock: true,
    featured: true,
    new: true,
  },
  {
    id: "2",
    name: "Aurora Silk Blouse",
    price: 289,
    description: "Luxurious mulberry silk meets minimalist design. This flowing blouse drapes beautifully and transitions seamlessly from day to evening.",
    category: "Tops",
    images: [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80",
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&q=80",
    ],
    colors: ["#f5f5f5", "#d4a574", "#1a1a1a"],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.9,
    reviews: 89,
    inStock: true,
    featured: true,
  },
  {
    id: "3",
    name: "Obsidian Leather Tote",
    price: 695,
    description: "Hand-stitched from full-grain leather, this tote combines functionality with timeless elegance. Features brass hardware and suede lining.",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    ],
    colors: ["#1a1a1a", "#8b4513", "#f5f5dc"],
    sizes: ["One Size"],
    rating: 4.7,
    reviews: 156,
    inStock: true,
    featured: true,
  },
  {
    id: "4",
    name: "Ethereal Cashmere Sweater",
    price: 445,
    description: "100% Mongolian cashmere knitted into a cloud-soft sweater. The perfect balance of warmth and weightlessness.",
    category: "Knitwear",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    ],
    colors: ["#f5f5f5", "#c4a77d", "#3d3d3d"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.9,
    reviews: 203,
    inStock: true,
    new: true,
  },
  {
    id: "5",
    name: "Sculptural Heel Sandal",
    price: 525,
    description: "Architectural design meets artisanal craftsmanship. These statement sandals feature a distinctive sculptural heel and butter-soft leather straps.",
    category: "Footwear",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
      "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&q=80",
    ],
    colors: ["#1a1a1a", "#f5f5f5", "#c4a77d"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    rating: 4.6,
    reviews: 78,
    inStock: true,
    featured: true,
  },
  {
    id: "6",
    name: "Minimalist Watch",
    price: 895,
    description: "Swiss movement encased in brushed titanium. The epitome of understated luxury with sapphire crystal and Italian leather strap.",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    ],
    colors: ["#1a1a1a", "#c0c0c0", "#d4a574"],
    sizes: ["40mm", "44mm"],
    rating: 4.9,
    reviews: 312,
    inStock: true,
    featured: true,
    new: true,
  },
  {
    id: "7",
    name: "Tailored Wool Trousers",
    price: 345,
    description: "Expertly cut from superfine merino wool. These trousers offer exceptional comfort and a silhouette that flatters every figure.",
    category: "Bottoms",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    ],
    colors: ["#1a1a1a", "#4a4a4a", "#f5f5f5"],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.7,
    reviews: 167,
    inStock: true,
  },
  {
    id: "8",
    name: "Artisan Ceramic Vase",
    price: 225,
    description: "Hand-thrown stoneware with a distinctive organic glaze. Each piece is unique, celebrating the beauty of imperfection.",
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80",
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=80",
    ],
    colors: ["#f5f5f5", "#c4a77d", "#3d3d3d"],
    sizes: ["Small", "Medium", "Large"],
    rating: 4.8,
    reviews: 94,
    inStock: true,
  },
]

export const categories = [
  { name: "All", slug: "all" },
  { name: "Outerwear", slug: "outerwear" },
  { name: "Tops", slug: "tops" },
  { name: "Bottoms", slug: "bottoms" },
  { name: "Knitwear", slug: "knitwear" },
  { name: "Footwear", slug: "footwear" },
  { name: "Accessories", slug: "accessories" },
  { name: "Home", slug: "home" },
]

export const testimonials = [
  {
    id: 1,
    name: "Alexandra Chen",
    role: "Creative Director",
    content: "The quality and attention to detail is unmatched. Every piece feels like it was made just for me.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    id: 2,
    name: "Marcus Williams",
    role: "Architect",
    content: "Finally, a brand that understands modern luxury. Clean lines, premium materials, impeccable taste.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    id: 3,
    name: "Sofia Martinez",
    role: "Fashion Editor",
    content: "LUXE has redefined what it means to dress with intention. Sustainable, timeless, extraordinary.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
]
