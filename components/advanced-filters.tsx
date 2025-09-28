"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

interface AdvancedFiltersProps {
  filters: AdvancedFilters
  onFiltersChange: (filters: AdvancedFilters) => void
  onApply: () => void
  onReset: () => void
}

const FORMATS = [
  "standard",
  "pioneer",
  "modern",
  "legacy",
  "vintage",
  "commander",
  "pauper",
  "historic",
  "alchemy",
  "brawl",
]

const COMMON_KEYWORDS = [
  "Flying",
  "Trample",
  "Haste",
  "Vigilance",
  "Deathtouch",
  "Lifelink",
  "First Strike",
  "Double Strike",
  "Hexproof",
  "Indestructible",
  "Flash",
  "Reach",
  "Defender",
  "Menace",
  "Prowess",
  "Scry",
  "Surveil",
  "Convoke",
  "Delve",
  "Flashback",
  "Kicker",
  "Morph",
  "Cycling",
  "Echo",
  "Buyback",
  "Storm",
  "Cascade",
  "Suspend",
  "Madness",
  "Threshold",
  "Landfall",
  "Metalcraft",
  "Morbid",
  "Bloodthirst",
  "Undying",
  "Persist",
  "Wither",
  "Infect",
  "Annihilator",
  "Exalted",
  "Shroud",
  "Protection",
  "Regenerate",
  "Banding",
]

const OPERATORS = [
  { value: "=", label: "Equal to" },
  { value: ">", label: "Greater than" },
  { value: ">=", label: "Greater than or equal" },
  { value: "<", label: "Less than" },
  { value: "<=", label: "Less than or equal" },
]

export function AdvancedFilters({ filters, onFiltersChange, onApply, onReset }: AdvancedFiltersProps) {
  const [activeTab, setActiveTab] = useState("general")

  const updateFilters = (updates: Partial<AdvancedFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const addKeyword = (keyword: string) => {
    if (!filters.keywords.includes(keyword)) {
      updateFilters({ keywords: [...filters.keywords, keyword] })
    }
  }

  const removeKeyword = (keyword: string) => {
    updateFilters({ keywords: filters.keywords.filter((k) => k !== keyword) })
  }

  const toggleFormat = (format: string) => {
    const newFormats = filters.formats.includes(format)
      ? filters.formats.filter((f) => f !== format)
      : [...filters.formats, format]
    updateFilters({ formats: newFormats })
  }

  const formatPrice = (price: number) => {
    return price === 100 ? "$100+" : `$${price}`
  }

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Advanced Filters
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onReset}>
                Reset All
              </Button>
              <Button size="sm" onClick={onApply}>
                Apply Filters
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-6">
              {/* Price Range */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label>Price Range</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filter cards by their current market price in USD</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="px-3">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{formatPrice(filters.priceRange[0])}</span>
                    <span>{formatPrice(filters.priceRange[1])}</span>
                  </div>
                </div>
              </div>

              <Separator />


              {/* Keywords */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label>Keywords & Abilities</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filter by specific keywords and abilities</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select onValueChange={addKeyword}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add keyword..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {COMMON_KEYWORDS.filter((k) => !filters.keywords.includes(k)).map((keyword) => (
                      <SelectItem key={keyword} value={keyword}>
                        {keyword}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filters.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {filters.keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="text-xs">
                        {keyword}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => removeKeyword(keyword)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6 mt-6">
              {/* Power/Toughness */}
              <div className="space-y-4">
                <Label>Power & Toughness</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Power</Label>
                    <div className="flex gap-2">
                      <Select
                        value={filters.powerToughness.power.operator}
                        onValueChange={(value) =>
                          updateFilters({
                            powerToughness: {
                              ...filters.powerToughness,
                              power: { ...filters.powerToughness.power, operator: value },
                            },
                          })
                        }
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {OPERATORS.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.powerToughness.power.value}
                        onChange={(e) =>
                          updateFilters({
                            powerToughness: {
                              ...filters.powerToughness,
                              power: { ...filters.powerToughness.power, value: e.target.value },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Toughness</Label>
                    <div className="flex gap-2">
                      <Select
                        value={filters.powerToughness.toughness.operator}
                        onValueChange={(value) =>
                          updateFilters({
                            powerToughness: {
                              ...filters.powerToughness,
                              toughness: { ...filters.powerToughness.toughness, operator: value },
                            },
                          })
                        }
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {OPERATORS.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.powerToughness.toughness.value}
                        onChange={(e) =>
                          updateFilters({
                            powerToughness: {
                              ...filters.powerToughness,
                              toughness: { ...filters.powerToughness.toughness, value: e.target.value },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Loyalty */}
              <div className="space-y-2">
                <Label>Planeswalker Loyalty</Label>
                <div className="flex gap-2 max-w-xs">
                  <Select
                    value={filters.loyalty.operator}
                    onValueChange={(value) => updateFilters({ loyalty: { ...filters.loyalty, operator: value } })}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OPERATORS.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.loyalty.value}
                    onChange={(e) => updateFilters({ loyalty: { ...filters.loyalty, value: e.target.value } })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-6 mt-6">
              {/* Oracle Text Contains */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Oracle Text Contains</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Search for specific text in the card's rules text</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  placeholder="e.g., 'draw a card', 'enters the battlefield'"
                  value={filters.textContains}
                  onChange={(e) => updateFilters({ textContains: e.target.value })}
                />
              </div>

              <Separator />

              {/* Artist */}
              <div className="space-y-2">
                <Label>Artist</Label>
                <Input
                  placeholder="e.g., 'Rebecca Guay', 'John Avon'"
                  value={filters.artist}
                  onChange={(e) => updateFilters({ artist: e.target.value })}
                />
              </div>

              <Separator />

              {/* Flavor Text */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Flavor Text Contains</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Search for specific text in the card's flavor text</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  placeholder="Search flavor text..."
                  value={filters.flavorText}
                  onChange={(e) => updateFilters({ flavorText: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6 mt-6">
              {/* Custom Scryfall Query */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Custom Scryfall Query</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        Use Scryfall's advanced search syntax. Examples: "is:commander", "cmc:3", "color:wu",
                        "year:2023"
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  placeholder="e.g., is:commander cmc<=3 color:wu"
                  value={filters.customQuery}
                  onChange={(e) => updateFilters({ customQuery: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Use Scryfall syntax for advanced queries. This will be combined with other filters.
                </p>
              </div>

              <Separator />

              {/* Quick Examples */}
              <div className="space-y-3">
                <Label>Quick Examples</Label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: "Cheap Commanders", query: "is:commander cmc<=3" },
                    { label: "Expensive Cards", query: "usd>50" },
                    { label: "Recent Reprints", query: "is:reprint year>=2023" },
                    { label: "Full Art Lands", query: "is:fullart type:land" },
                    { label: "Reserved List", query: "is:reserved" },
                  ].map((example) => (
                    <Button
                      key={example.label}
                      variant="outline"
                      size="sm"
                      className="justify-start text-xs h-8 bg-transparent"
                      onClick={() => updateFilters({ customQuery: example.query })}
                    >
                      <span className="font-medium mr-2">{example.label}:</span>
                      <code className="text-muted-foreground">{example.query}</code>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
