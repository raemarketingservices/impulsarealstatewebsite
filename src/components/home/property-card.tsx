'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BedDouble, Bath, Maximize, MapPin, Heart, ArrowRight, Star, SearchX } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export interface Property {
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
  agent?: { name: string; title: string; photoUrl: string } | null
}

export function formatPrice(price: number, currency = 'USD') {
  if (price >= 1000000) return `${currency === 'USD' ? '$' : currency}${(price / 1000000).toFixed(2)}M`
  if (price >= 1000) return `${currency === 'USD' ? '$' : currency}${(price / 1000).toFixed(0)}K`
  return `${currency === 'USD' ? '$' : currency}${price}`
}

const TYPE_LABELS: Record<string, string> = {
  VILLA: 'Villa',
  HOUSE: 'Casa',
  APARTMENT: 'Apartamento',
  COMMERCIAL: 'Comercial',
  LAND: 'Terreno',
}

export function PropertyCard({ property, index = 0 }: { property: Property; index?: number }) {
  const [liked, setLiked] = React.useState(false)
  const images: string[] = React.useMemo(() => {
    try { return JSON.parse(property.images) } catch { return [] }
  }, [property.images])
  const features: string[] = React.useMemo(() => {
    try { return JSON.parse(property.features) } catch { return [] }
  }, [property.features])

  const cover = images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
    >
      <Card className="overflow-hidden border-border/50 hover:shadow-luxe hover:border-gold/30 transition-all duration-300 group h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={cover}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* gradient overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            <Badge className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-gold">
              {TYPE_LABELS[property.type] || property.type}
            </Badge>
            {property.featured && (
              <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Star className="h-3 w-3 mr-1" fill="currentColor" />
                Destacada
              </Badge>
            )}
          </div>
          <button
            onClick={() => {
              setLiked(!liked)
              toast.success(liked ? 'Removido de favoritos' : 'Añadido a favoritos')
            }}
            className="absolute top-3 right-3 h-9 w-9 rounded-full glass flex items-center justify-center hover:bg-card/90 transition-colors"
            aria-label="Favorito"
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-destructive text-destructive' : 'text-foreground'}`} />
          </button>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="glass px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-foreground">{property.location}, {property.city}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-bold leading-tight line-clamp-1">{property.title}</h3>
            <p className="font-display text-xl font-bold text-gradient-gold whitespace-nowrap">
              {formatPrice(property.price, property.currency)}
            </p>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">{property.description}</p>

          {/* Features tags */}
          {features.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {features.slice(0, 3).map((f, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* Specs */}
          <div className="flex items-center gap-4 pt-3 border-t border-border/40 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5" title="Habitaciones">
              <BedDouble className="h-4 w-4 text-gold" />
              {property.bedrooms}
            </span>
            <span className="flex items-center gap-1.5" title="Baños">
              <Bath className="h-4 w-4 text-gold" />
              {property.bathrooms}
            </span>
            <span className="flex items-center gap-1.5" title="Área">
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
    </motion.div>
  )
}

export function PropertyCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/50">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-1/4" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export function EmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <SearchX className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="font-display text-xl font-bold mb-1">No se encontraron propiedades</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-4">
        No hay propiedades que coincidan con los filtros seleccionados. Intenta ajustar tu búsqueda.
      </p>
      {onReset && (
        <Button onClick={onReset} variant="outline" className="bg-background">
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
