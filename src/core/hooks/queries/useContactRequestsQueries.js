import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  submitContactRequest,
  fetchUserRequests,
  fetchAdminRequests,
  updateRequest,
} from '@/core/services/api'

const KEYS = {
  userRequests: (userId) => ['contact_requests', 'user', userId],
  adminRequests: (status) => ['contact_requests', 'admin', status],
}

export function useUserRequests(userId) {
  return useQuery({
    queryKey: KEYS.userRequests(userId),
    queryFn: () => fetchUserRequests(userId),
    enabled: Boolean(userId),
  })
}

export function useAdminRequests(status) {
  return useQuery({
    queryKey: KEYS.adminRequests(status),
    queryFn: () => fetchAdminRequests(status),
  })
}

export function useContactMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['contact_requests'] })

  const submit = useMutation({ mutationFn: submitContactRequest, onSuccess: invalidate })
  const update = useMutation({
    mutationFn: ({ id, ...payload }) => updateRequest(id, payload),
    onSuccess: invalidate,
  })

  return { submit, update }
}
