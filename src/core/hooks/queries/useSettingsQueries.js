import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/core/services/supabase'
import { toast } from 'sonner'

const SETTINGS_QUERY_KEY = ['store_settings']

export function useStoreSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .single()
      
      if (error) {
        // If table doesn't exist yet or no rows, return defaults
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          return {
            promo_active: false,
            promo_min_amount: 120000,
            promo_discount_percentage: 15,
            promo_installments: 3
          }
        }
        throw error
      }
      return data
    }
  })
}

export function useUpdateStoreSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newSettings) => {
      // First try to check if a row exists
      const { data: existing, error: checkError } = await supabase
        .from('store_settings')
        .select('id')
        .limit(1)
        .maybeSingle()
        
      if (existing) {
        const { data, error } = await supabase
          .from('store_settings')
          .update(newSettings)
          .eq('id', existing.id)
          .select()
          .single()
          
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('store_settings')
          .insert([newSettings])
          .select()
          .single()
          
        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY })
      toast.success('Configuración actualizada exitosamente')
    },
    onError: (error) => {
      toast.error('Error al actualizar la configuración: ' + error.message)
    }
  })
}
