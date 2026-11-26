export type CardEra = 'then' | 'now' | 'lore'
export type SourceKind =
  | 'working-new'
  | 'commons-pd'
  | 'commons-cc'
  | 'hcl-noc-us'
  | 'working-from-millett'

export interface Flashcard {
  id: string
  image: string
  caption: string
  era: CardEra
  sourceKind: SourceKind
  attribution: string
}

export interface DeckProvenance {
  sourceKind: SourceKind
  millettMatch: string | null
  millettNote: string
  attribution: string
}

export interface Deck {
  id: string
  title: string
  shortLabel: string
  tagline: string
  address: string
  status: 'surviving' | 'altered' | 'razed' | 'lore'
  dates: string
  coverImage: string
  cards: Flashcard[]
  provenance: DeckProvenance
}

export interface DecksCollection {
  meta: {
    name: string
    neighborhood: string
    city: string
    dataset: string
    immutableArchive: string
    notes: string
  }
  decks: Deck[]
}
