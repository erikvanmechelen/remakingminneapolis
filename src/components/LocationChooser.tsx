import type { Deck } from '../lib/types'

interface Props {
  decks: Deck[]
  onSelect: (deckId: string) => void
}

export function LocationChooser({ decks, onSelect }: Props) {
  return (
    <section className="chooser" aria-label="Choose a Tangletown location">
      <div className="chooser__atmosphere" aria-hidden="true" />

      <header className="chooser__hero">
        <p className="chooser__brand">Remaking Minneapolis</p>
        <h1 className="chooser__title">Tangletown Decks</h1>
        <p className="chooser__lede">
          Full-bleed photo cards — tower, schools, church. Soft lore, giant
          wonder.
        </p>
      </header>

      <ul className="chooser__list">
        {decks.map((deck, i) => (
          <li key={deck.id} style={{ ['--i' as string]: i }}>
            <button
              type="button"
              className="chooser__card"
              onClick={() => onSelect(deck.id)}
            >
              <span
                className="chooser__thumb"
                style={{ backgroundImage: `url(${deck.coverImage})` }}
                aria-hidden="true"
              />
              <span className="chooser__meta">
                <span className="chooser__kicker">{deck.shortLabel}</span>
                <span className="chooser__name">{deck.title}</span>
                <span className="chooser__tagline">{deck.tagline}</span>
                <span className="chooser__count">
                  {deck.cards.length} cards
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
