// ==================== JUDGE HARDCASTLE PIXEL ART SPRITE DATA ====================
// VROOM VROOM - Disco Elysium Inspired Judge Sprites
// Designed for 128x128 pixel sprite resolution
// All sprites use limited Disco Elysium-inspired palette

// PALETTE (Disco Elysium inspired - warm, oppressive tones)
const JUDGE_PALETTE = {
    // Skin tones (desaturated, bureaucratic)
    skin_base: '#c5a789',
    skin_shadow: '#9a7d5f',
    skin_highlight: '#d4b89a',

    // Angry skin progression
    skin_irritated: '#c59f85',
    skin_angry: '#cc8870',
    skin_furious: '#dd6655',
    skin_apoplectic: '#ee5544',
    skin_volcanic: '#aa2244',

    // Judicial robes
    robe_black: '#0a0a0a',
    robe_shadow: '#000000',
    collar_white: '#f5f5f5',
    collar_shadow: '#d8d8d8',

    // Wig (powdered judicial wig)
    wig_white: '#e8e8e8',
    wig_shadow: '#c0c0c0',
    wig_highlight: '#ffffff',

    // Features
    eye_black: '#000000',
    eye_white: '#ffffff',
    eyebrow_dark: '#2a2015',
    mustache_grey: '#4a4a4a',
    mouth_dark: '#1a0f08',

    // Veins (anger states)
    vein_red: '#8b0000',
    vein_dark: '#660000',
    vein_black: '#000000',

    // Gavel
    gavel_handle: '#4a3520',
    gavel_head: '#5a4530',
    gavel_highlight: '#6d5840',

    // Background/desk
    desk_mahogany: '#3d2f1f',
    desk_shadow: '#2a2015',
    desk_highlight: '#52403a',
    wood_grain: '#241810',

    // Atmosphere
    bg_dark: '#1a1612',
    vignette: '#000000',
    dust_light: '#8a7f6f',
    dust_dark: '#3d3530'
};

// SPRITE STATES (maps to patience levels 0-100)
const JUDGE_STATES = {
    NEUTRAL: {
        patienceRange: [0, 15],
        skinColor: JUDGE_PALETTE.skin_base,
        eyebrowAngle: 0,      // pixels of eyebrow droop (0 = neutral)
        mouthCurve: 0,        // pixels of mouth frown (0 = neutral)
        veinCount: 0,
        shakeIntensity: 0,
        description: "Bored but professional"
    },
    IRRITATED: {
        patienceRange: [16, 35],
        skinColor: JUDGE_PALETTE.skin_irritated,
        eyebrowAngle: 2,
        mouthCurve: 3,
        veinCount: 1,
        shakeIntensity: 0,
        description: "Mildly annoyed, maintaining composure"
    },
    ANGRY: {
        patienceRange: [36, 60],
        skinColor: JUDGE_PALETTE.skin_angry,
        eyebrowAngle: 4,
        mouthCurve: 6,
        veinCount: 3,
        shakeIntensity: 0,
        description: "Visibly upset, gavel tapping"
    },
    FURIOUS: {
        patienceRange: [61, 85],
        skinColor: JUDGE_PALETTE.skin_furious,
        eyebrowAngle: 6,
        mouthCurve: 10,
        veinCount: 5,
        shakeIntensity: 2,
        gavelRaised: true,
        description: "Barely containing rage"
    },
    APOPLECTIC: {
        patienceRange: [86, 99],
        skinColor: JUDGE_PALETTE.skin_apoplectic,
        eyebrowAngle: 8,
        mouthCurve: 14,
        veinCount: 7,
        shakeIntensity: 4,
        gavelRaised: true,
        screenFlash: true,
        description: "Face purple with fury"
    },
    VOLCANIC: {
        patienceRange: [100, 100],
        skinColor: JUDGE_PALETTE.skin_volcanic,
        eyebrowAngle: 10,
        mouthCurve: 18,
        veinCount: 9,
        shakeIntensity: 8,
        gavelRaised: true,
        screenFlash: true,
        screenShake: true,
        description: "MAXIMUM BUREAUCRATIC WRATH"
    }
};

// PIXEL ART SPRITE DEFINITIONS (128x128 base sprites)
// These are defined as pixel grids that can be rendered to canvas or converted to PNGs

class JudgePixelSprite {
    constructor(width = 128, height = 128) {
        this.width = width;
        this.height = height;
        this.pixels = []; // Will be 2D array of color values
    }

    // SPRITE: Neutral Judge (base sprite)
    static NEUTRAL() {
        const sprite = new JudgePixelSprite();
        sprite.description = "Judge Hardcastle - Neutral Expression";
        sprite.anchorPoint = { x: 64, y: 100 }; // Bottom-center anchor

        // Pixel data structure for rendering
        sprite.layers = {
            // Layer 0: Judicial Wig (back)
            wig_back: {
                pixels: [
                    // Top of wig (rectangular powdered judicial wig)
                    // Format: [x, y, width, height, color]
                    [24, 10, 80, 20, JUDGE_PALETTE.wig_white],
                    [20, 30, 88, 30, JUDGE_PALETTE.wig_white],
                    // Wig shadow details
                    [28, 15, 8, 10, JUDGE_PALETTE.wig_shadow],
                    [92, 15, 8, 10, JUDGE_PALETTE.wig_shadow],
                    // Side curls (iconic judicial wig style)
                    [18, 50, 12, 40, JUDGE_PALETTE.wig_white],
                    [98, 50, 12, 40, JUDGE_PALETTE.wig_white],
                    // Curl shadows
                    [20, 60, 4, 20, JUDGE_PALETTE.wig_shadow],
                    [104, 60, 4, 20, JUDGE_PALETTE.wig_shadow]
                ]
            },

            // Layer 1: Head (skin tone)
            head: {
                pixels: [
                    // Main head shape (rectangular, pixel art style)
                    [36, 30, 56, 60, JUDGE_PALETTE.skin_base],
                    // Neck
                    [49, 85, 30, 20, JUDGE_PALETTE.skin_base],
                    // Shadow under wig
                    [36, 30, 56, 4, JUDGE_PALETTE.skin_shadow],
                    // Face shadow (left side)
                    [36, 34, 8, 50, JUDGE_PALETTE.skin_shadow]
                ]
            },

            // Layer 2: Facial Features
            features: {
                pixels: [
                    // Eyes (pixel rectangles)
                    // Left eye
                    [46, 50, 12, 12, JUDGE_PALETTE.eye_black],
                    [48, 52, 6, 6, JUDGE_PALETTE.eye_white],
                    [50, 54, 2, 2, JUDGE_PALETTE.eye_black], // pupil

                    // Right eye
                    [70, 50, 12, 12, JUDGE_PALETTE.eye_black],
                    [72, 52, 6, 6, JUDGE_PALETTE.eye_white],
                    [74, 54, 2, 2, JUDGE_PALETTE.eye_black], // pupil

                    // Eyebrows (straight, neutral)
                    [44, 42, 16, 3, JUDGE_PALETTE.eyebrow_dark],
                    [68, 42, 16, 3, JUDGE_PALETTE.eyebrow_dark],

                    // Nose (simple pixel line)
                    [62, 60, 4, 12, JUDGE_PALETTE.skin_shadow],

                    // Mouth (neutral line)
                    [52, 76, 24, 3, JUDGE_PALETTE.mouth_dark],

                    // Mustache (grey, bureaucratic)
                    [48, 72, 14, 4, JUDGE_PALETTE.mustache_grey],
                    [66, 72, 14, 4, JUDGE_PALETTE.mustache_grey]
                ]
            },

            // Layer 3: Judicial Robes
            robes: {
                pixels: [
                    // White collar (clerical bands)
                    [44, 95, 40, 12, JUDGE_PALETTE.collar_white],
                    [46, 97, 36, 8, JUDGE_PALETTE.collar_shadow], // inner shadow

                    // Black robe (extends below sprite in full render)
                    [24, 105, 80, 23, JUDGE_PALETTE.robe_black],

                    // Robe folds/shadows
                    [32, 108, 4, 18, JUDGE_PALETTE.robe_shadow],
                    [60, 108, 8, 18, JUDGE_PALETTE.robe_shadow],
                    [92, 108, 4, 18, JUDGE_PALETTE.robe_shadow]
                ]
            }
        };

        return sprite;
    }

    // SPRITE: Blinking animation frame
    static BLINK() {
        const sprite = JudgePixelSprite.NEUTRAL();
        sprite.description = "Judge Hardcastle - Blinking";

        // Replace eyes with closed eyes (thin horizontal lines)
        sprite.layers.features.pixels = sprite.layers.features.pixels.filter(p => {
            // Remove open eye pixels
            return !(p[1] >= 50 && p[1] <= 62 && p[0] >= 46 && p[0] <= 82);
        });

        // Add closed eyes
        sprite.layers.features.pixels.push(
            [46, 56, 12, 2, JUDGE_PALETTE.eye_black], // left closed
            [70, 56, 12, 2, JUDGE_PALETTE.eye_black]  // right closed
        );

        return sprite;
    }

    // SPRITE: Angry eyebrows variant
    static ANGRY_BROWS(angerLevel = 0) {
        const sprite = JudgePixelSprite.NEUTRAL();
        sprite.description = `Judge Hardcastle - Anger Level ${angerLevel}`;

        // Adjust skin color based on anger
        let skinColor = JUDGE_PALETTE.skin_base;
        if (angerLevel >= 86) skinColor = JUDGE_PALETTE.skin_apoplectic;
        else if (angerLevel >= 61) skinColor = JUDGE_PALETTE.skin_furious;
        else if (angerLevel >= 36) skinColor = JUDGE_PALETTE.skin_angry;
        else if (angerLevel >= 16) skinColor = JUDGE_PALETTE.skin_irritated;

        // Update skin colors
        sprite.layers.head.pixels.forEach(p => {
            if (p[4] === JUDGE_PALETTE.skin_base) p[4] = skinColor;
        });

        // Angle eyebrows (0-10 pixel droop for anger)
        const browAngle = Math.floor((angerLevel / 100) * 10);

        // Remove neutral brows
        sprite.layers.features.pixels = sprite.layers.features.pixels.filter(p => {
            return !(p[1] === 42 && p[3] === 3);
        });

        // Add angled brows (inner ends higher for anger)
        sprite.layers.features.pixels.push(
            // Left brow (inner higher)
            [44, 42 - browAngle, 16, 3, JUDGE_PALETTE.eyebrow_dark],
            // Right brow (inner higher)
            [68, 42 - browAngle, 16, 3, JUDGE_PALETTE.eyebrow_dark]
        );

        // Deepen mouth frown
        const frownDepth = Math.floor((angerLevel / 100) * 18);
        if (frownDepth > 0) {
            sprite.layers.features.pixels.push(
                // Mouth corners droop down
                [52, 76, 3, frownDepth, JUDGE_PALETTE.mouth_dark],
                [73, 76, 3, frownDepth, JUDGE_PALETTE.mouth_dark]
            );
        }

        return sprite;
    }

    // SPRITE: With bulging veins (anger >= 16)
    static WITH_VEINS(veinCount = 3) {
        const sprite = JudgePixelSprite.ANGRY_BROWS(60);
        sprite.description = `Judge Hardcastle - ${veinCount} Veins`;

        sprite.layers.veins = {
            pixels: []
        };

        // Draw pulsing veins on forehead
        const centerX = 64;
        const foreheadY = 34;

        for (let i = 0; i < veinCount; i++) {
            const offset = (i - Math.floor(veinCount / 2)) * 8;
            const x = centerX + offset - 1;

            // Vein line (zigzag pattern for organic look)
            sprite.layers.veins.pixels.push(
                [x, foreheadY, 2, 8, JUDGE_PALETTE.vein_red],
                [x + 2, foreheadY + 8, 2, 6, JUDGE_PALETTE.vein_red],
                [x, foreheadY + 14, 2, 4, JUDGE_PALETTE.vein_red]
            );

            // Vein shadow for depth
            sprite.layers.veins.pixels.push(
                [x + 2, foreheadY + 1, 1, 6, JUDGE_PALETTE.vein_dark]
            );
        }

        return sprite;
    }

    // Render sprite to canvas
    render(ctx, x, y, scale = 1) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        // Render layers in order (back to front)
        const layerOrder = ['wig_back', 'head', 'features', 'robes', 'veins'];

        layerOrder.forEach(layerName => {
            const layer = this.layers[layerName];
            if (!layer) return;

            layer.pixels.forEach(pixel => {
                const [px, py, width, height, color] = pixel;
                ctx.fillStyle = color;
                ctx.fillRect(px, py, width, height);
            });
        });

        ctx.restore();
    }
}

// GAVEL SPRITE SHEET
class GavelSprite {
    // Gavel at rest (on desk)
    static REST() {
        return {
            pixels: [
                // Handle
                [10, 15, 6, 45, JUDGE_PALETTE.gavel_handle],
                [11, 16, 4, 43, JUDGE_PALETTE.gavel_highlight],

                // Head
                [4, 8, 18, 10, JUDGE_PALETTE.gavel_head],
                [6, 10, 14, 6, JUDGE_PALETTE.gavel_highlight]
            ]
        };
    }

    // Gavel raised (anger state)
    static RAISED() {
        return {
            pixels: [
                // Handle (angled)
                [12, 5, 6, 50, JUDGE_PALETTE.gavel_handle],
                [13, 6, 4, 48, JUDGE_PALETTE.gavel_highlight],

                // Head (at top)
                [6, 0, 18, 10, JUDGE_PALETTE.gavel_head],
                [8, 2, 14, 6, JUDGE_PALETTE.gavel_highlight],

                // Motion blur lines
                [14, 15, 2, 20, 'rgba(90, 69, 48, 0.3)'],
                [14, 35, 2, 15, 'rgba(90, 69, 48, 0.2)']
            ]
        };
    }

    // Gavel striking (impact frame)
    static STRIKE() {
        return {
            pixels: [
                // Handle (vertical)
                [10, 30, 6, 30, JUDGE_PALETTE.gavel_handle],

                // Head (hitting surface)
                [4, 55, 18, 8, JUDGE_PALETTE.gavel_head],

                // Impact effect (white flash)
                [0, 58, 26, 4, '#ffffff'],
                [2, 62, 22, 2, 'rgba(255, 255, 255, 0.8)'],

                // Dust particles
                [0, 56, 2, 2, JUDGE_PALETTE.dust_light],
                [24, 56, 2, 2, JUDGE_PALETTE.dust_light],
                [8, 54, 2, 2, JUDGE_PALETTE.dust_light],
                [18, 54, 2, 2, JUDGE_PALETTE.dust_light]
            ]
        };
    }
}

// ANIMATION DEFINITIONS
const JUDGE_ANIMATIONS = {
    idle: {
        frames: ['neutral'],
        duration: 1000,
        loop: true
    },
    blink: {
        frames: ['neutral', 'blink', 'neutral'],
        duration: 200,
        loop: false,
        triggerChance: 0.01 // 1% chance per frame
    },
    breathing: {
        // Slight vertical movement (0-2 pixels)
        offset: { y: 'sin(time * 0.05) * 2' },
        continuous: true
    },
    anger_transition: {
        frames: ['neutral', 'irritated', 'angry', 'furious'],
        duration: 500,
        loop: false
    },
    gavel_raise: {
        frames: ['gavel_rest', 'gavel_raised'],
        duration: 300,
        loop: false
    },
    gavel_strike: {
        frames: ['gavel_raised', 'gavel_strike', 'gavel_raised'],
        duration: 200,
        loop: false,
        screenEffect: 'flash',
        soundEffect: 'gavelStrike'
    }
};

// EXPORT
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        JUDGE_PALETTE,
        JUDGE_STATES,
        JudgePixelSprite,
        GavelSprite,
        JUDGE_ANIMATIONS
    };
}
