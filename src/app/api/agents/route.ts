import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const agents = await db.agent.findMany({
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
    })

    return NextResponse.json({ success: true, data: agents })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch agents' }, { status: 500 })
  }
}
