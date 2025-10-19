/**
 * NAIL ART RENDERER - ISOMETRIC PIXEL ART SYSTEM
 *
 * Renders gorgeous guard hands in isometric pixel art style
 * All graphics generated procedurally via Canvas 2D API
 * No external image dependencies - pure code-based rendering
 *
 * Features:
 * - Isometric 3/4 top-down view (26.565° angle, 2:1 pixel ratio)
 * - 5 unique guard hand styles (different skin tones, shapes)
 * - 10 individually rendered nails (5 per hand)
 * - Layer-based decoration rendering (base, effects, stickers, glitter)
 * - Smooth animations (sparkle, shimmer, iridescence)
 * - Mobile-responsive scaling
 *
 * @version 1.0.0
 * @artist isometric-pixel-artist agent
 * @date 2025-10-19
 */

class NailArtRenderer {
    constructor() {
        // Canvas references (set externally)
        this.canvas = null;
        this.ctx = null;
        this.scale = 1.0;

        // Animation state
        this.animationTime = 0;
        this.animationFrameId = null;

        // Isometric constants
        this.ISO_ANGLE = 26.565; // degrees (arctan(0.5) for 2:1 ratio)
        this.ISO_RATIO = 2.0; // 2:1 pixel ratio for isometric

        // Nail dimensions (at scale 1.0)
        this.NAIL_BASE_WIDTH = 30;
        this.NAIL_BASE_HEIGHT = 50;
        this.FINGER_WIDTH = 20;
        this.FINGER_LENGTH = 70;
        this.PALM_WIDTH = 120;
        this.PALM_HEIGHT = 160;

        // Guard hand definitions (skin tones from existing system)
        this.guardSkins = {
            jenkins: {
                skin: '#f4c8a8',
                nail: '#e8d4c0',
                style: 'rough',        // Masculine, rough hands
                knuckles: true,        // Show scarred knuckles
                nailShape: 'square'    // Short, square nails
            },
            martinez: {
                skin: '#d4a574',
                nail: '#c99766',
                style: 'delicate',     // Delicate, well-kept
                knuckles: false,       // Perfectly smooth
                nailShape: 'oval'      // Oval, elegant nails
            },
            chen: {
                skin: '#f0d5be',
                nail: '#e8d0ba',
                style: 'nervous',      // Nervous, bitten
                knuckles: false,       // Cuticle damage instead
                nailShape: 'short'     // Very short, jagged
            },
            thompson: {
                skin: '#ffd7ba',
                nail: '#f5d8c4',
                style: 'worker',       // Large, worker hands
                knuckles: true,        // Calloused palms
                nailShape: 'blunt'     // Blunt, wide nails
            },
            rodriguez: {
                skin: '#c88a5a',
                nail: '#b87d52',
                style: 'elegant',      // Feminine, elegant
                knuckles: false,       // Graceful fingers
                nailShape: 'almond'    // Long, almond nails
            }
        };
    }

    // ==================== SETUP ====================

    /**
     * Initialize renderer with canvas element
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {number} scale - Display scale factor (default 1.0)
     */
    initialize(canvas, scale = 1.0) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = scale;

        // Set canvas size (800x600 base, scaled)
        this.canvas.width = 800 * this.scale;
        this.canvas.height = 600 * this.scale;

        // Enable image smoothing for pixel art
        this.ctx.imageSmoothingEnabled = false;

        console.log('[NailArtRenderer] Initialized at scale', this.scale);
    }

    /**
     * Start animation loop
     */
    startAnimation() {
        if (this.animationFrameId) return; // Already running

        const animate = () => {
            this.animationTime += 0.016; // ~16ms per frame
            this.animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        console.log('[NailArtRenderer] Animation started');
    }

    /**
     * Stop animation loop
     */
    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        console.log('[NailArtRenderer] Animation stopped');
    }

    // ==================== MAIN RENDERING ====================

    /**
     * Render complete scene with both hands
     * @param {string} guardKey - Guard identifier (jenkins, martinez, etc.)
     * @param {object} decorationData - { leftHand: [...], rightHand: [...] }
     * @param {object|null} selectedNail - { hand: 'left'|'right', index: 0-4 } or null
     */
    renderScene(guardKey, decorationData, selectedNail = null) {
        if (!this.ctx) {
            console.error('[NailArtRenderer] Not initialized');
            return;
        }

        const guard = this.guardSkins[guardKey];
        if (!guard) {
            console.error('[NailArtRenderer] Invalid guard key:', guardKey);
            return;
        }

        // Clear canvas (dark dystopian background)
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render title
        this.renderTitle('NAIL DECORATION STUDIO');

        // Render both hands
        this.renderHand('left', guard, decorationData.leftHand, selectedNail);
        this.renderHand('right', guard, decorationData.rightHand, selectedNail);

        // Render instructions
        this.renderInstructions();
    }

    /**
     * Render title text
     */
    renderTitle(text) {
        this.ctx.save();
        this.ctx.fillStyle = '#fff';
        this.ctx.font = `bold ${Math.floor(28 * this.scale)}px monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, this.canvas.width / 2, 50 * this.scale);
        this.ctx.restore();
    }

    /**
     * Render instruction text
     */
    renderInstructions() {
        this.ctx.save();
        this.ctx.fillStyle = '#ff0';
        this.ctx.font = `${Math.floor(14 * this.scale)}px monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            'Click a nail to select. Use tools to decorate. Create something GORGEOUS!',
            this.canvas.width / 2,
            this.canvas.height - 30 * this.scale
        );
        this.ctx.restore();
    }

    /**
     * Render a single hand (left or right) with all fingers and nails
     * @param {string} side - 'left' or 'right'
     * @param {object} guard - Guard skin data
     * @param {array} nailDecorations - Array of 5 nail decoration objects
     * @param {object|null} selectedNail - Currently selected nail
     */
    renderHand(side, guard, nailDecorations, selectedNail) {
        const isLeft = side === 'left';
        const s = this.scale;

        // Hand position (left hand on left, right hand on right)
        const baseX = isLeft ? 200 * s : 600 * s;
        const baseY = 350 * s;

        this.ctx.save();

        // Render palm first (behind fingers)
        this.renderPalm(baseX, baseY, guard, isLeft);

        // Render each finger with nail
        const fingerPositions = this.getFingerPositions(baseX, baseY, isLeft);
        fingerPositions.forEach((pos, index) => {
            const isSelected = selectedNail &&
                               selectedNail.hand === side &&
                               selectedNail.index === index;

            this.renderFinger(
                pos.x, pos.y, pos.angle,
                guard,
                nailDecorations[index],
                isSelected
            );
        });

        this.ctx.restore();
    }

    /**
     * Get finger positions for a hand
     * @param {number} baseX - Hand base X position
     * @param {number} baseY - Hand base Y position
     * @param {boolean} isLeft - Is this the left hand?
     * @returns {array} Array of { x, y, angle } positions
     */
    getFingerPositions(baseX, baseY, isLeft) {
        const s = this.scale;
        const spacing = 35 * s;
        const yOffset = -80 * s; // Fingers extend upward from palm

        // Finger angles (spread out naturally)
        const angles = isLeft
            ? [-20, -10, 0, 10, 20]  // Left hand spreads left to right
            : [20, 10, 0, -10, -20]; // Right hand mirrors

        return [
            // Thumb (offset to side)
            {
                x: baseX + (isLeft ? -60 : 60) * s,
                y: baseY + 20 * s,
                angle: angles[0]
            },
            // Index finger
            {
                x: baseX + (isLeft ? -30 : 30) * s,
                y: baseY + yOffset,
                angle: angles[1]
            },
            // Middle finger (tallest)
            {
                x: baseX,
                y: baseY + yOffset - 20 * s,
                angle: angles[2]
            },
            // Ring finger
            {
                x: baseX + (isLeft ? 30 : -30) * s,
                y: baseY + yOffset - 10 * s,
                angle: angles[3]
            },
            // Pinky (shortest)
            {
                x: baseX + (isLeft ? 55 : -55) * s,
                y: baseY + yOffset + 10 * s,
                angle: angles[4]
            }
        ];
    }

    /**
     * Render palm base
     */
    renderPalm(x, y, guard, isLeft) {
        const s = this.scale;

        this.ctx.fillStyle = guard.skin;
        this.ctx.beginPath();
        this.ctx.ellipse(
            x, y,
            this.PALM_WIDTH * 0.5 * s,
            this.PALM_HEIGHT * 0.5 * s,
            0, 0, Math.PI * 2
        );
        this.ctx.fill();

        // Add shading for depth
        const gradient = this.ctx.createRadialGradient(
            x, y - 20 * s, 10,
            x, y, this.PALM_WIDTH * 0.5 * s
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.15)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.ellipse(
            x, y,
            this.PALM_WIDTH * 0.5 * s,
            this.PALM_HEIGHT * 0.5 * s,
            0, 0, Math.PI * 2
        );
        this.ctx.fill();

        // Render knuckles/scars if guard style requires
        if (guard.knuckles) {
            this.renderKnuckles(x, y, isLeft);
        }
    }

    /**
     * Render knuckle scars/calluses
     */
    renderKnuckles(x, y, isLeft) {
        const s = this.scale;
        const positions = isLeft
            ? [[-30, -10], [0, -15], [30, -10]]
            : [[30, -10], [0, -15], [-30, -10]];

        this.ctx.strokeStyle = 'rgba(139, 115, 85, 0.3)';
        this.ctx.lineWidth = 2 * s;

        positions.forEach(([dx, dy]) => {
            this.ctx.beginPath();
            this.ctx.arc(x + dx * s, y + dy * s, 8 * s, 0, Math.PI * 2);
            this.ctx.stroke();
        });
    }

    /**
     * Render a single finger with nail
     */
    renderFinger(x, y, angle, guard, nailDecoration, isSelected) {
        const s = this.scale;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((angle * Math.PI) / 180);

        // Finger body (elongated ellipse)
        this.ctx.fillStyle = guard.skin;
        this.ctx.beginPath();
        this.ctx.ellipse(
            0, 20 * s,
            this.FINGER_WIDTH * 0.5 * s,
            this.FINGER_LENGTH * 0.6 * s,
            0, 0, Math.PI * 2
        );
        this.ctx.fill();

        // Finger shading (add depth)
        const fingerGradient = this.ctx.createLinearGradient(
            -this.FINGER_WIDTH * 0.5 * s, 0,
            this.FINGER_WIDTH * 0.5 * s, 0
        );
        fingerGradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
        fingerGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        fingerGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');

        this.ctx.fillStyle = fingerGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(
            0, 20 * s,
            this.FINGER_WIDTH * 0.5 * s,
            this.FINGER_LENGTH * 0.6 * s,
            0, 0, Math.PI * 2
        );
        this.ctx.fill();

        // Render nail at fingertip
        this.renderNail(0, 0, guard, nailDecoration, isSelected);

        this.ctx.restore();
    }

    /**
     * Render a single nail with all decoration layers
     * @param {number} x - Nail center X
     * @param {number} y - Nail center Y
     * @param {object} guard - Guard skin data
     * @param {object} decoration - Nail decoration data
     * @param {boolean} isSelected - Is this nail selected?
     */
    renderNail(x, y, guard, decoration, isSelected) {
        const s = this.scale;
        const width = this.NAIL_BASE_WIDTH * s;
        const height = this.NAIL_BASE_HEIGHT * s;

        // Get nail shape based on guard style
        const shape = this.getNailShape(guard.nailShape, width, height);

        this.ctx.save();
        this.ctx.translate(x, y);

        // Layer 1: Nail base (skin-colored)
        this.renderNailBase(shape, guard.nail);

        // Layer 2: Base color (if decorated)
        if (decoration && decoration.baseColor) {
            this.renderBaseColor(shape, decoration.baseColor);
        }

        // Layer 3: Pattern (french tip, ombre, etc.)
        if (decoration && decoration.pattern && decoration.pattern !== 'solid') {
            this.renderPattern(shape, decoration);
        }

        // Layer 4: Special effects (chrome, holographic, etc.)
        if (decoration && decoration.specialEffect) {
            this.renderSpecialEffect(shape, decoration.specialEffect);
        }

        // Layer 5: Stickers
        if (decoration && decoration.stickers && decoration.stickers.length > 0) {
            this.renderStickers(shape, decoration.stickers);
        }

        // Layer 6: Glitter
        if (decoration && decoration.glitter) {
            this.renderGlitter(shape);
        }

        // Layer 7: Selection highlight
        if (isSelected) {
            this.renderSelectionHighlight(shape);
        }

        // Nail outline (always on top)
        this.renderNailOutline(shape);

        this.ctx.restore();
    }

    /**
     * Get nail shape path based on style
     * @param {string} style - 'square', 'oval', 'short', 'blunt', 'almond'
     * @param {number} width - Nail width
     * @param {number} height - Nail height
     * @returns {object} Shape data for rendering
     */
    getNailShape(style, width, height) {
        const shape = { width, height, path: null };

        switch (style) {
            case 'square':
                // Short, square nails (Jenkins)
                shape.height = height * 0.7;
                break;
            case 'oval':
                // Oval, elegant (Martinez)
                shape.height = height * 0.9;
                break;
            case 'short':
                // Very short, jagged (Chen)
                shape.height = height * 0.5;
                break;
            case 'blunt':
                // Blunt, wide (Thompson)
                shape.width = width * 1.2;
                shape.height = height * 0.8;
                break;
            case 'almond':
                // Long, almond (Rodriguez)
                shape.height = height * 1.1;
                break;
        }

        return shape;
    }

    /**
     * Render nail base (natural nail color)
     */
    renderNailBase(shape, nailColor) {
        this.ctx.fillStyle = nailColor;
        this.ctx.beginPath();
        this.ctx.ellipse(
            0, 0,
            shape.width * 0.5,
            shape.height * 0.7,
            0, 0, Math.PI * 2
        );
        this.ctx.fill();
    }

    /**
     * Render base color layer
     */
    renderBaseColor(shape, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.ellipse(
            0, 0,
            shape.width * 0.5,
            shape.height * 0.7,
            0, 0, Math.PI * 2
        );
        this.ctx.fill();
    }

    /**
     * Render pattern (french tip, ombre, etc.)
     */
    renderPattern(shape, decoration) {
        const { pattern, baseColor } = decoration;

        if (pattern === 'french') {
            // White tip
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.ellipse(
                0, -shape.height * 0.35,
                shape.width * 0.5,
                shape.height * 0.2,
                0, 0, Math.PI * 2
            );
            this.ctx.fill();
        } else if (pattern === 'ombre') {
            // Gradient from base to tip
            const gradient = this.ctx.createLinearGradient(
                0, shape.height * 0.35,
                0, -shape.height * 0.35
            );
            gradient.addColorStop(0, baseColor);
            gradient.addColorStop(1, this.lightenColor(baseColor, 40));

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.ellipse(
                0, 0,
                shape.width * 0.5,
                shape.height * 0.7,
                0, 0, Math.PI * 2
            );
            this.ctx.fill();
        }
    }

    /**
     * Render special effects (chrome, holographic, etc.)
     */
    renderSpecialEffect(shape, effect) {
        if (effect === 'chrome') {
            // Jewel beetle iridescent shimmer
            const gradient = this.ctx.createLinearGradient(
                -shape.width * 0.5, -shape.height * 0.35,
                shape.width * 0.5, shape.height * 0.35
            );
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0.3)'); // Cyan
            gradient.addColorStop(0.5, 'rgba(192, 192, 192, 0.5)'); // Silver
            gradient.addColorStop(1, 'rgba(75, 0, 130, 0.3)'); // Purple

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.ellipse(
                0, 0,
                shape.width * 0.5,
                shape.height * 0.7,
                0, 0, Math.PI * 2
            );
            this.ctx.fill();

            // Animated shimmer highlight
            const shimmerX = Math.sin(this.animationTime * 2) * shape.width * 0.3;
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.beginPath();
            this.ctx.ellipse(
                shimmerX, -shape.height * 0.2,
                shape.width * 0.15,
                shape.height * 0.3,
                0, 0, Math.PI * 2
            );
            this.ctx.fill();

        } else if (effect === 'holographic') {
            // Rainbow shimmer (animated color cycle)
            const hue = (this.animationTime * 50) % 360;
            this.ctx.fillStyle = `hsla(${hue}, 100%, 70%, 0.5)`;
            this.ctx.beginPath();
            this.ctx.ellipse(
                0, 0,
                shape.width * 0.5,
                shape.height * 0.7,
                0, 0, Math.PI * 2
            );
            this.ctx.fill();

        } else if (effect === 'iridescent') {
            // Multi-color shimmer (slower cycle)
            const colors = ['#ff00ff', '#00ffff', '#ffff00'];
            const colorIndex = Math.floor(this.animationTime * 0.5) % colors.length;
            this.ctx.fillStyle = colors[colorIndex] + '66'; // 40% opacity

            this.ctx.beginPath();
            this.ctx.ellipse(
                0, 0,
                shape.width * 0.5,
                shape.height * 0.7,
                0, 0, Math.PI * 2
            );
            this.ctx.fill();

        } else if (effect === 'matte') {
            // Matte finish (subtle darkening)
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            this.ctx.beginPath();
            this.ctx.ellipse(
                0, 0,
                shape.width * 0.5,
                shape.height * 0.7,
                0, 0, Math.PI * 2
            );
            this.ctx.fill();

        } else if (effect === 'glossy') {
            // Glossy shine highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.beginPath();
            this.ctx.ellipse(
                -shape.width * 0.15, -shape.height * 0.25,
                shape.width * 0.2,
                shape.height * 0.3,
                0, 0, Math.PI * 2
            );
            this.ctx.fill();
        }
    }

    /**
     * Render stickers on nail
     */
    renderStickers(shape, stickers) {
        stickers.forEach(sticker => {
            const { type, position, size } = sticker;
            const x = position.x * shape.width * 0.4; // Relative positioning
            const y = position.y * shape.height * 0.6;
            const sizeMultiplier = size === 'small' ? 0.5 : size === 'large' ? 1.5 : 1.0;
            const baseSize = 8 * sizeMultiplier;

            this.ctx.save();
            this.ctx.translate(x, y);

            // Render sticker based on type
            if (type.startsWith('star-')) {
                this.renderStarSticker(type, baseSize);
            } else if (type.startsWith('heart-')) {
                this.renderHeartSticker(type, baseSize);
            } else if (type.startsWith('gem-')) {
                this.renderGemSticker(type, baseSize);
            } else if (type.startsWith('shape-')) {
                this.renderShapeSticker(type, baseSize);
            } else {
                this.renderThematicSticker(type, baseSize);
            }

            this.ctx.restore();
        });
    }

    /**
     * Render star sticker
     */
    renderStarSticker(type, size) {
        const color = type.includes('gold') ? '#ffd700' :
                     type.includes('silver') ? '#c0c0c0' :
                     type.includes('rainbow') ? this.getRainbowColor() : '#ffff00';

        this.ctx.fillStyle = color;
        this.ctx.beginPath();

        // 5-pointed star
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = Math.cos(angle) * size;
            const y = Math.sin(angle) * size;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();

        // Sparkle highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(0, -size * 0.3, size * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * Render heart sticker
     */
    renderHeartSticker(type, size) {
        const color = type.includes('red') ? '#ff0000' :
                     type.includes('pink') ? '#ff69b4' :
                     type.includes('broken') ? '#8b0000' : '#ff1493';

        this.ctx.fillStyle = color;
        this.ctx.beginPath();

        // Heart shape (two arcs + triangle)
        this.ctx.moveTo(0, size * 0.3);
        this.ctx.arc(-size * 0.35, -size * 0.2, size * 0.4, Math.PI / 4, Math.PI, false);
        this.ctx.arc(size * 0.35, -size * 0.2, size * 0.4, Math.PI, 3 * Math.PI / 4, false);
        this.ctx.lineTo(0, size * 0.8);
        this.ctx.closePath();
        this.ctx.fill();

        // Broken heart line
        if (type.includes('broken')) {
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(-size * 0.1, -size * 0.4);
            this.ctx.lineTo(size * 0.1, size * 0.6);
            this.ctx.stroke();
        }
    }

    /**
     * Render gem sticker
     */
    renderGemSticker(type, size) {
        const color = type.includes('diamond') ? '#e0e0e0' :
                     type.includes('ruby') ? '#e0115f' :
                     type.includes('emerald') ? '#50c878' :
                     type.includes('sapphire') ? '#0f52ba' : '#9966cc';

        // Diamond/gem shape (faceted)
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -size);
        this.ctx.lineTo(size * 0.6, -size * 0.3);
        this.ctx.lineTo(size * 0.4, size);
        this.ctx.lineTo(-size * 0.4, size);
        this.ctx.lineTo(-size * 0.6, -size * 0.3);
        this.ctx.closePath();
        this.ctx.fill();

        // Facet highlights
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -size);
        this.ctx.lineTo(0, size);
        this.ctx.stroke();

        // Shine highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(-size * 0.2, -size * 0.5, size * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * Render shape sticker (circle, square, triangle)
     */
    renderShapeSticker(type, size) {
        const color = type.includes('gold') ? '#ffd700' :
                     type.includes('silver') ? '#c0c0c0' : this.getRainbowColor();

        this.ctx.fillStyle = color;
        this.ctx.beginPath();

        if (type.includes('circle')) {
            this.ctx.arc(0, 0, size, 0, Math.PI * 2);
        } else if (type.includes('square')) {
            this.ctx.rect(-size, -size, size * 2, size * 2);
        } else if (type.includes('triangle')) {
            this.ctx.moveTo(0, -size);
            this.ctx.lineTo(size, size);
            this.ctx.lineTo(-size, size);
            this.ctx.closePath();
        }

        this.ctx.fill();
    }

    /**
     * Render thematic sticker (flower, moon, skull)
     */
    renderThematicSticker(type, size) {
        if (type === 'flower') {
            // Simple 5-petal flower
            this.ctx.fillStyle = '#ff69b4';
            for (let i = 0; i < 5; i++) {
                const angle = (i * 2 * Math.PI) / 5;
                this.ctx.beginPath();
                this.ctx.arc(
                    Math.cos(angle) * size * 0.5,
                    Math.sin(angle) * size * 0.5,
                    size * 0.4,
                    0, Math.PI * 2
                );
                this.ctx.fill();
            }
            // Center
            this.ctx.fillStyle = '#ffff00';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
            this.ctx.fill();

        } else if (type === 'moon') {
            // Crescent moon
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#1a1a1a'; // Background color (cut-out)
            this.ctx.beginPath();
            this.ctx.arc(size * 0.3, 0, size * 0.8, 0, Math.PI * 2);
            this.ctx.fill();

        } else if (type === 'skull') {
            // Tiny skull
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(0, -size * 0.2, size * 0.7, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillRect(-size * 0.5, size * 0.2, size, size * 0.4);

            // Eye sockets
            this.ctx.fillStyle = '#000';
            this.ctx.beginPath();
            this.ctx.arc(-size * 0.3, -size * 0.3, size * 0.15, 0, Math.PI * 2);
            this.ctx.arc(size * 0.3, -size * 0.3, size * 0.15, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    /**
     * Render glitter particles
     */
    renderGlitter(shape) {
        const particleCount = 12;
        const s = this.scale;

        for (let i = 0; i < particleCount; i++) {
            // Random position within nail bounds
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = Math.random() * shape.width * 0.4;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius * 0.7; // Elliptical distribution

            // Sparkle animation (fade in/out)
            const sparklePhase = (this.animationTime * 3 + i) % 2;
            const opacity = sparklePhase < 1 ? sparklePhase : 2 - sparklePhase;

            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2 * s, 0, Math.PI * 2);
            this.ctx.fill();

            // Star sparkle shape
            if (opacity > 0.7) {
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(x - 4 * s, y);
                this.ctx.lineTo(x + 4 * s, y);
                this.ctx.moveTo(x, y - 4 * s);
                this.ctx.lineTo(x, y + 4 * s);
                this.ctx.stroke();
            }
        }
    }

    /**
     * Render selection highlight (gold pulse)
     */
    renderSelectionHighlight(shape) {
        const pulsePhase = Math.sin(this.animationTime * 4) * 0.3 + 0.7;
        const pulseWidth = 4 + pulsePhase * 2;

        this.ctx.strokeStyle = `rgba(255, 215, 0, ${pulsePhase})`;
        this.ctx.lineWidth = pulseWidth;
        this.ctx.beginPath();
        this.ctx.ellipse(
            0, 0,
            shape.width * 0.5 + pulseWidth,
            shape.height * 0.7 + pulseWidth,
            0, 0, Math.PI * 2
        );
        this.ctx.stroke();
    }

    /**
     * Render nail outline (always on top)
     */
    renderNailOutline(shape) {
        this.ctx.strokeStyle = '#8B7355';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.ellipse(
            0, 0,
            shape.width * 0.5,
            shape.height * 0.7,
            0, 0, Math.PI * 2
        );
        this.ctx.stroke();
    }

    // ==================== UTILITY FUNCTIONS ====================

    /**
     * Lighten a hex color by a percentage
     */
    lightenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, ((num >> 16) + percent));
        const g = Math.min(255, (((num >> 8) & 0x00FF) + percent));
        const b = Math.min(255, ((num & 0x0000FF) + percent));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }

    /**
     * Get animated rainbow color
     */
    getRainbowColor() {
        const hue = (this.animationTime * 50) % 360;
        return `hsl(${hue}, 100%, 60%)`;
    }

    /**
     * Convert mouse/touch event to canvas coordinates
     */
    getCanvasCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    /**
     * Detect which nail was clicked
     * @param {number} clickX - Click X coordinate
     * @param {number} clickY - Click Y coordinate
     * @param {string} guardKey - Current guard
     * @returns {object|null} { hand: 'left'|'right', index: 0-4 } or null
     */
    detectNailClick(clickX, clickY, guardKey) {
        const s = this.scale;

        // Check both hands
        for (const side of ['left', 'right']) {
            const isLeft = side === 'left';
            const baseX = isLeft ? 200 * s : 600 * s;
            const baseY = 350 * s;

            const fingerPositions = this.getFingerPositions(baseX, baseY, isLeft);

            for (let i = 0; i < fingerPositions.length; i++) {
                const pos = fingerPositions[i];

                // Transform click to finger-local coordinates
                const dx = clickX - pos.x;
                const dy = clickY - pos.y;
                const angle = -(pos.angle * Math.PI) / 180;
                const rotX = dx * Math.cos(angle) - dy * Math.sin(angle);
                const rotY = dx * Math.sin(angle) + dy * Math.cos(angle);

                // Check if within nail bounds
                const nailWidth = this.NAIL_BASE_WIDTH * s * 0.5;
                const nailHeight = this.NAIL_BASE_HEIGHT * s * 0.7;
                const dist = Math.sqrt(
                    (rotX / nailWidth) ** 2 + (rotY / nailHeight) ** 2
                );

                if (dist <= 1.0) {
                    return { hand: side, index: i };
                }
            }
        }

        return null; // No nail clicked
    }

    /**
     * Cleanup and destroy renderer
     */
    destroy() {
        this.stopAnimation();
        this.canvas = null;
        this.ctx = null;
        console.log('[NailArtRenderer] Destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NailArtRenderer;
}
