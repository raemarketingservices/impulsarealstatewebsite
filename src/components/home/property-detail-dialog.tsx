'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, BedDouble, Bath, Maximize, MapPin, Star, Car, ChevronLeft, ChevronRight,
  CheckCircle2, MessageCircle, Phone, Mail, Share2, Heart, Calendar, TrendingUp
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPrice } from './property-card'
import { toast } from 'sonner'

interface PropertyDetail {
  id: string
  title: string
  description: string
  type: string
  status: string
  operation: string
  price: number
  currency: string
  bedrooms: number
  bathrooms: number
  area: number
  parking: number
  location: string
  city: string
  zone: string
  images: string
  features: string
  featured: boolean
  gallery: string[]
  enrichedDescription: string[]
  whatsappNumber: string
  agent?: {
    name: string
    title: string
    photoUrl: string
    phone: string
    email: string
  } | null
}

const TYPE_LABELS: Record<string, string> = {
  VILLA: 'Villa',
  HOUSE: 'Casa',
  APARTMENT: 'Apartamento',
  COMMERCIAL: 'Comercial',
  LAND: 'Terreno',
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.982 11.982 0 005.683 1.448h.005c6.582 0 11.94-5.335 11.943-11.893a11.821 11.821 0 00-3.416-8.452z"/>
    </svg>
  )
}

export function PropertyDetailDialog() {
  const { propertyDetail, closePropertyDetail } = useAppStore()
  const [property, setProperty] = React.useState<PropertyDetail | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [activeImage, setActiveImage] = React.useState(0)
  const [liked, setLiked] = React.useState(false)

  const features: string[] = React.useMemo(() => {
    if (!property) return []
    try { return JSON.parse(property.features) } catch { return [] }
  }, [property])

  React.useEffect(() => {
    if (propertyDetail.open && propertyDetail.propertyId) {
      setLoading(true)
      setProperty(null)
      setActiveImage(0)
      fetch(`/api/properties/${propertyDetail.propertyId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setProperty(d.data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [propertyDetail.open, propertyDetail.propertyId])

  const handleWhatsApp = () => {
    if (!property) return
    const msg = encodeURIComponent(
      `Hola, estoy interesado en la propiedad "${property.title}" (${formatPrice(property.price)}). ¿Podrían darme más información?`
    )
    window.open(`https://wa.me/${property.whatsappNumber}?text=${msg}`, '_blank')
    toast.success('Abriendo WhatsApp', { description: 'Te conectaremos con un asesor' })
  }

  const handleShare = () => {
    if (!property) return
    if (navigator.share) {
      navigator.share({ title: property.title, text: property.description })
    } else {
      navigator.clipboard.writeText(property.title)
      toast.success('Enlace copiado al portapapeles')
    }
  }

  const gallery = property?.gallery || []

  return (
    <Dialog open={propertyDetail.open} onOpenChange={(o) => !o && closePropertyDetail()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden gap-0 max-h-[92vh] overflow-y-auto">
        <DialogTitle className="sr-only">{property?.title || 'Detalle de propiedad'}</DialogTitle>
        <DialogDescription className="sr-only">
          Información detallada de la propiedad, galería de fotos y contacto con el asesor.
        </DialogDescription>

        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : property ? (
          <div className="flex flex-col">
            {/* Gallery */}
            <div className="relative bg-muted">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={gallery[activeImage] || gallery[0]}
                      alt={`${property.title} - foto ${activeImage + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 1024px"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                {/* Top badges */}
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  <Badge className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold">
                    {TYPE_LABELS[property.type] || property.type}
                  </Badge>
                  {property.featured && (
                    <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Star className="h-3 w-3 mr-1" fill="currentColor" /> Destacada
                    </Badge>
                  )}
                </div>

                {/* Top right actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => { setLiked(!liked); toast.success(liked ? 'Removido de favoritos' : 'Añadido a favoritos') }}
                    className="h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-card/90 transition-colors"
                    aria-label="Favorito"
                  >
                    <Heart className={`h-5 w-5 ${liked ? 'fill-destructive text-destructive' : 'text-foreground'}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-card/90 transition-colors"
                    aria-label="Compartir"
                  >
                    <Share2 className="h-5 w-5 text-foreground" />
                  </button>
                </div>

                {/* Nav arrows */}
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((i) => (i - 1 + gallery.length) % gallery.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-card/90 transition-colors"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="h-5 w-5 text-foreground" />
                    </button>
                    <button
                      onClick={() => setActiveImage((i) => (i + 1) % gallery.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-card/90 transition-colors"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRight className="h-5 w-5 text-foreground" />
                    </button>
                  </>
                )}

                {/* Counter */}
                <div className="absolute bottom-4 right-4 glass px-3 py-1 rounded-full text-xs font-medium text-foreground">
                  {activeImage + 1} / {gallery.length}
                </div>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto bg-card/50 border-t border-border/40">
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative h-14 w-20 sm:h-16 sm:w-24 rounded-lg overflow-hidden shrink-0 transition-all ${
                        activeImage === i ? 'ring-2 ring-gold scale-105' : 'opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`Ver foto ${i + 1}`}
                    >
                      <Image src={img} alt={`Miniatura ${i + 1}`} fill sizes="96px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 lg:p-8 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1.5">
                      <MapPin className="h-4 w-4 text-gold" />
                      {property.location}, {property.city} · Zona {property.zone}
                    </div>
                    <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight leading-tight">
                      {property.title}
                    </h2>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-2xl lg:text-3xl font-bold text-gradient-gold">
                      {formatPrice(property.price, property.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {property.operation === 'SALE' ? 'En venta' : 'En alquiler'}
                    </p>
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {[
                    { icon: BedDouble, label: 'Habitaciones', value: property.bedrooms },
                    { icon: Bath, label: 'Baños', value: property.bathrooms },
                    { icon: Maximize, label: 'Área', value: `${property.area}m²` },
                    { icon: Car, label: 'Parqueos', value: property.parking },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <s.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
                        <p className="text-sm font-semibold">{s.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                  <span className="h-px w-6 bg-gold" />
                  Descripción
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  {property.enrichedDescription.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Features */}
              {features.length > 0 && (
                <div>
                  <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                    <span className="h-px w-6 bg-gold" />
                    Características
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Investment insight */}
              <div className="rounded-2xl bg-gradient-to-br from-primary/8 to-gold/8 border border-gold/20 p-5">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-emerald flex items-center justify-center shrink-0">
                    <TrendingUp className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Oportunidad de inversión</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Esta propiedad ofrece un excelente potencial de apreciación. Solicita una asesoría
                      financiera personalizada para estructurar tu inversión.
                    </p>
                  </div>
                </div>
              </div>

              {/* Agent + WhatsApp CTA */}
              {property.agent && (
                <div className="rounded-2xl border border-border/60 p-5 bg-card">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-gold/30 shrink-0">
                      <Image
                        src={property.agent.photoUrl}
                        alt={property.agent.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{property.agent.name}</p>
                      <p className="text-xs text-gold font-medium">{property.agent.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {property.agent.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleWhatsApp}
                      size="lg"
                      className="flex-1 bg-[#25D366] hover:bg-[#1da851] text-white"
                    >
                      <WhatsAppIcon className="h-5 w-5 mr-2" />
                      Contactar por WhatsApp
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="bg-background"
                    >
                      <a href={`mailto:${property.agent.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
