'use client'

import { Hero } from '@/components/home/hero'
import { FeaturedProperties } from '@/components/home/featured-properties'
import { VideoSection } from '@/components/home/video-section'
import { StatsBand } from '@/components/home/stats-band'
import { LeadCaptureForm } from '@/components/home/lead-capture-form'

export function HomeView() {
  return (
    <div className="w-full">
      <Hero />
      <FeaturedProperties />
      <VideoSection />
      <StatsBand />
      <section className="pt-14 pb-20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <LeadCaptureForm />
        </div>
      </section>
    </div>
  )
}
