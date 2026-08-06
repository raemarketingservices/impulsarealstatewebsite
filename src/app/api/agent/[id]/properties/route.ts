import { NextRequest, NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

type AgentRouteParams = { params: Promise<{ id: string }> }

// GET: list ALL properties for this agent (including unpublished/drafts)
export async function GET(
  _request: NextRequest,
  { params }: AgentRouteParams
) {
  try {
    const { id } = await params

    const agent = await convexClient.query('functions:getAgentById', { id })
    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agente no encontrado' },
        { status: 404 }
      )
    }

    const properties = await convexClient.query('functions:getAgentProperties', { id })

    return NextResponse.json({ success: true, data: properties })
  } catch (error) {
    console.error('Error fetching agent properties:', error)
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    )
  }
}

// POST: create a new property assigned to this agent
export async function POST(
  request: NextRequest,
  { params }: AgentRouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()

    const agent = await convexClient.query('functions:getAgentById', { id })
    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agente no encontrado' },
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

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'El título es requerido' },
        { status: 400 }
      )
    }
    if (!price || typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { success: false, error: 'El precio debe ser mayor a 0' },
        { status: 400 }
      )
    }

    const created = await convexClient.mutation('functions:createProperty', {
      data: {
        title: String(title),
        description: typeof description === 'string' ? String(description) : '',
        type: typeof type === 'string' && type ? String(type) : 'HOUSE',
        status: typeof status === 'string' && status ? String(status) : 'FOR_SALE',
        operation: typeof operation === 'string' && operation ? String(operation) : 'SALE',
        price: Number(price),
        currency: typeof currency === 'string' && currency ? String(currency) : 'USD',
        bedrooms: Number(bedrooms ?? 0),
        bathrooms: Number(bathrooms ?? 0),
        area: Number(area ?? 0),
        parking: Number(parking ?? 0),
        location: typeof location === 'string' ? String(location) : '',
        city: typeof city === 'string' ? String(city) : '',
        zone: typeof zone === 'string' ? String(zone) : '',
        address: typeof address === 'string' ? String(address) : null,
        images: typeof images === 'string'
          ? String(images)
          : Array.isArray(images)
            ? images
            : [],
        features: typeof features === 'string'
          ? String(features)
          : Array.isArray(features)
            ? features
            : [],
        featured: Boolean(featured ?? false),
        videoUrl: typeof videoUrl === 'string' && videoUrl ? String(videoUrl) : null,
        published: Boolean(published ?? true),
        agentId: id,
      },
    })

    return NextResponse.json({ success: true, data: created }, { status: 201 })
  } catch (error) {
    console.error('Error creating agent property:', error)
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    )
  }
}
