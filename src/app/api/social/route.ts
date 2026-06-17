import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const posts = await db.socialPost.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ success: true, data: posts })
  } catch (error) {
    console.error('Error fetching social posts:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch social posts' }, { status: 500 })
  }
}
