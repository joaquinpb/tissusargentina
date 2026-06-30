export const APP_ROUTES = {
  HOME: () => '/',
  CATALOG: (category) => category ? `/catalogo?categoria=${category}` : '/catalogo',
  PROMOTIONS: () => '/promociones',
  PRODUCT: (slug) => `/productos/${slug}`,
  CONTACT: () => '/contacto',
  LOGIN: () => '/login',
  ACCOUNT: () => '/mi-cuenta',
  ADMIN: {
    DASHBOARD: () => '/admin',
    PRODUCTS: () => '/admin/productos',
    CATEGORIES: () => '/admin/categorias',
    REQUESTS: () => '/admin/consultas',
  },
}
