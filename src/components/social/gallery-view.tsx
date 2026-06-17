'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Instagram as InstagramIcon,
  Heart,
  MessageCircle,
  CheckCircle2,
  Quote,
  Star,
  Facebook,
} from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

// ---------- Types ----------
type Platform = 'INSTAGRAM' | 'TIKTOK' | 'FACEBOOK'

interface SocialPost {
  id: string
  platform: Platform
  caption: string
  imageUrl: string
  postUrl?: string | null
  likes: number
  comments: number
  order: number
}

interface Testimonial {
  id: string
  clientName: string
  clientRole: string
  clientPhoto: string | null
  message: string
  rating: number
  property: string | null
  verified: boolean
  order: number
}

// ---------- Helpers ----------
function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.0', '')}K`
  return `${n}`
}

function platformConfig(p: Platform) {
  switch (p) {
    case 'INSTAGRAM':
      return {
        label: 'Instagram',
        Icon: InstagramIcon,
        badgeClass:
          'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white',
        ring: 'ring-[#dc2743]/40',
      }
    case 'TIKTOK':
      return {
        label: 'TikTok',
        Icon: TikTokIcon,
        badgeClass: 'bg-black text-white dark:bg-white dark:text-black',
        ring: 'ring-black/40',
      }
    case 'FACEBOOK':
      return {
        label: 'Facebook',
        Icon: Facebook,
        badgeClass: 'bg-[#1877F2] text-white',
        ring: 'ring-[#1877F2]/40',
      }
  }
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
    </svg>
  )
}

// ---------- Bento Spans ----------
// Pattern that fills a 4-col x 3-row grid cleanly:
// [ 0 0 1 2 ]
// [ 0 0 3 3 ]
// [ 4 5 6 7 ]
const BENTO_SPANS = [
  'col-span-2 row-span-2', // 0: hero (large)
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1', // 3: wide
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
]

// ---------- Bento Cell ----------
function BentoCell({ post, index }: { post: SocialPost; index: number }) {
  const cfg = platformConfig(post.platform)
  const span = BENTO_SPANS[index % BENTO_SPANS.length]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.06 }}
      className={`relative group overflow-hidden rounded-2xl bg-muted ${span}`}
    >
      <Image
        src={post.imageUrl}
        alt={post.caption}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Platform badge (always visible) */}
      <div
        className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.badgeClass} shadow-lg`}
      >
        <cfg.Icon className="h-3 w-3" />
        <span className="hidden sm:inline">{cfg.label}</span>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <p className="text-white text-xs sm:text-sm leading-relaxed line-clamp-3 mb-3">
          {post.caption}
        </p>
        <div className="flex items-center gap-4 text-white/90">
          <span className="flex items-center gap-1.5 text-xs font-medium">
            <Heart className="h-3.5 w-3.5 text-rose-400" fill="currentColor" />
            {formatCount(post.likes)}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-medium">
            <MessageCircle className="h-3.5 w-3.5 text-sky-300" />
            {formatCount(post.comments)}
          </span>
        </div>
      </div>

      {/* Always-visible minimal stats for hero cell */}
      {span.includes('row-span-2') && (
        <div className="absolute bottom-3 right-3 flex items-center gap-3 sm:hidden">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-white bg-black/50 backdrop-blur px-2 py-0.5 rounded-full">
            <Heart className="h-3 w-3 text-rose-400" fill="currentColor" />
            {formatCount(post.likes)}
          </span>
        </div>
      )}
    </motion.div>
  )
}

// ---------- Bento Skeleton ----------
function BentoSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[180px] gap-3 sm:gap-4">
      {BENTO_SPANS.map((span, i) => (
        <div key={i} className={`relative overflow-hidden rounded-2xl ${span}`}>
          <Skeleton className="h-full w-full" />
        </div>
      ))}
    </div>
  )
}

// ---------- Testimonial Card ----------
function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <Card className="relative h-full overflow-hidden border-border/50 hover:shadow-luxe transition-all duration-300 bg-card">
      {/* Quote decoration */}
      <div className="absolute top-4 right-4 text-gold/15 pointer-events-none">
        <Quote className="h-16 w-16" fill="currentColor" />
      </div>

      <div className="relative p-6 sm:p-7 flex flex-col h-full">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i <= t.rating ? 'text-gold' : 'text-muted-foreground/30'
              }`}
              fill="currentColor"
            />
          ))}
        </div>

        {/* Message */}
        <p className="text-sm sm:text-[15px] leading-relaxed text-foreground/90 flex-1 mb-5">
          &ldquo;{t.message}&rdquo;
        </p>

        {/* Footer */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/40">
          <div className="relative h-11 w-11 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-2 ring-gold/30">
            {t.clientPhoto ? (
              <Image
                src={t.clientPhoto}
                alt={t.clientName}
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-emerald flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
                {t.clientName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-display font-bold text-sm leading-tight">
                {t.clientName}
              </p>
              {t.verified && (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">{t.clientRole}</p>
            {t.property && (
              <p className="text-[11px] text-gold/80 mt-0.5 line-clamp-1">
                · {t.property}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

// ---------- Main View ----------
export function GalleryView() {
  const [posts, setPosts] = React.useState<SocialPost[]>([])
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([])
  const [loadingPosts, setLoadingPosts] = React.useState(true)
  const [loadingT, setLoadingT] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    fetch('/api/social')
      .then((r) => r.json())
      .then((d) => {
        if (mounted && d.success) setPosts(d.data)
      })
      .catch(() => {})
      .finally(() => mounted && setLoadingPosts(false))
    return () => {
      mounted = false
    }
  }, [])

  React.useEffect(() => {
    let mounted = true
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((d) => {
        if (mounted && d.success) setTestimonials(d.data)
      })
      .catch(() => {})
      .finally(() => mounted && setLoadingT(false))
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="w-full">
      {/* ============== SECTION A: BENTO GALLERY ============== */}
      <section className="relative pt-28 pb-16 lg:pt-32 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 lg:mb-12">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 mb-3"
              >
                <span className="h-px w-8 bg-gold" />
                <span className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">
                  Galería Social
                </span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
              >
                Inspiración <span className="text-gradient-gold">en cada post</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground mt-3 text-base lg:text-lg leading-relaxed"
              >
                Sigue nuestra comunidad y descubre las propiedades más exclusivas
                de República Dominicana en tiempo real.
              </motion.p>
            </div>

            {/* Platform legend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 flex-wrap"
            >
              <Badge className="bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white border-0">
                <InstagramIcon className="h-3 w-3 mr-1" /> Instagram
              </Badge>
              <Badge className="bg-black text-white dark:bg-white dark:text-black border-0">
                <TikTokIcon className="h-3 w-3 mr-1" /> TikTok
              </Badge>
              <Badge className="bg-[#1877F2] text-white border-0">
                <Facebook className="h-3 w-3 mr-1" /> Facebook
              </Badge>
            </motion.div>
          </div>

          {/* Bento grid */}
          {loadingPosts ? (
            <BentoSkeleton />
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Aún no hay publicaciones sociales disponibles.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] sm:auto-rows-[180px] lg:auto-rows-[200px] gap-3 sm:gap-4">
              {posts.map((post, i) => (
                <BentoCell key={post.id} post={post} index={i} />
              ))}
            </div>
          )}

          {/* Stats strip */}
          {!loadingPosts && posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
            >
              {[
                {
                  label: 'Posts totales',
                  value: posts.length,
                  Icon: InstagramIcon,
                  color: 'text-[#dc2743]',
                },
                {
                  label: 'Me gusta totales',
                  value: posts.reduce((a, p) => a + p.likes, 0),
                  Icon: Heart,
                  color: 'text-rose-500',
                },
                {
                  label: 'Comentarios',
                  value: posts.reduce((a, p) => a + p.comments, 0),
                  Icon: MessageCircle,
                  color: 'text-sky-500',
                },
                {
                  label: 'Plataformas',
                  value: new Set(posts.map((p) => p.platform)).size,
                  Icon: Star,
                  color: 'text-gold',
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="glass rounded-xl p-4 flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <s.Icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-lg sm:text-xl font-bold leading-none">
                      {formatCount(s.value)}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1 truncate">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ============== SECTION B: TESTIMONIALS ============== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 h-80 w-[60%] bg-gradient-to-l from-gold/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 h-80 w-[60%] bg-gradient-to-r from-primary/8 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-3"
            >
              <span className="h-px w-8 bg-gold" />
              <span className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">
                Testimonios Verificados
              </span>
              <span className="h-px w-8 bg-gold" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            >
              Lo que dicen <span className="text-gradient-gold">nuestros clientes</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground mt-3 text-base lg:text-lg leading-relaxed"
            >
              Historias reales de inversionistas y familias que confiaron en IMPULSA
              para hacer crecer su patrimonio inmobiliario.
            </motion.p>
          </div>

          {/* Carousel */}
          {loadingT ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 h-64">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Skeleton key={s} className="h-4 w-4 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-5/6 mb-2" />
                  <Skeleton className="h-3 w-3/4 mb-6" />
                  <div className="flex items-center gap-3 mt-auto">
                    <Skeleton className="h-11 w-11 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-2.5 w-1/2" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Aún no hay testimonios disponibles.
            </div>
          ) : (
            <Carousel
              opts={{ align: 'start', loop: testimonials.length > 3 }}
              className="w-full px-2"
            >
              <CarouselContent className="-ml-4">
                {testimonials.map((t, idx) => (
                  <CarouselItem
                    key={t.id}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                      className="h-full"
                    >
                      <TestimonialCard t={t} />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-2 lg:-left-4 shadow-luxe" />
              <CarouselNext className="hidden sm:flex -right-2 lg:-right-4 shadow-luxe" />
            </Carousel>
          )}

          {/* Trust badges */}
          {!loadingT && testimonials.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {testimonials.length} testimonios verificados
              </span>
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4 text-gold" fill="currentColor" />
                Calificación promedio{' '}
                {testimonials.length > 0
                  ? (
                      testimonials.reduce((a, t) => a + t.rating, 0) /
                      testimonials.length
                    ).toFixed(1)
                  : '5.0'}
                /5
              </span>
              <span className="flex items-center gap-2">
                <Quote className="h-4 w-4 text-gold" />
                100% clientes reales
              </span>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
