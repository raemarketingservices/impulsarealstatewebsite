'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, TrendingUp, Shield, Award, ChevronDown } from 'lucide-react'
import { PropertySearch, DEFAULT_FILTERS, type SearchFilters } from './property-search'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { PropertyCard, PropertyCardSkeleton, EmptyState, type Property } from './property-card'

const HERO_IMG = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80'

const STATS = [
  { value: '500+', label: 'Propiedades vendidas', icon: TrendingUp },
  { value: '15 años', label: 'En el mercado', icon: Award },
  { value: '$250M+', label: 'En transacciones', icon: Shield },
]

export function Hero() {
  const { setView } = useAppStore()
  const [videoOpen, setVideoOpen] = React.useState(false)
  const [filters, setFilters] = React.useState<SearchFilters>(DEFAULT_FILTERS)
  const [results, setResults] = React.useState<Property[] | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(false)
  const resultsRef = React.useRef<HTMLDivElement>(null)

  const buildQuery = (f: SearchFilters) => {
    const params = new URLSearchParams()
    if (f.q) params.set('q', f.q)
    if (f.zone !== 'all') params.set('zone', f.zone)
    if (f.type !== 'all') params.set('type', f.type)
    if (f.operation) params.set('operation', f.operation)
    params.set('minPrice', String(f.minPrice))
    params.set('maxPrice', String(f.maxPrice))
    if (f.bedrooms !== 'any') params.set('bedrooms', f.bedrooms)
    params.set('limit', '24')
    return params.toString()
  }

  const runSearch = React.useCallback(async (f: SearchFilters) => {
    setLoading(true)
    setHasSearched(true)
    try {
      const res = await fetch(`/api/properties?${buildQuery(f)}`)
      const data = await res.json()
      setResults(data.success ? data.data : [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
      // scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [])

  const handleSearch = () => runSearch(filters)

  return (
    <section className="relative min-h-[100vh] flex items-start pt-28 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={HERO_IMG}
          alt="Propiedad de lujo en República Dominicana"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/55 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Text */}
          <div className="lg:col-span-7 space-y-6 lg:pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 backdrop-blur-sm"
            >
              <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-gold uppercase">
                #1 Inmobiliaria Premium en República Dominicana
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight"
            >
              Invierte en
              <span className="block text-gradient-gold">bienes raíces</span>
              con inteligencia.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              La plataforma corporativa que combina propiedades premium, asesoría financiera
              experta y herramientas inteligentes para impulsar tu patrimonio inmobiliario en el Caribe.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Button
                onClick={() => setView('dashboard')}
                size="lg"
                className="bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold h-12 px-7"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Explorar Dashboard
              </Button>
              <Button
                onClick={() => setVideoOpen(true)}
                variant="outline"
                size="lg"
                className="h-12 px-7 glass border-border/50"
              >
                <Play className="h-5 w-5 mr-2 text-gold" />
                Ver video corporativo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="grid grid-cols-3 gap-4 pt-6 max-w-lg"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="text-left">
                  <div className="flex items-center gap-1.5 mb-1">
                    <stat.icon className="h-4 w-4 text-gold" />
                    <span className="font-display text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Search */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-5"
          >
            <div className="space-y-3">
              <div>
                <h2 className="font-display text-xl font-bold mb-1">Encuentra tu próxima propiedad</h2>
                <p className="text-sm text-muted-foreground">Filtros avanzados · Resultados en tiempo real</p>
              </div>
              <PropertySearch
                filters={filters}
                onFiltersChange={setFilters}
                onSearch={handleSearch}
                resultCount={results?.length}
              />
            </div>
          </motion.div>
        </div>

        {/* Search Results Section */}
        {hasSearched && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-16 pt-10 border-t border-border/40"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                  {loading ? 'Buscando...' : 'Resultados de tu búsqueda'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {loading
                    ? 'Filtrando propiedades...'
                    : `${results?.length || 0} ${results?.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : results && results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((p, i) => (
                  <PropertyCard key={p.id} property={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1">
                <EmptyState onReset={() => { setFilters(DEFAULT_FILTERS); runSearch(DEFAULT_FILTERS) }} />
              </div>
            )}
          </motion.div>
        )}

        {/* Scroll hint when not searched */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col items-center mt-12 text-muted-foreground"
          >
            <span className="text-xs uppercase tracking-[0.2em] mb-2">Propiedades destacadas</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </motion.div>
        )}
      </div>

      {/* Video Modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setVideoOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-emerald flex items-center justify-center">
              <div className="text-center text-primary-foreground p-8">
                <Play className="h-16 w-16 mx-auto mb-4 text-gold" fill="currentColor" />
                <h3 className="font-display text-2xl font-bold mb-2">IMPULSA Real Estate</h3>
                <p className="text-primary-foreground/80">Video corporativo — Próximamente</p>
              </div>
            </div>
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="Cerrar video"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}
    </section>
  )
}
