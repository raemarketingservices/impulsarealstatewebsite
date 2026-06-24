import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type AgentRouteParams = { params: Promise<{ id: string }> }

export async function GET(
  _request: NextRequest,
  { params }: AgentRouteParams
) {
  try {
    const { id } = await params
    const agent = await db.agent.findUnique({ where: { id } })

    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agente no encontrado' },
        { status: 404 }
      )
    }

    // Strip password before returning
    const { password, ...safeAgent } = agent
    return NextResponse.json({ success: true, data: safeAgent })
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

    // Make sure agent exists
    const existing = await db.agent.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Agente no encontrado' },
        { status: 404 }
      )
    }

    // Whitelist of fields the agent can update — NEVER email
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

    const data: Record<string, unknown> = {}
    if (typeof name === 'string') data.name = name
    if (typeof title === 'string') data.title = title
    if (typeof bio === 'string') data.bio = bio
    if (typeof photoUrl === 'string') data.photoUrl = photoUrl
    if (typeof phone === 'string') data.phone = phone
    if (typeof whatsapp === 'string') data.whatsapp = whatsapp
    if (typeof instagram === 'string') data.instagram = instagram
    if (typeof tiktok === 'string') data.tiktok = tiktok
    if (typeof facebook === 'string') data.facebook = facebook
    if (typeof specialties === 'string') data.specialties = specialties
    if (typeof password === 'string' && password.trim().length > 0) {
      data.password = password
    }

    const updated = await db.agent.update({
      where: { id },
      data,
    })

    const { password: _pwd, ...safeAgent } = updated
    return NextResponse.json({ success: true, data: safeAgent })
  } catch (error) {
    console.error('Error updating agent profile:', error)
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    )
  }
}
