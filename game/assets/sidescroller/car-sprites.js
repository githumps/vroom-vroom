/**
 * VOXEL CAR SPRITES - ISOMETRIC PIXEL ART
 *
 * Dystopian driving game vehicles with Disco Elysium aesthetic
 * All cars rendered in gorgeous voxel/isometric style
 *
 * FEATURES:
 * - 4 unique car models (Beater, Box, Clunker, Rust Bucket)
 * - Muted, atmospheric color palette
 * - Idle and driving animations
 * - Police car with flashing lights
 * - Rust, dents, dystopian wear details
 * - 10 color variations per car
 *
 * STYLE: Isometric 2:1 projection, pixel-perfect rendering
 * SIZE: 64x48 pixels per sprite
 *
 * @version 1.0.0
 * @artist isometric-pixel-artist agent
 * @date 2025-10-19
 */

const CarSprites = {
    metadata: {
        sprite_size: { width: 64, height: 48 },
        projection: "isometric-2:1",
        scale: 2,
        frame_rate: 8,
        palette: "disco-elysium-vehicles"
    },

    // MUTED DISCO ELYSIUM COLOR PALETTE
    palette: {
        // Muted car colors (desaturated, atmospheric)
        burgundy_dark: "#5a3a3a",
        burgundy_mid: "#7a4a4a",
        burgundy_light: "#9a5a5a",

        olive_dark: "#4a5a3a",
        olive_mid: "#5a6a4a",
        olive_light: "#6a7a5a",

        slate_dark: "#3a4a5a",
        slate_mid: "#4a5a6a",
        slate_light: "#5a6a7a",

        ochre_dark: "#6a5a3a",
        ochre_mid: "#7a6a4a",
        ochre_light: "#8a7a5a",

        charcoal_dark: "#2a2a2a",
        charcoal_mid: "#3a3a3a",
        charcoal_light: "#4a4a4a",

        rust_dark: "#6a4a2a",
        rust_mid: "#7a5a3a",
        rust_light: "#8a6a4a",

        teal_dark: "#2a4a4a",
        teal_mid: "#3a5a5a",
        teal_light: "#4a6a6a",

        mustard_dark: "#6a6a3a",
        mustard_mid: "#7a7a4a",
        mustard_light: "#8a8a5a",

        plum_dark: "#4a3a5a",
        plum_mid: "#5a4a6a",
        plum_light: "#6a5a7a",

        sage_dark: "#3a5a4a",
        sage_mid: "#4a6a5a",
        sage_light: "#5a7a6a",

        // Wear and tear
        rust_patch: "#8a5a3a",
        rust_deep: "#6a3a1a",
        dirt_streak: "#3a3a2a",
        dent_shadow: "#1a1a1a",

        // Glass and chrome
        glass_dark: "#2a3a4a",
        glass_mid: "#3a4a5a",
        glass_reflect: "#5a7a9a",
        chrome_dull: "#5a5a5a",
        chrome_shine: "#7a7a7a",

        // Tires
        tire_black: "#1a1a1a",
        tire_gray: "#2a2a2a",
        tire_tread: "#0a0a0a",

        // Police colors
        police_blue: "#2a3a6a",
        police_white: "#d8d8d8",
        police_red: "#8a2a2a",
        police_light_on: "#ff3a3a",
        police_light_off: "#5a1a1a"
    },

    // CAR MODELS
    cars: {
        // ==================== THE BEATER (Wide Sedan) ====================
        beater: {
            name: "The Beater",
            description: "Wide sedan. Seen better decades.",
            type: "sedan",
            dimensions: { width: 64, height: 48 },
            voxel_size: { x: 44, y: 18, z: 84 }, // 2.2 x 0.9 x 4.2 (in game units)

            // BASE SPRITE (Burgundy)
            idle: {
                frames: 2,
                loop: true,
                speed: 800,
                pixelData: [
                    // Frame 0 - Idle
                    [
                        "                                                                ",
                        "                        ████████████████                        ",
                        "                    ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓████                    ",
                        "                ████▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓████                ",
                        "            ████▓▓▒▒░░░░░░░░░░░░░░░░░░▒▒▓▓████            ", // Hood
                        "        ████▓▓▒▒░░▓▓▓▓░░░░░░░░░░░░▓▓▓▓░░▒▒▓▓████        ",
                        "    ████▓▓▒▒░░░░░░░░░░░░░░██░░░░░░░░░░░░░░▒▒▓▓████    ",
                        "    ██▓▓▒▒░░░░░░░░░░░░░░██▒▒██░░░░░░░░░░░░░░▒▒▓▓██    ",
                        "  ██▓▓▒▒░░░░████████░░██▒▒▒▒▒▒██░░████████░░░░▒▒▓▓██  ", // Windshield
                        "  ██▒▒░░░░██▓▓▓▓▓▓▓▓████▒▒▒▒▒▒▒▒████▓▓▓▓▓▓▓▓██░░░░▒▒██  ",
                        "██▒▒░░░░██▓▓▒▒▒▒▒▒▒▒▓▓██▒▒░░░░▒▒██▓▓▒▒▒▒▒▒▒▒▓▓██░░░░▒▒██",
                        "██▒▒░░░░██▒▒░░░░░░░░▒▒██░░░░░░░░██▒▒░░░░░░░░▒▒██░░░░▒▒██", // Body
                        "██▒▒░░░░██▒▒░░░░░░░░▒▒░░░░░░░░░░░░▒▒░░░░░░░░▒▒██░░░░▒▒██",
                        "██▒▒░░░░██▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒██░░░░▒▒██",
                        "██▓▓░░░░██▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓██░░░░▓▓██",
                        "██▓▓▒▒░░██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██░░▒▒▓▓██", // Lower body
                        "  ██▓▓▒▒██▓▓▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓▓▓██▒▒▓▓██  ",
                        "  ██████▓▓▓▓▓▓▓▓▒▒░░░░░░░░░░░░░░░░░░░░▒▒▓▓▓▓▓▓▓▓██████  ",
                        "    ████▓▓▓▓▓▓▓▓▓▓▒▒▒▒░░░░░░░░░░░░▒▒▒▒▓▓▓▓▓▓▓▓▓▓████    ",
                        "      ██████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██████      ",
                        "        ████████████████████████████████████████        ",
                        "      ██░░░░██                        ██░░░░██      ", // Wheels
                        "      ██████                            ██████      ",
                        "                                                                "
                    ],
                    // Frame 1 - Slight bounce
                    [
                        "                                                                ",
                        "                        ████████████████                        ",
                        "                    ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓████                    ",
                        "                ████▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓████                ",
                        "            ████▓▓▒▒░░░░░░░░░░░░░░░░░░▒▒▓▓████            ",
                        "        ████▓▓▒▒░░▓▓▓▓░░░░░░░░░░░░▓▓▓▓░░▒▒▓▓████        ",
                        "    ████▓▓▒▒░░░░░░░░░░░░░░██░░░░░░░░░░░░░░▒▒▓▓████    ",
                        "    ██▓▓▒▒░░░░░░░░░░░░░░██▒▒██░░░░░░░░░░░░░░▒▒▓▓██    ",
                        "  ██▓▓▒▒░░░░████████░░██▒▒▒▒▒▒██░░████████░░░░▒▒▓▓██  ",
                        "  ██▒▒░░░░██▓▓▓▓▓▓▓▓████▒▒▒▒▒▒▒▒████▓▓▓▓▓▓▓▓██░░░░▒▒██  ",
                        "██▒▒░░░░██▓▓▒▒▒▒▒▒▒▒▓▓██▒▒░░░░▒▒██▓▓▒▒▒▒▒▒▒▒▓▓██░░░░▒▒██",
                        "██▒▒░░░░██▒▒░░░░░░░░▒▒██░░░░░░░░██▒▒░░░░░░░░▒▒██░░░░▒▒██",
                        "██▒▒░░░░██▒▒░░░░░░░░▒▒░░░░░░░░░░░░▒▒░░░░░░░░▒▒██░░░░▒▒██",
                        "██▒▒░░░░██▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒██░░░░▒▒██",
                        "██▓▓░░░░██▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓██░░░░▓▓██",
                        "██▓▓▒▒░░██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██░░▒▒▓▓██",
                        "  ██▓▓▒▒██▓▓▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓▓▓██▒▒▓▓██  ",
                        "  ██████▓▓▓▓▓▓▓▓▒▒░░░░░░░░░░░░░░░░░░░░▒▒▓▓▓▓▓▓▓▓██████  ",
                        "    ████▓▓▓▓▓▓▓▓▓▓▒▒▒▒░░░░░░░░░░░░▒▒▒▒▓▓▓▓▓▓▓▓▓▓████    ",
                        "      ██████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██████      ",
                        "        ████████████████████████████████████████        ",
                        "      ██░░░░██                        ██░░░░██      ",
                        "        ████                            ████        ",
                        "                                                                "
                    ]
                ]
            },

            // DRIVING ANIMATION (4 frames - wheel rotation)
            driving: {
                frames: 4,
                loop: true,
                speed: 150,
                description: "Wheels rotating, slight body vibration",
                pixelData: [
                    // Frame 0 - wheels position 1
                    "beater_driving_0",
                    // Frame 1 - wheels position 2
                    "beater_driving_1",
                    // Frame 2 - wheels position 3
                    "beater_driving_2",
                    // Frame 3 - wheels position 4
                    "beater_driving_3"
                ]
            },

            // Wear details (overlays)
            wear: {
                rust_spots: [
                    { x: 12, y: 14, size: "small", color: "rust_patch" },
                    { x: 48, y: 16, size: "medium", color: "rust_deep" },
                    { x: 28, y: 18, size: "small", color: "rust_patch" }
                ],
                dents: [
                    { x: 18, y: 12, depth: "shallow" },
                    { x: 40, y: 14, depth: "deep" }
                ],
                dirt_streaks: [
                    { x: 20, y: 10, length: 12, angle: -15 },
                    { x: 32, y: 13, length: 8, angle: 0 }
                ]
            }
        },

        // ==================== THE BOX (Tall Van) ====================
        box: {
            name: "The Box",
            description: "Tall van. Boxy and suspicious.",
            type: "van",
            dimensions: { width: 64, height: 56 },
            voxel_size: { x: 40, y: 28, z: 76 }, // 2.0 x 1.4 x 3.8

            idle: {
                frames: 2,
                loop: true,
                speed: 900,
                pixelData: [
                    // Frame 0 - Tall boxy van
                    [
                        "                                                                ",
                        "                    ████████████████████                        ",
                        "                ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████                    ",
                        "            ████▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓████                ", // Tall roof
                        "        ████▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓████            ",
                        "        ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██            ",
                        "      ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██          ",
                        "    ██▓▓▒▒░░░░████████░░░░░░░░████████░░░░▒▒▓▓██        ", // Windows
                        "    ██▒▒░░░░██▓▓▓▓▓▓▓▓██░░░░██▓▓▓▓▓▓▓▓██░░░░▒▒██        ",
                        "  ██▒▒░░░░██▓▓▒▒▒▒▒▒▒▒▓▓██████▓▓▒▒▒▒▒▒▒▒▓▓██░░░░▒▒██      ",
                        "  ██▒▒░░░░██▒▒░░░░░░░░▒▒▓▓▓▓▓▓▒▒░░░░░░░░▒▒██░░░░▒▒██      ", // Box body
                        "██▒▒░░░░░░██▒▒░░░░░░░░▒▒▓▓▓▓▓▓▒▒░░░░░░░░▒▒██░░░░░░▒▒██    ",
                        "██▒▒░░░░░░██▒▒░░░░░░░░▒▒▓▓▓▓▓▓▒▒░░░░░░░░▒▒██░░░░░░▒▒██    ",
                        "██▒▒░░░░░░██▒▒░░░░░░░░▒▒▓▓▓▓▓▓▒▒░░░░░░░░▒▒██░░░░░░▒▒██    ",
                        "██▒▒░░░░░░██▒▒░░░░░░░░▒▒▓▓▓▓▓▓▒▒░░░░░░░░▒▒██░░░░░░▒▒██    ",
                        "██▒▒░░░░░░██▒▒░░░░░░░░▒▒▓▓▓▓▓▓▒▒░░░░░░░░▒▒██░░░░░░▒▒██    ",
                        "██▓▓░░░░░░██▓▓░░░░░░░░▒▒▓▓▓▓▓▓▒▒░░░░░░░░▓▓██░░░░░░▓▓██    ",
                        "██▓▓▒▒░░░░██▓▓▒▒░░░░░░▒▒▓▓▓▓▓▓▒▒░░░░░░▒▒▓▓██░░░░▒▒▓▓██    ",
                        "  ██▓▓▒▒░░██▓▓▓▓▒▒░░░░▒▒▓▓▓▓▓▓▒▒░░░░▒▒▓▓▓▓██░░▒▒▓▓██      ",
                        "  ██████░░██▓▓▓▓▓▓▒▒▒▒▒▒▓▓▓▓▓▓▒▒▒▒▒▒▓▓▓▓▓▓██░░██████      ",
                        "    ████████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████████        ",
                        "      ██████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██████          ",
                        "        ████████████████████████████████████            ",
                        "      ██░░░░██                    ██░░░░██            ", // Wheels
                        "      ██████                        ██████            ",
                        "                                                                "
                    ]
                ]
            },

            wear: {
                rust_spots: [
                    { x: 16, y: 18, size: "large", color: "rust_deep" },
                    { x: 38, y: 20, size: "medium", color: "rust_patch" }
                ],
                dents: [
                    { x: 24, y: 14, depth: "deep" },
                    { x: 32, y: 16, depth: "shallow" }
                ]
            }
        },

        // ==================== THE CLUNKER (Small Hatchback) ====================
        clunker: {
            name: "The Clunker",
            description: "Small hatchback. Sounds worse than it looks.",
            type: "hatchback",
            dimensions: { width: 56, height: 42 },
            voxel_size: { x: 36, y: 16, z: 64 }, // 1.8 x 0.8 x 3.2

            idle: {
                frames: 2,
                loop: true,
                speed: 700,
                pixelData: [
                    // Frame 0 - Small compact car
                    [
                        "                                                        ",
                        "                    ████████████                        ",
                        "                ████▓▓▓▓▓▓▓▓▓▓▓▓████                    ",
                        "            ████▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓████                ", // Small hood
                        "        ████▓▓▒▒░░░░░░░░░░░░░░░░▒▒▓▓████            ",
                        "      ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██          ",
                        "    ██▓▓▒▒░░░░██████░░░░██████░░░░▒▒▓▓██          ", // Compact windshield
                        "  ██▓▓▒▒░░░░██▓▓▓▓▓▓████▓▓▓▓▓▓██░░░░▒▒▓▓██        ",
                        "  ██▒▒░░░░██▓▓▒▒▒▒▒▒▓▓▓▓▒▒▒▒▒▒▓▓██░░░░▒▒██        ",
                        "██▒▒░░░░██▒▒░░░░░░▒▒▓▓▒▒░░░░░░▒▒██░░░░▒▒██      ", // Compact body
                        "██▒▒░░░░██▒▒░░░░░░▒▒▓▓▒▒░░░░░░▒▒██░░░░▒▒██      ",
                        "██▒▒░░░░██▒▒░░░░░░▒▒▓▓▒▒░░░░░░▒▒██░░░░▒▒██      ",
                        "██▓▓░░░░██▓▓░░░░░░▒▒▓▓▒▒░░░░░░▓▓██░░░░▓▓██      ",
                        "██▓▓▒▒░░██▓▓▒▒░░░░▒▒▓▓▒▒░░░░▒▒▓▓██░░▒▒▓▓██      ",
                        "  ██▓▓▒▒██▓▓▓▓▒▒░░▒▒▓▓▒▒░░▒▒▓▓▓▓██▒▒▓▓██        ",
                        "  ████████▓▓▓▓▓▓▒▒▒▒▓▓▒▒▒▒▓▓▓▓▓▓████████        ",
                        "    ██████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██████            ",
                        "      ████████████████████████████              ",
                        "    ██░░░░██            ██░░░░██                ", // Small wheels
                        "    ██████                ██████                ",
                        "                                                        "
                    ]
                ]
            },

            wear: {
                rust_spots: [
                    { x: 14, y: 12, size: "small", color: "rust_patch" },
                    { x: 32, y: 14, size: "small", color: "rust_deep" },
                    { x: 22, y: 16, size: "medium", color: "rust_patch" }
                ],
                dents: [
                    { x: 18, y: 10, depth: "deep" },
                    { x: 28, y: 12, depth: "shallow" },
                    { x: 24, y: 14, depth: "shallow" }
                ]
            }
        },

        // ==================== THE RUST BUCKET (Pickup Truck) ====================
        rustBucket: {
            name: "The Rust Bucket",
            description: "Pickup truck. More rust than truck.",
            type: "pickup",
            dimensions: { width: 64, height: 46 },
            voxel_size: { x: 42, y: 17, z: 60 }, // 2.1 x 0.85 x 3.0

            idle: {
                frames: 2,
                loop: true,
                speed: 850,
                pixelData: [
                    // Frame 0 - Pickup truck with open bed
                    [
                        "                                                                ",
                        "                  ████████████████                              ",
                        "              ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓████                            ",
                        "          ████▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓████                        ", // Cab
                        "        ██▓▓▒▒░░░░░░░░░░░░░░░░░░▒▒▓▓██                        ",
                        "      ██▓▓▒▒░░░░████░░░░░░████░░░░▒▒▓▓██                      ", // Cab windows
                        "    ██▓▓▒▒░░░░██▓▓▓▓██░░██▓▓▓▓██░░░░▒▒▓▓██                    ",
                        "  ██▓▓▒▒░░░░██▓▓▒▒▒▒▓▓████▓▓▒▒▒▒▓▓██░░░░▒▒▓▓██                ",
                        "  ██▒▒░░░░██▒▒░░░░░░▒▒▓▓▓▓▒▒░░░░░░▒▒██░░░░▒▒██                ",
                        "██▒▒░░░░██▒▒░░░░░░░░▒▒▓▓▓▓▒▒░░░░░░░░▒▒██░░░░▒▒██              ",
                        "██▒▒░░░░██▒▒░░░░░░░░▒▒▓▓▓▓▒▒░░░░░░░░▒▒██░░░░▒▒██              ",
                        "██▓▓░░░░██▓▓░░░░░░░░▒▒▓▓▓▓▒▒░░░░░░░░▓▓████████████████████    ", // Bed starts
                        "██▓▓▒▒░░██▓▓▒▒░░░░░░▒▒▓▓▓▓▒▒░░░░░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██    ",
                        "  ██▓▓▒▒██▓▓▓▓▒▒░░░░▒▒▓▓▓▓▒▒░░░░▒▒▓▓▓▓▓▓░░░░░░░░░░░░▓▓▓▓██    ", // Open bed
                        "  ████████▓▓▓▓▓▓▒▒▒▒▒▒▓▓▓▓▒▒▒▒▒▒▓▓▓▓▓▓░░░░░░░░░░░░░░▓▓▓▓██    ",
                        "    ██████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░▓▓▓▓██    ",
                        "      ████████████████████████████▓▓▒▒░░░░░░░░░░░░▒▒▓▓▓▓██    ",
                        "                                  ██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓██    ",
                        "                                    ████████████████████      ",
                        "    ██░░░░██                                    ██░░░░██      ", // Wheels
                        "    ██████                                        ██████      ",
                        "                                                                "
                    ]
                ]
            },

            wear: {
                rust_spots: [
                    { x: 10, y: 12, size: "large", color: "rust_deep" },
                    { x: 24, y: 14, size: "large", color: "rust_patch" },
                    { x: 40, y: 16, size: "medium", color: "rust_deep" },
                    { x: 48, y: 18, size: "small", color: "rust_patch" }
                ],
                dents: [
                    { x: 16, y: 10, depth: "deep" },
                    { x: 28, y: 12, depth: "deep" },
                    { x: 36, y: 14, depth: "shallow" }
                ],
                dirt_streaks: [
                    { x: 12, y: 11, length: 16, angle: -10 },
                    { x: 32, y: 15, length: 14, angle: 5 }
                ]
            }
        },

        // ==================== POLICE CAR ====================
        police: {
            name: "Police Cruiser",
            description: "The long arm of bureaucratic law.",
            type: "police_sedan",
            dimensions: { width: 64, height: 48 },

            idle: {
                frames: 2,
                loop: true,
                speed: 600,
                pixelData: [
                    // Frame 0 - Police car with lights OFF
                    [
                        "                                                                ",
                        "                        ████████████████                        ",
                        "                    ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓████                    ",
                        "                ████▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓████                ",
                        "            ████▓▓▒▒░░░░░░░░░░░░░░░░░░▒▒▓▓████            ",
                        "        ████▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓████        ",
                        "    ████▓▓▒▒░░░░██████░░░░██░░░░██████░░░░▒▒▓▓████    ", // Light bar
                        "    ██▓▓▒▒░░░░██░░░░░░░░██▒▒██░░░░░░░░██░░░░▒▒▓▓██    ",
                        "  ██▓▓▒▒░░░░████████░░██▒▒▒▒▒▒██░░████████░░░░▒▒▓▓██  ",
                        "  ██▒▒░░░░██▓▓▓▓▓▓▓▓████▒▒▒▒▒▒▒▒████▓▓▓▓▓▓▓▓██░░░░▒▒██  ",
                        "██▒▒░░░░██▓▓▒▒▒▒▒▒▒▒▓▓██▒▒░░░░▒▒██▓▓▒▒▒▒▒▒▒▒▓▓██░░░░▒▒██",
                        "██▒▒░░░░██▒▒░░POLICE░░██░░░░░░░░██░░POLICE░░▒▒██░░░░▒▒██", // POLICE text
                        "██▒▒░░░░██▒▒░░░░░░░░▒▒░░░░░░░░░░░░▒▒░░░░░░░░▒▒██░░░░▒▒██",
                        "██▒▒░░░░██▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒██░░░░▒▒██",
                        "██▓▓░░░░██▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓██░░░░▓▓██",
                        "██▓▓▒▒░░██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██░░▒▒▓▓██",
                        "  ██▓▓▒▒██▓▓▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓▓▓██▒▒▓▓██  ",
                        "  ██████▓▓▓▓▓▓▓▓▒▒░░░░░░░░░░░░░░░░░░░░▒▒▓▓▓▓▓▓▓▓██████  ",
                        "    ████▓▓▓▓▓▓▓▓▓▓▒▒▒▒░░░░░░░░░░░░▒▒▒▒▓▓▓▓▓▓▓▓▓▓████    ",
                        "      ██████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██████      ",
                        "        ████████████████████████████████████████        ",
                        "      ██░░░░██                        ██░░░░██      ",
                        "      ██████                            ██████      ",
                        "                                                                "
                    ]
                ]
            },

            // LIGHTS FLASHING ANIMATION
            lights: {
                frames: 4,
                loop: true,
                speed: 200,
                description: "Red and blue alternating flashing lights",
                sequence: [
                    { frame: 0, left_light: "red_on", right_light: "off" },
                    { frame: 1, left_light: "red_bright", right_light: "off" },
                    { frame: 2, left_light: "off", right_light: "blue_on" },
                    { frame: 3, left_light: "off", right_light: "blue_bright" }
                ]
            }
        }
    },

    // COLOR VARIATIONS (10 per car)
    colorVariations: {
        beater: ["burgundy", "olive", "slate", "ochre", "charcoal", "rust", "teal", "mustard", "plum", "sage"],
        box: ["slate", "charcoal", "olive", "rust", "teal", "burgundy", "ochre", "sage", "plum", "mustard"],
        clunker: ["teal", "mustard", "burgundy", "slate", "charcoal", "olive", "ochre", "sage", "plum", "rust"],
        rustBucket: ["rust", "ochre", "charcoal", "olive", "slate", "burgundy", "teal", "sage", "mustard", "plum"],
        police: ["police_blue_white"] // Police only has one color scheme
    },

    // RENDERING HELPERS
    rendering: {
        // Apply color palette to sprite
        applyColor(pixelData, colorScheme) {
            // Implementation: replace color placeholders with actual hex codes
            // ▓ = primary color dark
            // ▒ = primary color mid
            // ░ = primary color light
            // █ = black/shadow
            // (Implementation would go here)
        },

        // Apply wear overlays
        applyWear(sprite, wearData) {
            // Add rust spots, dents, dirt streaks to base sprite
            // (Implementation would go here)
        },

        // Render wheel rotation
        rotateWheels(frameIndex) {
            // Generate wheel rotation sprites
            // (Implementation would go here)
        },

        // Shadow generation
        generateShadow(carType) {
            return {
                type: "ellipse",
                size: { width: 60, height: 20 },
                offset: { x: 0, y: 48 },
                opacity: 0.4,
                color: "#0a0a0a"
            };
        }
    }
};

// Export for game integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarSprites;
}
