export const REQUEST_STATUS = {
  pending: { label: 'Pendiente', variant: 'default' },
  contacted: { label: 'Contactado', variant: 'secondary' },
  closed: { label: 'Cerrado', variant: 'outline' },
}

export const REQUEST_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'closed', label: 'Cerrado' },
]

export const CSV_COLUMNS = {
  name: 'Nombre',
  category: 'Categoría',
  price: 'Precio',
  stock: 'Stock',
  description: 'Descripción',
  sku: 'SKU',
}
