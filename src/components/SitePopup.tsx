import type { EraMode, SiteFeature } from '../lib/types'

interface Props {
  site: SiteFeature
  era: EraMode
  onEra: (era: EraMode) => void
  discovered: boolean
  nearby: boolean
  onClose: () => void
}

export function SitePopup({
  site,
  era,
  onEra,
  discovered,
  nearby,
  onClose,
}: Props) {
  const { properties: p } = site
  const panel = p.thenNow[era]

  return (
    <aside className="site-popup" role="dialog" aria-labelledby="site-popup-title">
      <header className="site-popup__head">
        <div>
          <p className="site-popup__eyebrow">{p.shortLabel} · {p.status}</p>
          <h2 id="site-popup-title">{p.title}</h2>
        </div>
        <button type="button" className="ghost-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </header>

      <p className="site-popup__hook">{p.story.hook}</p>

      <div className="era-toggle" role="tablist" aria-label="Then or now">
        <button
          type="button"
          role="tab"
          aria-selected={era === 'then'}
          className={era === 'then' ? 'is-active' : ''}
          onClick={() => onEra('then')}
        >
          Then
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={era === 'now'}
          className={era === 'now' ? 'is-active' : ''}
          onClick={() => onEra('now')}
        >
          Now
        </button>
      </div>

      <div className={`era-panel era-panel--${panel.placeholder}`} data-era={era}>
        <p className="era-panel__label">{panel.label}</p>
        <p className="era-panel__caption">{panel.caption}</p>
      </div>

      <div className="site-popup__body">
        <p>{p.story.body}</p>
        <p className="site-popup__wonder">{p.story.wonder}</p>
      </div>

      <dl className="site-meta">
        <div>
          <dt>Dates</dt>
          <dd>{p.dates}</dd>
        </div>
        <div>
          <dt>Address</dt>
          <dd>{p.address}</dd>
        </div>
      </dl>

      <footer className="site-popup__foot">
        {discovered ? (
          <p className="reward-chip is-unlocked">
            Discovered · {p.reward.title}
          </p>
        ) : nearby ? (
          <p className="reward-chip is-near">Within range — discovery unlocked</p>
        ) : (
          <p className="reward-chip">Free roam · walk within ~150m to unlock</p>
        )}
        <p className="provenance-note">{p.provenance.attribution}</p>
      </footer>
    </aside>
  )
}
