import { NextRequest, NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

type AgentRouteParams = { params: Promise<{ id: string }> }

export async function GET(
  _request: NextRequest,
  { params }: AgentRouteParams
) {
  try {
    const { id } = await params
    const agent = await convexClient.query('functions:getAgentById', { id })

    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agente no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: agent })
  } catch (error) {
    console.error('Error fetching agent profile:', error)
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: AgentRouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      name,
      title,
      bio,
      photoUrl,
      phone,
      whatsapp,
      instagram,
      tiktok,
      facebook,
      specialties,
      password,
    } = body as Record<string, unknown>

    const patch: Record<string, unknown> = {}
    if (typeof name === 'string') patch.name = name
    if (typeof title === 'string') patch.title = title
    if (typeof bio === 'string') patch.bio = bio
    if (typeof photoUrl === 'string') patch.photoUrl = photoUrl
    if (typeof phone === 'string') patch.phone = phone
    if (typeof whatsapp === 'string') patch.whatsapp = whatsapp
    if (typeof instagram === 'string') patch.instagram = instagram
    if (typeof tiktok === 'string') patch.tiktok = tiktok
    if (typeof facebook === 'string') patch.facebook = facebook
    if (typeof specialties === 'string') patch.specialties = specialties
    if (typeof password === 'string' && password.trim().length > 0) {
      patch.password = password
    }

    const updated = await convexClient.mutation('functions:updateAgentProfile', { id, patch })
    const safeAgent = updated
    return NextResponse.json({ success: true, data: safeAgent })
  } catch (error) {
    console.error('Error updating agent profile:', error)
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    )
  }
}
