"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Calendar } from "lucide-react"
import { FIXED_EDITIONS, SET_TYPES, getSetsByType } from "@/lib/mtg-sets"

interface EditionFilterProps {
  selectedEditions: string[]
  onEditionChange: (editions: string[]) => void
  className?: string
}

export function EditionFilter({ selectedEditions, onEditionChange, className }: EditionFilterProps) {
  const [expandedTypes, setExpandedTypes] = useState<string[]>(["standard"])
  const setsByType = getSetsByType()

  const toggleType = (type: string) => {
    setExpandedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleSetToggle = (setCode: string) => {
    if (selectedEditions.includes(setCode)) {
      onEditionChange(selectedEditions.filter((code) => code !== setCode))
    } else {
      onEditionChange([...selectedEditions, setCode])
    }
  }

  const handleSelectAll = () => {
    if (selectedEditions.length === FIXED_EDITIONS.length) {
      onEditionChange([])
    } else {
      onEditionChange(FIXED_EDITIONS.map((set) => set.code))
    }
  }

  const handleTypeToggle = (type: string) => {
    const typeSets = setsByType[type] || []
    const typeSetCodes = typeSets.map((set) => set.code)
    const allTypeSelected = typeSetCodes.every((code) => selectedEditions.includes(code))

    if (allTypeSelected) {
      // Deselect all sets of this type
      onEditionChange(selectedEditions.filter((code) => !typeSetCodes.includes(code)))
    } else {
      // Select all sets of this type
      const newSelection = [...selectedEditions]
      typeSetCodes.forEach((code) => {
        if (!newSelection.includes(code)) {
          newSelection.push(code)
        }
      })
      onEditionChange(newSelection)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Edition Filter</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {selectedEditions.length} selected
            </Badge>
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedEditions.length === FIXED_EDITIONS.length ? "Clear All" : "Select All"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {Object.entries(setsByType).map(([type, sets]) => {
          const isExpanded = expandedTypes.includes(type)
          const typeSetCodes = sets.map((set) => set.code)
          const selectedInType = typeSetCodes.filter((code) => selectedEditions.includes(code)).length
          const typeConfig = SET_TYPES[type as keyof typeof SET_TYPES]

          return (
            <Collapsible key={type} open={isExpanded} onOpenChange={() => toggleType(type)}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <Badge className={`${typeConfig.color} text-white`}>{typeConfig.label}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {selectedInType}/{sets.length} selected
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTypeToggle(type)
                    }}
                    className="text-xs"
                  >
                    {selectedInType === sets.length ? "Deselect" : "Select"} All
                  </Button>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-2 ml-4 space-y-2">
                {sets.map((set) => {
                  const isSelected = selectedEditions.includes(set.code)
                  return (
                    <div
                      key={set.code}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleSetToggle(set.code)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">{set.name}</h4>
                            <Badge variant="outline" className="text-xs font-mono">
                              {set.code.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(set.releaseDate)}</span>
                          </div>
                          {set.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">{set.description}</p>
                          )}
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <div
                            className={`w-4 h-4 rounded border-2 transition-colors ${
                              isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                className="w-full h-full text-primary-foreground"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                              >
                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CollapsibleContent>
            </Collapsible>
          )
        })}

        {/* Quick Presets */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Quick Presets</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditionChange(setsByType.standard?.map((s) => s.code) || [])}
              className="text-xs"
            >
              Standard Sets Only
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const recent = FIXED_EDITIONS.filter((set) => new Date(set.releaseDate) > new Date("2023-01-01")).map(
                  (s) => s.code,
                )
                onEditionChange(recent)
              }}
              className="text-xs"
            >
              2023+ Sets
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditionChange(setsByType.commander?.map((s) => s.code) || [])}
              className="text-xs"
            >
              Commander Sets
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
