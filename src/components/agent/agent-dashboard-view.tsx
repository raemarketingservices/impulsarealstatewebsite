'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Eye,
  Star,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Lock,
  Save,
  Home,
  UserCircle,
  Phone,
  MessageCircle,
  Instagram,
  Facebook,
  Image as ImageIcon,
  ListChecks,
  DollarSign,
  Bed,
  Bath,
  Maximize,
  Car,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { convertImageUrl } from '@/lib/image-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

/* ================================================================== */
/*  Types                                                             */
/* ================================================================== */

interface AgentProfile {
  id: string
  name: string
  title: string
  bio: string
  photoUrl: string
  phone: string
  email: string
  whatsapp: string
  instagram?: string | null
  tiktok?: string | null
  facebook?: string | null
  specialties: string
  rating: number
  salesCount: number
}

interface AgentProperty {
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
  address?: string | null
  images: string
  features: string
  featured: boolean
  videoUrl?: string | null
  published: boolean
  views: number
  createdAt: string
}

/* ================================================================== */
/*  Helpers                                                           */
/* ================================================================== */

const AVATAR_FALLBACK = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=0f2438&color=c9a227`

const PROPERTY_FALLBACK = (title: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&size=400&background=0f2438&color=c9a227`

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    // Fallback: split by newlines (user-friendly)
    return raw
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean)
  }
}

function formatPrice(price: number, currency = 'USD'): string {
  const symbol = currency === 'USD' ? 'US$' : currency === 'DOP' ? 'RD$' : `${currency} `
  if (price >= 1_000_000) return `${symbol}${(price / 1_000_000).toFixed(2)}M`
  if (price >= 1_000) return `${symbol}${(price / 1_000).toFixed(0)}K`
  return `${symbol}${price.toLocaleString()}`
}

function formatFullPrice(price: number, currency = 'USD'): string {
  const symbol = currency === 'USD' ? 'US$' : currency === 'DOP' ? 'RD$' : `${currency} `
  return `${symbol}${price.toLocaleString()}`
}

function formatDateES(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-DO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  FOR_SALE: { label: 'En venta', color: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' },
  RESERVED: { label: 'Reservada', color: 'bg-amber-500/15 text-amber-600 border-amber-500/30' },
  SOLD: { label: 'Vendida', color: 'bg-rose-500/15 text-rose-600 border-rose-500/30' },
  RENTED: { label: 'Alquilada', color: 'bg-sky-500/15 text-sky-600 border-sky-500/30' },
}

const TYPE_LABELS: Record<string, string> = {
  HOUSE: 'Casa',
  APARTMENT: 'Apartamento',
  VILLA: 'Villa',
  LAND: 'Terreno',
  COMMERCIAL: 'Comercial',
}

const OPERATION_LABELS: Record<string, string> = {
  SALE: 'Venta',
  RENT: 'Alquiler',
}

/* ================================================================== */
/*  Login Prompt                                                      */
/* ================================================================== */

function LoginPrompt() {
  const setAgentLoginOpen = useAppStore((s) => s.setAgentLoginOpen)
  return (
    <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
      <div className="container max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-8 shadow-luxe text-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-5 ring-2 ring-gold/30">
              <Lock className="h-8 w-8 text-gold" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Panel de Agente</h1>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Esta área es exclusiva para los asesores inmobiliarios de IMPULSA Real Estate.
              Inicia sesión para gestionar tus propiedades y tu perfil profesional.
            </p>
            <Button
              onClick={() => setAgentLoginOpen(true)}
              className="w-full bg-gradient-gold text-gold-foreground hover:opacity-90"
            >
              <UserCircle className="h-4 w-4 mr-2" />
              Iniciar sesión como agente
            </Button>
            <p className="text-[11px] text-muted-foreground mt-4 leading-relaxed">
              Demo: geovanny.reynoso@impulsarealestate.com / impulsa
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Stat Card                                                         */
/* ================================================================== */

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ElementType
  label: string
  value: string
  hint?: string
  accent: 'gold' | 'primary'
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-5 hover:shadow-luxe transition-shadow h-full">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              {label}
            </p>
            <p className="font-display text-2xl font-bold mt-1 truncate">{value}</p>
            {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
          </div>
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
              accent === 'gold'
                ? 'bg-gold/15 text-gold'
                : 'bg-primary/10 text-primary'
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

/* ================================================================== */
/*  Property Form Modal                                               */
/* ================================================================== */

interface PropertyFormState {
  id?: string
  title: string
  description: string
  type: string
  status: string
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
  address: string
  imagesRaw: string
  featuresRaw: string
  featured: boolean
  published: boolean
  videoUrl: string
}

const EMPTY_PROPERTY_FORM: PropertyFormState = {
  title: '',
  description: '',
  type: 'HOUSE',
  status: 'FOR_SALE',
  operation: 'SALE',
  price: '',
  currency: 'USD',
  bedrooms: '0',
  bathrooms: '0',
  area: '',
  parking: '0',
  location: '',
  city: '',
  zone: '',
  address: '',
  imagesRaw: '',
  featuresRaw: '',
  featured: false,
  published: true,
  videoUrl: '',
}

function PropertyFormDialog({
  open,
  onOpenChange,
  initial,
  agentId,
  onSaved,
}: {
  open: boolean
  onOpenChange: (b: boolean) => void
  initial: AgentProperty | null
  agentId: string
  onSaved: () => void
}) {
  const [form, setForm] = React.useState<PropertyFormState>(EMPTY_PROPERTY_FORM)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    if (initial) {
      setForm({
        id: initial.id,
        title: initial.title,
        description: initial.description,
        type: initial.type || 'HOUSE',
        status: initial.status || 'FOR_SALE',
        operation: initial.operation || 'SALE',
        price: String(initial.price ?? ''),
        currency: initial.currency || 'USD',
        bedrooms: String(initial.bedrooms ?? 0),
        bathrooms: String(initial.bathrooms ?? 0),
        area: String(initial.area ?? ''),
        parking: String(initial.parking ?? 0),
        location: initial.location || '',
        city: initial.city || '',
        zone: initial.zone || '',
        address: initial.address || '',
        imagesRaw: parseJsonArray(initial.images).join('\n'),
        featuresRaw: parseJsonArray(initial.features).join('\n'),
        featured: Boolean(initial.featured),
        published: Boolean(initial.published),
        videoUrl: initial.videoUrl || '',
      })
    } else {
      setForm(EMPTY_PROPERTY_FORM)
    }
  }, [open, initial])

  const update = <K extends keyof PropertyFormState>(key: K, value: PropertyFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('El título es obligatorio')
      return
    }
    const priceNum = parseFloat(form.price)
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('El precio debe ser mayor a 0')
      return
    }

    const images = form.imagesRaw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
    const features = form.featuresRaw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)

    const payload = {
      title: form.title.trim(),
      description: form.description,
      type: form.type,
      status: form.status,
      operation: form.operation,
      price: priceNum,
      currency: form.currency,
      bedrooms: parseInt(form.bedrooms) || 0,
      bathrooms: parseInt(form.bathrooms) || 0,
      area: parseFloat(form.area) || 0,
      parking: parseInt(form.parking) || 0,
      location: form.location,
      city: form.city,
      zone: form.zone,
      address: form.address,
      images: JSON.stringify(images),
      features: JSON.stringify(features),
      featured: form.featured,
      published: form.published,
      videoUrl: form.videoUrl.trim(),
    }

    setSaving(true)
    try {
      const isEdit = Boolean(form.id)
      const url = isEdit
        ? `/api/agent/${agentId}/properties/${form.id}`
        : `/api/agent/${agentId}/properties`
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.success) {
        toast.error('No se pudo guardar', { description: data.error })
        return
      }
      toast.success(isEdit ? 'Propiedad actualizada' : 'Propiedad creada', {
        description: form.title,
      })
      onOpenChange(false)
      onSaved()
    } catch {
      toast.error('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  // Preview first image
  const previewImg = form.imagesRaw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="bg-gradient-to-br from-primary via-primary to-primary/80 p-5 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="relative flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gold/20 flex items-center justify-center">
              <Home className="h-5 w-5 text-gold" />
            </div>
            <div>
              <DialogTitle className="font-display text-lg font-bold">
                {initial ? 'Editar propiedad' : 'Nueva propiedad'}
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/70 text-xs">
                Completa los detalles de tu propiedad. Las imágenes soportan links de Google Drive.
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Title + price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="pf-title">Título *</Label>
              <Input
                id="pf-title"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Villa exclusiva en Piantini"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-price">Precio *</Label>
              <Input
                id="pf-price"
                type="number"
                min="0"
                step="any"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                placeholder="450000"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="pf-desc">Descripción</Label>
            <Textarea
              id="pf-desc"
              rows={4}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe la propiedad: ubicación, características, amenidades…"
            />
          </div>

          {/* Type / status / operation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => update('type', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TYPE_LABELS).map(([val, lbl]) => (
                    <SelectItem key={val} value={val}>{lbl}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => update('status', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_META).map(([val, meta]) => (
                    <SelectItem key={val} value={val}>{meta.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Operación</Label>
              <Select value={form.operation} onValueChange={(v) => update('operation', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OPERATION_LABELS).map(([val, lbl]) => (
                    <SelectItem key={val} value={val}>{lbl}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="space-y-2">
              <Label htmlFor="pf-bed">Hab.</Label>
              <Input id="pf-bed" type="number" min="0" value={form.bedrooms}
                onChange={(e) => update('bedrooms', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-bath">Baños</Label>
              <Input id="pf-bath" type="number" min="0" value={form.bathrooms}
                onChange={(e) => update('bathrooms', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-area">Área (m²)</Label>
              <Input id="pf-area" type="number" min="0" step="any" value={form.area}
                onChange={(e) => update('area', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-park">Parqueos</Label>
              <Input id="pf-park" type="number" min="0" value={form.parking}
                onChange={(e) => update('parking', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Moneda</Label>
              <Select value={form.currency} onValueChange={(v) => update('currency', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="DOP">DOP</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pf-loc">Ubicación</Label>
              <Input id="pf-loc" value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="Piantini" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-city">Ciudad</Label>
              <Input id="pf-city" value={form.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="Santo Domingo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-zone">Zona</Label>
              <Input id="pf-zone" value={form.zone}
                onChange={(e) => update('zone', e.target.value)}
                placeholder="Nacional" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pf-addr">Dirección</Label>
            <Input id="pf-addr" value={form.address}
              onChange={(e) => update('address', e.target.value)}
              placeholder="Av. 27 de Febrero #123" />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label htmlFor="pf-images" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-gold" />
              Imágenes (una URL por línea — soporta Google Drive)
            </Label>
            <Textarea
              id="pf-images"
              rows={3}
              value={form.imagesRaw}
              onChange={(e) => update('imagesRaw', e.target.value)}
              placeholder={`https://drive.google.com/file/d/XXXXX/view\nhttps://images.unsplash.com/photo-...`}
              className="font-mono text-xs"
            />
            {previewImg && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={convertImageUrl(previewImg)}
                  alt="Vista previa"
                  className="h-16 w-24 rounded-md object-cover border border-border"
                  onError={(e) => { e.currentTarget.src = PROPERTY_FALLBACK(form.title || 'Propiedad') }}
                />
                <p className="text-xs text-muted-foreground">
                  Vista previa de la primera imagen
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label htmlFor="pf-feat">Características (una por línea)</Label>
            <Textarea
              id="pf-feat"
              rows={3}
              value={form.featuresRaw}
              onChange={(e) => update('featuresRaw', e.target.value)}
              placeholder={`Piscina\nJardín\nSeguridad 24/7`}
              className="font-mono text-xs"
            />
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <Label htmlFor="pf-video">URL de video (opcional)</Label>
            <Input
              id="pf-video"
              value={form.videoUrl}
              onChange={(e) => update('videoUrl', e.target.value)}
              placeholder="https://youtube.com/watch?v=…"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label htmlFor="pf-feat-sw" className="font-medium cursor-pointer">Propiedad destacada</Label>
                <p className="text-[11px] text-muted-foreground">Aparece primero en la home</p>
              </div>
              <Switch
                id="pf-feat-sw"
                checked={form.featured}
                onCheckedChange={(v) => update('featured', v)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label htmlFor="pf-pub-sw" className="font-medium cursor-pointer">Publicada</Label>
                <p className="text-[11px] text-muted-foreground">Visible en el sitio público</p>
              </div>
              <Switch
                id="pf-pub-sw"
                checked={form.published}
                onCheckedChange={(v) => update('published', v)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving} className="bg-gradient-gold text-gold-foreground hover:opacity-90">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {initial ? 'Guardar cambios' : 'Crear propiedad'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/* ================================================================== */
/*  Property Row (in list)                                            */
/* ================================================================== */

function PropertyRow({
  property,
  onEdit,
  onDelete,
}: {
  property: AgentProperty
  onEdit: () => void
  onDelete: () => void
}) {
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const imgs = parseJsonArray(property.images)
  const status = STATUS_META[property.status] || STATUS_META.FOR_SALE
  const agentId = useAppStore((s) => s.agentSession?.agentId || '')

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/agent/${agentId}/properties/${property.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!data.success) {
        toast.error('No se pudo eliminar', { description: data.error })
        return
      }
      toast.success('Propiedad eliminada')
      onDelete()
    } catch {
      toast.error('Error de conexión')
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  return (
    <div className="group relative rounded-xl border border-border/60 bg-card hover:shadow-luxe transition-all overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div className="relative sm:w-44 h-32 sm:h-auto bg-muted shrink-0 overflow-hidden">
          <img
            src={convertImageUrl(imgs[0] || '')}
            alt={property.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.currentTarget.src = PROPERTY_FALLBACK(property.title) }}
          />
          {property.featured && (
            <div className="absolute top-2 left-2 bg-gradient-gold text-gold-foreground px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-luxe">
              <Star className="h-2.5 w-2.5" fill="currentColor" />
              Destacada
            </div>
          )}
          {!property.published && (
            <div className="absolute top-2 right-2 bg-amber-500/90 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
              Borrador
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="font-display font-bold text-base leading-tight truncate">
                {property.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {property.location ? `${property.location}, ` : ''}{property.city}
              </p>
            </div>
            <Badge variant="outline" className={`shrink-0 ${status.color}`}>
              {status.label}
            </Badge>
          </div>

          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <span className="text-gradient-gold font-display font-bold text-lg">
              {formatFullPrice(property.price, property.currency)}
            </span>
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
              {OPERATION_LABELS[property.operation] || property.operation}
            </span>
          </div>

          {/* Specs */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Bed className="h-3.5 w-3.5 text-gold" /> {property.bedrooms}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Bath className="h-3.5 w-3.5 text-gold" /> {property.bathrooms}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Maximize className="h-3.5 w-3.5 text-gold" /> {property.area} m²
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Car className="h-3.5 w-3.5 text-gold" /> {property.parking}
            </span>
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" /> {property.views} vistas
              </span>
              <span>{formatDateES(property.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" onClick={onEdit} className="h-8">
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Editar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirmOpen(true)}
                className="h-8 border-rose-500/40 text-rose-600 hover:bg-rose-500 hover:text-white hover:border-rose-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
          <div className="bg-rose-500/90 p-5 text-white">
            <DialogTitle className="font-display text-lg font-bold">¿Eliminar propiedad?</DialogTitle>
            <DialogDescription className="text-white/80 text-xs mt-1">
              Esta acción no se puede deshacer.
            </DialogDescription>
          </div>
          <div className="p-5">
            <p className="text-sm text-muted-foreground">
              Vas a eliminar <span className="font-semibold text-foreground">{property.title}</span>.
              La propiedad se borrará permanentemente de tu portafolio.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={deleting}>
                Cancelar
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Eliminando…
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Sí, eliminar
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ================================================================== */
/*  My Properties Tab                                                 */
/* ================================================================== */

function MyPropertiesTab({
  agentId,
  refreshKey,
  onRefresh,
}: {
  agentId: string
  refreshKey: number
  onRefresh: () => void
}) {
  const [properties, setProperties] = React.useState<AgentProperty[]>([])
  const [loading, setLoading] = React.useState(true)
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<AgentProperty | null>(null)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch(`/api/agent/${agentId}/properties`)
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return
        if (d.success) setProperties(d.data || [])
      })
      .catch(() => {
        if (mounted) toast.error('Error al cargar propiedades')
      })
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [agentId, refreshKey])

  const filtered = React.useMemo(() => {
    if (!search.trim()) return properties
    const q = search.toLowerCase()
    return properties.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
    )
  }, [properties, search])

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (p: AgentProperty) => {
    setEditing(p)
    setFormOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex-1 relative">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, ubicación o ciudad…"
            className="pr-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>
        <Button onClick={openNew} className="bg-gradient-gold text-gold-foreground hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Nueva propiedad
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center border-dashed">
          <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Home className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-display font-bold text-lg">
            {search ? 'Sin resultados' : 'No tienes propiedades todavía'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-5">
            {search
              ? 'Intenta con otro término de búsqueda.'
              : 'Crea tu primera propiedad para empezar a publicar en el sitio.'}
          </p>
          {!search && (
            <Button onClick={openNew} className="bg-gradient-gold text-gold-foreground hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Crear propiedad
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <PropertyRow
              key={p.id}
              property={p}
              onEdit={() => openEdit(p)}
              onDelete={onRefresh}
            />
          ))}
        </div>
      )}

      <PropertyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        agentId={agentId}
        onSaved={onRefresh}
      />
    </div>
  )
}

/* ================================================================== */
/*  Profile Tab                                                       */
/* ================================================================== */

function ProfileTab({ agentId, onRefresh }: { agentId: string; onRefresh: () => void }) {
  const [profile, setProfile] = React.useState<AgentProfile | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [form, setForm] = React.useState({
    name: '',
    title: '',
    bio: '',
    photoUrl: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    tiktok: '',
    facebook: '',
    specialties: '',
    password: '',
  })

  React.useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch(`/api/agent/${agentId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return
        if (d.success) {
          const a = d.data as AgentProfile
          setProfile(a)
          setForm({
            name: a.name || '',
            title: a.title || '',
            bio: a.bio || '',
            photoUrl: a.photoUrl || '',
            phone: a.phone || '',
            whatsapp: a.whatsapp || '',
            instagram: a.instagram || '',
            tiktok: a.tiktok || '',
            facebook: a.facebook || '',
            specialties: (() => {
              try {
                const arr = JSON.parse(a.specialties)
                return Array.isArray(arr) ? arr.join('\n') : a.specialties
              } catch {
                return a.specialties
              }
            })(),
            password: '',
          })
        }
      })
      .catch(() => mounted && toast.error('Error al cargar perfil'))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [agentId])

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    if (!form.name.trim()) {
      toast.error('El nombre es obligatorio')
      return
    }

    // Serialize specialties back to JSON array string
    const specialtiesArr = form.specialties
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean)

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      title: form.title,
      bio: form.bio,
      photoUrl: form.photoUrl,
      phone: form.phone,
      whatsapp: form.whatsapp,
      instagram: form.instagram,
      tiktok: form.tiktok,
      facebook: form.facebook,
      specialties: JSON.stringify(specialtiesArr),
    }
    if (form.password.trim().length > 0) {
      payload.password = form.password
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/agent/${agentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!data.success) {
        toast.error('No se pudo guardar', { description: data.error })
        return
      }
      toast.success('Perfil actualizado')
      setForm((prev) => ({ ...prev, password: '' }))
      onRefresh()
    } catch {
      toast.error('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !profile) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Photo preview + URL */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-gold" />
            Fotografía profesional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="relative h-32 w-32 rounded-full overflow-hidden ring-4 ring-gold/30 shadow-luxe shrink-0 bg-muted">
              <img
                src={convertImageUrl(form.photoUrl) || AVATAR_FALLBACK(form.name || 'Agente')}
                alt={`Foto de ${form.name}`}
                className="object-cover w-full h-full"
                onError={(e) => { e.currentTarget.src = AVATAR_FALLBACK(form.name || 'Agente') }}
              />
            </div>
            <div className="flex-1 w-full space-y-2">
              <Label htmlFor="pf-photo">URL de la foto (soporta Google Drive)</Label>
              <Input
                id="pf-photo"
                value={form.photoUrl}
                onChange={(e) => update('photoUrl', e.target.value)}
                placeholder="https://drive.google.com/file/d/…/view"
              />
              <p className="text-[11px] text-muted-foreground">
                La vista previa se actualiza en tiempo real mientras escribes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-gold" />
            Información básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pf-name">Nombre completo *</Label>
              <Input id="pf-name" value={form.name}
                onChange={(e) => update('name', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-title-field">Título / Cargo</Label>
              <Input id="pf-title-field" value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Broker Owner / Asesora Inmobiliaria" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pf-bio">Biografía</Label>
            <Textarea id="pf-bio" rows={4} value={form.bio}
              onChange={(e) => update('bio', e.target.value)}
              placeholder="Cuenta tu experiencia, especialidades y enfoque profesional…" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pf-spec">Especialidades (una por línea)</Label>
            <Textarea id="pf-spec" rows={3} value={form.specialties}
              onChange={(e) => update('specialties', e.target.value)}
              placeholder={`Casas de lujo\nTerrenos\nInversión comercial`} />
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Phone className="h-4 w-4 text-gold" />
            Contacto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pf-phone" className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-gold" /> Teléfono
              </Label>
              <Input id="pf-phone" value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="829-000-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-wa" className="flex items-center gap-1.5">
                <MessageCircle className="h-3 w-3 text-gold" /> WhatsApp
              </Label>
              <Input id="pf-wa" value={form.whatsapp}
                onChange={(e) => update('whatsapp', e.target.value)}
                placeholder="18290000000" />
            </div>
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="pf-email-readonly" className="flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-muted-foreground" /> Correo electrónico (no editable)
            </Label>
            <Input id="pf-email-readonly" value={profile.email} disabled className="bg-muted/50" />
            <p className="text-[11px] text-muted-foreground">
              Si necesitas cambiar tu correo, contacta al administrador.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Social */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Instagram className="h-4 w-4 text-gold" />
            Redes sociales
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pf-ig" className="flex items-center gap-1.5">
              <Instagram className="h-3 w-3 text-gold" /> Instagram
            </Label>
            <Input id="pf-ig" value={form.instagram}
              onChange={(e) => update('instagram', e.target.value)}
              placeholder="usuario" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pf-fb" className="flex items-center gap-1.5">
              <Facebook className="h-3 w-3 text-gold" /> Facebook
            </Label>
            <Input id="pf-fb" value={form.facebook}
              onChange={(e) => update('facebook', e.target.value)}
              placeholder="usuario o URL" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pf-tt">TikTok</Label>
            <Input id="pf-tt" value={form.tiktok}
              onChange={(e) => update('tiktok', e.target.value)}
              placeholder="usuario" />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Lock className="h-4 w-4 text-gold" />
            Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="pf-pass">Nueva contraseña (déjalo vacío para mantener la actual)</Label>
          <Input
            id="pf-pass"
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          <p className="text-[11px] text-muted-foreground">
            Usa al menos 6 caracteres. Tu contraseña actual sigue activa hasta que la cambies.
          </p>
        </CardContent>
      </Card>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-luxe"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando…
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar cambios del perfil
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

/* ================================================================== */
/*  Main View                                                         */
/* ================================================================== */

export function AgentDashboardView() {
  const { agentSession, setAgentSession, setView } = useAppStore()
  const [agent, setAgent] = React.useState<AgentProfile | null>(null)
  const [stats, setStats] = React.useState({ total: 0, published: 0, featured: 0, value: 0 })
  const [loading, setLoading] = React.useState(true)
  const [refreshKey, setRefreshKey] = React.useState(0)

  // Load full agent profile + stats when session changes or after refresh
  React.useEffect(() => {
    if (!agentSession?.agentId) {
      setLoading(false)
      return
    }
    let mounted = true
    setLoading(true)
    Promise.all([
      fetch(`/api/agent/${agentSession.agentId}`).then((r) => r.json()),
      fetch(`/api/agent/${agentSession.agentId}/properties`).then((r) => r.json()),
    ])
      .then(([agentRes, propsRes]) => {
        if (!mounted) return
        if (agentRes.success) setAgent(agentRes.data as AgentProfile)
        if (propsRes.success) {
          const props = propsRes.data as AgentProperty[]
          setStats({
            total: props.length,
            published: props.filter((p) => p.published).length,
            featured: props.filter((p) => p.featured).length,
            value: props.reduce((sum, p) => sum + (p.price || 0), 0),
          })
        }
      })
      .catch(() => mounted && toast.error('Error al cargar datos del agente'))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [agentSession?.agentId, refreshKey])

  // Not logged in → show login prompt
  if (!agentSession) {
    return <LoginPrompt />
  }

  const handleLogout = () => {
    setAgentSession(null)
    setView('home')
    toast.success('Sesión cerrada')
  }

  const handleRefresh = () => setRefreshKey((k) => k + 1)

  const displayName = agent?.name || agentSession.name
  const displayTitle = agent?.title || 'Asesor Inmobiliario'
  const photoSrc = convertImageUrl(agent?.photoUrl || '') || AVATAR_FALLBACK(displayName)

  return (
    <div className="pt-28 pb-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/85 text-primary-foreground p-6 sm:p-8 shadow-luxe"
        >
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden ring-4 ring-gold/40 shadow-luxe shrink-0 bg-muted">
              <img
                src={photoSrc}
                alt={`Foto de ${displayName}`}
                className="object-cover w-full h-full"
                onError={(e) => { e.currentTarget.src = AVATAR_FALLBACK(displayName) }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.25em] text-gold font-semibold mb-1">
                Panel del Agente
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                Hola, {displayName.split(' ')[0]}
              </h1>
              <p className="text-sm text-primary-foreground/80 mt-1">
                {displayTitle} · IMPULSA Real Estate
              </p>
              {agent && (
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full">
                    <Star className="h-3 w-3 text-gold" fill="currentColor" />
                    {agent.rating.toFixed(1)} valoración
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3 text-gold" />
                    {agent.salesCount} ventas
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full">
                    <ExternalLink className="h-3 w-3 text-gold" />
                    {agent.email}
                  </span>
                </div>
              )}
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Home}
            label="Total propiedades"
            value={loading ? '—' : String(stats.total)}
            hint="En tu portafolio"
            accent="primary"
          />
          <StatCard
            icon={Eye}
            label="Publicadas"
            value={loading ? '—' : String(stats.published)}
            hint="Visibles en el sitio"
            accent="gold"
          />
          <StatCard
            icon={Star}
            label="Destacadas"
            value={loading ? '—' : String(stats.featured)}
            hint="Aparecen en la home"
            accent="gold"
          />
          <StatCard
            icon={DollarSign}
            label="Valor portafolio"
            value={loading ? '—' : formatPrice(stats.value)}
            hint="Suma de precios"
            accent="primary"
          />
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:inline-grid">
              <TabsTrigger value="properties" className="gap-1.5">
                <ListChecks className="h-4 w-4" />
                Mis Propiedades
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-1.5">
                <UserCircle className="h-4 w-4" />
                Mi Perfil
              </TabsTrigger>
            </TabsList>
            <TabsContent value="properties" className="mt-5">
              <MyPropertiesTab
                agentId={agentSession.agentId}
                refreshKey={refreshKey}
                onRefresh={handleRefresh}
              />
            </TabsContent>
            <TabsContent value="profile" className="mt-5">
              <ProfileTab agentId={agentSession.agentId} onRefresh={handleRefresh} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Bottom: back to site */}
        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            ¿Necesitas ayuda con tu panel? Escríbenos a{' '}
            <a href="mailto:info@impulsarealestate.com" className="text-gold hover:underline">
              info@impulsarealestate.com
            </a>
          </p>
          <Button variant="outline" size="sm" onClick={() => setView('home')}>
            <Building2 className="h-3.5 w-3.5 mr-1.5" />
            Ver sitio público
          </Button>
        </div>
      </div>
    </div>
  )
}
