'use client';
import { useState, useEffect } from 'react';
import { SearchInterface } from '@/components/search-interface';
import { CardGrid } from '@/components/card-display';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationFirst,
    PaginationPrevious,
    PaginationLink,
    PaginationNext,
    PaginationLast,
    PaginationEllipsis,
} from '@/components/ui/pagination';

interface ScryfallCard {
    id: string;
    name: string;
    mana_cost?: string;
    type_line: string;
    oracle_text?: string;
    power?: string;
    toughness?: string;
    image_uris?: {
        normal: string;
        small: string;
        art_crop: string;
        large: string;
    };
    set_name: string;
    set: string;
    rarity: string;
    colors?: string[];
    cmc: number;
    artist?: string;
    collector_number?: string;
    prices?: {
        usd?: string;
        usd_foil?: string;
        eur?: string;
    };
    legalities?: {
        standard?: string;
        pioneer?: string;
        modern?: string;
        legacy?: string;
        vintage?: string;
        commander?: string;
    };
    scryfall_uri?: string;
}

interface ScryfallResponse {
    data: ScryfallCard[];
    has_more: boolean;
    next_page?: string;
    total_cards: number;
}

interface SearchFilters {
    editions: string[];
    color: string;
    rarity: string[];
    type: string[];
    cmc: string;
    typeAndLogic: boolean;
}
interface AdvancedFilters {
    priceRange: [number, number];
    formats: string[];
    keywords: string[];
    customQuery: string;
    powerToughness: {
        power: { operator: string; value: string };
        toughness: { operator: string; value: string };
    };
    textContains: string;
    artist: string;
    flavorText: string;
    loyalty: { operator: string; value: string };
}

// Fixed editions filter - you can customize these
const FIXED_EDITIONS = [
    '8ED', // Eight Edition
    'MRD',
    'DST',
    '5DN', // Mirrodin / Darksteel / Fifth Dawn
    'CHK',
    'BOK',
    'SOK', // Kamigawa block
    '9ED', // Ninth Edition
    'RAV',
    'GPT',
    'DIS', // Ravnica block
    'CSP', // Coldsnap
    'TSP',
    'PLC',
    'FUT', // Time Spiral block
    '10E', // Tenth Edition
    'LRW',
    'MOR',
    'SHM',
    'EVE', // Lorwyn + Shadowmoor mini-blocks
    'ALA',
    'CON',
    'ARB', // Shards of Alara block
    'M10', // Magic 2010
    'ZEN',
    'WWK',
    'ROE', // Zendikar block
    'M11', // Magic 2011
    'SOM',
    'MBS',
    'NPH', // Scars of Mirrodin block
    'M12', // Magic 2012
    'ISD',
    'DKA',
    'AVR', // Innistrad block
    'M13', // Magic 2013
    'RTR',
    'GTC',
    'DGM', // Return to Ravnica block
    'M14', // Magic 2014
    'THS',
    'BNG',
    'JOU', // Theros block
    'M15', // Magic 2015
    'KTK',
    'FRF',
    'DTK', // Khans of Tarkir block
    'ORI', // Magic Origins
    'BFZ',
    'OGW', // Battle for Zendikar block
    'SOI',
    'EMN', // Shadows Over Innistrad block
    'KLD',
    'AER', // Kaladesh block
    'AKH',
    'HOU', // Amonkhet block
    'XLN',
    'RIX', // Ixalan block
    'DOM', // Dominaria
    'M19', // Core Set 2019
    'GRN',
    'RNA', // Guilds of Ravnica / Ravnica Allegiance
];

const WATCH_LIST = [
    'Bloodbraid Elf',
    'Creeping Chill',
    'Dread Return',
    'Glimpse of Nature',
    'Green Sun’s Zenith',
    'Jace, The Mind Sculptor',
    'Preordain',
    'Punishing Fire',
    'Seething Song',
    'Sensei’s Divining Top',
    'Simian Spirit Guide',
    'Stoneforge Mystic',
    'Thopter Foundry',
    'Sword of the Meek',
];

const BANNED_LIST = [
    "Ancient Den",
    "Great Furnace",
    "Seat of the Synod",
    "Vault of Whispers",
    "Tree of Tales",
    "Blazing Shoal",
    "Chrome Mox",
    "Cloudpost",
    "Counterbalance",
    "Dark Depths",
    "Deathrite Shaman",
    "Dig Through Time",
    "Eye of Ugin",
    "Gitaxian Probe",
    "Golgari Grave-Troll",
    "Hypergenesis",
    "Krark-Clan Ironworks",
    "Mental Misstep",
    "Ponder",
    "Rite of Flame",
    "Second Sunrise",
    "Skullclamp",
    "Summer Bloom",
    "Treasure Cruise",
    "Umezawa's Jitte",
]

export default function MTGCardSearch() {
    const [cards, setCards] = useState<ScryfallCard[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalCards, setTotalCards] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(50);
    const [apiPage, setApiPage] = useState(1); // Scryfall API page (175 per page)
    const [apiCards, setApiCards] = useState<ScryfallCard[]>([]); // Cards from current API page
    // Store search query and filters in state to persist across page changes
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<SearchFilters>({
    editions: [],
    color: 'all',
    rarity: [],
    type: [],
    cmc: 'all',
    typeAndLogic: false,
    });
    const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
        priceRange: [0, 100],
        formats: [],
        keywords: [],
        customQuery: '',
        powerToughness: { power: { operator: '', value: '' }, toughness: { operator: '', value: '' } },
        textContains: '',
        artist: '',
        flavorText: '',
        loyalty: { operator: '', value: '' },
    });

    // Calculate total pages
    const totalPages = Math.max(1, Math.ceil(totalCards / pageSize));

    // Updated searchCards to also update state for searchQuery/filters
    const searchCards = async (
        newSearchQuery: string,
        newFilters: SearchFilters,
        newAdvancedFilters: AdvancedFilters,
        page: number = 1
    ) => {
        // Always update state so filters persist
        setSearchQuery(newSearchQuery);
        setFilters(newFilters);
        setAdvancedFilters(newAdvancedFilters);

        setLoading(true);
        try {
            let query = newSearchQuery.trim();
            const allEditionsQuery = FIXED_EDITIONS.map((set) => `set:${set}`).join(' OR ');
            if (!query) {
                query = `(${allEditionsQuery}) game:paper`;
            } else {
                query += ` (${allEditionsQuery})`;
            }
            if (newFilters.color !== 'all') {
                if (newFilters.color === 'm') {
                    query += ` is:multicolored`;
                } else {
                    query += ` color:${newFilters.color}`;
                }
            }
            if (Array.isArray(newFilters.rarity) && newFilters.rarity.length > 0) {
                const rarityQuery = newFilters.rarity.map((r) => `rarity:${r}`).join(' OR ');
                query += ` (${rarityQuery})`;
            }
            if (Array.isArray(newFilters.type) && newFilters.type.length > 0) {
                if (newFilters.typeAndLogic) {
                    // AND logic: all types must match
                    const typeQuery = newFilters.type.map((t) => `type:${t}`).join(' ');
                    query += ` ${typeQuery}`;
                } else {
                    // OR logic: any type matches
                    const typeQuery = newFilters.type.map((t) => `type:${t}`).join(' OR ');
                    query += ` (${typeQuery})`;
                }
            }
            if (newFilters.cmc !== 'all') {
                if (newFilters.cmc === '6') {
                    query += ` cmc>=6`;
                } else {
                    query += ` cmc:${newFilters.cmc}`;
                }
            }
            if (newAdvancedFilters.priceRange[0] > 0) {
                query += ` usd>=${newAdvancedFilters.priceRange[0]}`;
            }
            if (newAdvancedFilters.priceRange[1] < 100) {
                query += ` usd<=${newAdvancedFilters.priceRange[1]}`;
            }
            newAdvancedFilters.formats.forEach((format) => {
                query += ` legal:${format}`;
            });
            newAdvancedFilters.keywords.forEach((keyword) => {
                query += ` keyword:"${keyword}"`;
            });
            if (newAdvancedFilters.powerToughness.power.value) {
                query += ` power${newAdvancedFilters.powerToughness.power.operator}${newAdvancedFilters.powerToughness.power.value}`;
            }
            if (newAdvancedFilters.powerToughness.toughness.value) {
                query += ` toughness${newAdvancedFilters.powerToughness.toughness.operator}${newAdvancedFilters.powerToughness.toughness.value}`;
            }
            if (newAdvancedFilters.textContains) {
                query += ` oracle:"${newAdvancedFilters.textContains}"`;
            }
            if (newAdvancedFilters.artist) {
                query += ` artist:"${newAdvancedFilters.artist}"`;
            }
            if (newAdvancedFilters.flavorText) {
                query += ` flavor:"${newAdvancedFilters.flavorText}"`;
            }
            if (newAdvancedFilters.loyalty.value) {
                query += ` loyalty${newAdvancedFilters.loyalty.operator}${newAdvancedFilters.loyalty.value}`;
            }
            if (newAdvancedFilters.customQuery) {
                query += ` ${newAdvancedFilters.customQuery}`;
            }
            query += ` game:paper`;
            
            // Calculate which Scryfall API page to fetch
            const virtualPage = page;
            const cardsPerApiPage = 175;
            const apiPageToFetch = Math.floor(((virtualPage - 1) * pageSize) / cardsPerApiPage) + 1;
            const startIdx = ((virtualPage - 1) * pageSize) % cardsPerApiPage;
            const encodedQuery = encodeURIComponent(query);
            const response = await fetch(
                `https://api.scryfall.com/cards/search?q=${encodedQuery}&order=name&page=${apiPageToFetch}`
            );
            if (response.ok) {
                const data: ScryfallResponse = await response.json();
                setApiCards(data.data || []);
                setTotalCards(data.total_cards || 0);
                setCurrentPage(virtualPage);
                setApiPage(apiPageToFetch);
                // Slice correct 50 cards for this virtual page
                setCards((data.data || []).slice(startIdx, startIdx + pageSize));
            } else {
                setCards([]);
                setApiCards([]);
                setTotalCards(0);
            }
        } catch (error) {
            console.error('Error fetching cards:', error);
            setCards([]);
            setApiCards([]);
            setTotalCards(0);
        } finally {
            setLoading(false);
        }
    };

    // Load some initial cards on mount
    useEffect(() => {
        // Use searchCards to load initial cards with virtual pagination
        searchCards(
            '',
            { editions: [], color: 'all', rarity: [], type: [], cmc: 'all', typeAndLogic: false },
            {
                priceRange: [0, 100],
                formats: [],
                keywords: [],
                customQuery: '',
                powerToughness: { power: { operator: '', value: '' }, toughness: { operator: '', value: '' } },
                textContains: '',
                artist: '',
                flavorText: '',
                loyalty: { operator: '', value: '' },
            },
            1
        );
    }, []);

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
                    <CardGrid cards={cards} loading={loading} watchList={WATCH_LIST} bannedList={BANNED_LIST} />
                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationLink
                                            isActive={false}
                                            onClick={currentPage === 1 ? undefined : () => handlePageChange(1)}
                                            aria-label="First page"
                                            className={
                                                currentPage === 1
                                                    ? 'opacity-50 pointer-events-none cursor-default'
                                                    : 'cursor-pointer'
                                            }
                                        >
                                            «
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink
                                            isActive={false}
                                            onClick={
                                                currentPage === 1 ? undefined : () => handlePageChange(currentPage - 1)
                                            }
                                            aria-label="Previous page"
                                            className={
                                                currentPage === 1
                                                    ? 'opacity-50 pointer-events-none cursor-default'
                                                    : 'cursor-pointer'
                                            }
                                        >
                                            ‹
                                        </PaginationLink>
                                    </PaginationItem>
                                    {/* Page numbers logic */}
                                    {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                                        page === 'ellipsis' ? (
                                            <PaginationItem key={`ellipsis-${idx}`}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        ) : (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    isActive={page === currentPage}
                                                    onClick={
                                                        page === currentPage ? undefined : () => handlePageChange(page)
                                                    }
                                                    aria-label={`Go to page ${page}`}
                                                    className={
                                                        page === currentPage ? 'cursor-default' : 'cursor-pointer'
                                                    }
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    )}
                                    <PaginationItem>
                                        <PaginationLink
                                            isActive={false}
                                            onClick={
                                                currentPage === totalPages
                                                    ? undefined
                                                    : () => handlePageChange(currentPage + 1)
                                            }
                                            aria-label="Next page"
                                            className={
                                                currentPage === totalPages
                                                    ? 'opacity-50 pointer-events-none cursor-default'
                                                    : 'cursor-pointer'
                                            }
                                        >
                                            ›
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink
                                            isActive={false}
                                            onClick={
                                                currentPage === totalPages
                                                    ? undefined
                                                    : () => handlePageChange(totalPages)
                                            }
                                            aria-label="Last page"
                                            className={
                                                currentPage === totalPages
                                                    ? 'opacity-50 pointer-events-none cursor-default'
                                                    : 'cursor-pointer'
                                            }
                                        >
                                            »
                                        </PaginationLink>
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Utility: get page numbers and ellipsis for pagination bar
    function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
        const maxNumbers = 10;
        let pages: (number | 'ellipsis')[] = [];
        if (total <= maxNumbers) {
            for (let i = 1; i <= total; i++) pages.push(i);
            return pages;
        }
        if (current <= 6) {
            for (let i = 1; i <= 9; i++) pages.push(i);
            pages.push('ellipsis', total);
            return pages;
        }
        if (current >= total - 5) {
            pages.push(1, 'ellipsis');
            for (let i = total - 8; i <= total; i++) pages.push(i);
            return pages;
        }
        pages.push(1, 'ellipsis');
        for (let i = current - 3; i <= current + 4; i++) pages.push(i);
        pages.push('ellipsis', total);
        return pages;
    }

    // Handler for page change
    function handlePageChange(page: number) {
        if (page < 1 || page > totalPages || page === currentPage) return;
        // Use current searchQuery, filters, advancedFilters from state
        searchCards(searchQuery, filters, advancedFilters, page);
    }
}
