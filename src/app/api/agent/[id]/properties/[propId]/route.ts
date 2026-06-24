import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type PropRouteParams = { params: Promise<{ id: string; propId: string }> }

// PUT: update a property owned by the agent
export async function PUT(
  request: NextRequest,
  { params }: PropRouteParams
) {
  try {
    const { id, propId } = await params
    const body = await request.json()

    // Verify the property belongs to this agent
    const existing = await db.property.findUnique({ where: { id: propId } })
    if (!existing || existing.agentId !== id) {
      return NextResponse.json(
        { success: false, error: 'Propiedad no encontrada para este agente' },
        { status: 404 }
      )
    }

    const {
      title,
      description,
      type,
      status,
      operation,
      price,
      currency,
      bedrooms,
      bathrooms,
      area,
      parking,
      location,
      city,
      zone,
      address,
      images,
      features,
      featured,
      videoUrl,
      published,
    } = body as Record<string, unknown>

    const data: Record<string, unknown> = {}
    if (typeof title === 'string') data.title = title
    if (typeof description === 'string') data.description = description
    if (typeof type === 'string' && type) data.type = type
    if (typeof status === 'string' && status) data.status = status
    if (typeof operation === 'string' && operation) data.operation = operation
    if (typeof price === 'number') data.price = price
    if (typeof currency === 'string' && currency) data.currency = currency
    if (typeof bedrooms === 'number') data.bedrooms = bedrooms
    if (typeof bathrooms === 'number') data.bathrooms = bathrooms
    if (typeof area === 'number') data.area = area
    if (typeof parking === 'number') data.parking = parking
    if (typeof location === 'string') data.location = location
    if (typeof city === 'string') data.city = city
    if (typeof zone === 'string') data.zone = zone
    if (typeof address === 'string') data.address = address
    if (typeof images === 'string') data.images = images
    else if (Array.isArray(images)) data.images = JSON.stringify(images)
    if (typeof features === 'string') data.features = features
    else if (Array.isArray(features)) data.features = JSON.stringify(features)
    if (typeof featured === 'boolean') data.featured = featured
    if (typeof videoUrl === 'string') data.videoUrl = videoUrl || null
    if (typeof published === 'boolean') data.published = published

    const updated = await db.property.update({
      where: { id: propId },
      data,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Error updating agent property:', error)
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    )
  }
}

// DELETE: remove a property owned by the agent
export async function DELETE(
  _request: NextRequest,
  { params }: PropRouteParams
) {
  try {
    const { id, propId } = await params

    const existing = await db.property.findUnique({ where: { id: propId } })
    if (!existing || existing.agentId !== id) {
      return NextResponse.json(
        { success: false, error: 'Propiedad no encontrada para este agente' },
        { status: 404 }
      )
    }

    await db.property.delete({ where: { id: propId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting agent property:', error)
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    )
  }
}
