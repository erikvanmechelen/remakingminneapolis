export type SiteIcon = 'tower' | 'dome' | 'pinnacle'
export type SiteStatus = 'surviving' | 'altered' | 'razed' | 'lore'

export interface ThenNowPanel {
  label: string
  caption: string
  placeholder: string
}

export interface SiteReward {
  id: string
  title: string
  detail: string
}

export interface SiteProvenance {
  sourceKind: 'working-new' | 'working-from-millett' | 'archive-only'
  millettMatch: string | null
  millettNote: string
  geocode: Record<string, unknown>
  attribution: string
}

export interface SiteProperties {
  slug: string
  title: string
  shortLabel: string
  icon: SiteIcon
  address: string
  neighborhood: string
  status: SiteStatus
  dates: string
  architect: string
  blurb: string
  story: {
    hook: string
    body: string
    wonder: string
  }
  thenNow: {
    then: ThenNowPanel
    now: ThenNowPanel
  }
  discoveryRadiusM: number
  reward: SiteReward
  provenance: SiteProvenance
  relatedCoords?: Record<string, [number, number]>
}

export interface SiteFeature {
  type: 'Feature'
  id: string
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: SiteProperties
}

export interface SitesCollection {
  type: 'FeatureCollection'
  name: string
  neighborhood: string
  city: string
  features: SiteFeature[]
  meta: {
    dataset: string
    immutableArchive: string
    notes: string
  }
}

export type EraMode = 'then' | 'now'
