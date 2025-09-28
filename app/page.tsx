"use client"
import { useState, useEffect } from "react"
import { SearchInterface } from "@/components/search-interface"
import { CardGrid } from "@/components/card-display"

interface ScryfallCard {
  id: string
  name: string
  mana_cost?: string
  type_line: string
  oracle_text?: string
  power?: string
  toughness?: string
  image_uris?: {
    normal: string
    small: string
    art_crop: string
    large: string
  }
  set_name: string
  set: string
  rarity: string
  colors?: string[]
  cmc: number
  artist?: string
  collector_number?: string
  prices?: {
    usd?: string
    usd_foil?: string
    eur?: string
  }
  legalities?: {
    standard?: string
    pioneer?: string
    modern?: string
    legacy?: string
    vintage?: string
    commander?: string
  }
  scryfall_uri?: string
}

interface ScryfallResponse {
  data: ScryfallCard[]
  has_more: boolean
  next_page?: string
  total_cards: number
}

interface SearchFilters {
  editions: string[]
  color: string
  rarity: string
  type: string
  cmc: string
}

interface AdvancedFilters {
  priceRange: [number, number]
  formats: string[]
  keywords: string[]
  customQuery: string
  powerToughness: {
    power: { operator: string; value: string }
    toughness: { operator: string; value: string }
  }
  textContains: string
  artist: string
  flavorText: string
  loyalty: { operator: string; value: string }
}

// Fixed editions filter - you can customize these
const FIXED_EDITIONS = [
  "8ED", // Eight Edition
  "MRD", "DST", "5DN", // Mirrodin / Darksteel / Fifth Dawn
  "CHK", "BOK", "SOK", // Kamigawa block
  "9ED", // Ninth Edition
  "RAV", "GPT", "DIS", // Ravnica block
  "CSP", // Coldsnap
  "TSP", "PLC", "FUT", // Time Spiral block
  "10E", // Tenth Edition
  "LRW", "MOR", "SHM", "EVE", // Lorwyn + Shadowmoor mini-blocks
  "ALA", "CON", "ARB", // Shards of Alara block
  "M10", // Magic 2010
  "ZEN", "WWK", "ROE", // Zendikar block
  "M11", // Magic 2011
  "SOM", "MBS", "NPH", // Scars of Mirrodin block
  "M12", // Magic 2012
  "ISD", "DKA", "AVR", // Innistrad block
  "M13", // Magic 2013
  "RTR", "GTC", "DGM", // Return to Ravnica block
  "M14", // Magic 2014
  "THS", "BNG", "JOU", // Theros block
  "M15", // Magic 2015
  "KTK", "FRF", "DTK", // Khans of Tarkir block
  "ORI", // Magic Origins
  "BFZ", "OGW", // Battle for Zendikar block
  "SOI", "EMN", // Shadows Over Innistrad block
  "KLD", "AER", // Kaladesh block
  "AKH", "HOU", // Amonkhet block
  "XLN", "RIX", // Ixalan block
  "DOM", // Dominaria
  "M19", // Core Set 2019
  "GRN", "RNA" // Guilds of Ravnica / Ravnica Allegiance
]
 
export default function MTGCardSearch() {
  const [cards, setCards] = useState<ScryfallCard[]>([])
  const [loading, setLoading] = useState(false)
  const [totalCards, setTotalCards] = useState(0)

  const searchCards = async (searchQuery: string, filters: SearchFilters, advancedFilters: AdvancedFilters) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      // Build the search query with all filters
      let query = searchQuery

      // Add edition filters

      const allEditionsQuery = FIXED_EDITIONS.map((set) => `set:${set}`).join(" OR ")
      query += ` (${allEditionsQuery})`

      // Add basic filters
      if (filters.color !== "all") {
        if (filters.color === "m") {
          query += ` is:multicolored`
        } else {
          query += ` color:${filters.color}`
        }
      }
      if (filters.rarity !== "all") {
        query += ` rarity:${filters.rarity}`
      }
      if (filters.type !== "all") {
        query += ` type:${filters.type}`
      }
      if (filters.cmc !== "all") {
        if (filters.cmc === "6") {
          query += ` cmc>=6`
        } else {
          query += ` cmc:${filters.cmc}`
        }
      }

      // Add advanced filters
      if (advancedFilters.priceRange[0] > 0) {
        query += ` usd>=${advancedFilters.priceRange[0]}`
      }
      if (advancedFilters.priceRange[1] < 100) {
        query += ` usd<=${advancedFilters.priceRange[1]}`
      }

      // Format legality
      advancedFilters.formats.forEach((format) => {
        query += ` legal:${format}`
      })

      // Keywords
      advancedFilters.keywords.forEach((keyword) => {
        query += ` keyword:"${keyword}"`
      })

      // Power/Toughness
      if (advancedFilters.powerToughness.power.value) {
        query += ` power${advancedFilters.powerToughness.power.operator}${advancedFilters.powerToughness.power.value}`
      }
      if (advancedFilters.powerToughness.toughness.value) {
        query += ` toughness${advancedFilters.powerToughness.toughness.operator}${advancedFilters.powerToughness.toughness.value}`
      }

      // Text searches
      if (advancedFilters.textContains) {
        query += ` oracle:"${advancedFilters.textContains}"`
      }
      if (advancedFilters.artist) {
        query += ` artist:"${advancedFilters.artist}"`
      }
      if (advancedFilters.flavorText) {
        query += ` flavor:"${advancedFilters.flavorText}"`
      }

      // Loyalty
      if (advancedFilters.loyalty.value) {
        query += ` loyalty${advancedFilters.loyalty.operator}${advancedFilters.loyalty.value}`
      }

      // Custom query
      if (advancedFilters.customQuery) {
        query += ` ${advancedFilters.customQuery}`
      }

      query += ` game:paper`

      const encodedQuery = encodeURIComponent(query)
      const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodedQuery}&order=name`)

      if (response.ok) {
        const data: ScryfallResponse = await response.json()
        setCards(data.data || [])
        setTotalCards(data.total_cards || 0)
      } else {
        setCards([])
        setTotalCards(0)
      }
    } catch (error) {
      console.error("Error fetching cards:", error)
      setCards([])
      setTotalCards(0)
    } finally {
      setLoading(false)
    }
  }

  // Load some initial cards on mount
  useEffect(() => {
    const loadInitialCards = async () => {
      setLoading(true)
      try {
        const editionsQuery = FIXED_EDITIONS.map((set) => `set:${set}`).join(" OR ")
        const encodedQuery = encodeURIComponent(`(${editionsQuery}) game:paper`)
        const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodedQuery}&order=name`)

        if (response.ok) {
          const data: ScryfallResponse = await response.json()
          setCards(data.data?.slice(0, 20) || []) // Limit initial results
          setTotalCards(data.total_cards || 0)
        }
      } catch (error) {
        console.error("Error loading initial cards:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialCards()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">PreFIRE Card Search</h1>
          <p className="text-muted-foreground">Search Magic: The Gathering cards from curated editions</p>
        </div>
      </header>

      {/* Search Interface */}
      <div className="container mx-auto px-4 py-8">
        <SearchInterface onSearch={searchCards} loading={loading} resultCount={totalCards} />

        {/* Results */}
        <div className="mt-8">
          <CardGrid cards={cards} loading={loading} />
        </div>
      </div>
    </div>
  )
}
