import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, FolderTree } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useToast } from '../../context/ToastContext'
import { slugify, classNames } from '../../lib/utils'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null | {id?, name, slug, description, image_url}
  const [deleteId, setDeleteId] = useState(null)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
    const { data: products } = await supabase.from('products').select('category_id')
    const c = {}
    products?.forEach((p) => { if (p.category_id) c[p.category_id] = (c[p.category_id] || 0) + 1 })
    setCounts(c)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    if (!editing.name) return
    const payload = {
      name: editing.name,
      slug: editing.slug || slugify(editing.name),
      description: editing.description || null,
      image_url: editing.image_url || null,
    }
    if (editing.id) {
      const { error } = await supabase.from('categories').update(payload).eq('id', editing.id)
      if (error) { toast.error('Could not update category'); return }
      toast.success('Category updated')
    } else {
      const { error } = await supabase.from('categories').insert(payload)
      if (error) { toast.error('Could not create category'); return }
      toast.success('Category created')
    }
    setEditing(null)
    load()
  }

  const confirmDelete = async () => {
    const { error } = await supabase.from('categories').delete().eq('id', deleteId)
    if (error) { toast.error('Could not delete category'); return }
    toast.success('Category deleted')
    setDeleteId(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl tracking-tight">Categories</h1>
          <p className="text-ink-500 mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={() => setEditing({ name: '', slug: '', description: '', image_url: '' })}
          className="btn-primary"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] skeleton" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-white border border-ink-100">
          <FolderTree size={40} className="mx-auto text-ink-200 mb-3" />
          <p className="text-ink-500">No categories yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <motion.div
              key={c.id}
              layout
              className="group relative bg-white border border-ink-100 overflow-hidden"
            >
              <div className="aspect-[3/4] overflow-hidden bg-ink-100">
                {c.image_url && (
                  <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm">{c.name}</h3>
                <p className="text-xs text-ink-500 mt-1">{counts[c.id] || 0} products</p>
              </div>
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditing(c)}
                  className="w-8 h-8 bg-white flex items-center justify-center shadow hover:bg-ink-100"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteId(c.id)}
                  className="w-8 h-8 bg-white flex items-center justify-center shadow hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit/Create modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink-950/50 z-50 flex items-center justify-center p-6"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-xl">{editing.id ? 'Edit Category' : 'New Category'}</h3>
                <button onClick={() => setEditing(null)}><X size={20} /></button>
              </div>
              <form onSubmit={save} className="space-y-4">
                <div>
                  <label className="label-over mb-2 block">Name</label>
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: slugify(e.target.value) })}
                    className="w-full border-2 border-ink-200 px-4 py-2.5 text-sm focus:border-ink-950 outline-none"
                  />
                </div>
                <div>
                  <label className="label-over mb-2 block">Slug</label>
                  <input
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    className="w-full border-2 border-ink-200 px-4 py-2.5 text-sm focus:border-ink-950 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="label-over mb-2 block">Description</label>
                  <textarea
                    value={editing.description || ''}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={2}
                    className="w-full border-2 border-ink-200 px-4 py-2.5 text-sm focus:border-ink-950 outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="label-over mb-2 block">Image URL</label>
                  <input
                    value={editing.image_url || ''}
                    onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                    placeholder="https://images.pexels.com/…"
                    className="w-full border-2 border-ink-200 px-4 py-2.5 text-sm focus:border-ink-950 outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary flex-1">
                    {editing.id ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={() => setEditing(null)} className="btn-outline">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink-950/50 z-50 flex items-center justify-center p-6"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-6 max-w-sm w-full"
            >
              <div className="w-12 h-12 bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <Trash2 size={22} />
              </div>
              <h3 className="font-display text-xl mb-2">Delete category?</h3>
              <p className="text-sm text-ink-500 mb-6">Products in this category will keep their data but lose their category link.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
                <button onClick={confirmDelete} className="btn-accent flex-1">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
