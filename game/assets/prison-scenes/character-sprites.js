/**
 * PRISON CHARACTER SPRITES - PIXEL ART DATA
 * Inmate and guard character designs with animations
 *
 * STYLE: Isometric pixel art, readable at small sizes
 * PALETTE: Prison orange, guard blue, diverse skin tones
 * ANIMATIONS: Walk cycles, idle states, activity-specific
 */

const PrisonCharacterSprites = {
    metadata: {
        sprite_size: { width: 32, height: 48 },
        scale: 2,
        projection: "isometric-2:1",
        frame_rate: 8, // 8 fps for pixel art economy
        palette: "disco-elysium-characters"
    },

    // COLOR PALETTE
    palette: {
        // Skin Tones (5 variations for diversity)
        skin_1_light: "#f4d4b8",
        skin_1_mid: "#e8c4a8",
        skin_1_shadow: "#d4a888",

        skin_2_medium: "#d4a88c",
        skin_2_mid: "#c89874",
        skin_2_shadow: "#a8785c",

        skin_3_tan: "#c9a27a",
        skin_3_mid: "#b89268",
        skin_3_shadow: "#9a7a54",

        skin_4_dark: "#8d5524",
        skin_4_mid: "#7a4818",
        skin_4_shadow: "#5a3810",

        skin_5_deep: "#5a3d2a",
        skin_5_mid: "#4a2d1a",
        skin_5_shadow: "#3a1d0a",

        // Prison Orange Uniform
        orange_bright: "#ff8c42",
        orange_mid: "#e87a32",
        orange_shadow: "#d16d2a",
        orange_dark: "#a85820",

        // Guard Uniform (Blue-Gray)
        guard_blue: "#3d5a7a",
        guard_mid: "#2d4a6a",
        guard_shadow: "#1d3a5a",
        guard_badge: "#c8c8a8",

        // Hair Colors
        hair_black: "#2a2a2a",
        hair_brown: "#5a3d2a",
        hair_blonde: "#c8a868",
        hair_red: "#a84a2a",
        hair_gray: "#8a8a8a",
        hair_white: "#d8d8d8",

        // Accessories
        tattoo_ink: "#1a1a1a",
        shackle_metal: "#6a6a6a",
        shoe_black: "#2a2a2a"
    },

    // INMATE SPRITE VARIATIONS
    inmates: {
        // BASE INMATE (Template)
        base_inmate: {
            name: "Generic Inmate",
            body_type: "average",
            skin_tone: "skin_2_medium",
            hair_style: "short",
            hair_color: "hair_brown",
            uniform: "prison_orange",
            accessories: [],

            // IDLE ANIMATION (4 frames)
            animations: {
                idle: {
                    frames: 4,
                    loop: true,
                    speed: 500, // ms per frame
                    sequence: [
                        {
                            frame: 0,
                            pixelData: [
                                "            ████████            ",
                                "          ██▓▓▓▓▓▓▓▓██          ",
                                "        ██▓▓▒▒▒▒▒▒▒▒▓▓██        ", // Head
                                "        ██▒▒░░░░░░░░▒▒██        ",
                                "          ████████████          ",
                                "        ████████████████        ", // Shoulders
                                "      ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██      ",
                                "    ██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██    ", // Torso
                                "    ██▒▒░░░░░░░░░░░░░░▒▒██    ",
                                "    ██▒▒░░░░░░░░░░░░░░▒▒██    ",
                                "      ██▒▒░░░░░░░░░░▒▒██      ",
                                "      ██▒▒░░░░░░░░░░▒▒██      ",
                                "        ████      ████        ", // Arms
                                "        ████      ████        ",
                                "      ██▓▓██      ██▓▓██      ",
                                "      ██▓▓██      ██▓▓██      ",
                                "        ████      ████        ", // Legs
                                "        ████      ████        ",
                                "        ████      ████        ",
                                "      ██████      ██████      ",
                                "      ██▓▓██      ██▓▓██      "
                            ]
                        },
                        {
                            frame: 1,
                            description: "Slight breathing motion",
                            offset_y: 1
                        },
                        {
                            frame: 2,
                            description: "Return to neutral",
                            offset_y: 0
                        },
                        {
                            frame: 3,
                            description: "Breathing motion",
                            offset_y: 1
                        }
                    ]
                },

                // WALK CYCLE (8 frames)
                walk: {
                    frames: 8,
                    loop: true,
                    speed: 120,
                    sequence: [
                        { frame: 0, description: "Left foot forward" },
                        { frame: 1, description: "Mid-stride left" },
                        { frame: 2, description: "Contact" },
                        { frame: 3, description: "Right foot forward" },
                        { frame: 4, description: "Mid-stride right" },
                        { frame: 5, description: "Contact" },
                        { frame: 6, description: "Return left" },
                        { frame: 7, description: "Return right" }
                    ]
                },

                // WORKING OUT (Weights)
                lifting: {
                    frames: 6,
                    loop: true,
                    speed: 400,
                    sequence: [
                        { frame: 0, description: "Arms down, grip bar" },
                        { frame: 1, description: "Lift start" },
                        { frame: 2, description: "Lift up" },
                        { frame: 3, description: "Peak" },
                        { frame: 4, description: "Lower" },
                        { frame: 5, description: "Return to start" }
                    ]
                },

                // SITTING (Reading/Eating)
                sitting: {
                    frames: 3,
                    loop: true,
                    speed: 800,
                    sequence: [
                        { frame: 0, description: "Sitting neutral" },
                        { frame: 1, description: "Lean forward" },
                        { frame: 2, description: "Lean back" }
                    ]
                },

                // TALKING (Animated dialogue)
                talking: {
                    frames: 4,
                    loop: true,
                    speed: 200,
                    sequence: [
                        { frame: 0, description: "Mouth closed" },
                        { frame: 1, description: "Mouth open" },
                        { frame: 2, description: "Mouth wide" },
                        { frame: 3, description: "Mouth closed" }
                    ]
                },

                // PUNCHING (Bag)
                punching: {
                    frames: 4,
                    loop: false,
                    speed: 150,
                    sequence: [
                        { frame: 0, description: "Wind up" },
                        { frame: 1, description: "Punch extend" },
                        { frame: 2, description: "Impact" },
                        { frame: 3, description: "Retract" }
                    ]
                }
            }
        },

        // INMATE ARCHETYPES
        archetypes: [
            {
                id: "big_guy",
                name: "The Big Guy",
                body_type: "muscular",
                skin_tone: "skin_4_dark",
                hair_style: "bald",
                height_modifier: 1.2,
                width_modifier: 1.3,
                strength: "high",
                accessories: ["neck_tattoo", "bicep_tattoo"],
                personality: "intimidating",
                gang_likely: "roadWarriors"
            },
            {
                id: "nervous_newbie",
                name: "Nervous Newbie",
                body_type: "skinny",
                skin_tone: "skin_1_light",
                hair_style: "messy",
                hair_color: "hair_blonde",
                height_modifier: 0.9,
                width_modifier: 0.8,
                accessories: ["glasses"],
                personality: "anxious",
                idle_animation_variant: "fidgeting"
            },
            {
                id: "old_timer",
                name: "Old Timer",
                body_type: "average",
                skin_tone: "skin_3_tan",
                hair_style: "receding",
                hair_color: "hair_gray",
                height_modifier: 0.95,
                accessories: ["mustache", "prison_tats_extensive"],
                personality: "world_weary",
                gang_likely: "turnSignals"
            },
            {
                id: "gang_leader",
                name: "Gang Leader",
                body_type: "athletic",
                skin_tone: "skin_2_medium",
                hair_style: "slicked",
                hair_color: "hair_black",
                accessories: ["face_scar", "gang_tattoo_prominent"],
                personality: "commanding",
                gang_likely: "roadWarriors"
            },
            {
                id: "bookworm",
                name: "The Bookworm",
                body_type: "skinny",
                skin_tone: "skin_1_light",
                hair_style: "neat",
                hair_color: "hair_brown",
                accessories: ["glasses", "book_in_hand"],
                personality: "intellectual",
                gang_likely: "safeDrivers"
            },
            {
                id: "troublemaker",
                name: "Troublemaker",
                body_type: "wiry",
                skin_tone: "skin_3_tan",
                hair_style: "mohawk",
                hair_color: "hair_red",
                accessories: ["eyebrow_scar", "knuckle_tats"],
                personality: "aggressive",
                gang_likely: "roadWarriors"
            },
            {
                id: "quiet_giant",
                name: "Quiet Giant",
                body_type: "very_large",
                skin_tone: "skin_5_deep",
                hair_style: "short",
                hair_color: "hair_black",
                height_modifier: 1.4,
                width_modifier: 1.5,
                personality: "gentle",
                gang_likely: null
            },
            {
                id: "con_artist",
                name: "Con Artist",
                body_type: "average",
                skin_tone: "skin_2_medium",
                hair_style: "styled",
                hair_color: "hair_brown",
                accessories: ["charming_smile"],
                personality: "smooth_talker",
                gang_likely: "safeDrivers"
            }
        ]
    },

    // GUARD SPRITES
    guards: {
        // BASE GUARD (Template)
        base_guard: {
            name: "Generic Guard",
            body_type: "average",
            skin_tone: "skin_2_medium",
            hair_style: "short_professional",
            hair_color: "hair_brown",
            uniform: "guard_blue",
            accessories: ["badge", "belt", "keys"],

            animations: {
                idle: {
                    frames: 2,
                    loop: true,
                    speed: 1000,
                    sequence: [
                        {
                            frame: 0,
                            pixelData: [
                                "            ████████            ",
                                "          ██▓▓▓▓▓▓▓▓██          ",
                                "        ██▓▓▒▒▒▒▒▒▒▒▓▓██        ", // Head
                                "        ██▒▒░░░░░░░░▒▒██        ",
                                "          ████████████          ",
                                "        ████████████████        ", // Shoulders
                                "      ██████████████████████      ",
                                "    ██████████████████████████    ", // Torso (blue)
                                "    ██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██    ",
                                "    ██▒▒░░░░ BADGE ░░░░▒▒██    ",
                                "      ██▒▒░░░░░░░░░░░░▒▒██      ",
                                "      ██▒▒░░░░░░░░░░░░▒▒██      ",
                                "        ████  ██  ████        ", // Arms (one holding baton)
                                "        ████  ██  ████        ",
                                "      ██▓▓██  ██  ██▓▓██      ",
                                "      ██▓▓██      ██▓▓██      ",
                                "        ████      ████        ", // Legs
                                "        ████      ████        ",
                                "        ████      ████        ",
                                "      ██████      ██████      ",
                                "      ██▓▓██      ██▓▓██      "
                            ]
                        },
                        {
                            frame: 1,
                            description: "Slight shift weight"
                        }
                    ]
                },

                patrol: {
                    frames: 8,
                    loop: true,
                    speed: 150,
                    description: "Slow, authoritative walk"
                },

                watching: {
                    frames: 3,
                    loop: true,
                    speed: 2000,
                    sequence: [
                        { frame: 0, description: "Looking straight" },
                        { frame: 1, description: "Looking left" },
                        { frame: 2, description: "Looking right" }
                    ]
                },

                command: {
                    frames: 3,
                    loop: false,
                    speed: 300,
                    sequence: [
                        { frame: 0, description: "Arm down" },
                        { frame: 1, description: "Arm raising, pointing" },
                        { frame: 2, description: "Pointing, authoritative" }
                    ]
                }
            }
        },

        // GUARD PERSONALITIES
        personalities: [
            {
                id: "hardass",
                name: "Officer Hardcastle Jr.",
                body_type: "stocky",
                skin_tone: "skin_1_light",
                hair_style: "crew_cut",
                hair_color: "hair_brown",
                accessories: ["sunglasses_always", "frown"],
                personality: "strict",
                dialogue_style: "barking"
            },
            {
                id: "lazy_guard",
                name: "Officer Donut",
                body_type: "overweight",
                skin_tone: "skin_2_medium",
                hair_style: "balding",
                accessories: ["coffee_mug", "half_asleep"],
                personality: "indifferent",
                dialogue_style: "bored"
            },
            {
                id: "rookie",
                name: "Officer Greenhorn",
                body_type: "skinny",
                skin_tone: "skin_1_light",
                hair_style: "neat",
                hair_color: "hair_blonde",
                accessories: ["nervous_eyes"],
                personality: "uncertain",
                dialogue_style: "hesitant"
            },
            {
                id: "friendly_guard",
                name: "Officer Williams",
                body_type: "average",
                skin_tone: "skin_4_dark",
                hair_style: "short",
                accessories: ["kind_eyes"],
                personality: "sympathetic",
                dialogue_style: "understanding",
                manicure_available: true
            },
            {
                id: "corrupt_guard",
                name: "Officer Bribe",
                body_type: "average",
                skin_tone: "skin_3_tan",
                hair_style: "slicked",
                accessories: ["shifty_eyes", "expensive_watch"],
                personality: "greedy",
                dialogue_style: "insinuating"
            }
        ]
    },

    // SPRITE GENERATION HELPERS
    generation: {
        // Body type modifiers (apply to base template)
        body_types: {
            skinny: { width: 0.8, muscle: 0.6 },
            wiry: { width: 0.85, muscle: 0.8 },
            average: { width: 1.0, muscle: 1.0 },
            athletic: { width: 1.05, muscle: 1.3 },
            muscular: { width: 1.2, muscle: 1.6 },
            stocky: { width: 1.3, muscle: 1.2 },
            overweight: { width: 1.4, muscle: 0.9 },
            very_large: { width: 1.5, muscle: 1.5 }
        },

        // Hair styles (pixel patterns)
        hair_styles: {
            bald: { pattern: "none" },
            short: { pattern: "3px_coverage" },
            messy: { pattern: "4px_irregular" },
            neat: { pattern: "3px_combed" },
            receding: { pattern: "2px_horseshoe" },
            slicked: { pattern: "4px_back" },
            mohawk: { pattern: "center_spike_6px" },
            crew_cut: { pattern: "2px_flat_top" },
            balding: { pattern: "2px_sides_only" },
            styled: { pattern: "4px_side_part" }
        },

        // Accessory overlays
        accessories: {
            glasses: {
                position: { x: 0, y: 6 },
                pixelData: ["  ██    ██  ", "  ████████  "]
            },
            mustache: {
                position: { x: 0, y: 9 },
                pixelData: ["    ██████    "]
            },
            neck_tattoo: {
                position: { x: 0, y: 12 },
                color: "tattoo_ink",
                pattern: "tribal"
            },
            bicep_tattoo: {
                position: { x: -4, y: 18 },
                color: "tattoo_ink",
                pattern: "flame"
            },
            face_scar: {
                position: { x: 2, y: 7 },
                pixelData: ["  ██  ", "    ██", "      ██"]
            },
            badge: {
                position: { x: 0, y: 20 },
                color: "guard_badge",
                pixelData: [
                    "  ████  ",
                    "████████",
                    "████████",
                    "  ████  "
                ]
            },
            keys: {
                position: { x: 6, y: 22 },
                animated: true,
                jingle: true
            }
        }
    },

    // INTERACTION INDICATORS
    indicators: {
        // Hover/selection highlight
        selection: {
            type: "outline",
            color: "#0f0",
            thickness: 2,
            animated: true,
            pulse_speed: 300
        },

        // Talk indicator (above head)
        talk_bubble: {
            position: { x: 0, y: -20 },
            size: { width: 24, height: 16 },
            pixelData: [
                "  ████████████████  ",
                "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                "██▒▒░░ ... ░░▒▒██",
                "██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██",
                "  ██████  ████  "
            ],
            animated: true
        },

        // Action icon (working out, reading, etc)
        activity_icon: {
            position: { x: 0, y: -25 },
            size: { width: 16, height: 16 },
            variants: {
                lifting: "💪", // Could be pixel icon
                reading: "📖",
                eating: "🍽️",
                sleeping: "💤"
            }
        },

        // Gang affiliation marker
        gang_marker: {
            position: { x: -16, y: -10 },
            size: { width: 12, height: 12 },
            variants: {
                safeDrivers: { color: "#3a5a8a", symbol: "shield" },
                turnSignals: { color: "#5a8a3a", symbol: "arrow" },
                roadWarriors: { color: "#8a3a3a", symbol: "flame" }
            }
        },

        // Emotion indicators
        emotions: {
            angry: {
                icon: "anger_lines",
                position: { x: 0, y: -18 },
                color: "#c83a3a"
            },
            happy: {
                icon: "musical_note",
                position: { x: 0, y: -18 },
                color: "#3ac83a"
            },
            confused: {
                icon: "question_mark",
                position: { x: 0, y: -18 },
                color: "#c8c83a"
            }
        }
    },

    // SHADOW GENERATION
    shadows: {
        inmate: {
            type: "ellipse",
            size: { width: 28, height: 12 },
            offset: { x: 0, y: 48 },
            opacity: 0.4,
            color: "#0a0a0a"
        },
        guard: {
            type: "ellipse",
            size: { width: 30, height: 14 },
            offset: { x: 0, y: 48 },
            opacity: 0.5,
            color: "#0a0a0a"
        }
    }
};

// Export for game integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterSprites;
}
