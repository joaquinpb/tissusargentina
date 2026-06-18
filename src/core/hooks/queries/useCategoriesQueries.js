import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchCategories,
  fetchAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/core/services/api'

const KEYS = {
  categories: ['categories'],
  adminCategories: ['categories', 'admin'],
}

export function useCategories() {
  return useQuery({
    queryKey: KEYS.categories,
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  })
}

export function useAdminCategories() {
  return useQuery({
    queryKey: KEYS.adminCategories,
    queryFn: fetchAdminCategories,
  })
}

export function useCategoryMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['categories'] })

  const create = useMutation({ mutationFn: createCategory, onSuccess: invalidate })
  const update = useMutation({
    mutationFn: ({ id, ...payload }) => updateCategory(id, payload),
    onSuccess: invalidate,
  })
  const remove = useMutation({ mutationFn: deleteCategory, onSuccess: invalidate })

  return { create, update, remove }
}
