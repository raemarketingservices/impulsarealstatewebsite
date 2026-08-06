import { NextRequest, NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

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
    const existing = await convexClient.query('functions:getPropertyById', { id: propId })
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

    const patch: Record<string, unknown> = {}
    if (typeof title === 'string') patch.title = title
    if (typeof description === 'string') patch.description = description
    if (typeof type === 'string' && type) patch.type = type
    if (typeof status === 'string' && status) patch.status = status
    if (typeof operation === 'string' && operation) patch.operation = operation
    if (typeof price === 'number') patch.price = price
    if (typeof currency === 'string' && currency) patch.currency = currency
    if (typeof bedrooms === 'number') patch.bedrooms = bedrooms
    if (typeof bathrooms === 'number') patch.bathrooms = bathrooms
    if (typeof area === 'number') patch.area = area
    if (typeof parking === 'number') patch.parking = parking
    if (typeof location === 'string') patch.location = location
    if (typeof city === 'string') patch.city = city
    if (typeof zone === 'string') patch.zone = zone
    if (typeof address === 'string') patch.address = address
    if (typeof images === 'string') patch.images = images
    else if (Array.isArray(images)) patch.images = images
    if (typeof features === 'string') patch.features = features
    else if (Array.isArray(features)) patch.features = features
    if (typeof featured === 'boolean') patch.featured = featured
    if (typeof videoUrl === 'string') patch.videoUrl = videoUrl || null
    if (typeof published === 'boolean') patch.published = published

    const updated = await convexClient.mutation('functions:updateProperty', { id: propId, patch })

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

    const existing = await convexClient.query('functions:getPropertyById', { id: propId })
    if (!existing || existing.agentId !== id) {
      return NextResponse.json(
        { success: false, error: 'Propiedad no encontrada para este agente' },
        { status: 404 }
      )
    }

    await convexClient.mutation('functions:deleteProperty', { id: propId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting agent property:', error)
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    )
  }
}
