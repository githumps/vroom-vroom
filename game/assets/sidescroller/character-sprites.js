/**
 * CHARACTER SPRITES - PIXEL ART FOR CHARACTER CREATION
 *
 * Full-body character sprites for the character creation screen
 * Shows dystopian citizen aesthetic with customization options
 *
 * FEATURES:
 * - 6 skin tone variations (matching game character creation)
 * - Full body standing pose (64x96 pixels)
 * - Prison orange jumpsuit
 * - Expressive, defeated posture
 * - Disco Elysium muted aesthetic
 *
 * STYLE: Isometric pixel art, readable, atmospheric
 *
 * @version 1.0.0
 * @artist isometric-pixel-artist agent
 * @date 2025-10-19
 */

const CharacterSprites = {
    metadata: {
        sprite_size: { width: 64, height: 96 },
        projection: "isometric-3/4-view",
        scale: 2,
        palette: "disco-elysium-characters"
    },

    // SKIN TONE PALETTE (6 variations from game)
    palette: {
        // Skin Tone 1 - Light
        skin_1_light: "#f4d4b8",
        skin_1_mid: "#e8c4a8",
        skin_1_shadow: "#d4a888",
        skin_1_highlight: "#ffeedd",

        // Skin Tone 2 - Fair
        skin_2_fair: "#e8c4a8",
        skin_2_mid: "#d8b498",
        skin_2_shadow: "#c8a488",
        skin_2_highlight: "#f8d4b8",

        // Skin Tone 3 - Medium
        skin_3_medium: "#d4a88c",
        skin_3_mid: "#c49874",
        skin_3_shadow: "#b48860",
        skin_3_highlight: "#e4b89c",

        // Skin Tone 4 - Tan
        skin_4_tan: "#c9a27a",
        skin_4_mid: "#b89268",
        skin_4_shadow: "#a88254",
        skin_4_highlight: "#d9b28a",

        // Skin Tone 5 - Brown
        skin_5_brown: "#a87a5c",
        skin_5_mid: "#986a4c",
        skin_5_shadow: "#885a3c",
        skin_5_highlight: "#b88a6c",

        // Skin Tone 6 - Deep
        skin_6_deep: "#7a5a4a",
        skin_6_mid: "#6a4a3a",
        skin_6_shadow: "#5a3a2a",
        skin_6_highlight: "#8a6a5a",

        // Prison Orange Uniform
        orange_bright: "#ff8c42",
        orange_mid: "#e87a32",
        orange_shadow: "#d16d2a",
        orange_dark: "#b85d1a",
        orange_highlight: "#ff9c52",

        // Hair Colors
        hair_black: "#2a2a2a",
        hair_brown: "#5a3d2a",
        hair_blonde: "#c8a868",
        hair_red: "#a84a2a",
        hair_gray: "#7a7a7a",

        // Accessories
        shoe_black: "#1a1a1a",
        shoe_shadow: "#0a0a0a",

        // Shadows
        shadow_character: "#1a1a1a",
        shadow_soft: "#2a2a2a"
    },

    // BASE CHARACTER SPRITE
    base_character: {
        name: "Dystopian Citizen (Default)",
        description: "Defeated, bureaucracy-worn individual",
        pose: "standing_slouched",

        // FULL BODY SPRITE (64x96 pixels)
        pixelData: [
            "                                                                ",
            "                                                                ",
            "                        ████████████                            ", // Hair
            "                    ████▓▓▓▓▓▓▓▓▓▓▓▓████                        ",
            "                  ██▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓██                      ",
            "                ██▓▓▒▒▒▒░░░░░░░░░░░░▒▒▒▒▓▓██                    ", // Head
            "                ██▓▓▒▒░░░░░░░░░░░░░░░░▒▒▓▓██                    ",
            "              ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░▒▒▓▓██                  ",
            "              ██▒▒░░░░██████░░░░██████░░░░▒▒██                  ", // Eyes (tired)
            "              ██▒▒░░░░██████░░░░██████░░░░▒▒██                  ",
            "              ██▒▒░░░░░░░░░░░░░░░░░░░░░░░░▒▒██                  ",
            "              ██▒▒░░░░░░░░░░████░░░░░░░░░░▒▒██                  ", // Mouth (frown)
            "                ██▒▒░░░░░░████░░░░░░░░░░▒▒██                    ",
            "                ██▒▒░░░░░░░░░░░░░░░░░░░░▒▒██                    ",
            "                  ██▓▓▒▒░░░░░░░░░░░░▒▒▓▓██                      ",
            "                    ████▓▓▓▓▒▒▒▒▒▒▓▓▓▓████                      ",
            "                      ██████████████████                        ", // Neck
            "                        ████████████████                        ",
            "                      ████████████████████                      ", // Shoulders
            "                  ████████████████████████████                  ",
            "                ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████                ", // Orange jumpsuit torso
            "              ████▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓████              ",
            "            ████▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓████            ",
            "            ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██            ",
            "          ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██            ",
            "          ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██            ",
            "          ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██            ",
            "          ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██            ",
            "          ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██            ",
            "          ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██            ", // Mid torso
            "          ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██            ",
            "        ████▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓████          ",
            "        ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██          ",
            "      ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██          ", // Arms (hanging)
            "      ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██          ",
            "      ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██          ",
            "      ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██          ",
            "      ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██          ",
            "      ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██          ",
            "      ██▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓██          ",
            "      ██▓▓▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓▓▓██          ",
            "        ██▓▓▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒▓▓▓▓██            ", // Lower torso/waist
            "          ██▓▓▓▓▓▓▒▒░░░░░░░░░░░░░░░░░░░░▒▒▓▓▓▓▓▓██            ",
            "            ████▓▓▓▓▒▒▒▒░░░░░░░░░░░░▒▒▒▒▓▓▓▓████              ",
            "              ████▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓████                ",
            "                ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████                  ",
            "                  ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████                    ", // Pelvis
            "                    ████████    ████████                      ",
            "                  ██▓▓▓▓▓▓██    ██▓▓▓▓▓▓██                    ", // Legs start
            "                  ██▒▒▒▒▒▒██    ██▒▒▒▒▒▒██                    ",
            "                ██▓▓░░░░▓▓██    ██▓▓░░░░▓▓██                  ",
            "                ██▓▓░░░░▓▓██    ██▓▓░░░░▓▓██                  ",
            "                ██▓▓░░░░▓▓██    ██▓▓░░░░▓▓██                  ",
            "                ██▓▓░░░░▓▓██    ██▓▓░░░░▓▓██                  ", // Mid leg
            "                ██▓▓░░░░▓▓██    ██▓▓░░░░▓▓██                  ",
            "                ██▓▓░░░░▓▓██    ██▓▓░░░░▓▓██                  ",
            "                ██▓▓░░░░▓▓██    ██▓▓░░░░▓▓██                  ",
            "                ██▓▓░░░░▓▓██    ██▓▓░░░░▓▓██                  ",
            "                ██▓▓░░░░▓▓██    ██▓▓░░░░▓▓██                  ",
            "                ██▓▓░░░░▓▓██    ██▓▓░░░░▓▓██                  ", // Lower leg
            "                ██▓▓▒▒▒▒▓▓██    ██▓▓▒▒▒▒▓▓██                  ",
            "                ██▓▓▓▓▓▓▓▓██    ██▓▓▓▓▓▓▓▓██                  ",
            "                  ████████        ████████                    ",
            "                ██████████        ██████████                  ", // Feet (shoes)
            "                ██▓▓▓▓▓▓██        ██▓▓▓▓▓▓██                  ",
            "                ██████████        ██████████                  ",
            "                  ████              ████                      ",
            "                                                                ",
            "              ████████                  ████████              ", // Shadow
            "            ██▓▓▓▓▓▓▓▓██              ██▓▓▓▓▓▓▓▓██            ",
            "            ████████████              ████████████            ",
            "                                                                "
        ],

        // Shading layers (applied on top of base)
        shading: {
            ambient_occlusion: true,
            edge_highlights: true,
            shadow_cast: true
        }
    },

    // SKIN TONE VARIATIONS
    variations: [
        {
            id: "skin_1",
            name: "Light",
            colors: {
                base: "skin_1_light",
                mid: "skin_1_mid",
                shadow: "skin_1_shadow",
                highlight: "skin_1_highlight"
            }
        },
        {
            id: "skin_2",
            name: "Fair",
            colors: {
                base: "skin_2_fair",
                mid: "skin_2_mid",
                shadow: "skin_2_shadow",
                highlight: "skin_2_highlight"
            }
        },
        {
            id: "skin_3",
            name: "Medium",
            colors: {
                base: "skin_3_medium",
                mid: "skin_3_mid",
                shadow: "skin_3_shadow",
                highlight: "skin_3_highlight"
            }
        },
        {
            id: "skin_4",
            name: "Tan",
            colors: {
                base: "skin_4_tan",
                mid: "skin_4_mid",
                shadow: "skin_4_shadow",
                highlight: "skin_4_highlight"
            }
        },
        {
            id: "skin_5",
            name: "Brown",
            colors: {
                base: "skin_5_brown",
                mid: "skin_5_mid",
                shadow: "skin_5_shadow",
                highlight: "skin_5_highlight"
            }
        },
        {
            id: "skin_6",
            name: "Deep",
            colors: {
                base: "skin_6_deep",
                mid: "skin_6_mid",
                shadow: "skin_6_shadow",
                highlight: "skin_6_highlight"
            }
        }
    ],

    // EXPRESSIONS/POSES
    expressions: {
        defeated: {
            description: "Slouched shoulders, downcast eyes",
            mouth: "slight_frown",
            eyes: "tired",
            posture_offset: { shoulder_drop: 2, head_tilt: -1 }
        },
        resigned: {
            description: "Acceptance of fate",
            mouth: "neutral",
            eyes: "half_closed",
            posture_offset: { shoulder_drop: 1, head_tilt: 0 }
        },
        defiant: {
            description: "Subtle rebellion",
            mouth: "smirk",
            eyes: "direct_stare",
            posture_offset: { shoulder_drop: 0, head_tilt: 1 }
        },
        nervous: {
            description: "Anxious first-timer",
            mouth: "worried",
            eyes: "wide",
            posture_offset: { shoulder_drop: 3, head_tilt: -2 }
        }
    },

    // CUSTOMIZATION OVERLAYS
    customization: {
        // Height variations
        height: {
            short: { scale_y: 0.9, offset_y: 8 },
            average: { scale_y: 1.0, offset_y: 0 },
            tall: { scale_y: 1.1, offset_y: -8 }
        },

        // Hair styles (simple overlays for character creation)
        hair: {
            short: {
                pixelData: [
                    // Simple hair cap
                    "████████████",
                    "████████████"
                ]
            },
            messy: {
                pixelData: [
                    // Irregular hair
                    "██████████████",
                    "████████████"
                ]
            },
            bald: {
                pixelData: [] // No hair overlay
            }
        }
    },

    // ANIMATION (IDLE BREATHING)
    animations: {
        idle_breathing: {
            frames: 4,
            loop: true,
            speed: 800,
            sequence: [
                { frame: 0, offset_y: 0, description: "Exhale" },
                { frame: 1, offset_y: -1, description: "Inhale start" },
                { frame: 2, offset_y: -2, description: "Inhale peak" },
                { frame: 3, offset_y: -1, description: "Exhale start" }
            ]
        }
    },

    // RENDERING HELPERS
    rendering: {
        // Apply skin tone to character sprite
        applySkinTone(basePixelData, skinToneId) {
            const toneColors = this.variations.find(v => v.id === skinToneId)?.colors;
            if (!toneColors) return basePixelData;

            // Replace color placeholders with actual skin tones
            // ░ = highlight
            // ▒ = base
            // ▓ = mid
            // █ = shadow
            // (Implementation would replace these systematically)
            return basePixelData;
        },

        // Generate shadow underneath character
        generateShadow() {
            return {
                type: "ellipse",
                size: { width: 56, height: 20 },
                offset: { x: 4, y: 90 },
                opacity: 0.4,
                color: "shadow_character"
            };
        },

        // Apply expression overlay
        applyExpression(baseSprite, expressionType) {
            const expression = this.expressions[expressionType];
            // Modify eyes, mouth, posture based on expression
            return baseSprite;
        }
    }
};

// Export for game integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterSprites;
}
