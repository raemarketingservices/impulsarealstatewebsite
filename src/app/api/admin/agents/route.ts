import { NextRequest, NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

// GET — list all agents (including inactive) with property count
export async function GET() {
  try {
    const data = await convexClient.query('functions:adminAgents')
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

    try {
      const created = await convexClient.mutation('functions:createAgent', {
        name,
        title: title ?? '',
        bio: bio ?? '',
        photoUrl: photoUrl ?? '',
        phone: phone ?? '',
        email,
        password: password ?? 'impulsa',
        whatsapp: whatsapp ?? '',
        instagram: instagram ?? undefined,
        tiktok: tiktok ?? undefined,
        facebook: facebook ?? undefined,
        specialties: specialties ?? '[]',
        rating: typeof rating === 'number' ? rating : 5.0,
        salesCount: typeof salesCount === 'number' ? salesCount : 0,
        active: active !== false,
      })
      return NextResponse.json({ success: true, data: created })
    } catch (e: any) {
      if (e?.message?.includes('email')) {
        return NextResponse.json(
          { success: false, error: 'Ya existe un agente con ese email' },
          { status: 409 }
        )
      }
      throw e
    }
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json({ success: false, error: 'Failed to create agent' }, { status: 500 })
  }
}
