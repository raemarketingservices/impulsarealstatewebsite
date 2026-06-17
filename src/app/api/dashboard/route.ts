import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Aggregate platform stats for dashboard
    const totalProperties = await db.property.count({ where: { published: true } })
    const totalAgents = await db.agent.count({ where: { active: true } })
    const soldProperties = await db.property.count({ where: { status: 'SOLD' } })
    const featuredProperties = await db.property.count({ where: { featured: true } })

    // Sample goals for demo dashboard
    const goals = await db.goal.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    })

    // Sample properties for dashboard "my properties"
    const myProperties = await db.property.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { agent: true },
    })

    // Compute aggregate portfolio value
    const portfolioValue = await db.property.aggregate({
      _sum: { price: true },
    })

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalProperties,
          totalAgents,
          soldProperties,
          featuredProperties,
          portfolioValue: portfolioValue._sum.price || 0,
        },
        goals,
        myProperties,
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
