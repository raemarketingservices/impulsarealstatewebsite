'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Building2, DollarSign, Award, Globe, ArrowRight } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'

const STATS = [
  { icon: Building2, value: '500+', label: 'Propiedades gestionadas' },
  { icon: DollarSign, value: '$250M+', label: 'En transacciones' },
  { icon: Users, value: '20+', label: 'Asesores expertos' },
  { icon: Award, value: '15 años', label: 'De experiencia' },
  { icon: Globe, value: '12', label: 'Países de inversores' },
  { icon: TrendingUp, value: '18%', label: 'ROI promedio anual' },
]

export function StatsBand() {
  const { setView } = useAppStore()

  // Load brands from settings (editable in admin)
  const [brandConfig, setBrandConfig] = React.useState({
    enabled: true,
    title: 'Inmobiliarias que confían en nosotros',
    brands: ['RE/MAX Dominicana', 'Plusval', 'TuCasaRD', 'Century 21', 'Mr. Home', 'Apartamentos RD', 'Loft Home RD', 'Blue Caribbean Properties', 'Engel & Völkers'],
  })

  React.useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.map) {
          setBrandConfig((prev) => ({
            enabled: d.map.trust_brands_enabled?.value !== 'false',
            title: d.map.trust_brands_title?.value || prev.title,
            brands: d.map.trust_brands_list?.value ? (() => { try { return JSON.parse(d.map.trust_brands_list.value) } catch { return prev.brands } })() : prev.brands,
          }))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <>
      {/* Marquee logos / trust bar (hideable via settings) */}
      {brandConfig.enabled && (
        <section className="border-y border-border/40 bg-muted/20 py-6 overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-3">
            <p className="text-center text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-gold uppercase">
              {brandConfig.title}
            </p>
          </div>
          <div className="flex items-center gap-12 sm:gap-16 animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex items-center gap-12 sm:gap-16 shrink-0">
                {brandConfig.brands.map((brand, i) => (
                  <span key={`${brand}-${i}`} className="font-display text-lg sm:text-xl font-semibold text-muted-foreground/60 tracking-wide">
                    {brand}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stats grid */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-3"
            >
              <span className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Por qué IMPULSA</span>
              <span className="h-px w-8 bg-gold" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            >
              Números que <span className="text-gradient-gold">impulsan</span> confianza
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="relative group"
              >
                <div className="rounded-2xl border border-border/50 bg-card p-5 lg:p-6 text-center hover:shadow-luxe hover:border-gold/30 transition-all">
                  <div className="h-12 w-12 mx-auto rounded-xl bg-gradient-emerald flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <stat.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <p className="font-display text-2xl lg:text-3xl font-bold text-gradient-gold mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
