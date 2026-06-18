import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useCatalogFilters(products = []) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)

  const selectedCategory = searchParams.get('categoria') || ''

  const setCategory = (slug) => {
    if (slug) setSearchParams({ categoria: slug })
    else setSearchParams({})
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.categories?.slug !== selectedCategory) return false
      if (inStockOnly && p.stock <= 0) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [products, selectedCategory, inStockOnly, search])

  return { search, setSearch, selectedCategory, setCategory, inStockOnly, setInStockOnly, filtered }
}
