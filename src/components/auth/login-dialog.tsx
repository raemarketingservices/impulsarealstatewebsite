'use client'

import * as React from 'react'
import { Mail, Lock, User, ArrowRight, Building2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

export function LoginDialog() {
  const { authOpen, setAuthOpen, setAuthed, setUserName, setView } = useAppStore()

  const handleAuth = (e: React.FormEvent, mode: 'login' | 'register') => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const email = formData.get('email') as string
    const name = (formData.get('name') as string) || email.split('@')[0]

    toast.success(mode === 'login' ? '¡Bienvenido de vuelta!' : '¡Cuenta creada exitosamente!', {
      description: `Sesión iniciada como ${name}`,
    })

    setAuthed(true)
    setUserName(name)
    setAuthOpen(false)
    setTimeout(() => setView('dashboard'), 300)
  }

  return (
    <Dialog open={authOpen} onOpenChange={setAuthOpen}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        <DialogTitle className="sr-only">Iniciar sesión o registrarse</DialogTitle>
        <DialogDescription className="sr-only">
          Accede a tu portal para gestionar tus finanzas, metas e inversiones inmobiliarias.
        </DialogDescription>
        {/* Header band */}
        <div className="bg-gradient-emerald p-6 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-5 w-5 text-gold" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gold">IMPULSA Real Estate</span>
            </div>
            <h2 className="font-display text-2xl font-bold">Acceso a tu Portal</h2>
            <p className="text-sm text-primary-foreground/80 mt-1">
              Gestiona tus finanzas, metas e inversiones inmobiliarias.
            </p>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <div className="px-6 pt-5">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="login" className="p-6 pt-4 mt-0">
            <form onSubmit={(e) => handleAuth(e, 'login')} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="login-email" name="email" type="email" placeholder="tu@email.com" required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Contraseña</Label>
                  <button type="button" className="text-xs text-gold hover:underline">¿Olvidaste tu contraseña?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="login-password" name="password" type="password" placeholder="••••••••" required className="pl-10" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-gold text-gold-foreground hover:opacity-90">
                Ingresar a mi cuenta
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Demo: usa cualquier email y contraseña para entrar
              </p>
            </form>
          </TabsContent>

          <TabsContent value="register" className="p-6 pt-4 mt-0">
            <form onSubmit={(e) => handleAuth(e, 'register')} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="reg-name" name="name" type="text" placeholder="Juan Pérez" required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="reg-email" name="email" type="email" placeholder="tu@email.com" required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="reg-password" name="password" type="password" placeholder="••••••••" required className="pl-10" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-gold text-gold-foreground hover:opacity-90">
                Crear cuenta
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
