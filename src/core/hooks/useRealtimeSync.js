import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/core/services/supabase'

export function useRealtimeSync() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const productsChannel = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['products'] })
        }
      )
      .subscribe()

    const categoriesChannel = supabase
      .channel('public:categories')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['categories'] })
        }
      )
      .subscribe()

    const contactRequestsChannel = supabase
      .channel('public:contact_requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_requests' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['contact_requests'] })
        }
      )
      .subscribe()

    const settingsChannel = supabase
      .channel('public:store_settings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'store_settings' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['store_settings'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(productsChannel)
      supabase.removeChannel(categoriesChannel)
      supabase.removeChannel(contactRequestsChannel)
      supabase.removeChannel(settingsChannel)
    }
  }, [queryClient])
}
