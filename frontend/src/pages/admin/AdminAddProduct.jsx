import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Plus, Trash2, X } from 'lucide-react'
import { adminFetchCategories, adminFetchProductById, adminCreateProduct, adminUpdateProduct } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import { slugify, classNames } from '../../lib/utils'

export default function AdminAddProduct() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const [categories, setCategories] = useState([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category_id: '',
    price: '',
    compare_at_price: '',
    stock: '',
    description: '',
    is_featured: false,
    is_bestseller: false,
  })
  const [images, setImages] = useState([''])
  const [specs, setSpecs] = useState([{ key: '', value: '' }])

  useEffect(() => {
    adminFetchCategories().then(setCategories)
    if (isEdit) {
      adminFetchProductById(id).then((data) => {
        if (data) {
          setForm({
            name: data.name,
            brand: data.brand,
            category_id: data.category_id || '',
            price: data.price,
            compare_at_price: data.compare_at_price || '',
            stock: data.stock,
            description: data.description || '',
            is_featured: data.is_featured,
            is_bestseller: data.is_bestseller,
          })
          setImages(data.images?.length ? data.images : [''])
          setSpecs(
            Object.entries(data.specs || {}).map(([key, value]) => ({ key, value })) ||
            [{ key: '', value: '' }]
          )
        }
        setLoading(false)
      })
    }
  }, [id, isEdit])

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const updateImage = (i, value) => {
    setImages((prev) => prev.map((img, idx) => (idx === i ? value : img)))
  }
  const addImage = () => setImages((prev) => [...prev, ''])
  const removeImage = (i) => setImages((prev) => prev.filter((_, idx) => idx !== i))

  const updateSpec = (i, key, value) => {
    setSpecs((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)))
  }
  const addSpec = () => setSpecs((prev) => [...prev, { key: '', value: '' }])
  const removeSpec = (i) => setSpecs((prev) => prev.filter((_, idx) => idx !== i))

  const save = async (e) => {
    e.preventDefault()
    if (!form.name || !form.brand || !form.price) {
      toast.error('Name, brand, and price are required')
      return
    }
    setSaving(true)
    const specsObj = {}
    specs.filter((s) => s.key).forEach((s) => { specsObj[s.key] = s.value })
    const cleanImages = images.filter((i) => i.trim())

    const payload = {
      name: form.name,
      slug: slugify(form.name),
      brand: form.brand,
      category_id: form.category_id || null,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      stock: Number(form.stock) || 0,
      description: form.description,
      specs: specsObj,
      images: cleanImages,
      is_featured: form.is_featured,
      is_bestseller: form.is_bestseller,
    }

    if (isEdit) {
      const { error } = await adminUpdateProduct(id, payload)
      setSaving(false)
      if (error) { toast.error('Could not update product'); return }
      toast.success('Product updated')
    } else {
      const { error } = await adminCreateProduct(payload)
      setSaving(false)
      if (error) { toast.error('Could not create product'); return }
      toast.success('Product created')
    }
    navigate('/admin/products')
  }

  if (loading) {
    return <div className="max-w-2xl space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-14 skeleton" />)}</div>
  }

  return (
    <div className="max-w-4xl">
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-500 hover:text-ink-950 transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <h1 className="font-display text-3xl lg:text-4xl tracking-tight mb-8">
        {isEdit ? 'Edit Product' : 'Add Product'}
      </h1>

      <form onSubmit={save} className="space-y-8">
        {/* Basics */}
        <Section title="Product Details">
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="Name" required>
              <input value={form.name} onChange={(e) => update('name', e.target.value)} className={inputCls} />
            </FormField>
            <FormField label="Brand" required>
              <input value={form.brand} onChange={(e) => update('brand', e.target.value)} className={inputCls} />
            </FormField>
            <FormField label="Category">
              <select value={form.category_id} onChange={(e) => update('category_id', e.target.value)} className={inputCls}>
                <option value="">Select category…</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </FormField>
            <FormField label="Stock">
              <input type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} className={inputCls} />
            </FormField>
          </div>
          <FormField label="Description">
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} className={classNames(inputCls, 'resize-none')} />
          </FormField>
        </Section>

        {/* Pricing */}
        <Section title="Pricing">
          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="Price ($)" required>
              <input type="number" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} className={inputCls} />
            </FormField>
            <FormField label="Compare-at Price ($)" hint="Original price for discount display">
              <input type="number" step="0.01" value={form.compare_at_price} onChange={(e) => update('compare_at_price', e.target.value)} className={inputCls} />
            </FormField>
          </div>
          <div className="flex gap-6 pt-2">
            <Toggle label="Featured" checked={form.is_featured} onChange={(v) => update('is_featured', v)} />
            <Toggle label="Bestseller" checked={form.is_bestseller} onChange={(v) => update('is_bestseller', v)} />
          </div>
        </Section>

        {/* Images */}
        <Section title="Images" subtitle="Paste image URLs (Pexels, Unsplash, etc.)">
          <div className="space-y-3">
            {images.map((img, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-16 h-16 bg-ink-100 overflow-hidden shrink-0 border border-ink-200">
                  {img && <img src={img} alt="" className="w-full h-full object-cover" />}
                </div>
                <input
                  value={img}
                  onChange={(e) => updateImage(i, e.target.value)}
                  placeholder="https://images.pexels.com/…"
                  className={inputCls}
                />
                {images.length > 1 && (
                  <button type="button" onClick={() => removeImage(i)} className="p-2 text-ink-400 hover:text-red-600 transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addImage} className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent-600 hover:underline">
              <Plus size={16} /> Add Image
            </button>
          </div>
        </Section>

        {/* Specs */}
        <Section title="Specifications" subtitle="Key/value pairs shown on the product page">
          <div className="space-y-3">
            {specs.map((spec, i) => (
              <div key={i} className="flex gap-3">
                <input
                  value={spec.key}
                  onChange={(e) => updateSpec(i, 'key', e.target.value)}
                  placeholder="Key (e.g. Memory)"
                  className={classNames(inputCls, 'flex-1')}
                />
                <input
                  value={spec.value}
                  onChange={(e) => updateSpec(i, 'value', e.target.value)}
                  placeholder="Value (e.g. 24GB GDDR6)"
                  className={classNames(inputCls, 'flex-1')}
                />
                {specs.length > 1 && (
                  <button type="button" onClick={() => removeSpec(i)} className="p-2 text-ink-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addSpec} className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent-600 hover:underline">
              <Plus size={16} /> Add Spec
            </button>
          </div>
        </Section>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="btn-primary text-base px-8">
            <Save size={18} /> {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <Link to="/admin/products" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  )
}

const inputCls = 'w-full border-2 border-ink-200 px-4 py-2.5 text-sm focus:border-ink-950 outline-none transition-colors bg-white'

function Section({ title, subtitle, children }) {
  return (
    <div className="bg-white p-6 border border-ink-100">
      <div className="mb-5">
        <h2 className="font-display text-lg">{title}</h2>
        {subtitle && <p className="text-xs text-ink-400 mt-1">{subtitle}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

function FormField({ label, required, hint, children }) {
  return (
    <div>
      <label className="label-over mb-2 block">
        {label}{required && <span className="text-accent-500"> *</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-400 mt-1">{hint}</p>}
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={classNames(
          'w-10 h-6 rounded-full transition-colors relative',
          checked ? 'bg-ink-950' : 'bg-ink-200'
        )}
      >
        <motion.span
          layout
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      <span className="text-sm font-semibold">{label}</span>
    </label>
  )
}
