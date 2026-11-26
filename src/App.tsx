import { useEffect, useState } from 'react'
import { LocationChooser } from './components/LocationChooser'
import { Slideshow } from './components/Slideshow'
import type { Deck, DecksCollection } from './lib/types'
import './App.css'

export default function App() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/flashcard-decks.json')
      .then((r) => {
        if (!r.ok) throw new Error(`Could not load decks (${r.status})`)
        return r.json() as Promise<DecksCollection>
      })
      .then((data) => setDecks(data.decks))
      .catch((err: Error) => setError(err.message))
  }, [])

  const active = decks.find((d) => d.id === activeId) ?? null

  if (error) {
    return (
      <div className="app-shell app-shell--error">
        <p>{error}</p>
      </div>
    )
  }

  if (!decks.length) {
    return (
      <div className="app-shell app-shell--loading">
        <p>Opening the ridge…</p>
      </div>
    )
  }

  return (
    <div className="app-shell">
      {active ? (
        <Slideshow deck={active} onBack={() => setActiveId(null)} />
      ) : (
        <LocationChooser decks={decks} onSelect={setActiveId} />
      )}
    </div>
  )
}
