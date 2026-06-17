'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Mail,
  MessageCircle,
  Instagram,
  ChevronDown,
  Home,
  TrendingUp,
  BadgeCheck,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// ---------- Types ----------
interface AgentProperty {
  id: string
  title: string
  price: number
  type: string
  city: string
  images: string
  status: string
}

interface Agent {
  id: string
  name: string
  title: string
  bio: string
  photoUrl: string
  phone: string
  email: string
  whatsapp: string
  instagram?: string | null
  specialties: string
  rating: number
  salesCount: number
  order: number
  properties: AgentProperty[]
  _count: { properties: number }
}

// ---------- Helpers ----------
function formatPrice(price: number) {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`
  if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`
  return `$${price}`
}

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

function RatingStars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75
  const total = hasHalf ? full : Math.round(rating)
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= total
          const half = hasHalf && i === full + 1
          return (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                filled || half ? 'text-gold' : 'text-muted-foreground/40'
              }`}
              fill={filled ? 'currentColor' : half ? 'currentColor' : 'none'}
              strokeWidth={1.5}
            />
          )
        })}
      </div>
      <span className="text-xs font-semibold text-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

// ---------- Agent Card ----------
function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const [expanded, setExpanded] = React.useState(false)
  const specialties = React.useMemo(
    () => parseJsonArray(agent.specialties).slice(0, 4),
    [agent.specialties]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="h-full"
    >
      <Card className="group overflow-hidden border-border/50 hover:shadow-luxe transition-all duration-300 h-full flex flex-col">
        {/* Photo */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <Image
            src={agent.photoUrl}
            alt={`Retrato de ${agent.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
          {/* Gold ring on hover */}
          <div className="absolute inset-0 rounded-t-xl ring-2 ring-gold/0 group-hover:ring-gold/60 transition-all duration-300 pointer-events-none" />
          {/* Rating chip */}
          <div className="absolute top-3 left-3 glass px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <Star className="h-3 w-3 text-gold" fill="currentColor" />
            <span className="text-xs font-bold text-foreground">
              {agent.rating.toFixed(1)}
            </span>
          </div>
          {/* Sales badge */}
          <div className="absolute bottom-3 right-3 bg-gradient-emerald text-primary-foreground px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-luxe">
            <TrendingUp className="h-3 w-3" />
            <span className="text-xs font-semibold">{agent.salesCount} ventas</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-3 flex-1">
          <div>
            <h3 className="font-display text-xl font-bold leading-tight">
              {agent.name}
            </h3>
            <p className="text-sm text-gold font-medium mt-0.5">{agent.title}</p>
          </div>

          <RatingStars rating={agent.rating} />

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {agent.bio}
          </p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1.5 min-h-[1.5rem]">
            {specialties.map((s, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="text-[11px] font-medium bg-primary/8 text-primary border-primary/15"
              >
                {s}
              </Badge>
            ))}
          </div>

          {/* Contact buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <a
              href={`https://wa.me/${agent.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Enviar WhatsApp a ${agent.name}`}
            >
              <Button
                size="sm"
                variant="outline"
                className="w-full h-9 border-emerald-500/40 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 dark:text-emerald-400"
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </Button>
            </a>
            <a
              href={`mailto:${agent.email}`}
              aria-label={`Enviar correo a ${agent.name}`}
            >
              <Button
                size="sm"
                variant="outline"
                className="w-full h-9 hover:bg-primary hover:text-primary-foreground hover:border-primary"
              >
                <Mail className="h-3.5 w-3.5" />
              </Button>
            </a>
            {agent.instagram ? (
              <a
                href={`https://instagram.com/${agent.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver Instagram de ${agent.name}`}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-9 hover:bg-[#d6249f] hover:text-white hover:border-[#d6249f]"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </Button>
              </a>
            ) : (
              <Button size="sm" variant="outline" className="w-full h-9 opacity-40" disabled>
                <Instagram className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {/* Expand properties */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((v) => !v)}
            className="w-full justify-between mt-1 text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center gap-2">
              <Home className="h-4 w-4 text-gold" />
              Ver propiedades
              <Badge variant="secondary" className="text-[10px]">
                {agent._count?.properties ?? agent.properties.length}
              </Badge>
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          </Button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="space-y-2 pt-1">
                  {agent.properties.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic px-1 py-2">
                      Este asesor no tiene propiedades publicadas por ahora.
                    </p>
                  ) : (
                    agent.properties.slice(0, 3).map((p) => {
                      const imgs = parseJsonArray(p.images)
                      return (
                        <a
                          key={p.id}
                          href="#"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group/p"
                        >
                          <div className="relative h-14 w-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={imgs[0] || ''}
                              alt={p.title}
                              fill
                              sizes="56px"
                              className="object-cover group-hover/p:scale-110 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">
                              {p.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gold font-semibold">
                                {formatPrice(p.price)}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {p.type} · {p.city}
                              </span>
                            </div>
                          </div>
                        </a>
                      )
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
}

// ---------- Skeleton ----------
function AgentCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50 h-full flex flex-col">
      <div className="relative aspect-[4/5]">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-3.5 w-3.5 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
    </Card>
  )
}

// ---------- Main View ----------
export function AgentsView() {
  const [agents, setAgents] = React.useState<Agent[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    fetch('/api/agents')
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return
        if (d.success) setAgents(d.data)
        else setError('No se pudieron cargar los agentes')
      })
      .catch(() => {
        if (mounted) setError('No se pudieron cargar los agentes')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="relative pt-28 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-[80%] bg-gradient-to-b from-gold/8 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">
              Directorio de Agentes
            </span>
            <span className="h-px w-8 bg-gold" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            Equipo de <span className="text-gradient-gold">asesores expertos</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-4 text-base lg:text-lg leading-relaxed"
          >
            Profesionales certificados con profundo conocimiento del mercado
            inmobiliario dominicano. Conecta directamente con el asesor ideal para tu proyecto.
          </motion.p>
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <AgentCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && agents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {agents.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} index={i} />
            ))}
          </div>
        )}

        {/* Bottom CTA strip */}
        {!loading && agents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-14 lg:mt-20"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-emerald p-6 sm:p-8 lg:p-10 shadow-luxe">
              <div className="absolute inset-0 grid-pattern opacity-15" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 mb-2 text-gold">
                    <BadgeCheck className="h-4 w-4" />
                    <span className="text-xs font-semibold tracking-wide uppercase">
                      Asesoría sin costo
                    </span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">
                    ¿No sabes qué asesor elegir?
                  </h3>
                  <p className="text-primary-foreground/80 mt-2 text-sm sm:text-base">
                    Cuéntanos tu proyecto y te conectaremos con el especialista ideal de
                    nuestro equipo.
                  </p>
                </div>
                <a
                  href="https://wa.me/18095550101"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold h-12 px-7"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Hablar con un asesor
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
