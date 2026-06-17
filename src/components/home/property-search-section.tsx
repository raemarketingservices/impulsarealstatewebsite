'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Home as HomeIcon, DollarSign, BedDouble, SlidersHorizontal, RotateCcw, Sparkles, ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PropertyCard, PropertyCardSkeleton, EmptyState, type Property } from './property-card'
import { toast } from 'sonner'

export interface SearchFilters {
  q: string
  zone: string
  type: string
  operation: string
  minPrice: number
  maxPrice: number
  bedrooms: string
}

const DEFAULT_FILTERS: SearchFilters = {
  q: '',
  zone: 'all',
  type: 'all',
  operation: 'SALE',
  minPrice: 20000,
  maxPrice: 5000000,
  bedrooms: 'any',
}

function formatPriceShort(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n}`
}

const PRICE_PRESETS = [
  { label: 'Hasta $200K', min: 0, max: 200000 },
  { label: '$200K - $500K', min: 200000, max: 500000 },
  { label: '$500K - $1M', min: 500000, max: 1000000 },
  { label: '$1M - $3M', min: 1000000, max: 3000000 },
  { label: 'Sin límite', min: 20000, max: 5000000 },
]

export function PropertySearchSection() {
  const [filters, setFilters] = React.useState<SearchFilters>(DEFAULT_FILTERS)
  const [results, setResults] = React.useState<Property[] | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(false)
  const resultsRef = React.useRef<HTMLDivElement>(null)

  const update = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const hasActiveFilters =
    filters.q !== '' ||
    filters.zone !== 'all' ||
    filters.type !== 'all' ||
    filters.bedrooms !== 'any' ||
    filters.minPrice !== DEFAULT_FILTERS.minPrice ||
    filters.maxPrice !== DEFAULT_FILTERS.maxPrice

  const reset = () => {
    setFilters({ ...DEFAULT_FILTERS, operation: filters.operation })
    runSearch({ ...DEFAULT_FILTERS, operation: filters.operation })
  }

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
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [])

  const handleSearch = () => {
    toast.success('Búsqueda realizada', {
      description: filters.q
        ? `Resultados para "${filters.q}"`
        : 'Filtrando propiedades de tu listing',
    })
    runSearch(filters)
  }

  // Auto-search on operation toggle change
  const handleOperationChange = (val: string) => {
    const newFilters = { ...filters, operation: val }
    setFilters(newFilters)
    runSearch(newFilters)
  }

  return (
    <section className="relative -mt-24 z-10 pb-4">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Section header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Búsqueda Avanzada</span>
              <span className="h-px w-8 bg-gold" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Encuentra tu próxima <span className="text-gradient-gold">propiedad</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Filtros inteligentes · Resultados en tiempo real de nuestro listing
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-card rounded-3xl border border-border/60 shadow-luxe overflow-hidden">
            {/* Operation toggle bar */}
            <div className="flex items-center justify-between gap-4 p-4 sm:p-5 border-b border-border/40 bg-muted/30">
              <div className="inline-flex items-center gap-1 p-1 rounded-full bg-card border border-border/60">
                {[
                  { val: 'SALE', label: 'Comprar' },
                  { val: 'RENT', label: 'Alquilar' },
                ].map((op) => (
                  <button
                    key={op.val}
                    onClick={() => handleOperationChange(op.val)}
                    className={`px-6 py-2 text-sm font-semibold rounded-full transition-all ${
                      filters.operation === op.val
                        ? 'bg-gradient-gold text-gold-foreground shadow-gold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                Búsqueda interactiva
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {/* Keyword search */}
              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Búsqueda por palabra clave</Label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    value={filters.q}
                    onChange={(e) => update('q', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Ej: villa con piscina en Cap Cana, apartamento Piantini..."
                    className="pl-10 pr-10 h-12 bg-background border-border/60 text-sm"
                  />
                  {filters.q && (
                    <button
                      onClick={() => update('q', '')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Limpiar búsqueda"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filters grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Zone */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-gold" /> Zona
                  </Label>
                  <Select value={filters.zone} onValueChange={(v) => update('zone', v)}>
                    <SelectTrigger className="bg-background border-border/60 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las zonas</SelectItem>
                      <SelectItem value="Nacional">Santo Domingo</SelectItem>
                      <SelectItem value="Este">Punta Cana / Este</SelectItem>
                      <SelectItem value="Norte">Santiago / Norte</SelectItem>
                      <SelectItem value="Noreste">Las Terrenas / Noreste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Type */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <HomeIcon className="h-3 w-3 text-gold" /> Tipo
                  </Label>
                  <Select value={filters.type} onValueChange={(v) => update('type', v)}>
                    <SelectTrigger className="bg-background border-border/60 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="VILLA">Villa</SelectItem>
                      <SelectItem value="HOUSE">Casa</SelectItem>
                      <SelectItem value="APARTMENT">Apartamento</SelectItem>
                      <SelectItem value="COMMERCIAL">Comercial</SelectItem>
                      <SelectItem value="LAND">Terreno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price range */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <DollarSign className="h-3 w-3 text-gold" /> Precio (USD)
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between bg-background border-border/60 h-11 font-normal hover:bg-background">
                        <span className="text-sm">
                          {formatPriceShort(filters.minPrice)} - {formatPriceShort(filters.maxPrice)}
                        </span>
                        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-5" align="start">
                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold">Rango de precio</Label>
                          <span className="text-xs text-muted-foreground">USD</span>
                        </div>
                        <Slider
                          value={[filters.minPrice, filters.maxPrice]}
                          onValueChange={(v) => { update('minPrice', v[0]); update('maxPrice', v[1]) }}
                          min={20000}
                          max={5000000}
                          step={10000}
                          className="py-2"
                        />
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Mínimo</p>
                            <p className="font-semibold">${filters.minPrice.toLocaleString()}</p>
                          </div>
                          <div className="h-px flex-1 mx-3 bg-border" />
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Máximo</p>
                            <p className="font-semibold">${filters.maxPrice.toLocaleString()}</p>
                          </div>
                        </div>
                        {/* Presets */}
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
                          {PRICE_PRESETS.map((p) => (
                            <button
                              key={p.label}
                              onClick={() => { update('minPrice', p.min); update('maxPrice', p.max) }}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Bedrooms */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <BedDouble className="h-3 w-3 text-gold" /> Habitaciones
                  </Label>
                  <Select value={filters.bedrooms} onValueChange={(v) => update('bedrooms', v)}>
                    <SelectTrigger className="bg-background border-border/60 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Cualquiera</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active filters chips */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-xs text-muted-foreground">Filtros activos:</span>
                  {filters.q && (
                    <Badge variant="secondary" className="gap-1">
                      "{filters.q}"
                      <button onClick={() => update('q', '')}><X className="h-3 w-3" /></button>
                    </Badge>
                  )}
                  {filters.zone !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {filters.zone}
                      <button onClick={() => update('zone', 'all')}><X className="h-3 w-3" /></button>
                    </Badge>
                  )}
                  {filters.type !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {filters.type}
                      <button onClick={() => update('type', 'all')}><X className="h-3 w-3" /></button>
                    </Badge>
                  )}
                  {filters.bedrooms !== 'any' && (
                    <Badge variant="secondary" className="gap-1">
                      {filters.bedrooms}+ hab
                      <button onClick={() => update('bedrooms', 'any')}><X className="h-3 w-3" /></button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Action row */}
              <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  {hasActiveFilters ? (
                    <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground hover:text-foreground h-9">
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      Limpiar filtros
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin filtros activos · mostrando todas</span>
                  )}
                  {typeof results?.length === 'number' && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                      {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="bg-gradient-emerald text-primary-foreground hover:opacity-90 shadow-luxe h-11 px-8"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar propiedades
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {hasSearched && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10"
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
                {[1, 2, 3, 4, 5, 6].map((i) => <PropertyCardSkeleton key={i} />)}
              </div>
            ) : results && results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
              </div>
            ) : (
              <EmptyState onReset={reset} />
            )}
          </motion.div>
        )}

        {/* Scroll hint */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center mt-10 text-muted-foreground"
          >
            <span className="text-xs uppercase tracking-[0.2em] mb-2">Propiedades destacadas</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </motion.div>
        )}
      </div>
    </section>
  )
}
