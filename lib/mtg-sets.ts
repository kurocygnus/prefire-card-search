export interface MTGSet {
  code: string
  name: string
  releaseDate: string
  type: "PreFIRE"
  symbol?: string
  description?: string
}

export const FIXED_EDITIONS: MTGSet[] = [
  // Recent Standard Sets
  {
    code: "8ED",
    name: "Eighth Edition",
    releaseDate: "2003-07-28",
    type: "PreFIRE",
    description: "Core set lançado para celebrar o 10º aniversário de Magic."
  },
  {
    code: "MRD",
    name: "Mirrodin",
    releaseDate: "2003-10-02",
    type: "PreFIRE",
    description: "Primeira visita a Mirrodin, o plano metálico."
  },
  {
    code: "DST",
    name: "Darksteel",
    releaseDate: "2004-02-06",
    type: "PreFIRE",
    description: "Expansão com foco em indestrutível e artefatos poderosos."
  },
  {
    code: "5DN",
    name: "Fifth Dawn",
    releaseDate: "2004-06-04",
    type: "PreFIRE",
    description: "Conclusão do bloco de Mirrodin, introduzindo sunburst."
  },
  {
    code: "CHK",
    name: "Champions of Kamigawa",
    releaseDate: "2004-10-01",
    type: "PreFIRE",
    description: "Primeira visita ao Japão feudal de Kamigawa."
  },
  {
    code: "BOK",
    name: "Betrayers of Kamigawa",
    releaseDate: "2005-02-04",
    type: "PreFIRE",
    description: "Continuação do arco de Kamigawa, com ninjas e traidores."
  },
  {
    code: "SOK",
    name: "Saviors of Kamigawa",
    releaseDate: "2005-06-03",
    type: "PreFIRE",
    description: "Fechamento do bloco de Kamigawa, foco em 'hand size matters'."
  },
  {
    code: "9ED",
    name: "Ninth Edition",
    releaseDate: "2005-07-29",
    type: "PreFIRE",
    description: "Core set com cartas icônicas e staples reeditadas."
  },
  {
    code: "RAV",
    name: "Ravnica: City of Guilds",
    releaseDate: "2005-10-07",
    type: "PreFIRE",
    description: "Primeira visita a Ravnica, introduzindo as guildas."
  },
  {
    code: "GPT",
    name: "Guildpact",
    releaseDate: "2006-02-03",
    type: "PreFIRE",
    description: "Expansão focada em mais três guildas de Ravnica."
  },
  {
    code: "DIS",
    name: "Dissension",
    releaseDate: "2006-05-05",
    type: "PreFIRE",
    description: "Conclusão do bloco de Ravnica original."
  },
  {
    code: "CSP",
    name: "Coldsnap",
    releaseDate: "2006-07-21",
    type: "PreFIRE",
    description: "Expansão temática de gelo, apresentada como continuação de Ice Age."
  },
  {
    code: "TSP",
    name: "Time Spiral",
    releaseDate: "2006-10-06",
    type: "PreFIRE",
    description: "Explora linhas temporais alternativas, com mecânicas antigas."
  },
  {
    code: "PLC",
    name: "Planar Chaos",
    releaseDate: "2007-02-02",
    type: "PreFIRE",
    description: "Um mundo de realidades alternativas, com cores trocadas."
  },
  {
    code: "FUT",
    name: "Future Sight",
    releaseDate: "2007-05-04",
    type: "PreFIRE",
    description: "Cartas com vislumbres do futuro de Magic."
  },
  {
    code: "10E",
    name: "Tenth Edition",
    releaseDate: "2007-07-13",
    type: "PreFIRE",
    description: "Core set preto-e-branco, com muitas reedições populares."
  },
  {
    code: "LRW",
    name: "Lorwyn",
    releaseDate: "2007-10-12",
    type: "PreFIRE",
    description: "Plano de fábulas e tribos, introduzindo planoswalkers."
  },
  {
    code: "MOR",
    name: "Morningtide",
    releaseDate: "2008-02-01",
    type: "PreFIRE",
    description: "Expansão de Lorwyn, focada em classes de criaturas."
  },
  {
    code: "SHM",
    name: "Shadowmoor",
    releaseDate: "2008-05-02",
    type: "PreFIRE",
    description: "Um mundo sombrio, mecânica de híbrido expandida."
  },
  {
    code: "EVE",
    name: "Eventide",
    releaseDate: "2008-07-25",
    type: "PreFIRE",
    description: "Complemento de Shadowmoor, ciclo de cores opostas."
  },
  {
    code: "ALA",
    name: "Shards of Alara",
    releaseDate: "2008-10-03",
    type: "PreFIRE",
    description: "Plano dividido em cinco fragmentos de três cores."
  },
  {
    code: "CON",
    name: "Conflux",
    releaseDate: "2009-02-06",
    type: "PreFIRE",
    description: "Expansão onde os fragmentos de Alara começam a colidir."
  },
  {
    code: "ARB",
    name: "Alara Reborn",
    releaseDate: "2009-04-30",
    type: "PreFIRE",
    description: "Primeira coleção totalmente multicolorida."
  },
  {
    code: "M10",
    name: "Magic 2010",
    releaseDate: "2009-07-17",
    type: "PreFIRE",
    description: "Primeiro Core Set anual com cartas inéditas."
  },
  {
    code: "ZEN",
    name: "Zendikar",
    releaseDate: "2009-10-02",
    type: "PreFIRE",
    description: "Plano das aventuras e terrenos, introduzindo 'landfall'."
  },
  {
    code: "WWK",
    name: "Worldwake",
    releaseDate: "2010-02-05",
    type: "PreFIRE",
    description: "Expansão de Zendikar, com terrenos animados."
  },
  {
    code: "ROE",
    name: "Rise of the Eldrazi",
    releaseDate: "2010-04-23",
    type: "PreFIRE",
    description: "Liberação dos titãs Eldrazi no plano de Zendikar."
  },
  {
    code: "M11",
    name: "Magic 2011",
    releaseDate: "2010-07-16",
    type: "PreFIRE",
    description: "Core set anual com cartas inéditas e reedições."
  },
  {
    code: "SOM",
    name: "Scars of Mirrodin",
    releaseDate: "2010-10-01",
    type: "PreFIRE",
    description: "Retorno a Mirrodin, agora invadido por Phyrexianos."
  },
  {
    code: "MBS",
    name: "Mirrodin Besieged",
    releaseDate: "2011-02-04",
    type: "PreFIRE",
    description: "A batalha pela sobrevivência de Mirrodin."
  },
  {
    code: "NPH",
    name: "New Phyrexia",
    releaseDate: "2011-05-13",
    type: "PreFIRE",
    description: "Mirrodin cai, Phyrexia triunfa."
  },
  {
    code: "M12",
    name: "Magic 2012",
    releaseDate: "2011-07-15",
    type: "PreFIRE",
    description: "Core set anual com reedições e cartas novas."
  },
  {
    code: "ISD",
    name: "Innistrad",
    releaseDate: "2011-09-30",
    type: "PreFIRE",
    description: "Plano gótico de horror, lobisomens e vampiros."
  },
  {
    code: "DKA",
    name: "Dark Ascension",
    releaseDate: "2012-02-03",
    type: "PreFIRE",
    description: "Expansão sombria de Innistrad, humanos em declínio."
  },
  {
    code: "AVR",
    name: "Avacyn Restored",
    releaseDate: "2012-05-04",
    type: "PreFIRE",
    description: "Avacyn retorna, mas traz consequências inesperadas."
  },
  {
    code: "M13",
    name: "Magic 2013",
    releaseDate: "2012-07-13",
    type: "PreFIRE",
    description: "Core set com destaque para Nicol Bolas."
  },
  {
    code: "RTR",
    name: "Return to Ravnica",
    releaseDate: "2012-10-05",
    type: "PreFIRE",
    description: "Primeiro retorno a Ravnica, com cinco guildas."
  },
  {
    code: "GTC",
    name: "Gatecrash",
    releaseDate: "2013-02-01",
    type: "PreFIRE",
    description: "Segunda parte do bloco de Ravnica, mais cinco guildas."
  },
  {
    code: "DGM",
    name: "Dragon’s Maze",
    releaseDate: "2013-05-03",
    type: "PreFIRE",
    description: "Conclusão do arco em Ravnica, com todas as guildas."
  },
  {
    code: "M14",
    name: "Magic 2014",
    releaseDate: "2013-07-19",
    type: "PreFIRE",
    description: "Core set focado em Chandra."
  },
  {
    code: "THS",
    name: "Theros",
    releaseDate: "2013-09-27",
    type: "PreFIRE",
    description: "Plano inspirado na mitologia grega."
  },
  {
    code: "BNG",
    name: "Born of the Gods",
    releaseDate: "2014-02-07",
    type: "PreFIRE",
    description: "Deuses adicionais e continuação do arco de Theros."
  },
  {
    code: "JOU",
    name: "Journey Into Nyx",
    releaseDate: "2014-05-02",
    type: "PreFIRE",
    description: "Conclusão da guerra contra os deuses de Theros."
  },
  {
    code: "M15",
    name: "Magic 2015",
    releaseDate: "2014-07-18",
    type: "PreFIRE",
    description: "Último Core Set numerado, destaque para Garruk."
  },
  {
    code: "KTK",
    name: "Khans of Tarkir",
    releaseDate: "2014-09-26",
    type: "PreFIRE",
    description: "Plano inspirado em culturas mongóis, foco em tríades de cores."
  },
  {
    code: "FRF",
    name: "Fate Reforged",
    releaseDate: "2015-01-23",
    type: "PreFIRE",
    description: "Viagem ao passado de Tarkir."
  },
  {
    code: "DTK",
    name: "Dragons of Tarkir",
    releaseDate: "2015-03-27",
    type: "PreFIRE",
    description: "Linha temporal alternativa dominada por dragões."
  },
  {
    code: "ORI",
    name: "Magic Origins",
    releaseDate: "2015-07-17",
    type: "PreFIRE",
    description: "Histórias de origem dos cinco planeswalkers principais."
  },
  {
    code: "BFZ",
    name: "Battle for Zendikar",
    releaseDate: "2015-10-02",
    type: "PreFIRE",
    description: "Retorno a Zendikar, enfrentando os Eldrazi."
  },
  {
    code: "OGW",
    name: "Oath of the Gatewatch",
    releaseDate: "2016-01-22",
    type: "PreFIRE",
    description: "Juramento dos planeswalkers para proteger os mundos."
  },
  {
    code: "SOI",
    name: "Shadows Over Innistrad",
    releaseDate: "2016-04-08",
    type: "PreFIRE",
    description: "Retorno ao plano gótico, com influência de Emrakul."
  },
  {
    code: "EMN",
    name: "Eldritch Moon",
    releaseDate: "2016-07-22",
    type: "PreFIRE",
    description: "Innistrad corrompido pela presença de Emrakul."
  },
  {
    code: "KLD",
    name: "Kaladesh",
    releaseDate: "2016-09-30",
    type: "PreFIRE",
    description: "Plano de invenções e energia, inspirado na estética indiana."
  },
  {
    code: "AER",
    name: "Aether Revolt",
    releaseDate: "2017-01-20",
    type: "PreFIRE",
    description: "Revolta contra o Consulado em Kaladesh."
  },
  {
    code: "AKH",
    name: "Amonkhet",
    releaseDate: "2017-04-28",
    type: "PreFIRE",
    description: "Plano inspirado no Egito Antigo, dominado por Nicol Bolas."
  },
  {
    code: "HOU",
    name: "Hour of Devastation",
    releaseDate: "2017-07-14",
    type: "PreFIRE",
    description: "Nicol Bolas revela seu plano em Amonkhet."
  },
  {
    code: "XLN",
    name: "Ixalan",
    releaseDate: "2017-09-29",
    type: "PreFIRE",
    description: "Plano de piratas, dinossauros e vampiros conquistadores."
  },
  {
    code: "RIX",
    name: "Rivals of Ixalan",
    releaseDate: "2018-01-19",
    type: "PreFIRE",
    description: "Conflito pelo Sol Imortal em Ixalan."
  },
  {
    code: "DOM",
    name: "Dominaria",
    releaseDate: "2018-04-27",
    type: "PreFIRE",
    description: "Retorno ao plano clássico de Magic, com Sagas."
  },
  {
    code: "M19",
    name: "Core Set 2019",
    releaseDate: "2018-07-13",
    type: "PreFIRE",
    description: "Core Set focado em Nicol Bolas e suas manipulações."
  },
  {
    code: "GRN",
    name: "Guilds of Ravnica",
    releaseDate: "2018-10-05",
    type: "PreFIRE",
    description: "Nova visita a Ravnica, com cinco guildas."
  },
  {
    code: "RNA",
    name: "Ravnica Allegiance",
    releaseDate: "2019-01-25",
    type: "PreFIRE",
    description: "As cinco guildas restantes retornam à cena."
  }
]

export const SET_TYPES = {
  PreFIRE: { label: "PreFIRE", color: "bg-blue-500" },
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
