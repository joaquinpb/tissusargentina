import { ContactForm } from '@/features/product-detail/components/ContactForm'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <h1 className="text-3xl font-bold mb-2">Contacto</h1>
      <p className="text-muted-foreground mb-8">
        Completá el formulario y nos comunicamos a la brevedad.
      </p>
      <ContactForm product={null} />
    </div>
  )
}
