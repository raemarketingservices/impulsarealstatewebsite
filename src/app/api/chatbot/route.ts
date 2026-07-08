import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

// In-memory conversation store (per session)
const conversations = new Map<string, { role: string; content: string }[]>()

// Cache for settings + property catalog (refreshed every 60s)
let cache: { knowledge: string; systemPrompt: string; whatsapp: string; catalog: string; ts: number } | null = null
const CACHE_TTL = 60_000

async function getContext() {
  if (cache && Date.now() - cache.ts < CACHE_TTL) return cache

  const [settings, properties] = await Promise.all([
    db.setting.findMany(),
    db.property.findMany({
      where: { published: true },
      select: {
        title: true, type: true, operation: true, price: true, currency: true,
        bedrooms: true, bathrooms: true, area: true, parking: true,
        location: true, city: true, zone: true, features: true, featured: true,
      },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take: 50,
    }),
  ])

  const map: Record<string, string> = {}
  for (const s of settings) map[s.key] = s.value

  // Build property catalog summary for the LLM
  const catalogLines = properties.map((p) => {
    let features: string[] = []
    try { features = JSON.parse(p.features) } catch {}
    return `• ${p.title} | ${p.type} | ${p.operation} | $${p.price.toLocaleString()} ${p.currency} | ${p.bedrooms} hab, ${p.bathrooms} baños, ${p.area}m² | ${p.location}, ${p.city} (Zona ${p.zone})${features.length ? ' | ' + features.slice(0, 4).join(', ') : ''}${p.featured ? ' | DESTACADA' : ''}`
  })
  const catalog = `CATÁLOGO DE PROPIEDADES DISPONIBLES (${properties.length} propiedades):\n${catalogLines.join('\n')}`

  cache = {
    knowledge: map.chatbot_knowledge || '',
    systemPrompt: map.chatbot_system_prompt || 'Eres un asistente inmobiliario profesional.',
    whatsapp: map.whatsapp_general || '9146733141',
    catalog,
    ts: Date.now(),
  }
  return cache
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, message } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ success: false, error: 'Message required' }, { status: 400 })
    }

    const ctx = await getContext()
    const sid = sessionId || 'default'

    // Build conversation history
    let history = conversations.get(sid)
    if (!history) {
      history = [{
        role: 'assistant',
        content: `${ctx.systemPrompt}\n\n--- CONOCIMIENTO DE LA EMPRESA ---\n${ctx.knowledge}\n\n--- ${ctx.catalog} ---\n\nCuando el cliente quiera hablar con un agente, agendar visita, o necesite atención personalizada, responde que lo conectarás con un agente e incluye la frase exacta "[CONECTAR_WHATSAPP]" en tu respuesta. El número de WhatsApp es ${ctx.whatsapp}.`,
      }]
      conversations.set(sid, history)
    }

    // Add user message
    history.push({ role: 'user', content: message })

    // Trim history to last 12 messages + system prompt
    if (history.length > 13) {
      history = [history[0], ...history.slice(-12)]
      conversations.set(sid, history)
    }

    // Call LLM
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: history as any,
      thinking: { type: 'disabled' },
    })

    const aiResponse = completion.choices[0]?.message?.content || 'Lo siento, no pude procesar tu consulta. ¿Podrías reformularla?'

    // Save assistant response
    history.push({ role: 'assistant', content: aiResponse })

    // Detect agent handoff request
    const wantsAgent = /\[CONECTAR_WHATSAPP\]/i.test(aiResponse) ||
      /hablar con (un )?agente|contactar (un )?agente|whatsapp|asesor humano|conectar con/i.test(message)

    const cleanResponse = aiResponse.replace(/\[CONECTAR_WHATSAPP\]/gi, '').trim()
    const whatsappUrl = `https://wa.me/${ctx.whatsapp}?text=${encodeURIComponent(`Hola, vengo del chatbot de IMPULSA Real Estate. Mi consulta: ${message}`)}`

    return NextResponse.json({
      success: true,
      response: cleanResponse,
      wantsAgent,
      whatsappNumber: ctx.whatsapp,
      whatsappUrl,
    })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json({
      success: false,
      error: 'Error procesando tu mensaje',
      response: 'Lo siento, hubo un error. Por favor intenta de nuevo o contáctanos por WhatsApp.',
    }, { status: 500 })
  }
}

// Clear conversation
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sid = searchParams.get('sessionId') || 'default'
  conversations.delete(sid)
  return NextResponse.json({ success: true })
}
