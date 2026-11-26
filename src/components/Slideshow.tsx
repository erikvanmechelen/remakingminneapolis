import { useEffect, useRef, useState, type TouchEvent } from 'react'
import type { Deck } from '../lib/types'

interface Props {
  deck: Deck
  onBack: () => void
}

export function Slideshow({ deck, onBack }: Props) {
  const [index, setIndex] = useState(0)
  const [entering, setEntering] = useState(true)
  const touchStartX = useRef<number | null>(null)
  const total = deck.cards.length
  const card = deck.cards[index]

  function go(delta: number) {
    setEntering(false)
    window.setTimeout(() => {
      setIndex((i) => {
        const next = i + delta
        if (next < 0) return total - 1
        if (next >= total) return 0
        return next
      })
      setEntering(true)
    }, 120)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'Escape') {
        onBack()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function onTouchStart(e: TouchEvent) {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null
  }

  function onTouchEnd(e: TouchEvent) {
    const start = touchStartX.current
    touchStartX.current = null
    if (start == null) return
    const end = e.changedTouches[0]?.clientX ?? start
    const dx = end - start
    if (Math.abs(dx) < 48) {
      // tap right half → next, left half → prev
      const x = e.changedTouches[0]?.clientX ?? 0
      const mid = window.innerWidth / 2
      go(x >= mid ? 1 : -1)
      return
    }
    go(dx < 0 ? 1 : -1)
  }

  if (!card) return null

  return (
    <section
      className="slideshow"
      aria-label={`${deck.title} slideshow`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className={`slideshow__photo ${entering ? 'is-in' : 'is-out'}`}
        style={{ backgroundImage: `url(${card.image})` }}
        role="img"
        aria-label={card.caption}
      />
      <div className="slideshow__veil" aria-hidden="true" />

      <header className="slideshow__top">
        <button type="button" className="slideshow__back" onClick={onBack}>
          ← Decks
        </button>
        <p className="slideshow__deck-title">{deck.shortLabel}</p>
        <p className="slideshow__progress" aria-live="polite">
          {index + 1} / {total}
        </p>
      </header>

      <div className="slideshow__dots" aria-hidden="true">
        {deck.cards.map((c, i) => (
          <button
            key={c.id}
            type="button"
            className={`slideshow__dot ${i === index ? 'is-active' : ''}`}
            onClick={() => {
              setEntering(false)
              window.setTimeout(() => {
                setIndex(i)
                setEntering(true)
              }, 100)
            }}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>

      <footer className="slideshow__bottom">
        <p className={`slideshow__caption ${entering ? 'is-in' : ''}`}>
          {card.caption}
        </p>
        <p className="slideshow__credit">{card.attribution}</p>

        <div className="slideshow__nav">
          <button type="button" className="slideshow__btn" onClick={() => go(-1)}>
            Previous
          </button>
          <button
            type="button"
            className="slideshow__btn slideshow__btn--primary"
            onClick={() => go(1)}
          >
            Next
          </button>
        </div>
      </footer>

      <button
        type="button"
        className="slideshow__hit slideshow__hit--prev"
        aria-label="Previous card"
        onClick={() => go(-1)}
      />
      <button
        type="button"
        className="slideshow__hit slideshow__hit--next"
        aria-label="Next card"
        onClick={() => go(1)}
      />
    </section>
  )
}
