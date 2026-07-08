import { db } from '@/lib/db'

async function main() {
  console.log('🌱 Seeding chatbot settings...')

  const settings = [
    {
      key: 'chatbot_knowledge',
      value: `IMPULSA Real Estate es la plataforma inmobiliaria corporativa líder en República Dominicana con 15 años de experiencia.

SERVICIOS:
- Compra y venta de propiedades premium (villas, casas, apartamentos, comerciales, terrenos)
- Asesoría financiera e inversión inmobiliaria
- Financiamiento hipotecario
- Renta vacacional

ZONAS DE OPERACIÓN:
- Santo Domingo (Piantini, Zona Colonial, Arroyo Hondo, Blue Mall)
- Punta Cana / Cap Cana / Bávaro
- Santiago / Norte
- Las Terrenas / Noreste
- Casa de Campo (La Romana)

TIPOS DE PROPIEDADES:
- Villas de lujo ($890K - $2.1M)
- Casas ($1.2M - $2.1M)
- Apartamentos ($285K - $685K)
- Penthouses ($420K - $685K)

PROCESO DE COMPRA:
1. Consulta inicial con asesor
2. Selección de propiedad
3. Análisis financiero y opciones de préstamo
4. Due diligence legal
5. Cierre de transacción

EXTRANJEROS: Pueden comprar propiedades libremente en RD. Se requiere pasaporte vigente y los impuestos son aproximadamente 3% del valor de la propiedad.

ROI PROMEDIO: 8-12% anual en zonas premium. Punta Cana y Santo Domingo ofrecen las mejores oportunidades de apreciación.

CONTACTO:
- WhatsApp: 9146733141
- Teléfono: 829-696-7140
- Email: info@impulsarealestate.com
- Horario: Lun-Sáb 8am-8pm`,
      label: 'Conocimiento del Chatbot (catálogo, servicios, FAQ)',
      group: 'chatbot',
    },
    {
      key: 'chatbot_system_prompt',
      value: 'Eres IMPULSA Bot, el asistente virtual de IMPULSA Real Estate, la inmobiliaria premium líder en República Dominicana. Respondes en español de forma profesional, cálida y concisa. Ayudas a los clientes con: información sobre propiedades, precios, zonas, proceso de compra, financiamiento, inversión, y dudas generales. Cuando un cliente quiera hablar con un asesor humano, agende una visita, o tenga una consulta específica que requiera atención personalizada, indícales que puedes conectarlos con un agente por WhatsApp. Mantén respuestas breves (máximo 3-4 párrafos). Usa emojis moderadamente para dar calidez.',
      label: 'Personalidad/System Prompt del Chatbot',
      group: 'chatbot',
    },
    {
      key: 'chatbot_welcome',
      value: '¡Hola! 👋 Soy IMPULSA Bot, tu asistente inmobiliario. Puedo ayudarte con:\n\n🏠 Información sobre propiedades\n💰 Precios y financiamiento\n📍 Zonas disponibles\n📈 Oportunidades de inversión\n\n¿En qué puedo ayudarte hoy?',
      label: 'Mensaje de bienvenida del chatbot',
      group: 'chatbot',
    },
  ]

  for (const s of settings) {
    await db.setting.upsert({
      where: { key: s.key },
      update: { label: s.label, group: s.group },
      create: s,
    })
  }

  console.log(`✅ ${settings.length} chatbot settings seeded`)
}

main().catch(console.error).finally(() => db.$disconnect())
