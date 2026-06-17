import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [agents, settings] = await Promise.all([
      db.agent.findMany({
        where: { active: true },
        include: {
          properties: {
            where: { published: true },
            select: { id: true, title: true, price: true, type: true, city: true, images: true, status: true },
            take: 3,
            orderBy: { featured: 'desc' },
          },
          _count: { select: { properties: true } },
        },
        orderBy: { order: 'asc' },
      }),
      db.setting.findMany({ where: { group: 'whatsapp' } }),
    ])

    // Build whatsapp map from settings
    const whatsappMap: Record<string, string> = {}
    for (const s of settings) {
      whatsappMap[s.key] = s.value
    }

    // Override agent whatsapp with settings value if available
    const agentsWithSettings = agents.map((agent) => {
      const firstName = agent.name.split(' ')[0].toLowerCase()
      const settingsKey = `whatsapp_${firstName}`
      const overrideWhatsapp = whatsappMap[settingsKey]
      return {
        ...agent,
        whatsapp: overrideWhatsapp || agent.whatsapp,
      }
    })

    return NextResponse.json({ success: true, data: agentsWithSettings })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch agents' }, { status: 500 })
  }
}
