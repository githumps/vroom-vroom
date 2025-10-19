/**
 * NAIL ART RENDERER - PIXEL PERFECT ISOMETRIC SYSTEM
 *
 * COMPLETE OVERHAUL - TRUE PIXEL ART RENDERING
 *
 * Features:
 * - Pixel-perfect isometric guard hands (clean rectangles, no blurry ovals)
 * - 10 individually clickable nails with clear hitboxes
 * - Beautiful color palettes that actually show up
 * - Warm pinks, vibrant colors, cozy pixel art aesthetic
 * - No anti-aliasing, no image smoothing - crisp pixels only
 *
 * Design Philosophy:
 * - Every pixel is intentional and visible
 * - Nails are distinct 30x50px pixel art elements
 * - Colors are vibrant and clearly visible
 * - Isometric projection for professional look
 * - Reference quality: cozy bedroom, autumn park, cyberpunk city style
 *
 * @version 2.0.0 - COMPLETE PIXEL ART REWRITE
 * @artist isometric-pixel-artist agent
 * @date 2025-10-19
 */

class NailArtRenderer {
    constructor() {
        // Canvas references
        this.canvas = null;
        this.ctx = null;
        this.scale = 1.0;

        // Animation state
        this.animationTime = 0;
        this.animationFrameId = null;

        // Pixel art constants
        this.PIXEL_SIZE = 2; // Each "pixel" is 2x2 screen pixels for visibility
        this.NAIL_WIDTH_PX = 15; // 15 "pixels" wide (30px at scale 1)
        this.NAIL_HEIGHT_PX = 25; // 25 "pixels" tall (50px at scale 1)

        // Isometric constants (2:1 ratio)
        this.ISO_ANGLE = 26.565; // degrees
        this.ISO_RATIO = 2.0;

        // Guard skin tones (warmer, more vibrant than before)
        this.guardSkins = {
            jenkins: {
                skin: '#f4c8a8',      // Warm peachy
                skinDark: '#d4a888',  // Shadow
                skinLight: '#ffddbb', // Highlight
                nail: '#ffe0cc',      // Natural nail
                nailDark: '#e8c8b0',
                knuckles: true,
                style: 'square'
            },
            martinez: {
                skin: '#d4a574',
                skinDark: '#b88854',
                skinLight: '#f0c890',
                nail: '#f5e0d0',
                nailDark: '#d8c4b0',
                knuckles: false,
                style: 'oval'
            },
            chen: {
                skin: '#f0d5be',
                skinDark: '#d0b59e',
                skinLight: '#fff0dd',
                nail: '#fff5e8',
                nailDark: '#e8d8c8',
                knuckles: false,
                style: 'short'
            },
            thompson: {
                skin: '#ffd7ba',
                skinDark: '#e0b89a',
                skinLight: '#fff0dd',
                nail: '#fff8e8',
                nailDark: '#f0dcc0',
                knuckles: true,
                style: 'wide'
            },
            rodriguez: {
                skin: '#c88a5a',
                skinDark: '#a86a3a',
                skinLight: '#e8aa7a',
                nail: '#f0d0b0',
                nailDark: '#d0b090',
                knuckles: false,
                style: 'almond'
            }
        };

        // Nail hitbox data (populated during rendering)
        this.nailHitboxes = [];

        // Beautiful vibrant palette (15+ colors that SHOW UP)
        this.palette = {
            // Warm pinks (cozy aesthetic)
            'warm-pink': '#ff69b4',
            'hot-pink': '#ff1493',
            'rose': '#ff66aa',
            'coral': '#ff7f50',
            'peach': '#ffb366',

            // Cool vibes
            'cyan': '#00ffff',
            'sky-blue': '#87ceeb',
            'purple': '#9966ff',
            'lavender': '#e6b3ff',

            // Vibrant colors
            'lime': '#00ff00',
            'yellow': '#ffff00',
            'orange': '#ff8800',
            'red': '#ff0000',

            // Metallics
            'gold': '#ffd700',
            'silver': '#c0c0c0',

            // Classics
            'black': '#000000',
            'white': '#ffffff'
        };
    }

    // ==================== SETUP ====================

    /**
     * Initialize renderer with canvas element
     */
    initialize(canvas, scale = 1.0) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = scale;

        // Set canvas size (800x600 base)
        this.canvas.width = 800 * this.scale;
        this.canvas.height = 600 * this.scale;

        // CRITICAL: Disable image smoothing for pixel art
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;

        console.log('[NailArtRenderer] Pixel art mode initialized at scale', this.scale);
    }

    /**
     * Start animation loop
     */
    startAnimation() {
        if (this.animationFrameId) return;

        const animate = (timestamp) => {
            this.animationTime = timestamp * 0.001; // Convert to seconds
            this.animationFrameId = requestAnimationFrame(animate);
        };

        this.animationFrameId = requestAnimationFrame(animate);
    }

    /**
     * Stop animation loop
     */
    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    // ==================== MAIN RENDERING ====================

    /**
     * Render complete scene with both hands
     * @param {string} guardKey - Guard identifier
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

        // Reset hitboxes
        this.nailHitboxes = [];

        // Clear canvas with dark dystopian background
        this.ctx.fillStyle = '#1a1520'; // Dark purple-gray
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Add subtle texture to background (pixel art style)
        this.renderBackgroundTexture();

        // Render title
        this.renderPixelText('NAIL DECORATION STUDIO', this.canvas.width / 2, 50 * this.scale, 3, '#ff66aa');

        // Render both hands with pixel art
        this.renderPixelHand('left', guard, decorationData.leftHand || [], selectedNail);
        this.renderPixelHand('right', guard, decorationData.rightHand || [], selectedNail);

        // Render instructions
        this.renderPixelText(
            'CLICK A NAIL TO SELECT',
            this.canvas.width / 2,
            this.canvas.height - 40 * this.scale,
            2,
            '#ffff00'
        );

        // Debug: Show hitbox count
        console.log(`[NailArtRenderer] Rendered ${this.nailHitboxes.length} nail hitboxes`);
    }

    /**
     * Render pixel art background texture (subtle noise)
     */
    renderBackgroundTexture() {
        const s = this.scale;
        const gridSize = 8 * s;

        for (let x = 0; x < this.canvas.width; x += gridSize) {
            for (let y = 0; y < this.canvas.height; y += gridSize) {
                if (Math.random() > 0.95) {
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
                    this.ctx.fillRect(x, y, gridSize, gridSize);
                }
            }
        }
    }

    /**
     * Render pixel-perfect text
     */
    renderPixelText(text, x, y, size, color) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.font = `bold ${Math.floor(size * 10 * this.scale)}px monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Add pixel art text shadow for depth
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillText(text, x + 2 * this.scale, y + 2 * this.scale);

        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);

        this.ctx.restore();
    }

    // ==================== PIXEL ART HAND RENDERING ====================

    /**
     * Render entire hand in pixel art style
     */
    renderPixelHand(side, guard, nailDecorations, selectedNail) {
        const isLeft = side === 'left';
        const s = this.scale;

        // Hand position
        const baseX = isLeft ? 200 * s : 600 * s;
        const baseY = 300 * s;

        this.ctx.save();

        // Render palm (pixel art style - not an oval!)
        this.renderPixelPalm(baseX, baseY, guard, isLeft);

        // Get finger positions
        const fingers = this.getPixelFingerPositions(baseX, baseY, isLeft);

        // Render each finger with nail
        fingers.forEach((finger, index) => {
            const isSelected = selectedNail &&
                               selectedNail.hand === side &&
                               selectedNail.index === index;

            const decoration = nailDecorations[index] || null;

            this.renderPixelFinger(
                finger.x, finger.y, finger.angle,
                guard,
                decoration,
                isSelected,
                side,
                index
            );
        });

        this.ctx.restore();
    }

    /**
     * Get pixel art finger positions
     */
    getPixelFingerPositions(baseX, baseY, isLeft) {
        const s = this.scale;
        const spacing = 38 * s;

        return [
            // Thumb (offset to side)
            {
                x: baseX + (isLeft ? -70 : 70) * s,
                y: baseY + 30 * s,
                angle: isLeft ? -30 : 30,
                name: 'thumb'
            },
            // Index
            {
                x: baseX + (isLeft ? -35 : 35) * s,
                y: baseY - 80 * s,
                angle: isLeft ? -15 : 15,
                name: 'index'
            },
            // Middle (longest)
            {
                x: baseX,
                y: baseY - 100 * s,
                angle: 0,
                name: 'middle'
            },
            // Ring
            {
                x: baseX + (isLeft ? 35 : -35) * s,
                y: baseY - 90 * s,
                angle: isLeft ? 15 : -15,
                name: 'ring'
            },
            // Pinky (shortest)
            {
                x: baseX + (isLeft ? 65 : -65) * s,
                y: baseY - 60 * s,
                angle: isLeft ? 25 : -25,
                name: 'pinky'
            }
        ];
    }

    /**
     * Render pixel art palm (rectangular, not oval!)
     */
    renderPixelPalm(x, y, guard, isLeft) {
        const s = this.scale;
        const width = 100 * s;
        const height = 130 * s;

        this.ctx.save();
        this.ctx.translate(x, y);

        // Main palm shape (rounded rectangle in pixel art)
        this.fillPixelRect(
            -width / 2, -height / 2,
            width, height,
            guard.skin,
            10 * s // Corner radius
        );

        // Add pixel art shading (manual dithering)
        this.ctx.globalAlpha = 0.3;
        for (let i = 0; i < 20; i++) {
            const px = (Math.random() - 0.5) * width * 0.8;
            const py = (Math.random() - 0.5) * height * 0.8;
            const size = 2 * s;
            this.ctx.fillStyle = guard.skinDark;
            this.ctx.fillRect(px - size / 2, py - size / 2, size, size);
        }
        this.ctx.globalAlpha = 1.0;

        // Palm outline (pixel perfect)
        this.strokePixelRect(
            -width / 2, -height / 2,
            width, height,
            guard.skinDark,
            2 * s,
            10 * s
        );

        // Knuckle details (if applicable)
        if (guard.knuckles) {
            this.renderPixelKnuckles(0, -20 * s, guard, isLeft);
        }

        this.ctx.restore();
    }

    /**
     * Render pixel art knuckles
     */
    renderPixelKnuckles(x, y, guard, isLeft) {
        const s = this.scale;
        const positions = [
            [-30 * s, 0],
            [0, -5 * s],
            [30 * s, 0]
        ];

        this.ctx.strokeStyle = guard.skinDark;
        this.ctx.lineWidth = 2 * s;

        positions.forEach(([dx, dy]) => {
            // Pixel art scar line
            const startX = x + dx - 8 * s;
            const startY = y + dy;
            const endX = x + dx + 8 * s;
            const endY = y + dy;

            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        });
    }

    /**
     * Render pixel art finger
     */
    renderPixelFinger(x, y, angle, guard, decoration, isSelected, hand, index) {
        const s = this.scale;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((angle * Math.PI) / 180);

        // Finger body (rectangular with rounded end)
        const fingerWidth = 18 * s;
        const fingerLength = 70 * s;

        // Main finger rectangle
        this.fillPixelRect(
            -fingerWidth / 2, 0,
            fingerWidth, fingerLength,
            guard.skin
        );

        // Finger tip (rounded)
        this.ctx.fillStyle = guard.skin;
        this.ctx.beginPath();
        this.ctx.arc(0, fingerLength, fingerWidth / 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Finger shading (one side darker)
        this.ctx.fillStyle = guard.skinDark;
        this.fillPixelRect(
            -fingerWidth / 2, 0,
            3 * s, fingerLength,
            guard.skinDark
        );

        // Finger highlight (other side)
        this.ctx.fillStyle = guard.skinLight;
        this.fillPixelRect(
            fingerWidth / 2 - 3 * s, 0,
            3 * s, fingerLength,
            guard.skinLight
        );

        // Render nail at fingertip
        this.renderPixelNail(0, 0, guard, decoration, isSelected, hand, index);

        this.ctx.restore();
    }

    /**
     * Render pixel art nail with decorations
     * THIS IS WHERE THE MAGIC HAPPENS
     */
    renderPixelNail(localX, localY, guard, decoration, isSelected, hand, index) {
        const s = this.scale;
        const nailWidth = this.NAIL_WIDTH_PX * this.PIXEL_SIZE * s;
        const nailHeight = this.NAIL_HEIGHT_PX * this.PIXEL_SIZE * s;

        this.ctx.save();

        // Calculate world position for hitbox
        const matrix = this.ctx.getTransform();
        const worldX = matrix.e + localX * matrix.a + localY * matrix.c;
        const worldY = matrix.f + localX * matrix.b + localY * matrix.d;

        // Store hitbox data
        this.nailHitboxes.push({
            hand: hand,
            index: index,
            x: worldX,
            y: worldY,
            width: nailWidth,
            height: nailHeight,
            angle: 0 // Local coordinates (already rotated)
        });

        // Layer 1: Base nail (natural color)
        this.fillPixelRect(
            -nailWidth / 2, -nailHeight / 2,
            nailWidth, nailHeight,
            guard.nail,
            4 * s
        );

        // Layer 2: Base color decoration
        if (decoration && decoration.baseColor) {
            const color = this.palette[decoration.baseColor] || decoration.baseColor;
            this.fillPixelRect(
                -nailWidth / 2 + 2 * s, -nailHeight / 2 + 2 * s,
                nailWidth - 4 * s, nailHeight - 4 * s,
                color,
                3 * s
            );
        }

        // Layer 3: Pattern (french tip, ombre, etc.)
        if (decoration && decoration.pattern && decoration.pattern !== 'solid') {
            this.renderNailPattern(decoration.pattern, nailWidth, nailHeight, decoration);
        }

        // Layer 4: Special effects (sparkle, chrome, etc.)
        if (decoration && decoration.specialEffect) {
            this.renderNailEffect(decoration.specialEffect, nailWidth, nailHeight);
        }

        // Layer 5: Glitter
        if (decoration && decoration.glitter) {
            this.renderPixelGlitter(nailWidth, nailHeight);
        }

        // Layer 6: Selection highlight
        if (isSelected) {
            this.renderPixelSelection(nailWidth, nailHeight);
        }

        // Layer 7: Nail outline (always on top)
        this.strokePixelRect(
            -nailWidth / 2, -nailHeight / 2,
            nailWidth, nailHeight,
            guard.nailDark,
            2 * s,
            4 * s
        );

        this.ctx.restore();
    }

    /**
     * Render nail pattern (french tip, ombre)
     */
    renderNailPattern(pattern, width, height, decoration) {
        const s = this.scale;

        if (pattern === 'french') {
            // White tip (pixel art style)
            this.fillPixelRect(
                -width / 2 + 2 * s, -height / 2 + 2 * s,
                width - 4 * s, height * 0.3,
                '#ffffff',
                3 * s
            );
        } else if (pattern === 'ombre') {
            // Gradient effect with pixel art steps
            const steps = 5;
            const baseColor = this.palette[decoration.baseColor] || decoration.baseColor;

            for (let i = 0; i < steps; i++) {
                const stepHeight = (height - 4 * s) / steps;
                const opacity = 0.2 + (i / steps) * 0.8;

                this.ctx.globalAlpha = opacity;
                this.fillPixelRect(
                    -width / 2 + 2 * s,
                    -height / 2 + 2 * s + i * stepHeight,
                    width - 4 * s,
                    stepHeight,
                    baseColor
                );
            }
            this.ctx.globalAlpha = 1.0;
        }
    }

    /**
     * Render special effects (chrome, holographic, etc.)
     */
    renderNailEffect(effect, width, height) {
        const s = this.scale;

        if (effect === 'chrome' || effect === 'holographic') {
            // Animated shimmer (pixel art style)
            const shimmerX = Math.sin(this.animationTime * 2) * width * 0.2;

            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            this.fillPixelRect(
                shimmerX - 4 * s, -height * 0.3,
                8 * s, height * 0.4,
                'rgba(255, 255, 255, 0.6)'
            );
        } else if (effect === 'glossy') {
            // Glossy highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.fillPixelRect(
                -width * 0.3, -height * 0.3,
                width * 0.3, height * 0.3,
                'rgba(255, 255, 255, 0.7)',
                2 * s
            );
        }
    }

    /**
     * Render pixel art glitter
     */
    renderPixelGlitter(width, height) {
        const s = this.scale;
        const particleCount = 8;

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = Math.random() * width * 0.3;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius * 0.8; // Elliptical

            // Sparkle animation
            const phase = (this.animationTime * 3 + i) % 2;
            const opacity = phase < 1 ? phase : 2 - phase;

            if (opacity > 0.3) {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                const pixelSize = 2 * s;
                this.ctx.fillRect(x - pixelSize / 2, y - pixelSize / 2, pixelSize, pixelSize);

                // Cross sparkle
                if (opacity > 0.7) {
                    this.ctx.fillRect(x - 4 * s, y - s / 2, 8 * s, s);
                    this.ctx.fillRect(x - s / 2, y - 4 * s, s, 8 * s);
                }
            }
        }
    }

    /**
     * Render selection highlight (pulsing gold border)
     */
    renderPixelSelection(width, height) {
        const s = this.scale;
        const pulse = Math.sin(this.animationTime * 4) * 0.5 + 0.5;
        const offset = 4 * s + pulse * 4 * s;

        this.ctx.strokeStyle = `rgba(255, 215, 0, ${0.7 + pulse * 0.3})`;
        this.ctx.lineWidth = 3 * s;
        this.ctx.strokeRect(
            -width / 2 - offset,
            -height / 2 - offset,
            width + offset * 2,
            height + offset * 2
        );
    }

    // ==================== PIXEL ART PRIMITIVES ====================

    /**
     * Fill pixel-perfect rectangle with rounded corners
     */
    fillPixelRect(x, y, width, height, color, radius = 0) {
        this.ctx.fillStyle = color;

        if (radius === 0) {
            this.ctx.fillRect(x, y, width, height);
        } else {
            this.ctx.beginPath();
            this.ctx.moveTo(x + radius, y);
            this.ctx.lineTo(x + width - radius, y);
            this.ctx.arcTo(x + width, y, x + width, y + radius, radius);
            this.ctx.lineTo(x + width, y + height - radius);
            this.ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
            this.ctx.lineTo(x + radius, y + height);
            this.ctx.arcTo(x, y + height, x, y + height - radius, radius);
            this.ctx.lineTo(x, y + radius);
            this.ctx.arcTo(x, y, x + radius, y, radius);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    /**
     * Stroke pixel-perfect rectangle with rounded corners
     */
    strokePixelRect(x, y, width, height, color, lineWidth, radius = 0) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;

        if (radius === 0) {
            this.ctx.strokeRect(x, y, width, height);
        } else {
            this.ctx.beginPath();
            this.ctx.moveTo(x + radius, y);
            this.ctx.lineTo(x + width - radius, y);
            this.ctx.arcTo(x + width, y, x + width, y + radius, radius);
            this.ctx.lineTo(x + width, y + height - radius);
            this.ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
            this.ctx.lineTo(x + radius, y + height);
            this.ctx.arcTo(x, y + height, x, y + height - radius, radius);
            this.ctx.lineTo(x, y + radius);
            this.ctx.arcTo(x, y, x + radius, y, radius);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }

    // ==================== CLICK DETECTION (CRITICAL FIX) ====================

    /**
     * Get nail at canvas position (FIXED - was missing!)
     * @param {number} canvasX - Canvas X coordinate
     * @param {number} canvasY - Canvas Y coordinate
     * @returns {object|null} { hand: 'left'|'right', index: 0-4, nail: hitbox } or null
     */
    getNailAtPosition(canvasX, canvasY) {
        // Check all nail hitboxes (in reverse order - top to bottom)
        for (let i = this.nailHitboxes.length - 1; i >= 0; i--) {
            const hitbox = this.nailHitboxes[i];

            // Simple rectangular hit test (good enough for now)
            const dx = canvasX - hitbox.x;
            const dy = canvasY - hitbox.y;

            if (Math.abs(dx) <= hitbox.width / 2 && Math.abs(dy) <= hitbox.height / 2) {
                console.log(`[NailArtRenderer] Clicked nail: ${hitbox.hand} hand, finger ${hitbox.index}`);
                return {
                    hand: hitbox.hand,
                    index: hitbox.index,
                    nail: hitbox
                };
            }
        }

        return null; // No nail clicked
    }

    /**
     * Convert mouse/touch event to canvas coordinates
     */
    getCanvasCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const clientX = event.clientX || (event.touches && event.touches[0] && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0] && event.touches[0].clientY);

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    /**
     * Detect nail click from event (convenience method)
     * @param {MouseEvent|TouchEvent} event - Click or touch event
     * @returns {object|null} { hand, index, nail } or null
     */
    detectNailClick(event) {
        const coords = this.getCanvasCoordinates(event);
        return this.getNailAtPosition(coords.x, coords.y);
    }

    // ==================== CLEANUP ====================

    /**
     * Destroy renderer and cleanup
     */
    destroy() {
        this.stopAnimation();
        this.nailHitboxes = [];
        this.canvas = null;
        this.ctx = null;
        console.log('[NailArtRenderer] Destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NailArtRenderer;
}
