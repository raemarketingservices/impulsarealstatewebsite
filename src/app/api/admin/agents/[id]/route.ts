import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

    // Verify agent exists
    const existing = await db.agent.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Agente no encontrado' }, { status: 404 })
    }

    // Check email uniqueness (if email is being changed)
    if (email && email !== existing.email) {
      const conflict = await db.agent.findFirst({ where: { email } })
      if (conflict) {
        return NextResponse.json(
          { success: false, error: 'Ya existe un agente con ese email' },
          { status: 409 }
        )
      }
    }

    // Build update payload — only update fields that were provided
    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (title !== undefined) updateData.title = title
    if (bio !== undefined) updateData.bio = bio
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl
    if (phone !== undefined) updateData.phone = phone
    if (email !== undefined) updateData.email = email
    if (password !== undefined && password !== '') updateData.password = password
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp
    if (instagram !== undefined) updateData.instagram = instagram
    if (tiktok !== undefined) updateData.tiktok = tiktok
    if (facebook !== undefined) updateData.facebook = facebook
    if (specialties !== undefined) updateData.specialties = specialties
    if (typeof rating === 'number') updateData.rating = rating
    if (typeof salesCount === 'number') updateData.salesCount = salesCount
    if (typeof active === 'boolean') updateData.active = active

    const updated = await db.agent.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: updated })
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

    const existing = await db.agent.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Agente no encontrado' }, { status: 404 })
    }

    // Unlink all properties by setting agentId to null
    await db.property.updateMany({
      where: { agentId: id },
      data: { agentId: null },
    })

    // Delete the agent
    await db.agent.delete({ where: { id } })

    return NextResponse.json({ success: true, data: { id } })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete agent' }, { status: 500 })
  }
}
