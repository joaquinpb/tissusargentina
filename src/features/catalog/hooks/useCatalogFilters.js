import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useCatalogFilters(products = []) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState('name_asc')

  const selectedCategory = searchParams.get('categoria') || ''

  const setCategory = (slug) => {
    if (slug) setSearchParams({ categoria: slug })
    else setSearchParams({})
  }

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (selectedCategory && p.categories?.slug !== selectedCategory) return false
      if (inStockOnly && p.stock <= 0) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })

    result.sort((a, b) => {
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name)
      } else if (sortBy === 'price_asc') {
        return a.price - b.price
      } else if (sortBy === 'price_desc') {
        return b.price - a.price
      }
      return 0
    })

    return result
  }, [products, selectedCategory, inStockOnly, search, sortBy])

  return { search, setSearch, selectedCategory, setCategory, inStockOnly, setInStockOnly, sortBy, setSortBy, filtered }
}
