'use client'

import * as React from 'react'
import Image from 'next/image'
import { Instagram, Facebook, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'
import { useAppStore, type ViewKey } from '@/lib/store'
import { Button } from '@/components/ui/button'

// TikTok icon (not in lucide)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
    </svg>
  )
}

export function Footer() {
  const { setView } = useAppStore()

  const navTo = (v: ViewKey) => setView(v)

  // Load contact info from settings
  const [contact, setContact] = React.useState({
    phone: '829-696-7140',
    email: 'info@impulsarealestate.com',
    address: 'Bella Terra Mall, 3er nivel, Av. Juan Pablo Duarte 4, Santiago de los Caballeros 51000',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    facebook: 'https://facebook.com',
  })
  React.useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then((d) => {
      if (d.map) {
        setContact((prev) => ({
          phone: d.map.phone_general?.value || prev.phone,
          email: d.map.email_general?.value || prev.email,
          address: d.map.address?.value || prev.address,
          instagram: d.map.instagram?.value || prev.instagram,
          tiktok: d.map.tiktok?.value || prev.tiktok,
          facebook: d.map.facebook?.value || prev.facebook,
        }))
      }
    }).catch(() => {})
  }, [])

  return (
    <footer className="mt-auto bg-gradient-to-b from-background to-muted/30 border-t border-border/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-gold/40">
                <Image src="/images/logo-impulsa.png" alt="IMPULSA Real Estate" fill className="object-cover" sizes="48px" />
              </div>
              <div>
                <p className="font-display text-xl font-bold">IMPULSA</p>
                <p className="text-[11px] tracking-[0.25em] text-gold uppercase font-semibold">Real Estate</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              La plataforma inmobiliaria corporativa líder en República Dominicana. Invertir en bienes raíces nunca fue tan transparente.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-10 w-10 rounded-full bg-muted hover:bg-gradient-gold hover:text-gold-foreground flex items-center justify-center transition-all"
              >
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a
                href={contact.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="h-10 w-10 rounded-full bg-muted hover:bg-gradient-gold hover:text-gold-foreground flex items-center justify-center transition-all"
              >
                <TikTokIcon className="h-4.5 w-4.5" />
              </a>
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-10 w-10 rounded-full bg-muted hover:bg-gradient-gold hover:text-gold-foreground flex items-center justify-center transition-all"
              >
                <Facebook className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider mb-4 text-foreground">Navegación</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Inicio', v: 'home' as ViewKey },
                { label: 'Directorio de Agentes', v: 'agents' as ViewKey },
                { label: 'Galería Social', v: 'gallery' as ViewKey },
                { label: 'Dashboard Financiero', v: 'dashboard' as ViewKey },
                { label: 'Preguntas Frecuentes', v: 'faq' as ViewKey },
              ].map((item) => (
                <li key={item.v}>
                  <button
                    onClick={() => navTo(item.v)}
                    className="text-muted-foreground hover:text-gold transition-colors flex items-center gap-1 group"
                  >
                    {item.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider mb-4 text-foreground">Contacto</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                <span>{contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                <a href={`tel:+1${contact.phone.replace(/\D/g, '')}`} className="hover:text-gold transition-colors">{contact.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-gold transition-colors">{contact.email}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} IMPULSA Real Estate. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            <button onClick={() => navTo('faq')} className="text-muted-foreground hover:text-gold transition-colors">
              Preguntas Frecuentes
            </button>
            <span className="text-muted-foreground/40">|</span>
            <a href="#" className="text-muted-foreground hover:text-gold transition-colors">Política de Privacidad</a>
            <span className="text-muted-foreground/40">|</span>
            <a href="#" className="text-muted-foreground hover:text-gold transition-colors">Términos de Uso</a>
            <span className="text-muted-foreground/40">|</span>
            <a href="#" className="text-muted-foreground hover:text-gold transition-colors">Mapa del Sitio</a>
            <span className="text-muted-foreground/40">|</span>
            <button
              onClick={() => useAppStore.getState().setAgentLoginOpen(true)}
              className="text-muted-foreground/60 hover:text-gold transition-colors text-[11px]"
            >
              Acceso Agentes
            </button>
            <span className="text-muted-foreground/40">|</span>
            <button onClick={() => navTo('admin')} className="text-muted-foreground/60 hover:text-gold transition-colors text-[11px]">
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
