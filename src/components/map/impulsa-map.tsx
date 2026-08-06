'use client'

import * as React from 'react'
import type Leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface MapMarkerData {
  id?: string
  lat: number
  lng: number
  title?: string
  price?: number
  currency?: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function priceLabel(price?: number, currency?: string) {
  if (typeof price !== 'number') return ''
  const symbol = currency === 'DOP' ? 'RD$' : currency === 'EUR' ? '€' : 'US$'
  if (price >= 1_000_000) return `${symbol}${(price / 1_000_000).toFixed(2)}M`
  if (price >= 1_000) return `${symbol}${(price / 1_000).toFixed(0)}K`
  return `${symbol}${price.toLocaleString()}`
}

const GOLD_PIN_HTML = `
<div style="position:relative;width:34px;height:46px;filter:drop-shadow(0 4px 6px rgba(0,0,0,.35));">
  <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:30px;height:32px;background:linear-gradient(160deg,#f5d67a 0%,#d4a62a 45%,#a97f18 100%);border:2px solid #8a6a15;border-radius:50% 50% 50% 50%;box-sizing:border-box;display:flex;align-items:center;justify-content:center;">
    <span style="color:#12233b;font-weight:900;font-size:15px;font-family:ui-sans-serif, system-ui, sans-serif;">I</span>
  </div>
  <div style="position:absolute;bottom:2px;left:50%;transform:translateX(-50%);color:#8a6a15;font-size:12px;line-height:1;">▼</div>
</div>`

const ZONE_PIN_HTML = `
<div style="position:relative;width:34px;height:46px;filter:drop-shadow(0 4px 6px rgba(0,0,0,.35));">
  <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:30px;height:32px;background:linear-gradient(160deg,#6ee7a0 0%,#2c9e5a 45%,#1d7a44 100%);border:2px solid #0f5230;border-radius:50% 50% 50% 50%;box-sizing:border-box;display:flex;align-items:center;justify-content:center;">
    <span style="color:#0b2b1a;font-weight:900;font-size:13px;font-family:ui-sans-serif, system-ui, sans-serif;">Z</span>
  </div>
  <div style="position:absolute;bottom:2px;left:50%;transform:translateX(-50%);color:#0f5230;font-size:12px;line-height:1;">▼</div>
</div>`

function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

export interface ImpulsaMapProps {
  center?: [number, number]
  zoom?: number
  markers?: MapMarkerData[]
  onPick?: (lat: number, lng: number) => void
  picked?: { lat: number; lng: number } | null
  showProperties?: boolean
  className?: string
  heightClass?: string
}

export function ImpulsaMap({
  center = [18.4861, -69.9312],
  zoom = 13,
  markers = [],
  onPick,
  picked = null,
  showProperties = true,
  className,
  heightClass = 'h-[320px]',
}: ImpulsaMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const leafletRef = React.useRef<typeof Leaflet | null>(null)
  const mapRef = React.useRef<Leaflet.Map | null>(null)
  const markerLayerRef = React.useRef<Leaflet.LayerGroup | null>(null)
  const onPickRef = React.useRef(onPick)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    onPickRef.current = onPick
  }, [onPick])

  const markersKey = JSON.stringify(
    showProperties ? markers.map((m) => [m.lat, m.lng, m.title, m.price, m.currency]) : []
  )
  const pickedKey = JSON.stringify(picked)

  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    let cancelled = false
    let currentMap: Leaflet.Map | null = null

    import('leaflet').then((mod) => {
      if (cancelled) return
      const Lv = (mod.default ?? mod) as typeof Leaflet
      leafletRef.current = Lv
      if (!containerRef.current) return

      const map = Lv.map(containerRef.current, {
        center,
        zoom,
        scrollWheelZoom: true,
        attributionControl: true,
      })
      currentMap = map
      mapRef.current = map

      Lv.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      markerLayerRef.current = Lv.layerGroup().addTo(map)

      if (onPickRef.current) {
        map.on('click', (e: Leaflet.LeafletMouseEvent) => {
          onPickRef.current?.(e.latlng.lat, e.latlng.lng)
        })
      }

      setReady(true)
    })

    return () => {
      cancelled = true
      if (currentMap) currentMap.remove()
      mapRef.current = null
      markerLayerRef.current = null
      leafletRef.current = null
      setReady(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once with initial center/zoom
  }, [])

  React.useEffect(() => {
    const Lv = leafletRef.current
    if (!Lv || !mapRef.current || !markerLayerRef.current) return
    markerLayerRef.current.clearLayers()

    if (showProperties) {
      markers.forEach((m) => {
        if (typeof m.lat !== 'number' || typeof m.lng !== 'number') return
        const icon = Lv.divIcon({
          className: '',
          html: GOLD_PIN_HTML,
          iconSize: [34, 46],
          iconAnchor: [17, 44],
          popupAnchor: [0, -40],
        })
        const marker = Lv.marker([m.lat, m.lng], { icon })
        if (m.title) {
          const priceText = m.price ? ` · <b>${priceLabel(m.price, m.currency)}</b>` : ''
          marker.bindPopup(`<b>${escapeHtml(m.title)}</b>${priceText}`)
        }
        marker.addTo(markerLayerRef.current!)
      })
    }

    if (picked) {
      const icon = Lv.divIcon({
        className: '',
        html: ZONE_PIN_HTML,
        iconSize: [34, 46],
        iconAnchor: [17, 44],
        popupAnchor: [0, -40],
      })
      const marker = Lv.marker([picked.lat, picked.lng], { icon })
      marker.bindPopup('<b>Zona de interés</b>')
      marker.addTo(markerLayerRef.current!)
    }
  }, [ready, markersKey, showProperties, pickedKey, picked])

  return (
    <div className={cn('relative overflow-hidden rounded-xl border border-border/60', heightClass, className)}>
      <div ref={containerRef} className="absolute inset-0 z-0" />
      {onPick && (
        <div className="pointer-events-none absolute bottom-2 left-2 z-[500] rounded-md border border-border/60 bg-background/90 px-2.5 py-1 text-[11px] text-muted-foreground shadow-sm">
          Haz clic en el mapa para marcar la ubicación
        </div>
      )}
    </div>
  )
}