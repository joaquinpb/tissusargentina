import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchActiveProducts,
  fetchProductBySlug,
  fetchFeaturedProducts,
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  upsertProducts,
} from '@/core/services/api'

const KEYS = {
  activeProducts: (filters) => ['products', 'active', filters],
  product: (slug) => ['products', slug],
  featured: ['products', 'featured'],
  adminProducts: ['products', 'admin'],
}

export function useActiveProducts(filters = {}) {
  return useQuery({
    queryKey: KEYS.activeProducts(filters),
    queryFn: () => fetchActiveProducts(filters),
  })
}

export function useProductBySlug(slug) {
  return useQuery({
    queryKey: KEYS.product(slug),
    queryFn: () => fetchProductBySlug(slug),
    enabled: Boolean(slug),
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: KEYS.featured,
    queryFn: fetchFeaturedProducts,
  })
}

export function useAdminProducts() {
  return useQuery({
    queryKey: KEYS.adminProducts,
    queryFn: fetchAdminProducts,
  })
}

export function useProductMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['products'] })

  const create = useMutation({ mutationFn: createProduct, onSuccess: invalidate })
  const update = useMutation({
    mutationFn: ({ id, ...payload }) => updateProduct(id, payload),
    onSuccess: invalidate,
  })
  const remove = useMutation({ mutationFn: deleteProduct, onSuccess: invalidate })
  const bulkUpsert = useMutation({ mutationFn: upsertProducts, onSuccess: invalidate })

  return { create, update, remove, bulkUpsert }
}
