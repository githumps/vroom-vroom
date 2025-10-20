/**
 * ENVIRONMENT TILES - ISOMETRIC ROAD AND CITYSCAPE
 *
 * Dystopian city environment with Disco Elysium aesthetic
 * Tileable road segments, buildings, atmosphere
 *
 * FEATURES:
 * - Isometric road tiles (straight, curves, intersections)
 * - Cracked asphalt texture with faded markings
 * - Dystopian cityscape buildings (background layers)
 * - Street lights, signs, urban decay
 * - Atmospheric particles (dust, pollution)
 * - Time-of-day lighting support
 *
 * STYLE: Muted, oppressive, bureaucratic aesthetic
 * PROJECTION: Isometric 2:1
 *
 * @version 1.0.0
 * @artist isometric-pixel-artist agent
 * @date 2025-10-19
 */

const EnvironmentTiles = {
    metadata: {
        tile_size: { width: 128, height: 64 },
        projection: "isometric-2:1",
        scale: 2,
        palette: "disco-elysium-environment"
    },

    // DYSTOPIAN COLOR PALETTE
    palette: {
        // Asphalt and concrete (desaturated, worn)
        asphalt_dark: "#2a2a2a",
        asphalt_mid: "#3a3a3a",
        asphalt_light: "#4a4a4a",
        asphalt_crack: "#1a1a1a",
        asphalt_stain: "#2a2a1a",

        // Road markings (faded, bureaucratic)
        line_yellow_old: "#8a8a5a",
        line_yellow_faded: "#6a6a4a",
        line_white_old: "#8a8a8a",
        line_white_faded: "#6a6a6a",

        // Concrete (sidewalks, curbs)
        concrete_dark: "#4a4a4a",
        concrete_mid: "#5a5a5a",
        concrete_light: "#6a6a6a",
        concrete_crack: "#3a3a3a",

        // Buildings (background - muted, oppressive)
        building_brick_dark: "#5a3a2a",
        building_brick_mid: "#6a4a3a",
        building_concrete_dark: "#4a4a4a",
        building_concrete_mid: "#5a5a5a",
        building_window_dark: "#2a2a3a",
        building_window_lit: "#6a5a3a",
        building_window_off: "#1a1a1a",

        // Street furniture
        lamppost_metal: "#3a3a3a",
        lamppost_rust: "#6a4a2a",
        light_bulb_off: "#5a5a3a",
        light_bulb_on: "#d8c8a8",
        light_glow: "#c8b898",

        sign_metal: "#4a4a4a",
        sign_rust: "#7a5a3a",
        sign_text: "#d8d8d8",

        // Nature (sparse, dying)
        tree_dead_trunk: "#4a3a2a",
        tree_dead_branch: "#5a4a3a",
        grass_dying: "#4a5a3a",
        dirt_patch: "#5a4a3a",

        // Sky and atmosphere
        sky_oppressive: "#6a7a8a",
        sky_smog: "#7a7a7a",
        pollution_haze: "#8a8a8a",
        dust_particle: "#9a9a9a",

        // Shadows and lighting
        shadow_hard: "#1a1a1a",
        shadow_soft: "#2a2a2a",
        ambient_dark: "#0a0a0a"
    },

    // ROAD TILES
    road: {
        // ==================== STRAIGHT ROAD (Horizontal) ====================
        straight_horizontal: {
            name: "Straight Road (Horizontal)",
            dimensions: { width: 128, height: 64 },
            tileable: { left: true, right: true, top: false, bottom: false },

            pixelData: [
                // Isometric road with center line, cracks, wear
                "                                                                                                                                ",
                "                                                                                                                                ",
                "                                                    ████████████████████████                                                    ",
                "                                            ████████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████████                                            ",
                "                                    ████████▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓████████                                    ",
                "                            ████████▓▓▓▓▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▓▓▓▓████████                            ",
                "                    ████████▓▓▓▓▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▓▓▓▓████████                    ", // Upper edge
                "            ████████▓▓▓▓▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▓▓▓▓████████            ",
                "    ████████▓▓▓▓▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▓▓▓▓████████    ",
                "████▓▓▓▓▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▓▓▓▓████", // Road surface
                "▓▓▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▓▓",
                "▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒",
                "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
                "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░", // Center line (faded)
                "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
                "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
                "▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒",
                "▓▓▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▓▓",
                "████▓▓▓▓▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▓▓▓▓████",
                "    ████████▓▓▓▓▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▓▓▓▓████████    ",
                "            ████████▓▓▓▓▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▓▓▓▓████████            ",
                "                    ████████▓▓▓▓▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▓▓▓▓████████                    ",
                "                            ████████▓▓▓▓▒▒▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▒▒▓▓▓▓████████                            ",
                "                                    ████████▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓████████                                    ",
                "                                            ████████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████████                                            ",
                "                                                    ████████████████████████                                                    ",
                "                                                                                                                                "
            ],

            // Wear details (cracks, stains, faded markings)
            wear: {
                cracks: [
                    { start: { x: 20, y: 12 }, end: { x: 28, y: 15 }, width: 2 },
                    { start: { x: 56, y: 14 }, end: { x: 64, y: 16 }, width: 1 },
                    { start: { x: 88, y: 13 }, end: { x: 96, y: 17 }, width: 2 }
                ],
                stains: [
                    { x: 32, y: 14, size: "medium", color: "asphalt_stain" },
                    { x: 72, y: 15, size: "small", color: "asphalt_stain" }
                ],
                potholes: [
                    { x: 48, y: 14, size: "small", depth: "shallow" }
                ]
            }
        },

        // ==================== CURVE (LEFT TURN) ====================
        curve_left: {
            name: "Road Curve (Left)",
            dimensions: { width: 128, height: 128 },
            tileable: { left: true, right: false, top: false, bottom: true },
            description: "Smooth left turn for isometric driving"
        },

        // ==================== INTERSECTION ====================
        intersection: {
            name: "4-Way Intersection",
            dimensions: { width: 128, height: 128 },
            tileable: { left: true, right: true, top: true, bottom: true },
            description: "Crossroads with faded markings"
        }
    },

    // BACKGROUND BUILDINGS
    buildings: {
        // ==================== DYSTOPIAN APARTMENT BLOCK ====================
        apartment_block: {
            name: "Decaying Apartment Block",
            dimensions: { width: 256, height: 320 },
            layer: "far_background",
            parallax: 0.3,

            pixelData: [
                // Tall, oppressive concrete building
                // (Simplified - full implementation would have all pixels)
                "// Concrete brutalist architecture",
                "// Repeating windows (some lit, most dark)",
                "// Crumbling facade",
                "// Atmospheric perspective (lighter at top)"
            ],

            windows: {
                grid: { rows: 12, columns: 8 },
                lit_probability: 0.15,
                patterns: ["dark", "dim_yellow", "flickering", "broken"]
            }
        },

        // ==================== FACTORY SMOKESTACK ====================
        factory: {
            name: "Industrial Factory",
            dimensions: { width: 180, height: 280 },
            layer: "far_background",
            parallax: 0.4,

            features: {
                smokestacks: 3,
                smoke_animation: true,
                pollution_particles: true
            }
        },

        // ==================== STREET LEVEL SHOPS ====================
        shops: {
            name: "Street-Level Storefronts",
            dimensions: { width: 192, height: 128 },
            layer: "mid_background",
            parallax: 0.6,

            variants: [
                "closed_shop",
                "neon_sign_broken",
                "boarded_windows",
                "bureaucratic_office"
            ]
        }
    },

    // STREET FURNITURE
    furniture: {
        // ==================== LAMPPOST ====================
        lamppost: {
            name: "Street Lamp",
            dimensions: { width: 24, height: 96 },

            pixelData: [
                "        ████████        ",
                "      ██▓▓▓▓▓▓▓▓██      ", // Light fixture
                "      ██▒▒▒▒▒▒▒▒██      ",
                "        ████████        ",
                "          ████          ",
                "          ▓▓▓▓          ", // Pole
                "          ▓▓▓▓          ",
                "          ▓▓▓▓          ",
                "          ▓▓▓▓          ",
                "          ▓▓▓▓          ",
                "          ▓▓▓▓          ",
                "        ████████        ", // Base
                "      ██████████        "
            ],

            states: {
                off: { light_color: "light_bulb_off", glow: false },
                on: { light_color: "light_bulb_on", glow: true, glow_radius: 48 },
                flickering: { animation: true, flicker_speed: 300 }
            },

            placement: {
                spacing: 256, // Every 2 tiles
                side: "both" // Left and right of road
            }
        },

        // ==================== ROAD SIGN ====================
        sign: {
            name: "Road Sign",
            dimensions: { width: 32, height: 64 },

            variants: [
                {
                    type: "speed_limit",
                    text: "SLOW",
                    condition: "rusty, faded"
                },
                {
                    type: "warning",
                    text: "OBEY",
                    condition: "bureaucratic"
                },
                {
                    type: "directional",
                    text: "→ NOWHERE",
                    condition: "cynical"
                }
            ]
        },

        // ==================== FIRE HYDRANT ====================
        hydrant: {
            name: "Fire Hydrant",
            dimensions: { width: 16, height: 24 },

            pixelData: [
                "      ████      ",
                "    ████████    ",
                "    ██▓▓▓▓██    ",
                "    ██▓▓▓▓██    ",
                "  ████▓▓▓▓████  ",
                "  ██▒▒▓▓▓▓▒▒██  ",
                "    ████████    ",
                "      ████      "
            ],

            color: "rust_mid"
        },

        // ==================== TRASH CAN ====================
        trash_can: {
            name: "Overflowing Trash",
            dimensions: { width: 20, height: 28 },
            description: "Dystopian garbage aesthetic"
        }
    },

    // ATMOSPHERIC EFFECTS
    atmosphere: {
        // ==================== DUST PARTICLES ====================
        dust: {
            name: "Floating Dust/Pollution",
            count: 100,
            size_range: [1, 4],
            speed_range: [0.1, 0.5],
            opacity_range: [0.1, 0.3],
            color: "dust_particle",

            behavior: {
                drift: "horizontal_left",
                sway: true,
                fade: true
            }
        },

        // ==================== SMOKE PLUMES ====================
        smoke: {
            name: "Factory Smoke",
            source: "factory_smokestack",
            particles: 50,
            size_range: [8, 24],
            speed: 0.3,
            opacity_range: [0.2, 0.5],
            color: "pollution_haze",

            animation: {
                rise: true,
                dissipate: true,
                wind_sway: true
            }
        },

        // ==================== LIGHT RAYS ====================
        light_rays: {
            name: "Oppressive Sunlight",
            type: "god_rays",
            angle: -45,
            opacity: 0.15,
            color: "#d8c8a8",

            time_based: true,
            times: {
                morning: { opacity: 0.25, angle: -60 },
                noon: { opacity: 0.3, angle: -45 },
                afternoon: { opacity: 0.2, angle: -30 },
                evening: { opacity: 0.15, angle: -15 }
            }
        },

        // ==================== HAZE ====================
        haze: {
            name: "Atmospheric Haze",
            type: "gradient_overlay",
            layers: 3,

            gradient: {
                start: "rgba(138, 138, 138, 0)",
                mid: "rgba(138, 138, 138, 0.15)",
                end: "rgba(106, 122, 138, 0.25)"
            }
        }
    },

    // PARALLAX LAYERS
    parallax: {
        layers: [
            { name: "far_background", speed: 0.2, z: -500 },   // Distant buildings
            { name: "mid_background", speed: 0.4, z: -250 },   // Mid-distance structures
            { name: "near_background", speed: 0.6, z: -100 },  // Street furniture
            { name: "road_layer", speed: 1.0, z: 0 },          // Active road
            { name: "foreground", speed: 1.2, z: 50 }          // Dust, particles
        ]
    },

    // TIME OF DAY LIGHTING
    lighting: {
        morning: {
            sky_color: "#8aa8c8",
            ambient: "#b8c8d8",
            shadow: "#2a2a3a",
            lamp_state: "off"
        },
        noon: {
            sky_color: "#7a9ac8",
            ambient: "#d8d8e8",
            shadow: "#1a1a2a",
            lamp_state: "off"
        },
        afternoon: {
            sky_color: "#8a9ab8",
            ambient: "#c8c8d8",
            shadow: "#2a2a3a",
            lamp_state: "off"
        },
        evening: {
            sky_color: "#6a7a9a",
            ambient: "#8a8a9a",
            shadow: "#1a1a2a",
            lamp_state: "on"
        },
        night: {
            sky_color: "#2a3a4a",
            ambient: "#3a4a5a",
            shadow: "#0a0a1a",
            lamp_state: "on"
        }
    }
};

// Export for game integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnvironmentTiles;
}
