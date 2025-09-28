export interface MTGSet {
  code: string
  name: string
  releaseDate: string
  type: "standard" | "supplemental" | "masters" | "commander" | "draft"
  symbol?: string
  description?: string
}

export const FIXED_EDITIONS: MTGSet[] = [
  // Recent Standard Sets
  {
    code: "lci",
    name: "The Lost Caverns of Ixalan",
    releaseDate: "2023-11-17",
    type: "standard",
    description: "Return to the plane of Ixalan and explore underground caverns",
  },
  {
    code: "woe",
    name: "Wilds of Eldraine",
    releaseDate: "2023-09-08",
    type: "standard",
    description: "A fairy tale world of knights, magic, and adventure",
  },
  {
    code: "ltr",
    name: "The Lord of the Rings: Tales of Middle-earth",
    releaseDate: "2023-06-23",
    type: "supplemental",
    description: "Journey through Middle-earth with iconic characters",
  },
  {
    code: "mom",
    name: "March of the Machine",
    releaseDate: "2023-04-21",
    type: "standard",
    description: "The Phyrexian invasion reaches its climax",
  },
  {
    code: "one",
    name: "Phyrexia: All Will Be One",
    releaseDate: "2023-02-10",
    type: "standard",
    description: "Enter the heart of Phyrexia itself",
  },
  {
    code: "bro",
    name: "The Brothers' War",
    releaseDate: "2022-11-18",
    type: "standard",
    description: "The legendary conflict between Urza and Mishra",
  },
  {
    code: "dmu",
    name: "Dominaria United",
    releaseDate: "2022-09-09",
    type: "standard",
    description: "Return to Magic's most iconic plane",
  },
  {
    code: "snc",
    name: "Streets of New Capenna",
    releaseDate: "2022-04-29",
    type: "standard",
    description: "A plane ruled by five demon crime families",
  },
  {
    code: "neo",
    name: "Kamigawa: Neon Dynasty",
    releaseDate: "2022-02-18",
    type: "standard",
    description: "Cyberpunk meets traditional Japanese aesthetics",
  },
  // Popular Supplemental Sets
  {
    code: "2x2",
    name: "Double Masters 2022",
    releaseDate: "2022-07-08",
    type: "masters",
    description: "Premium reprint set with double the value",
  },
  {
    code: "clb",
    name: "Commander Legends: Battle for Baldur's Gate",
    releaseDate: "2022-06-10",
    type: "commander",
    description: "Dungeons & Dragons meets Commander format",
  },
  {
    code: "ncc",
    name: "Streets of New Capenna Commander",
    releaseDate: "2022-04-29",
    type: "commander",
    description: "Commander decks themed around New Capenna",
  },
]

export const SET_TYPES = {
  standard: { label: "Standard", color: "bg-blue-500" },
  supplemental: { label: "Supplemental", color: "bg-purple-500" },
  masters: { label: "Masters", color: "bg-yellow-500" },
  commander: { label: "Commander", color: "bg-green-500" },
  draft: { label: "Draft", color: "bg-red-500" },
}

export function getSetsByType() {
  const grouped = FIXED_EDITIONS.reduce(
    (acc, set) => {
      if (!acc[set.type]) acc[set.type] = []
      acc[set.type].push(set)
      return acc
    },
    {} as Record<string, MTGSet[]>,
  )

  // Sort each group by release date (newest first)
  Object.keys(grouped).forEach((type) => {
    grouped[type].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
  })

  return grouped
}

export function getSetByCode(code: string): MTGSet | undefined {
  return FIXED_EDITIONS.find((set) => set.code === code)
}
