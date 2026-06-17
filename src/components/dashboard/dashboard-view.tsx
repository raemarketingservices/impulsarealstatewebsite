'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Calculator,
  CircleDollarSign,
  Goal as GoalIcon,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  Lock,
} from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart'
import { useAppStore } from '@/lib/store'

/* ------------------------------------------------------------------ */
/*  Types & helpers                                                    */
/* ------------------------------------------------------------------ */

interface MyProperty {
  id: string
  title: string
  location: string
  city: string
  price: number
  status: 'FOR_SALE' | 'RESERVED' | 'SOLD' | 'RENTED'
  images: string
  progress?: number
}

interface GoalItem {
  id: string
  title: string
  type: 'SAVINGS' | 'INVESTMENT' | 'PURCHASE'
  targetAmount: number
  currentAmount: number
  targetDate: string
}

interface DashboardData {
  stats: {
    totalProperties: number
    totalAgents: number
    soldProperties: number
    featuredProperties: number
    portfolioValue: number
  }
  goals: Array<{
    id: string
    title: string
    type: string
    targetAmount: number
    currentAmount: number
    targetDate: string
    status: string
  }>
  myProperties: Array<{
    id: string
    title: string
    location: string
    city: string
    price: number
    status: string
    images: string
  }>
}

const STATUS_META: Record<
  MyProperty['status'],
  { label: string; className: string }
> = {
  FOR_SALE: { label: 'EN VENTA', className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
  RESERVED: { label: 'RESERVADA', className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' },
  SOLD: { label: 'VENDIDA', className: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' },
  RENTED: { label: 'EN ALQUILER', className: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30' },
}

const GOAL_TYPE_META: Record<GoalItem['type'], { label: string; className: string }> = {
  SAVINGS: { label: 'AHORRO', className: 'bg-primary/15 text-primary border-primary/30' },
  INVESTMENT: { label: 'INVERSIÓN', className: 'bg-gold/15 text-gold border-gold/30' },
  PURCHASE: { label: 'COMPRA', className: 'bg-chart-4/15 text-chart-4 border-chart-4/30' },
}

function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
    return `$${value.toFixed(0)}`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
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

function mapStatus(status: string): MyProperty['status'] {
  if (status === 'FOR_SALE' || status === 'RESERVED' || status === 'SOLD' || status === 'RENTED') {
    return status
  }
  return 'FOR_SALE'
}

/* ------------------------------------------------------------------ */
/*  Demo fallback data                                                 */
/* ------------------------------------------------------------------ */

const DEMO_PROPERTIES: MyProperty[] = [
  {
    id: 'p1',
    title: 'Villa Cap Cana Oceanview',
    location: 'Punta Cana',
    city: 'La Altagracia',
    price: 1_250_000,
    status: 'FOR_SALE',
    images: '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80"]',
    progress: 35,
  },
  {
    id: 'p2',
    title: 'Apartamento Piantini Tower',
    location: 'Piantini',
    city: 'Santo Domingo',
    price: 385_000,
    status: 'RESERVED',
    images: '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80"]',
    progress: 72,
  },
  {
    id: 'p3',
    title: 'Penthouse Malecón Center',
    location: 'Malecón',
    city: 'Santo Domingo',
    price: 675_000,
    status: 'SOLD',
    images: '["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80"]',
    progress: 100,
  },
  {
    id: 'p4',
    title: 'Casa de Playa Las Terrenas',
    location: 'Las Terrenas',
    city: 'Samaná',
    price: 540_000,
    status: 'RENTED',
    images: '["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80"]',
    progress: 60,
  },
]

const DEMO_GOALS: GoalItem[] = [
  {
    id: 'g1',
    title: 'Enganche para apartamento en Piantini',
    type: 'SAVINGS',
    targetAmount: 140_000,
    currentAmount: 87_500,
    targetDate: '2025-12-31',
  },
  {
    id: 'g2',
    title: 'Fondo de inversión inmobiliaria',
    type: 'INVESTMENT',
    targetAmount: 500_000,
    currentAmount: 215_000,
    targetDate: '2027-06-30',
  },
  {
    id: 'g3',
    title: 'Compra de villa en Cap Cana',
    type: 'PURCHASE',
    targetAmount: 1_200_000,
    currentAmount: 340_000,
    targetDate: '2028-03-15',
  },
]

/* ------------------------------------------------------------------ */
/*  KPI stat card                                                      */
/* ------------------------------------------------------------------ */

interface KpiCardProps {
  icon: React.ElementType
  label: string
  value: string
  trend: number
  trendLabel: string
  accent?: 'emerald' | 'gold'
  delay?: number
}

function KpiCard({ icon: Icon, label, value, trend, trendLabel, accent = 'emerald', delay = 0 }: KpiCardProps) {
  const isUp = trend >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="relative overflow-hidden border-border/50 hover:shadow-luxe transition-all duration-300 group">
        {/* Decorative gradient blob */}
        <div
          className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl opacity-30 transition-opacity group-hover:opacity-50 ${
            accent === 'gold' ? 'bg-gold' : 'bg-primary'
          }`}
        />
        <CardContent className="relative p-5">
          <div className="flex items-start justify-between">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                accent === 'gold'
                  ? 'bg-gradient-gold text-gold-foreground shadow-gold'
                  : 'bg-gradient-emerald text-primary-foreground shadow-luxe'
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                isUp
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}
            >
              {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(trend)}%
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-1 font-display text-2xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{trendLabel}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Module 1: Investment Projection Chart                              */
/* ------------------------------------------------------------------ */

const PROJECTION_CONFIG: ChartConfig = {
  initial: { label: 'Inversión inicial', color: 'var(--chart-1)' },
  projected: { label: 'Valor proyectado', color: 'var(--gold)' },
}

function ProjectionChart() {
  const data = React.useMemo(() => {
    const INITIAL = 150_000
    const RATE = 0.08
    return Array.from({ length: 10 }, (_, i) => {
      const year = i + 1
      return {
        year: `Año ${year}`,
        initial: INITIAL,
        projected: Math.round(INITIAL * Math.pow(1 + RATE, year)),
      }
    })
  }, [])

  const finalValue = data[data.length - 1].projected
  const growthPct = Math.round(((finalValue - 150_000) / 150_000) * 100)

  return (
    <Card className="border-border/50 shadow-luxe overflow-hidden">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Proyección financiera</span>
            </div>
            <CardTitle className="mt-2 font-display text-2xl font-bold">
              Proyección de Inversión a <span className="text-gradient-gold">10 Años</span>
            </CardTitle>
            <CardDescription>
              Crecimiento compuesto estimado al 8% anual sobre una inversión inicial de $150,000 USD.
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Valor final estimado</p>
            <p className="font-display text-2xl font-bold text-gradient-gold">{formatCurrency(finalValue)}</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />+{growthPct}% retorno total
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={PROJECTION_CONFIG} className="aspect-[16/9] w-full">
          <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillInitial" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-initial)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-initial)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-projected)" stopOpacity={0.45} />
                <stop offset="95%" stopColor="var(--color-projected)" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              tickLine={false}
              axisLine={false}
              width={56}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="text-muted-foreground">
                        {name === 'initial' ? 'Inversión inicial' : 'Valor proyectado'}
                      </span>
                      <span className="font-mono font-semibold tabular-nums">
                        {formatCurrency(Number(value))}
                      </span>
                    </div>
                  )}
                  labelFormatter={(label) => (
                    <span className="font-display text-sm font-semibold">{label}</span>
                  )}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="initial"
              stroke="var(--color-initial)"
              strokeWidth={2}
              fill="url(#fillInitial)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="projected"
              stroke="var(--color-projected)"
              strokeWidth={2.5}
              fill="url(#fillProjected)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Module 2: Mortgage Calculator                                      */
/* ------------------------------------------------------------------ */

function MortgageCalculator() {
  const [price, setPrice] = React.useState(450_000)
  const [downPct, setDownPct] = React.useState(20)
  const [rate, setRate] = React.useState(7.5)
  const [term, setTerm] = React.useState(30)

  const calc = React.useMemo(() => {
    const down = (price * downPct) / 100
    const loan = price - down
    const monthlyRate = rate / 100 / 12
    const months = term * 12
    const monthly =
      monthlyRate === 0
        ? loan / months
        : (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1)
    const total = monthly * months
    const totalInterest = total - loan
    return { down, loan, monthly, total, totalInterest }
  }, [price, downPct, rate, term])

  return (
    <Card className="border-border/50 shadow-luxe overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          <Calculator className="h-3.5 w-3.5" />
          <span>Simulador financiero</span>
        </div>
        <CardTitle className="mt-2 font-display text-2xl font-bold">
          Calculadora de <span className="text-gradient-gold">Hipoteca</span>
        </CardTitle>
        <CardDescription>
          Ajusta los parámetros para estimar tu pago mensual y el costo total del financiamiento.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2">
        {/* Result card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-emerald p-6 text-primary-foreground">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/80">
              Pago mensual estimado
            </p>
            <p className="mt-2 font-display text-4xl font-bold text-gradient-gold sm:text-5xl">
              {formatCurrency(calc.monthly)}
            </p>

            <Separator className="my-5 bg-primary-foreground/15" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-primary-foreground/70">Monto del préstamo</p>
                <p className="font-display text-lg font-semibold">{formatCurrency(calc.loan)}</p>
              </div>
              <div>
                <p className="text-primary-foreground/70">Enganche ({downPct}%)</p>
                <p className="font-display text-lg font-semibold">{formatCurrency(calc.down)}</p>
              </div>
              <div>
                <p className="text-primary-foreground/70">Intereses totales</p>
                <p className="font-display text-lg font-semibold text-gold-foreground">{formatCurrency(calc.totalInterest)}</p>
              </div>
              <div>
                <p className="text-primary-foreground/70">Pago total</p>
                <p className="font-display text-lg font-semibold">{formatCurrency(calc.total)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-5">
          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Precio de la propiedad</Label>
              <span className="font-mono text-sm font-semibold text-gold">
                {formatCurrency(price)}
              </span>
            </div>
            <Slider
              value={[price]}
              onValueChange={(v) => setPrice(v[0])}
              min={50_000}
              max={3_000_000}
              step={5_000}
            />
            <Input
              type="number"
              value={price}
              min={50_000}
              max={3_000_000}
              onChange={(e) => setPrice(Math.max(50_000, Math.min(3_000_000, Number(e.target.value) || 0)))}
              className="h-8 text-xs"
            />
          </div>

          {/* Down payment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Enganche</Label>
              <span className="font-mono text-sm font-semibold text-gold">{downPct}%</span>
            </div>
            <Slider
              value={[downPct]}
              onValueChange={(v) => setDownPct(v[0])}
              min={10}
              max={50}
              step={1}
            />
            <p className="text-xs text-muted-foreground">{formatCurrency(calc.down)} USD</p>
          </div>

          {/* Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Tasa de interés anual</Label>
              <span className="font-mono text-sm font-semibold text-gold">{rate.toFixed(2)}%</span>
            </div>
            <Slider
              value={[rate]}
              onValueChange={(v) => setRate(v[0])}
              min={4}
              max={12}
              step={0.05}
            />
          </div>

          {/* Term */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Plazo del préstamo</Label>
            <Select value={String(term)} onValueChange={(v) => setTerm(Number(v))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un plazo" />
              </SelectTrigger>
              <SelectContent>
                {[15, 20, 25, 30].map((t) => (
                  <SelectItem key={t} value={String(t)}>
                    {t} años
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Module 3: Property Status Tracker                                  */
/* ------------------------------------------------------------------ */

function PropertyStatusList({ properties }: { properties: MyProperty[] }) {
  return (
    <Card className="border-border/50 shadow-luxe h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <Building2 className="h-3.5 w-3.5" />
              <span>Mi portafolio</span>
            </div>
            <CardTitle className="mt-2 font-display text-2xl font-bold">
              Estado de <span className="text-gradient-gold">Propiedades</span>
            </CardTitle>
          </div>
          <Badge variant="outline" className="font-mono">
            {properties.length} activas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div className="max-h-80 space-y-3 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5">
          {properties.map((p, idx) => {
            const meta = STATUS_META[p.status]
            const imgs: string[] = (() => {
              try { return JSON.parse(p.images) } catch { return [] }
            })()
            const progress = p.progress ?? (p.status === 'SOLD' ? 100 : 0)

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx, duration: 0.4 }}
                className="group flex gap-3 rounded-xl border border-border/40 bg-card p-3 transition-colors hover:border-gold/40 hover:bg-accent/30"
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={imgs[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&q=80'}
                    alt={p.title}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-display text-sm font-semibold leading-tight">{p.title}</p>
                    <Badge variant="outline" className={`shrink-0 text-[10px] ${meta.className}`}>
                      {meta.label}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {p.location}, {p.city}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
                    <span className="font-display text-sm font-bold text-gradient-gold">
                      {formatCurrency(p.price)}
                    </span>
                    {p.status !== 'SOLD' && (
                      <span className="text-[10px] text-muted-foreground">{progress}% completado</span>
                    )}
                  </div>
                  <Progress
                    value={progress}
                    className="mt-1.5 h-1.5 [&>div]:bg-gradient-gold"
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Module 4: Goals Tracker                                            */
/* ------------------------------------------------------------------ */

function GoalsTracker({ goals }: { goals: GoalItem[] }) {
  const handleAdd = () => {
    toast.success('Formulario de nueva meta', {
      description: 'Pronto podrás crear metas personalizadas desde tu panel.',
    })
  }

  return (
    <Card className="border-border/50 shadow-luxe h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <GoalIcon className="h-3.5 w-3.5" />
              <span>Objetivos financieros</span>
            </div>
            <CardTitle className="mt-2 font-display text-2xl font-bold">
              Metas <span className="text-gradient-gold">Activas</span>
            </CardTitle>
          </div>
          <Button size="sm" onClick={handleAdd} className="gap-1 bg-gradient-emerald">
            <Plus className="h-4 w-4" />
            Agregar meta
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {goals.map((g, idx) => {
          const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))
          const meta = GOAL_TYPE_META[g.type]
          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx, duration: 0.4 }}
              className="rounded-xl border border-border/40 bg-card p-4 transition-colors hover:border-gold/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-display text-sm font-semibold leading-tight">{g.title}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] ${meta.className}`}>
                      {meta.label}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      {formatDateES(g.targetDate)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-gradient-gold">{pct}%</p>
                </div>
              </div>

              <div className="mt-3">
                <Progress value={pct} className="h-2 [&>div]:bg-gradient-gold" />
                <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono font-semibold text-foreground">
                    {formatCurrency(g.currentAmount)}
                  </span>
                  <span>/ {formatCurrency(g.targetAmount, true)}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Module 5: Portfolio Distribution (Pie)                             */
/* ------------------------------------------------------------------ */

const PORTFOLIO_DATA = [
  { name: 'Villas', value: 38, type: 'VILLAS' },
  { name: 'Apartamentos', value: 27, type: 'APARTMENTS' },
  { name: 'Penthouses', value: 18, type: 'PENTHOUSES' },
  { name: 'Casas', value: 12, type: 'HOUSES' },
  { name: 'Terrenos', value: 5, type: 'LAND' },
]

const PIE_CONFIG: ChartConfig = {
  villas: { label: 'Villas', color: 'var(--chart-1)' },
  apartments: { label: 'Apartamentos', color: 'var(--chart-2)' },
  penthouses: { label: 'Penthouses', color: 'var(--chart-3)' },
  houses: { label: 'Casas', color: 'var(--chart-4)' },
  land: { label: 'Terrenos', color: 'var(--chart-5)' },
}

const PIE_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

function PortfolioDistribution() {
  return (
    <Card className="border-border/50 shadow-luxe h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          <Target className="h-3.5 w-3.5" />
          <span>Distribución de activos</span>
        </div>
        <CardTitle className="mt-2 font-display text-2xl font-bold">
          Distribución del <span className="text-gradient-gold">Portafolio</span>
        </CardTitle>
        <CardDescription>Composición de tu cartera por tipo de propiedad.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={PIE_CONFIG} className="aspect-square w-full max-w-[340px] mx-auto">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, _name, item) => (
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="text-muted-foreground">{item.payload?.name}</span>
                      <span className="font-mono font-semibold tabular-nums">{value}%</span>
                    </div>
                  )}
                  hideLabel
                  hideIndicator
                />
              }
            />
            <Pie
              data={PORTFOLIO_DATA}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              strokeWidth={0}
            >
              {PORTFOLIO_DATA.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>

        {/* Legend list with values */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PORTFOLIO_DATA.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-1.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: PIE_COLORS[i] }}
              />
              <span className="truncate text-xs text-muted-foreground">{d.name}</span>
              <span className="ml-auto font-mono text-xs font-semibold">{d.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/*  Auth prompt banner (shown when not authed)                         */
/* ------------------------------------------------------------------ */

function AuthPromptBanner({ userName }: { userName: string | null }) {
  const setAuthOpen = useAppStore((s) => s.setAuthOpen)
  if (userName) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex flex-col gap-3 overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/10 via-primary/5 to-transparent p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-gold-foreground shadow-gold">
          <Lock className="h-4 w-4" />
        </div>
        <div>
          <p className="font-display text-sm font-semibold">
            Estás viendo datos de demostración
          </p>
          <p className="text-xs text-muted-foreground">
            Inicia sesión para sincronizar tu portafolio real, metas personalizadas e historial financiero.
          </p>
        </div>
      </div>
      <Button onClick={() => setAuthOpen(true)} className="shrink-0 bg-gradient-gold text-gold-foreground hover:opacity-90">
        Iniciar sesión
      </Button>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main DashboardView                                                 */
/* ------------------------------------------------------------------ */

export function DashboardView() {
  const userName = useAppStore((s) => s.userName)
  const isAuthed = useAppStore((s) => s.isAuthed)

  const [properties, setProperties] = React.useState<MyProperty[]>(DEMO_PROPERTIES)
  const [goals, setGoals] = React.useState<GoalItem[]>(DEMO_GOALS)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((d: { success: boolean; data?: DashboardData }) => {
        if (cancelled || !d.success || !d.data) return
        const mapped: MyProperty[] = (d.data.myProperties || []).slice(0, 4).map((p) => ({
          id: p.id,
          title: p.title,
          location: p.location,
          city: p.city,
          price: p.price,
          status: mapStatus(p.status),
          images: p.images,
          progress:
            mapStatus(p.status) === 'SOLD' ? 100 :
            mapStatus(p.status) === 'RESERVED' ? 72 :
            mapStatus(p.status) === 'RENTED' ? 60 : 35,
        }))
        if (mapped.length > 0) setProperties(mapped)

        const mappedGoals: GoalItem[] = (d.data.goals || []).map((g) => ({
          id: g.id,
          title: g.title,
          type:
            g.type === 'INVESTMENT' ? 'INVESTMENT' :
            g.type === 'PROPERTY_PURCHASE' ? 'PURCHASE' : 'SAVINGS',
          targetAmount: g.targetAmount,
          currentAmount: g.currentAmount,
          targetDate: g.targetDate,
        }))
        if (mappedGoals.length > 0) setGoals(mappedGoals)
      })
      .catch(() => {
        /* keep demo data on error */
      })
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [])

  const today = new Date().toLocaleDateString('es-DO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Aggregate KPI values from current data (or demo data)
  const portfolioValue = properties.reduce((s, p) => s + p.price, 0)
  const activeGoals = goals.length
  const avgRoi = 8.4 // demonstrative

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <CircleDollarSign className="h-3.5 w-3.5" />
            <span>Panel financiero</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Hola, <span className="text-gradient-gold">{userName || 'Inversionista'}</span>
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-gold capitalize" />
            <span className="capitalize">{today}</span>
            <span className="text-border">•</span>
            <span>
              {isAuthed
                ? 'Tu portafolio está al día.'
                : 'Estás explorando una vista de demostración del panel.'}
            </span>
          </p>
        </motion.div>

        {/* Auth prompt when not authed */}
        <AuthPromptBanner userName={userName} />

        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={Wallet}
            label="Patrimonio total"
            value={formatCurrency(portfolioValue + 215_000, true)}
            trend={12.5}
            trendLabel="vs. trimestre anterior"
            accent="emerald"
            delay={0.05}
          />
          <KpiCard
            icon={Building2}
            label="Valor de propiedades"
            value={formatCurrency(portfolioValue, true)}
            trend={8.2}
            trendLabel="4 propiedades activas"
            accent="gold"
            delay={0.12}
          />
          <KpiCard
            icon={Target}
            label="Metas activas"
            value={String(activeGoals)}
            trend={4.0}
            trendLabel="2 en progreso"
            accent="emerald"
            delay={0.19}
          />
          <KpiCard
            icon={TrendingUp}
            label="ROI promedio"
            value={`${avgRoi.toFixed(1)}%`}
            trend={2.1}
            trendLabel="últimos 12 meses"
            accent="gold"
            delay={0.26}
          />
        </div>

        {/* Module 1: Projection chart — full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6"
        >
          <ProjectionChart />
        </motion.div>

        {/* Module 2: Mortgage calculator — full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.36 }}
          className="mt-6"
        >
          <MortgageCalculator />
        </motion.div>

        {/* Modules 3, 4, 5 — 3 column grid on xl */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.42 }}
          >
            <PropertyStatusList properties={properties} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.48 }}
          >
            <GoalsTracker goals={goals} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.54 }}
            className="lg:col-span-2 xl:col-span-1"
          >
            <PortfolioDistribution />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
