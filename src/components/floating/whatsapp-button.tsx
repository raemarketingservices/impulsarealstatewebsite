'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.982 11.982 0 005.683 1.448h.005c6.582 0 11.94-5.335 11.944-11.893a11.821 11.821 0 00-3.488-8.453z"/>
    </svg>
  )
}

export function FloatingWhatsApp() {
  const [number, setNumber] = React.useState('9146733141')
  const [showHint, setShowHint] = React.useState(false)

  React.useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.map?.whatsapp_general?.value) setNumber(d.map.whatsapp_general.value.replace(/[^\d]/g, ''))
      })
      .catch(() => {})
  }, [])

  const url = `https://wa.me/${number}?text=${encodeURIComponent('Hola IMPULSA Real Estate, me gustaría más información sobre sus propiedades.')}`

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring' }}
      className="fixed bottom-6 right-6 z-40"
      onMouseEnter={() => setShowHint(true)}
      onMouseLeave={() => setShowHint(false)}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="relative flex items-center group"
      >
        {/* Pulse ring */}
        <span className="absolute right-0 top-0 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-[#25D366] animate-ping opacity-20" />
        {/* Button */}
        <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-[#25D366] hover:bg-[#1da851] shadow-lg flex items-center justify-center transition-colors group-hover:scale-105">
          <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
        </div>
        {/* Tooltip */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-card text-foreground text-sm font-medium px-3 py-2 rounded-lg shadow-luxe border border-border/60 pointer-events-none"
            >
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
                <span>¿Hablamos?</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Respuesta inmediata</p>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Notification badge */}
        <span className="absolute -top-0.5 -left-0.5 h-4 w-4 rounded-full bg-gold ring-2 ring-card flex items-center justify-center">
          <span className="text-[9px] font-bold text-gold-foreground">1</span>
        </span>
      </a>
    </motion.div>
  )
}
