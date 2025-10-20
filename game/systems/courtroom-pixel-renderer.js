// ==================== COURTROOM PIXEL ART RENDERER ====================
// VROOM VROOM - Complete pixel art rendering system for Judge Hardcastle courtroom
// Replaces programmatic ace-attorney-courtroom.js with sprite-based rendering
// Disco Elysium aesthetic with bureaucratic oppression

// This system uses the pixel art data from /assets/courtroom/
// and provides a drop-in replacement for the existing JudgeSpriteRenderer

class PixelArtRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width || 800;
        this.height = canvas.height || 600;

        // Set canvas to crisp pixel art rendering
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;

        // Animation state
        this.animationFrame = 0;
        this.time = 0;

        // Judge state
        this.patience = 0;
        this.currentState = 'NEUTRAL';
        this.blinking = false;
        this.breathing = 0;
        this.gavelRaised = false;
        this.shakeOffset = { x: 0, y: 0 };

        // Initialize background and sprites
        this.background = new CourtroomBackground(this.width, this.height);
        this.judge = null; // Will be set based on state
        this.gavel = null;

        // Atmospheric effects
        this.dustParticles = this.initializeDustParticles();
        this.lightRays = this.initializeLightRays();
    }

    // Initialize floating dust particles
    initializeDustParticles() {
        const particles = [];
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: 1 + Math.floor(Math.random() * 2),
                speed: 0.1 + Math.random() * 0.3,
                opacity: 0.2 + Math.random() * 0.3,
                drift: Math.random() * Math.PI * 2
            });
        }
        return particles;
    }

    // Initialize light ray effects
    initializeLightRays() {
        return [
            { x: 200, width: 120, opacity: 0.08, angle: 15 },
            { x: 400, width: 100, opacity: 0.06, angle: 12 },
            { x: 600, width: 80, opacity: 0.05, angle: 18 }
        ];
    }

    // Update animation state
    update(patience) {
        this.patience = patience;
        this.animationFrame++;
        this.time += 0.016; // ~60fps

        // Update judge state based on patience
        this.updateJudgeState(patience);

        // Breathing animation (subtle)
        this.breathing = Math.sin(this.time * 2) * 2;

        // Blinking (random)
        if (Math.random() < 0.01 && !this.blinking) {
            this.blinking = true;
            setTimeout(() => this.blinking = false, 150);
        }

        // Gavel state
        this.gavelRaised = patience >= 61;

        // Screen shake based on anger
        if (patience >= 86) {
            this.shakeOffset.x = (Math.random() - 0.5) * 15;
            this.shakeOffset.y = (Math.random() - 0.5) * 15;
        } else if (patience >= 61) {
            this.shakeOffset.x = (Math.random() - 0.5) * 8;
            this.shakeOffset.y = (Math.random() - 0.5) * 8;
        } else {
            this.shakeOffset.x = 0;
            this.shakeOffset.y = 0;
        }

        // Update dust particles
        this.dustParticles.forEach(p => {
            p.y += p.speed;
            p.x += Math.sin(this.time + p.drift) * 0.5;

            // Wrap around screen
            if (p.y > this.height) p.y = 0;
            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
        });
    }

    // Update judge sprite based on patience level
    updateJudgeState(patience) {
        // Determine state
        if (patience >= 100) this.currentState = 'VOLCANIC';
        else if (patience >= 86) this.currentState = 'APOPLECTIC';
        else if (patience >= 61) this.currentState = 'FURIOUS';
        else if (patience >= 36) this.currentState = 'ANGRY';
        else if (patience >= 16) this.currentState = 'IRRITATED';
        else this.currentState = 'NEUTRAL';

        // Load appropriate sprite
        if (this.blinking) {
            this.judge = JudgePixelSprite.BLINK();
        } else if (patience >= 16) {
            this.judge = JudgePixelSprite.ANGRY_BROWS(patience);

            // Add veins for higher anger
            const veinCount = JUDGE_STATES[this.currentState].veinCount || 0;
            if (veinCount > 0) {
                this.judge = JudgePixelSprite.WITH_VEINS(veinCount);
            }
        } else {
            this.judge = JudgePixelSprite.NEUTRAL();
        }

        // Load gavel sprite
        if (this.gavelRaised) {
            this.gavel = GavelSprite.RAISED();
        } else {
            this.gavel = GavelSprite.REST();
        }
    }

    // Main render loop
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1612';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Apply screen shake
        this.ctx.save();
        this.ctx.translate(this.shakeOffset.x, this.shakeOffset.y);

        // Render background layers (parallax-ready)
        this.background.render(this.ctx, { x: 0, y: 0 });

        // Render light rays (atmospheric)
        this.renderLightRays();

        // Render dust particles (before judge)
        this.renderDustParticles(0.5);

        // Render judge sprite (centered, with breathing offset)
        if (this.judge) {
            const judgeX = this.width / 2 - 64; // Center 128px sprite
            const judgeY = 140 + this.breathing;
            this.renderPixelSprite(this.judge, judgeX, judgeY, 2.5); // Scale 2.5x
        }

        // Render gavel (if visible)
        if (this.gavel && this.gavelRaised) {
            const gavelX = this.width / 2 + 180;
            const gavelY = 200 + this.breathing;
            this.renderPixelSprite(this.gavel, gavelX, gavelY, 3);
        }

        // Render dust particles (foreground layer)
        this.renderDustParticles(1.0);

        this.ctx.restore();

        // Render vignette and atmospheric effects (not affected by shake)
        this.renderVignette();

        // Render anger overlay (red tint)
        if (this.patience >= 61) {
            const intensity = (this.patience - 60) / 40;
            this.ctx.fillStyle = `rgba(150, 0, 0, ${intensity * 0.3})`;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        // Film grain (static overlay)
        this.renderFilmGrain();
    }

    // Render pixel sprite from data structure
    renderPixelSprite(sprite, x, y, scale = 1) {
        if (!sprite.pixels && !sprite.layers) return;

        this.ctx.save();
        this.ctx.translate(x, y);

        // If sprite has layers (judge sprite)
        if (sprite.layers) {
            const layerOrder = ['wig_back', 'head', 'features', 'robes', 'veins'];

            layerOrder.forEach(layerName => {
                const layer = sprite.layers[layerName];
                if (!layer) return;

                layer.pixels.forEach(pixel => {
                    const [px, py, width, height, color] = pixel;
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(px * scale, py * scale, width * scale, height * scale);
                });
            });
        }
        // If sprite has simple pixel array (gavel sprite)
        else if (sprite.pixels) {
            sprite.pixels.forEach(pixel => {
                const [px, py, width, height, color] = pixel;
                this.ctx.fillStyle = color;
                this.ctx.fillRect(px * scale, py * scale, width * scale, height * scale);
            });
        }

        this.ctx.restore();
    }

    // Render light rays (god rays through windows)
    renderLightRays() {
        this.lightRays.forEach(ray => {
            const gradient = this.ctx.createLinearGradient(
                ray.x, 0,
                ray.x, 300
            );
            gradient.addColorStop(0, `rgba(255, 232, 176, ${ray.opacity})`);
            gradient.addColorStop(1, 'rgba(255, 232, 176, 0)');

            this.ctx.fillStyle = gradient;

            // Draw ray as trapezoid (widening downward)
            const topWidth = ray.width * 0.5;
            const bottomWidth = ray.width * 1.2;

            this.ctx.beginPath();
            this.ctx.moveTo(ray.x - topWidth / 2, 0);
            this.ctx.lineTo(ray.x + topWidth / 2, 0);
            this.ctx.lineTo(ray.x + bottomWidth / 2, 300);
            this.ctx.lineTo(ray.x - bottomWidth / 2, 300);
            this.ctx.closePath();
            this.ctx.fill();
        });
    }

    // Render floating dust particles
    renderDustParticles(layerOpacity = 1.0) {
        this.dustParticles.forEach(p => {
            const opacity = p.opacity * layerOpacity;
            this.ctx.fillStyle = `rgba(138, 127, 111, ${opacity})`;
            this.ctx.fillRect(p.x, p.y, p.size, p.size);
        });
    }

    // Render vignette effect
    renderVignette() {
        const gradient = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, this.width * 0.7
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Render film grain (Disco Elysium style)
    renderFilmGrain() {
        this.ctx.globalAlpha = 0.12;
        for (let i = 0; i < 120; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const size = Math.random() * 2;
            const brightness = Math.random() > 0.5 ? 255 : 0;
            this.ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            this.ctx.fillRect(x, y, size, size);
        }
        this.ctx.globalAlpha = 1.0;
    }

    // Trigger gavel strike animation
    triggerGavelStrike() {
        // Temporarily show strike frame
        this.gavel = GavelSprite.STRIKE();

        // Screen flash
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #fff;
            opacity: 0.8;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(flash);

        setTimeout(() => {
            flash.style.opacity = '0';
            flash.style.transition = 'opacity 0.2s';
            setTimeout(() => flash.remove(), 200);
        }, 50);

        // Restore raised gavel after strike
        setTimeout(() => {
            this.gavel = GavelSprite.RAISED();
        }, 200);

        // Play sound if available
        if (window.game && window.game.soundSystem) {
            window.game.soundSystem.playGavelStrike();
        }
    }
}

// ==================== ENHANCED COURTROOM CONTROLLER ====================
// Drop-in replacement for AceAttorneyCourtroom class

class PixelArtCourtroom {
    constructor(canvasId, dialogueContainerId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return;
        }

        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;

        // Initialize pixel art renderer
        this.renderer = new PixelArtRenderer(this.canvas);

        // Dialogue box (reuse existing system)
        this.dialogueBox = new CourtroomDialogueBox(document.getElementById(dialogueContainerId));

        this.isActive = false;
        this.animationLoop = null;
    }

    start(initialPatience = 0) {
        this.isActive = true;
        this.renderer.update(initialPatience);
        this.canvas.style.display = 'block';
        this.startAnimation();
    }

    stop() {
        this.isActive = false;
        this.canvas.style.display = 'none';
        if (this.animationLoop) {
            cancelAnimationFrame(this.animationLoop);
        }
    }

    startAnimation() {
        const animate = () => {
            if (!this.isActive) return;

            this.renderer.draw();
            this.animationLoop = requestAnimationFrame(animate);
        };
        animate();
    }

    updatePatience(patience) {
        this.renderer.update(patience);
    }

    showDialogue(speaker, text, callback) {
        this.dialogueBox.show(speaker, text, callback);
    }

    hideDialogue() {
        this.dialogueBox.hide();
    }

    triggerGavelStrike() {
        this.renderer.triggerGavelStrike();
    }
}

// ==================== PAPERWORK OVERLAY RENDERER ====================
// Renders bureaucratic forms over the courtroom scene

class PaperworkOverlay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.ctx = null;
        this.form = null;
    }

    show(formData = {}) {
        // Create canvas for form
        this.canvas = document.createElement('canvas');
        this.canvas.width = 600;
        this.canvas.height = 800;
        this.canvas.style.cssText = `
            display: block;
            margin: 20px auto;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            border: 2px solid #3d2f1f;
        `;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        // Render form
        this.form = new PaperworkForm(600, 800);
        this.form.renderTrafficViolationForm(formData);
        this.form.render(this.ctx);

        // Add to container
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        this.container.style.display = 'block';
    }

    hide() {
        this.container.style.display = 'none';
        if (this.canvas) {
            this.canvas.remove();
            this.canvas = null;
        }
    }

    updateForm(formData) {
        if (!this.ctx) return;

        // Re-render form with new data
        this.form.renderTrafficViolationForm(formData);
        this.ctx.clearRect(0, 0, 600, 800);
        this.form.render(this.ctx);
    }
}

// ==================== EXPORT ====================

// Check if this should replace existing AceAttorneyCourtroom
if (typeof window !== 'undefined') {
    // Store original class if it exists
    if (window.AceAttorneyCourtroom) {
        window.AceAttorneyCourtroom_Original = window.AceAttorneyCourtroom;
    }

    // Replace with pixel art version
    window.AceAttorneyCourtroom = PixelArtCourtroom;
    window.PaperworkOverlay = PaperworkOverlay;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PixelArtRenderer,
        PixelArtCourtroom,
        PaperworkOverlay
    };
}
