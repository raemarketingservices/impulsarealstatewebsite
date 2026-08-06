import { NextRequest, NextResponse } from 'next/server'
import { convexClient } from '@/lib/convex'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, agentId, note, noteBy } = body as {
      status?: string
      agentId?: string | null
      note?: string
      noteBy?: string
    }

    let data
    if (note !== undefined && note !== null && note.trim()) {
      data = await convexClient.mutation('functions:addLeadNote', {
        id,
        text: note,
        by: noteBy || 'admin',
      })
    }
    if (status !== undefined || agentId !== undefined) {
      const patch: Record<string, unknown> = {}
      if (status !== undefined) patch.status = status
      if (agentId !== undefined) patch.agentId = agentId
      data = await convexClient.mutation('functions:updateLead', { id, patch })
    }

    if (!data) {
      return NextResponse.json({ success: false, error: 'Sin cambios' }, { status: 400 })
    }
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ success: false, error: 'Error del servidor' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await convexClient.mutation('functions:deleteLead', { id })
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json({ success: false, error: 'Error del servidor' }, { status: 500 })
  }
}
