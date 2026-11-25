import { useEffect, useMemo, useState } from 'react'
import { MapView } from './components/MapView'
import { SitePopup } from './components/SitePopup'
import { useNearMe } from './hooks/useNearMe'
import { loadDiscovered, unlockSite } from './lib/discovery'
import type { EraMode, SiteFeature, SitesCollection } from './lib/types'
import './App.css'

export default function App() {
  const [sites, setSites] = useState<SiteFeature[]>([])
  const [meta, setMeta] = useState<SitesCollection['meta'] | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [era, setEra] = useState<EraMode>('now')
  const [discovered, setDiscovered] = useState<Set<string>>(() => loadDiscovered())
  const [toast, setToast] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const near = useNearMe(sites)

  useEffect(() => {
    fetch('/data/tangletown-sites.json')
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load sites (${r.status})`)
        return r.json() as Promise<SitesCollection>
      })
      .then((data) => {
        setSites(data.features)
        setMeta(data.meta)
      })
      .catch((err: Error) => setLoadError(err.message))
  }, [])

  useEffect(() => {
    if (near.nearbyIds.length === 0) return
    let changed = discovered
    const newly: string[] = []
    for (const id of near.nearbyIds) {
      if (!changed.has(id)) {
        changed = unlockSite(changed, id)
        newly.push(id)
      }
    }
    if (newly.length) {
      setDiscovered(new Set(changed))
      const titles = newly
        .map((id) => sites.find((s) => s.id === id)?.properties.reward.title)
        .filter(Boolean)
      setToast(`Discovered: ${titles.join(' · ')}`)
    }
  }, [near.nearbyIds, sites, discovered])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 4200)
    return () => window.clearTimeout(t)
  }, [toast])

  const selected = useMemo(
    () => sites.find((s) => s.id === selectedId) ?? null,
    [sites, selectedId],
  )

  function selectSite(id: string) {
    setSelectedId(id)
    setEra('now')
  }

  function mockAtSelectedOrFirst() {
    const target =
      sites.find((s) => s.id === selectedId) ?? sites[0]
    if (!target) return
    const [lon, lat] = target.geometry.coordinates
    // Nudge ~40m so you land "near" the pin
    near.useMockAt(lon + 0.00035, lat + 0.0002)
    setToast(`Mock near-me at ${target.properties.shortLabel}`)
  }

  return (
    <div className="app-shell">
      <div className="atmosphere" aria-hidden="true" />

      <header className="brand-bar">
        <div className="brand-mark">
          <span className="brand-mark__sigil" aria-hidden="true" />
          <div>
            <p className="brand-kicker">Old Twin Cities</p>
            <h1>Tangletown</h1>
          </div>
        </div>
        <p className="brand-tag">
          Ridge lanterns, school lore, and a church whisper — free roam the sample
          map.
        </p>
      </header>

      <main className="map-frame">
        {loadError ? (
          <p className="load-error">{loadError}</p>
        ) : (
          <MapView
            sites={sites}
            selectedId={selectedId}
            discovered={discovered}
            nearbyIds={near.nearbyIds}
            userPosition={near.position}
            onSelect={selectSite}
          />
        )}

        <div className="hud">
          <div className="hud__progress" aria-live="polite">
            <span>
              {discovered.size}/{sites.length || 3} discovered
            </span>
            <ol>
              {sites.map((s) => (
                <li key={s.id} className={discovered.has(s.id) ? 'is-on' : ''}>
                  <button type="button" onClick={() => selectSite(s.id)}>
                    {s.properties.shortLabel}
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="hud__near">
            <button type="button" className="primary-btn" onClick={near.startLive}>
              {near.mode === 'live' || near.mode === 'locating'
                ? 'Near me · live'
                : 'Near me'}
            </button>
            <button type="button" className="ghost-btn" onClick={mockAtSelectedOrFirst}>
              Mock near pin
            </button>
            {(near.mode === 'mock' || near.mode === 'live') && (
              <button type="button" className="ghost-btn" onClick={near.clearMock}>
                Clear location
              </button>
            )}
            <p className="hud__status">
              {near.mode === 'idle' && 'Free roam anytime · unlock within ~150m'}
              {near.mode === 'locating' && 'Finding you…'}
              {near.mode === 'live' && 'Live location · Tangletown sites only'}
              {near.mode === 'mock' && 'Mock location (demo / non-HTTPS)'}
              {near.mode === 'denied' && (near.error ?? 'Location denied.')}
              {near.mode === 'unavailable' && (near.error ?? 'Location unavailable.')}
            </p>
          </div>
        </div>

        {selected && (
          <SitePopup
            site={selected}
            era={era}
            onEra={setEra}
            discovered={discovered.has(selected.id)}
            nearby={near.nearbyIds.includes(selected.id)}
            onClose={() => setSelectedId(null)}
          />
        )}

        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}
      </main>

      <footer className="site-footer">
        <p>
          Working data · Tangletown v1 sample. Immutable Millett LTC archive stays
          separate
          {meta ? ` (${meta.immutableArchive})` : ''}.
        </p>
      </footer>
    </div>
  )
}
