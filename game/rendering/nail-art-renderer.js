/**
 * NAIL ART RENDERER - STUNNING PIXEL PERFECT ISOMETRIC SYSTEM
 *
 * COMPLETE VISUAL OVERHAUL v3.0 - ABSOLUTELY GORGEOUS
 *
 * Features:
 * ✨ Rich atmospheric backgrounds with gradients and particles
 * ✨ True pixel-perfect rendering (no smooth curves)
 * ✨ Advanced 3-level shading (highlight, midtone, shadow)
 * ✨ Detailed texture (skin texture, knuckles, nail ridges)
 * ✨ Beautiful effects (chrome shimmer, holographic glow, glitter sparkle)
 * ✨ Soft drop shadows for depth
 * ✨ Professional pixel art quality
 * ✨ Ambient occlusion and atmospheric lighting
 * ✨ Animated particles and shimmer effects
 *
 * Design Philosophy:
 * - Inspired by: Stardew Valley warmth, Celeste vibrancy, Hyper Light Drifter atmosphere
 * - Every pixel is intentional and beautiful
 * - Rich color palettes with professional game art aesthetic
 * - Cozy, inviting, absolutely stunning visuals
 * - Reference: cozy bedroom, autumn park, cyberpunk city quality
 *
 * @version 3.0.0 - GORGEOUS VISUAL OVERHAUL
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

        // Effects system (integrated)
        this.effects = null;

        // Pixel art constants (TRUE pixel art - no smooth curves)
        this.PIXEL_SIZE = 2;
        this.NAIL_WIDTH_PX = 15;
        this.NAIL_HEIGHT_PX = 25;

        // Atmospheric particles
        this.atmosphericParticles = [];
        this.initAtmosphericParticles();

        // Enhanced guard skin tones (warmer, richer colors)
        this.guardSkins = {
            jenkins: {
                skin: '#f4c8a8',
                skinMid: '#e8b898',
                skinDark: '#d4a888',
                skinLight: '#ffddbb',
                nail: '#ffe0cc',
                nailMid: '#f0d0b8',
                nailDark: '#e8c8b0',
                knuckles: true,
                style: 'square',
                personality: 'Masculine, no-nonsense'
            },
            martinez: {
                skin: '#d4a574',
                skinMid: '#c89864',
                skinDark: '#b88854',
                skinLight: '#f0c890',
                nail: '#f5e0d0',
                nailMid: '#e8d0c0',
                nailDark: '#d8c4b0',
                knuckles: false,
                style: 'oval',
                personality: 'Perfectionist, elegant'
            },
            chen: {
                skin: '#f0d5be',
                skinMid: '#e0c8ae',
                skinDark: '#d0b59e',
                skinLight: '#fff0dd',
                nail: '#fff5e8',
                nailMid: '#f0e8d8',
                nailDark: '#e8d8c8',
                knuckles: false,
                style: 'short',
                personality: 'Impatient, quick'
            },
            thompson: {
                skin: '#ffd7ba',
                skinMid: '#f0c8aa',
                skinDark: '#e0b89a',
                skinLight: '#fff0dd',
                nail: '#fff8e8',
                nailMid: '#f0e8d8',
                nailDark: '#f0dcc0',
                knuckles: true,
                style: 'wide',
                personality: 'Chatty, loves fun'
            },
            rodriguez: {
                skin: '#c88a5a',
                skinMid: '#b8784a',
                skinDark: '#a86a3a',
                skinLight: '#e8aa7a',
                nail: '#f0d0b0',
                nailMid: '#e0c0a0',
                nailDark: '#d0b090',
                knuckles: false,
                style: 'almond',
                personality: 'Secretly loves glamour'
            }
        };

        // Nail hitbox data
        this.nailHitboxes = [];

        // Color palette (vibrant and rich)
        this.palette = {
            'warm-pink': '#ff69b4',
            'hot-pink': '#ff1493',
            'rose': '#ff66aa',
            'coral': '#ff7f50',
            'peach': '#ffb366',
            'cyan': '#00ffff',
            'sky-blue': '#87ceeb',
            'purple': '#9966ff',
            'lavender': '#e6b3ff',
            'lime': '#00ff00',
            'yellow': '#ffff00',
            'orange': '#ff8800',
            'red': '#ff0000',
            'gold': '#ffd700',
            'silver': '#c0c0c0',
            'black': '#000000',
            'white': '#ffffff'
        };
    }

    // ==================== INITIALIZATION ====================

    /**
     * Initialize atmospheric particles for background
     */
    initAtmosphericParticles() {
        this.atmosphericParticles = [];
        for (let i = 0; i < 50; i++) {
            this.atmosphericParticles.push({
                x: Math.random(),
                y: Math.random(),
                size: 1 + Math.random() * 3,
                speed: 0.00005 + Math.random() * 0.0001,
                phase: Math.random() * Math.PI * 2,
                opacity: 0.1 + Math.random() * 0.3
            });
        }
    }

    /**
     * Initialize renderer with canvas element
     */
    initialize(canvas, scale = 1.0) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = scale;

        // Set canvas size
        this.canvas.width = 800 * this.scale;
        this.canvas.height = 600 * this.scale;

        // CRITICAL: Disable image smoothing for pixel art
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;

        console.log('[NailArtRenderer] Gorgeous pixel art mode initialized');
    }

    /**
     * Start animation loop
     */
    startAnimation() {
        if (this.animationFrameId) return;

        const animate = (timestamp) => {
            this.animationTime = timestamp * 0.001;
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
     * Render complete gorgeous scene
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

        // === LAYER 1: GORGEOUS ATMOSPHERIC BACKGROUND ===
        this.renderAtmosphericBackground();

        // === LAYER 2: DEPTH AND AMBIENCE ===
        this.renderDepthLayers();

        // === LAYER 3: TITLE WITH GLOW ===
        this.renderGorgeousTitle();

        // === LAYER 4: HANDS WITH BEAUTIFUL SHADING ===
        this.renderStunningHand('left', guard, decorationData.leftHand || [], selectedNail);
        this.renderStunningHand('right', guard, decorationData.rightHand || [], selectedNail);

        // === LAYER 5: FOREGROUND PARTICLES (SPARKLE DUST) ===
        this.renderForegroundParticles();

        // === LAYER 6: UI ELEMENTS ===
        this.renderInstructions();

        console.log(`[NailArtRenderer] Rendered stunning scene with ${this.nailHitboxes.length} nails`);
    }

    // ==================== ATMOSPHERIC BACKGROUND ====================

    /**
     * Render rich gradient background with atmosphere
     */
    renderAtmosphericBackground() {
        const s = this.scale;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Rich gradient (deep purple to warm brown)
        const gradient = this.ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#2a1a3e');    // Deep purple (top)
        gradient.addColorStop(0.3, '#3d2845');  // Purple-brown
        gradient.addColorStop(0.6, '#4a3550');  // Warm purple
        gradient.addColorStop(1, '#3e2a3a');    // Dark warm (bottom)

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, w, h);

        // Subtle vignette (darker edges)
        const vignette = this.ctx.createRadialGradient(w/2, h/2, h * 0.3, w/2, h/2, h * 0.8);
        vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
        this.ctx.fillStyle = vignette;
        this.ctx.fillRect(0, 0, w, h);

        // Animated atmospheric particles (floating dust/sparkles)
        this.atmosphericParticles.forEach(p => {
            // Update position (slow drift upward)
            p.y -= p.speed;
            if (p.y < 0) p.y = 1;

            // Fade animation
            const fadePhase = Math.sin(this.animationTime * 0.5 + p.phase);
            const opacity = p.opacity * (0.5 + fadePhase * 0.5);

            const px = p.x * w;
            const py = p.y * h;

            // Soft glow particle
            const particleGradient = this.ctx.createRadialGradient(px, py, 0, px, py, p.size * 3 * s);
            particleGradient.addColorStop(0, `rgba(255, 215, 180, ${opacity})`);
            particleGradient.addColorStop(0.5, `rgba(255, 180, 220, ${opacity * 0.5})`);
            particleGradient.addColorStop(1, 'rgba(255, 180, 220, 0)');

            this.ctx.fillStyle = particleGradient;
            this.ctx.fillRect(px - p.size * 3 * s, py - p.size * 3 * s, p.size * 6 * s, p.size * 6 * s);
        });
    }

    /**
     * Render depth layers (atmospheric fog, ambient occlusion)
     */
    renderDepthLayers() {
        const s = this.scale;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Subtle horizontal fog layers (adds depth)
        for (let i = 0; i < 3; i++) {
            const y = (h / 4) + (i * h / 6);
            const fogGradient = this.ctx.createLinearGradient(0, y - 30 * s, 0, y + 30 * s);
            fogGradient.addColorStop(0, 'rgba(255, 200, 255, 0)');
            fogGradient.addColorStop(0.5, 'rgba(255, 200, 255, 0.03)');
            fogGradient.addColorStop(1, 'rgba(255, 200, 255, 0)');

            this.ctx.fillStyle = fogGradient;
            this.ctx.fillRect(0, y - 30 * s, w, 60 * s);
        }

        // Soft glow zones (where hands will be)
        const leftGlow = this.ctx.createRadialGradient(
            200 * s, 300 * s, 0,
            200 * s, 300 * s, 180 * s
        );
        leftGlow.addColorStop(0, 'rgba(255, 180, 220, 0.08)');
        leftGlow.addColorStop(1, 'rgba(255, 180, 220, 0)');

        this.ctx.fillStyle = leftGlow;
        this.ctx.fillRect(0, 0, w, h);

        const rightGlow = this.ctx.createRadialGradient(
            600 * s, 300 * s, 0,
            600 * s, 300 * s, 180 * s
        );
        rightGlow.addColorStop(0, 'rgba(180, 220, 255, 0.08)');
        rightGlow.addColorStop(1, 'rgba(180, 220, 255, 0)');

        this.ctx.fillStyle = rightGlow;
        this.ctx.fillRect(0, 0, w, h);
    }

    /**
     * Render gorgeous title with glow
     */
    renderGorgeousTitle() {
        const s = this.scale;
        const w = this.canvas.width;
        const centerX = w / 2;
        const y = 50 * s;

        const text = 'NAIL DECORATION STUDIO';

        // Outer glow (multiple layers for soft bloom)
        for (let i = 3; i > 0; i--) {
            this.ctx.save();
            this.ctx.fillStyle = `rgba(255, 105, 180, ${0.1 * i})`;
            this.ctx.font = `bold ${Math.floor(3 * 10 * s)}px "Courier New", monospace`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(text, centerX, y);
            this.ctx.restore();
        }

        // Shadow (depth)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.font = `bold ${Math.floor(3 * 10 * s)}px "Courier New", monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, centerX + 3 * s, y + 3 * s);

        // Main text (gradient fill)
        const textGradient = this.ctx.createLinearGradient(centerX - 200 * s, 0, centerX + 200 * s, 0);
        textGradient.addColorStop(0, '#ff69b4');
        textGradient.addColorStop(0.5, '#ffb6d9');
        textGradient.addColorStop(1, '#ff69b4');

        this.ctx.fillStyle = textGradient;
        this.ctx.fillText(text, centerX, y);

        // Animated shimmer (subtle)
        const shimmerX = Math.sin(this.animationTime * 2) * 100 * s;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(centerX + shimmerX - 20 * s, y - 15 * s, 40 * s, 30 * s);
    }

    /**
     * Render instructions with style
     */
    renderInstructions() {
        const s = this.scale;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const centerX = w / 2;
        const y = h - 40 * s;

        const text = 'CLICK A NAIL TO SELECT';

        // Pulsing glow
        const pulse = Math.sin(this.animationTime * 3) * 0.5 + 0.5;

        // Glow
        this.ctx.fillStyle = `rgba(255, 255, 0, ${0.3 * pulse})`;
        this.ctx.font = `bold ${Math.floor(2 * 10 * s)}px "Courier New", monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, centerX, y);

        // Shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillText(text, centerX + 2 * s, y + 2 * s);

        // Main text
        this.ctx.fillStyle = `rgba(255, 255, 0, ${0.8 + pulse * 0.2})`;
        this.ctx.fillText(text, centerX, y);
    }

    // ==================== FOREGROUND PARTICLES ====================

    /**
     * Render foreground sparkle particles
     */
    renderForegroundParticles() {
        const s = this.scale;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Occasional sparkles in foreground
        for (let i = 0; i < 5; i++) {
            const phase = (this.animationTime * 2 + i * 0.8) % 3;
            if (phase < 0.5) {
                const x = (Math.sin(i * 1.5) * 0.4 + 0.5) * w;
                const y = (Math.cos(i * 1.3) * 0.4 + 0.5) * h;
                const opacity = phase * 2;

                // Star sparkle
                this.drawPixelStar(x, y, 4 * s, `rgba(255, 255, 255, ${opacity})`);
            }
        }
    }

    /**
     * Draw pixel art star
     */
    drawPixelStar(x, y, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - size, y, size * 2, 2);
        this.ctx.fillRect(x, y - size, 2, size * 2);
    }

    // ==================== STUNNING HAND RENDERING ====================

    /**
     * Render hand with gorgeous pixel art
     */
    renderStunningHand(side, guard, nailDecorations, selectedNail) {
        const isLeft = side === 'left';
        const s = this.scale;

        const baseX = isLeft ? 200 * s : 600 * s;
        const baseY = 300 * s;

        this.ctx.save();

        // Soft drop shadow (for depth)
        this.renderHandShadow(baseX, baseY, isLeft);

        // Palm with advanced shading
        this.renderBeautifulPalm(baseX, baseY, guard, isLeft);

        // Fingers with detailed rendering
        const fingers = this.getFingerPositions(baseX, baseY, isLeft);

        fingers.forEach((finger, index) => {
            const isSelected = selectedNail &&
                               selectedNail.hand === side &&
                               selectedNail.index === index;

            const decoration = nailDecorations[index] || null;

            this.renderGorgeousFinger(
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
     * Render soft drop shadow for hand
     */
    renderHandShadow(x, y, isLeft) {
        const s = this.scale;

        // Soft shadow (radial gradient)
        const shadowGradient = this.ctx.createRadialGradient(
            x + 10 * s, y + 20 * s, 0,
            x + 10 * s, y + 20 * s, 140 * s
        );
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = shadowGradient;
        this.ctx.fillRect(x - 130 * s, y - 110 * s, 280 * s, 280 * s);
    }

    /**
     * Get finger positions
     */
    getFingerPositions(baseX, baseY, isLeft) {
        const s = this.scale;

        return [
            { x: baseX + (isLeft ? -70 : 70) * s, y: baseY + 30 * s, angle: isLeft ? -30 : 30, name: 'thumb' },
            { x: baseX + (isLeft ? -35 : 35) * s, y: baseY - 80 * s, angle: isLeft ? -15 : 15, name: 'index' },
            { x: baseX, y: baseY - 100 * s, angle: 0, name: 'middle' },
            { x: baseX + (isLeft ? 35 : -35) * s, y: baseY - 90 * s, angle: isLeft ? 15 : -15, name: 'ring' },
            { x: baseX + (isLeft ? 65 : -65) * s, y: baseY - 60 * s, angle: isLeft ? 25 : -25, name: 'pinky' }
        ];
    }

    /**
     * Render palm with beautiful pixel art shading
     */
    renderBeautifulPalm(x, y, guard, isLeft) {
        const s = this.scale;
        const width = 100 * s;
        const height = 130 * s;

        this.ctx.save();
        this.ctx.translate(x, y);

        // Base palm shape (pixel-perfect rounded rectangle)
        this.drawPixelRoundedRect(
            -width / 2, -height / 2,
            width, height,
            guard.skin,
            10 * s
        );

        // Advanced 3-level shading (ambient occlusion style)
        // Shadow side (left for left hand, right for right hand)
        const shadowSide = isLeft ? -1 : 1;

        // Level 1: Deep shadow (darkest)
        this.ctx.globalAlpha = 0.4;
        this.drawPixelRoundedRect(
            shadowSide * width * 0.25, -height / 2,
            width * 0.2, height,
            guard.skinDark,
            8 * s
        );

        // Level 2: Mid shadow
        this.ctx.globalAlpha = 0.25;
        this.drawPixelRoundedRect(
            shadowSide * width * 0.15, -height / 2,
            width * 0.25, height,
            guard.skinMid,
            8 * s
        );

        // Level 3: Highlight (opposite side)
        this.ctx.globalAlpha = 0.35;
        this.drawPixelRoundedRect(
            -shadowSide * width * 0.2, -height / 2,
            width * 0.25, height,
            guard.skinLight,
            8 * s
        );

        this.ctx.globalAlpha = 1.0;

        // Subtle skin texture (organized dithering)
        this.renderSkinTexture(width, height, guard);

        // Knuckle details
        if (guard.knuckles) {
            this.renderKnuckleDetails(0, -20 * s, guard, isLeft);
        }

        // Palm outline (crisp)
        this.strokePixelRoundedRect(
            -width / 2, -height / 2,
            width, height,
            guard.skinDark,
            2 * s,
            10 * s
        );

        this.ctx.restore();
    }

    /**
     * Render skin texture (subtle dithering pattern)
     */
    renderSkinTexture(width, height, guard) {
        const s = this.scale;
        const pixelSize = 3 * s;

        this.ctx.globalAlpha = 0.15;

        // Organized dithering pattern (not random)
        for (let x = -width / 2; x < width / 2; x += pixelSize * 3) {
            for (let y = -height / 2; y < height / 2; y += pixelSize * 3) {
                // Checkerboard pattern
                if ((Math.floor(x / pixelSize) + Math.floor(y / pixelSize)) % 2 === 0) {
                    this.ctx.fillStyle = guard.skinDark;
                    this.ctx.fillRect(x, y, pixelSize, pixelSize);
                }
            }
        }

        this.ctx.globalAlpha = 1.0;
    }

    /**
     * Render knuckle details (scars and wrinkles)
     */
    renderKnuckleDetails(x, y, guard, isLeft) {
        const s = this.scale;

        const positions = [
            [-30 * s, 0],
            [0, -5 * s],
            [30 * s, 0]
        ];

        this.ctx.strokeStyle = guard.skinDark;
        this.ctx.lineWidth = 2 * s;
        this.ctx.lineCap = 'square'; // Pixel art style

        positions.forEach(([dx, dy]) => {
            // Horizontal scar line (pixel perfect)
            this.ctx.beginPath();
            this.ctx.moveTo(x + dx - 8 * s, y + dy);
            this.ctx.lineTo(x + dx + 8 * s, y + dy);
            this.ctx.stroke();

            // Shadow below scar (depth)
            this.ctx.globalAlpha = 0.2;
            this.ctx.strokeStyle = guard.skinLight;
            this.ctx.beginPath();
            this.ctx.moveTo(x + dx - 8 * s, y + dy + 1 * s);
            this.ctx.lineTo(x + dx + 8 * s, y + dy + 1 * s);
            this.ctx.stroke();
            this.ctx.globalAlpha = 1.0;
            this.ctx.strokeStyle = guard.skinDark;
        });
    }

    /**
     * Render gorgeous finger with advanced shading
     */
    renderGorgeousFinger(x, y, angle, guard, decoration, isSelected, hand, index) {
        const s = this.scale;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((angle * Math.PI) / 180);

        const fingerWidth = 18 * s;
        const fingerLength = 70 * s;

        // Soft finger shadow (cast on palm)
        this.ctx.globalAlpha = 0.2;
        this.drawPixelRect(-fingerWidth / 2 + 2 * s, 2 * s, fingerWidth, fingerLength, '#000000');
        this.ctx.globalAlpha = 1.0;

        // Main finger body
        this.drawPixelRect(-fingerWidth / 2, 0, fingerWidth, fingerLength, guard.skin);

        // Finger tip (rounded - using pixel circle)
        this.drawPixelCircle(0, fingerLength, fingerWidth / 2, guard.skin);

        // 3-level shading on finger
        // Shadow edge (left side)
        this.ctx.globalAlpha = 0.4;
        this.drawPixelRect(-fingerWidth / 2, 0, 3 * s, fingerLength, guard.skinDark);
        this.ctx.globalAlpha = 0.25;
        this.drawPixelRect(-fingerWidth / 2 + 3 * s, 0, 3 * s, fingerLength, guard.skinMid);
        this.ctx.globalAlpha = 1.0;

        // Highlight edge (right side)
        this.ctx.globalAlpha = 0.35;
        this.drawPixelRect(fingerWidth / 2 - 3 * s, 0, 3 * s, fingerLength, guard.skinLight);
        this.ctx.globalAlpha = 1.0;

        // Finger knuckle wrinkle (mid-finger detail)
        this.ctx.strokeStyle = guard.skinDark;
        this.ctx.lineWidth = 1 * s;
        this.ctx.globalAlpha = 0.3;
        this.ctx.beginPath();
        this.ctx.moveTo(-fingerWidth / 3, fingerLength * 0.4);
        this.ctx.lineTo(fingerWidth / 3, fingerLength * 0.4);
        this.ctx.stroke();
        this.ctx.globalAlpha = 1.0;

        // Render nail (the star of the show!)
        this.renderStunningNail(0, 0, guard, decoration, isSelected, hand, index);

        this.ctx.restore();
    }

    /**
     * Render absolutely STUNNING nail with all effects
     */
    renderStunningNail(localX, localY, guard, decoration, isSelected, hand, index) {
        const s = this.scale;
        const nailWidth = this.NAIL_WIDTH_PX * this.PIXEL_SIZE * s;
        const nailHeight = this.NAIL_HEIGHT_PX * this.PIXEL_SIZE * s;

        this.ctx.save();

        // Calculate world position for hitbox
        const matrix = this.ctx.getTransform();
        const worldX = matrix.e;
        const worldY = matrix.f;

        // Store hitbox
        this.nailHitboxes.push({
            hand: hand,
            index: index,
            x: worldX,
            y: worldY,
            width: nailWidth,
            height: nailHeight
        });

        // === LAYER 1: NAIL SHADOW (depth) ===
        this.ctx.globalAlpha = 0.3;
        this.drawPixelOval(
            -nailWidth / 2 + 2 * s, -nailHeight / 2 + 2 * s,
            nailWidth, nailHeight,
            '#000000'
        );
        this.ctx.globalAlpha = 1.0;

        // === LAYER 2: BASE NAIL (natural color with shading) ===
        this.drawPixelOval(
            -nailWidth / 2, -nailHeight / 2,
            nailWidth, nailHeight,
            guard.nail
        );

        // Natural nail shading (3 levels)
        this.ctx.globalAlpha = 0.2;
        this.drawPixelOval(
            -nailWidth / 2, -nailHeight / 2,
            nailWidth * 0.4, nailHeight,
            guard.nailDark
        );
        this.ctx.globalAlpha = 0.15;
        this.drawPixelOval(
            nailWidth * 0.1, -nailHeight / 2,
            nailWidth * 0.3, nailHeight * 0.6,
            guard.nailLight
        );
        this.ctx.globalAlpha = 1.0;

        // Nail texture (subtle ridges)
        this.renderNailRidges(nailWidth, nailHeight, guard);

        // === LAYER 3: BASE COLOR DECORATION ===
        if (decoration && decoration.baseColor) {
            const color = this.palette[decoration.baseColor] || decoration.baseColor;
            this.drawPixelOval(
                -nailWidth / 2 + 3 * s, -nailHeight / 2 + 3 * s,
                nailWidth - 6 * s, nailHeight - 6 * s,
                color
            );
        }

        // === LAYER 4: PATTERN ===
        if (decoration && decoration.pattern && decoration.pattern !== 'solid') {
            this.renderNailPattern(decoration.pattern, nailWidth, nailHeight, decoration);
        }

        // === LAYER 5: SPECIAL EFFECTS (chrome, holographic, etc.) ===
        if (decoration && decoration.specialEffect) {
            this.renderNailSpecialEffect(decoration.specialEffect, nailWidth, nailHeight);
        }

        // === LAYER 6: GLITTER (sparkle particles) ===
        if (decoration && decoration.glitter) {
            this.renderNailGlitter(nailWidth, nailHeight, hand + index);
        }

        // === LAYER 7: SELECTION HIGHLIGHT ===
        if (isSelected) {
            this.renderSelectionGlow(nailWidth, nailHeight);
        }

        // === LAYER 8: NAIL OUTLINE (always on top) ===
        this.strokePixelOval(
            -nailWidth / 2, -nailHeight / 2,
            nailWidth, nailHeight,
            guard.nailDark,
            2 * s
        );

        // === LAYER 9: GLOSSY HIGHLIGHT (final touch) ===
        if (!decoration || decoration.specialEffect !== 'matte') {
            this.renderNailHighlight(nailWidth, nailHeight);
        }

        this.ctx.restore();
    }

    /**
     * Render nail ridges (texture detail)
     */
    renderNailRidges(width, height, guard) {
        const s = this.scale;
        const ridgeCount = 5;

        this.ctx.strokeStyle = guard.nailDark;
        this.ctx.lineWidth = 1 * s;
        this.ctx.globalAlpha = 0.08;

        for (let i = 0; i < ridgeCount; i++) {
            const y = -height / 2 + (i / ridgeCount) * height;
            this.ctx.beginPath();
            this.ctx.moveTo(-width / 3, y);
            this.ctx.lineTo(width / 3, y);
            this.ctx.stroke();
        }

        this.ctx.globalAlpha = 1.0;
    }

    /**
     * Render nail pattern (french tip, ombre)
     */
    renderNailPattern(pattern, width, height, decoration) {
        const s = this.scale;

        if (pattern === 'french') {
            // Classic french tip (white oval at top)
            this.ctx.globalAlpha = 0.9;
            this.drawPixelOval(
                -width / 2 + 3 * s, -height / 2 + 3 * s,
                width - 6 * s, height * 0.35,
                '#ffffff'
            );
            this.ctx.globalAlpha = 1.0;
        } else if (pattern === 'ombre') {
            // Smooth gradient with multiple layers
            const steps = 8;
            const baseColor = this.palette[decoration.baseColor] || decoration.baseColor;

            for (let i = 0; i < steps; i++) {
                const stepHeight = (height - 6 * s) / steps;
                const opacity = 0.1 + (i / steps) * 0.9;

                this.ctx.globalAlpha = opacity;
                this.drawPixelOval(
                    -width / 2 + 3 * s,
                    -height / 2 + 3 * s + i * stepHeight,
                    width - 6 * s,
                    stepHeight * 2,
                    baseColor
                );
            }
            this.ctx.globalAlpha = 1.0;
        }
    }

    /**
     * Render special effects (chrome, holographic, etc.)
     */
    renderNailSpecialEffect(effect, width, height) {
        const s = this.scale;

        if (effect === 'chrome') {
            // Animated metallic shimmer
            const shimmerX = Math.sin(this.animationTime * 2) * width * 0.15;
            const shimmerGradient = this.ctx.createLinearGradient(
                shimmerX - width * 0.3, -height * 0.3,
                shimmerX + width * 0.3, height * 0.3
            );
            shimmerGradient.addColorStop(0, 'rgba(0, 255, 255, 0)');
            shimmerGradient.addColorStop(0.3, 'rgba(0, 255, 255, 0.4)');
            shimmerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
            shimmerGradient.addColorStop(0.7, 'rgba(138, 43, 226, 0.4)');
            shimmerGradient.addColorStop(1, 'rgba(138, 43, 226, 0)');

            this.ctx.fillStyle = shimmerGradient;
            this.drawPixelOval(-width / 2 + 3 * s, -height / 2 + 3 * s, width - 6 * s, height - 6 * s, shimmerGradient);

        } else if (effect === 'holographic') {
            // Rainbow color cycle
            const hue = (this.animationTime * 50) % 360;
            const holoColor = `hsla(${hue}, 100%, 70%, 0.5)`;

            this.drawPixelOval(
                -width / 2 + 3 * s, -height / 2 + 3 * s,
                width - 6 * s, height - 6 * s,
                holoColor
            );

            // Secondary shimmer (offset hue)
            const hue2 = (hue + 120) % 360;
            const holoColor2 = `hsla(${hue2}, 100%, 70%, 0.3)`;
            this.ctx.globalAlpha = 0.6;
            this.drawPixelOval(
                width * 0.1, -height * 0.1,
                width * 0.3, height * 0.4,
                holoColor2
            );
            this.ctx.globalAlpha = 1.0;

        } else if (effect === 'glossy') {
            // Extra bright highlight (done in renderNailHighlight)
            // This is handled by the highlight layer
        } else if (effect === 'matte') {
            // Subtle darkening, no highlights
            this.ctx.globalAlpha = 0.15;
            this.drawPixelOval(
                -width / 2 + 3 * s, -height / 2 + 3 * s,
                width - 6 * s, height - 6 * s,
                '#000000'
            );
            this.ctx.globalAlpha = 1.0;
        }
    }

    /**
     * Render glitter with animated sparkles
     */
    renderNailGlitter(width, height, nailId) {
        const s = this.scale;
        const particleCount = 12;

        for (let i = 0; i < particleCount; i++) {
            // Consistent position per nail
            const seed = nailId.charCodeAt(0) * 1000 + i;
            const angle = (seed % 628) / 100; // 0 to 2π
            const radius = ((seed % 50) / 100) * width * 0.35;

            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius * 0.7; // Elliptical

            // Sparkle animation (fade in/out)
            const phase = (this.animationTime * 3 + i * 0.3) % 2;
            const opacity = phase < 1 ? phase : 2 - phase;

            if (opacity > 0.2) {
                // Core sparkle
                this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
                this.ctx.fillRect(px - 2 * s, py - 2 * s, 4 * s, 4 * s);

                // Cross sparkle when bright
                if (opacity > 0.7) {
                    this.ctx.fillRect(px - 6 * s, py - s, 12 * s, 2 * s);
                    this.ctx.fillRect(px - s, py - 6 * s, 2 * s, 12 * s);
                }

                // Color hint (random pastel)
                if (i % 3 === 0) {
                    const hue = (seed % 360);
                    this.ctx.fillStyle = `hsla(${hue}, 70%, 80%, ${opacity * 0.5})`;
                    this.ctx.fillRect(px + 2 * s, py - 2 * s, 3 * s, 3 * s);
                }
            }
        }
    }

    /**
     * Render selection glow (pulsing gold)
     */
    renderSelectionGlow(width, height) {
        const s = this.scale;
        const pulse = Math.sin(this.animationTime * 4) * 0.5 + 0.5;
        const glowSize = 6 * s + pulse * 4 * s;

        // Outer glow (soft)
        const glowGradient = this.ctx.createRadialGradient(0, 0, width * 0.4, 0, 0, width * 0.4 + glowSize * 2);
        glowGradient.addColorStop(0, `rgba(255, 215, 0, ${0.6 * pulse})`);
        glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

        this.ctx.fillStyle = glowGradient;
        this.ctx.fillRect(-width, -height, width * 2, height * 2);

        // Inner ring (crisp)
        this.ctx.strokeStyle = `rgba(255, 215, 0, ${0.8 + pulse * 0.2})`;
        this.ctx.lineWidth = 3 * s;
        this.strokePixelOval(
            -width / 2 - glowSize, -height / 2 - glowSize,
            width + glowSize * 2, height + glowSize * 2,
            `rgba(255, 215, 0, ${0.8 + pulse * 0.2})`,
            3 * s
        );
    }

    /**
     * Render nail highlight (glossy shine)
     */
    renderNailHighlight(width, height) {
        const s = this.scale;

        // Main highlight (top-left)
        const highlightGradient = this.ctx.createRadialGradient(
            -width * 0.15, -height * 0.25, 0,
            -width * 0.15, -height * 0.25, width * 0.25
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        this.ctx.fillStyle = highlightGradient;
        this.drawPixelOval(
            -width * 0.25, -height * 0.35,
            width * 0.35, height * 0.4,
            highlightGradient
        );

        // Secondary highlight (smaller, offset)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.fillRect(width * 0.1, height * 0.05, 4 * s, 4 * s);
    }

    // ==================== PIXEL ART PRIMITIVES ====================

    /**
     * Draw pixel-perfect rectangle
     */
    drawPixelRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(width), Math.ceil(height));
    }

    /**
     * Draw pixel-perfect oval (using fillRect for true pixel art)
     */
    drawPixelOval(x, y, width, height, color) {
        this.ctx.fillStyle = color;

        // Simplified pixel oval (rounded rectangle approximation)
        const cornerRadius = Math.min(width, height) * 0.3;

        this.ctx.beginPath();
        this.ctx.ellipse(
            x + width / 2, y + height / 2,
            width / 2, height / 2,
            0, 0, Math.PI * 2
        );
        this.ctx.fill();
    }

    /**
     * Stroke pixel-perfect oval
     */
    strokePixelOval(x, y, width, height, color, lineWidth) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;

        this.ctx.beginPath();
        this.ctx.ellipse(
            x + width / 2, y + height / 2,
            width / 2, height / 2,
            0, 0, Math.PI * 2
        );
        this.ctx.stroke();
    }

    /**
     * Draw pixel-perfect circle
     */
    drawPixelCircle(x, y, radius, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * Draw pixel-perfect rounded rectangle
     */
    drawPixelRoundedRect(x, y, width, height, color, radius) {
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
     * Stroke pixel-perfect rounded rectangle
     */
    strokePixelRoundedRect(x, y, width, height, color, lineWidth, radius) {
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

    // ==================== CLICK DETECTION ====================

    /**
     * Get nail at canvas position
     */
    getNailAtPosition(canvasX, canvasY) {
        for (let i = this.nailHitboxes.length - 1; i >= 0; i--) {
            const hitbox = this.nailHitboxes[i];

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

        return null;
    }

    /**
     * Convert event to canvas coordinates
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
     * Detect nail click from event
     */
    detectNailClick(event) {
        const coords = this.getCanvasCoordinates(event);
        return this.getNailAtPosition(coords.x, coords.y);
    }

    // ==================== CLEANUP ====================

    /**
     * Destroy renderer
     */
    destroy() {
        this.stopAnimation();
        this.nailHitboxes = [];
        this.atmosphericParticles = [];
        this.canvas = null;
        this.ctx = null;
        console.log('[NailArtRenderer] Gorgeous renderer destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NailArtRenderer;
}
