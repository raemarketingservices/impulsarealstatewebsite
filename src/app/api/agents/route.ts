import { NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

export async function GET() {
  try {
    const agents = await convexClient.query('functions:getPublicAgents')
    return NextResponse.json({ success: true, data: agents })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch agents' }, { status: 500 })
  }
}
