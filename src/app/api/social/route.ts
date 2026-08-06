import { NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

export async function GET() {
  try {
    const posts = await convexClient.query('functions:listSocialPosts')
    return NextResponse.json({ success: true, data: posts })
  } catch (error) {
    console.error('Error fetching social posts:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch social posts' }, { status: 500 })
  }
}
