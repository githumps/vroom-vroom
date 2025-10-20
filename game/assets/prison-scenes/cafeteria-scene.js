/**
 * PRISON CAFETERIA SCENE - PIXEL ART DATA
 * Isometric view with fluorescent lighting and detailed food service
 *
 * PALETTE: Sterile institutional colors with food accents
 * STYLE: 2:1 isometric projection
 * LIGHTING: Harsh fluorescent overhead, institutional feel
 */

const CafeteriaScene = {
    metadata: {
        name: "Prison Cafeteria",
        dimensions: { width: 800, height: 600 },
        projection: "isometric-2:1",
        scale: 2,
        palette: "disco-elysium-institutional"
    },

    // COLOR PALETTE
    palette: {
        // Walls & Ceiling
        wall_white: "#e8e8e0",
        wall_dirty: "#d4d4c8",
        wall_stained: "#b8b8a8",
        ceiling_tile: "#f0f0e8",

        // Floor
        floor_tile: "#c8c8b8",
        floor_grout: "#a8a8a0",
        floor_stain: "#8a8a7a",

        // Tables & Benches
        table_metal: "#6a6a6a",
        table_top: "#7a7a7a",
        bench_metal: "#5a5a5a",

        // Food Service
        counter_steel: "#8a8a8a",
        counter_highlight: "#a0a0a0",
        tray_compartment: "#9a9a9a",

        // Food Colors (Important!)
        mashed_potato: "#e8d8b8",
        mystery_meat: "#8a6a5a",
        green_beans: "#4a5a3a",
        gravy: "#6a5a48",
        bread_roll: "#c8a888",
        jello_red: "#c83a3a",
        milk_carton: "#f0f0f0",

        // Lighting
        fluorescent: "#e8e8d8",
        fluorescent_flicker: "#d4d4c4",
        shadow_harsh: "#0a0a0a"
    },

    layers: [
        {
            id: "background",
            name: "Back Wall & Signage",
            zIndex: 0,
            elements: [
                {
                    type: "wall",
                    position: { x: 0, y: 0 },
                    size: { width: 800, height: 300 },
                    pattern: "tile_white",
                    texture: "institutional",
                    stains: [
                        { x: 120, y: 180, type: "food_splatter", age: "old" },
                        { x: 450, y: 220, type: "mystery_stain", age: "ancient" }
                    ]
                },
                {
                    type: "ceiling_tiles",
                    position: { x: 0, y: 0 },
                    size: { width: 800, height: 100 },
                    grid: { cols: 16, rows: 2 },
                    damaged: [4, 9, 13], // Tile indices
                    water_damage: [5, 6]
                },
                {
                    type: "fluorescent_lights",
                    position: { x: 0, y: 60 },
                    count: 6,
                    spacing: 130,
                    flickering: [1, 4], // Indices of broken lights
                    pixelData: [
                        "████████████████████████",
                        "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                        "██░░░░░░░░░░░░░░░░░░██",
                        "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                        "████████████████████████"
                    ]
                },
                {
                    type: "menu_board",
                    position: { x: 50, y: 120 },
                    size: { width: 100, height: 60 },
                    text: [
                        "TODAY'S MENU",
                        "MASHED POTATOES",
                        "MYSTERY MEAT",
                        "GREEN BEANS",
                        "BREAD ROLL",
                        "BEVERAGE"
                    ],
                    style: "institutional_caps",
                    frame: true
                },
                {
                    type: "rules_sign",
                    position: { x: 680, y: 100 },
                    size: { width: 90, height: 80 },
                    text: [
                        "CAFETERIA RULES",
                        "1. NO TALKING",
                        "2. NO SECONDS",
                        "3. 20 MIN LIMIT",
                        "4. CLEAN TRAY"
                    ],
                    style: "warning_red"
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
                    position: { x: 0, y: 300 },
                    size: { width: 800, height: 300 },
                    pattern: "linoleum_tiles",
                    grid: { rows: 12, cols: 16 },
                    tile_size: { width: 50, height: 25 },
                    variations: [
                        { type: "clean", weight: 60 },
                        { type: "dirty", weight: 25 },
                        { type: "stained", weight: 10 },
                        { type: "cracked", weight: 5 }
                    ],
                    high_traffic_areas: [
                        { x: 400, y: 350, radius: 100 } // Around serving line
                    ]
                }
            ]
        },

        {
            id: "serving_line",
            name: "Food Service Counter",
            zIndex: 2,
            elements: [
                // SERVING COUNTER
                {
                    type: "serving_counter",
                    position: { x: 50, y: 250 },
                    size: { width: 300, height: 80 },
                    interactive: true,
                    components: {
                        counter_base: {
                            pixelData: [
                                "████████████████████████████████████████████████",
                                "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                                "██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██",
                                "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                                "████████████████████████████████████████████████"
                            ],
                            material: "stainless_steel",
                            scratches: true,
                            dents: [
                                { x: 60, y: 30 },
                                { x: 180, y: 45 }
                            ]
                        },
                        sneeze_guard: {
                            position: { x: 0, y: -40 },
                            size: { width: 300, height: 40 },
                            material: "plexiglass",
                            opacity: 0.4,
                            smudges: 8
                        },
                        food_warmers: [
                            {
                                position: { x: 20, y: 10 },
                                food: "mashed_potato",
                                steam: true,
                                level: 0.7
                            },
                            {
                                position: { x: 100, y: 10 },
                                food: "mystery_meat",
                                steam: true,
                                level: 0.6
                            },
                            {
                                position: { x: 180, y: 10 },
                                food: "green_beans",
                                steam: false,
                                level: 0.8
                            },
                            {
                                position: { x: 260, y: 10 },
                                food: "bread_roll",
                                steam: false,
                                level: 0.5
                            }
                        ]
                    }
                },

                // TRAY STACK
                {
                    type: "tray_stack",
                    position: { x: 30, y: 320 },
                    size: { width: 40, height: 30 },
                    count: 20,
                    pixelData: [
                        "████████████████████",
                        "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                        "██▒▒▒▒▒▒▒▒▒▒▒▒▒▒██",
                        "████████████████████",
                        "████████████████████",
                        "████████████████████"
                    ]
                },

                // BEVERAGE DISPENSER
                {
                    type: "beverage_dispenser",
                    position: { x: 380, y: 260 },
                    size: { width: 60, height: 100 },
                    options: ["WATER", "JUICE", "MILK"],
                    interactive: true,
                    pixelData: [
                        "    ████████████████    ",
                        "  ██▓▓▓▓▓▓▓▓▓▓▓▓██  ",
                        "██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▓▓██",
                        "██▓▓▒▒░░░░░░░░▒▒▓▓██",
                        "██▓▓▒▒░░WATER░░▒▒▓▓██",
                        "██▓▓▒▒░░░░░░░░▒▒▓▓██",
                        "██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▓▓██",
                        "  ██▓▓▓▓▓▓▓▓▓▓▓▓██  ",
                        "    ████████  ████    "
                    ],
                    drip_stains: true
                }
            ]
        },

        {
            id: "tables_benches",
            name: "Dining Tables & Benches",
            zIndex: 3,
            elements: [
                // TABLE ROW 1 (3 tables)
                {
                    type: "cafeteria_table",
                    position: { x: 150, y: 380 },
                    size: { width: 140, height: 60 },
                    seats: 6,
                    pixelData: [
                        "        ████████████████████████████        ",
                        "      ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██      ",
                        "    ██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██    ",
                        "  ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██  ",
                        "██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██",
                        "  ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██  ",
                        "    ██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██    "
                    ],
                    surface: {
                        scratches: 15,
                        carved_graffiti: [
                            { text: "KP 2023", x: 40, y: 20 },
                            { text: "INNOCENT", x: 80, y: 25 }
                        ],
                        food_stains: 8
                    },
                    benches: [
                        {
                            side: "left",
                            position: { x: -20, y: 50 },
                            bolted: true
                        },
                        {
                            side: "right",
                            position: { x: 140, y: 50 },
                            bolted: true
                        }
                    ]
                },

                {
                    type: "cafeteria_table",
                    position: { x: 330, y: 380 },
                    size: { width: 140, height: 60 },
                    seats: 6,
                    variant: "more_worn"
                },

                {
                    type: "cafeteria_table",
                    position: { x: 510, y: 380 },
                    size: { width: 140, height: 60 },
                    seats: 6,
                    variant: "cleanish"
                },

                // TABLE ROW 2 (3 tables)
                {
                    type: "cafeteria_table",
                    position: { x: 150, y: 480 },
                    size: { width: 140, height: 60 },
                    seats: 6,
                    variant: "heavily_used"
                },

                {
                    type: "cafeteria_table",
                    position: { x: 330, y: 480 },
                    size: { width: 140, height: 60 },
                    seats: 6,
                    interactive: true,
                    hotspot: { x: 70, y: 30, radius: 40 },
                    tooltip: "SIT AND EAT"
                },

                {
                    type: "cafeteria_table",
                    position: { x: 510, y: 480 },
                    size: { width: 140, height: 60 },
                    seats: 6,
                    variant: "corner_damage"
                }
            ]
        },

        {
            id: "food_details",
            name: "Food Trays & Plates",
            zIndex: 4,
            elements: [
                // DETAILED FOOD TRAY (Player's)
                {
                    type: "food_tray",
                    position: { x: 400, y: 500 },
                    size: { width: 80, height: 60 },
                    compartments: 5,
                    pixelData: {
                        tray_base: [
                            "████████████████████████████████",
                            "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                            "██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██",
                            "██▒▒  ▒▒  ▒▒  ▒▒  ▒▒  ▒▒  ▒▒██",
                            "██▒▒  ▒▒  ▒▒  ▒▒  ▒▒  ▒▒  ▒▒██",
                            "██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██",
                            "████████████████████████████████"
                        ],
                        compartment_main: {
                            position: { x: 8, y: 8 },
                            food: "mashed_potato",
                            serving_size: "large",
                            pixelData: [
                                "  ████████████  ",
                                "██▓▓▓▓▓▓▓▓▓▓▓▓██",
                                "██▒▒▒▒▒▒▒▒▒▒▒▒██",
                                "██░░░░░░░░░░░░██",
                                "██░░░░██░░░░░░██",
                                "  ██████████████  "
                            ],
                            gravy_pool: { x: 6, y: 4, size: 4 }
                        },
                        compartment_protein: {
                            position: { x: 28, y: 8 },
                            food: "mystery_meat",
                            serving_size: "small",
                            pixelData: [
                                "  ████████  ",
                                "██▓▓▓▓▓▓██",
                                "██▒▒▒▒▒▒██",
                                "██░░░░░░██",
                                "  ████████  "
                            ],
                            char_marks: true
                        },
                        compartment_vegetable: {
                            position: { x: 48, y: 8 },
                            food: "green_beans",
                            serving_size: "medium",
                            pieces: 8
                        },
                        compartment_bread: {
                            position: { x: 8, y: 38 },
                            food: "bread_roll",
                            butter_pat: false
                        },
                        compartment_dessert: {
                            position: { x: 28, y: 38 },
                            food: "jello_red",
                            jiggle_animation: true
                        }
                    },
                    utensils: {
                        spork: {
                            position: { x: 70, y: 20 },
                            material: "plastic",
                            color: "white"
                        }
                    }
                },

                // MILK CARTON
                {
                    type: "milk_carton",
                    position: { x: 485, y: 505 },
                    size: { width: 20, height: 30 },
                    opened: false,
                    expiration: "2 days past",
                    pixelData: [
                        "  ████████  ",
                        "████████████",
                        "██░░MILK░░██",
                        "██░░░░░░░░██",
                        "██░░░░░░░░██",
                        "██░░░░░░░░██",
                        "████████████"
                    ]
                }
            ]
        },

        {
            id: "characters",
            name: "Inmates & Staff",
            zIndex: 5,
            elements: [
                // Populated dynamically
            ]
        },

        {
            id: "foreground",
            name: "Atmospheric Effects",
            zIndex: 6,
            elements: [
                {
                    type: "steam_overlay",
                    sources: [
                        { x: 70, y: 270, intensity: 0.6 },
                        { x: 150, y: 270, intensity: 0.5 },
                        { x: 230, y: 270, intensity: 0.4 }
                    ],
                    animated: true,
                    opacity: 0.3
                },
                {
                    type: "shadow_overlay",
                    opacity: 0.2,
                    harsh_edges: true
                }
            ]
        }
    ],

    // LIGHTING SYSTEM (Harsh fluorescent)
    lighting: {
        ambient: {
            color: "#e8e8d8",
            intensity: 0.8
        },
        sources: [
            { type: "fluorescent", position: { x: 130, y: 60 }, radius: 200, intensity: 1.0, flicker: false },
            { type: "fluorescent", position: { x: 260, y: 60 }, radius: 200, intensity: 0.95, flicker: true, flicker_rate: 0.3 },
            { type: "fluorescent", position: { x: 390, y: 60 }, radius: 200, intensity: 1.0, flicker: false },
            { type: "fluorescent", position: { x: 520, y: 60 }, radius: 200, intensity: 0.9, flicker: true, flicker_rate: 0.5 },
            { type: "fluorescent", position: { x: 650, y: 60 }, radius: 200, intensity: 1.0, flicker: false }
        ],
        shadows: {
            enabled: true,
            angle: 90, // Straight down
            length: 0.3,
            opacity: 0.7,
            harsh: true,
            soft: false
        },
        color_temperature: "cool_white"
    },

    // INTERACTIVE HOTSPOTS
    interactions: [
        {
            id: "serving_line",
            area: { x: 50, y: 250, width: 300, height: 80 },
            action: "getFood",
            cursor: "pointer",
            tooltip: "GET FOOD (Serving Line)"
        },
        {
            id: "eating_spot",
            area: { x: 330, y: 480, width: 140, height: 60 },
            action: "eatMeal",
            cursor: "pointer",
            tooltip: "EAT (20-Bite Simulator)"
        },
        {
            id: "beverage",
            area: { x: 380, y: 260, width: 60, height: 100 },
            action: "getBeverage",
            cursor: "pointer",
            tooltip: "GET DRINK"
        }
    ],

    // ATMOSPHERE
    atmosphere: {
        sounds: [
            { type: "cafeteria_chatter", continuous: true, volume: 0.4 },
            { type: "tray_clatter", probability: 0.5, interval: [2000, 6000] },
            { type: "fluorescent_buzz", continuous: true, volume: 0.15 },
            { type: "chair_scrape", probability: 0.4, interval: [3000, 8000] },
            { type: "spork_on_tray", probability: 0.6, interval: [1000, 4000] }
        ],
        particles: [
            { type: "steam", sources: "food_warmers", count: 15, speed: 0.8, direction: "up" },
            { type: "dust_motes", count: 10, speed: 0.3, area: "full" }
        ],
        mood: "institutional_dread",
        smell: "mystery_meat_and_bleach",
        temperature: "lukewarm"
    },

    // FOOD DATABASE (Disco Elysium style descriptions)
    foodDescriptions: {
        mashed_potato: [
            "This potato has seen things. Dark things. It was mashed by someone who has given up.",
            "The texture is... uncertain. Neither solid nor liquid. A liminal state of being.",
            "You detect notes of institutional sadness and powdered milk substitute.",
            "This used to be a potato. Now it's a philosophical question."
        ],
        mystery_meat: [
            "The label says 'PROTEIN PRODUCT'. That's not reassuring.",
            "Is it chicken? Beef? Tofu? The mystery is part of the punishment.",
            "It has the texture of regret and the flavor of bureaucratic indifference.",
            "Whatever animal this came from, it died twice. Once physically, once spiritually in this kitchen."
        ],
        green_beans: [
            "Overcooked to the point of transcendence. They have achieved vegetable nirvana.",
            "These beans are the color of institutional walls. This cannot be a coincidence.",
            "Texture: rubber hose. Flavor: vague plant matter. Nutrition: theoretical.",
            "A bean is just a seed that didn't escape in time. You understand this now."
        ],
        bread_roll: [
            "Hard enough to use as a weapon. Soft enough to still technically be bread.",
            "The most honest thing on your tray. It knows what it is.",
            "You could build a small shelter with these. Or eat them. Both seem equally viable.",
            "Baked this morning. In 1987."
        ],
        jello: [
            "It jiggles. This is its only purpose. It has achieved that purpose perfectly.",
            "The color doesn't exist in nature. This is synthetic joy in gelatin form.",
            "It wobbles in judgment of your life choices.",
            "Texture: childhood nostalgia. Flavor: artificial everything. Mood: surprisingly positive."
        ]
    }
};

// Export for game integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CafeteriaScene;
}
