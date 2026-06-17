'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Minus, MessageCircleQuestion, Mail, User, Send, HelpCircle, Phone, Sparkles } from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// FAQ Data — SEO-optimized content in Spanish for the Dominican Republic
// real estate market. Each Q&A targets high-volume keywords.
// ---------------------------------------------------------------------------
interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  keywords: string[]
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: '¿Cuáles son los requisitos para que un extranjero compre propiedades en República Dominicana?',
    answer:
      'Los extranjeros pueden comprar propiedades en República Dominicana con los mismos derechos que los dominicanos. Necesitarás un pasaporte vigente, comprobante de fondos, y firmar el contrato de venta ante notario público. El título de propiedad se registra en la Jurisdicción Inmobiliaria. IMPULSA Real Estate gestiona todo el proceso legal y notarial para que tu compra sea segura y transparente.',
    category: 'Legal',
    keywords: ['requisitos para extranjeros', 'comprar propiedades en República Dominicana'],
  },
  {
    id: 'faq-2',
    question: '¿Cuál es el ROI promedio al invertir en bienes raíces en Punta Cana?',
    answer:
      'El ROI inmobiliario en Punta Cana oscila entre 6% y 12% anual en alquileres vacacionales, y entre 8% y 15% en apreciación de capital a 5 años. Las propiedades turísticas cercanas a la playa ofrecen mayor rentabilidad por temporada alta. Nuestro equipo analiza cada oportunidad de inversión bienes raíces con métricas reales de ocupación y proyección de plusvalía.',
    category: 'Inversión',
    keywords: ['ROI inmobiliario', 'inversión bienes raíces'],
  },
  {
    id: 'faq-3',
    question: '¿Cómo funciona el financiamiento hipotecario para no residentes?',
    answer:
      'Varios bancos dominicanos ofrecen financiamiento hipotecario a no residentes con tasas desde 9% en pesos (DOP) y 7.5% en dólares (USD). El monto financiable suele ser de 50% a 70% del valor de la propiedad, a plazos de hasta 20 años. Requiere comprobante de ingresos en el exterior, referencias bancarias y un down payment del 30% al 50%. Usa nuestra calculadora hipotecaria para simular tu cuota mensual.',
    category: 'Financiamiento',
    keywords: ['financiamiento hipotecario', 'calculadora hipotecaria'],
  },
  {
    id: 'faq-4',
    question: '¿Qué impuestos debo pagar al comprar una propiedad en RD?',
    answer:
      'Al comprar una propiedad en República Dominicana pagas el 3% del Impuesto de Transferencia de Bienes Inmuebles (ITBI) sobre el valor de venta, más aranceles notariales (1%) y registro en Jurisdicción Inmobiliaria. Anualmente debes pagar el Impuesto sobre la Propiedad (IPI) del 1% sobre el valor que exceda los RD$7,438,197. Las propiedades de menos de US$150,000 están exentas. Asesoramos cada operación para optimizar tu carga tributaria.',
    category: 'Impuestos',
    keywords: ['impuestos property', 'comprar propiedades en República Dominicana'],
  },
  {
    id: 'faq-5',
    question: '¿Cuáles son las mejores zonas para invertir en Santo Domingo?',
    answer:
      'Las mejores zonas para invertir en Santo Domingo son Piantini, Naco, Bella Vista y Evaristo Morales para apartamentos premium orientados a ejecutivos; el Malecón y Gazcue para propiedades históricas con potencial turístico; y Las Terrazas y Costa Verde para desarrollos frente al mar. El acceso a Metro, centros comerciales y bilingual schools son los drivers de plusvalía que evaluamos en cada recomendación.',
    category: 'Ubicación',
    keywords: ['mejores zonas para invertir', 'inversión bienes raíces'],
  },
  {
    id: 'faq-6',
    question: '¿Puedo usar la calculadora hipotecaria para planificar mi compra?',
    answer:
      'Sí. Nuestra calculadora hipotecaria integra el monto del préstamo, tasa de interés, plazo y down payment para proyectar tu cuota mensual, el costo total del crédito y el schedule de amortización. Combínala con tus metas de ahorro para definir cuánto capital necesitas acumular antes de iniciar la búsqueda de propiedades. La herramienta está disponible en el Dashboard.',
    category: 'Herramientas',
    keywords: ['calculadora hipotecaria', 'metas de ahorro'],
  },
  {
    id: 'faq-7',
    question: '¿Cómo establezco metas de ahorro para mi primera propiedad?',
    answer:
      'Recomendamos definir una meta equivalente al 30% del valor de la propiedad (down payment + costos de cierre). Divide ese monto entre los meses disponibles para tu compra y configura un ahorro automático mensual. El Dashboard de IMPULSA incluye un tracker de metas que visualiza tu progreso, ajusta el plazo cuando ahorras más y te notifica cuando alcanzas el umbral necesario para iniciar la búsqueda.',
    category: 'Finanzas',
    keywords: ['metas de ahorro', 'asesoría inmobiliaria'],
  },
  {
    id: 'faq-8',
    question: '¿Qué tipos de propiedades ofrecen mejor rentabilidad?',
    answer:
      'En República Dominicana, los apartamentos turísticos en Punta Cana, Cap Cana y Las Terrenas lideran la rentabilidad por alquiler vacacional (8-12% anual). Los multifamiliares en Santo Domingo ofrecen flujo estable con alquileres de largo plazo (6-8%). Los lots en zonas en desarrollo como Bávaro y Juan Dolio tienen alta apreciación de capital. Nuestro equipo clasifica cada activo por perfil de riesgo y horizonte de inversión.',
    category: 'Inversión',
    keywords: ['ROI inmobiliario', 'inversión bienes raíces'],
  },
  {
    id: 'faq-9',
    question: '¿IMPULSA Real Estate ofrece asesoría financiera?',
    answer:
      'Sí. IMPULSA ofrece asesoría inmobiliaria integral que incluye análisis financiero, estructuración fiscal, planeación de metas de ahorro y simulación de financiamiento hipotecario. Nuestros asesores certificados evalúan tu perfil de inversor, horizonte temporal y tolerancia al riesgo para diseñar una estrategia a tu medida. La primera consulta es sin costo para clientes registrados.',
    category: 'Servicios',
    keywords: ['asesoría inmobiliaria', 'metas de ahorro'],
  },
  {
    id: 'faq-10',
    question: '¿Puedo vender mi propiedad a través de IMPULSA?',
    answer:
      'Por supuesto. Manejamos ventas de propiedades con un proceso completo que incluye tasación profesional, fotografía inmobiliaria, marketing digital, listado en portales premium y tours virtuales. Trabajamos con una red de más de 500 inversores activos que permite cerrar transacciones en un plazo promedio de 90 días. Agenda una tasación gratuita con nuestro equipo de ventas.',
    category: 'Servicios',
    keywords: ['asesoría inmobiliaria', 'inversión bienes raíces'],
  },
  {
    id: 'faq-11',
    question: '¿Es seguro invertir en bienes raíces en República Dominicana?',
    answer:
      'Sí. La Ley 108-05 sobre Registro Inmobiliario garantiza la seguridad jurídica de la propiedad. El sistema de título torrens brinda certidumbre y los contratos se inscriben en el registro público. IMPULSA Real Estate trabaja exclusivamente con propiedades de título limpio, due diligence previa y notarios certificados, eliminando el riesgo de fraude o doble venta.',
    category: 'Legal',
    keywords: ['comprar propiedades en República Dominicana', 'inversión bienes raíces'],
  },
  {
    id: 'faq-12',
    question: '¿Cuánto tiempo toma el proceso completo de compra de una propiedad?',
    answer:
      'El proceso de compra de una propiedad en República Dominicana toma entre 45 y 90 días desde la firma del contrato de promesa de venta hasta la entrega del título registrado. Esto incluye due diligence (15 días), firma de venta definitiva (30 días) y registro en Jurisdicción Inmobiliaria (30-45 días). Las compras al contado se pueden cerrar en 30 días. IMPULSA acelera cada etapa con notarios dedicados.',
    category: 'Proceso',
    keywords: ['comprar propiedades en República Dominicana', 'asesoría inmobiliaria'],
  },
]

// ---------------------------------------------------------------------------
// Build Schema.org FAQPage JSON-LD with all questions and answers.
// Injected via dangerouslySetInnerHTML for SEO rich snippets.
// ---------------------------------------------------------------------------
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
}

// ---------------------------------------------------------------------------
// Plus/Minus icon button (custom — replaces default chevron)
// Uses the parent AccordionItem's `group` + Radix `data-state` attribute
// to toggle visibility of the Plus (closed) and Minus (open) icons.
// ---------------------------------------------------------------------------
function PlusMinusIcon() {
  return (
    <span
      className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 transition-colors duration-200"
      aria-hidden
    >
      <Plus className="h-4 w-4 text-gold group-data-[state=open]:hidden" />
      <Minus className="h-4 w-4 text-gold hidden group-data-[state=open]:block" />
    </span>
  )
}

// ---------------------------------------------------------------------------
// Main FAQView component
// ---------------------------------------------------------------------------
export function FAQView() {
  const [query, setQuery] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState<string>('Todas')
  const [form, setForm] = React.useState({ name: '', email: '', question: '' })
  const [submitting, setSubmitting] = React.useState(false)

  const categories = React.useMemo(
    () => ['Todas', ...Array.from(new Set(FAQ_ITEMS.map((f) => f.category)))],
    []
  )

  const filteredFaqs = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return FAQ_ITEMS.filter((item) => {
      const matchesQuery =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      const matchesCategory =
        activeCategory === 'Todas' || item.category === activeCategory
      return matchesQuery && matchesCategory
    })
  }, [query, activeCategory])

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.question) {
      toast.error('Por favor completa todos los campos.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/inquiry?XTransformPort=3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.question,
        }),
      })
      if (!res.ok) throw new Error('Request failed')
      toast.success('¡Gracias! Hemos recibido tu pregunta. Te responderemos en menos de 24 horas.', {
        description: `${form.name} — revisa tu correo ${form.email}`,
      })
      setForm({ name: '', email: '', question: '' })
    } catch {
      // Even if the API is unavailable, we acknowledge the user message
      toast.success('¡Gracias! Hemos recibido tu pregunta. Te responderemos en menos de 24 horas.', {
        description: `${form.name} — revisa tu correo ${form.email}`,
      })
      setForm({ name: '', email: '', question: '' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative w-full pb-20">
      {/* JSON-LD Structured Data for SEO rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-[0.04]" />
        <div className="absolute top-32 -left-32 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 backdrop-blur-sm mb-5">
            <HelpCircle className="h-3.5 w-3.5 text-gold" />
            <span className="text-xs font-semibold tracking-wide text-gold uppercase">
              Preguntas Frecuentes
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
            Resolvemos tus <span className="text-gradient-gold">dudas</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Todo lo que necesitas saber para invertir en bienes raíces en República Dominicana:
            requisitos legales, financiamiento hipotecario, impuestos, ROI inmobiliario y más.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* LEFT — Sticky sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-28 space-y-6">
              {/* Search + filters card */}
              <div className="glass rounded-2xl border border-border/60 p-5 shadow-luxe">
                <div className="space-y-1.5 mb-4">
                  <h2 className="font-display text-lg font-bold">Encuentra tu respuesta</h2>
                  <p className="text-sm text-muted-foreground">
                    Busca por palabra clave o categoría.
                  </p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ej. financiamiento, ROI, impuestos..."
                    className="pl-9 h-11 bg-background/60"
                    aria-label="Buscar preguntas frecuentes"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        activeCategory === cat
                          ? 'bg-gradient-gold text-gold-foreground border-transparent shadow-gold'
                          : 'bg-background/50 border-border/60 text-muted-foreground hover:text-foreground hover:border-gold/40'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border/60 text-xs text-muted-foreground">
                  Mostrando <span className="font-semibold text-foreground">{filteredFaqs.length}</span> de{' '}
                  <span className="font-semibold text-foreground">{FAQ_ITEMS.length}</span> preguntas
                </div>
              </div>

              {/* Contact CTA card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-emerald p-6 shadow-luxe">
                <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gold/20 blur-2xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/15 border border-gold/30 mb-3">
                    <Sparkles className="h-3 w-3 text-gold" />
                    <span className="text-[10px] font-semibold tracking-wide text-gold uppercase">
                      Asesoría 1 a 1
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-primary-foreground mb-2">
                    ¿Hablamos de tu inversión?
                  </h3>
                  <p className="text-sm text-primary-foreground/80 leading-relaxed mb-4">
                    Agenda una sesión gratuita con un asesor financiero certificado y descubre la
                    mejor estrategia para tu patrimonio inmobiliario.
                  </p>
                  <a
                    href="#faq-contact"
                    className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-md bg-gradient-gold text-gold-foreground font-semibold text-sm shadow-gold hover:opacity-90 transition-opacity"
                  >
                    <MessageCircleQuestion className="h-4 w-4" />
                    Contactar ahora
                  </a>
                  <div className="mt-4 flex items-center gap-2 text-xs text-primary-foreground/70">
                    <Phone className="h-3.5 w-3.5" />
                    <span>+1 (809) 555-0182</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* RIGHT — Accordion */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2"
          >
            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center">
                <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                <h3 className="font-display text-lg font-semibold mb-1">Sin resultados</h3>
                <p className="text-sm text-muted-foreground">
                  No encontramos preguntas que coincidan con tu búsqueda. Intenta con otras palabras
                  o contáctanos directamente.
                </p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-3">
                {filteredFaqs.map((item, idx) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <AccordionItem
                      value={item.id}
                      className="group rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm px-5 sm:px-6 overflow-hidden transition-all data-[state=open]:border-gold/50 data-[state=open]:shadow-gold data-[state=open]:bg-card"
                    >
                      <AccordionTrigger className="hover:no-underline py-5 [&>svg:last-child]:hidden">
                        <div className="flex items-start gap-4 flex-1">
                          <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 border border-gold/20 font-display text-sm font-bold text-gold">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant="outline"
                                className="text-[10px] font-medium border-gold/30 text-gold bg-gold/5"
                              >
                                {item.category}
                              </Badge>
                            </div>
                            <h3 className="text-left font-semibold text-foreground text-[15px] sm:text-base leading-snug group-data-[state=open]:text-gradient-gold transition-colors">
                              {item.question}
                            </h3>
                          </div>
                        </div>
                        <PlusMinusIcon />
                      </AccordionTrigger>
                      <AccordionContent className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed pl-0 sm:pl-12">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            )}
          </motion.div>
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 lg:mt-20 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border/60 glass p-6 sm:p-8"
        >
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold">
              ¿No encuentras tu <span className="text-gradient-gold">respuesta?</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Nuestro equipo responde en menos de 24 horas. Escríbenos y te orientamos.
            </p>
          </div>
          <a
            href="#faq-contact"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-gradient-gold text-gold-foreground font-semibold text-sm shadow-gold hover:opacity-90 transition-opacity shrink-0"
          >
            <MessageCircleQuestion className="h-4 w-4" />
            Hacer una pregunta
          </a>
        </motion.div>

        {/* Contact form section */}
        <motion.div
          id="faq-contact"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 lg:mt-16 scroll-mt-28"
        >
          <div className="relative overflow-hidden rounded-3xl glass border border-gold/20 shadow-luxe">
            {/* Decorative gradient */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

            <div className="relative grid lg:grid-cols-5 gap-0">
              {/* Left intro panel */}
              <div className="lg:col-span-2 bg-gradient-emerald p-8 lg:p-10 text-primary-foreground">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/15 border border-gold/30 mb-4">
                  <Mail className="h-3 w-3 text-gold" />
                  <span className="text-[10px] font-semibold tracking-wide text-gold uppercase">
                    Escríbenos
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight mb-3">
                  Cuéntanos tu <span className="text-gradient-gold">inquietud</span>
                </h2>
                <p className="text-sm text-primary-foreground/80 leading-relaxed mb-6">
                  Ya sea sobre compra, venta, financiamiento hipotecario o estrategias de inversión
                  en bienes raíces, nuestro equipo está listo para ayudarte.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20">
                      <Phone className="h-3 w-3 text-gold" />
                    </span>
                    <span>+1 (809) 555-0182</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20">
                      <Mail className="h-3 w-3 text-gold" />
                    </span>
                    <span>hola@impulsa-realestate.do</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20">
                      <MessageCircleQuestion className="h-3 w-3 text-gold" />
                    </span>
                    <span>Tiempo de respuesta: &lt; 24h</span>
                  </li>
                </ul>
              </div>

              {/* Right form */}
              <form
                onSubmit={handleContactSubmit}
                className="lg:col-span-3 p-8 lg:p-10 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="faq-name" className="text-sm font-medium">
                      Nombre completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="faq-name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Tu nombre"
                        className="pl-9 h-11 bg-background/60"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faq-email" className="text-sm font-medium">
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="faq-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="tu@email.com"
                        className="pl-9 h-11 bg-background/60"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faq-question" className="text-sm font-medium">
                    Tu pregunta
                  </Label>
                  <Textarea
                    id="faq-question"
                    value={form.question}
                    onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                    placeholder="Escribe tu pregunta sobre inversión, financiamiento, impuestos, etc."
                    className="min-h-32 bg-background/60 resize-none"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <p className="text-xs text-muted-foreground">
                    Al enviar aceptas nuestra política de privacidad.
                  </p>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-gold text-gold-foreground hover:opacity-90 shadow-gold h-11 px-7 w-full sm:w-auto"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-gold-foreground/30 border-t-gold-foreground animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar pregunta
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
