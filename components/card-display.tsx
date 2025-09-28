"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Heart, Share2, Eye } from "lucide-react"

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

interface CardDisplayProps {
  card: ScryfallCard
  onCardClick?: (card: ScryfallCard) => void
}

interface CardGridProps {
  cards: ScryfallCard[]
  loading?: boolean
}

export function CardDisplay({ card, onCardClick }: CardDisplayProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500"
      case "uncommon":
        return "bg-blue-500"
      case "rare":
        return "bg-yellow-500"
      case "mythic":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getColorIndicators = (colors?: string[]) => {
    if (!colors || colors.length === 0) return null

    const colorMap: { [key: string]: string } = {
      W: "bg-yellow-100 text-yellow-800",
      U: "bg-blue-100 text-blue-800",
      B: "bg-gray-800 text-white",
      R: "bg-red-100 text-red-800",
      G: "bg-green-100 text-green-800",
    }

    return (
      <div className="flex gap-1">
        {colors.map((color) => (
          <div key={color} className={`w-4 h-4 rounded-full ${colorMap[color] || "bg-gray-300"}`} />
        ))}
      </div>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
      <div className="relative" onClick={() => onCardClick?.(card)}>
        {card.image_uris && (
          <div className="aspect-[5/7] overflow-hidden relative">
            <img
              src={card.image_uris.normal || "/placeholder.svg"}
              alt={card.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Card Name and Mana Cost */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground line-clamp-2 flex-1">{card.name}</h3>
            {card.mana_cost && (
              <span className="text-sm text-muted-foreground whitespace-nowrap font-mono">{card.mana_cost}</span>
            )}
          </div>

          {/* Type Line */}
          <p className="text-sm text-muted-foreground">{card.type_line}</p>

          {/* Oracle Text */}
          {card.oracle_text && (
            <p className="text-sm text-foreground line-clamp-3 leading-relaxed">{card.oracle_text}</p>
          )}

          {/* Power/Toughness */}
          {card.power && card.toughness && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {card.power}/{card.toughness}
              </span>
              {getColorIndicators(card.colors)}
            </div>
          )}

          {/* Bottom Row: Rarity, Set, Price */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Badge className={`${getRarityColor(card.rarity)} text-white text-xs`}>{card.rarity}</Badge>
              {card.prices?.usd && <span className="text-xs text-muted-foreground">${card.prices.usd}</span>}
            </div>
            <span className="text-xs text-muted-foreground">{card.set_name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CardModal({ card, open, onClose }: { card: ScryfallCard | null; open: boolean; onClose: () => void }) {
  if (!card) return null

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500"
      case "uncommon":
        return "bg-blue-500"
      case "rare":
        return "bg-yellow-500"
      case "mythic":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getLegalityColor = (legality: string) => {
    switch (legality) {
      case "legal":
        return "bg-green-500 text-white"
      case "not_legal":
        return "bg-red-500 text-white"
      case "banned":
        return "bg-red-700 text-white"
      case "restricted":
        return "bg-yellow-500 text-black"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{card.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Image */}
          <div className="space-y-4">
            {card.image_uris && (
              <div className="aspect-[5/7] overflow-hidden rounded-lg border">
                <img
                  src={card.image_uris.large || card.image_uris.normal || "/placeholder.svg"}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Heart className="h-4 w-4 mr-2" />
                Favorite
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              {card.scryfall_uri && (
                <Button variant="outline" size="sm" asChild>
                  <a href={card.scryfall_uri} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Mana Cost</span>
                <span className="font-mono">{card.mana_cost || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Converted Mana Cost</span>
                <span>{card.cmc}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="text-right">{card.type_line}</span>
              </div>
              {card.power && card.toughness && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Power/Toughness</span>
                  <span>
                    {card.power}/{card.toughness}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* Oracle Text */}
            {card.oracle_text && (
              <div className="space-y-2">
                <h4 className="font-semibold">Oracle Text</h4>
                <p className="text-sm leading-relaxed whitespace-pre-line">{card.oracle_text}</p>
              </div>
            )}

            <Separator />

            {/* Set Information */}
            <div className="space-y-3">
              <h4 className="font-semibold">Set Information</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Set:</span>
                  <p>{card.set_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Rarity:</span>
                  <div className="mt-1">
                    <Badge className={`${getRarityColor(card.rarity)} text-white`}>{card.rarity}</Badge>
                  </div>
                </div>
                {card.collector_number && (
                  <div>
                    <span className="text-muted-foreground">Collector Number:</span>
                    <p>{card.collector_number}</p>
                  </div>
                )}
                {card.artist && (
                  <div>
                    <span className="text-muted-foreground">Artist:</span>
                    <p>{card.artist}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            {card.prices && (card.prices.usd || card.prices.usd_foil || card.prices.eur) && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold">Pricing</h4>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    {card.prices.usd && (
                      <div>
                        <span className="text-muted-foreground">USD:</span>
                        <p className="font-medium">${card.prices.usd}</p>
                      </div>
                    )}
                    {card.prices.usd_foil && (
                      <div>
                        <span className="text-muted-foreground">USD Foil:</span>
                        <p className="font-medium">${card.prices.usd_foil}</p>
                      </div>
                    )}
                    {card.prices.eur && (
                      <div>
                        <span className="text-muted-foreground">EUR:</span>
                        <p className="font-medium">€{card.prices.eur}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Legalities */}
            {card.legalities && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold">Format Legality</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(card.legalities).map(([format, legality]) => (
                      <div key={format} className="flex items-center justify-between">
                        <span className="capitalize">{format}:</span>
                        <Badge className={`${getLegalityColor(legality)} text-xs`}>{legality.replace("_", " ")}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function CardGrid({ cards, loading }: CardGridProps) {
  const [selectedCard, setSelectedCard] = useState<ScryfallCard | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleCardClick = (card: ScryfallCard) => {
    setSelectedCard(card)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-[5/7] bg-muted animate-pulse" />
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No cards found. Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <CardDisplay key={card.id} card={card} onCardClick={handleCardClick} />
        ))}
      </div>

      <CardModal card={selectedCard} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
