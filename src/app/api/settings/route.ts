import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const settings = await db.setting.findMany({
      orderBy: { group: 'asc' },
    })
    // Convert to key-value map for easy frontend access
    const map: Record<string, { value: string; label: string; group: string }> = {}
    for (const s of settings) {
      map[s.key] = { value: s.value, label: s.label, group: s.group }
    }
    return NextResponse.json({ success: true, data: settings, map })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    // body: { key, value } or { updates: [{ key, value }, ...] }
    if (body.updates && Array.isArray(body.updates)) {
      const results = []
      for (const u of body.updates) {
        const updated = await db.setting.upsert({
          where: { key: u.key },
          update: { value: u.value },
          create: { key: u.key, value: u.value, label: u.label || u.key, group: u.group || 'general' },
        })
        results.push(updated)
      }
      return NextResponse.json({ success: true, data: results })
    }

    const { key, value } = body
    if (!key || value === undefined) {
      return NextResponse.json({ success: false, error: 'key and value required' }, { status: 400 })
    }
    const updated = await db.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value, label: key, group: 'general' },
    })
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 })
  }
}
