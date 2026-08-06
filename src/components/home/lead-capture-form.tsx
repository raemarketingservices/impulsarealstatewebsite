'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Send, CheckCircle2, Loader2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImpulsaMap, MapMarkerData } from '@/components/map/impulsa-map'
import { toast } from 'sonner'

const LEAD_TYPES = ['Persona natural', 'Empresa', 'Inversionista', 'Otro']
const PROPERTY_TYPES = ['Casa', 'Apartamento', 'Villa', 'Terreno', 'Comercial', 'Sin especificar']

const EMPTY_FORM = {
  type: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  propertyType: '',
  budget: '',
  zoneName: '',
  message: '',
}

export function LeadCaptureForm() {
  const [form, setForm] = React.useState(EMPTY_FORM)
  const [markers, setMarkers] = React.useState<MapMarkerData[]>([])
  const [picked, setPicked] = React.useState<{ lat: number; lng: number } | null>(null)
  const [sending, setSending] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    fetch('/api/properties?limit=60')
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return
        const data = Array.isArray(d.data) ? d.data : []
        const points = data
          .filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number')
          .map((p) => ({
            id: p.id,
            lat: p.lat,
            lng: p.lng,
            title: `${p.title} · ${p.city || ''}`,
            price: p.price,
            currency: p.currency,
          }))
        setMarkers(points)
      })
      .catch(() => mounted && undefined)
    return () => {
      mounted = false
    }
  }, [])

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handlePick = (lat: number, lng: number) => {
    setPicked({ lat, lng })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error('Completa nombres y apellidos')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error('Correo inválido')
      return
    }
    if (!form.type) {
      toast.error('Selecciona el tipo de cliente')
      return
    }
    if (!form.propertyType) {
      toast.error('Selecciona el tipo de propiedad que buscas')
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          email: form.email.trim(),
          lat: picked?.lat,
          lng: picked?.lng,
        }),
      })
      const data = await res.json()
      if (!data.success) {
        toast.error('No se pudo enviar', { description: data.error })
        return
      }
      setSent(true)
      setForm(EMPTY_FORM)
      setPicked(null)
    } catch {
      toast.error('Error de conexión')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-10 text-center shadow-luxe border-gold/30">
          <div className="h-16 w-16 rounded-full bg-gold/15 text-gold flex items-center justify-center mx-auto mb-5 ring-2 ring-gold/30">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="font-display text-2xl font-bold mb-2">¡Recibimos tu solicitud!</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Un asesor de IMPULSA Real Estate te contactará muy pronto con opciones que
            se ajusten a lo que buscas.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setSent(false)}
          >
            Enviar otra solicitud
          </Button>
        </Card>
      </motion.div>
    )
  }

  return (
    <div id="contacto">
      <div className="mb-8 text-center">
        <span className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">
          Búsqueda Personalizada
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">
          Encuentra la propiedad <span className="text-gradient-gold">ideal para ti</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto">
          Cuéntanos qué buscas y uno de nuestros asesores te contactará con las mejores
          opciones. También puedes marcarlo en el mapa.
        </p>
      </div>

      <Card className="p-6 sm:p-8 shadow-luxe">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tipo + names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lf-type">Tipo de cliente *</Label>
              <Select value={form.type} onValueChange={(v) => update('type', v)}>
                <SelectTrigger id="lf-type" className="w-full">
                  <SelectValue placeholder="Selecciona…" />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lf-first">Nombres *</Label>
              <Input id="lf-first" value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                placeholder="María" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lf-last">Apellidos *</Label>
              <Input id="lf-last" value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                placeholder="García Pérez" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lf-email">Correo electrónico *</Label>
              <Input id="lf-email" type="email" value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="maria@correo.com" required />
            </div>
          </div>

          {/* phone + type + budget + zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lf-phone">Teléfono / WhatsApp</Label>
              <Input id="lf-phone" value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="809-000-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lf-proptype">Tipo de propiedad buscada *</Label>
              <Select value={form.propertyType} onValueChange={(v) => update('propertyType', v)}>
                <SelectTrigger id="lf-proptype" className="w-full">
                  <SelectValue placeholder="Selecciona…" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lf-budget">Presupuesto</Label>
              <Input id="lf-budget" value={form.budget}
                onChange={(e) => update('budget', e.target.value)}
                placeholder="US$ 150,000 - 250,000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lf-zone" className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-gold" /> Zona de interés
              </Label>
              <Input id="lf-zone" value={form.zoneName}
                onChange={(e) => update('zoneName', e.target.value)}
                placeholder="Piantini, Santo Domingo" />
            </div>
          </div>

          {/* Map */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Users className="h-3 w-3 text-gold" />
              Zona de interés en el mapa
              <span className="text-[11px] text-muted-foreground font-normal">
                Haz clic en el mapa · los pines dorados son propiedades disponibles
              </span>
            </Label>
            <ImpulsaMap
              markers={markers}
              onPick={handlePick}
              picked={picked}
              heightClass="h-[300px]"
            />
            {picked && (
              <p className="text-xs text-muted-foreground">
                Ubicación marcada: {picked.lat.toFixed(5)}, {picked.lng.toFixed(5)}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="lf-msg">Mensaje (opcional)</Label>
            <Textarea id="lf-msg" rows={3} value={form.message}
              onChange={(e) => update('message', e.target.value)}
              placeholder="Cuéntanos más sobre lo que buscas…" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-muted-foreground">
              Al enviar aceptas ser contactado por un asesor de IMPULSA Real Estate.
            </p>
            <Button
              type="submit"
              disabled={sending}
              className="bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-luxe shrink-0"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar solicitud
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}