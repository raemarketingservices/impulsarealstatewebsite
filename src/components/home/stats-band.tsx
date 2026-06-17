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

  return (
    <>
      {/* Marquee logos / trust bar */}
      <section className="border-y border-border/40 bg-muted/20 py-6 overflow-hidden">
        <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex items-center gap-16 shrink-0">
              {['Banco Popular', 'BHD León', 'Scotiabank', 'APAP', 'Banreservas', 'Asociación La Nacional', 'Cámara RD Bienes Raíces'].map((bank) => (
                <span key={bank} className="font-display text-lg font-semibold text-muted-foreground/60 tracking-wide">
                  {bank}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

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

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 relative rounded-3xl overflow-hidden"
          >
            <div className="bg-gradient-emerald p-8 lg:p-14 text-center text-primary-foreground relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10" />
              <div className="relative space-y-4 max-w-2xl mx-auto">
                <h3 className="font-display text-3xl lg:text-4xl font-bold">
                  ¿Listo para impulsar tu patrimonio?
                </h3>
                <p className="text-primary-foreground/80 text-base lg:text-lg">
                  Crea tu cuenta gratuita y accede a herramientas financieras exclusivas,
                  proyecciones de inversión y seguimiento de metas.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button
                    onClick={() => setView('dashboard')}
                    size="lg"
                    className="bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold"
                  >
                    Crear cuenta gratis
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    onClick={() => setView('agents')}
                    size="lg"
                    variant="outline"
                    className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    Hablar con un asesor
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
