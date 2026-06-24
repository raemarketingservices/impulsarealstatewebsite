'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Phone,
  Mail,
  Building2,
  X,
  Loader2,
  ImageIcon,
  MessageCircle,
  Instagram,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { convertImageUrl } from '@/lib/image-utils'

// ---------- Types ----------
interface Agent {
  id: string
  name: string
  title: string
  bio: string
  photoUrl: string
  phone: string
  email: string
  whatsapp: string
  instagram: string | null
  tiktok: string | null
  facebook: string | null
  specialties: string // JSON array
  rating: number
  salesCount: number
  order: number
  active: boolean
  propertyCount: number
  createdAt: string
  updatedAt: string
}

interface AgentFormState {
  name: string
  title: string
  bio: string
  photoUrl: string
  phone: string
  email: string
  password: string
  whatsapp: string
  instagram: string
  tiktok: string
  facebook: string
  specialties: string[]
  rating: number
  salesCount: number
  active: boolean
}

const EMPTY_FORM: AgentFormState = {
  name: '',
  title: '',
  bio: '',
  photoUrl: '',
  phone: '',
  email: '',
  password: '',
  whatsapp: '',
  instagram: '',
  tiktok: '',
  facebook: '',
  specialties: [],
  rating: 5.0,
  salesCount: 0,
  active: true,
}

// Parse specialties JSON safely
function parseSpecialties(raw: string): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.map(String)
    return []
  } catch {
    return []
  }
}

// Fallback avatar URL generator
function fallbackAvatar(name: string): string {
  return (
    'https://ui-avatars.com/api/?name=' +
    encodeURIComponent(name || 'Agente') +
    '&size=200&background=0f2438&color=c9a227'
  )
}

// Avatar image with onError fallback
function AgentAvatar({
  src,
  name,
  size = 'md',
}: {
  src: string
  name: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const dims =
    size === 'lg' ? 'h-28 w-28' : size === 'sm' ? 'h-10 w-10' : 'h-20 w-20'
  const converted = convertImageUrl(src)
  const [url, setUrl] = React.useState(converted || fallbackAvatar(name))

  React.useEffect(() => {
    setUrl(converted || fallbackAvatar(name))
  }, [converted, name])

  return (
    <img
      src={url}
      alt={name}
      onError={(e) => {
        e.currentTarget.src = fallbackAvatar(name)
      }}
      className={`${dims} rounded-full object-cover ring-2 ring-gold/30 shadow-luxe shrink-0`}
    />
  )
}

// ---------- Main Component ----------
export function AgentsManager() {
  const [agents, setAgents] = React.useState<Agent[]>([])
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [form, setForm] = React.useState<AgentFormState>(EMPTY_FORM)
  const [newSpecialty, setNewSpecialty] = React.useState('')
  const [confirmDelete, setConfirmDelete] = React.useState<Agent | null>(null)

  // ---------- Load agents ----------
  const loadAgents = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/agents')
      const data = await res.json()
      if (data.success) {
        setAgents(data.data)
      } else {
        toast.error('Error al cargar agentes')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadAgents()
  }, [loadAgents])

  // ---------- Form helpers ----------
  const openNewDialog = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setNewSpecialty('')
    setDialogOpen(true)
  }

  const openEditDialog = (agent: Agent) => {
    setForm({
      name: agent.name,
      title: agent.title,
      bio: agent.bio,
      photoUrl: agent.photoUrl,
      phone: agent.phone,
      email: agent.email,
      password: '', // never prefill password
      whatsapp: agent.whatsapp,
      instagram: agent.instagram ?? '',
      tiktok: agent.tiktok ?? '',
      facebook: agent.facebook ?? '',
      specialties: parseSpecialties(agent.specialties),
      rating: agent.rating,
      salesCount: agent.salesCount,
      active: agent.active,
    })
    setEditingId(agent.id)
    setNewSpecialty('')
    setDialogOpen(true)
  }

  const updateField = <K extends keyof AgentFormState>(
    key: K,
    value: AgentFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const addSpecialty = () => {
    const trimmed = newSpecialty.trim()
    if (!trimmed) return
    if (form.specialties.includes(trimmed)) {
      setNewSpecialty('')
      return
    }
    updateField('specialties', [...form.specialties, trimmed])
    setNewSpecialty('')
  }

  const removeSpecialty = (s: string) => {
    updateField(
      'specialties',
      form.specialties.filter((x) => x !== s)
    )
  }

  // ---------- Submit (create or update) ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error('El nombre es obligatorio')
      return
    }
    if (!form.email.trim()) {
      toast.error('El email es obligatorio')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        title: form.title.trim(),
        bio: form.bio,
        photoUrl: form.photoUrl.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        password: form.password,
        whatsapp: form.whatsapp.trim(),
        instagram: form.instagram.trim() || null,
        tiktok: form.tiktok.trim() || null,
        facebook: form.facebook.trim() || null,
        specialties: JSON.stringify(form.specialties),
        rating: Number(form.rating) || 0,
        salesCount: Number(form.salesCount) || 0,
        active: form.active,
      }

      const isEdit = !!editingId
      const url = isEdit
        ? `/api/admin/agents/${editingId}`
        : '/api/admin/agents'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(
          isEdit ? 'Agente actualizado' : 'Agente creado',
          {
            description: isEdit
              ? 'Los cambios se guardaron correctamente'
              : `${form.name} fue añadido al directorio`,
          }
        )
        setDialogOpen(false)
        loadAgents()
      } else {
        toast.error(data.error || 'Error al guardar')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  // ---------- Delete ----------
  const handleDelete = async (agent: Agent) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/agents/${agent.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Agente eliminado', {
          description: `${agent.name} fue eliminado. Sus propiedades quedaron sin agente asignado.`,
        })
        setConfirmDelete(null)
        loadAgents()
      } else {
        toast.error(data.error || 'Error al eliminar')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  // ---------- Render ----------
  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Directorio de agentes
            <Badge variant="secondary" className="text-[10px]">{agents.length}</Badge>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Crea, edita y gestiona los asesores inmobiliarios del sitio.
          </p>
        </div>
        <Button
          onClick={openNewDialog}
          className="bg-gradient-emerald text-primary-foreground shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" /> Nuevo agente
        </Button>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-full bg-muted rounded animate-pulse" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : agents.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-display text-lg font-bold mb-1">No hay agentes</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Crea el primer agente para comenzar a poblar el directorio.
          </p>
          <Button
            onClick={openNewDialog}
            className="bg-gradient-emerald text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" /> Crear agente
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map((agent, idx) => {
            const specs = parseSpecialties(agent.specialties)
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Card
                  className={`p-5 shadow-sm h-full flex flex-col ${
                    !agent.active ? 'opacity-60' : ''
                  }`}
                >
                  {/* Header row: avatar + name + actions */}
                  <div className="flex items-start gap-4">
                    <AgentAvatar src={agent.photoUrl} name={agent.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-base font-bold truncate">
                          {agent.name}
                        </h3>
                        {!agent.active && (
                          <Badge variant="outline" className="text-[9px] shrink-0">
                            Inactivo
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {agent.title || 'Asesor inmobiliario'}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-gold text-gold" />
                        <span className="text-xs font-semibold">
                          {Number(agent.rating).toFixed(1)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          · {agent.salesCount} ventas
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditDialog(agent)}
                        className="h-8 w-8 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                        title="Editar agente"
                        aria-label={`Editar ${agent.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(agent)}
                        className="h-8 w-8 rounded-lg bg-muted hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors text-muted-foreground"
                        title="Eliminar agente"
                        aria-label={`Eliminar ${agent.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="mt-4 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{agent.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{agent.phone || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        WhatsApp: {agent.whatsapp || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Specialties */}
                  {specs.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {specs.slice(0, 4).map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="text-[10px] bg-primary/10 text-primary"
                        >
                          {s}
                        </Badge>
                      ))}
                      {specs.length > 4 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{specs.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Footer: property count */}
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/60 mt-4">
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" />
                      {agent.propertyCount}{' '}
                      {agent.propertyCount === 1
                        ? 'propiedad'
                        : 'propiedades'}
                    </span>
                    {agent.instagram && (
                      <a
                        href={agent.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* ---------- Create / Edit Dialog ---------- */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar agente' : 'Nuevo agente'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Actualiza los datos del asesor. Deja la contraseña vacía para no cambiarla.'
                : 'Completa los datos del nuevo asesor inmobiliario.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo + name */}
            <div className="flex items-center gap-4">
              <AgentAvatar
                src={form.photoUrl}
                name={form.name}
                size="lg"
              />
              <div className="flex-1 space-y-2">
                <Label htmlFor="ag-photo" className="text-xs">
                  URL de foto (soporta Google Drive)
                </Label>
                <Input
                  id="ag-photo"
                  value={form.photoUrl}
                  onChange={(e) => updateField('photoUrl', e.target.value)}
                  placeholder="https://drive.google.com/file/d/.../view"
                  className="text-sm"
                />
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  La vista previa se actualiza en tiempo real.
                </p>
              </div>
            </div>

            {/* Name + title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="ag-name" className="text-xs">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ag-name"
                  required
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="María Fernández"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ag-title" className="text-xs">
                  Título / cargo
                </Label>
                <Input
                  id="ag-title"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Asesora Senior"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="ag-bio" className="text-xs">
                Biografía
              </Label>
              <Textarea
                id="ag-bio"
                value={form.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Breve descripción de la experiencia y especialidades del agente..."
                rows={3}
              />
            </div>

            {/* Contact: phone + email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="ag-phone" className="text-xs">
                  Teléfono
                </Label>
                <Input
                  id="ag-phone"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="809-555-0100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ag-email" className="text-xs">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ag-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="maria@impulsa.do"
                />
              </div>
            </div>

            {/* Password + whatsapp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="ag-pass" className="text-xs">
                  Contraseña{' '}
                  {editingId && (
                    <span className="text-muted-foreground">
                      (vacío = sin cambio)
                    </span>
                  )}
                </Label>
                <Input
                  id="ag-pass"
                  type="text"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder={editingId ? '••••••••' : 'impulsa'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ag-wa" className="text-xs">
                  WhatsApp (solo números)
                </Label>
                <Input
                  id="ag-wa"
                  value={form.whatsapp}
                  onChange={(e) => updateField('whatsapp', e.target.value)}
                  placeholder="18095550100"
                />
              </div>
            </div>

            {/* Social */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="ag-ig" className="text-xs">
                  Instagram
                </Label>
                <Input
                  id="ag-ig"
                  value={form.instagram}
                  onChange={(e) => updateField('instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ag-tk" className="text-xs">
                  TikTok
                </Label>
                <Input
                  id="ag-tk"
                  value={form.tiktok}
                  onChange={(e) => updateField('tiktok', e.target.value)}
                  placeholder="https://tiktok.com/@..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ag-fb" className="text-xs">
                  Facebook
                </Label>
                <Input
                  id="ag-fb"
                  value={form.facebook}
                  onChange={(e) => updateField('facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>

            {/* Specialties (tag input) */}
            <div className="space-y-2">
              <Label className="text-xs">Especialidades</Label>
              <div className="flex gap-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSpecialty()
                    }
                  }}
                  placeholder="Casas de lujo, Apartamentos..."
                  className="text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSpecialty}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {form.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.specialties.map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary pl-2 pr-1 py-1 gap-1"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(s)}
                        className="hover:text-destructive rounded-full p-0.5"
                        aria-label={`Quitar ${s}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-muted-foreground">
                Presiona Enter para añadir cada especialidad.
              </p>
            </div>

            {/* Rating + salesCount + active */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="space-y-2">
                <Label htmlFor="ag-rating" className="text-xs">
                  Calificación (0-5)
                </Label>
                <Input
                  id="ag-rating"
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={form.rating}
                  onChange={(e) =>
                    updateField('rating', parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ag-sales" className="text-xs">
                  Ventas totales
                </Label>
                <Input
                  id="ag-sales"
                  type="number"
                  min={0}
                  step={1}
                  value={form.salesCount}
                  onChange={(e) =>
                    updateField('salesCount', parseInt(e.target.value, 10) || 0)
                  }
                />
              </div>
              <div className="flex items-center justify-between space-y-0 rounded-lg border p-3 h-10">
                <Label htmlFor="ag-active" className="text-xs cursor-pointer">
                  Activo
                </Label>
                <Switch
                  id="ag-active"
                  checked={form.active}
                  onCheckedChange={(v) => updateField('active', v)}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-emerald text-primary-foreground"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    {editingId ? 'Guardar cambios' : 'Crear agente'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ---------- Delete Confirmation Dialog ---------- */}
      <Dialog
        open={!!confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar agente</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar a{' '}
              <span className="font-semibold text-foreground">
                {confirmDelete?.name}
              </span>
              ? Esta acción no se puede deshacer. Las propiedades asociadas
              quedarán sin agente asignado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setConfirmDelete(null)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDelete && handleDelete(confirmDelete)}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
