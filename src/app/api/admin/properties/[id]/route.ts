import { NextRequest, NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

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

    const patch: Record<string, unknown> = {}

    if (typeof body.title === 'string' && body.title.trim()) patch.title = body.title.trim()
    if (typeof body.description === 'string') patch.description = body.description
    if (typeof body.type === 'string' && body.type) patch.type = body.type
    if (typeof body.status === 'string' && body.status) patch.status = body.status
    if (typeof body.operation === 'string' && body.operation) patch.operation = body.operation
    if (body.price !== undefined && body.price !== null && !isNaN(Number(body.price))) patch.price = Number(body.price)
    if (typeof body.currency === 'string' && body.currency) patch.currency = body.currency
    if (body.bedrooms !== undefined && body.bedrooms !== null && !isNaN(Number(body.bedrooms))) patch.bedrooms = Number(body.bedrooms)
    if (body.bathrooms !== undefined && body.bathrooms !== null && !isNaN(Number(body.bathrooms))) patch.bathrooms = Number(body.bathrooms)
    if (body.area !== undefined && body.area !== null && !isNaN(Number(body.area))) patch.area = Number(body.area)
    if (body.parking !== undefined && body.parking !== null && !isNaN(Number(body.parking))) patch.parking = Number(body.parking)
    if (typeof body.location === 'string') patch.location = body.location
    if (typeof body.city === 'string') patch.city = body.city
    if (typeof body.zone === 'string') patch.zone = body.zone
    if (typeof body.address === 'string') patch.address = body.address || null
    if (body.lat !== undefined && body.lat !== null && body.lat !== '' && !isNaN(Number(body.lat))) patch.lat = Number(body.lat)
    if (body.lng !== undefined && body.lng !== null && body.lng !== '' && !isNaN(Number(body.lng))) patch.lng = Number(body.lng)
    if (Array.isArray(body.images)) patch.images = body.images.filter(Boolean).map(String)
    if (Array.isArray(body.features)) patch.features = body.features.filter(Boolean).map(String)
    if (typeof body.featured === 'boolean') patch.featured = body.featured
    if (typeof body.published === 'boolean') patch.published = body.published
    if (typeof body.videoUrl === 'string') patch.videoUrl = body.videoUrl || null
    if (body.agentId !== undefined) {
      patch.agentId = body.agentId && body.agentId !== 'none' && body.agentId !== '' ? String(body.agentId) : null
    }

    const updated = await convexClient.mutation('functions:updateProperty', { id, patch })

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        images: safeParseArray((updated as any).images),
        features: safeParseArray((updated as any).features),
      },
    })
  } catch (error: any) {
    if (error?.message?.includes('no encontrada')) {
      return NextResponse.json({ success: false, error: 'Propiedad no encontrada' }, { status: 404 })
    }
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
    const result = await convexClient.mutation('functions:deleteProperty', { id })
    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    if (error?.message?.includes('no encontrada')) {
      return NextResponse.json({ success: false, error: 'Propiedad no encontrada' }, { status: 404 })
    }
    console.error('Error deleting property:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete property' }, { status: 500 })
  }
}
