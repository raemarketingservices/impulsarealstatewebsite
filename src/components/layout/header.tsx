'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Menu, Moon, Sun, User, LayoutDashboard, Home as HomeIcon, Users, Images, HelpCircle, Phone } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAppStore, type ViewKey } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV_ITEMS: { key: ViewKey; label: string; icon: React.ElementType }[] = [
  { key: 'home', label: 'Inicio', icon: HomeIcon },
  { key: 'agents', label: 'Agentes', icon: Users },
  { key: 'gallery', label: 'Galería', icon: Images },
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'faq', label: 'FAQ', icon: HelpCircle },
]

export function Header() {
  const { view, setView, setAuthOpen, isAuthed, userName } = useAppStore()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Load phone from settings
  const [phone, setPhone] = React.useState('829-696-7140')
  React.useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then((d) => {
      if (d.map?.phone_general?.value) setPhone(d.map.phone_general.value)
    }).catch(() => {})
  }, [])

  const navTo = (v: ViewKey) => {
    setView(v)
    setMobileOpen(false)
  }

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass shadow-luxe border-b border-border/40 py-2.5'
          : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => navTo('home')}
            className="flex items-center gap-3 group"
            aria-label="IMPULSA Real Estate - Inicio"
          >
            <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-gold/40 group-hover:ring-gold/70 transition-all shadow-sm">
              <Image
                src="/images/logo-impulsa.png"
                alt="IMPULSA Real Estate"
                fill
                className="object-cover"
                sizes="48px"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col leading-none text-left">
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                IMPULSA
              </span>
              <span className="text-[10px] font-semibold tracking-[0.25em] text-gold uppercase">
                Real Estate
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => navTo(item.key)}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  view === item.key
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
                {view === item.key && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-primary/8 rounded-lg -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:+1${phone.replace(/\D/g, '')}`}
              className="hidden xl:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mr-1"
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => mounted && setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Cambiar tema"
              className="rounded-full"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {isAuthed ? (
              <Button
                onClick={() => navTo('dashboard')}
                size="sm"
                className="hidden sm:inline-flex bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold"
              >
                <User className="h-4 w-4 mr-1.5" />
                {userName?.split(' ')[0] || 'Mi Cuenta'}
              </Button>
            ) : (
              <Button
                onClick={() => setAuthOpen(true)}
                size="sm"
                className="hidden sm:inline-flex bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold"
              >
                Ingresar
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden rounded-full" aria-label="Abrir menú">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96 p-0">
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-gold/40">
                        <Image src="/images/logo-impulsa.png" alt="IMPULSA" fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <p className="font-display text-base font-bold">IMPULSA</p>
                        <p className="text-[10px] tracking-[0.2em] text-gold uppercase">Real Estate</p>
                      </div>
                    </div>
                  </div>
                  <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Navegación móvil">
                    {NAV_ITEMS.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => navTo(item.key)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                          view === item.key
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </button>
                    ))}
                  </nav>
                  <div className="p-4 border-t space-y-2">
                    <Button
                      onClick={() => { setAuthOpen(true); setMobileOpen(false) }}
                      className="w-full bg-gradient-gold text-gold-foreground hover:opacity-90"
                    >
                      {isAuthed ? `Hola, ${userName?.split(' ')[0] || 'Usuario'}` : 'Ingresar / Registrarse'}
                    </Button>
                    <a href={`tel:+1${phone.replace(/\D/g, '')}`} className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
                      <Phone className="h-4 w-4" /> {phone}
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
