import { supabase } from './supabaseClient'

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  if (error) return []
  return data
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
  let query = supabase
    .from('products')
    .select('*, categories!inner(slug, name)', { count: 'exact' })

  if (category) query = query.eq('categories.slug', category)
  if (brand) query = query.in('brand', Array.isArray(brand) ? brand : [brand])
  if (search) query = query.ilike('name', `%${search}%`)
  if (minPrice != null) query = query.gte('price', minPrice)
  if (maxPrice != null) query = query.lte('price', maxPrice)
  if (featured) query = query.eq('is_featured', true)
  if (bestseller) query = query.eq('is_bestseller', true)

  const sortMap = {
    newest: { column: 'created_at', ascending: false },
    price_asc: { column: 'price', ascending: true },
    price_desc: { column: 'price', ascending: false },
    rating: { column: 'rating', ascending: false },
    name: { column: 'name', ascending: true },
  }
  const s = sortMap[sort] || sortMap.newest
  query = query.order(s.column, { ascending: s.ascending })

  const from = (page - 1) * perPage
  const to = from + perPage - 1
  query = query.range(from, to)

  const { data, error, count } = await query
  if (error) return { data: [], total: 0 }
  return { data, total: count || 0 }
}

export async function fetchProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug, name)')
    .eq('slug', slug)
    .maybeSingle()
  if (error) return null
  return data
}

export async function fetchRelatedProducts(categoryId, excludeId, limit = 6) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .limit(limit)
  if (error) return []
  return data
}

export async function fetchBrands() {
  const { data, error } = await supabase
    .from('products')
    .select('brand')
    .order('brand')
  if (error) return []
  return [...new Set(data.map((d) => d.brand))]
}

export async function fetchReviews(productId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data
}

export async function addReview(review) {
  const { data, error } = await supabase.from('reviews').insert(review).select().maybeSingle()
  return { data, error }
}

export async function fetchProductsByIds(ids) {
  if (!ids || ids.length === 0) return []
  const { data, error } = await supabase.from('products').select('*').in('id', ids)
  if (error) return []
  return data
}
