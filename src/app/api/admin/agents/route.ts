import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET — list all agents (including inactive) with property count
export async function GET() {
  try {
    const agents = await db.agent.findMany({
      include: {
        _count: { select: { properties: true } },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    })

    const data = agents.map((a) => ({
      id: a.id,
      name: a.name,
      title: a.title,
      bio: a.bio,
      photoUrl: a.photoUrl,
      phone: a.phone,
      email: a.email,
      whatsapp: a.whatsapp,
      instagram: a.instagram,
      tiktok: a.tiktok,
      facebook: a.facebook,
      specialties: a.specialties,
      rating: a.rating,
      salesCount: a.salesCount,
      order: a.order,
      active: a.active,
      propertyCount: a._count.properties,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching admin agents:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch agents' }, { status: 500 })
  }
}

// POST — create a new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name,
      title,
      bio,
      photoUrl,
      phone,
      email,
      password,
      whatsapp,
      instagram,
      tiktok,
      facebook,
      specialties,
      rating,
      salesCount,
      active,
    } = body

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Nombre y email son obligatorios' },
        { status: 400 }
      )
    }

    // Check email uniqueness
    const existing = await db.agent.findFirst({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un agente con ese email' },
        { status: 409 }
      )
    }

    // Determine next order value
    const maxOrder = await db.agent.aggregate({ _max: { order: true } })
    const nextOrder = (maxOrder._max.order ?? -1) + 1

    const created = await db.agent.create({
      data: {
        name,
        title: title ?? '',
        bio: bio ?? '',
        photoUrl: photoUrl ?? '',
        phone: phone ?? '',
        email,
        password: password ?? 'impulsa',
        whatsapp: whatsapp ?? '',
        instagram: instagram ?? null,
        tiktok: tiktok ?? null,
        facebook: facebook ?? null,
        specialties: specialties ?? '[]',
        rating: typeof rating === 'number' ? rating : 5.0,
        salesCount: typeof salesCount === 'number' ? salesCount : 0,
        order: nextOrder,
        active: active !== false,
      },
    })

    return NextResponse.json({ success: true, data: created })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json({ success: false, error: 'Failed to create agent' }, { status: 500 })
  }
}
