'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Save, RotateCcw, MessageCircle, Phone, Mail, MapPin, Instagram, Facebook, Check, Lock, ArrowLeft, Plus, Trash2, ExternalLink, Award, Building2, Home, Users, Images, HelpCircle } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Setting {
  key: string
  value: string
  label: string
  group: string
  updatedAt: string
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

const GROUP_CONFIG: Record<string, { title: string; icon: React.ElementType; description: string }> = {
  hero: { title: 'Hero Banner (Inicio)', icon: Building2, description: 'Edita el texto, estadísticas e imagen de fondo del banner principal. Soporta links de Google Drive para la imagen.' },
  home_sections: { title: 'Secciones de la Home', icon: Home, description: 'Edita el texto del buscador, propiedades destacadas, video corporativo y estadísticas. Soporta links de Google Drive para imágenes.' },
  agents_page: { title: 'Página de Agentes', icon: Users, description: 'Edita el texto del directorio de agentes.' },
  gallery_page: { title: 'Galería y Testimonios', icon: Images, description: 'Edita el texto de la galería social y testimonios.' },
  faq_page: { title: 'Página de FAQ', icon: HelpCircle, description: 'Edita el texto de la sección de preguntas frecuentes.' },
  whatsapp: { title: 'Números de WhatsApp', icon: MessageCircle, description: 'Edita los números de WhatsApp de la empresa y cada asesor.' },
  contact: { title: 'Información de Contacto', icon: Phone, description: 'Teléfono, email y dirección general de la empresa.' },
  social: { title: 'Redes Sociales', icon: Instagram, description: 'Enlaces a perfiles de redes sociales.' },
  brands: { title: 'Inmobiliarias que Confían', icon: Award, description: 'Edita la lista de inmobiliarias de la cinta giratoria. Se actualiza en tiempo real.' },
  general: { title: 'Configuración General', icon: SettingsIcon, description: 'Otras configuraciones del sistema.' },
}

const GROUP_ORDER = ['hero', 'home_sections', 'agents_page', 'gallery_page', 'faq_page', 'whatsapp', 'contact', 'social', 'brands', 'general']

// Keys whose value is long text → render as textarea
const TEXTAREA_KEYS = new Set([
  'chatbot_knowledge',
  'chatbot_system_prompt',
  'chatbot_welcome',
  'trust_brands_list',
  'footer_copyright',
  'footer_description',
  'address',
  'hero_subtitle',
  'hero_banner_image',
  'featured_description',
  'video_title',
  'video_quote',
  'video_value1_desc',
  'video_value2_desc',
  'video_value3_desc',
  'video_poster_image',
  'agents_description',
  'gallery_description',
  'faq_description',
])

export function AdminView() {
  const { setView } = useAppStore()
  const [settings, setSettings] = React.useState<Setting[]>([])
  const [original, setOriginal] = React.useState<Setting[]>([])
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [authed, setAuthed] = React.useState(false)
  const [adminPass, setAdminPass] = React.useState('')

  const loadSettings = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.success) {
        setSettings(data.data)
        setOriginal(data.data)
      }
    } catch {
      toast.error('Error al cargar configuración')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (authed) loadSettings()
  }, [authed, loadSettings])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPass === 'impulsa2026') {
      setAuthed(true)
      toast.success('Acceso concedido')
    } else {
      toast.error('Contraseña incorrecta')
    }
  }

  const updateValue = (key: string, value: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)))
  }

  const updateLabel = (key: string, label: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, label } : s)))
  }

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(original)

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = settings.map((s) => ({ key: s.key, value: s.value, label: s.label, group: s.group }))
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })
      const data = await res.json()
      if (data.success) {
        setOriginal(settings)
        toast.success('Configuración guardada', { description: `${updates.length} valores actualizados` })
      } else {
        toast.error('Error al guardar')
      }
    } catch {
      toast.error('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSettings(original)
    toast.info('Cambios descartados')
  }

  const handleAddSetting = () => {
    const key = window.prompt('Clave del nuevo setting (ej: whatsapp_nuevo):')
    if (!key) return
    if (settings.find((s) => s.key === key)) {
      toast.error('Esa clave ya existe')
      return
    }
    const newSetting: Setting = {
      key,
      value: '',
      label: key,
      group: 'general',
      updatedAt: new Date().toISOString(),
    }
    setSettings((prev) => [...prev, newSetting])
    toast.success('Setting añadido')
  }

  const handleDelete = (key: string) => {
    if (!window.confirm(`¿Eliminar el setting "${key}"?`)) return
    setSettings((prev) => prev.filter((s) => s.key !== key))
    toast.success('Setting eliminado (guarda para confirmar)')
  }

  // Group settings
  const grouped = GROUP_ORDER.reduce((acc, group) => {
    acc[group] = settings.filter((s) => s.group === group)
    return acc
  }, {} as Record<string, Setting[]>)

  // Login screen
  if (!authed) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
        <div className="container max-w-md px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-8 shadow-luxe">
              <div className="text-center mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-emerald flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-7 w-7 text-primary-foreground" />
                </div>
                <h1 className="font-display text-2xl font-bold">Panel de Administración</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Ingresa la contraseña para gestionar WhatsApp y contactos
                </p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-pass">Contraseña de admin</Label>
                  <Input
                    id="admin-pass"
                    type="password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="••••••••"
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-emerald text-primary-foreground">
                  Ingresar al panel
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setView('home')}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Volver al inicio
                </Button>
              </form>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Acceso restringido solo para administradores autorizados.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-px w-8 bg-gold" />
                <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Panel Admin</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Gestión de <span className="text-gradient-gold">WhatsApp y Contactos</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                Edita los números de WhatsApp, enlaces de redes sociales e información de contacto.
                Los cambios se aplican inmediatamente en todo el sitio.
              </p>
            </div>
            <Button variant="ghost" onClick={() => setView('home')} className="shrink-0">
              <ArrowLeft className="h-4 w-4 mr-2" /> Volver
            </Button>
          </div>
        </motion.div>

        {/* Save bar */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-20 z-30 mb-6"
          >
            <div className="glass rounded-2xl border border-gold/40 shadow-luxe p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                <span className="font-medium">Tienes cambios sin guardar</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleReset} disabled={saving}>
                  <RotateCcw className="h-4 w-4 mr-1.5" /> Descartar
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving} className="bg-gradient-gold text-gold-foreground">
                  {saving ? (
                    <><span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" /> Guardando...</>
                  ) : (
                    <><Save className="h-4 w-4 mr-1.5" /> Guardar cambios</>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="h-6 w-48 bg-muted rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  <div className="h-12 bg-muted rounded animate-pulse" />
                  <div className="h-12 bg-muted rounded animate-pulse" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {GROUP_ORDER.map((group) => {
              const config = GROUP_CONFIG[group] || GROUP_CONFIG.general
              const items = grouped[group] || []
              if (items.length === 0) return null
              return (
                <motion.div key={group} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                  <Card className="p-6 shadow-sm">
                    <div className="flex items-start gap-3 mb-5">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <config.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-display text-lg font-bold flex items-center gap-2">
                          {config.title}
                          <Badge variant="secondary" className="text-[10px]">{items.length}</Badge>
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {items.map((s) => {
                        const changed = original.find((o) => o.key === s.key)?.value !== s.value
                        const isWhatsapp = s.key.startsWith('whatsapp')
                        const isLink = s.value.startsWith('http')
                        const isLongText = TEXTAREA_KEYS.has(s.key)
                        return (
                          <div key={s.key} className={isLongText ? "grid grid-cols-1 gap-2 items-start" : "grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2 items-end"}>
                            <div>
                              <Label className="text-xs text-muted-foreground mb-1 block truncate">{s.key}</Label>
                              <Input
                                value={s.label}
                                onChange={(e) => updateLabel(s.key, e.target.value)}
                                className="h-10 text-sm bg-muted/40"
                                placeholder="Etiqueta"
                              />
                            </div>
                            <div className="relative">
                              {isLongText ? (
                                <textarea
                                  value={s.value}
                                  onChange={(e) => updateValue(s.key, e.target.value)}
                                  className={`w-full min-h-[100px] p-3 text-sm rounded-md border bg-background font-mono resize-y ${changed ? 'border-gold ring-1 ring-gold/30' : 'border-border/60'}`}
                                  placeholder="Contenido del setting..."
                                />
                              ) : (
                                <Input
                                  value={s.value}
                                  onChange={(e) => updateValue(s.key, e.target.value)}
                                  className={`h-10 text-sm font-mono ${changed ? 'border-gold ring-1 ring-gold/30' : ''}`}
                                  placeholder={isWhatsapp ? '18095550100' : 'Valor'}
                                />
                              )}
                              {changed && (
                                <Badge className="absolute -top-2 -right-2 h-5 px-1.5 text-[9px] bg-gold text-gold-foreground">
                                  <Check className="h-2.5 w-2.5" />
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-1">
                              {isWhatsapp && s.value && (
                                <a
                                  href={`https://wa.me/${s.value}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-10 w-10 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                                  title="Probar WhatsApp"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </a>
                              )}
                              {isLink && s.value && (
                                <a
                                  href={s.value}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-10 w-10 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                                  title="Abrir enlace"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                              <button
                                onClick={() => handleDelete(s.key)}
                                className="h-10 w-10 rounded-lg bg-muted hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors text-muted-foreground"
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                </motion.div>
              )
            })}

            {/* Add new setting */}
            <Button variant="outline" onClick={handleAddSetting} className="w-full border-dashed">
              <Plus className="h-4 w-4 mr-2" /> Añadir nuevo setting
            </Button>

            {/* Bottom save button */}
            {hasChanges && (
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" onClick={handleReset} disabled={saving}>
                  <RotateCcw className="h-4 w-4 mr-2" /> Descartar
                </Button>
                <Button onClick={handleSave} disabled={saving} className="bg-gradient-gold text-gold-foreground">
                  {saving ? 'Guardando...' : <><Save className="h-4 w-4 mr-2" /> Guardar todos los cambios</>}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
