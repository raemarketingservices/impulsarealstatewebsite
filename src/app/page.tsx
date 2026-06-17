'use client'

import * as React from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { LoginDialog } from '@/components/auth/login-dialog'
import { HomeView } from '@/components/home/home-view'
import { AgentsView } from '@/components/agents/agents-view'
import { GalleryView } from '@/components/social/gallery-view'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { FAQView } from '@/components/faq/faq-view'
import { useAppStore, type ViewKey } from '@/lib/store'
import { Toaster as SonnerToaster } from 'sonner'

const VALID_VIEWS: ViewKey[] = ['home', 'agents', 'gallery', 'dashboard', 'faq']

export default function Home() {
  const { view, setView } = useAppStore()

  // Optional deep-linking via ?v=faq query string (e.g. /?v=faq)
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const v = new URLSearchParams(window.location.search).get('v') as ViewKey | null
    if (v && VALID_VIEWS.includes(v)) setView(v)
  }, [setView])

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {view === 'home' && <HomeView />}
        {view === 'agents' && <AgentsView />}
        {view === 'gallery' && <GalleryView />}
        {view === 'dashboard' && <DashboardView />}
        {view === 'faq' && <FAQView />}
      </main>
      <Footer />

      {/* Auth dialog (reads its open state from the global store) */}
      <LoginDialog />

      {/* Sonner toast viewport */}
      <SonnerToaster position="top-center" richColors closeButton />
    </div>
  )
}
