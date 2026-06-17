import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const zone = searchParams.get('zone')
    const type = searchParams.get('type')
    const operation = searchParams.get('operation')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const featured = searchParams.get('featured')
    const city = searchParams.get('city')
    const q = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = { published: true }

    if (zone) where.zone = zone
    if (type) where.type = type
    if (operation) where.operation = operation
    if (city) where.city = { contains: city }
    if (featured === 'true') where.featured = true
    if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice)
      if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice)
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { location: { contains: q } },
        { city: { contains: q } },
      ]
    }

    const properties = await db.property.findMany({
      where,
      include: { agent: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    })

    return NextResponse.json({ success: true, data: properties, count: properties.length })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch properties' }, { status: 500 })
  }
}
