import { useEffect, useRef, useState } from 'react'
import type { SiteFeature } from '../lib/types'
import { distanceMeters, NEAR_ME_DEFAULT_M } from '../lib/geo'

export type GeoMode = 'idle' | 'locating' | 'live' | 'denied' | 'unavailable' | 'mock'

export interface NearMeState {
  mode: GeoMode
  position: { lon: number; lat: number } | null
  nearbyIds: string[]
  error: string | null
  startLive: () => void
  useMockAt: (lon: number, lat: number) => void
  clearMock: () => void
}

export function useNearMe(sites: SiteFeature[]): NearMeState {
  const [mode, setMode] = useState<GeoMode>('idle')
  const [position, setPosition] = useState<{ lon: number; lat: number } | null>(
    null,
  )
  const [error, setError] = useState<string | null>(null)
  const watchId = useRef<number | null>(null)

  const nearbyIds = (() => {
    if (!position) return [] as string[]
    return sites
      .filter((s) => {
        const [lon, lat] = s.geometry.coordinates
        const radius = s.properties.discoveryRadiusM ?? NEAR_ME_DEFAULT_M
        return (
          distanceMeters(position.lon, position.lat, lon, lat) <= radius
        )
      })
      .map((s) => s.id)
  })()

  function clearWatch() {
    if (watchId.current != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId.current)
      watchId.current = null
    }
  }

  function startLive() {
    if (!navigator.geolocation) {
      setMode('unavailable')
      setError('Geolocation not available — try Mock near-me.')
      return
    }
    clearWatch()
    setMode('locating')
    setError(null)
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lon: pos.coords.longitude, lat: pos.coords.latitude })
        setMode('live')
      },
      (err) => {
        setMode(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable')
        setError(err.message || 'Location failed — use Mock near-me for demo.')
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 12000 },
    )
  }

  function useMockAt(lon: number, lat: number) {
    clearWatch()
    setPosition({ lon, lat })
    setMode('mock')
    setError(null)
  }

  function clearMock() {
    clearWatch()
    setPosition(null)
    setMode('idle')
    setError(null)
  }

  useEffect(() => () => clearWatch(), [])

  return { mode, position, nearbyIds, error, startLive, useMockAt, clearMock }
}
