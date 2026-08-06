import { NextRequest, NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const args: Record<string, string> = {}
    const agentId = params.get('agentId')
    const status = params.get('status')
    const zone = params.get('zone')
    const q = params.get('q')
    const unassigned = params.get('unassigned')
    if (agentId) args.agentId = agentId
    if (status) args.status = status
    if (zone) args.zone = zone
    if (q) args.q = q
    if (unassigned === 'true') args.unassigned = 'true'

    const data = await convexClient.query('functions:listLeads', args)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error listing leads:', error)
    return NextResponse.json({ success: false, error: 'Error del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type,
      firstName,
      lastName,
      email,
      phone,
      propertyType,
      budget,
      zoneName,
      lat,
      lng,
      message,
    } = body as {
      type?: string
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
      propertyType?: string
      budget?: string
      zoneName?: string
      lat?: number | null
      lng?: number | null
      message?: string
    }

    if (!type || !firstName || !lastName || !email || !propertyType) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Correo electrónico inválido' },
        { status: 400 }
      )
    }

    const data = await convexClient.mutation('functions:createLead', {
      type,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      propertyType,
      budget: budget?.trim() || '',
      zoneName: zoneName?.trim() || '',
      lat: typeof lat === 'number' ? lat : undefined,
      lng: typeof lng === 'number' ? lng : undefined,
      message: message?.trim() || undefined,
    })

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ success: false, error: 'Error del servidor' }, { status: 500 })
  }
}
