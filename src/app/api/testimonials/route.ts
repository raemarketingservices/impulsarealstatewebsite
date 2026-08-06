import { NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

export async function GET() {
  try {
    const testimonials = await convexClient.query('functions:listTestimonials')
    return NextResponse.json({ success: true, data: testimonials })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}
