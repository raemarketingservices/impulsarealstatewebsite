import { NextRequest, NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const args: Record<string, string> = {}
    for (const key of ['zone', 'type', 'operation', 'minPrice', 'maxPrice', 'bedrooms', 'featured', 'city', 'q', 'limit']) {
      const v = searchParams.get(key)
      if (v) args[key] = v
    }

    const properties = await convexClient.query('functions:listProperties', args)

    return NextResponse.json({ success: true, data: properties, count: properties.length })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch properties' }, { status: 500 })
  }
}
