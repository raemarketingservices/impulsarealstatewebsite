'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { PropertyCard, PropertyCardSkeleton, type Property } from './property-card'

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
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>No hay propiedades destacadas disponibles.</p>
          </div>
        ) : (
          <Carousel opts={{ align: 'start', loop: false }} className="w-full">
            <CarouselContent className="-ml-4">
              {properties.map((property, idx) => (
                <CarouselItem key={property.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <PropertyCard property={property} index={idx} />
                  </div>
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
