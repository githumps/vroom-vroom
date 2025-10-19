/**
 * NAIL ART EFFECTS - ANIMATION AND SPECIAL EFFECTS SYSTEM
 *
 * Advanced rendering effects for nail art decorations
 * Includes animations, particle systems, and visual polish
 *
 * Features:
 * - Sparkle/glitter animation system (fade in/out)
 * - Holographic color cycling (rainbow shimmer)
 * - Chrome reflection animation (jewel beetle effect)
 * - Iridescent multi-color shimmer
 * - Selection pulse effect (gold highlight)
 * - Particle systems (crystal caviar effect)
 *
 * @version 1.0.0
 * @artist isometric-pixel-artist agent
 * @date 2025-10-19
 */

class NailArtEffects {
    constructor() {
        // Animation timing
        this.animationTime = 0;
        this.frameCount = 0;

        // Effect configuration
        this.effects = {
            sparkle: {
                particleCount: 12,
                fadeSpeed: 3.0,
                baseOpacity: 0.8,
                sizeRange: [2, 4],
                colorVariations: ['#ffffff', '#ffffcc', '#e6f7ff']
            },

            holographic: {
                cycleSpeed: 50, // Degrees per second
                saturation: 100,
                lightness: 70,
                opacity: 0.5
            },

            chrome: {
                baseColor: '#c0c0c0',
                highlightColor: '#00ffff',
                shadowColor: '#4b0082',
                shimmerSpeed: 2.0,
                shimmerRange: 0.3
            },

            iridescent: {
                colors: ['#ff00ff', '#00ffff', '#ffff00'],
                cycleSpeed: 0.5,
                opacity: 0.4
            },

            selection: {
                pulseSpeed: 4.0,
                minOpacity: 0.4,
                maxOpacity: 1.0,
                minWidth: 4,
                maxWidth: 8,
                color: '#ffd700'
            },

            crystalCaviar: {
                beadCount: [5, 15], // Min/max beads
                beadSize: 3,
                colors: ['#ffffff', '#e6f7ff', '#fff0f5'],
                opacity: 0.9
            }
        };

        // Cached particle positions (for consistent sparkle placement)
        this.particleCache = new Map();
    }

    // ==================== ANIMATION UPDATE ====================

    /**
     * Update animation time (call this every frame)
     * @param {number} deltaTime - Time since last frame (seconds)
     */
    update(deltaTime = 0.016) {
        this.animationTime += deltaTime;
        this.frameCount++;
    }

    /**
     * Get current animation time
     */
    getTime() {
        return this.animationTime;
    }

    // ==================== SPARKLE/GLITTER EFFECTS ====================

    /**
     * Render sparkle/glitter particles on nail
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} nailShape - Nail shape bounds { width, height }
     * @param {number} scale - Display scale
     * @param {string} nailId - Unique nail identifier (for caching)
     */
    renderSparkles(ctx, nailShape, scale = 1.0, nailId = 'default') {
        const config = this.effects.sparkle;
        const particles = this.getSparkleParticles(nailId, nailShape, config.particleCount);

        particles.forEach((particle, index) => {
            // Calculate fade animation (each particle offset in time)
            const sparklePhase = (this.animationTime * config.fadeSpeed + index * 0.5) % 2;
            const opacity = sparklePhase < 1 ? sparklePhase : 2 - sparklePhase;

            if (opacity > 0.1) {
                // Core sparkle dot
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity * config.baseOpacity})`;
                ctx.beginPath();
                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.size * scale,
                    0, Math.PI * 2
                );
                ctx.fill();

                // Star cross (4 lines) when bright
                if (opacity > 0.7) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 1 * scale;
                    ctx.beginPath();

                    // Horizontal line
                    ctx.moveTo(particle.x - 4 * scale, particle.y);
                    ctx.lineTo(particle.x + 4 * scale, particle.y);

                    // Vertical line
                    ctx.moveTo(particle.x, particle.y - 4 * scale);
                    ctx.lineTo(particle.x, particle.y + 4 * scale);

                    ctx.stroke();
                }

                // Color variation sparkle
                if (opacity > 0.8 && particle.colorIndex !== undefined) {
                    const color = config.colorVariations[particle.colorIndex];
                    ctx.fillStyle = color + Math.floor(opacity * 128).toString(16).padStart(2, '0');
                    ctx.beginPath();
                    ctx.arc(
                        particle.x + 2 * scale,
                        particle.y - 2 * scale,
                        particle.size * 0.5 * scale,
                        0, Math.PI * 2
                    );
                    ctx.fill();
                }
            }
        });
    }

    /**
     * Get cached or generate sparkle particle positions
     */
    getSparkleParticles(nailId, nailShape, count) {
        if (this.particleCache.has(nailId)) {
            return this.particleCache.get(nailId);
        }

        const particles = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const radius = Math.random() * nailShape.width * 0.4;
            const ellipticalY = 0.7; // Flatten distribution for nail shape

            particles.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius * ellipticalY,
                size: this.effects.sparkle.sizeRange[0] +
                      Math.random() * (this.effects.sparkle.sizeRange[1] - this.effects.sparkle.sizeRange[0]),
                colorIndex: Math.floor(Math.random() * this.effects.sparkle.colorVariations.length)
            });
        }

        this.particleCache.set(nailId, particles);
        return particles;
    }

    // ==================== HOLOGRAPHIC EFFECT ====================

    /**
     * Render holographic rainbow shimmer
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} nailShape - Nail shape bounds
     */
    renderHolographic(ctx, nailShape) {
        const config = this.effects.holographic;
        const hue = (this.animationTime * config.cycleSpeed) % 360;

        ctx.fillStyle = `hsla(${hue}, ${config.saturation}%, ${config.lightness}%, ${config.opacity})`;
        ctx.beginPath();
        ctx.ellipse(
            0, 0,
            nailShape.width * 0.5,
            nailShape.height * 0.7,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Secondary shimmer layer (offset hue)
        const hue2 = (hue + 120) % 360;
        ctx.fillStyle = `hsla(${hue2}, ${config.saturation}%, ${config.lightness}%, ${config.opacity * 0.5})`;
        ctx.beginPath();
        ctx.ellipse(
            nailShape.width * 0.1,
            -nailShape.height * 0.1,
            nailShape.width * 0.3,
            nailShape.height * 0.4,
            0, 0, Math.PI * 2
        );
        ctx.fill();
    }

    // ==================== CHROME EFFECT ====================

    /**
     * Render chrome/jewel beetle shimmer effect
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} nailShape - Nail shape bounds
     */
    renderChrome(ctx, nailShape) {
        const config = this.effects.chrome;

        // Base gradient (cyan to silver to purple)
        const gradient = ctx.createLinearGradient(
            -nailShape.width * 0.5, -nailShape.height * 0.35,
            nailShape.width * 0.5, nailShape.height * 0.35
        );
        gradient.addColorStop(0, config.highlightColor + '4d'); // 30% opacity
        gradient.addColorStop(0.5, config.baseColor + '80'); // 50% opacity
        gradient.addColorStop(1, config.shadowColor + '4d'); // 30% opacity

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(
            0, 0,
            nailShape.width * 0.5,
            nailShape.height * 0.7,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Animated shimmer highlight (moves back and forth)
        const shimmerX = Math.sin(this.animationTime * config.shimmerSpeed) *
                        nailShape.width * config.shimmerRange;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.ellipse(
            shimmerX, -nailShape.height * 0.2,
            nailShape.width * 0.15,
            nailShape.height * 0.3,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Secondary shimmer (opposite phase)
        const shimmerX2 = Math.sin(this.animationTime * config.shimmerSpeed + Math.PI) *
                         nailShape.width * config.shimmerRange * 0.5;

        ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.ellipse(
            shimmerX2, nailShape.height * 0.1,
            nailShape.width * 0.12,
            nailShape.height * 0.25,
            0, 0, Math.PI * 2
        );
        ctx.fill();
    }

    // ==================== IRIDESCENT EFFECT ====================

    /**
     * Render iridescent multi-color shimmer
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} nailShape - Nail shape bounds
     */
    renderIridescent(ctx, nailShape) {
        const config = this.effects.iridescent;
        const colorIndex = Math.floor(this.animationTime * config.cycleSpeed) % config.colors.length;
        const color = config.colors[colorIndex];

        // Main color layer
        ctx.fillStyle = color + Math.floor(config.opacity * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.ellipse(
            0, 0,
            nailShape.width * 0.5,
            nailShape.height * 0.7,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Transitional blend (show next color fading in)
        const nextColorIndex = (colorIndex + 1) % config.colors.length;
        const nextColor = config.colors[nextColorIndex];
        const blendPhase = (this.animationTime * config.cycleSpeed) % 1;

        ctx.fillStyle = nextColor + Math.floor(blendPhase * config.opacity * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.ellipse(
            0, 0,
            nailShape.width * 0.5,
            nailShape.height * 0.7,
            0, 0, Math.PI * 2
        );
        ctx.fill();
    }

    // ==================== SELECTION PULSE ====================

    /**
     * Render selection highlight pulse
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} nailShape - Nail shape bounds
     */
    renderSelectionPulse(ctx, nailShape) {
        const config = this.effects.selection;

        // Pulse animation (sine wave)
        const pulsePhase = Math.sin(this.animationTime * config.pulseSpeed) * 0.5 + 0.5;
        const opacity = config.minOpacity + (config.maxOpacity - config.minOpacity) * pulsePhase;
        const width = config.minWidth + (config.maxWidth - config.minWidth) * pulsePhase;

        ctx.strokeStyle = config.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.ellipse(
            0, 0,
            nailShape.width * 0.5 + width,
            nailShape.height * 0.7 + width,
            0, 0, Math.PI * 2
        );
        ctx.stroke();

        // Outer glow ring
        ctx.strokeStyle = config.color + Math.floor(opacity * 0.5 * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = width * 0.5;
        ctx.beginPath();
        ctx.ellipse(
            0, 0,
            nailShape.width * 0.5 + width * 2,
            nailShape.height * 0.7 + width * 2,
            0, 0, Math.PI * 2
        );
        ctx.stroke();
    }

    // ==================== CRYSTAL CAVIAR EFFECT ====================

    /**
     * Render crystal caviar beads (3D bubble effect)
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} nailShape - Nail shape bounds
     * @param {number} scale - Display scale
     * @param {string} nailId - Unique nail identifier
     */
    renderCrystalCaviar(ctx, nailShape, scale = 1.0, nailId = 'default-caviar') {
        const config = this.effects.crystalCaviar;
        const beads = this.getCaviarBeads(nailId, nailShape, config);

        beads.forEach(bead => {
            // Gradient for 3D sphere effect
            const gradient = ctx.createRadialGradient(
                bead.x - bead.size * 0.3,
                bead.y - bead.size * 0.3,
                bead.size * 0.1,
                bead.x, bead.y,
                bead.size
            );
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.4, bead.color);
            gradient.addColorStop(1, this.darkenColor(bead.color, 30));

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(bead.x, bead.y, bead.size * scale, 0, Math.PI * 2);
            ctx.fill();

            // Highlight shine
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.arc(
                bead.x - bead.size * 0.4,
                bead.y - bead.size * 0.4,
                bead.size * 0.3 * scale,
                0, Math.PI * 2
            );
            ctx.fill();

            // Shadow/outline
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 0.5 * scale;
            ctx.beginPath();
            ctx.arc(bead.x, bead.y, bead.size * scale, 0, Math.PI * 2);
            ctx.stroke();
        });
    }

    /**
     * Get cached or generate caviar bead positions
     */
    getCaviarBeads(nailId, nailShape, config) {
        const cacheKey = nailId + '-caviar';
        if (this.particleCache.has(cacheKey)) {
            return this.particleCache.get(cacheKey);
        }

        const beadCount = config.beadCount[0] +
                         Math.floor(Math.random() * (config.beadCount[1] - config.beadCount[0]));
        const beads = [];

        for (let i = 0; i < beadCount; i++) {
            beads.push({
                x: (Math.random() - 0.5) * nailShape.width * 0.7,
                y: (Math.random() - 0.5) * nailShape.height * 0.9,
                size: config.beadSize + Math.random() * 2,
                color: config.colors[Math.floor(Math.random() * config.colors.length)]
            });
        }

        this.particleCache.set(cacheKey, beads);
        return beads;
    }

    // ==================== MATTE FINISH ====================

    /**
     * Render matte finish (subtle darkening, no highlights)
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} nailShape - Nail shape bounds
     */
    renderMatte(ctx, nailShape) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.ellipse(
            0, 0,
            nailShape.width * 0.5,
            nailShape.height * 0.7,
            0, 0, Math.PI * 2
        );
        ctx.fill();
    }

    // ==================== GLOSSY FINISH ====================

    /**
     * Render glossy finish (bright highlight)
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} nailShape - Nail shape bounds
     */
    renderGlossy(ctx, nailShape) {
        // Large bright highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.ellipse(
            -nailShape.width * 0.15,
            -nailShape.height * 0.25,
            nailShape.width * 0.2,
            nailShape.height * 0.3,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Secondary highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(
            nailShape.width * 0.1,
            nailShape.height * 0.1,
            nailShape.width * 0.12,
            nailShape.height * 0.2,
            0, 0, Math.PI * 2
        );
        ctx.fill();
    }

    // ==================== UTILITY FUNCTIONS ====================

    /**
     * Darken a hex color by percentage
     */
    darkenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.max(0, ((num >> 16) - percent));
        const g = Math.max(0, (((num >> 8) & 0x00FF) - percent));
        const b = Math.max(0, ((num & 0x0000FF) - percent));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }

    /**
     * Clear particle cache (for memory management)
     */
    clearCache() {
        this.particleCache.clear();
        console.log('[NailArtEffects] Particle cache cleared');
    }

    /**
     * Reset animation time
     */
    reset() {
        this.animationTime = 0;
        this.frameCount = 0;
        console.log('[NailArtEffects] Animation reset');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NailArtEffects;
}
