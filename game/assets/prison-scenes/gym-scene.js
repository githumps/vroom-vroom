/**
 * PRISON GYM SCENE - PIXEL ART DATA
 * Isometric view with atmospheric lighting and detailed equipment
 *
 * PALETTE: Disco Elysium muted tones
 * STYLE: 2:1 isometric projection
 * LIGHTING: Harsh overhead fluorescents with shadows
 */

const GymScene = {
    metadata: {
        name: "Prison Gym",
        dimensions: { width: 800, height: 600 },
        projection: "isometric-2:1",
        scale: 2, // 2x pixel scale
        palette: "disco-elysium-prison"
    },

    // COLOR PALETTE
    palette: {
        // Walls & Structure
        wall_dark: "#2a2a2a",
        wall_mid: "#3d3d3d",
        wall_light: "#525252",
        floor_dark: "#1a1a1a",
        floor_mid: "#2d2d2d",
        floor_light: "#404040",

        // Metal Equipment
        metal_dark: "#3a3a3a",
        metal_mid: "#5a5a5a",
        metal_highlight: "#7a7a7a",
        rust: "#6b4423",

        // Mats & Padding
        mat_blue: "#2d3f5f",
        mat_blue_shadow: "#1a2a3f",
        padding_gray: "#4a4a4a",

        // Lighting
        light_harsh: "#e8e8d0",
        light_glow: "#d4d4b8",
        shadow_deep: "#0f0f0f",

        // Characters
        skin_tone_1: "#d4a88c",
        skin_tone_2: "#8d5524",
        skin_tone_3: "#c9a27a",
        prison_orange: "#ff8c42",
        prison_orange_shadow: "#d16d2a"
    },

    // LAYERED SCENE COMPOSITION
    layers: [
        {
            id: "background",
            name: "Back Wall & Ceiling",
            zIndex: 0,
            elements: [
                {
                    type: "wall",
                    position: { x: 0, y: 0 },
                    size: { width: 800, height: 300 },
                    tileable: true,
                    pattern: "concrete_blocks",
                    lighting: "overhead_harsh"
                },
                {
                    type: "ceiling_light",
                    position: { x: 200, y: 50 },
                    animated: true,
                    frames: [
                        { brightness: 1.0, duration: 1000 },
                        { brightness: 0.95, duration: 100 },
                        { brightness: 1.0, duration: 2000 }
                    ]
                },
                {
                    type: "ceiling_light",
                    position: { x: 600, y: 50 },
                    animated: true,
                    frames: [
                        { brightness: 1.0, duration: 1500 },
                        { brightness: 0.93, duration: 150 },
                        { brightness: 1.0, duration: 1000 }
                    ]
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
                    pattern: "worn_concrete",
                    grid: { rows: 12, cols: 16 },
                    tiles: [
                        { type: "normal", weight: 85 },
                        { type: "cracked", weight: 10 },
                        { type: "stained", weight: 5 }
                    ]
                }
            ]
        },

        {
            id: "equipment_back",
            name: "Background Equipment",
            zIndex: 2,
            elements: [
                // Wall-mounted pull-up bar
                {
                    type: "pullup_bar",
                    position: { x: 150, y: 180 },
                    size: { width: 80, height: 12 },
                    interactive: false,
                    pixelData: [
                        "    ████████████████████████████    ",
                        "  ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██  ",
                        "██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██",
                        "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██"
                    ]
                },

                // Motivational poster (faded)
                {
                    type: "poster",
                    position: { x: 50, y: 120 },
                    size: { width: 48, height: 64 },
                    text: "NO PAIN\nNO GAIN",
                    style: "faded_80s",
                    interactive: false
                }
            ]
        },

        {
            id: "equipment_mid",
            name: "Main Equipment",
            zIndex: 3,
            elements: [
                // BENCH PRESS STATION
                {
                    type: "bench_press",
                    position: { x: 250, y: 320 },
                    size: { width: 120, height: 80 },
                    interactive: true,
                    hotspot: { x: 60, y: 40, radius: 30 },
                    components: {
                        bench: {
                            pixelData: [
                                "      ████████████████████      ",
                                "    ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██    ",
                                "  ██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██  ",
                                "██░░░░░░░░░░░░░░░░░░░░░░░░░░██",
                                "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                                "  ██                      ██  ",
                                "    ██                  ██    "
                            ]
                        },
                        barbell: {
                            position: { x: 10, y: -15 },
                            animated: true,
                            frames: [
                                { y: -15, duration: 500 }, // Rest position
                                { y: -20, duration: 200 }, // Lift up
                                { y: -15, duration: 300 }  // Down
                            ],
                            pixelData: [
                                "██    ████████████████████████    ██",
                                "██████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██████",
                                "██████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██████",
                                "██    ████████████████████████    ██"
                            ]
                        },
                        weights: [
                            { side: "left", position: { x: 0, y: -12 }, weight: "45lb" },
                            { side: "right", position: { x: 104, y: -12 }, weight: "45lb" }
                        ]
                    }
                },

                // PUNCHING BAG (ANIMATED)
                {
                    type: "punching_bag",
                    position: { x: 600, y: 200 },
                    size: { width: 48, height: 120 },
                    interactive: true,
                    hotspot: { x: 24, y: 80, radius: 25 },
                    animated: true,
                    states: {
                        idle: {
                            frames: [
                                { swing: 0, duration: 1000 },
                                { swing: 1, duration: 100 },
                                { swing: -1, duration: 100 },
                                { swing: 0, duration: 1000 }
                            ]
                        },
                        hit: {
                            frames: [
                                { swing: 0, duration: 50 },
                                { swing: 8, duration: 100 },
                                { swing: -4, duration: 150 },
                                { swing: 2, duration: 200 },
                                { swing: -1, duration: 300 },
                                { swing: 0, duration: 500 }
                            ],
                            impact_particles: true
                        }
                    },
                    components: {
                        chain: {
                            length: 40,
                            links: 8,
                            color: "metal_dark"
                        },
                        bag: {
                            pixelData: [
                                "    ████████████████    ",
                                "  ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██  ",
                                "██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██",
                                "██▓▓▒▒░░░░░░░░░░▒▒▓▓██",
                                "██▓▓▒▒░░░░░░░░░░▒▒▓▓██",
                                "██▓▓▒▒░░░░░░░░░░▒▒▓▓██",
                                "██▓▓▒▒░░░░░░░░░░▒▒▓▓██",
                                "██▓▓▒▒░░░░░░░░░░▒▒▓▓██",
                                "██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██",
                                "  ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██  ",
                                "    ████████████████    "
                            ],
                            wear_marks: [
                                { x: 12, y: 30, size: 3 },
                                { x: 8, y: 45, size: 2 },
                                { x: 16, y: 60, size: 4 }
                            ]
                        }
                    }
                },

                // WEIGHT RACK
                {
                    type: "weight_rack",
                    position: { x: 100, y: 400 },
                    size: { width: 80, height: 60 },
                    interactive: false,
                    pixelData: [
                        "████████████████████████████",
                        "██  ██  ██  ██  ██  ██  ██  ██",
                        "██  ██  ██  ██  ██  ██  ██  ██",
                        "██▓▓██▓▓██▓▓██▓▓██▓▓██▓▓██▓▓██",
                        "██▓▓██▓▓██▓▓██▓▓██▓▓██▓▓██▓▓██",
                        "████████████████████████████"
                    ],
                    dumbbells: [
                        { slot: 1, weight: "10lb", available: true },
                        { slot: 2, weight: "15lb", available: false },
                        { slot: 3, weight: "20lb", available: true },
                        { slot: 4, weight: "25lb", available: true },
                        { slot: 5, weight: "30lb", available: false },
                        { slot: 6, weight: "35lb", available: true }
                    ]
                },

                // EXERCISE MATS
                {
                    type: "exercise_mats",
                    position: { x: 450, y: 450 },
                    count: 3,
                    spacing: 20,
                    pixelData: [
                        "████████████████████████████████",
                        "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                        "██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██",
                        "██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██",
                        "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                        "████████████████████████████████"
                    ],
                    stains: [
                        { mat: 0, x: 8, y: 2 },
                        { mat: 1, x: 12, y: 3 },
                        { mat: 2, x: 6, y: 2 }
                    ]
                }
            ]
        },

        {
            id: "characters",
            name: "Inmates & Guards",
            zIndex: 4,
            elements: [
                // Will be populated by character sprite system
            ]
        },

        {
            id: "foreground",
            name: "Foreground Elements",
            zIndex: 5,
            elements: [
                {
                    type: "shadow_overlay",
                    opacity: 0.3,
                    blendMode: "multiply"
                }
            ]
        }
    ],

    // LIGHTING SYSTEM
    lighting: {
        ambient: {
            color: "#d4d4b8",
            intensity: 0.6
        },
        sources: [
            {
                type: "fluorescent",
                position: { x: 200, y: 50 },
                radius: 300,
                intensity: 0.9,
                flicker: true
            },
            {
                type: "fluorescent",
                position: { x: 600, y: 50 },
                radius: 300,
                intensity: 0.85,
                flicker: true
            }
        ],
        shadows: {
            enabled: true,
            angle: 90, // Straight down
            length: 0.4,
            opacity: 0.6
        }
    },

    // INTERACTIVE HOTSPOTS
    interactions: [
        {
            id: "bench_press",
            area: { x: 250, y: 320, width: 120, height: 80 },
            action: "startWeights",
            cursor: "pointer",
            tooltip: "WORK OUT (Bench Press)"
        },
        {
            id: "punching_bag",
            area: { x: 600, y: 200, width: 48, height: 120 },
            action: "punchBag",
            cursor: "pointer",
            tooltip: "PUNCH BAG (Stress Relief)"
        },
        {
            id: "pull_ups",
            area: { x: 150, y: 180, width: 80, height: 12 },
            action: "doPullUps",
            cursor: "pointer",
            tooltip: "PULL-UPS (Upper Body)"
        }
    ],

    // ATMOSPHERE
    atmosphere: {
        sounds: [
            { type: "metal_clanging", probability: 0.3, interval: [3000, 8000] },
            { type: "grunting", probability: 0.4, interval: [5000, 12000] },
            { type: "fluorescent_buzz", continuous: true, volume: 0.1 }
        ],
        particles: [
            { type: "dust_motes", count: 20, speed: 0.5, area: "full" },
            { type: "sweat_drops", triggered: true, source: "characters" }
        ]
    }
};

// Export for game integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GymScene;
}
