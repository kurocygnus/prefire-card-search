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

const getLegalityColor = (legality: string) => {
    switch (legality) {
      case "legal": return "bg-green-500 text-white";
      case "not_legal": return "bg-red-500 text-white";
      case "banned": return "bg-red-700 text-white";
      case "restricted": return "bg-yellow-500 text-black";
      default: return "bg-gray-500 text-white";
    }
  };

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

  // Card Faces logic
  const hasFaces = Array.isArray((card as any).card_faces) && (card as any).card_faces.length > 0;
  const faces = hasFaces ? (card as any).card_faces : null;
  const [faceIndex, setFaceIndex] = useState(0);
  const currentFace = hasFaces ? faces[faceIndex] : card;

  // Flip animation state
  const [flipped, setFlipped] = useState(false);
  const handleFlip = () => {
    setFlipped((f) => !f);
    if (hasFaces) setFaceIndex(faceIndex === 0 ? 1 : 0);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
      <div className="relative" onClick={() => onCardClick?.(card)}>
        {/* Card Faces or Single Image */}
        <div className="aspect-[5/7] overflow-hidden relative">
          <div className={`w-full h-full transition-transform duration-500 [perspective:1000px]` + (hasFaces ? "" : "") }>
            <div className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-500 ${flipped ? "rotate-y-180" : ""}`}
                 style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
              {/* Front Face */}
              <img
                src={hasFaces ? (faces[0].image_uris?.normal || "/placeholder.svg") : (card.image_uris?.normal || "/placeholder.svg")}
                alt={hasFaces ? faces[0].name : card.name}
                className={`w-full h-full object-cover absolute top-0 left-0 backface-hidden ${flipped ? "opacity-0" : "opacity-100"}`}
                style={{ backfaceVisibility: "hidden" }}
              />
              {/* Back Face (if exists) */}
              {hasFaces && faces[1] && (
                <img
                  src={faces[1].image_uris?.normal || "/placeholder.svg"}
                  alt={faces[1].name}
                  className={`w-full h-full object-cover absolute top-0 left-0 backface-hidden ${flipped ? "opacity-100" : "opacity-0"}`}
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                />
              )}
            </div>
          </div>
          {/* Flip Button if card_faces exists */}
          {hasFaces && faces[1] && (
            <div className="absolute bottom-2 right-2 z-10">
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); handleFlip(); }} title="Flip card">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 10a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="2"/><path d="M10 15v-5" stroke="currentColor" strokeWidth="2"/><path d="M10 15l-2-2" stroke="currentColor" strokeWidth="2"/><path d="M10 15l2-2" stroke="currentColor" strokeWidth="2"/></svg>
              </Button>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Card Name and Mana Cost */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground line-clamp-2 flex-1">{currentFace.name}</h3>
            {currentFace.mana_cost && (
              <span className="text-sm text-muted-foreground whitespace-nowrap font-mono">{currentFace.mana_cost}</span>
            )}
          </div>

          {/* Type Line */}
          <p className="text-sm text-muted-foreground">{currentFace.type_line}</p>

          {/* Oracle Text */}
          {currentFace.oracle_text && (
            <p className="text-sm text-foreground line-clamp-3 leading-relaxed">{currentFace.oracle_text}</p>
          )}

          {/* Power/Toughness */}
          {currentFace.power && currentFace.toughness && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {currentFace.power}/{currentFace.toughness}
              </span>
              {getColorIndicators(currentFace.colors)}
            </div>
          )}

          {/* Bottom Row: Rarity, Set, Price */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Badge className={`${getRarityColor(currentFace.rarity || card.rarity)} text-white text-xs`}>{currentFace.rarity || card.rarity}</Badge>
              {currentFace.prices?.usd && <span className="text-xs text-muted-foreground">${currentFace.prices.usd}</span>}
            </div>
            <span className="text-xs text-muted-foreground">{currentFace.set_name || card.set_name}</span>
          </div>
          {/* Legalities */}
          {(currentFace.legalities || card.legalities) && (
            <>
              <Separator />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function CardModal({ card, open, onClose }: { card: ScryfallCard | null; open: boolean; onClose: () => void }) {
  if (!card) return null;

  // Card Faces logic
  const hasFaces = Array.isArray((card as any).card_faces) && (card as any).card_faces.length > 0;
  const faces = hasFaces ? (card as any).card_faces : null;
  const [faceIndex, setFaceIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const currentFace = hasFaces ? faces[faceIndex] : card;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-500";
      case "uncommon": return "bg-blue-500";
      case "rare": return "bg-yellow-500";
      case "mythic": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };
  const getLegalityColor = (legality: string) => {
    switch (legality) {
      case "legal": return "bg-green-500 text-white";
      case "not_legal": return "bg-red-500 text-white";
      case "banned": return "bg-red-700 text-white";
      case "restricted": return "bg-yellow-500 text-black";
      default: return "bg-gray-500 text-white";
    }
  };
  const handleFlip = () => {
    setFlipped((f) => !f);
    if (hasFaces) setFaceIndex(faceIndex === 0 ? 1 : 0);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{currentFace.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Image */}
          <div className="space-y-4">
            <div className="aspect-[5/7] overflow-hidden rounded-lg border relative">
              <div className={`w-full h-full transition-transform duration-500 [perspective:1000px]` + (hasFaces ? "" : "") }>
                <div className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-500 ${flipped ? "rotate-y-180" : ""}`}
                     style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
                  {/* Front Face */}
                  <img
                    src={hasFaces ? (faces[0].image_uris?.large || faces[0].image_uris?.normal || "/placeholder.svg") : (card.image_uris?.large || card.image_uris?.normal || "/placeholder.svg")}
                    alt={hasFaces ? faces[0].name : card.name}
                    className={`w-full h-full object-cover absolute top-0 left-0 backface-hidden ${flipped ? "opacity-0" : "opacity-100"}`}
                    style={{ backfaceVisibility: "hidden" }}
                  />
                  {/* Back Face (if exists) */}
                  {hasFaces && faces[1] && (
                    <img
                      src={faces[1].image_uris?.large || faces[1].image_uris?.normal || "/placeholder.svg"}
                      alt={faces[1].name}
                      className={`w-full h-full object-cover absolute top-0 left-0 backface-hidden ${flipped ? "opacity-100" : "opacity-0"}`}
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    />
                  )}
                </div>
              </div>
              {/* Flip Button if card_faces exists */}
              {hasFaces && faces[1] && (
                <div className="absolute bottom-2 right-2 z-10">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0" onClick={handleFlip} title="Flip card">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 10a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="2"/><path d="M10 15v-5" stroke="currentColor" strokeWidth="2"/><path d="M10 15l-2-2" stroke="currentColor" strokeWidth="2"/><path d="M10 15l2-2" stroke="currentColor" strokeWidth="2"/></svg>
                  </Button>
                </div>
              )}
            </div>
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
                <span className="font-mono">{currentFace.mana_cost || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Converted Mana Cost</span>
                <span>{currentFace.cmc || card.cmc}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="text-right">{currentFace.type_line}</span>
              </div>
              {currentFace.power && currentFace.toughness && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Power/Toughness</span>
                  <span>
                    {currentFace.power}/{currentFace.toughness}
                  </span>
                </div>
              )}
            </div>
            <Separator />
            {/* Oracle Text */}
            {currentFace.oracle_text && (
              <div className="space-y-2">
                <h4 className="font-semibold">Oracle Text</h4>
                <p className="text-sm leading-relaxed whitespace-pre-line">{currentFace.oracle_text}</p>
              </div>
            )}
            <Separator />
            {/* Set Information */}
            <div className="space-y-3">
              <h4 className="font-semibold">Set Information</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Set:</span>
                  <p>{currentFace.set_name || card.set_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Rarity:</span>
                  <div className="mt-1">
                    <Badge className={`${getRarityColor(currentFace.rarity || card.rarity)} text-white`}>{currentFace.rarity || card.rarity}</Badge>
                  </div>
                </div>
                {(currentFace.collector_number || card.collector_number) && (
                  <div>
                    <span className="text-muted-foreground">Collector Number:</span>
                    <p>{currentFace.collector_number || card.collector_number}</p>
                  </div>
                )}
                {(currentFace.artist || card.artist) && (
                  <div>
                    <span className="text-muted-foreground">Artist:</span>
                    <p>{currentFace.artist || card.artist}</p>
                  </div>
                )}
              </div>
            </div>
            {/* Pricing */}
            {(currentFace.prices && (currentFace.prices.usd || currentFace.prices.usd_foil || currentFace.prices.eur)) || (card.prices && (card.prices.usd || card.prices.usd_foil || card.prices.eur)) ? (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold">Pricing</h4>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    {currentFace.prices?.usd && (
                      <div>
                        <span className="text-muted-foreground">USD:</span>
                        <p className="font-medium">${currentFace.prices.usd}</p>
                      </div>
                    )}
                    {currentFace.prices?.usd_foil && (
                      <div>
                        <span className="text-muted-foreground">USD Foil:</span>
                        <p className="font-medium">${currentFace.prices.usd_foil}</p>
                      </div>
                    )}
                    {currentFace.prices?.eur && (
                      <div>
                        <span className="text-muted-foreground">EUR:</span>
                        <p className="font-medium">€{currentFace.prices.eur}</p>
                      </div>
                    )}
                    {/* fallback to card.prices if not present in face */}
                    {!currentFace.prices?.usd && card.prices?.usd && (
                      <div>
                        <span className="text-muted-foreground">USD:</span>
                        <p className="font-medium">${card.prices.usd}</p>
                      </div>
                    )}
                    {!currentFace.prices?.usd_foil && card.prices?.usd_foil && (
                      <div>
                        <span className="text-muted-foreground">USD Foil:</span>
                        <p className="font-medium">${card.prices.usd_foil}</p>
                      </div>
                    )}
                    {!currentFace.prices?.eur && card.prices?.eur && (
                      <div>
                        <span className="text-muted-foreground">EUR:</span>
                        <p className="font-medium">€{card.prices.eur}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : null}
            {/* Legalities */}
            {(currentFace.legalities || card.legalities) && (
              <>
                <Separator />
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
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
