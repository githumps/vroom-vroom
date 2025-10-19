// ==================== ACE ATTORNEY COURTROOM SYSTEM ====================
// VROOM VROOM - Visual Novel Style Courtroom
// Canvas-based Judge Hardcastle sprite system with Darkest Dungeon atmosphere

class JudgeSpriteRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        // Judge anger states (0-100 patience mapping)
        this.states = {
            NEUTRAL: { min: 0, max: 15, color: '#c5a789', veinColor: null, veinCount: 0 },
            IRRITATED: { min: 16, max: 35, color: '#c59f85', veinColor: '#aa6655', veinCount: 1 },
            ANGRY: { min: 36, max: 60, color: '#cc8870', veinColor: '#8b0000', veinCount: 3 },
            FURIOUS: { min: 61, max: 85, color: '#dd6655', veinColor: '#8b0000', veinCount: 5 },
            APOPLECTIC: { min: 86, max: 99, color: '#ee5544', veinColor: '#660000', veinCount: 7 },
            VOLCANIC: { min: 100, max: 100, color: '#aa2244', veinColor: '#000000', veinCount: 9 }
        };

        this.currentState = 'NEUTRAL';
        this.currentPatience = 0;
        this.animationFrame = 0;
        this.breathing = 0;
        this.blinking = false;
        this.gavelRaised = false;
        this.shakeOffset = { x: 0, y: 0 };
    }

    update(patience) {
        this.currentPatience = patience;

        // Determine state based on patience
        for (let state in this.states) {
            const s = this.states[state];
            if (patience >= s.min && patience <= s.max) {
                this.currentState = state;
                break;
            }
        }

        // Update animations
        this.animationFrame++;
        this.breathing = Math.sin(this.animationFrame * 0.05) * 2;

        // Blinking (random)
        if (Math.random() < 0.01) {
            this.blinking = true;
            setTimeout(() => this.blinking = false, 150);
        }

        // Gavel raised for high anger states
        this.gavelRaised = patience >= 61;

        // Screen shake intensity based on anger
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
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1612';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Apply shake offset
        this.ctx.save();
        this.ctx.translate(this.shakeOffset.x, this.shakeOffset.y);

        // Draw judge (simplified sprite)
        this.drawJudge();

        // Draw gavel if raised
        if (this.gavelRaised) {
            this.drawGavel();
        }

        // Draw veins if angry enough
        const state = this.states[this.currentState];
        if (state.veinCount > 0) {
            this.drawVeins(state.veinCount, state.veinColor);
        }

        this.ctx.restore();

        // Draw atmosphere effects (not affected by shake)
        this.drawAtmosphere();

        // Red overlay for high anger
        if (this.currentPatience >= 61) {
            const intensity = (this.currentPatience - 60) / 40;
            this.ctx.fillStyle = `rgba(150, 0, 0, ${intensity * 0.3})`;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    }

    drawJudge() {
        const state = this.states[this.currentState];
        const centerX = this.width / 2;
        const baseY = this.height * 0.3 + this.breathing;

        // Judge's desk (draw first, behind everything)
        this.ctx.fillStyle = '#3d2f1f'; // Mahogany
        this.ctx.fillRect(0, baseY + 280, this.width, 120);
        // Desk front panel
        this.ctx.fillStyle = '#2a2015';
        this.ctx.fillRect(0, baseY + 280, this.width, 20);

        // Body (judge's robe) - black judicial robe
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(centerX - 140, baseY + 100, 280, 180);
        // Robe collar (white)
        this.ctx.fillStyle = '#f5f5f5';
        this.ctx.fillRect(centerX - 80, baseY + 100, 160, 30);

        // Neck
        this.ctx.fillStyle = state.color;
        this.ctx.fillRect(centerX - 30, baseY + 70, 60, 50);

        // Head - pixel art style (rectangular, not circle)
        const headWidth = 110;
        const headHeight = 130;
        this.ctx.fillStyle = state.color;
        this.ctx.fillRect(centerX - headWidth/2, baseY - headHeight + 30, headWidth, headHeight);

        // Judge's wig (white/grey) - iconic judicial wig
        this.ctx.fillStyle = '#e8e8e8';
        // Top of wig
        this.ctx.fillRect(centerX - headWidth/2 - 10, baseY - headHeight + 20, headWidth + 20, 40);
        // Wig curls on sides
        this.ctx.fillRect(centerX - headWidth/2 - 15, baseY - headHeight + 60, 20, 60);
        this.ctx.fillRect(centerX + headWidth/2 - 5, baseY - headHeight + 60, 20, 60);

        // Facial features (pixel art style)
        this.drawFace(centerX, baseY, headWidth, headHeight);
    }

    drawFace(x, y, headWidth, headHeight) {
        const state = this.currentState;

        // Pixel art style - use rectangles, not curves
        const eyeY = y - headHeight/2 + 20;
        const eyeSpacing = 25;

        // Eyes (pixel art rectangles)
        this.ctx.fillStyle = '#000';
        if (this.blinking) {
            // Closed eyes (thin horizontal line)
            this.ctx.fillRect(x - eyeSpacing - 8, eyeY, 16, 3);
            this.ctx.fillRect(x + eyeSpacing - 8, eyeY, 16, 3);
        } else {
            // Open eyes (rectangles)
            this.ctx.fillRect(x - eyeSpacing - 8, eyeY - 8, 16, 16);
            this.ctx.fillRect(x + eyeSpacing - 8, eyeY - 8, 16, 16);

            // Eye whites (smaller rectangles inside)
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(x - eyeSpacing - 4, eyeY - 4, 6, 6);
            this.ctx.fillRect(x + eyeSpacing - 4, eyeY - 4, 6, 6);
        }

        // Eyebrows (pixel art, angle based on anger)
        this.ctx.fillStyle = '#000';
        const browY = eyeY - 18;
        const browAngle = Math.floor((this.currentPatience / 100) * 8); // 0-8 pixel offset

        // Left eyebrow (angry = higher on inside)
        this.ctx.fillRect(x - eyeSpacing - 12, browY - browAngle, 24, 4);

        // Right eyebrow (angry = higher on inside)
        this.ctx.fillRect(x + eyeSpacing - 12, browY - browAngle, 24, 4);

        // Nose (simple pixel line)
        this.ctx.fillRect(x - 2, eyeY + 12, 4, 12);

        // Mouth/frown (deeper frown = more anger)
        const mouthY = y + 30;
        const frown = Math.floor((this.currentPatience / 100) * 15); // 0-15 pixel droop

        this.ctx.fillStyle = '#000';
        // Horizontal mouth line
        this.ctx.fillRect(x - 20, mouthY, 40, 4);
        // Droop on ends for frown
        if (frown > 0) {
            this.ctx.fillRect(x - 20, mouthY, 4, frown);
            this.ctx.fillRect(x + 16, mouthY, 4, frown);
        }

        // Mustache (pixel art - optional, makes him look more judge-like)
        this.ctx.fillStyle = '#4a4a4a';
        this.ctx.fillRect(x - 25, mouthY - 8, 20, 6);
        this.ctx.fillRect(x + 5, mouthY - 8, 20, 6);
    }

    drawVeins(count, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;

        const centerX = this.width / 2;
        const baseY = this.height * 0.4 + this.breathing;

        // Draw pulsing veins on forehead
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 0.5 - Math.PI * 0.25;
            const startX = centerX + Math.cos(angle) * 60;
            const startY = baseY - 100;
            const pulse = Math.sin(this.animationFrame * 0.1 + i) * 3;

            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(startX + Math.cos(angle) * (20 + pulse), startY - 20);
            this.ctx.stroke();
        }
    }

    drawGavel() {
        const centerX = this.width / 2 + 180;
        const baseY = this.height * 0.4 + this.breathing;

        // Gavel handle
        this.ctx.fillStyle = '#4a3520';
        this.ctx.fillRect(centerX - 5, baseY - 80, 10, 100);

        // Gavel head
        this.ctx.fillStyle = '#5a4530';
        this.ctx.fillRect(centerX - 25, baseY - 100, 50, 20);

        // Trembling animation for FURIOUS+
        if (this.currentPatience >= 61) {
            const tremble = Math.sin(this.animationFrame * 0.3) * 3;
            this.ctx.translate(tremble, 0);
        }
    }

    drawAtmosphere() {
        // Vignette effect
        const gradient = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, this.width * 0.7
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Film grain
        this.ctx.globalAlpha = 0.15;
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const size = Math.random() * 2;
            this.ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
            this.ctx.fillRect(x, y, size, size);
        }
        this.ctx.globalAlpha = 1.0;
    }
}

// ==================== COURTROOM DIALOGUE SYSTEM ====================

class CourtroomDialogueBox {
    constructor(container) {
        this.container = container;
        this.isVisible = false;
        this.currentText = '';
        this.displayedText = '';
        this.charIndex = 0;
        this.typewriterSpeed = 30; // ms per character
        this.typewriterInterval = null;
    }

    show(speaker, text, callback) {
        this.currentText = text;
        this.displayedText = '';
        this.charIndex = 0;
        this.isVisible = true;

        // Update UI
        this.container.style.display = 'block';
        this.container.innerHTML = `
            <div style="background: rgba(0, 0, 0, 0.9); border: 3px solid #0f0; padding: 20px; margin: 20px;">
                <div style="color: #ff0; font-size: 1.2em; margin-bottom: 10px;">${speaker}</div>
                <div id="dialogueText" style="color: #0f0; font-size: 1.1em; min-height: 60px;"></div>
                <div style="color: #888; font-size: 0.9em; margin-top: 10px; text-align: right;">▼ Click to continue</div>
            </div>
        `;

        // Start typewriter effect
        this.startTypewriter(callback);

        // Click to continue
        this.container.onclick = () => {
            if (this.charIndex < this.currentText.length) {
                // Skip to end
                this.displayedText = this.currentText;
                document.getElementById('dialogueText').textContent = this.displayedText;
                clearInterval(this.typewriterInterval);
                this.charIndex = this.currentText.length;
            } else {
                // Continue
                this.hide();
                if (callback) callback();
            }
        };
    }

    startTypewriter(callback) {
        this.typewriterInterval = setInterval(() => {
            if (this.charIndex < this.currentText.length) {
                this.displayedText += this.currentText[this.charIndex];
                document.getElementById('dialogueText').textContent = this.displayedText;
                this.charIndex++;
            } else {
                clearInterval(this.typewriterInterval);
            }
        }, this.typewriterSpeed);
    }

    hide() {
        this.isVisible = false;
        this.container.style.display = 'none';
        this.container.onclick = null;
        clearInterval(this.typewriterInterval);
    }
}

// ==================== ACE ATTORNEY COURTROOM CONTROLLER ====================

class AceAttorneyCourtroom {
    constructor(canvasId, dialogueContainerId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return;
        }

        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;

        this.judgeRenderer = new JudgeSpriteRenderer(this.canvas);
        this.dialogueBox = new CourtroomDialogueBox(document.getElementById(dialogueContainerId));

        this.isActive = false;
        this.animationLoop = null;
    }

    start(initialPatience = 0) {
        this.isActive = true;
        this.judgeRenderer.update(initialPatience);
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

            this.judgeRenderer.draw();
            this.animationLoop = requestAnimationFrame(animate);
        };
        animate();
    }

    updatePatience(patience) {
        this.judgeRenderer.update(patience);
    }

    showDialogue(speaker, text, callback) {
        this.dialogueBox.show(speaker, text, callback);
    }

    hideDialogue() {
        this.dialogueBox.hide();
    }

    triggerGavelStrike() {
        // Visual effect for gavel strike
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

        // Play sound if available
        if (window.game && window.game.soundSystem) {
            window.game.soundSystem.playGavelStrike();
        }
    }
}

// ==================== END ACE ATTORNEY COURTROOM ====================
