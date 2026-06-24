'use client'

import * as React from 'react'

interface SettingMap {
  [key: string]: { value: string; label: string; group: string }
}

// Global cache + version counter shared across all hook instances
let globalMap: SettingMap = {}
let globalVersion = 0
const listeners = new Set<() => void>()

/** Force all useSettings hooks to re-fetch from the API */
export function refreshSettings() {
  globalVersion++
  listeners.forEach((fn) => fn())
}

/**
 * Hook to load settings from /api/settings and return a map.
 * Usage: const { get } = useSettings()
 *        get('hero_title') → returns the value string
 *
 * Automatically refreshes when:
 * - refreshSettings() is called (e.g., after admin saves)
 * - Every 30 seconds (polling for real-time updates)
 */
export function useSettings() {
  const [map, setMap] = React.useState<SettingMap>(globalMap)
  const [loaded, setLoaded] = React.useState(false)
  const [version, setVersion] = React.useState(globalVersion)

  const fetchSettings = React.useCallback(() => {
    fetch('/api/settings?_=' + Date.now())
      .then((r) => r.json())
      .then((d) => {
        if (d.map) {
          globalMap = d.map
          setMap(d.map)
        }
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  // Initial load + subscribe to refresh events
  React.useEffect(() => {
    fetchSettings()

    // Subscribe to global refresh events
    const listener = () => {
      setVersion(globalVersion)
      fetchSettings()
    }
    listeners.add(listener)

    // Poll every 30 seconds for real-time updates
    const interval = setInterval(fetchSettings, 30000)

    return () => {
      listeners.delete(listener)
      clearInterval(interval)
    }
  }, [fetchSettings])

  // Re-fetch when version changes
  React.useEffect(() => {
    if (version > 0) fetchSettings()
  }, [version, fetchSettings])

  const get = React.useCallback((key: string, fallback: string = '') => {
    return map[key]?.value ?? fallback
  }, [map])

  return { get, map, loaded }
}
