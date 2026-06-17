'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Home as HomeIcon, DollarSign, BedDouble, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface SearchData {
  zone: string
  type: string
  operation: string
  priceRange: [number, number]
  bedrooms: string
}

export function PropertySearch() {
  const [zone, setZone] = React.useState('all')
  const [type, setType] = React.useState('all')
  const [operation, setOperation] = React.useState('SALE')
  const [priceRange, setPriceRange] = React.useState<[number, number]>([50000, 3000000])
  const [bedrooms, setBedrooms] = React.useState('any')

  const handleSearch = () => {
    const params = new URLSearchParams({
      zone: zone === 'all' ? '' : zone,
      type: type === 'all' ? '' : type,
      operation,
      minPrice: String(priceRange[0]),
      maxPrice: String(priceRange[1]),
      bedrooms: bedrooms === 'any' ? '' : bedrooms,
    })
    toast.success('Búsqueda realizada', {
      description: `Propiedades ${operation === 'SALE' ? 'en venta' : 'en alquiler'} — ${bedrooms === 'any' ? 'cualquier habitación' : `${bedrooms}+ hab.`}`,
    })
    // In a real app, this would navigate to results
    const event = new CustomEvent('property-search', { detail: params.toString() })
    window.dispatchEvent(event)
  }

  return (
    <div className="w-full">
      {/* Operation toggle */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-card/60 backdrop-blur-md border border-border/40 mb-3 w-fit">
        {[
          { val: 'SALE', label: 'Comprar' },
          { val: 'RENT', label: 'Alquilar' },
        ].map((op) => (
          <button
            key={op.val}
            onClick={() => setOperation(op.val)}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
              operation === op.val
                ? 'bg-gradient-gold text-gold-foreground shadow-gold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-luxe p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Zone */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-gold" /> Zona
            </Label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger className="bg-background/50 border-border/60 h-11">
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
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-background/50 border-border/60 h-11">
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
                <Button variant="outline" className="w-full justify-between bg-background/50 border-border/60 h-11 font-normal">
                  <span className="text-sm">
                    ${(priceRange[0] / 1000).toFixed(0)}K - ${(priceRange[1] / 1000000).toFixed(1)}M
                  </span>
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4" align="start">
                <div className="space-y-4">
                  <Label className="text-xs font-semibold">Rango de precio</Label>
                  <Slider
                    value={priceRange}
                    onValueChange={(v) => setPriceRange(v as [number, number])}
                    min={20000}
                    max={5000000}
                    step={10000}
                    className="py-2"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">${priceRange[0].toLocaleString()}</span>
                    <span className="font-medium">${priceRange[1].toLocaleString()}</span>
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
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger className="bg-background/50 border-border/60 h-11">
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

        {/* Search button */}
        <div className="mt-3">
          <Button
            onClick={handleSearch}
            size="lg"
            className="w-full sm:w-auto bg-gradient-emerald text-primary-foreground hover:opacity-90 shadow-luxe h-12 px-8"
          >
            <Search className="h-5 w-5 mr-2" />
            Buscar propiedades
          </Button>
        </div>
      </div>
    </div>
  )
}
