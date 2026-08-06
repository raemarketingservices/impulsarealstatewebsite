'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Tag,
  Wallet,
  MessageSquare,
  Trash2,
  ChevronDown,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Heart,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { toast } from 'sonner'

export const LEAD_STATUSES = ['PENDIENTE', 'CONTACTADO', 'INTERESADO', 'NO_INTERESADO'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const STATUS_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-amber-500/15 text-amber-600 border-amber-500/30', icon: Clock },
  CONTACTADO: { label: 'Contactado', color: 'bg-sky-500/15 text-sky-600 border-sky-500/30', icon: Phone },
  INTERESADO: { label: 'Interesado', color: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30', icon: Heart },
  NO_INTERESADO: { label: 'No interesado', color: 'bg-rose-500/15 text-rose-600 border-rose-500/30', icon: XCircle },
}

interface LeadNote {
  text: string
  createdAt: number
  by: string
}

interface Lead {
  id: string
  type: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  propertyType: string
  budget: string
  zoneName: string
  lat?: number | null
  lng?: number | null
  message?: string | null
  status: string
  agentId?: string | null
  notes: LeadNote[]
  createdAt: number
  updatedAt: number
  agent: { id: string; name: string; photoUrl: string } | null
}

interface Agent {
  id: string
  name: string
  title: string
  photoUrl: string
  active: boolean
}

function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

function LeadRow({
  lead,
  agents,
  onUpdated,
}: {
  lead: Lead
  agents: Agent[]
  onUpdated: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [note, setNote] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const meta = STATUS_META[lead.status] || STATUS_META.PENDIENTE

  const applyPatch = async (patch: Record<string, unknown>) => {
    setBusy(true)
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (!data.success) {
        toast.error('Error al actualizar', { description: data.error })
        return
      }
      onUpdated()
    } catch {
      toast.error('Error de conexión')
    } finally {
      setBusy(false)
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return
    await applyPatch({ note, noteBy: 'admin' })
    setNote('')
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-3 text-left min-w-0"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center shrink-0 ring-2 ring-gold/30">
            <Users className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate">
              {lead.firstName} {lead.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
              <Mail className="h-3 w-3" /> {lead.email}
              {lead.phone && (
                <>
                  <span className="mx-0.5">·</span>
                  <Phone className="h-3 w-3" /> {lead.phone}
                </>
              )}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={meta.color}>
            {meta.label}
          </Badge>
          <Badge variant="outline">
            {lead.agent ? lead.agent.name : 'Sin asignar'}
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            {formatDate(lead.createdAt)}
          </Badge>
          <Button size="sm" variant="ghost" onClick={() => setOpen((v) => !v)} className="h-8">
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/50 p-4 space-y-4 bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Details */}
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-3.5 w-3.5 text-gold" /> Tipo: <span className="text-foreground">{lead.type}</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 text-gold" /> Busca: <span className="text-foreground">{lead.propertyType}</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Wallet className="h-3.5 w-3.5 text-gold" /> Presupuesto: <span className="text-foreground">{lead.budget || '—'}</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-gold" /> Zona: <span className="text-foreground">{lead.zoneName || '—'}</span>
                {typeof lead.lat === 'number' && (
                  <span className="text-[10px] text-muted-foreground">
                    ({lead.lat.toFixed(4)}, {lead.lng?.toFixed(4)})
                  </span>
                )}
              </p>
              {lead.message && (
                <p className="flex items-start gap-2 text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
                  <span className="text-foreground">{lead.message}</span>
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Estado</Label>
                <Select
                  value={lead.status}
                  onValueChange={(v) => applyPatch({ status: v })}
                  disabled={busy}
                >
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Asignar a asesor</Label>
                <Select
                  value={lead.agentId || 'none'}
                  onValueChange={(v) => applyPatch({ agentId: v === 'none' ? null : v })}
                  disabled={busy}
                >
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asignar</SelectItem>
                    {agents.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {lead.phone && (
                <a
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white text-sm font-medium px-3 h-9 transition-colors border border-[#25D366]/30"
                >
                  <Phone className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              )}
              <Button
                size="sm"
                variant="outline"
                className="border-rose-500/40 text-rose-600 hover:bg-rose-500 hover:text-white h-9"
                onClick={async () => {
                  if (!window.confirm('¿Eliminar este lead?')) return
                  const res = await fetch(`/api/leads/${lead.id}`, { method: 'DELETE' })
                  if (res.ok) {
                    toast.success('Lead eliminado')
                    onUpdated()
                  }
                }}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Eliminar
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-[11px] text-muted-foreground">Notas del asesor</Label>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {lead.notes.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sin notas todavía.</p>
              ) : (
                [...lead.notes].reverse().map((n, i) => (
                  <div key={i} className="rounded-lg border border-border/60 bg-background p-2.5">
                    <p className="text-xs">{n.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {n.by} · {formatDate(n.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={handleAddNote} className="flex gap-2">
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Añadir nota…"
                className="h-9 text-sm"
              />
              <Button type="submit" size="sm" className="h-9 shrink-0" disabled={busy || !note.trim()}>
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Añadir'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export function LeadsManager() {
  const [leads, setLeads] = React.useState<Lead[]>([])
  const [agents, setAgents] = React.useState<Agent[]>([])
  const [loading, setLoading] = React.useState(true)
  const [agentFilter, setAgentFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [search, setSearch] = React.useState('')

  const load = React.useCallback(async () => {
    try {
      const [leadsRes, agentsRes] = await Promise.all([
        fetch('/api/leads').then((r) => r.json()),
        fetch('/api/admin/agents').then((r) => r.json()),
      ])
      if (leadsRes.success) setLeads(leadsRes.data || [])
      if (agentsRes.success) setAgents(agentsRes.data || [])
    } catch {
      toast.error('Error al cargar leads')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    load()
    const interval = setInterval(load, 20000)
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
    }
  }, [load])

  const filtered = React.useMemo(() => {
    let list = leads
    if (agentFilter !== 'all') {
      list = list.filter((l) => (agentFilter === 'none' ? !l.agentId : l.agentId === agentFilter))
    }
    if (statusFilter !== 'all') list = list.filter((l) => l.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (l) =>
          `${l.firstName} ${l.lastName}`.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.zoneName.toLowerCase().includes(q)
      )
    }
    return list
  }, [leads, agentFilter, statusFilter, search])

  const counts = React.useMemo(() => {
    const c: Record<string, number> = { TOTAL: leads.length }
    for (const s of LEAD_STATUSES) c[s] = 0
    for (const l of leads) c[l.status] = (c[l.status] || 0) + 1
    c.SIN_ASIGNAR = leads.filter((l) => !l.agentId).length
    return c
  }, [leads])

  const perAgentData = React.useMemo(() => {
    const map = new Map<string, number>()
    for (const l of leads) {
      const key = l.agent ? l.agent.name : 'Sin asignar'
      map.set(key, (map.get(key) || 0) + 1)
    }
    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [leads])

  const perStatusData = React.useMemo(() => {
    return LEAD_STATUSES.map((s) => ({
      name: STATUS_META[s].label,
      value: counts[s] || 0,
      color: s === 'PENDIENTE' ? '#f59e0b' : s === 'CONTACTADO' ? '#0ea5e9' : s === 'INTERESADO' ? '#10b981' : '#f43f5e',
    })).filter((d) => d.value > 0)
  }, [counts])

  const summary = [
    { label: 'Total leads', value: counts.TOTAL, icon: Users, accent: 'primary' },
    { label: 'Pendientes', value: counts.PENDIENTE, icon: Clock, accent: 'amber' },
    { label: 'Contactados', value: counts.CONTACTADO, icon: Phone, accent: 'sky' },
    { label: 'Interesados', value: counts.INTERESADO, icon: Heart, accent: 'emerald' },
    { label: 'No interesados', value: counts.NO_INTERESADO, icon: XCircle, accent: 'rose' },
    { label: 'Sin asignar', value: counts.SIN_ASIGNAR, icon: UserPlus, accent: 'gold' },
  ]

  const accentClasses: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    gold: 'bg-gold/15 text-gold',
    amber: 'bg-amber-500/15 text-amber-600',
    sky: 'bg-sky-500/15 text-sky-600',
    emerald: 'bg-emerald-500/15 text-emerald-600',
    rose: 'bg-rose-500/15 text-rose-600',
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {summary.map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-4">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-2 ${accentClasses[s.accent]}`}>
                <s.icon className="h-4.5 w-4.5" />
              </div>
              <p className="font-display text-xl font-bold">{loading ? '—' : s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      {!loading && leads.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-gold" /> Leads por asesor
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={perAgentData} layout="vertical" margin={{ left: 8, right: 16 }}>
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                <Bar dataKey="count" name="Leads" radius={[0, 6, 6, 0]} barSize={16}>
                  {perAgentData.map((d, i) => (
                    <Cell key={i} fill={d.name === 'Sin asignar' ? '#d4a62a' : '#12233b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-5">
            <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-gold" /> Leads por estado
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={perStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {perStatusData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, correo o zona…"
          className="flex-1"
        />
        <Select value={agentFilter} onValueChange={setAgentFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los asesores</SelectItem>
            <SelectItem value="none">Sin asignar</SelectItem>
            {agents.filter((a) => a.active).map((a) => (
              <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {LEAD_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="h-5 w-56 bg-muted rounded animate-pulse" />
              <div className="h-3 w-72 bg-muted rounded animate-pulse mt-2" />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center border-dashed">
          <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Users className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-display font-bold text-lg">No hay leads</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Los formularios de la página web (Búsqueda personalizada) aparecerán aquí en tiempo real.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((l) => (
            <LeadRow key={l.id} lead={l} agents={agents} onUpdated={load} />
          ))}
        </div>
      )}
    </div>
  )
}