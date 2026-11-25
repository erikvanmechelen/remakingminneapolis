import type { SiteIcon } from '../lib/types'

const paths: Record<SiteIcon, string> = {
  tower:
    'M12 2 L15 6 L15 18 L18 22 L6 22 L9 18 L9 6 Z M10 10 H14 M10 14 H14',
  dome: 'M4 18 Q4 6 12 4 Q20 6 20 18 Z M7 18 H17 M12 4 V8',
  pinnacle:
    'M12 2 L14 10 L18 10 L15 14 L16 22 L12 18 L8 22 L9 14 L6 10 L10 10 Z',
}

interface Props {
  icon: SiteIcon
  label: string
  discovered: boolean
  nearby: boolean
  selected: boolean
}

export function markerHtml({
  icon,
  label,
  discovered,
  nearby,
  selected,
}: Props): string {
  const state = [
    discovered ? 'is-discovered' : '',
    nearby ? 'is-nearby' : '',
    selected ? 'is-selected' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return `
    <button class="site-marker ${state}" type="button" aria-label="${label}">
      <span class="site-marker__stalk"></span>
      <span class="site-marker__gem">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="${paths[icon]}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="site-marker__label">${label}</span>
    </button>
  `
}
