'use client'

import * as React from 'react'
import { Mail, Lock, UserCircle, ArrowRight, Building2, Eye, EyeOff } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function AgentLoginDialog() {
  const {
    agentLoginOpen,
    setAgentLoginOpen,
    setAgentSession,
    setView,
  } = useAppStore()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPass, setShowPass] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  // Reset fields when dialog opens
  React.useEffect(() => {
    if (agentLoginOpen) {
      setEmail('')
      setPassword('')
      setShowPass(false)
    }
  }, [agentLoginOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      toast.error('Completa usuario y contraseña')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/agent-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email.trim(), password }),
      })
      const data = await res.json()

      if (!data.success) {
        toast.error('Acceso denegado', { description: data.error || 'Credenciales inválidas' })
        return
      }

      const { id, name, email: agentEmail } = data.data
      setAgentSession({ agentId: id, name, email: agentEmail })
      setAgentLoginOpen(false)
      toast.success(`¡Bienvenido, ${name}!`, {
        description: 'Has ingresado a tu panel de agente',
      })
      setTimeout(() => setView('agentDashboard'), 200)
    } catch {
      toast.error('Error de conexión', { description: 'Inténtalo nuevamente' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={agentLoginOpen} onOpenChange={setAgentLoginOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        <DialogTitle className="sr-only">Acceso de agentes</DialogTitle>
        <DialogDescription className="sr-only">
          Inicia sesión para acceder a tu panel personal de agente inmobiliario.
        </DialogDescription>

        {/* Header band */}
        <div className="bg-gradient-to-br from-primary via-primary to-primary/80 p-6 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-5 w-5 text-gold" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold">
                IMPULSA Real Estate
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold">Acceso de Agentes</h2>
            <p className="text-sm text-primary-foreground/80 mt-1">
              Ingresa a tu panel para gestionar tus propiedades y perfil profesional.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agent-email">Correo o nombre</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="agent-email"
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.nombre@impulsarealestate.com"
                required
                className="pl-10"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Puedes entrar con tu correo o tu nombre completo (ej: <span className="text-gold">Geovanny Reynoso</span>).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="agent-password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-gold text-gold-foreground hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 border-2 border-gold-foreground/40 border-t-gold-foreground rounded-full animate-spin" />
                Verificando…
              </>
            ) : (
              <>
                <UserCircle className="h-4 w-4 mr-2" />
                Ingresar al panel de agente
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>

          <div className="rounded-lg border border-gold/30 bg-gold/5 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-0.5">Credenciales de prueba</p>
            <p>
              <span className="text-gold font-medium">Email:</span>{' '}
              geovanny.reynoso@impulsarealestate.com
            </p>
            <p>
              <span className="text-gold font-medium">Contraseña:</span> impulsa
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
