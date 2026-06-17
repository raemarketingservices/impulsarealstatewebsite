'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, TrendingUp, Shield, Award } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { PropertySearchSection } from './property-search-section'

const HERO_IMG = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80'

const STATS = [
  { value: '500+', label: 'Propiedades vendidas', icon: TrendingUp },
  { value: '15 años', label: 'En el mercado', icon: Award },
  { value: '$250M+', label: 'En transacciones', icon: Shield },
]

export function Hero() {
  const { setView } = useAppStore()
  const [videoOpen, setVideoOpen] = React.useState(false)

  return (
    <>
      {/* Hero Banner — full width, centered text */}
      <section className="relative min-h-[78vh] lg:min-h-[82vh] flex items-center pt-28 pb-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={HERO_IMG}
            alt="Propiedad de lujo en República Dominicana"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Dark gradient overlay for strong text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-background" />
          {/* Radial vignette behind centered text */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.6)_0%,_transparent_70%)]" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-20 -z-10" />

        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 backdrop-blur-md mb-6"
          >
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-gold uppercase drop-shadow">
              #1 Inmobiliaria Premium en República Dominicana
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-2xl"
          >
            Invierte en
            <span className="block text-gradient-gold drop-shadow-lg">bienes raíces</span>
            con inteligencia.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed mt-6 drop-shadow-lg"
          >
            La plataforma corporativa que combina propiedades premium, asesoría financiera
            experta y herramientas inteligentes para impulsar tu patrimonio inmobiliario en el Caribe.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-8"
          >
            <Button
              onClick={() => setView('dashboard')}
              size="lg"
              className="bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold h-12 px-7"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Explorar Dashboard
            </Button>
            <Button
              onClick={() => setVideoOpen(true)}
              variant="outline"
              size="lg"
              className="h-12 px-7 glass border-border/50"
            >
              <Play className="h-5 w-5 mr-2 text-gold" />
              Ver video corporativo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="grid grid-cols-3 gap-4 pt-10 max-w-xl mx-auto"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <stat.icon className="h-4 w-4 text-gold drop-shadow" />
                  <span className="font-display text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{stat.value}</span>
                </div>
                <p className="text-xs text-white/70 leading-tight drop-shadow">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Search section — overlaps hero bottom, full width */}
      <PropertySearchSection />

      {/* Video Modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setVideoOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-emerald flex items-center justify-center">
              <div className="text-center text-primary-foreground p-8">
                <Play className="h-16 w-16 mx-auto mb-4 text-gold" fill="currentColor" />
                <h3 className="font-display text-2xl font-bold mb-2">IMPULSA Real Estate</h3>
                <p className="text-primary-foreground/80">Video corporativo — Próximamente</p>
              </div>
            </div>
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="Cerrar video"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}
    </>
  )
}
