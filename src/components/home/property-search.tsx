'use client'

import * as React from 'react'
import { Search, MapPin, Home as HomeIcon, DollarSign, BedDouble, SlidersHorizontal, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export interface SearchFilters {
  q: string
  zone: string
  type: string
  operation: string
  minPrice: number
  maxPrice: number
  bedrooms: string
}

export const DEFAULT_FILTERS: SearchFilters = {
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

interface PropertySearchProps {
  filters: SearchFilters
  onFiltersChange: (f: SearchFilters) => void
  onSearch: () => void
  resultCount?: number
  compact?: boolean
}

export function PropertySearch({ filters, onFiltersChange, onSearch, resultCount, compact }: PropertySearchProps) {
  const update = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const hasActiveFilters =
    filters.q !== '' ||
    filters.zone !== 'all' ||
    filters.type !== 'all' ||
    filters.bedrooms !== 'any' ||
    filters.minPrice !== DEFAULT_FILTERS.minPrice ||
    filters.maxPrice !== DEFAULT_FILTERS.maxPrice

  const reset = () => onFiltersChange({ ...DEFAULT_FILTERS, operation: filters.operation })

  return (
    <div className="w-full">
      {/* Operation toggle */}
      <div className="inline-flex items-center gap-1 p-1 rounded-full bg-card border border-border/60 shadow-sm mb-4">
        {[
          { val: 'SALE', label: 'Comprar' },
          { val: 'RENT', label: 'Alquilar' },
        ].map((op) => (
          <button
            key={op.val}
            onClick={() => update('operation', op.val)}
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

      {/* Search bar */}
      <div className="bg-card rounded-2xl border border-border/60 shadow-luxe p-4 sm:p-5">
        {/* Keyword search row */}
        <div className="mb-4">
          <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Búsqueda por palabra clave</Label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={filters.q}
              onChange={(e) => update('q', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              placeholder="Ej: villa con piscina en Cap Cana, apartamento Piantini..."
              className="pl-10 h-12 bg-background border-border/60 text-sm"
            />
          </div>
        </div>

        {/* Filters grid — 2 cols mobile, 4 cols desktop, consistent gap */}
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
                    onValueChange={(v) => {
                      update('minPrice', v[0])
                      update('maxPrice', v[1])
                    }}
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

        {/* Action row */}
        <div className="mt-4 pt-4 border-t border-border/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            {hasActiveFilters ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={reset}
                className="text-muted-foreground hover:text-foreground h-9"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Limpiar filtros
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground">Sin filtros activos · mostrando todas</span>
            )}
            {typeof resultCount === 'number' && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
              </Badge>
            )}
          </div>
          <Button
            onClick={onSearch}
            size="lg"
            className="bg-gradient-emerald text-primary-foreground hover:opacity-90 shadow-luxe h-11 px-7 sm:w-auto"
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar propiedades
          </Button>
        </div>
      </div>
    </div>
  )
}
