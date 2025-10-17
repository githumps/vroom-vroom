# ENHANCED COURTROOM - CODE SNIPPETS

**Design Doc:** `docs/systems/ENHANCED_COURTROOM_TECHNICAL_DESIGN.md`
**Quick Ref:** `docs/systems/ENHANCED_COURTROOM_QUICK_REFERENCE.md`

---

## COMPLETE CODE EXAMPLES

### 1. MAIN CLASS STRUCTURE (enhanced-courtroom.js)

```javascript
/**
 * EnhancedCourtroomSystem
 * Main orchestrator for the doom-filled courtroom experience
 */
class EnhancedCourtroomSystem {
    constructor(game) {
        this.game = game;
        this.canvas = null;
        this.ctx = null;
        this.renderer = null;
        this.paperwork = null;
        this.reactions = null;
        this.active = false;

        // State
        this.currentView = 'down'; // 'down' or 'up'
        this.transitioning = false;
        this.transitionProgress = 0;
        this.idleTime = 0; // Tracks how long player has been idle
    }

    initialize() {
        console.log('[EnhancedCourtroom] Initializing...');

        this.setupCanvas();
        this.renderer = new EnhancedCourtroomRenderer(this.canvas, this.game);
        this.paperwork = new EnhancedPaperworkSystem(this.game);
        this.reactions = new JudgeReactionSystem(this.game.judge, this.renderer, this);

        this.setupControls();
        this.startRenderLoop();

        console.log('[EnhancedCourtroom] Initialization complete');
    }

    setupCanvas() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'courtroomCanvas';
        this.canvas.width = 1200;
        this.canvas.height = 800;
        this.ctx = this.canvas.getContext('2d');

        // Styling
        this.canvas.style.display = 'block';
        this.canvas.style.width = '100%';
        this.canvas.style.maxWidth = '1200px';
        this.canvas.style.height = 'auto';
        this.canvas.style.margin = '0 auto';
        this.canvas.style.border = '2px solid #0f0';
        this.canvas.style.background = '#000';

        // Insert into courtroom screen (before existing content)
        const courtroomScreen = document.getElementById('courtroom');
        courtroomScreen.insertBefore(this.canvas, courtroomScreen.firstChild);
    }

    setupControls() {
        // Desktop controls
        document.addEventListener('keydown', (e) => {
            if (!this.active) return;

            // Spacebar: Toggle view
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleView();
            }

            // Arrow keys: Navigate forms (when looking down)
            if (this.currentView === 'down' && !this.transitioning) {
                if (e.code === 'ArrowLeft') this.previousPage();
                if (e.code === 'ArrowRight') this.nextPage();
            }
        });

        // Mobile controls (touch gestures)
        this.setupTouchGestures();
    }

    setupTouchGestures() {
        let touchStartY = 0;
        let touchStartTime = 0;

        this.canvas.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scroll
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
            if (!this.active || this.transitioning) return;

            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();

            const deltaY = touchEndY - touchStartY;
            const deltaTime = touchEndTime - touchStartTime;

            // Detect swipe (50px minimum, under 500ms)
            if (Math.abs(deltaY) > 50 && deltaTime < 500) {
                if (deltaY < 0 && this.currentView === 'down') {
                    // Swipe up: Look at judge
                    this.transitionToJudge();
                } else if (deltaY > 0 && this.currentView === 'up') {
                    // Swipe down: Look at desk
                    this.transitionToDesk();
                }
            }
        });
    }

    toggleView() {
        if (this.transitioning) return;

        if (this.currentView === 'down') {
            this.transitionToJudge();
        } else {
            this.transitionToDesk();
        }
    }

    transitionToJudge() {
        if (this.transitioning || this.currentView === 'up') return;

        console.log('[EnhancedCourtroom] Looking up at judge...');
        this.transitioning = true;
        this.transitionProgress = 0;
        this.transitionDuration = 600; // ms
        this.transitionStart = Date.now();
        this.targetView = 'up';

        // Play chair creak sound
        if (this.game.soundSystem) {
            this.game.soundSystem.playChairCreak();
        }

        // Trigger judge reaction
        this.reactions.onPlayerLooksUp();
    }

    transitionToDesk() {
        if (this.transitioning || this.currentView === 'down') return;

        console.log('[EnhancedCourtroom] Looking down at desk...');
        this.transitioning = true;
        this.transitionProgress = 0;
        this.transitionDuration = 600; // ms
        this.transitionStart = Date.now();
        this.targetView = 'down';

        // Play chair creak sound
        if (this.game.soundSystem) {
            this.game.soundSystem.playChairCreak();
        }
    }

    updateTransition() {
        if (!this.transitioning) return;

        const elapsed = Date.now() - this.transitionStart;
        const progress = Math.min(elapsed / this.transitionDuration, 1);

        // Ease in-out quad
        this.transitionProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        if (progress >= 1) {
            this.transitioning = false;
            this.currentView = this.targetView;
            console.log(`[EnhancedCourtroom] Transition complete. Now viewing: ${this.currentView}`);
        }
    }

    activate() {
        console.log('[EnhancedCourtroom] Activating courtroom system');
        this.active = true;
        this.currentView = 'down'; // Always start looking down
        this.transitioning = false;
        this.idleTime = 0;

        // Reset paperwork
        this.paperwork.reset();

        // Update judge mood
        this.game.judge.calculateNewMood();
        this.renderer.updateAngerState();
    }

    deactivate() {
        console.log('[EnhancedCourtroom] Deactivating courtroom system');
        this.active = false;
    }

    startRenderLoop() {
        let lastTime = Date.now();

        const loop = () => {
            const now = Date.now();
            const deltaTime = now - lastTime;
            lastTime = now;

            if (this.active) {
                this.update(deltaTime);
                this.renderer.render(deltaTime, this.currentView, this.transitionProgress);
            }

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    update(deltaTime) {
        // Update transition
        this.updateTransition();

        // Update idle timer
        this.idleTime += deltaTime;

        // Check for excessive delays
        this.reactions.checkPlayerDelay(this.idleTime / 1000);

        // Update renderer state
        this.renderer.update(deltaTime);
    }

    nextPage() {
        const success = this.paperwork.nextPage();
        if (success && this.game.soundSystem) {
            this.game.soundSystem.playPaperRustle();
        }
        this.resetIdleTimer();
    }

    previousPage() {
        const success = this.paperwork.previousPage();
        if (success && this.game.soundSystem) {
            this.game.soundSystem.playPaperRustle();
        }
        this.resetIdleTimer();
    }

    resetIdleTimer() {
        this.idleTime = 0;
    }

    processFormSubmission() {
        console.log('[EnhancedCourtroom] Processing form submission...');

        // Validate all pages
        const results = this.paperwork.validateAll();

        if (results.errors.length > 0) {
            console.log(`[EnhancedCourtroom] Found ${results.errors.length} errors`);
            this.processFormErrors(results.errors);
        } else {
            console.log('[EnhancedCourtroom] No errors found');
            this.game.judge.say("Acceptable. Surprisingly competent.");
        }

        // Calculate final sentence
        this.calculateFinalSentence();

        // Deactivate and move to prison
        this.deactivate();
        this.game.sendToPrison();
    }

    processFormErrors(errors) {
        errors.forEach(error => {
            // Reduce judge patience
            this.game.judge.updateMood(-5);

            // Add sentence penalty
            const yearsToAdd = error.penalty / 12; // Convert months to years
            this.game.player.sentence += yearsToAdd;

            // Judge commentary
            this.game.judge.say(error.message);

            // Update anger state
            this.renderer.updateAngerState();

            // Trigger gavel strike for serious errors
            if (error.penalty >= 12) {
                this.renderer.triggerGavelStrike();
            }
        });

        // If many errors, trigger big gavel strike
        if (errors.length >= 5) {
            this.renderer.triggerGavelStrike(true); // Intense
        }
    }

    calculateFinalSentence() {
        // Use existing judge sentence calculation
        const baseSentence = this.game.judge.calculateSentence({
            arrestCount: this.game.judge.arrestCount,
            speed: this.game.player.lastSpeed || 60,
            patience: this.game.judge.patience
        });

        console.log(`[EnhancedCourtroom] Final sentence: ${baseSentence}`);
        this.game.judge.say(`I hereby sentence you to ${baseSentence}. Court adjourned.`);
    }
}
```

---

### 2. RENDERER CLASS (Core Methods)

```javascript
/**
 * EnhancedCourtroomRenderer
 * Handles all canvas rendering for courtroom
 */
class EnhancedCourtroomRenderer {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.game = game;

        // State
        this.currentAngerState = 'NEUTRAL';
        this.vignette = 0.3;
        this.shake = { x: 0, y: 0, intensity: 0 };
        this.gavelState = 'resting'; // resting, raised, striking, impact
        this.gavelAnimTime = 0;

        // Load sprites
        this.loadSprites();
    }

    loadSprites() {
        // Judge sprites (ASCII art stored as strings)
        this.judgeSprites = {
            'NEUTRAL': this.createASCIISprite(JUDGE_SPRITE_NEUTRAL),
            'IRRITATED': this.createASCIISprite(JUDGE_SPRITE_IRRITATED),
            'ANGRY': this.createASCIISprite(JUDGE_SPRITE_ANGRY),
            'FURIOUS': this.createASCIISprite(JUDGE_SPRITE_FURIOUS),
            'APOPLECTIC': this.createASCIISprite(JUDGE_SPRITE_APOPLECTIC),
            'VOLCANIC': this.createASCIISprite(JUDGE_SPRITE_VOLCANIC)
        };
    }

    createASCIISprite(asciiArt) {
        // Parse ASCII art string into renderable sprite
        return {
            lines: asciiArt.split('\n'),
            width: 800,
            height: 900
        };
    }

    update(deltaTime) {
        // Update camera shake (decay over time)
        if (this.shake.intensity > 0) {
            this.shake.x = (Math.random() - 0.5) * this.shake.intensity;
            this.shake.y = (Math.random() - 0.5) * this.shake.intensity;
            this.shake.intensity *= 0.9; // Decay

            if (this.shake.intensity < 0.1) {
                this.shake.intensity = 0;
                this.shake.x = 0;
                this.shake.y = 0;
            }
        }

        // Update gavel animation
        if (this.gavelAnimTime > 0) {
            this.gavelAnimTime -= deltaTime;
            if (this.gavelAnimTime <= 0) {
                this.gavelState = 'resting';
            }
        }

        // Update anger-based vignette
        this.updateVignette();
    }

    updateVignette() {
        const vignetteMap = {
            'NEUTRAL': 0.3,
            'IRRITATED': 0.4,
            'ANGRY': 0.5,
            'FURIOUS': 0.6,
            'APOPLECTIC': 0.7,
            'VOLCANIC': 0.85
        };

        this.vignette = vignetteMap[this.currentAngerState];
    }

    updateAngerState() {
        const judge = this.game.judge;
        const arrestCount = judge.arrestCount;
        const patience = judge.patience;
        const errors = this.game.enhancedCourtroom.paperwork.errors.length;

        let angerLevel = arrestCount + (errors * 2);
        if (patience < 20) angerLevel += 3;
        else if (patience < 50) angerLevel += 1;

        if (angerLevel <= 1) this.currentAngerState = 'NEUTRAL';
        else if (angerLevel <= 3) this.currentAngerState = 'IRRITATED';
        else if (angerLevel <= 5) this.currentAngerState = 'ANGRY';
        else if (angerLevel <= 7) this.currentAngerState = 'FURIOUS';
        else if (angerLevel <= 10) this.currentAngerState = 'APOPLECTIC';
        else this.currentAngerState = 'VOLCANIC';

        console.log(`[Renderer] Anger state: ${this.currentAngerState} (level: ${angerLevel})`);
    }

    render(deltaTime, currentView, transitionProgress) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply camera shake offset
        this.ctx.save();
        this.ctx.translate(this.shake.x, this.shake.y);

        // Render appropriate view
        if (currentView === 'down') {
            this.renderDeskView();
        } else if (currentView === 'up') {
            this.renderJudgeView();
        }

        // If transitioning, blend views
        if (transitionProgress > 0 && transitionProgress < 1) {
            this.renderTransition(currentView, transitionProgress);
        }

        this.ctx.restore();

        // Render effects (no shake offset)
        this.renderVignette();
        this.renderUI();
    }

    renderDeskView() {
        // 1. Desk surface
        this.ctx.fillStyle = '#1a0f0a'; // Dark wood
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 2. Wood grain texture (simple stripes)
        this.ctx.strokeStyle = 'rgba(26, 15, 10, 0.3)';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < this.canvas.width; i += 30) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i + 100, this.canvas.height);
            this.ctx.stroke();
        }

        // 3. Paper stack (background)
        this.renderPaperStack();

        // 4. Current form (centered)
        this.renderCurrentForm();

        // 5. Desk lamp lighting
        this.renderDeskLighting();

        // 6. Player hands (bottom corners)
        this.renderPlayerHands();
    }

    renderPaperStack() {
        const stackX = this.canvas.width / 2 - 250;
        const stackY = this.canvas.height / 2 - 200;

        // 5 stacked papers, offset
        for (let i = 0; i < 5; i++) {
            const offsetX = i * 3;
            const offsetY = i * 3;

            // Shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.fillRect(stackX + offsetX + 5, stackY + offsetY + 5, 500, 400);

            // Paper
            this.ctx.fillStyle = '#f5f5dc'; // Cream
            this.ctx.fillRect(stackX + offsetX, stackY + offsetY, 500, 400);

            // Border
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(stackX + offsetX, stackY + offsetY, 500, 400);
        }
    }

    renderCurrentForm() {
        const formX = this.canvas.width / 2 - 250;
        const formY = this.canvas.height / 2 - 150;

        // Bright white paper (current form)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(formX, formY, 500, 300);

        // Border
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(formX, formY, 500, 300);

        // Form title
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 20px monospace';
        this.ctx.textAlign = 'center';
        const page = this.game.enhancedCourtroom.paperwork.currentPage;
        this.ctx.fillText(`FORM 27-B (PAGE ${page})`, this.canvas.width / 2, formY + 40);

        // Placeholder lines (actual form rendered via HTML overlay)
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
            const y = formY + 80 + (i * 25);
            this.ctx.beginPath();
            this.ctx.moveTo(formX + 30, y);
            this.ctx.lineTo(formX + 470, y);
            this.ctx.stroke();
        }
    }

    renderDeskLighting() {
        // Radial gradient (desk lamp from top-left)
        const gradient = this.ctx.createRadialGradient(200, 100, 0, 200, 100, 600);
        gradient.addColorStop(0, 'rgba(255, 228, 181, 0.3)'); // Warm light
        gradient.addColorStop(1, 'rgba(255, 228, 181, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderPlayerHands() {
        // Simple hand representations at bottom corners
        this.ctx.fillStyle = '#d4a574'; // Skin tone

        // Left hand
        this.ctx.beginPath();
        this.ctx.ellipse(100, this.canvas.height - 50, 60, 30, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Right hand
        this.ctx.beginPath();
        this.ctx.ellipse(this.canvas.width - 100, this.canvas.height - 50, 60, 30, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    renderJudgeView() {
        // 1. Dark courtroom background
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 2. Stone wall texture
        this.ctx.fillStyle = '#1a1a1a';
        for (let y = 0; y < this.canvas.height; y += 40) {
            for (let x = 0; x < this.canvas.width; x += 60) {
                this.ctx.fillRect(x, y, 58, 38);
            }
        }

        // 3. Judge's bench
        this.renderJudgeBench();

        // 4. Judge sprite
        this.renderJudgeSprite();

        // 5. Uplighting
        this.renderJudgeLighting();
    }

    renderJudgeBench() {
        const benchY = this.canvas.height - 150;

        // Bench (dark wood)
        this.ctx.fillStyle = '#2a1810';
        this.ctx.fillRect(0, benchY, this.canvas.width, 150);

        // Top edge
        this.ctx.fillStyle = '#3a2820';
        this.ctx.fillRect(0, benchY, this.canvas.width, 20);

        // Gavel icon
        this.renderGavel();

        // Scale of justice icon
        this.ctx.font = '40px serif';
        this.ctx.fillStyle = '#888';
        this.ctx.fillText('⚖', this.canvas.width / 2, benchY + 80);
    }

    renderGavel() {
        const gavelX = this.canvas.width - 200;
        const gavelY = this.canvas.height - 100;

        if (this.gavelState === 'resting') {
            // Gavel laying flat
            this.ctx.fillStyle = '#5a3820';
            this.ctx.fillRect(gavelX, gavelY, 60, 15);
            this.ctx.fillRect(gavelX + 50, gavelY - 10, 15, 35);
        } else if (this.gavelState === 'raised') {
            // Gavel raised
            this.ctx.fillStyle = '#5a3820';
            this.ctx.save();
            this.ctx.translate(gavelX, gavelY - 30);
            this.ctx.rotate(-Math.PI / 4);
            this.ctx.fillRect(0, 0, 60, 15);
            this.ctx.fillRect(50, -10, 15, 35);
            this.ctx.restore();
        } else if (this.gavelState === 'striking' || this.gavelState === 'impact') {
            // Gavel striking down
            this.ctx.fillStyle = '#5a3820';
            this.ctx.fillRect(gavelX, gavelY, 60, 15);
            this.ctx.fillRect(gavelX + 50, gavelY - 10, 15, 35);

            // Impact effect
            if (this.gavelState === 'impact') {
                this.ctx.strokeStyle = '#ff0';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(gavelX + 30, gavelY + 7, 20, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }
    }

    renderJudgeSprite() {
        const sprite = this.judgeSprites[this.currentAngerState];
        if (!sprite) return;

        const spriteX = this.canvas.width / 2 - sprite.width / 2;
        const spriteY = -100; // Extends beyond top

        // Render ASCII art
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '10px monospace';
        this.ctx.textAlign = 'left';

        sprite.lines.forEach((line, i) => {
            this.ctx.fillText(line, spriteX, spriteY + (i * 12));
        });
    }

    renderJudgeLighting() {
        // Uplighting from player position (bottom-center)
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height, 0,
            this.canvas.width / 2, this.canvas.height, 800
        );
        gradient.addColorStop(0, 'rgba(240, 240, 240, 0.2)');
        gradient.addColorStop(1, 'rgba(240, 240, 240, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderVignette() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width * 0.7
        );

        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, `rgba(0, 0, 0, ${this.vignette})`);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderUI() {
        // Patience meter
        this.renderPatienceMeter();

        // Sentence display
        this.renderSentenceDisplay();
    }

    renderPatienceMeter() {
        const x = 50;
        const y = this.canvas.height - 50;
        const width = 200;
        const height = 20;

        // Background
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x, y, width, height);

        // Patience fill
        const patience = this.game.judge.patience;
        const fillWidth = (patience / 100) * width;

        if (patience > 60) this.ctx.fillStyle = '#0f0';
        else if (patience > 30) this.ctx.fillStyle = '#ff0';
        else this.ctx.fillStyle = '#f00';

        this.ctx.fillRect(x, y, fillWidth, height);

        // Border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // Label
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('JUDGE PATIENCE', x, y - 5);
        this.ctx.fillText(`${Math.floor(patience)}%`, x + width + 10, y + 15);
    }

    renderSentenceDisplay() {
        const sentence = this.game.player.sentence;

        this.ctx.fillStyle = '#f00';
        this.ctx.font = 'bold 20px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`SENTENCE: ${sentence.toFixed(1)} YEARS`, this.canvas.width / 2, 40);
    }

    triggerGavelStrike(intense = false) {
        console.log('[Renderer] Triggering gavel strike');

        // Animation sequence
        this.gavelState = 'raised';
        this.gavelAnimTime = 700;

        setTimeout(() => {
            this.gavelState = 'striking';
        }, 200);

        setTimeout(() => {
            this.gavelState = 'impact';

            // Trigger screen shake
            this.shake.intensity = intense ? 20 : 10;

            // Play sound
            if (this.game.soundSystem) {
                this.game.soundSystem.playGavelStrike();
            }
        }, 400);

        setTimeout(() => {
            this.gavelState = 'resting';
        }, 700);
    }
}
```

---

### 3. JUDGE REACTION SYSTEM

```javascript
/**
 * JudgeReactionSystem
 * Handles judge responses to player actions
 */
class JudgeReactionSystem {
    constructor(judge, renderer, courtroom) {
        this.judge = judge;
        this.renderer = renderer;
        this.courtroom = courtroom;
        this.lastReactionTime = 0;
    }

    onPlayerLooksUp() {
        // Don't spam reactions
        if (Date.now() - this.lastReactionTime < 5000) return;

        const reactions = [
            "Yes? Do you have something to say?",
            "The forms are down THERE. Not up HERE.",
            "Stop wasting time. Complete the paperwork.",
            "Looking at me won't make your sentence any shorter.",
            "I'm not getting any younger. And neither are you.",
            "Do I have something on my face? Get back to work.",
            "Admiring the courtroom decor? Fascinating. FORMS. NOW."
        ];

        this.judge.say(this.randomChoice(reactions));
        this.judge.updateMood(-2);
        this.lastReactionTime = Date.now();

        // Slight gavel tap if patience low
        if (this.judge.patience < 30) {
            this.renderer.triggerGavelStrike(false);
        }
    }

    checkPlayerDelay(secondsIdle) {
        if (secondsIdle > 30 && secondsIdle < 31) {
            this.judge.say("Are you SLEEPING down there? Fill out the forms!");
            this.judge.updateMood(-5);
            this.renderer.triggerGavelStrike(false);
        } else if (secondsIdle > 60 && secondsIdle < 61) {
            this.judge.say("CONTEMPT OF COURT! That's an additional year!");
            this.courtroom.game.player.sentence += 1;
            this.judge.updateMood(-10);
            this.renderer.triggerGavelStrike(true);
        }
    }

    onPageComplete(page, timeTaken, errors) {
        if (errors === 0 && timeTaken < 60) {
            this.judge.say("Surprisingly competent. Proceed.");
        } else if (errors > 0) {
            this.judge.say(`${errors} mistake${errors > 1 ? 's' : ''}. Typical.`);
            this.judge.updateMood(-errors * 3);
            this.renderer.triggerGavelStrike(false);
        } else if (timeTaken > 120) {
            this.judge.say("Took you long enough.");
            this.judge.updateMood(-2);
        }
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}
```

---

### 4. SOUND SYSTEM ADDITIONS (soundsystem.js)

```javascript
// Add to SoundSystem class:

playChairCreak() {
    if (!this.enabled) return;

    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = 80;
    osc.type = 'sawtooth';

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
}

playPaperRustle() {
    if (!this.enabled) return;

    const ctx = this.audioContext;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // White noise
    for (let i = 0; i < buffer.length; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;

    const gain = ctx.createGain();
    gain.gain.value = 0.05;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
}

playJudgeYell() {
    if (!this.enabled) return;

    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
    osc.type = 'sawtooth';

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
}
```

---

### 5. GAME.JS INTEGRATION

```javascript
// In VroomVroomGame class constructor:

constructor() {
    // ... existing code ...

    this.judge = new JudgeHardcastle();
    this.enhancedCourtroom = null; // NEW
}

// In init():

init() {
    // ... existing code ...

    // Initialize enhanced courtroom
    if (typeof EnhancedCourtroomSystem !== 'undefined') {
        this.enhancedCourtroom = new EnhancedCourtroomSystem(this);
        this.enhancedCourtroom.initialize();
        console.log('[Game] Enhanced courtroom initialized');
    }
}

// Modify arrest():

arrest() {
    console.log('[Game] Player arrested!');

    // ... existing arrest logic ...

    // Activate enhanced courtroom
    if (this.enhancedCourtroom) {
        this.enhancedCourtroom.activate();
    }

    this.showScreen('courtroom');
}

// Modify submitCourtForms():

submitCourtForms() {
    if (this.enhancedCourtroom) {
        // Use enhanced system
        this.enhancedCourtroom.processFormSubmission();
    } else {
        // Fallback to old system
        this.submitCourtFormsLegacy();
    }
}

// Keep old system as fallback:
submitCourtFormsLegacy() {
    // ... existing code ...
}
```

---

### 6. HTML INTEGRATION (index.html)

```html
<!-- Add after soundsystem.js -->
<script src="game/enhanced-courtroom.js"></script>

<!-- Modify courtroom screen -->
<div id="courtroom" class="screen">
    <!-- Canvas injected here by EnhancedCourtroomSystem -->

    <h2>PAPERWORK SIMULATOR 3000 - ENHANCED</h2>
    <p style="margin: 20px; font-size: 1.1em;">
        Complete ALL forms. Look up to face Judge Hardcastle. (Press SPACE or swipe up)
    </p>

    <!-- UI overlay for forms -->
    <div id="courtroomFormOverlay" style="display: none;">
        <!-- Dynamic form fields rendered here -->
    </div>

    <!-- Navigation buttons -->
    <div id="courtroomNavigation">
        <button onclick="game.enhancedCourtroom.previousPage()">◀ PREVIOUS</button>
        <span id="courtroomPageCounter">Page 1 of 5</span>
        <button onclick="game.enhancedCourtroom.nextPage()">NEXT ▶</button>
    </div>

    <!-- Submit button -->
    <button onclick="game.submitCourtForms()" style="margin-top: 30px;">
        SUBMIT ALL FORMS
    </button>
</div>
```

---

### 7. ASCII SPRITE CONSTANTS

```javascript
// At top of enhanced-courtroom.js:

const JUDGE_SPRITE_NEUTRAL = `
                    ████████████████████
                ████░░░░░░░░░░░░░░░░░░████
              ██░░░░░░░░░░░░░░░░░░░░░░░░░░██
            ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
          ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
        ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
        ██░░░░░░██████░░░░░░░░░░██████░░░░░░░░░░██
        ██░░░░██░░░░░░██░░░░░░██░░░░░░██░░░░░░░░██
        ██░░░░██░░██░░██░░░░░░██░░██░░██░░░░░░░░██
        ██░░░░░░██████░░░░░░░░░░██████░░░░░░░░░░██
        ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
        ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
        ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
        ██░░░░░░░░▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░░░░░██
        ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
        ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
          ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
            ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
              ████░░░░░░░░░░░░░░░░░░░░░░████
                  ████████████████████████
`;

// Add other sprites (IRRITATED, ANGRY, FURIOUS, APOPLECTIC, VOLCANIC)
// See Section 2.3 of main design doc for full ASCII art
```

---

## USAGE EXAMPLE

```javascript
// Game flow:

1. Player gets arrested
   → game.arrest() called
   → enhancedCourtroom.activate()

2. Courtroom screen shows
   → Canvas renders desk view
   → Player sees paperwork

3. Player fills forms
   → HTML overlay for inputs
   → Canvas shows visual context

4. Player presses SPACE (or swipes up)
   → transitionToJudge()
   → Chair creak sound plays
   → Canvas transitions to judge view
   → Judge sprite appears (anger state based on errors)

5. Judge reacts
   → "The forms are DOWN THERE. Not UP HERE."
   → Patience decreases
   → Possible gavel strike

6. Player presses SPACE again (or swipes down)
   → transitionToDesk()
   → Back to paperwork

7. Player completes all 5 pages
   → Clicks "SUBMIT ALL FORMS"
   → processFormSubmission()
   → Validation runs
   → Errors trigger judge anger, gavel strikes, sentence increases

8. Final sentencing
   → calculateFinalSentence()
   → Judge delivers verdict
   → enhancedCourtroom.deactivate()
   → Transition to prison
```

---

**Ready to implement!** Start with the main class structure, then add rendering, then paperwork system.
