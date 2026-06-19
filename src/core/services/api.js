import { supabase } from './supabase'

// ─── PRODUCTOS (público) ─────────────────────────────────────────────────────

export async function fetchActiveProducts({ categoryId, search } = {}) {
  let query = supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (categoryId) query = query.eq('category_id', categoryId)
  if (search) query = query.ilike('name', `%${search}%`)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function fetchProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function fetchFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8)
  if (error) throw error
  return data
}

// ─── CATEGORÍAS (público) ────────────────────────────────────────────────────

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

// ─── CONSULTAS ───────────────────────────────────────────────────────────────

export async function submitContactRequest(payload) {
  const { error } = await supabase.from('contact_requests').insert(payload)
  if (error) throw error
}

export async function fetchUserRequests(userId) {
  const { data, error } = await supabase
    .from('contact_requests')
    .select('*, products(id, name, slug, images, price, sku)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// ─── PRODUCTOS (admin) ───────────────────────────────────────────────────────

export async function fetchAdminProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(id, name, slug)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createProduct(payload) {
  const { data, error } = await supabase
    .from('products')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProduct(id, payload) {
  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function upsertProducts(rows) {
  const { data, error } = await supabase
    .from('products')
    .upsert(rows, { onConflict: 'slug', ignoreDuplicates: false })
    .select()
  if (error) throw error
  return data
}

// ─── IMÁGENES (Storage) ──────────────────────────────────────────────────────

export async function uploadProductImage(file, productId) {
  const ext = file.name.split('.').pop()
  const path = `products/${productId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('tissus-images').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('tissus-images').getPublicUrl(path)
  return data.publicUrl
}

export async function deleteProductImage(url) {
  const path = url.split('/tissus-images/')[1]
  if (!path) return
  await supabase.storage.from('tissus-images').remove([path])
}

export async function uploadCategoryImage(file, categoryId) {
  const ext = file.name.split('.').pop()
  const path = `categories/${categoryId || Date.now()}.${ext}`
  const { error } = await supabase.storage.from('tissus-images').upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('tissus-images').getPublicUrl(path)
  return data.publicUrl
}

// ─── CATEGORÍAS (admin) ──────────────────────────────────────────────────────

export async function fetchAdminCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

export async function createCategory(payload) {
  const { data, error } = await supabase
    .from('categories')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCategory(id, payload) {
  const { data, error } = await supabase
    .from('categories')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}

// ─── CONSULTAS (admin) ───────────────────────────────────────────────────────

export async function fetchAdminRequests(status) {
  let query = supabase
    .from('contact_requests')
    .select('*, products(id, name, slug)')
    .order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function updateRequest(id, payload) {
  const { data, error } = await supabase
    .from('contact_requests')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── PERFIL ──────────────────────────────────────────────────────────────────

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, phone, avatar_url')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function updateProfile(userId, payload) {
  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}
