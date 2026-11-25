import { useEffect, useRef } from 'react'
import {
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  AttributionControl,
} from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { SiteFeature } from '../lib/types'
import { TANGLETOWN_CENTER, DEFAULT_ZOOM } from '../lib/geo'
import { markerHtml } from './SiteMarker'

interface Props {
  sites: SiteFeature[]
  selectedId: string | null
  discovered: Set<string>
  nearbyIds: string[]
  userPosition: { lon: number; lat: number } | null
  onSelect: (id: string) => void
}

export function MapView({
  sites,
  selectedId,
  discovered,
  nearbyIds,
  userPosition,
  onSelect,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markersRef = useRef<MapMarkers | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new MapLibreMap({
      container: containerRef.current,
      // Free vector style (no API key). OpenFreeMap — OSM data.
      style: 'https://tiles.openfreemap.org/styles/dark',
      center: TANGLETOWN_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: 48,
      bearing: -18,
      maxBounds: [
        [-93.305, 44.895],
        [-93.255, 44.93],
      ],
      attributionControl: false,
    })

    map.addControl(
      new NavigationControl({ visualizePitch: true }),
      'bottom-right',
    )
    map.addControl(new AttributionControl({ compact: true }), 'bottom-left')

    mapRef.current = map
    markersRef.current = new MapMarkers(map, onSelectRef)

    return () => {
      markersRef.current?.destroy()
      markersRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    markersRef.current?.syncSites(sites, selectedId, discovered, nearbyIds)
  }, [sites, selectedId, discovered, nearbyIds])

  useEffect(() => {
    markersRef.current?.syncUser(userPosition)
  }, [userPosition])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedId) return
    const site = sites.find((s) => s.id === selectedId)
    if (!site) return
    const [lon, lat] = site.geometry.coordinates
    map.easeTo({
      center: [lon, lat],
      offset: [0, -80],
      duration: 700,
      pitch: 52,
    })
  }, [selectedId, sites])

  return (
    <div className="map-stage" ref={containerRef} aria-label="Tangletown map" />
  )
}

class MapMarkers {
  private siteMarkers = new globalThis.Map<string, Marker>()
  private userMarker: Marker | null = null
  private map: MapLibreMap
  private onSelectRef: { current: (id: string) => void }

  constructor(
    map: MapLibreMap,
    onSelectRef: { current: (id: string) => void },
  ) {
    this.map = map
    this.onSelectRef = onSelectRef
  }

  syncSites(
    sites: SiteFeature[],
    selectedId: string | null,
    discovered: Set<string>,
    nearbyIds: string[],
  ) {
    const nearby = new Set(nearbyIds)
    const keep = new Set(sites.map((s) => s.id))

    for (const [id, marker] of this.siteMarkers) {
      if (!keep.has(id)) {
        marker.remove()
        this.siteMarkers.delete(id)
      }
    }

    for (const site of sites) {
      const [lon, lat] = site.geometry.coordinates
      const html = markerHtml({
        icon: site.properties.icon,
        label: site.properties.shortLabel,
        discovered: discovered.has(site.id),
        nearby: nearby.has(site.id),
        selected: selectedId === site.id,
      })

      let marker = this.siteMarkers.get(site.id)
      if (!marker) {
        const el = document.createElement('div')
        el.className = 'site-marker-wrap'
        el.innerHTML = html
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          this.onSelectRef.current(site.id)
        })
        marker = new Marker({ element: el, anchor: 'bottom' })
          .setLngLat([lon, lat])
          .addTo(this.map)
        this.siteMarkers.set(site.id, marker)
      } else {
        const el = marker.getElement()
        el.innerHTML = html
        marker.setLngLat([lon, lat])
      }
    }
  }

  syncUser(pos: { lon: number; lat: number } | null) {
    if (!pos) {
      this.userMarker?.remove()
      this.userMarker = null
      return
    }
    if (!this.userMarker) {
      const el = document.createElement('div')
      el.className = 'you-are-here'
      el.innerHTML = '<span></span>'
      this.userMarker = new Marker({ element: el, anchor: 'center' })
        .setLngLat([pos.lon, pos.lat])
        .addTo(this.map)
    } else {
      this.userMarker.setLngLat([pos.lon, pos.lat])
    }
  }

  destroy() {
    for (const marker of this.siteMarkers.values()) marker.remove()
    this.siteMarkers.clear()
    this.userMarker?.remove()
    this.userMarker = null
  }
}
