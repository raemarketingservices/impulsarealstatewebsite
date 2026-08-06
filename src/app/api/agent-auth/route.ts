import { NextRequest, NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, identifier, password } = body as {
      email?: string
      name?: string
      identifier?: string
      password?: string
    }

    let sendEmail = email?.trim() || ''
    let sendName = name?.trim() || ''
    const ident = (identifier || '').trim()
    if (ident) {
      if (ident.includes('@')) sendEmail = sendEmail || ident
      else sendName = sendName || ident
    }

    if ((!sendEmail && !sendName) || !password) {
      return NextResponse.json(
        { success: false, error: 'Email o nombre y contraseña son requeridos' },
        { status: 400 }
      )
    }

    const queryArgs: { email?: string; name?: string; password: string } = { password }
    if (sendEmail) queryArgs.email = sendEmail
    if (sendName) queryArgs.name = sendName

    const result = await convexClient.query('functions:authAgent', queryArgs)

    if (!result || result.error === 'invalid') {
      return NextResponse.json(
        { success: false, error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    if (result.error === 'inactive') {
      return NextResponse.json(
        { success: false, error: 'Tu cuenta está desactivada. Contacta al administrador.' },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error in agent-auth:', error)
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    )
  }
}
