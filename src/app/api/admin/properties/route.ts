import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/properties — list ALL properties (including unpublished) with agent info
export async function GET() {
  try {
    const properties = await db.property.findMany({
      include: {
        agent: {
          select: { id: true, name: true, title: true, photoUrl: true, email: true, phone: true },
        },
      },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })

    // Parse JSON fields for client convenience
    const data = properties.map((p) => ({
      ...p,
      images: safeParseArray(p.images),
      features: safeParseArray(p.features),
    }))

    return NextResponse.json({ success: true, data, count: data.length })
  } catch (error) {
    console.error('Error fetching admin properties:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch properties' }, { status: 500 })
  }
}

// POST /api/admin/properties — create a new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Required fields validation
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json({ success: false, error: 'El título es obligatorio' }, { status: 400 })
    }
    if (body.price === undefined || body.price === null || isNaN(Number(body.price))) {
      return NextResponse.json({ success: false, error: 'El precio es obligatorio' }, { status: 400 })
    }

    const data = {
      title: String(body.title).trim(),
      description: String(body.description || '').trim(),
      type: String(body.type || 'APARTMENT'),
      status: String(body.status || 'FOR_SALE'),
      operation: String(body.operation || 'SALE'),
      price: Number(body.price),
      currency: String(body.currency || 'USD'),
      bedrooms: Number(body.bedrooms ?? 0),
      bathrooms: Number(body.bathrooms ?? 0),
      area: Number(body.area ?? 0),
      parking: Number(body.parking ?? 0),
      location: String(body.location || '').trim(),
      city: String(body.city || '').trim(),
      zone: String(body.zone || 'Nacional'),
      address: body.address ? String(body.address) : null,
      lat: body.lat !== undefined && body.lat !== null && body.lat !== '' ? Number(body.lat) : null,
      lng: body.lng !== undefined && body.lng !== null && body.lng !== '' ? Number(body.lng) : null,
      images: JSON.stringify(Array.isArray(body.images) ? body.images.filter(Boolean).map(String) : []),
      features: JSON.stringify(Array.isArray(body.features) ? body.features.filter(Boolean).map(String) : []),
      featured: Boolean(body.featured),
      videoUrl: body.videoUrl ? String(body.videoUrl) : null,
      published: body.published !== undefined ? Boolean(body.published) : true,
      agentId: body.agentId && body.agentId !== 'none' && body.agentId !== '' ? String(body.agentId) : null,
    }

    const property = await db.property.create({ data })

    return NextResponse.json({
      success: true,
      data: {
        ...property,
        images: safeParseArray(property.images),
        features: safeParseArray(property.features),
      },
    })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json({ success: false, error: 'Failed to create property' }, { status: 500 })
  }
}

function safeParseArray(raw: string | null | undefined): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}
