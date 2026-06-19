import { useState } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { slugify } from '@/core/lib/utils'

export function useCsvImport(categories = []) {
  const [rows, setRows] = useState([])
  const [errors, setErrors] = useState([])

  const parseFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase()

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => processRows(result.data),
      })
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const wb = XLSX.read(e.target.result, { type: 'binary' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' })
        processRows(data)
      }
      reader.readAsBinaryString(file)
    }
  }

  const processRows = (raw) => {
    const errs = []
    const processed = raw.map((row, i) => {
      const name = row['name'] || row['Nombre'] || row['nombre'] || ''
      const categoryName = row['category'] || row['Categoría'] || row['categoria'] || ''
      const category = categories.find(
        (c) => c.name.toLowerCase() === categoryName.toLowerCase()
      )

      if (!name) errs.push(`Fila ${i + 1}: falta el nombre`)

      // Parse images (comma-separated URLs)
      const rawImages = row['images'] || row['Imágenes'] || row['imagenes'] || row['Imágenes (separadas por coma)'] || row['imagenes_urls'] || ''
      let imagesList = []
      if (typeof rawImages === 'string' && rawImages.trim()) {
        imagesList = rawImages.split(',').map(img => img.trim()).filter(Boolean)
      } else if (typeof rawImages === 'number') {
        imagesList = [String(rawImages)]
      } else if (Array.isArray(rawImages)) {
        imagesList = rawImages.map(img => String(img).trim()).filter(Boolean)
      }

      return {
        name,
        slug: slugify(name),
        category_id: category?.id || null,
        price: parseFloat(row['price'] || row['Precio'] || row['precio']) || null,
        stock: parseInt(row['stock'] || row['Stock']) || 0,
        description: row['description'] || row['Descripción'] || row['descripcion'] || '',
        sku: row['sku'] || row['SKU'] || '',
        is_active: true,
        images: imagesList,
        specifications: {},
      }
    })

    setErrors(errs)
    setRows(processed)
  }

  const reset = () => {
    setRows([])
    setErrors([])
  }

  return { rows, errors, parseFile, reset }
}
