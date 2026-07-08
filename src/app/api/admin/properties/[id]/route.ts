import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function safeParseArray(raw: string | null | undefined): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

// PUT /api/admin/properties/[id] — partial update
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.property.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Propiedad no encontrada' }, { status: 404 })
    }

    // Build update payload — only allowed fields
    const update: Record<string, unknown> = {}

    if (typeof body.title === 'string' && body.title.trim()) update.title = body.title.trim()
    if (typeof body.description === 'string') update.description = body.description
    if (typeof body.type === 'string' && body.type) update.type = body.type
    if (typeof body.status === 'string' && body.status) update.status = body.status
    if (typeof body.operation === 'string' && body.operation) update.operation = body.operation
    if (body.price !== undefined && body.price !== null && !isNaN(Number(body.price))) update.price = Number(body.price)
    if (typeof body.currency === 'string' && body.currency) update.currency = body.currency
    if (body.bedrooms !== undefined && body.bedrooms !== null && !isNaN(Number(body.bedrooms))) update.bedrooms = Number(body.bedrooms)
    if (body.bathrooms !== undefined && body.bathrooms !== null && !isNaN(Number(body.bathrooms))) update.bathrooms = Number(body.bathrooms)
    if (body.area !== undefined && body.area !== null && !isNaN(Number(body.area))) update.area = Number(body.area)
    if (body.parking !== undefined && body.parking !== null && !isNaN(Number(body.parking))) update.parking = Number(body.parking)
    if (typeof body.location === 'string') update.location = body.location
    if (typeof body.city === 'string') update.city = body.city
    if (typeof body.zone === 'string') update.zone = body.zone
    if (typeof body.address === 'string') update.address = body.address || null
    if (body.lat !== undefined && body.lat !== null && body.lat !== '' && !isNaN(Number(body.lat))) update.lat = Number(body.lat)
    if (body.lng !== undefined && body.lng !== null && body.lng !== '' && !isNaN(Number(body.lng))) update.lng = Number(body.lng)
    if (Array.isArray(body.images)) update.images = JSON.stringify(body.images.filter(Boolean).map(String))
    if (Array.isArray(body.features)) update.features = JSON.stringify(body.features.filter(Boolean).map(String))
    if (typeof body.featured === 'boolean') update.featured = body.featured
    if (typeof body.published === 'boolean') update.published = body.published
    if (typeof body.videoUrl === 'string') update.videoUrl = body.videoUrl || null
    if (body.agentId !== undefined) {
      update.agentId = body.agentId && body.agentId !== 'none' && body.agentId !== '' ? String(body.agentId) : null
    }

    const updated = await db.property.update({
      where: { id },
      data: update,
      include: {
        agent: {
          select: { id: true, name: true, title: true, photoUrl: true, email: true, phone: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        images: safeParseArray(updated.images),
        features: safeParseArray(updated.features),
      },
    })
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json({ success: false, error: 'Failed to update property' }, { status: 500 })
  }
}

// DELETE /api/admin/properties/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await db.property.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Propiedad no encontrada' }, { status: 404 })
    }

    await db.property.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Propiedad eliminada' })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete property' }, { status: 500 })
  }
}
