import { ContactForm } from '@/features/product-detail/components/ContactForm'
import { MapPin, Phone } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Contacto</h1>
      <p className="text-muted-foreground mb-8">
        Completá el formulario para comunicarte con nosotros o visitanos en nuestro local.
      </p>
      
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <ContactForm product={null} />
        </div>
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg">Teléfonos</h3>
              <p className="text-muted-foreground">
                <span className="font-medium">Celular:</span> +54 9 11 2258-8537
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Local:</span> +54 11 4585-7802
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg">Nuestra dirección</h3>
              <p className="text-muted-foreground">Av. San Martin 3280, CABA</p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-sm h-[350px]">
            <iframe 
              src="https://maps.google.com/maps?q=Av.+San+Martin+3280,+CABA&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}
