import { NextRequest, NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

export async function GET() {
  try {
    const result = await convexClient.query('functions:listSettings')
    const settings = result.data
    const map = result.map
    return NextResponse.json({ success: true, data: settings, map })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    if (body.updates && Array.isArray(body.updates)) {
      const results = await convexClient.mutation('functions:upsertSettings', { updates: body.updates })
      return NextResponse.json({ success: true, data: results })
    }

    const { key, value, label, group } = body
    if (!key || value === undefined) {
      return NextResponse.json({ success: false, error: 'key and value required' }, { status: 400 })
    }
    const updated = await convexClient.mutation('functions:upsertSettings', { key, value, label, group })
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 })
  }
}
