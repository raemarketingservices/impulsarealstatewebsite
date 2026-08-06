import { NextRequest, NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

// PUT — update an existing agent (all fields)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const patch: Record<string, unknown> = {}
    if (name !== undefined) patch.name = name
    if (title !== undefined) patch.title = title
    if (bio !== undefined) patch.bio = bio
    if (photoUrl !== undefined) patch.photoUrl = photoUrl
    if (phone !== undefined) patch.phone = phone
    if (email !== undefined) patch.email = email
    if (password !== undefined && password !== '') patch.password = password
    if (whatsapp !== undefined) patch.whatsapp = whatsapp
    if (instagram !== undefined) patch.instagram = instagram
    if (tiktok !== undefined) patch.tiktok = tiktok
    if (facebook !== undefined) patch.facebook = facebook
    if (specialties !== undefined) patch.specialties = specialties
    if (typeof rating === 'number') patch.rating = rating
    if (typeof salesCount === 'number') patch.salesCount = salesCount
    if (typeof active === 'boolean') patch.active = active

    try {
      const updated = await convexClient.mutation('functions:updateAgent', { id, patch })
      return NextResponse.json({ success: true, data: updated })
    } catch (e: any) {
      if (e?.message?.includes('email')) {
        return NextResponse.json(
          { success: false, error: 'Ya existe un agente con ese email' },
          { status: 409 }
        )
      }
      if (e?.message?.includes('no encontrado')) {
        return NextResponse.json(
          { success: false, error: 'Agente no encontrado' },
          { status: 404 }
        )
      }
      throw e
    }
  } catch (error) {
    console.error('Error updating agent:', error)
    return NextResponse.json({ success: false, error: 'Failed to update agent' }, { status: 500 })
  }
}

// DELETE — delete an agent (unlink properties first)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await convexClient.mutation('functions:deleteAgent', { id })
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete agent' }, { status: 500 })
  }
}
