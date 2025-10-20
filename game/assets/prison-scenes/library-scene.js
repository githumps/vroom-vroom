/**
 * PRISON LIBRARY SCENE - PIXEL ART DATA
 * Isometric view with warm lamp lighting and detailed book collections
 *
 * PALETTE: Warmer tones than other prison areas (refuge feeling)
 * STYLE: 2:1 isometric projection
 * LIGHTING: Warm desk lamps, reading nooks
 */

const LibraryScene = {
    metadata: {
        name: "Prison Library",
        dimensions: { width: 800, height: 600 },
        projection: "isometric-2:1",
        scale: 2,
        palette: "disco-elysium-warm"
    },

    // COLOR PALETTE (Warmer than gym)
    palette: {
        // Wood & Furniture
        wood_dark: "#4a3428",
        wood_mid: "#6b4c3a",
        wood_light: "#8d6e5a",
        wood_highlight: "#a58a75",

        // Books
        book_spine_1: "#8b3a3a", // Red
        book_spine_2: "#2d4a6e", // Blue
        book_spine_3: "#3d5f3d", // Green
        book_spine_4: "#6b5438", // Brown
        book_spine_5: "#5a3d5f", // Purple
        book_page: "#e8e0d5",
        book_page_aged: "#d4c4a8",

        // Walls & Floor
        wall_dark: "#3a3228",
        wall_mid: "#4d4238",
        floor_dark: "#2a2218",
        floor_mid: "#3d332a",

        // Lighting (Warm!)
        lamp_glow: "#ffdb9a",
        lamp_core: "#ffe4b5",
        shadow_warm: "#1a1510",

        // Accents
        metal_dark: "#3a3a3a",
        fabric_green: "#3a5f3a", // Reading chair
        fabric_worn: "#5a5248"
    },

    layers: [
        {
            id: "background",
            name: "Back Wall",
            zIndex: 0,
            elements: [
                {
                    type: "wall",
                    position: { x: 0, y: 0 },
                    size: { width: 800, height: 350 },
                    pattern: "painted_brick",
                    color: "wall_mid",
                    texture: "aged"
                },
                {
                    type: "notice_board",
                    position: { x: 50, y: 100 },
                    size: { width: 60, height: 80 },
                    papers: [
                        { text: "SILENCE", style: "official" },
                        { text: "LIBRARY RULES", style: "typed" },
                        { text: "CONTRABAND\nREPORT", style: "warning" }
                    ]
                },
                {
                    type: "window",
                    position: { x: 650, y: 80 },
                    size: { width: 80, height: 120 },
                    bars: true,
                    light_rays: true,
                    opacity: 0.3
                }
            ]
        },

        {
            id: "floor",
            name: "Floor Tiles",
            zIndex: 1,
            elements: [
                {
                    type: "isometric_floor",
                    position: { x: 0, y: 350 },
                    size: { width: 800, height: 250 },
                    pattern: "worn_linoleum",
                    color: "floor_mid",
                    grid: { rows: 10, cols: 16 },
                    wear_pattern: "high_traffic_paths"
                }
            ]
        },

        {
            id: "furniture_back",
            name: "Back Bookshelves",
            zIndex: 2,
            elements: [
                // MAIN BOOKSHELF WALL (Back)
                {
                    type: "bookshelf_wall",
                    position: { x: 100, y: 150 },
                    size: { width: 600, height: 180 },
                    shelves: 5,
                    sections: 6,
                    books: {
                        density: 0.85, // 85% full
                        variation: "high",
                        categories: [
                            { name: "Traffic Law", color: "book_spine_2", count: 40 },
                            { name: "Philosophy", color: "book_spine_5", count: 30 },
                            { name: "Literature", color: "book_spine_1", count: 50 },
                            { name: "Self-Help", color: "book_spine_3", count: 25 },
                            { name: "Reference", color: "book_spine_4", count: 35 }
                        ]
                    },
                    pixelData: {
                        shelf: [
                            "████████████████████████████████████████████",
                            "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                            "██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██"
                        ],
                        book_template: [
                            "██",
                            "██",
                            "▓▓",
                            "▓▓",
                            "▓▓",
                            "██"
                        ],
                        book_variations: [
                            { width: 2, height: 6, thickness: "normal" },
                            { width: 3, height: 8, thickness: "thick" },
                            { width: 2, height: 5, thickness: "thin" },
                            { width: 4, height: 7, thickness: "very_thick" }
                        ]
                    }
                },

                // CARD CATALOG (Vintage)
                {
                    type: "card_catalog",
                    position: { x: 50, y: 280 },
                    size: { width: 80, height: 60 },
                    drawers: 12,
                    pixelData: [
                        "████████████████████████████",
                        "██░░░░░░░░░░░░░░░░░░░░░░░░██",
                        "██  ████  ████  ████  ████ ██",
                        "██  ████  ████  ████  ████ ██",
                        "██  ████  ████  ████  ████ ██",
                        "██░░░░░░░░░░░░░░░░░░░░░░░░██",
                        "████████████████████████████"
                    ],
                    interactive: false,
                    labels: "faded"
                }
            ]
        },

        {
            id: "furniture_mid",
            name: "Reading Tables & Chairs",
            zIndex: 3,
            elements: [
                // READING TABLE 1
                {
                    type: "reading_table",
                    position: { x: 200, y: 380 },
                    size: { width: 160, height: 80 },
                    interactive: true,
                    hotspot: { x: 80, y: 40, radius: 40 },
                    components: {
                        table_top: {
                            pixelData: [
                                "        ████████████████████████████        ",
                                "      ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██      ",
                                "    ██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██    ",
                                "  ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██  ",
                                "██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██",
                                "██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██",
                                "  ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██  ",
                                "    ██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██    "
                            ],
                            scratches: [
                                { x: 40, y: 20, pattern: "carved_initials" },
                                { x: 80, y: 25, pattern: "water_ring" }
                            ]
                        },
                        legs: [
                            { position: { x: 10, y: 60 } },
                            { position: { x: 150, y: 60 } },
                            { position: { x: 10, y: 70 } },
                            { position: { x: 150, y: 70 } }
                        ],
                        items_on_table: [
                            {
                                type: "open_book",
                                position: { x: 60, y: 15 },
                                pages: "yellowed",
                                bookmark: true
                            },
                            {
                                type: "desk_lamp",
                                position: { x: 120, y: 10 },
                                light_on: true,
                                glow_radius: 80
                            }
                        ]
                    }
                },

                // READING TABLE 2
                {
                    type: "reading_table",
                    position: { x: 450, y: 380 },
                    size: { width: 160, height: 80 },
                    interactive: true,
                    variant: "cluttered",
                    components: {
                        items_on_table: [
                            { type: "book_stack", count: 5, position: { x: 40, y: 12 } },
                            { type: "notepad", position: { x: 90, y: 18 } },
                            { type: "desk_lamp", position: { x: 130, y: 10 }, light_on: true }
                        ]
                    }
                },

                // READING CHAIRS
                {
                    type: "reading_chair",
                    position: { x: 180, y: 420 },
                    facing: "table",
                    style: "worn_fabric",
                    pixelData: [
                        "    ████████    ",
                        "  ██▓▓▓▓▓▓▓▓██  ",
                        "██▓▓▒▒▒▒▒▒▒▒▓▓██",
                        "██▓▓▒▒░░░░▒▒▓▓██",
                        "██▓▓▓▓▓▓▓▓▓▓▓▓██",
                        "  ██  ████  ██  ",
                        "  ██  ████  ██  "
                    ],
                    occupied: false
                },

                // COZY READING NOOK (Corner)
                {
                    type: "reading_nook",
                    position: { x: 650, y: 350 },
                    size: { width: 120, height: 100 },
                    interactive: true,
                    components: {
                        armchair: {
                            style: "plush",
                            color: "fabric_green",
                            worn_spots: ["armrest_left", "seat_center"],
                            pixelData: [
                                "      ████████████████      ",
                                "    ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██    ",
                                "  ██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██  ",
                                "██▓▓▒▒░░░░░░░░░░░░░░▒▒▓▓██",
                                "██▓▓▒▒░░░░░░░░░░░░░░▒▒▓▓██",
                                "██▓▓▒▒░░░░░░░░░░░░░░▒▒▓▓██",
                                "  ██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██  ",
                                "    ██████      ██████    ",
                                "      ████      ████      "
                            ]
                        },
                        side_table: {
                            position: { x: 90, y: 40 },
                            items: [
                                { type: "coffee_mug", empty: true, ring_stain: true },
                                { type: "bookmark", material: "cardboard" }
                            ]
                        },
                        floor_lamp: {
                            position: { x: 100, y: 0 },
                            height: 80,
                            light_on: true,
                            glow_radius: 100,
                            intensity: 0.8,
                            pixelData: [
                                "    ████████████████    ",
                                "  ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██  ",
                                "██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██",
                                "  ████████████████████  ",
                                "        ████████        ",
                                "        ████████        ",
                                "        ████████        ",
                                "      ██████████████    ",
                                "    ██▓▓▓▓▓▓▓▓▓▓▓▓██  "
                            ]
                        }
                    }
                },

                // BOOK CART (Mobile shelving)
                {
                    type: "book_cart",
                    position: { x: 380, y: 300 },
                    size: { width: 60, height: 80 },
                    wheels: 4,
                    shelves: 3,
                    books: {
                        returns: 8,
                        to_shelve: 12
                    },
                    pixelData: [
                        "  ████████████████████  ",
                        "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                        "██░░ BOOKS ░░ HERE ░░██",
                        "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                        "  ████████████████████  ",
                        "  ████████████████████  ",
                        "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                        "  ████████████████████  ",
                        "    ████      ████    "
                    ]
                }
            ]
        },

        {
            id: "characters",
            name: "Inmates Reading",
            zIndex: 4,
            elements: [
                // Populated dynamically by character system
            ]
        },

        {
            id: "foreground",
            name: "Atmospheric Overlays",
            zIndex: 5,
            elements: [
                {
                    type: "light_rays",
                    source: "window",
                    opacity: 0.15,
                    animated: true,
                    dust_particles: true
                },
                {
                    type: "lamp_glow_overlay",
                    positions: [
                        { x: 320, y: 390 },
                        { x: 580, y: 390 },
                        { x: 750, y: 380 }
                    ],
                    blendMode: "screen",
                    opacity: 0.4
                }
            ]
        }
    ],

    // LIGHTING SYSTEM (Warm and atmospheric)
    lighting: {
        ambient: {
            color: "#e8d8c0",
            intensity: 0.4 // Dimmer than gym - cozy
        },
        sources: [
            {
                type: "desk_lamp",
                position: { x: 320, y: 390 },
                radius: 80,
                intensity: 0.9,
                color: "#ffdb9a",
                flicker: false
            },
            {
                type: "desk_lamp",
                position: { x: 580, y: 390 },
                radius: 80,
                intensity: 0.85,
                color: "#ffdb9a",
                flicker: false
            },
            {
                type: "floor_lamp",
                position: { x: 750, y: 380 },
                radius: 100,
                intensity: 0.8,
                color: "#ffe4b5",
                flicker: false
            },
            {
                type: "window_light",
                position: { x: 690, y: 140 },
                radius: 150,
                intensity: 0.3,
                color: "#d4d4d0",
                time_based: true // Changes with time of day
            }
        ],
        shadows: {
            enabled: true,
            angle: 75, // Angled from lamps
            length: 0.5,
            opacity: 0.5,
            soft: true
        }
    },

    // INTERACTIVE HOTSPOTS
    interactions: [
        {
            id: "reading_table_1",
            area: { x: 200, y: 380, width: 160, height: 80 },
            action: "readAtTable",
            cursor: "pointer",
            tooltip: "READ (Quiet Study)"
        },
        {
            id: "reading_nook",
            area: { x: 650, y: 350, width: 120, height: 100 },
            action: "readInNook",
            cursor: "pointer",
            tooltip: "COZY READING (Armchair)"
        },
        {
            id: "browse_shelves",
            area: { x: 100, y: 150, width: 600, height: 180 },
            action: "browseBooks",
            cursor: "pointer",
            tooltip: "BROWSE BOOKS (Selection)"
        },
        {
            id: "return_books",
            area: { x: 380, y: 300, width: 60, height: 80 },
            action: "returnBooks",
            cursor: "pointer",
            tooltip: "BOOK CART (Returns)"
        }
    ],

    // ATMOSPHERE
    atmosphere: {
        sounds: [
            { type: "page_turn", probability: 0.6, interval: [3000, 10000] },
            { type: "quiet_cough", probability: 0.2, interval: [8000, 20000] },
            { type: "chair_creak", probability: 0.3, interval: [5000, 15000] },
            { type: "distant_footsteps", probability: 0.4, interval: [4000, 12000] },
            { type: "ambient_quiet", continuous: true, volume: 0.05 }
        ],
        particles: [
            { type: "dust_in_light", count: 30, speed: 0.3, area: "window_rays" },
            { type: "book_dust", triggered: true, source: "shelf_interaction" }
        ],
        mood: "contemplative",
        temperature: "warm"
    },

    // BOOK COLLECTION (Detailed)
    bookDatabase: {
        traffic_laws: [
            { title: "The Rules of the Road", volume: 1, pages: 420 },
            { title: "Traffic Violation Compendium", edition: "12th", pages: 680 },
            { title: "Stop Sign Philosophy", author: "J. Hardcastle", pages: 85 }
        ],
        literature: [
            { title: "The Count of Monte Cristo", progress: 0, pages: 1200 },
            { title: "Walden", progress: 0, pages: 300 },
            { title: "Kafka's Trial", progress: 0, pages: 250 }
        ],
        philosophy: [
            { title: "Prison Meditations", pages: 180 },
            { title: "Freedom and Determinism", pages: 340 }
        ],
        contraband: [
            { title: "Lock Picking for Beginners", hidden: true, discovery: 0.05 },
            { title: "Tunnel Construction", hidden: true, discovery: 0.03 }
        ]
    }
};

// Export for game integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LibraryScene;
}
