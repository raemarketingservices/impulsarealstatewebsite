'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Eye, EyeOff, Star, Edit2, Trash2, ImageIcon,
  Bed, Bath, Maximize, Car, MapPin, X, Loader2, Save, Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ImageUploader } from './image-uploader'

// ---------- Types ----------
interface AgentOption {
  id: string
  name: string
  title?: string
  photoUrl?: string
}

interface Property {
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
  address: string | null
  images: string[]
  features: string[]
  featured: boolean
  published: boolean
  videoUrl: string | null
  agentId: string | null
  agent?: AgentOption
  createdAt: string
  updatedAt: string
}

interface PropertyFormData {
  title: string
  description: string
  type: string
  operation: string
  price: string
  currency: string
  bedrooms: string
  bathrooms: string
  area: string
  parking: string
  location: string
  city: string
  zone: string
  agentId: string
  videoUrl: string
  images: string[]
  features: string[]
  featured: boolean
  published: boolean
}

// ---------- Constants ----------
const PROPERTY_TYPES = [
  { value: 'HOUSE', label: 'Casa' },
  { value: 'APARTMENT', label: 'Apartamento' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'LAND', label: 'Terreno' },
  { value: 'COMMERCIAL', label: 'Comercial' },
]

const OPERATIONS = [
  { value: 'SALE', label: 'Venta' },
  { value: 'RENT', label: 'Alquiler' },
]

const ZONES = [
  { value: 'Nacional', label: 'Nacional (Santo Domingo)' },
  { value: 'Este', label: 'Este (Punta Cana / La Romana)' },
  { value: 'Norte', label: 'Norte (Santiago)' },
  { value: 'Noreste', label: 'Noreste (Las Terrenas / Samaná)' },
  { value: 'Sur', label: 'Sur' },
]

const CURRENCIES = ['USD', 'DOP', 'EUR']

const EMPTY_FORM: PropertyFormData = {
  title: '',
  description: '',
  type: 'APARTMENT',
  operation: 'SALE',
  price: '',
  currency: 'USD',
  bedrooms: '',
  bathrooms: '',
  area: '',
  parking: '',
  location: '',
  city: '',
  zone: 'Nacional',
  agentId: 'none',
  videoUrl: '',
  images: [],
  features: [],
  featured: false,
  published: true,
}

// ---------- Helpers ----------
function formatPrice(price: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price)
  } catch {
    return `$${price.toLocaleString()}`
  }
}

function typeLabel(t: string): string {
  return PROPERTY_TYPES.find((x) => x.value === t)?.label || t
}

function operationLabel(o: string): string {
  return o === 'RENT' ? 'Alquiler' : 'Venta'
}

// ---------- Component ----------
export function PropertiesManager() {
  const [properties, setProperties] = React.useState<Property[]>([])
  const [agents, setAgents] = React.useState<AgentOption[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const [formOpen, setFormOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [form, setForm] = React.useState<PropertyFormData>(EMPTY_FORM)
  const [newImageUrl, setNewImageUrl] = React.useState('')
  const [newFeature, setNewFeature] = React.useState('')
  const [confirmDelete, setConfirmDelete] = React.useState<Property | null>(null)

  // Load properties + agents
  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const [propRes, agentRes] = await Promise.all([
        fetch('/api/admin/properties'),
        fetch('/api/admin/agents'),
      ])
      const propData = await propRes.json()
      const agentData = await agentRes.json()
      if (propData.success) setProperties(propData.data)
      if (agentData.success) setAgents(agentData.data)
    } catch {
      toast.error('Error al cargar propiedades')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  // Filter
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    return properties.filter((p) => {
      if (typeFilter !== 'all' && p.type !== typeFilter) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    })
  }, [properties, search, typeFilter])

  // Form helpers
  const openNew = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setNewImageUrl('')
    setNewFeature('')
    setFormOpen(true)
  }

  const openEdit = (p: Property) => {
    setForm({
      title: p.title,
      description: p.description,
      type: p.type,
      operation: p.operation,
      price: String(p.price),
      currency: p.currency,
      bedrooms: String(p.bedrooms),
      bathrooms: String(p.bathrooms),
      area: String(p.area),
      parking: String(p.parking),
      location: p.location,
      city: p.city,
      zone: p.zone,
      agentId: p.agentId || 'none',
      videoUrl: p.videoUrl || '',
      images: Array.isArray(p.images) ? p.images : [],
      features: Array.isArray(p.features) ? p.features : [],
      featured: p.featured,
      published: p.published,
    })
    setEditingId(p.id)
    setNewImageUrl('')
    setNewFeature('')
    setFormOpen(true)
  }

  const update = <K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const addImage = () => {
    const url = newImageUrl.trim()
    if (!url) return
    update('images', [...form.images, url])
    setNewImageUrl('')
  }

  const removeImage = (idx: number) => {
    update('images', form.images.filter((_, i) => i !== idx))
  }

  const addFeature = () => {
    const f = newFeature.trim()
    if (!f) return
    update('features', [...form.features, f])
    setNewFeature('')
  }

  const removeFeature = (idx: number) => {
    update('features', form.features.filter((_, i) => i !== idx))
  }

  // Save (create or update)
  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('El título es obligatorio')
      return
    }
    if (!form.price || isNaN(Number(form.price))) {
      toast.error('El precio es obligatorio')
      return
    }
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        operation: form.operation,
        price: Number(form.price),
        currency: form.currency,
        bedrooms: Number(form.bedrooms || 0),
        bathrooms: Number(form.bathrooms || 0),
        area: Number(form.area || 0),
        parking: Number(form.parking || 0),
        location: form.location,
        city: form.city,
        zone: form.zone,
        agentId: form.agentId,
        videoUrl: form.videoUrl,
        images: form.images,
        features: form.features,
        featured: form.featured,
        published: form.published,
      }

      const url = editingId
        ? `/api/admin/properties/${editingId}`
        : '/api/admin/properties'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(editingId ? 'Propiedad actualizada' : 'Propiedad creada')
        setFormOpen(false)
        load()
      } else {
        toast.error(data.error || 'Error al guardar')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  // Quick toggle (published / featured)
  const quickToggle = async (p: Property, field: 'published' | 'featured') => {
    const newValue = !p[field]
    // Optimistic update
    setProperties((prev) => prev.map((x) => (x.id === p.id ? { ...x, [field]: newValue } : x)))
    try {
      const res = await fetch(`/api/admin/properties/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: newValue }),
      })
      const data = await res.json()
      if (!data.success) {
        setProperties((prev) => prev.map((x) => (x.id === p.id ? { ...x, [field]: !newValue } : x)))
        toast.error('No se pudo actualizar')
      } else {
        toast.success(field === 'published' ? (newValue ? 'Propiedad publicada' : 'Propiedad oculta') : (newValue ? 'Marcada como destacada' : 'Quitada de destacadas'))
      }
    } catch {
      setProperties((prev) => prev.map((x) => (x.id === p.id ? { ...x, [field]: !newValue } : x)))
      toast.error('Error de conexión')
    }
  }

  // Delete
  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      const res = await fetch(`/api/admin/properties/${confirmDelete.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Propiedad eliminada')
        setProperties((prev) => prev.filter((x) => x.id !== confirmDelete.id))
        setConfirmDelete(null)
      } else {
        toast.error(data.error || 'Error al eliminar')
      }
    } catch {
      toast.error('Error de conexión')
    }
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, ubicación..."
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {PROPERTY_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="h-9 px-3 text-xs">
            {filtered.length} / {properties.length}
          </Badge>
          <Button onClick={openNew} className="bg-gradient-emerald text-primary-foreground shadow-luxe">
            <Plus className="h-4 w-4 mr-1.5" /> Nueva propiedad
          </Button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex gap-4">
                <Skeleton className="h-20 w-28 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No se encontraron propiedades</p>
        </Card>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <AnimatePresence>
            {filtered.map((p, idx) => {
              const img = p.images?.[0]
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.2) }}
                >
                  <Card className="p-3 sm:p-4 hover:shadow-luxe transition-shadow">
                    <div className="flex gap-3 sm:gap-4">
                      {/* Thumbnail */}
                      <div className="h-20 w-28 sm:h-24 sm:w-36 shrink-0 rounded-lg overflow-hidden bg-muted relative">
                        {img ? (
                           
                          <img src={img} alt={p.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-8 w-8" />
                          </div>
                        )}
                        {p.featured && (
                          <div className="absolute top-1 left-1 h-6 w-6 rounded-full bg-gold flex items-center justify-center">
                            <Star className="h-3.5 w-3.5 text-gold-foreground fill-current" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base truncate">
                              {p.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">
                                {p.location}{p.location && p.city ? ', ' : ''}{p.city}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">
                              {typeLabel(p.type)}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px]">
                              {operationLabel(p.operation)}
                            </Badge>
                            {p.published ? (
                              <Badge className="text-[10px] bg-emerald-600 text-white hover:bg-emerald-600">
                                Publicada
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                Oculta
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
                            <span className="font-bold text-base text-gradient-gold">
                              {formatPrice(p.price, p.currency)}
                            </span>
                            <span className="hidden sm:flex items-center gap-1">
                              <Bed className="h-3.5 w-3.5" /> {p.bedrooms}
                            </span>
                            <span className="hidden sm:flex items-center gap-1">
                              <Bath className="h-3.5 w-3.5" /> {p.bathrooms}
                            </span>
                            <span className="hidden md:flex items-center gap-1">
                              <Maximize className="h-3.5 w-3.5" /> {p.area}m²
                            </span>
                            <span className="hidden md:flex items-center gap-1">
                              <Car className="h-3.5 w-3.5" /> {p.parking}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => quickToggle(p, 'published')}
                              title={p.published ? 'Ocultar' : 'Publicar'}
                            >
                              {p.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => quickToggle(p, 'featured')}
                              title={p.featured ? 'Quitar destacado' : 'Marcar destacado'}
                            >
                              <Star className={`h-4 w-4 ${p.featured ? 'fill-gold text-gold' : ''}`} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => openEdit(p)}
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setConfirmDelete(p)}
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* New/Edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingId ? 'Editar propiedad' : 'Nueva propiedad'}
            </DialogTitle>
            <DialogDescription>
              Completa los datos de la propiedad. Los campos con * son obligatorios.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="prop-title">Título *</Label>
              <Input
                id="prop-title"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Ej: Villa Mediterránea con Vista al Mar"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="prop-desc">Descripción</Label>
              <Textarea
                id="prop-desc"
                rows={4}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Descripción detallada de la propiedad..."
              />
            </div>

            {/* Type / Operation / Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Tipo</Label>
                <Select value={form.type} onValueChange={(v) => update('type', v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Operación</Label>
                <Select value={form.operation} onValueChange={(v) => update('operation', v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {OPERATIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Moneda</Label>
                <Select value={form.currency} onValueChange={(v) => update('currency', v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price / Bedrooms / Bathrooms */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <Label htmlFor="prop-price">Precio *</Label>
                <Input
                  id="prop-price"
                  type="number"
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prop-bed">Habitaciones</Label>
                <Input
                  id="prop-bed"
                  type="number"
                  value={form.bedrooms}
                  onChange={(e) => update('bedrooms', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prop-bath">Baños</Label>
                <Input
                  id="prop-bath"
                  type="number"
                  value={form.bathrooms}
                  onChange={(e) => update('bathrooms', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prop-park">Parqueos</Label>
                <Input
                  id="prop-park"
                  type="number"
                  value={form.parking}
                  onChange={(e) => update('parking', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Area / Location / City / Zone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prop-area">Área (m²)</Label>
                <Input
                  id="prop-area"
                  type="number"
                  value={form.area}
                  onChange={(e) => update('area', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prop-loc">Ubicación</Label>
                <Input
                  id="prop-loc"
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  placeholder="Cap Cana, Piantini..."
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prop-city">Ciudad</Label>
                <Input
                  id="prop-city"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  placeholder="Santo Domingo"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Zona</Label>
                <Select value={form.zone} onValueChange={(v) => update('zone', v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ZONES.map((z) => (
                      <SelectItem key={z.value} value={z.value}>{z.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Agent / Video URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Asesor asignado</Label>
                <Select value={form.agentId} onValueChange={(v) => update('agentId', v)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Sin asignar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asignar</SelectItem>
                    {agents.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prop-video">URL del video (opcional)</Label>
                <Input
                  id="prop-video"
                  value={form.videoUrl}
                  onChange={(e) => update('videoUrl', e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>

            {/* Images */}
            <ImageUploader
              images={form.images}
              onChange={(imgs) => update('images', imgs)}
              label="Imágenes de la propiedad"
              maxImages={20}
            />

            {/* Features */}
            <div className="space-y-2">
              <Label>Características</Label>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature() } }}
                  placeholder="Piscina, Cocina gourmet..."
                />
                <Button type="button" variant="secondary" onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {form.features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.features.map((f, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1 pr-1.5">
                      {f}
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Switches */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label className="cursor-pointer">Destacada</Label>
                  <p className="text-xs text-muted-foreground">Mostrar en home</p>
                </div>
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => update('featured', v)}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label className="cursor-pointer">Publicada</Label>
                  <p className="text-xs text-muted-foreground">Visible en el sitio</p>
                </div>
                <Switch
                  checked={form.published}
                  onCheckedChange={(v) => update('published', v)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setFormOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-gradient-emerald text-primary-foreground">
              {saving ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Guardando...</>
              ) : (
                <><Save className="h-4 w-4 mr-2" /> {editingId ? 'Guardar cambios' : 'Crear propiedad'}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar propiedad?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La propiedad{' '}
              <strong className="text-foreground">{confirmDelete?.title}</strong> será eliminada permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
