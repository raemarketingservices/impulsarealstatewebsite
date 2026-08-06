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

// GET /api/admin/properties — list ALL properties (including unpublished) with agent info
export async function GET() {
  try {
    const properties = await convexClient.query('functions:adminProperties')

    const data = properties.map((p: any) => ({
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

    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json({ success: false, error: 'El título es obligatorio' }, { status: 400 })
    }
    if (body.price === undefined || body.price === null || isNaN(Number(body.price))) {
      return NextResponse.json({ success: false, error: 'El precio es obligatorio' }, { status: 400 })
    }

    const created = await convexClient.mutation('functions:createProperty', { data: body })

    return NextResponse.json({
      success: true,
      data: {
        ...created,
        images: safeParseArray((created as any).images),
        features: safeParseArray((created as any).features),
      },
    })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json({ success: false, error: 'Failed to create property' }, { status: 500 })
  }
}
