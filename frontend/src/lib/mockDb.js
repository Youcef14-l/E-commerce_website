import { slugify } from './utils'

// ─── Mock database backed by localStorage ───

const DB_KEY = 'volt-mock-db'

function genId() {
  return crypto.randomUUID ? crypto.randomUUID() : 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function seed() {
  const categories = [
    { id: 'cat-gpu', name: 'Graphics Cards', slug: 'graphics-cards', description: 'Desktop GPUs for gaming and creator workloads', image_url: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=900', created_at: '2026-01-01T00:00:00Z' },
    { id: 'cat-cpu', name: 'Processors', slug: 'processors', description: 'CPU performance that pushes every frame further', image_url: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=900', created_at: '2026-01-01T00:00:00Z' },
    { id: 'cat-kb', name: 'Keyboards', slug: 'keyboards', description: 'Mechanical and low-profile keyboards built for speed', image_url: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=900', created_at: '2026-01-01T00:00:00Z' },
    { id: 'cat-mice', name: 'Mice', slug: 'mice', description: 'Precision pointers for every grip and game', image_url: 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&w=900', created_at: '2026-01-01T00:00:00Z' },
    { id: 'cat-mon', name: 'Monitors', slug: 'monitors', description: 'High-refresh panels that keep up with you', image_url: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=900', created_at: '2026-01-01T00:00:00Z' },
    { id: 'cat-hs', name: 'Headsets', slug: 'headsets', description: 'Immersive audio for competition and creation', image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=900', created_at: '2026-01-01T00:00:00Z' },
    { id: 'cat-lap', name: 'Laptops', slug: 'laptops', description: 'Portable powerhouses engineered to move fast', image_url: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=900', created_at: '2026-01-01T00:00:00Z' },
    { id: 'cat-sto', name: 'Storage', slug: 'storage', description: 'NVMe, SATA SSDs and high-capacity HDDs', image_url: 'https://images.pexels.com/photos/278875/pexels-photo-278875.jpeg?auto=compress&cs=tinysrgb&w=900', created_at: '2026-01-01T00:00:00Z' },
  ]

  const products = [
    { id: 'p1', name: 'Volt RX 7900 XTX Phantom', slug: 'volt-rx-7900-xtx-phantom', brand: 'Volt', category_id: 'cat-gpu', price: 999, compare_at_price: 1099, stock: 32, description: 'Flagship 24GB GDDR6 GPU built for 4K dominance and creator workflows.', specs: { Memory: '24GB GDDR6', 'Boost Clock': '2500 MHz', 'CUDA Cores': '6144', Ports: '3x DP 2.1, 1x HDMI 2.1', Power: '355W', Length: '320mm' }, images: ['https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/2588757/pexels-photo-2588757.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.8, review_count: 124, is_featured: true, is_bestseller: true, created_at: '2026-02-01T00:00:00Z' },
    { id: 'p2', name: 'Volt RTX 4070 Ti Stealth', slug: 'volt-rtx-4070-ti-stealth', brand: 'Volt', category_id: 'cat-gpu', price: 749, compare_at_price: 829, stock: 45, description: '12GB GDDR6X card tuned for high-refresh 1440p and ray-traced realism.', specs: { Memory: '12GB GDDR6X', 'Boost Clock': '2610 MHz', 'CUDA Cores': '7680', Ports: '3x DP 1.4a, 1x HDMI 2.1', Power: '285W', Length: '300mm' }, images: ['https://images.pexels.com/photos/2588757/pexels-photo-2588757.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.7, review_count: 89, is_featured: true, is_bestseller: false, created_at: '2026-02-02T00:00:00Z' },
    { id: 'p3', name: 'Nexus GTX 1660 Super', slug: 'nexus-gtx-1660-super', brand: 'Nexus', category_id: 'cat-gpu', price: 239, compare_at_price: 289, stock: 120, description: 'Solid 1080p performer with efficient cooling and a compact dual-fan design.', specs: { Memory: '6GB GDDR6', 'Boost Clock': '1815 MHz', 'CUDA Cores': '1408', Ports: '1x DP, 1x HDMI, 1x DVI', Power: '125W', Length: '230mm' }, images: ['https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.4, review_count: 56, is_featured: false, is_bestseller: true, created_at: '2026-02-03T00:00:00Z' },
    { id: 'p4', name: 'Volt Core i9-14900K', slug: 'volt-core-i9-14900k', brand: 'Volt', category_id: 'cat-cpu', price: 589, compare_at_price: 649, stock: 60, description: '24-core hybrid processor clocked to 6.0 GHz for elite gaming and creation.', specs: { Cores: '24 (8P + 16E)', Threads: '32', 'Base Clock': '3.2 GHz', 'Boost Clock': '6.0 GHz', Cache: '36MB', Socket: 'LGA1700', TDP: '125W' }, images: ['https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.9, review_count: 210, is_featured: true, is_bestseller: true, created_at: '2026-02-04T00:00:00Z' },
    { id: 'p5', name: 'Volt Ryzen 9 7950X3D', slug: 'volt-ryzen-9-7950x3d', brand: 'Volt', category_id: 'cat-cpu', price: 549, compare_at_price: 599, stock: 38, description: '16-core 3D V-Cache CPU engineered for the lowest latency in competitive play.', specs: { Cores: '16', Threads: '32', 'Base Clock': '4.2 GHz', 'Boost Clock': '5.7 GHz', Cache: '128MB', Socket: 'AM5', TDP: '120W' }, images: ['https://images.pexels.com/photos/2588757/pexels-photo-2588757.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.8, review_count: 156, is_featured: false, is_bestseller: true, created_at: '2026-02-05T00:00:00Z' },
    { id: 'p6', name: 'Nexus Ryzen 5 7600', slug: 'nexus-ryzen-5-7600', brand: 'Nexus', category_id: 'cat-cpu', price: 199, compare_at_price: 239, stock: 200, description: '6-core Zen 4 chip that delivers 1080p high-refresh without the price tag.', specs: { Cores: '6', Threads: '12', 'Base Clock': '3.8 GHz', 'Boost Clock': '5.1 GHz', Cache: '32MB', Socket: 'AM5', TDP: '65W' }, images: ['https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.6, review_count: 98, is_featured: false, is_bestseller: false, created_at: '2026-02-06T00:00:00Z' },
    { id: 'p7', name: 'Volt Apex Mechanical 75%', slug: 'volt-apex-mechanical-75', brand: 'Volt', category_id: 'cat-kb', price: 159, compare_at_price: 189, stock: 140, description: 'Hot-swap 75% mechanical keyboard with gasket mount and PBT keycaps.', specs: { Layout: '75% (82 keys)', Switches: 'Volt Linear Red, Volt Tactile Brown', Keycaps: 'PBT doubleshot', Connectivity: 'USB-C, Bluetooth, 2.4GHz', Battery: '4000mAh', RGB: 'Per-key' }, images: ['https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/303353/pexels-photo-303353.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.7, review_count: 187, is_featured: true, is_bestseller: true, created_at: '2026-02-07T00:00:00Z' },
    { id: 'p8', name: 'Volt Strike TKL RGB', slug: 'volt-strike-tkl-rgb', brand: 'Volt', category_id: 'cat-kb', price: 119, compare_at_price: 139, stock: 95, description: 'Tenkeyless RGB board with tactile brown switches and an aircraft-grade frame.', specs: { Layout: 'TKL (87 keys)', Switches: 'Volt Tactile Brown', Keycaps: 'ABS shine-through', Connectivity: 'USB-C', RGB: 'Per-key 16.8M', Frame: 'Aluminum' }, images: ['https://images.pexels.com/photos/303353/pexels-photo-303353.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.5, review_count: 134, is_featured: false, is_bestseller: true, created_at: '2026-02-08T00:00:00Z' },
    { id: 'p9', name: 'Nexus Slim Low Profile', slug: 'nexus-slim-low-profile', brand: 'Nexus', category_id: 'cat-kb', price: 89, compare_at_price: 109, stock: 300, description: 'Ultra-thin low-profile keyboard with scissor switches and a 6-month battery.', specs: { Layout: 'Full (104 keys)', Switches: 'Low-profile scissor', Keycaps: 'ABS', Connectivity: 'Bluetooth multi-device', Battery: '6 months', Backlight: 'White' }, images: ['https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.3, review_count: 67, is_featured: false, is_bestseller: false, created_at: '2026-02-09T00:00:00Z' },
    { id: 'p10', name: 'Volt Glide Pro Wireless', slug: 'volt-glide-pro-wireless', brand: 'Volt', category_id: 'cat-mice', price: 149, compare_at_price: 169, stock: 160, description: '54g wireless gaming mouse with a 36K optical sensor and 90-hour battery.', specs: { Sensor: 'Volt 36K Optical', Weight: '54g', DPI: '100 - 36000', Polling: '8000Hz', Battery: '90 hours', Buttons: '6 programmable' }, images: ['https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.9, review_count: 243, is_featured: true, is_bestseller: true, created_at: '2026-02-10T00:00:00Z' },
    { id: 'p11', name: 'Volt Pulse Lite', slug: 'volt-pulse-lite', brand: 'Volt', category_id: 'cat-mice', price: 59, compare_at_price: 79, stock: 400, description: 'Lightweight 70g gaming mouse with a precise 16K sensor and paracord cable.', specs: { Sensor: 'Volt 16K Optical', Weight: '70g', DPI: '100 - 16000', Polling: '1000Hz', Cable: 'Paracord', Buttons: '6 programmable' }, images: ['https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.6, review_count: 112, is_featured: false, is_bestseller: true, created_at: '2026-02-11T00:00:00Z' },
    { id: 'p12', name: 'Nexus Ergo Vertical', slug: 'nexus-ergo-vertical', brand: 'Nexus', category_id: 'cat-mice', price: 69, compare_at_price: 89, stock: 180, description: 'Vertical ergonomic mouse that relieves wrist strain for all-day work.', specs: { Sensor: 'Nexus 4200', Weight: '120g', DPI: '800 - 4200', Connectivity: 'USB-C, Bluetooth', Battery: '4 months', Buttons: '6' }, images: ['https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.2, review_count: 41, is_featured: false, is_bestseller: false, created_at: '2026-02-12T00:00:00Z' },
    { id: 'p13', name: 'Volt Curve 34 QHD', slug: 'volt-curve-34-qhd', brand: 'Volt', category_id: 'cat-mon', price: 699, compare_at_price: 799, stock: 24, description: '34-inch curved ultrawide with 165Hz, 1ms, and HDR400 for total immersion.', specs: { Panel: 'VA Curved 1500R', Size: '34 inch', Resolution: '3440 x 1440', 'Refresh Rate': '165Hz', Response: '1ms', HDR: 'DisplayHDR 400', Ports: '2x HDMI 2.0, 1x DP 1.4' }, images: ['https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.8, review_count: 78, is_featured: true, is_bestseller: true, created_at: '2026-02-13T00:00:00Z' },
    { id: 'p14', name: 'Volt Flat 27 240Hz', slug: 'volt-flat-27-240hz', brand: 'Volt', category_id: 'cat-mon', price: 429, compare_at_price: 479, stock: 52, description: '27-inch QHD IPS panel at 240Hz for esports-grade clarity and color.', specs: { Panel: 'IPS', Size: '27 inch', Resolution: '2560 x 1440', 'Refresh Rate': '240Hz', Response: '0.5ms', HDR: 'DisplayHDR 400', Ports: '2x HDMI 2.1, 1x DP 1.4' }, images: ['https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.7, review_count: 95, is_featured: false, is_bestseller: true, created_at: '2026-02-14T00:00:00Z' },
    { id: 'p15', name: 'Nexus 24 FHD', slug: 'nexus-24-fhd', brand: 'Nexus', category_id: 'cat-mon', price: 169, compare_at_price: 199, stock: 260, description: 'Reliable 24-inch 1080p 144Hz monitor for fast, fluid everyday play.', specs: { Panel: 'IPS', Size: '24 inch', Resolution: '1920 x 1080', 'Refresh Rate': '144Hz', Response: '1ms', Ports: '1x HDMI, 1x DP' }, images: ['https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.4, review_count: 58, is_featured: false, is_bestseller: false, created_at: '2026-02-15T00:00:00Z' },
    { id: 'p16', name: 'Volt Sonic Pro Wireless', slug: 'volt-sonic-pro-wireless', brand: 'Volt', category_id: 'cat-hs', price: 199, compare_at_price: 229, stock: 70, description: 'Wireless over-ear headset with 50mm drivers, spatial audio, and a 60-hour battery.', specs: { Drivers: '50mm', Connectivity: '2.4GHz, Bluetooth', Battery: '60 hours', Microphone: 'Detachable cardioid', Weight: '320g', RGB: 'Earcup' }, images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.7, review_count: 142, is_featured: true, is_bestseller: true, created_at: '2026-02-16T00:00:00Z' },
    { id: 'p17', name: 'Volt Boom Studio', slug: 'volt-boom-studio', brand: 'Volt', category_id: 'cat-hs', price: 129, compare_at_price: 149, stock: 110, description: 'Closed-back studio headset tuned for mixing, streaming, and detailed listening.', specs: { Drivers: '40mm', Connectivity: '3.5mm, USB-C', Microphone: 'Boom', Weight: '280g', Cable: '1.5m braided' }, images: ['https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.5, review_count: 73, is_featured: false, is_bestseller: false, created_at: '2026-02-17T00:00:00Z' },
    { id: 'p18', name: 'Nexus Buds Air', slug: 'nexus-buds-air', brand: 'Nexus', category_id: 'cat-hs', price: 79, compare_at_price: 99, stock: 320, description: 'True wireless earbuds with ANC, low-latency game mode, and 28 hours total play.', specs: { Drivers: '11mm', Connectivity: 'Bluetooth 5.3', Battery: '7h (28h with case)', ANC: 'Hybrid', Microphone: '4-mic', Latency: 'Game mode 55ms' }, images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.3, review_count: 89, is_featured: false, is_bestseller: true, created_at: '2026-02-18T00:00:00Z' },
    { id: 'p19', name: 'Volt Blade 16 Ultra', slug: 'volt-blade-16-ultra', brand: 'Volt', category_id: 'cat-lap', price: 2499, compare_at_price: 2799, stock: 18, description: '16-inch creator laptop with a mini-LED panel, RTX 4090, and 32GB DDR5.', specs: { CPU: 'Core i9-14900HX', GPU: 'RTX 4090 16GB', RAM: '32GB DDR5', Storage: '2TB NVMe', Display: '16 inch mini-LED 240Hz', Battery: '90Wh', Weight: '2.4kg' }, images: ['https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200','https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.9, review_count: 47, is_featured: true, is_bestseller: true, created_at: '2026-02-19T00:00:00Z' },
    { id: 'p20', name: 'Volt Air 14', slug: 'volt-air-14', brand: 'Volt', category_id: 'cat-lap', price: 1299, compare_at_price: 1499, stock: 35, description: '14-inch ultralight with a 2.8K OLED panel and all-day battery life.', specs: { CPU: 'Ryzen 7 8840U', GPU: 'Radeon 780M', RAM: '16GB LPDDR5', Storage: '1TB NVMe', Display: '14 inch 2.8K OLED 90Hz', Battery: '72Wh', Weight: '1.2kg' }, images: ['https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.7, review_count: 61, is_featured: false, is_bestseller: true, created_at: '2026-02-20T00:00:00Z' },
    { id: 'p21', name: 'Nexus Book Pro 15', slug: 'nexus-book-pro-15', brand: 'Nexus', category_id: 'cat-lap', price: 899, compare_at_price: 999, stock: 80, description: '15-inch workhorse laptop with a 165Hz IPS panel and discrete graphics.', specs: { CPU: 'Ryzen 7 7735HS', GPU: 'RTX 4060 8GB', RAM: '16GB DDR5', Storage: '512GB NVMe', Display: '15.6 inch 165Hz IPS', Battery: '70Wh', Weight: '1.9kg' }, images: ['https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.4, review_count: 35, is_featured: false, is_bestseller: false, created_at: '2026-02-21T00:00:00Z' },
    { id: 'p22', name: 'Volt NVMe 2TB Pro', slug: 'volt-nvme-2tb-pro', brand: 'Volt', category_id: 'cat-sto', price: 169, compare_at_price: 199, stock: 220, description: 'PCIe 4.0 NVMe SSD hitting 7400 MB/s read with a slim graphene heatsink.', specs: { Capacity: '2TB', Interface: 'PCIe 4.0 x4', Read: '7400 MB/s', Write: '6800 MB/s', Endurance: '1200 TBW', 'Form Factor': 'M.2 2280', Heatsink: 'Graphene' }, images: ['https://images.pexels.com/photos/278875/pexels-photo-278875.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.8, review_count: 167, is_featured: true, is_bestseller: true, created_at: '2026-02-22T00:00:00Z' },
    { id: 'p23', name: 'Volt SATA SSD 1TB', slug: 'volt-sata-ssd-1tb', brand: 'Volt', category_id: 'cat-sto', price: 79, compare_at_price: 99, stock: 350, description: 'Reliable 2.5-inch SATA SSD with 560 MB/s reads and a 3-year warranty.', specs: { Capacity: '1TB', Interface: 'SATA III', Read: '560 MB/s', Write: '530 MB/s', Endurance: '600 TBW', 'Form Factor': '2.5 inch', Warranty: '3 years' }, images: ['https://images.pexels.com/photos/278875/pexels-photo-278875.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.5, review_count: 88, is_featured: false, is_bestseller: true, created_at: '2026-02-23T00:00:00Z' },
    { id: 'p24', name: 'Nexus HDD 4TB', slug: 'nexus-hdd-4tb', brand: 'Nexus', category_id: 'cat-sto', price: 99, compare_at_price: 119, stock: 140, description: '4TB 7200RPM hard drive for bulk storage, backups, and media archives.', specs: { Capacity: '4TB', Interface: 'SATA III', RPM: '7200', Cache: '256MB', 'Form Factor': '3.5 inch', Warranty: '2 years' }, images: ['https://images.pexels.com/photos/278875/pexels-photo-278875.jpeg?auto=compress&cs=tinysrgb&w=1200'], rating: 4.2, review_count: 44, is_featured: false, is_bestseller: false, created_at: '2026-02-24T00:00:00Z' },
  ]

  const reviews = [
    { id: 'r1', product_id: 'p1', user_id: 'u1', author_name: 'Marcus T.', rating: 5, title: 'Absolute beast', body: 'Crushes every game I throw at it at 4K. The cooling is surprisingly quiet too.', created_at: '2026-03-01T00:00:00Z' },
    { id: 'r2', product_id: 'p1', user_id: 'u2', author_name: 'Priya K.', rating: 4, title: 'Great card, big', body: 'Make sure your case can fit it. Performance is incredible once installed.', created_at: '2026-03-05T00:00:00Z' },
    { id: 'r3', product_id: 'p7', user_id: 'u3', author_name: 'Dev N.', rating: 5, title: 'Best keyboard I have owned', body: 'The gasket mount feel is unreal. Hot-swap switches saved me when I wanted to try tactiles.', created_at: '2026-03-10T00:00:00Z' },
    { id: 'r4', product_id: 'p10', user_id: 'u4', author_name: 'Sara L.', rating: 5, title: 'Featherweight champion', body: '54g is ridiculous in the best way. My aim has never been better.', created_at: '2026-03-12T00:00:00Z' },
  ]

  const orders = [
    { id: 'ord-1', user_id: 'u1', status: 'delivered', total: 1158, subtotal: 999, shipping: 0, tax: 159, shipping_name: 'Marcus Turner', shipping_email: 'marcus@email.com', shipping_address: '120 Performance Ave', shipping_city: 'Austin', shipping_zip: '78701', shipping_country: 'United States', created_at: '2026-03-02T00:00:00Z', order_items: [{ id: 'oi1', order_id: 'ord-1', product_id: 'p1', name: 'Volt RX 7900 XTX Phantom', price: 999, quantity: 1, image_url: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1200' }] },
    { id: 'ord-2', user_id: 'u2', status: 'shipped', total: 318, subtotal: 278, shipping: 12, tax: 28, shipping_name: 'Priya Kapoor', shipping_email: 'priya@email.com', shipping_address: '55 Circuit Lane', shipping_city: 'San Jose', shipping_zip: '95110', shipping_country: 'United States', created_at: '2026-03-08T00:00:00Z', order_items: [{ id: 'oi2', order_id: 'ord-2', product_id: 'p7', name: 'Volt Apex Mechanical 75%', price: 159, quantity: 1, image_url: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=1200' }, { id: 'oi3', order_id: 'ord-2', product_id: 'p11', name: 'Volt Pulse Lite', price: 59, quantity: 2, image_url: 'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=1200' }] },
    { id: 'ord-3', user_id: 'u3', status: 'processing', total: 199, subtotal: 149, shipping: 12, tax: 38, shipping_name: 'Dev Nair', shipping_email: 'dev@email.com', shipping_address: '9 Keypress Rd', shipping_city: 'Seattle', shipping_zip: '98101', shipping_country: 'United States', created_at: '2026-03-15T00:00:00Z', order_items: [{ id: 'oi4', order_id: 'ord-3', product_id: 'p10', name: 'Volt Glide Pro Wireless', price: 149, quantity: 1, image_url: 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&w=1200' }] },
    { id: 'ord-4', user_id: 'u4', status: 'pending', total: 169, subtotal: 169, shipping: 0, tax: 0, shipping_name: 'Sara Lin', shipping_email: 'sara@email.com', shipping_address: '300 Frame St', shipping_city: 'Portland', shipping_zip: '97201', shipping_country: 'United States', created_at: '2026-03-20T00:00:00Z', order_items: [{ id: 'oi5', order_id: 'ord-4', product_id: 'p22', name: 'Volt NVMe 2TB Pro', price: 169, quantity: 1, image_url: 'https://images.pexels.com/photos/278875/pexels-photo-278875.jpeg?auto=compress&cs=tinysrgb&w=1200' }] },
  ]

  const profiles = [
    { id: 'u1', email: 'marcus@email.com', full_name: 'Marcus Turner', role: 'customer', phone: '+1 (555) 123-4567', created_at: '2026-02-25T00:00:00Z' },
    { id: 'u2', email: 'priya@email.com', full_name: 'Priya Kapoor', role: 'customer', phone: '+1 (555) 234-5678', created_at: '2026-02-26T00:00:00Z' },
    { id: 'u3', email: 'dev@email.com', full_name: 'Dev Nair', role: 'customer', phone: '+1 (555) 345-6789', created_at: '2026-02-27T00:00:00Z' },
    { id: 'u4', email: 'sara@email.com', full_name: 'Sara Lin', role: 'customer', phone: '+1 (555) 456-7890', created_at: '2026-02-28T00:00:00Z' },
  ]

  return { categories, products, reviews, orders, profiles }
}

function load() {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  const fresh = seed()
  localStorage.setItem(DB_KEY, JSON.stringify(fresh))
  return fresh
}

function save(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

function delay(ms = 100) {
  return new Promise((r) => setTimeout(r, ms))
}

// ─── Public API (mirrors the old supabase-based api.js) ───

export async function fetchCategories() {
  const db = load()
  await delay(50)
  return [...db.categories].sort((a, b) => a.name.localeCompare(b.name))
}

export async function fetchProducts({
  category = null,
  brand = null,
  search = null,
  minPrice = null,
  maxPrice = null,
  featured = null,
  bestseller = null,
  sort = 'newest',
  page = 1,
  perPage = 12,
} = {}) {
  const db = load()
  await delay(80)
  let list = db.products.map((p) => ({
    ...p,
    categories: db.categories.find((c) => c.id === p.category_id) || null,
  }))

  if (category) list = list.filter((p) => p.categories?.slug === category)
  if (brand) {
    const brands = Array.isArray(brand) ? brand : [brand]
    list = list.filter((p) => brands.includes(p.brand))
  }
  if (search) {
    const q = search.toLowerCase()
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
  }
  if (minPrice != null) list = list.filter((p) => p.price >= minPrice)
  if (maxPrice != null) list = list.filter((p) => p.price <= maxPrice)
  if (featured) list = list.filter((p) => p.is_featured)
  if (bestseller) list = list.filter((p) => p.is_bestseller)

  const sortMap = {
    newest: { key: 'created_at', dir: 'desc' },
    price_asc: { key: 'price', dir: 'asc' },
    price_desc: { key: 'price', dir: 'desc' },
    rating: { key: 'rating', dir: 'desc' },
    name: { key: 'name', dir: 'asc' },
  }
  const s = sortMap[sort] || sortMap.newest
  list.sort((a, b) => {
    const av = a[s.key]
    const bv = b[s.key]
    if (s.dir === 'asc') return av > bv ? 1 : -1
    return av < bv ? 1 : -1
  })

  const total = list.length
  const from = (page - 1) * perPage
  const data = list.slice(from, from + perPage)
  return { data, total }
}

export async function fetchProductBySlug(slug) {
  const db = load()
  await delay(60)
  const p = db.products.find((p) => p.slug === slug)
  if (!p) return null
  return { ...p, categories: db.categories.find((c) => c.id === p.category_id) || null }
}

export async function fetchRelatedProducts(categoryId, excludeId, limit = 6) {
  const db = load()
  await delay(50)
  return db.products.filter((p) => p.category_id === categoryId && p.id !== excludeId).slice(0, limit)
}

export async function fetchBrands() {
  const db = load()
  await delay(30)
  return [...new Set(db.products.map((p) => p.brand))].sort()
}

export async function fetchReviews(productId) {
  const db = load()
  await delay(40)
  return db.reviews.filter((r) => r.product_id === productId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export async function addReview(review) {
  const db = load()
  await delay(50)
  const newReview = { ...review, id: genId(), created_at: new Date().toISOString() }
  db.reviews.push(newReview)
  save(db)
  return { data: newReview, error: null }
}

export async function fetchProductsByIds(ids) {
  const db = load()
  await delay(40)
  if (!ids || ids.length === 0) return []
  return db.products.filter((p) => ids.includes(p.id))
}

// ─── Admin CRUD ───

export async function adminFetchProducts() {
  const db = load()
  await delay(60)
  return db.products.map((p) => ({
    ...p,
    categories: db.categories.find((c) => c.id === p.category_id) || null,
  })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export async function adminFetchProductById(id) {
  const db = load()
  await delay(40)
  return db.products.find((p) => p.id === id) || null
}

export async function adminCreateProduct(payload) {
  const db = load()
  await delay(80)
  const product = { ...payload, id: genId(), created_at: new Date().toISOString(), rating: 0, review_count: 0 }
  db.products.push(product)
  save(db)
  return { error: null }
}

export async function adminUpdateProduct(id, payload) {
  const db = load()
  await delay(80)
  const idx = db.products.findIndex((p) => p.id === id)
  if (idx === -1) return { error: 'not found' }
  db.products[idx] = { ...db.products[idx], ...payload }
  save(db)
  return { error: null }
}

export async function adminDeleteProduct(id) {
  const db = load()
  await delay(60)
  db.products = db.products.filter((p) => p.id !== id)
  save(db)
  return { error: null }
}

export async function adminFetchCategories() {
  const db = load()
  await delay(50)
  return [...db.categories].sort((a, b) => a.name.localeCompare(b.name))
}

export async function adminCreateCategory(payload) {
  const db = load()
  await delay(60)
  const cat = { ...payload, id: genId(), created_at: new Date().toISOString() }
  db.categories.push(cat)
  save(db)
  return { error: null }
}

export async function adminUpdateCategory(id, payload) {
  const db = load()
  await delay(60)
  const idx = db.categories.findIndex((c) => c.id === id)
  if (idx === -1) return { error: 'not found' }
  db.categories[idx] = { ...db.categories[idx], ...payload }
  save(db)
  return { error: null }
}

export async function adminDeleteCategory(id) {
  const db = load()
  await delay(50)
  db.categories = db.categories.filter((c) => c.id !== id)
  db.products.forEach((p) => { if (p.category_id === id) p.category_id = null })
  save(db)
  return { error: null }
}

export async function adminFetchOrders() {
  const db = load()
  await delay(60)
  return [...db.orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export async function adminUpdateOrderStatus(id, status) {
  const db = load()
  await delay(50)
  const idx = db.orders.findIndex((o) => o.id === id)
  if (idx === -1) return { error: 'not found' }
  db.orders[idx].status = status
  save(db)
  return { error: null }
}

export async function adminFetchProfiles() {
  const db = load()
  await delay(50)
  return [...db.profiles].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export async function adminFetchAllOrders() {
  const db = load()
  await delay(50)
  return db.orders
}

// ─── User orders (for profile) ───

export async function fetchUserOrders(userId) {
  const db = load()
  await delay(50)
  return db.orders.filter((o) => o.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export async function createOrder(orderData, items) {
  const db = load()
  await delay(100)
  const order = { ...orderData, id: genId(), created_at: new Date().toISOString(), order_items: items }
  db.orders.push(order)
  save(db)
  return { data: order, error: null }
}

// ─── Profile ───

export async function fetchProfile(userId) {
  const db = load()
  await delay(30)
  return db.profiles.find((p) => p.id === userId) || null
}

export async function updateProfile(userId, updates) {
  const db = load()
  await delay(50)
  const idx = db.profiles.findIndex((p) => p.id === userId)
  if (idx === -1) return { error: 'not found' }
  db.profiles[idx] = { ...db.profiles[idx], ...updates }
  save(db)
  return { data: db.profiles[idx], error: null }
}

// ─── Addresses ───

const ADDR_KEY = 'volt-addresses'

export async function fetchAddresses(userId) {
  await delay(30)
  try {
    const all = JSON.parse(localStorage.getItem(ADDR_KEY) || '{}')
    return all[userId] || []
  } catch { return [] }
}

export async function addAddress(userId, address) {
  await delay(40)
  try {
    const all = JSON.parse(localStorage.getItem(ADDR_KEY) || '{}')
    const list = all[userId] || []
    const newAddr = { ...address, id: genId(), created_at: new Date().toISOString() }
    list.push(newAddr)
    all[userId] = list
    localStorage.setItem(ADDR_KEY, JSON.stringify(all))
    return newAddr
  } catch { return null }
}

export async function deleteAddress(userId, addressId) {
  await delay(30)
  try {
    const all = JSON.parse(localStorage.getItem(ADDR_KEY) || '{}')
    all[userId] = (all[userId] || []).filter((a) => a.id !== addressId)
    localStorage.setItem(ADDR_KEY, JSON.stringify(all))
  } catch { /* ignore */ }
}
