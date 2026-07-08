'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, User, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.982 11.982 0 005.683 1.448h.005c6.582 0 11.94-5.335 11.944-11.893a11.821 11.821 0 00-3.488-8.453z"/>
    </svg>
  )
}

export function ChatbotWidget() {
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [welcome, setWelcome] = React.useState('¡Hola! 👋 Soy IMPULSA Bot, tu asistente inmobiliario. ¿En qué puedo ayudarte?')
  const [whatsappInfo, setWhatsappInfo] = React.useState<{ number: string; url: string } | null>(null)
  const [showAgentOffer, setShowAgentOffer] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const sessionId = React.useRef(`chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`).current

  React.useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.map?.chatbot_welcome?.value) setWelcome(d.map.chatbot_welcome.value)
      })
      .catch(() => {})
  }, [])

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const send = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return

    setMessages((prev) => [...prev, { role: 'user', content: msg }])
    setInput('')
    setLoading(true)
    setShowAgentOffer(false)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: msg }),
      })
      const data = await res.json()

      if (data.success) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
        if (data.wantsAgent) {
          setWhatsappInfo({ number: data.whatsappNumber, url: data.whatsappUrl })
          setShowAgentOffer(true)
        }
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Lo siento, hubo un error. Intenta de nuevo.' }])
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error de conexión. Por favor intenta más tarde.' }])
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    '¿Qué propiedades tienen en Punta Cana?',
    '¿Cuál es el proceso para comprar?',
    '¿Puedo hablar con un agente?',
  ]

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-emerald shadow-luxe flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform"
        aria-label={open ? 'Cerrar chat' : 'Abrir chat'}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="relative">
              <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gold ring-2 ring-primary-foreground animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-md h-[70vh] sm:h-[600px] max-h-[700px] flex flex-col rounded-2xl overflow-hidden shadow-luxe border border-border/60 bg-card"
          >
            {/* Header */}
            <div className="bg-gradient-emerald p-4 text-primary-foreground flex items-center gap-3 shrink-0">
              <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-gold/50 shrink-0 bg-white/10">
                <Image src="/images/logo-impulsa.png" alt="IMPULSA" fill className="object-cover" sizes="40px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-display font-bold text-sm">IMPULSA Bot</p>
                  <Sparkles className="h-3 w-3 text-gold" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-[11px] text-primary-foreground/80">En línea · Responde al instante</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors" aria-label="Cerrar">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden ring-1 ring-gold/30 shrink-0">
                      <Image src="/images/logo-impulsa.png" alt="Bot" fill className="object-cover" sizes="32px" />
                    </div>
                    <div className="bg-card rounded-2xl rounded-tl-sm p-3 max-w-[85%] shadow-sm border border-border/40">
                      <p className="text-sm leading-relaxed whitespace-pre-line">{welcome}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pl-10">
                    {quickActions.map((q) => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        className="text-left text-xs px-3 py-2 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary border border-primary/15 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {m.role === 'assistant' && (
                    <div className="relative h-8 w-8 rounded-full overflow-hidden ring-1 ring-gold/30 shrink-0">
                      <Image src="/images/logo-impulsa.png" alt="Bot" fill className="object-cover" sizes="32px" />
                    </div>
                  )}
                  {m.role === 'user' && (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-emerald text-primary-foreground rounded-tr-sm'
                      : 'bg-card rounded-tl-sm border border-border/40 shadow-sm'
                  }`}>
                    <p className="whitespace-pre-line">{m.content}</p>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex gap-2">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden ring-1 ring-gold/30 shrink-0">
                    <Image src="/images/logo-impulsa.png" alt="Bot" fill className="object-cover" sizes="32px" />
                  </div>
                  <div className="bg-card rounded-2xl rounded-tl-sm p-4 border border-border/40 shadow-sm">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {showAgentOffer && whatsappInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-[#25D366]/8 border border-[#25D366]/30 p-3"
                >
                  <p className="text-xs text-muted-foreground mb-2">¿Quieres que un agente te contacte?</p>
                  <a
                    href={whatsappInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-[#25D366] hover:bg-[#1da851] text-white text-sm font-semibold transition-colors"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Hablar con agente por WhatsApp
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/40 bg-card shrink-0">
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Escribe tu mensaje..."
                  disabled={loading}
                  className="flex-1 h-11 bg-background border-border/60"
                />
                <Button
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  size="icon"
                  className="h-11 w-11 bg-gradient-emerald text-primary-foreground hover:opacity-90 shrink-0"
                  aria-label="Enviar"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-1.5">
                Powered by IMPULSA AI · Información del catálogo en tiempo real
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Floating WhatsApp button (left side, opposite chat)
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
      className="fixed bottom-6 left-6 z-40"
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
        <span className="absolute left-0 top-0 h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-[#25D366] hover:bg-[#1da851] shadow-lg flex items-center justify-center transition-colors group-hover:scale-105">
          <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
        </div>
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.9 }}
              className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-card text-foreground text-sm font-medium px-3 py-2 rounded-lg shadow-luxe border border-border/60 pointer-events-none"
            >
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
                <span>¿Hablamos?</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Respuesta inmediata</p>
            </motion.div>
          )}
        </AnimatePresence>
        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-gold ring-2 ring-card flex items-center justify-center">
          <span className="text-[9px] font-bold text-gold-foreground">1</span>
        </span>
      </a>
    </motion.div>
  )
}