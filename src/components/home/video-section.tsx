'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Quote, TrendingUp, Globe, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

const VIDEO_POSTER = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80'

const VALUES = [
  { icon: TrendingUp, title: 'Inversión Inteligente', desc: 'Análisis de mercado y proyecciones financieras para decisiones informadas.' },
  { icon: Globe, title: 'Alcance Internacional', desc: 'Conectamos inversionistas globales con oportunidades premium de República Dominicana.' },
  { icon: Users, title: 'Asesoría Experta', desc: 'Un equipo de más de 20 especialistas en bienes raíces y finanzas.' },
]

export function VideoSection() {
  const { setView } = useAppStore()
  const [playing, setPlaying] = React.useState(false)

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-video rounded-3xl overflow-hidden shadow-luxe group"
          >
            <Image
              src={VIDEO_POSTER}
              alt="Video promocional IMPULSA Real Estate"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Play button */}
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Reproducir video"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gold/30 animate-ping" />
                <div className="relative h-20 w-20 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 text-gold-foreground ml-1" fill="currentColor" />
                </div>
              </div>
            </button>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-white/90 text-sm font-medium mb-1">IMPULSA Real Estate</p>
              <h3 className="font-display text-2xl font-bold text-white">Conoce nuestra visión corporativa</h3>
            </div>
          </motion.div>

          {/* Text content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-2"
            >
              <span className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Quiénes Somos</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
            >
              Impulsamos el futuro de los <span className="text-gradient-gold">bienes raíces</span> en toda República Dominicana
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative pl-6 border-l-2 border-gold/50"
            >
              <Quote className="absolute -left-3 -top-2 h-6 w-6 text-gold/40" fill="currentColor" />
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed italic">
                "Nuestra misión es democratizar la inversión inmobiliaria de alto nivel, combinando
                tecnología, transparencia y experiencia humana para que cada cliente alcance
                sus metas patrimoniales."
              </p>
              <p className="mt-3 text-sm font-semibold text-foreground">
                — Equipo Directivo, IMPULSA Real Estate
              </p>
            </motion.div>

            {/* Values grid */}
            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="space-y-2"
                >
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <v.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-sm">{v.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>

            <Button
              onClick={() => setView('agents')}
              className="bg-gradient-emerald text-primary-foreground hover:opacity-90 shadow-luxe"
            >
              Conoce a nuestro equipo
            </Button>
          </div>
        </div>
      </div>

      {/* Video modal */}
      {playing && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPlaying(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-emerald flex items-center justify-center">
              <div className="text-center text-primary-foreground p-8">
                <Play className="h-20 w-20 mx-auto mb-4 text-gold" fill="currentColor" />
                <h3 className="font-display text-3xl font-bold mb-2">IMPULSA Real Estate</h3>
                <p className="text-primary-foreground/80">Video corporativo en alta definición</p>
              </div>
            </div>
            <button
              onClick={() => setPlaying(false)}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="Cerrar video"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}
    </section>
  )
}
