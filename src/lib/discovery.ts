const STORAGE_KEY = 'otc-tangletown-discovered-v1'

export function loadDiscovered(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as string[]
    return new Set(parsed)
  } catch {
    return new Set()
  }
}

export function saveDiscovered(ids: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

export function unlockSite(ids: Set<string>, siteId: string): Set<string> {
  if (ids.has(siteId)) return ids
  const next = new Set(ids)
  next.add(siteId)
  saveDiscovered(next)
  return next
}
