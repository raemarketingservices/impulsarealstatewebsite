'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BedDouble, Bath, Maximize, MapPin, Heart, ArrowRight, Star } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Property {
  id: string
  title: string
  description: string
  type: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  location: string
  city: string
  zone: string
  images: string
  features: string
  featured: boolean
}

function formatPrice(price: number) {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`
  if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`
  return `$${price}`
}

function PropertyCard({ property }: { property: Property }) {
  const [liked, setLiked] = React.useState(false)
  const images: string[] = React.useMemo(() => {
    try { return JSON.parse(property.images) } catch { return [] }
  }, [property.images])
  const features: string[] = React.useMemo(() => {
    try { return JSON.parse(property.features) } catch { return [] }
  }, [property.features])

  return (
    <Card className="overflow-hidden border-border/50 hover:shadow-luxe transition-all duration-300 group h-full">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold">
            {property.type}
          </Badge>
          {property.featured && (
            <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Star className="h-3 w-3 mr-1" fill="currentColor" />
              Destacada
            </Badge>
          )}
        </div>
        <button
          onClick={() => { setLiked(!liked); toast.success(liked ? 'Removido de favoritos' : 'Añadido a favoritos') }}
          className="absolute top-3 right-3 h-9 w-9 rounded-full glass flex items-center justify-center hover:bg-card/90 transition-colors"
          aria-label="Favorito"
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-destructive text-destructive' : 'text-foreground'}`} />
        </button>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gold" />
            <span className="text-xs font-medium">{property.location}, {property.city}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-tight line-clamp-1">{property.title}</h3>
          <p className="font-display text-xl font-bold text-gradient-gold whitespace-nowrap">
            {formatPrice(property.price)}
          </p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{property.description}</p>

        {/* Features tags */}
        <div className="flex flex-wrap gap-1.5">
          {features.slice(0, 3).map((f, i) => (
            <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
              {f}
            </span>
          ))}
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 pt-2 border-t border-border/40 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-gold" />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-gold" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="h-4 w-4 text-gold" />
            {property.area}m²
          </span>
        </div>

        <Button
          variant="outline"
          className="w-full group-hover:bg-gradient-emerald group-hover:text-primary-foreground group-hover:border-transparent transition-all"
          onClick={() => toast.success('Detalles enviados', { description: property.title })}
        >
          Ver detalles
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  )
}

export function FeaturedProperties() {
  const [properties, setProperties] = React.useState<Property[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch('/api/properties?featured=true&limit=8')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setProperties(d.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-3"
            >
              <span className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Propiedades Destacadas</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            >
              Oportunidades inmobiliarias <span className="text-gradient-gold">premium</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground mt-3 text-base lg:text-lg"
            >
              Una curaduría exclusiva de las mejores propiedades en República Dominicana.
            </motion.p>
          </div>
        </div>

        {/* Carousel */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-border/50">
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Carousel
            opts={{ align: 'start', loop: false }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {properties.map((property, idx) => (
                <CarouselItem key={property.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="h-full"
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
      </div>
    </section>
  )
}
