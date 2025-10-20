/**
 * PRISON YARD SCENE - PIXEL ART DATA
 * Isometric outdoor view with basketball court, fence, and atmosphere
 *
 * PALETTE: Outdoor colors - sky, concrete, chain-link, nature
 * STYLE: 2:1 isometric projection
 * LIGHTING: Natural sunlight with dynamic time-of-day support
 */

const YardScene = {
    metadata: {
        name: "Prison Yard",
        dimensions: { width: 800, height: 600 },
        projection: "isometric-2:1",
        scale: 2,
        palette: "disco-elysium-outdoor",
        time_of_day_support: true
    },

    // COLOR PALETTE (Changes with time of day)
    palette: {
        // Sky (Dynamic)
        sky_morning: "#8aa8c8",
        sky_noon: "#6a9ac8",
        sky_afternoon: "#7a9ac8",
        sky_evening: "#8a7a9a",
        sky_night: "#2a3a4a",

        // Clouds
        cloud_light: "#d8d8d8",
        cloud_shadow: "#b8b8b8",

        // Concrete & Asphalt
        concrete_dark: "#4a4a4a",
        concrete_mid: "#6a6a6a",
        concrete_light: "#8a8a8a",
        asphalt_old: "#3a3a3a",
        court_line: "#e8e8e8",
        court_key: "#c84a3a", // Paint color

        // Chain-Link Fence
        fence_metal: "#7a7a7a",
        fence_shadow: "#5a5a5a",
        fence_rust: "#8a5a3a",
        barbed_wire: "#6a6a6a",

        // Nature
        grass_dark: "#3a5a2a",
        grass_mid: "#4a6a3a",
        grass_light: "#5a7a4a",
        grass_dead: "#6a5a3a",
        dirt_patch: "#5a4a3a",

        // Structures
        watchtower_concrete: "#5a5a5a",
        watchtower_window: "#3a3a3a",
        guard_silhouette: "#2a2a2a",

        // Lighting (Dynamic)
        sun_morning: "#ffe8b8",
        sun_noon: "#fff8d8",
        sun_afternoon: "#ffd8a8",
        sun_evening: "#ff9a5a",
        shadow_sharp: "#1a1a1a",
        shadow_soft: "#2a2a2a"
    },

    layers: [
        {
            id: "sky",
            name: "Sky & Background",
            zIndex: 0,
            elements: [
                {
                    type: "sky_gradient",
                    position: { x: 0, y: 0 },
                    size: { width: 800, height: 350 },
                    time_based: true,
                    gradients: {
                        morning: ["#a8c8e8", "#8aa8c8"],
                        noon: ["#8ab8e8", "#6a9ac8"],
                        afternoon: ["#9ab8d8", "#7a9ac8"],
                        evening: ["#aa8ab8", "#8a7a9a"],
                        night: ["#3a4a5a", "#2a3a4a"]
                    }
                },
                {
                    type: "clouds",
                    animated: true,
                    count: 5,
                    speed: 0.05,
                    height_range: [50, 200],
                    pixelData: [
                        "    ████████████    ",
                        "  ██▓▓▓▓▓▓▓▓▓▓██  ",
                        "██▓▓▒▒▒▒▒▒▒▒▒▒▓▓██",
                        "██▒▒░░░░░░░░░░▒▒██",
                        "  ████████████████  "
                    ]
                },
                {
                    type: "sun",
                    time_based: true,
                    positions: {
                        morning: { x: 150, y: 100 },
                        noon: { x: 400, y: 50 },
                        afternoon: { x: 650, y: 100 },
                        evening: { x: 750, y: 150 }
                    },
                    size: 40,
                    glow_radius: 80
                },
                {
                    type: "distant_buildings",
                    position: { x: 0, y: 250 },
                    size: { width: 800, height: 100 },
                    silhouette: true,
                    opacity: 0.3
                }
            ]
        },

        {
            id: "perimeter",
            name: "Fence & Watchtower",
            zIndex: 1,
            elements: [
                // CHAIN-LINK FENCE (Back)
                {
                    type: "chain_link_fence",
                    position: { x: 0, y: 280 },
                    size: { width: 800, height: 120 },
                    height: "12_feet",
                    pattern: "diamond_mesh",
                    pixelData: {
                        mesh_pattern: [
                            "██  ██  ██  ██  ██",
                            "  ██  ██  ██  ██  ",
                            "██  ██  ██  ██  ██",
                            "  ██  ██  ██  ██  "
                        ],
                        post: [
                            "████",
                            "████",
                            "████",
                            "████",
                            "████",
                            "████"
                        ],
                        post_spacing: 100
                    },
                    rust_spots: [
                        { x: 120, y: 60, size: 3 },
                        { x: 340, y: 45, size: 2 },
                        { x: 580, y: 70, size: 4 }
                    ],
                    damage: [
                        { x: 450, y: 90, type: "bent", severity: "minor" }
                    ]
                },

                // BARBED WIRE (Top of fence)
                {
                    type: "barbed_wire",
                    position: { x: 0, y: 270 },
                    size: { width: 800, height: 20 },
                    coils: 3,
                    animated: false,
                    pixelData: [
                        "  ▲  ▲  ▲  ▲  ▲  ▲  ▲  ▲  ",
                        "██████████████████████████",
                        "  ▼  ▼  ▼  ▼  ▼  ▼  ▼  ▼  "
                    ],
                    menacing: true
                },

                // WATCHTOWER (Far corner)
                {
                    type: "watchtower",
                    position: { x: 680, y: 120 },
                    size: { width: 80, height: 160 },
                    interactive: false,
                    components: {
                        platform: {
                            height: 100,
                            size: { width: 60, height: 40 },
                            pixelData: [
                                "    ████████████████████████    ",
                                "  ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██  ",
                                "██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██",
                                "██▓▓▒▒░░░░░░░░░░░░░░░░▒▒▓▓██",
                                "██▓▓▒▒░░░░░░░░░░░░░░░░▒▒▓▓██",
                                "  ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██  "
                            ],
                            windows: [
                                { x: 15, y: 15, size: 8, lit: true },
                                { x: 35, y: 15, size: 8, lit: false }
                            ]
                        },
                        ladder: {
                            position: { x: 55, y: 100 },
                            rungs: 12
                        },
                        guard: {
                            visible: true,
                            position: { x: 30, y: 110 },
                            animated: true,
                            animation: "pacing"
                        },
                        searchlight: {
                            position: { x: 40, y: 105 },
                            active: false,
                            sweep_angle: 90,
                            range: 200
                        }
                    }
                }
            ]
        },

        {
            id: "ground",
            name: "Yard Floor",
            zIndex: 2,
            elements: [
                // GRASS AREAS
                {
                    type: "isometric_grass",
                    position: { x: 0, y: 400 },
                    size: { width: 200, height: 200 },
                    pattern: "patchy_grass",
                    variations: [
                        { type: "healthy", weight: 30 },
                        { type: "mid", weight: 40 },
                        { type: "dead", weight: 20 },
                        { type: "dirt", weight: 10 }
                    ],
                    worn_paths: [
                        { from: { x: 50, y: 450 }, to: { x: 150, y: 500 } }
                    ]
                },

                // BASKETBALL COURT (Main feature)
                {
                    type: "basketball_court",
                    position: { x: 250, y: 380 },
                    size: { width: 300, height: 200 },
                    orientation: "isometric",
                    surface: "cracked_asphalt",
                    components: {
                        court_surface: {
                            pixelData: "generated", // Too large to inline
                            cracks: [
                                { start: { x: 120, y: 80 }, end: { x: 140, y: 120 }, width: 2 },
                                { start: { x: 200, y: 50 }, end: { x: 210, y: 90 }, width: 1 },
                                { start: { x: 80, y: 140 }, end: { x: 100, y: 160 }, width: 3 }
                            ],
                            stains: [
                                { x: 90, y: 70, type: "oil", size: 8 },
                                { x: 180, y: 130, type: "blood_old", size: 5 }
                            ]
                        },
                        court_lines: {
                            color: "court_line",
                            width: 2,
                            faded: 0.6, // 60% faded
                            lines: [
                                { type: "perimeter", coordinates: [[0,0], [300,0], [300,200], [0,200], [0,0]] },
                                { type: "center_line", coordinates: [[150,0], [150,200]] },
                                { type: "three_point_left", arc: true },
                                { type: "three_point_right", arc: true },
                                { type: "free_throw_left", semicircle: true },
                                { type: "free_throw_right", semicircle: true }
                            ]
                        },
                        key_paint: {
                            color: "court_key",
                            positions: ["left", "right"],
                            faded: 0.8,
                            peeling: true
                        }
                    }
                },

                // BASKETBALL HOOPS
                {
                    type: "basketball_hoop",
                    position: { x: 280, y: 390 },
                    height: 10, // 10 feet regulation
                    condition: "bent",
                    components: {
                        backboard: {
                            size: { width: 40, height: 30 },
                            material: "metal",
                            dents: 3,
                            graffiti: "KP 4 LYFE",
                            pixelData: [
                                "████████████████████████████",
                                "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                                "██▒▒▒▒▒▒  ██  ▒▒▒▒▒▒▒▒▒▒██",
                                "██▒▒▒▒▒▒  ██  ▒▒▒▒▒▒▒▒▒▒██",
                                "██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██",
                                "████████████████████████████"
                            ]
                        },
                        rim: {
                            diameter: 18,
                            bent_angle: 5, // degrees
                            net: "half_missing",
                            pixelData: [
                                "      ████████████      ",
                                "    ██▓▓▓▓▓▓▓▓▓▓██    ",
                                "  ██▒▒░░░░░░░░░░▒▒██  ",
                                "██▒▒░░          ░░▒▒██",
                                "██▒▒░░          ░░▒▒██",
                                "  ██▒▒░░░░░░░░░░▒▒██  ",
                                "    ░░░░░░░░░░░░    ",
                                "      ░░    ░░      "
                            ]
                        },
                        pole: {
                            height: 120,
                            rust: 0.7,
                            bent: false
                        }
                    }
                },

                {
                    type: "basketball_hoop",
                    position: { x: 520, y: 390 },
                    height: 10,
                    condition: "worse",
                    variant: "no_net"
                },

                // CONCRETE AREAS
                {
                    type: "isometric_concrete",
                    position: { x: 600, y: 400 },
                    size: { width: 200, height: 200 },
                    pattern: "weathered",
                    variations: [
                        { type: "clean", weight: 20 },
                        { type: "stained", weight: 50 },
                        { type: "cracked", weight: 30 }
                    ]
                }
            ]
        },

        {
            id: "objects",
            name: "Yard Objects",
            zIndex: 3,
            elements: [
                // BASKETBALL
                {
                    type: "basketball",
                    position: { x: 380, y: 480 },
                    size: 24,
                    inflated: 0.7, // 70% inflated
                    interactive: true,
                    pixelData: [
                        "    ████████    ",
                        "  ██▓▓▓▓▓▓██  ",
                        "██▓▓▒▒▒▒▒▒▓▓██",
                        "██▒▒░░  ░░▒▒██",
                        "██▒▒    ░░▒▒██",
                        "██▓▓▒▒▒▒▒▒▓▓██",
                        "  ██▓▓▓▓▓▓██  ",
                        "    ████████    "
                    ],
                    shadow: true
                },

                // BENCH (Weathered)
                {
                    type: "yard_bench",
                    position: { x: 150, y: 500 },
                    size: { width: 80, height: 40 },
                    material: "concrete",
                    interactive: true,
                    hotspot: { x: 40, y: 20, radius: 30 },
                    pixelData: [
                        "████████████████████████████",
                        "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                        "██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██",
                        "  ████              ████  ",
                        "  ████              ████  "
                    ],
                    graffiti: [
                        { text: "FREEDOM", x: 20, y: 8 },
                        { text: "2024", x: 50, y: 8 }
                    ],
                    occupancy: "available"
                },

                // WORKOUT EQUIPMENT (Makeshift)
                {
                    type: "pullup_bar",
                    position: { x: 100, y: 450 },
                    size: { width: 60, height: 80 },
                    material: "pipe",
                    welded: true,
                    interactive: true,
                    pixelData: [
                        "    ████████████████    ",
                        "  ██▓▓▓▓▓▓▓▓▓▓▓▓██  ",
                        "██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▓▓██",
                        "██▒▒░░░░░░░░░░░░▒▒██",
                        "  ████        ████  ",
                        "  ████        ████  ",
                        "  ████        ████  "
                    ],
                    rust: 0.5
                },

                // TRASH BARREL (Burning? Warming hands?)
                {
                    type: "barrel",
                    position: { x: 650, y: 480 },
                    size: { width: 30, height: 40 },
                    contents: "trash",
                    fire: false, // Changes with time/events
                    pixelData: [
                        "  ████████████  ",
                        "██▓▓▓▓▓▓▓▓▓▓██",
                        "██▒▒▒▒▒▒▒▒▒▒██",
                        "██▒▒░░░░░░▒▒██",
                        "██▒▒░░░░░░▒▒██",
                        "██▓▓▓▓▓▓▓▓▓▓██",
                        "  ████████████  "
                    ]
                },

                // INMATES CONGREGATING (Groups)
                {
                    type: "inmate_group",
                    position: { x: 200, y: 520 },
                    count: 3,
                    activity: "talking",
                    gang_affiliation: "turnSignals"
                },

                {
                    type: "inmate_group",
                    position: { x: 450, y: 460 },
                    count: 4,
                    activity: "playing_basketball"
                }
            ]
        },

        {
            id: "characters",
            name: "Inmates & Guards",
            zIndex: 4,
            elements: [
                // Populated dynamically by character system
            ]
        },

        {
            id: "foreground",
            name: "Atmospheric Effects",
            zIndex: 5,
            elements: [
                {
                    type: "shadow_overlay",
                    time_based: true,
                    opacity: {
                        morning: 0.3,
                        noon: 0.5,
                        afternoon: 0.4,
                        evening: 0.6,
                        night: 0.8
                    }
                },
                {
                    type: "fence_shadow_pattern",
                    source: "chain_link",
                    animated: false,
                    opacity: 0.3,
                    pattern: "diamond_mesh"
                },
                {
                    type: "birds",
                    count: 3,
                    animated: true,
                    flight_path: "circular",
                    height: 100,
                    speed: 0.02,
                    silhouette: true
                }
            ]
        }
    ],

    // LIGHTING SYSTEM (Natural, time-based)
    lighting: {
        ambient: {
            time_based: true,
            color: {
                morning: "#ffeab8",
                noon: "#fff8e8",
                afternoon: "#ffd8b8",
                evening: "#ff9a7a",
                night: "#3a4a5a"
            },
            intensity: {
                morning: 0.7,
                noon: 1.0,
                afternoon: 0.8,
                evening: 0.5,
                night: 0.2
            }
        },
        sun: {
            time_based: true,
            angle: {
                morning: 45,
                noon: 90,
                afternoon: 135,
                evening: 160
            },
            intensity: {
                morning: 0.7,
                noon: 1.0,
                afternoon: 0.8,
                evening: 0.4
            }
        },
        shadows: {
            enabled: true,
            time_based: true,
            angle: {
                morning: 45,
                noon: 90,
                afternoon: 135,
                evening: 160
            },
            length: {
                morning: 1.2,
                noon: 0.3,
                afternoon: 0.8,
                evening: 2.0
            },
            opacity: {
                morning: 0.5,
                noon: 0.7,
                afternoon: 0.6,
                evening: 0.8
            },
            soft: true
        },
        searchlight: {
            active_at_night: true,
            sweep_speed: 0.01,
            radius: 200,
            intensity: 0.9
        }
    },

    // INTERACTIVE HOTSPOTS
    interactions: [
        {
            id: "basketball_court",
            area: { x: 250, y: 380, width: 300, height: 200 },
            action: "playBasketball",
            cursor: "pointer",
            tooltip: "PLAY BASKETBALL (Shoot hoops)"
        },
        {
            id: "workout_bar",
            area: { x: 100, y: 450, width: 60, height: 80 },
            action: "doPullUps",
            cursor: "pointer",
            tooltip: "PULL-UPS (Outdoor workout)"
        },
        {
            id: "bench",
            area: { x: 150, y: 500, width: 80, height: 40 },
            action: "sitAndThink",
            cursor: "pointer",
            tooltip: "SIT (Contemplate freedom)"
        },
        {
            id: "socialize",
            area: { x: 200, y: 520, width: 60, height: 60 },
            action: "talkToInmates",
            cursor: "pointer",
            tooltip: "SOCIALIZE (Gang recruitment)"
        }
    ],

    // ATMOSPHERE
    atmosphere: {
        sounds: [
            { type: "basketball_bounce", probability: 0.5, interval: [2000, 6000] },
            { type: "chain_link_rattle", probability: 0.3, interval: [5000, 15000] },
            { type: "distant_shouts", probability: 0.4, interval: [8000, 20000] },
            { type: "whistle_blow", probability: 0.1, interval: [30000, 60000] },
            { type: "birds_chirping", continuous: true, volume: 0.2 },
            { type: "wind", continuous: true, volume: 0.15 }
        ],
        particles: [
            { type: "dust_blowing", count: 15, speed: 1.0, direction: "wind_based" },
            { type: "leaves_tumbling", count: 5, speed: 0.8, seasonal: true },
            { type: "heat_shimmer", visible_at: "noon", intensity: 0.2 }
        ],
        weather: {
            enabled: true,
            conditions: ["sunny", "cloudy", "overcast", "light_rain"],
            dynamic: false // Set by game state
        },
        mood: "open_but_confined",
        freedom_level: "illusory"
    },

    // WEATHER SYSTEM
    weather: {
        sunny: {
            sky: "clear",
            clouds: 2,
            lighting_multiplier: 1.0,
            shadow_opacity: 0.7
        },
        cloudy: {
            sky: "overcast_light",
            clouds: 8,
            lighting_multiplier: 0.8,
            shadow_opacity: 0.4
        },
        overcast: {
            sky: "gray",
            clouds: "full_coverage",
            lighting_multiplier: 0.6,
            shadow_opacity: 0.2
        },
        light_rain: {
            sky: "dark_gray",
            clouds: "full_coverage",
            lighting_multiplier: 0.5,
            shadow_opacity: 0.1,
            particles: {
                type: "rain_drops",
                count: 100,
                speed: 3.0,
                opacity: 0.6
            }
        }
    }
};

// Export for game integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YardScene;
}
