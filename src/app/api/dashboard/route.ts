import { NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

export async function GET() {
  try {
    const data = await convexClient.query('functions:getDashboard')
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
