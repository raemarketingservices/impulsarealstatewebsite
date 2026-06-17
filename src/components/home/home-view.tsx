'use client'

import { Hero } from '@/components/home/hero'
import { FeaturedProperties } from '@/components/home/featured-properties'
import { VideoSection } from '@/components/home/video-section'
import { StatsBand } from '@/components/home/stats-band'

export function HomeView() {
  return (
    <div className="w-full">
      <Hero />
      <FeaturedProperties />
      <VideoSection />
      <StatsBand />
    </div>
  )
}
