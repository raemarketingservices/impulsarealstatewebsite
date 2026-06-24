'use client'

import * as React from 'react'

interface SettingMap {
  [key: string]: { value: string; label: string; group: string }
}

/**
 * Hook to load settings from /api/settings and return a map.
 * Usage: const { get } = useSettings()
 *        get('hero_title') → returns the value string
 */
export function useSettings() {
  const [map, setMap] = React.useState<SettingMap>({})
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return
        if (d.map) setMap(d.map)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
    return () => { mounted = false }
  }, [])

  const get = React.useCallback((key: string, fallback: string = '') => {
    return map[key]?.value ?? fallback
  }, [map])

  return { get, map, loaded }
}
