import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message, propertyId } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Nombre, email y mensaje son requeridos' },
        { status: 400 }
      )
    }

    const inquiry = await db.inquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        propertyId: propertyId || null,
      },
    })

    return NextResponse.json({ success: true, data: inquiry })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json({ success: false, error: 'Failed to create inquiry' }, { status: 500 })
  }
}
