/**
 * NAIL ART PALETTE - COLOR AND DECORATION CATALOG
 *
 * Complete catalog of all decoration options for nail art system
 * Includes base colors, special effects, patterns, stickers, and glitter
 *
 * Design Philosophy:
 * - Base colors: Vibrant contrast against dystopian world
 * - Effects: Dazzling, show-stopping transformations
 * - Stickers: Maximum creativity and expression
 * - Guard preferences: Each guard has unique aesthetic tastes
 *
 * @version 1.0.0
 * @artist isometric-pixel-artist agent
 * @date 2025-10-19
 */

const NAIL_ART_PALETTE = {
    // ==================== BASE COLORS (15 OPTIONS) ====================

    baseColors: {
        // Classic category (5 colors)
        classic: [
            { id: 'classic-red', name: 'Classic Red', hex: '#dc143c', category: 'classic' },
            { id: 'classic-pink', name: 'Bubblegum Pink', hex: '#ff69b4', category: 'classic' },
            { id: 'classic-black', name: 'Midnight Black', hex: '#000000', category: 'classic' },
            { id: 'classic-white', name: 'Pure White', hex: '#ffffff', category: 'classic' },
            { id: 'classic-nude', name: 'Nude Beige', hex: '#f5deb3', category: 'classic' }
        ],

        // Pastels category (5 colors)
        pastels: [
            { id: 'pastel-lavender', name: 'Lavender Dream', hex: '#e6e6fa', category: 'pastels' },
            { id: 'pastel-mint', name: 'Mint Fresh', hex: '#98ff98', category: 'pastels' },
            { id: 'pastel-peach', name: 'Peach Sorbet', hex: '#ffdab9', category: 'pastels' },
            { id: 'pastel-blue', name: 'Baby Blue', hex: '#add8e6', category: 'pastels' },
            { id: 'pastel-coral', name: 'Coral Blush', hex: '#ff7f50', category: 'pastels' }
        ],

        // Metallics category (5 colors)
        metallics: [
            { id: 'metal-gold', name: 'Liquid Gold', hex: '#ffd700', category: 'metallics' },
            { id: 'metal-silver', name: 'Sterling Silver', hex: '#c0c0c0', category: 'metallics' },
            { id: 'metal-rosegold', name: 'Rose Gold', hex: '#b76e79', category: 'metallics' },
            { id: 'metal-bronze', name: 'Ancient Bronze', hex: '#cd7f32', category: 'metallics' },
            { id: 'metal-copper', name: 'Copper Penny', hex: '#b87333', category: 'metallics' }
        ],

        // Dystopian category (bonus - fits game theme)
        dystopian: [
            { id: 'dystopian-gray', name: 'Prison Gray', hex: '#808080', category: 'dystopian' },
            { id: 'dystopian-green', name: 'Sickly Green', hex: '#556b2f', category: 'dystopian' },
            { id: 'dystopian-brown', name: 'Rust Brown', hex: '#8b4513', category: 'dystopian' }
        ],

        // Glamour category (extra vibrant)
        glamour: [
            { id: 'glamour-neon-pink', name: 'Neon Pink', hex: '#ff1493', category: 'glamour' },
            { id: 'glamour-electric-blue', name: 'Electric Blue', hex: '#0000ff', category: 'glamour' },
            { id: 'glamour-violet', name: 'Deep Violet', hex: '#8a2be2', category: 'glamour' }
        ]
    },

    // ==================== SPECIAL EFFECTS (5 OPTIONS) ====================

    specialEffects: [
        {
            id: 'chrome',
            name: 'Chrome Powder',
            description: 'Jewel beetle iridescent shimmer (cyan/silver/purple)',
            visual: 'Animated shimmer highlight, metallic gradient'
        },
        {
            id: 'holographic',
            name: 'Holographic',
            description: 'Rainbow shimmer that cycles through colors',
            visual: 'HSL color cycle animation (360° hue rotation)'
        },
        {
            id: 'iridescent',
            name: 'Iridescent',
            description: 'Multi-color shimmer (magenta/cyan/yellow)',
            visual: '3-color step animation, slower cycle'
        },
        {
            id: 'matte',
            name: 'Matte Finish',
            description: 'No shine, sophisticated and understated',
            visual: 'Subtle darkening overlay, no highlights'
        },
        {
            id: 'glossy',
            name: 'Ultra Glossy',
            description: 'High-shine finish with bright highlight',
            visual: 'White ellipse highlight on top-left'
        }
    ],

    // ==================== PATTERNS (3 OPTIONS) ====================

    patterns: [
        {
            id: 'solid',
            name: 'Solid Color',
            description: 'Full coverage of base color',
            default: true
        },
        {
            id: 'french',
            name: 'French Tip',
            description: 'Classic white tip on colored base',
            visual: 'White ellipse at nail tip (35% from top)'
        },
        {
            id: 'ombre',
            name: 'Ombre Gradient',
            description: 'Fade from base color to lighter shade',
            visual: 'Linear gradient from base to +40% lightened'
        }
    ],

    // ==================== STICKERS (20 TYPES) ====================

    stickers: {
        // Stars (5 types)
        stars: [
            { id: 'star-gold', name: 'Gold Star', color: '#ffd700', shape: '5-point' },
            { id: 'star-silver', name: 'Silver Star', color: '#c0c0c0', shape: '5-point' },
            { id: 'star-cluster', name: 'Star Cluster', color: '#ffff00', shape: '3-small-stars' },
            { id: 'star-sparkle', name: 'Sparkle', color: '#ffffff', shape: '4-point-sparkle' },
            { id: 'star-rainbow', name: 'Rainbow Star', color: 'rainbow', shape: '5-point-animated' }
        ],

        // Hearts (4 types)
        hearts: [
            { id: 'heart-red', name: 'Red Heart', color: '#ff0000', shape: 'heart' },
            { id: 'heart-pink', name: 'Pink Heart', color: '#ff69b4', shape: 'heart' },
            { id: 'heart-broken', name: 'Broken Heart', color: '#8b0000', shape: 'heart-with-crack' },
            { id: 'heart-outline', name: 'Heart Outline', color: '#ff1493', shape: 'heart-outline' }
        ],

        // Gems (5 types)
        gems: [
            { id: 'gem-diamond', name: 'Diamond', color: '#e0e0e0', shape: 'faceted-gem' },
            { id: 'gem-ruby', name: 'Ruby', color: '#e0115f', shape: 'faceted-gem' },
            { id: 'gem-emerald', name: 'Emerald', color: '#50c878', shape: 'faceted-gem' },
            { id: 'gem-sapphire', name: 'Sapphire', color: '#0f52ba', shape: 'faceted-gem' },
            { id: 'gem-cluster', name: 'Gem Cluster', color: '#9966cc', shape: '3-small-gems' }
        ],

        // Shapes (3 types)
        shapes: [
            { id: 'shape-circle-gold', name: 'Gold Circle', color: '#ffd700', shape: 'circle' },
            { id: 'shape-square-silver', name: 'Silver Square', color: '#c0c0c0', shape: 'square' },
            { id: 'shape-triangle-rainbow', name: 'Rainbow Triangle', color: 'rainbow', shape: 'triangle' }
        ],

        // Thematic (3 types)
        thematic: [
            { id: 'flower', name: 'Flower', color: '#ff69b4', shape: '5-petal-flower' },
            { id: 'moon', name: 'Crescent Moon', color: '#ffffff', shape: 'crescent' },
            { id: 'skull', name: 'Tiny Skull', color: '#ffffff', shape: 'skull' }
        ]
    },

    // ==================== STICKER SIZES ====================

    stickerSizes: [
        { id: 'small', multiplier: 0.5, name: 'Small' },
        { id: 'medium', multiplier: 1.0, name: 'Medium' },
        { id: 'large', multiplier: 1.5, name: 'Large' }
    ],

    // ==================== GLITTER ====================

    glitter: {
        enabled: true,
        particleCount: 12,
        animationSpeed: 3, // Speed multiplier for fade in/out
        opacity: 0.8,
        description: 'Animated sparkle particles across nail surface'
    },

    // ==================== GUARD PREFERENCES ====================

    guardPreferences: {
        jenkins: {
            name: 'Guard Jenkins',
            personality: 'Strict, masculine, no-nonsense',
            preferences: {
                baseColors: ['classic-red', 'classic-black'], // Loves red and black
                specialEffects: ['matte'], // Prefers matte finish
                patterns: ['solid'], // No fancy patterns
                stickers: [], // NO STICKERS (masculine aesthetic)
                glitter: false, // NO GLITTER
                symmetry: false // Doesn't care about symmetry
            },
            reactions: {
                perfect: 'Hmph. Actually looks... professional. Not bad.',
                good: 'This is acceptable. No one better see this though.',
                average: 'I said keep it simple. This is too much.',
                poor: 'What is this? I asked for SIMPLE. Total failure.'
            },
            bonusMultipliers: {
                preferredColors: 2.0,
                matte: 1.5,
                noStickers: 1.5,
                noGlitter: 1.5
            }
        },

        martinez: {
            name: 'Guard Martinez',
            personality: 'Perfectionist, elegant, appreciates artistry',
            preferences: {
                baseColors: ['classic-white', 'metal-gold'], // White and gold only
                specialEffects: ['chrome', 'glossy'], // Loves shine
                patterns: ['french'], // Classic french tips
                stickers: ['star-gold', 'gem-diamond'], // Minimal, elegant
                glitter: false, // Too messy
                symmetry: true // MUST be perfectly symmetrical
            },
            reactions: {
                perfect: 'Magnifico! This is true artistry. Perfection.',
                good: 'Beautiful work, but not quite perfect. Close though.',
                average: 'Acceptable, but lacks the elegance I expected.',
                poor: 'No, no, no. This is all wrong. Completely lacks refinement.'
            },
            bonusMultipliers: {
                preferredColors: 2.0,
                chrome: 2.0,
                french: 1.5,
                symmetry: 3.0, // HUGE bonus for symmetry
                elegantStickers: 1.5
            }
        },

        chen: {
            name: 'Guard Chen',
            personality: 'Impatient, wants it done FAST',
            preferences: {
                baseColors: ['classic-black', 'dystopian-gray'], // Dark, quick-drying
                specialEffects: ['matte'], // Dries fastest
                patterns: ['solid'], // No time for patterns
                stickers: [], // Too slow
                glitter: false, // Takes too long
                speedBonus: true // Reward faster completion
            },
            reactions: {
                perfect: 'Finally! Took you long enough. Looks good though.',
                good: 'Yeah yeah, it\'s fine. Can I go now?',
                average: 'This took WAY too long for such average results.',
                poor: 'Are you KIDDING me? I wasted my time for THIS?'
            },
            bonusMultipliers: {
                preferredColors: 1.5,
                matte: 1.5,
                minimal: 2.0, // Bonus for minimal decoration
                speed: 2.0 // Time-based bonus (under 2 minutes)
            }
        },

        thompson: {
            name: 'Guard Thompson',
            personality: 'Chatty, loves fun and color',
            preferences: {
                baseColors: ['pastel-lavender', 'pastel-mint', 'pastel-peach'], // All pastels
                specialEffects: ['glossy'], // Shiny and fun
                patterns: ['ombre'], // Loves gradients
                stickers: ['heart-pink', 'flower', 'star-rainbow'], // ALL THE STICKERS
                glitter: true, // YES GLITTER
                maxDazzle: true // More is better
            },
            reactions: {
                perfect: 'OH MY GOSH these are AMAZING! I love them SO much!',
                good: 'These are so cute! Could use more sparkle though...',
                average: 'They\'re nice, but I was hoping for more pizzazz.',
                poor: 'Oh... these are kind of plain. I wanted fun colors!'
            },
            bonusMultipliers: {
                pastels: 2.0,
                glossy: 1.5,
                ombre: 1.5,
                stickerCount: 0.3, // +0.3x per sticker (up to 5)
                glitter: 2.0
            }
        },

        rodriguez: {
            name: 'Guard Rodriguez',
            personality: 'Suspicious, but secretly loves glamour',
            preferences: {
                baseColors: ['glamour-neon-pink', 'metal-gold', 'classic-pink'], // Pink and gold
                specialEffects: ['holographic', 'chrome'], // Maximum shimmer
                patterns: ['ombre'], // Dramatic fades
                stickers: ['gem-ruby', 'heart-red', 'star-gold'], // Glamorous
                glitter: true, // Maximum dazzle
                rebellious: true // Bonus for breaking "rules"
            },
            reactions: {
                perfect: 'Damn... these are actually gorgeous. Don\'t tell anyone I said that.',
                good: 'Hm. Not bad. I mean, I guess they\'re okay. ...they\'re great.',
                average: 'I mean, they\'re fine. Nothing special. (disappointed)',
                poor: 'I KNEW you were trying to sabotage me! These are terrible!'
            },
            bonusMultipliers: {
                neonPink: 3.0, // Loves neon pink
                holographic: 2.0,
                glitter: 2.0,
                maxDazzle: 1.5, // Bonus for using EVERYTHING
                rebellious: 1.5 // Bonus for unconventional choices
            }
        }
    },

    // ==================== COLOR UTILITIES ====================

    /**
     * Get all base colors as flat array
     */
    getAllBaseColors() {
        return [
            ...this.baseColors.classic,
            ...this.baseColors.pastels,
            ...this.baseColors.metallics,
            ...this.baseColors.dystopian,
            ...this.baseColors.glamour
        ];
    },

    /**
     * Get all stickers as flat array
     */
    getAllStickers() {
        return [
            ...this.stickers.stars,
            ...this.stickers.hearts,
            ...this.stickers.gems,
            ...this.stickers.shapes,
            ...this.stickers.thematic
        ];
    },

    /**
     * Get color by ID
     */
    getColorById(colorId) {
        const allColors = this.getAllBaseColors();
        return allColors.find(c => c.id === colorId) || null;
    },

    /**
     * Get sticker by ID
     */
    getStickerById(stickerId) {
        const allStickers = this.getAllStickers();
        return allStickers.find(s => s.id === stickerId) || null;
    },

    /**
     * Get effect by ID
     */
    getEffectById(effectId) {
        return this.specialEffects.find(e => e.id === effectId) || null;
    },

    /**
     * Get pattern by ID
     */
    getPatternById(patternId) {
        return this.patterns.find(p => p.id === patternId) || null;
    },

    // ==================== PREFERENCE MATCHING ====================

    /**
     * Calculate bonus tokens based on guard preferences
     * @param {string} guardKey - Guard identifier
     * @param {object} decorationData - Complete decoration data
     * @returns {number} Bonus tokens (0-3)
     */
    calculatePreferenceBonus(guardKey, decorationData) {
        const guard = this.guardPreferences[guardKey];
        if (!guard) return 0;

        let score = 0;
        const prefs = guard.preferences;

        // Analyze all decorated nails
        const allNails = [...decorationData.leftHand, ...decorationData.rightHand];
        const decoratedNails = allNails.filter(n => n && n.baseColor);

        if (decoratedNails.length === 0) return 0;

        // Check base color preferences
        const preferredColors = decoratedNails.filter(n =>
            prefs.baseColors.includes(n.baseColor)
        ).length;
        if (preferredColors > 0) {
            score += (preferredColors / decoratedNails.length) * guard.bonusMultipliers.preferredColors;
        }

        // Check special effects
        if (prefs.specialEffects && prefs.specialEffects.length > 0) {
            const matchingEffects = decoratedNails.filter(n =>
                prefs.specialEffects.includes(n.specialEffect)
            ).length;
            if (matchingEffects > 0) {
                const effectMultiplier = guard.bonusMultipliers[prefs.specialEffects[0]] || 1.5;
                score += (matchingEffects / decoratedNails.length) * effectMultiplier;
            }
        }

        // Check patterns
        if (prefs.patterns && prefs.patterns.length > 0) {
            const matchingPatterns = decoratedNails.filter(n =>
                prefs.patterns.includes(n.pattern)
            ).length;
            if (matchingPatterns > 0) {
                const patternMultiplier = guard.bonusMultipliers[prefs.patterns[0]] || 1.5;
                score += (matchingPatterns / decoratedNails.length) * patternMultiplier;
            }
        }

        // Check symmetry (Martinez)
        if (prefs.symmetry) {
            const isSymmetrical = this.checkSymmetry(decorationData);
            if (isSymmetrical) {
                score += guard.bonusMultipliers.symmetry;
            }
        }

        // Check sticker count (Thompson)
        if (prefs.maxDazzle) {
            const totalStickers = decoratedNails.reduce((sum, n) =>
                sum + (n.stickers ? n.stickers.length : 0), 0
            );
            score += totalStickers * guard.bonusMultipliers.stickerCount;
        }

        // Check glitter preference
        const glitterCount = decoratedNails.filter(n => n.glitter).length;
        if (prefs.glitter && glitterCount > 0) {
            score += (glitterCount / decoratedNails.length) * guard.bonusMultipliers.glitter;
        } else if (prefs.glitter === false && glitterCount === 0) {
            score += guard.bonusMultipliers.noGlitter || 1.5;
        }

        // Check minimal decoration (Chen)
        if (prefs.minimal) {
            const isMinimal = decoratedNails.every(n =>
                n.pattern === 'solid' &&
                (!n.stickers || n.stickers.length === 0) &&
                !n.glitter
            );
            if (isMinimal) {
                score += guard.bonusMultipliers.minimal;
            }
        }

        // Convert score to 0-3 bonus tokens
        // Score ranges: 0-2 = 0 bonus, 2-4 = 1 bonus, 4-6 = 2 bonus, 6+ = 3 bonus
        if (score >= 6) return 3;
        if (score >= 4) return 2;
        if (score >= 2) return 1;
        return 0;
    },

    /**
     * Check if left and right hand designs are symmetrical
     */
    checkSymmetry(decorationData) {
        const left = decorationData.leftHand;
        const right = decorationData.rightHand;

        for (let i = 0; i < 5; i++) {
            const leftNail = left[i];
            const rightNail = right[i];

            // Check base color match
            if (leftNail.baseColor !== rightNail.baseColor) return false;

            // Check effect match
            if (leftNail.specialEffect !== rightNail.specialEffect) return false;

            // Check pattern match
            if (leftNail.pattern !== rightNail.pattern) return false;

            // Check glitter match
            if (leftNail.glitter !== rightNail.glitter) return false;

            // Check sticker count match (don't require exact positions)
            const leftStickerCount = leftNail.stickers ? leftNail.stickers.length : 0;
            const rightStickerCount = rightNail.stickers ? rightNail.stickers.length : 0;
            if (leftStickerCount !== rightStickerCount) return false;
        }

        return true; // Perfectly symmetrical
    },

    /**
     * Get guard reaction based on token count
     */
    getGuardReaction(guardKey, totalTokens) {
        const guard = this.guardPreferences[guardKey];
        if (!guard) return '';

        if (totalTokens >= 4) return guard.reactions.perfect;
        if (totalTokens >= 3) return guard.reactions.good;
        if (totalTokens >= 2) return guard.reactions.average;
        return guard.reactions.poor;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NAIL_ART_PALETTE;
}
