"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, X, History, Star, Filter, Settings, Sliders } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EditionFilter } from "@/components/edition-filter"
import { AdvancedFilters } from "@/components/advanced-filters"

interface SearchFilters {
  editions: string[]
  color: string
  rarity: string[]
  type: string[]
  cmc: string
  typeAndLogic: boolean
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

interface SearchInterfaceProps {
  onSearch: (query: string, filters: SearchFilters, advancedFilters: AdvancedFilters) => void
  loading: boolean
  resultCount: number
}

interface SearchHistory {
  query: string
  filters: SearchFilters
  advancedFilters: AdvancedFilters
  timestamp: number
}

const POPULAR_SEARCHES = ["Lightning Bolt", "Counterspell", "Sol Ring", "Planeswalker", "Dragon", "Artifact Creature"]

const defaultAdvancedFilters: AdvancedFilters = {
  priceRange: [0, 100],
  formats: [],
  keywords: [],
  customQuery: "",
  powerToughness: {
    power: { operator: ">=", value: "" },
    toughness: { operator: ">=", value: "" },
  },
  textContains: "",
  artist: "",
  flavorText: "",
  loyalty: { operator: ">=", value: "" },
}

export function SearchInterface({ onSearch, loading, resultCount }: SearchInterfaceProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({
    editions: [],
    color: "all",
    rarity: [],
    type: [],
    cmc: "all",
    typeAndLogic: false,
  })
  const [showRarityPopover, setShowRarityPopover] = useState(false);
  const [showTypePopover, setShowTypePopover] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(defaultAdvancedFilters)
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [savedSearches, setSavedSearches] = useState<SearchHistory[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showEditionDialog, setShowEditionDialog] = useState(false)
  const [showAdvancedDialog, setShowAdvancedDialog] = useState(false)

  // Load search history and saved searches from localStorage
  useEffect(() => {
    const history = localStorage.getItem("mtg-search-history")
    const saved = localStorage.getItem("mtg-saved-searches")
    if (history) setSearchHistory(JSON.parse(history))
    if (saved) setSavedSearches(JSON.parse(saved))
  }, [])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    // Always trigger search, even if query is empty (reset)
    const searchData = {
      query: searchQuery,
      filters,
      advancedFilters,
      timestamp: Date.now(),
    };
    // Add to search history only if query is not empty
    if (searchQuery.trim()) {
      const newHistory = [searchData, ...searchHistory.filter((h) => h.query !== searchQuery)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem("mtg-search-history", JSON.stringify(newHistory));
    }
    onSearch(searchQuery, filters, advancedFilters);
  } 

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query)
  const searchData = { query, filters, advancedFilters, timestamp: Date.now() }
  onSearch(query, filters, advancedFilters)

    // Add to history
    const newHistory = [searchData, ...searchHistory.filter((h) => h.query !== query)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem("mtg-search-history", JSON.stringify(newHistory))
  }

  const saveCurrentSearch = () => {
    if (!searchQuery.trim()) return

    const searchData = {
      query: searchQuery,
      filters,
      advancedFilters,
      timestamp: Date.now(),
    }
    const newSaved = [searchData, ...savedSearches.filter((s) => s.query !== searchQuery)].slice(0, 5)
    setSavedSearches(newSaved)
  }

  const clearFilters = () => {
    setFilters({
      editions: [],
      color: "all",
      rarity: [],
      type: [],
      cmc: "all",
      typeAndLogic: false,
    })
    setAdvancedFilters(defaultAdvancedFilters)
  }

  const hasAdvancedFilters = () => {
    return (
      advancedFilters.priceRange[0] > 0 ||
      advancedFilters.priceRange[1] < 100 ||
      advancedFilters.formats.length > 0 ||
      advancedFilters.keywords.length > 0 ||
      advancedFilters.customQuery.trim() !== "" ||
      advancedFilters.powerToughness.power.value !== "" ||
      advancedFilters.powerToughness.toughness.value !== "" ||
      advancedFilters.textContains.trim() !== "" ||
      advancedFilters.artist.trim() !== "" ||
      advancedFilters.flavorText.trim() !== "" ||
      advancedFilters.loyalty.value !== ""
    )
  }

  const activeFiltersCount =
    (filters.editions.length > 0 ? 1 : 0) +
    (filters.color !== "all" ? 1 : 0) +
    (filters.rarity.length > 0 ? 1 : 0) +
    (filters.type.length > 0 ? 1 : 0) +
    (filters.cmc !== "all" ? 1 : 0) +
    (hasAdvancedFilters() ? 1 : 0)

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Main Search */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={loading} className="cursor-pointer" role="button" aria-label="Search">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </Button>
          {searchQuery && (
            <Button type="button" variant="outline" onClick={saveCurrentSearch}>
              <Star className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter Toggle and Active Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Basic Filters
              {activeFiltersCount - (hasAdvancedFilters() ? 1 : 0) > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {activeFiltersCount - (hasAdvancedFilters() ? 1 : 0)}
                </Badge>
              )}
            </Button>

            <Dialog open={showEditionDialog} onOpenChange={setShowEditionDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Settings className="h-4 w-4" />
                  Editions
                  {filters.editions.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {filters.editions.length}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Select Magic: The Gathering Sets</DialogTitle>
                </DialogHeader>
                <EditionFilter
                  selectedEditions={filters.editions}
                  onEditionChange={(editions) => setFilters({ ...filters, editions })}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={showAdvancedDialog} onOpenChange={setShowAdvancedDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Sliders className="h-4 w-4" />
                  Advanced
                  {hasAdvancedFilters() && <Badge variant="secondary" className="ml-1 text-xs w-2 h-2 p-0" />}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Advanced Search Filters</DialogTitle>
                </DialogHeader>
                <AdvancedFilters
                  filters={advancedFilters}
                  onFiltersChange={setAdvancedFilters}
                  onApply={() => {
                    setShowAdvancedDialog(false)
                    handleSearch()
                  }}
                  onReset={() => setAdvancedFilters(defaultAdvancedFilters)}
                />
              </DialogContent>
            </Dialog>

            {activeFiltersCount > 0 && (
              <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                Clear All Filters
              </Button>
            )}
          </div>
          {resultCount > 0 && <span className="text-sm text-muted-foreground">{resultCount} cards found</span>}
        </div>

        {/* Basic Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            <Select value={filters.color} onValueChange={(value) => setFilters({ ...filters, color: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colors</SelectItem>
                <SelectItem value="w">White</SelectItem>
                <SelectItem value="u">Blue</SelectItem>
                <SelectItem value="b">Black</SelectItem>
                <SelectItem value="r">Red</SelectItem>
                <SelectItem value="g">Green</SelectItem>
                <SelectItem value="c">Colorless</SelectItem>
                <SelectItem value="m">Multicolor</SelectItem>
              </SelectContent>
            </Select>

            {/* Multi-select for Rarity */}
            <div className="relative">
              <button type="button" className="w-full border rounded px-3 py-2 bg-background text-left" onClick={() => setShowRarityPopover((v) => !v)}>
                {filters.rarity.length > 0 ? filters.rarity.join(", ") : "Select Rarity"}
              </button>
              {showRarityPopover && (
                <div className="absolute z-10 bg-card border rounded shadow-lg mt-2 p-2 w-48">
                  {["common", "uncommon", "rare", "mythic"].map((rarity) => (
                    <label key={rarity} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.rarity.includes(rarity)}
                        onChange={(e) => {
                          setFilters({
                            ...filters,
                            rarity: e.target.checked
                              ? [...filters.rarity, rarity]
                              : filters.rarity.filter((r) => r !== rarity),
                          });
                        }}
                      />
                      <span className="capitalize">{rarity}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Multi-select for Type */}
            <div className="relative">
              <button type="button" className="w-full border rounded px-3 py-2 bg-background text-left" onClick={() => setShowTypePopover((v) => !v)}>
                {filters.type.length > 0 ? filters.type.join(", ") : "Select Type"}
              </button>
              {showTypePopover && (
                <div className="absolute z-10 bg-card border rounded shadow-lg mt-2 p-2 w-56">
                  <div className="mb-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.typeAndLogic}
                      onChange={e => setFilters({ ...filters, typeAndLogic: e.target.checked })}
                      id="type-and-checkbox"
                    />
                    <label htmlFor="type-and-checkbox" className="text-xs cursor-pointer">
                      Match all selected types (AND)
                    </label>
                  </div>
                  {["creature", "instant", "sorcery", "enchantment", "artifact", "planeswalker", "land"].map((type) => (
                    <label key={type} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.type.includes(type)}
                        onChange={(e) => {
                          setFilters({
                            ...filters,
                            type: e.target.checked
                              ? [...filters.type, type]
                              : filters.type.filter((t) => t !== type),
                          });
                        }}
                      />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <Select value={filters.cmc} onValueChange={(value) => setFilters({ ...filters, cmc: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Mana Cost" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Cost</SelectItem>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </form>

      {/* Quick Actions */}
      <div className="space-y-4">
        {/* Popular Searches */}
        {/* <div>
          <h3 className="text-sm font-medium text-foreground mb-2">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((search) => (
              <Button
                key={search}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSearch(search)}
                className="text-xs"
              >
                {search}
              </Button>
            ))}
          </div>
        </div> */}

        {/* Search History and Saved Searches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search History */}
          {searchHistory.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">Recent Searches</h3>
              </div>
              <div className="space-y-1">
                {searchHistory.slice(0, 3).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(item.query)
                      setFilters(item.filters)
                      setAdvancedFilters(item.advancedFilters)
                      onSearch(item.query, item.filters, item.advancedFilters)
                    }}
                    className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors"
                  >
                    {item.query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Saved Searches */}
          {savedSearches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">Saved Searches</h3>
              </div>
              <div className="space-y-1">
                {savedSearches.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <button
                      onClick={() => {
                        setSearchQuery(item.query)
                        setFilters(item.filters)
                        setAdvancedFilters(item.advancedFilters)
                        onSearch(item.query, item.filters, item.advancedFilters)
                      }}
                      className="flex-1 text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors"
                    >
                      {item.query}
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newSaved = savedSearches.filter((_, i) => i !== index)
                        setSavedSearches(newSaved)
                        localStorage.setItem("mtg-saved-searches", JSON.stringify(newSaved))
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
