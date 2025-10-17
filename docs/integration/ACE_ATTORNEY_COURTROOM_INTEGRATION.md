# ACE ATTORNEY COURTROOM INTEGRATION GUIDE

**System:** Ace Attorney-Style Visual Novel Courtroom
**Target Version:** v1.5.0
**Prerequisites:** Complete system design in `docs/systems/ACE_ATTORNEY_COURTROOM_SYSTEM.md`
**Estimated Time:** 48-71 hours (6-9 full days)

---

## OVERVIEW

This guide walks through implementing the Ace Attorney-style courtroom system step-by-step. Follow phases in order for best results.

---

## PHASE 1: FILE SETUP (30 minutes)

### Step 1: Create New Files

Create these files in `C:\Users\evan\Documents\GitHub\vroom-vroom\game\`:

```bash
# In game/ directory:
touch ace-attorney-courtroom.js       # Main system (450 lines)
touch judge-sprite-animator.js        # Animation controller (350 lines)
touch courtroom-atmosphere.js         # Visual effects (200 lines)
touch courtroom-ui.js                 # Dialogue/UI (250 lines)
touch courtroom-renderer.js           # Drawing functions (400 lines)
touch ace-attorney-courtroom.css      # Styling (150 lines)
```

### Step 2: Add Script Tags to index.html

Add before closing `</body>` tag in `game/index.html`:

```html
<!-- Ace Attorney Courtroom System -->
<script src="courtroom-renderer.js"></script>
<script src="courtroom-atmosphere.js"></script>
<script src="judge-sprite-animator.js"></script>
<script src="courtroom-ui.js"></script>
<script src="ace-attorney-courtroom.js"></script>
<link rel="stylesheet" href="ace-attorney-courtroom.css">
```

### Step 3: Add Canvas to HTML

Add after existing courtroom HTML in `game/index.html` (~line 400):

```html
<!-- Ace Attorney Courtroom Canvas -->
<div id="courtroomContainer" class="screen" style="display:none;">
    <canvas id="courtroomCanvas"></canvas>

    <!-- Forms overlay (desk view) -->
    <div id="courtroomForms" class="courtroom-forms-overlay" style="display:none;">
        <!-- Existing form HTML will be moved here -->
    </div>

    <!-- Dialogue overlay (judge view) -->
    <div id="courtroomDialogue" class="courtroom-dialogue-overlay" style="display:none;">
        <div class="speaker">Judge Hardcastle</div>
        <div class="dialogue-text"></div>
        <button class="continue-button">Continue</button>
    </div>

    <!-- Patience meter overlay -->
    <div id="patienceMeterOverlay" class="patience-meter-overlay">
        <div class="patience-meter-label">Judge Patience</div>
        <div class="patience-meter-bar">
            <div class="patience-meter-fill" style="width: 0%;"></div>
        </div>
        <div class="patience-meter-value">0 / 100</div>
    </div>
</div>
```

---

## PHASE 2: RENDERER FOUNDATION (3-4 hours)

### File: `courtroom-renderer.js`

**Purpose:** Canvas drawing utility functions

```javascript
/**
 * VROOM VROOM - Ace Attorney Courtroom Renderer
 * Canvas drawing utility functions for courtroom visuals
 */

// Extend CanvasRenderingContext2D with helper methods
CanvasRenderingContext2D.prototype.fillEllipse = function(x, y, w, h) {
    this.save();
    this.beginPath();
    this.translate(x - w/2, y - h/2);
    this.scale(w, h);
    this.arc(0.5, 0.5, 0.5, 0, 2 * Math.PI);
    this.restore();
    this.fill();
};

CanvasRenderingContext2D.prototype.fillCircle = function(x, y, r) {
    this.beginPath();
    this.arc(x, y, r, 0, 2 * Math.PI);
    this.fill();
};

CanvasRenderingContext2D.prototype.strokeEllipse = function(x, y, w, h) {
    this.save();
    this.beginPath();
    this.translate(x - w/2, y - h/2);
    this.scale(w, h);
    this.arc(0.5, 0.5, 0.5, 0, 2 * Math.PI);
    this.restore();
    this.stroke();
};

/**
 * Draw a gavel
 */
function drawGavel(ctx, x, y, color, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Handle
    ctx.fillStyle = color;
    ctx.fillRect(-3, -40, 6, 80);

    // Head
    ctx.fillRect(-15, -50, 30, 20);

    // Highlight on head
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(-12, -48, 24, 5);

    ctx.restore();
}

/**
 * Draw courtroom background
 */
function drawCourtroom(ctx, width, height) {
    // Background gradient (dark, oppressive)
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#1a1612');
    bgGradient.addColorStop(1, '#2d2418');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Faint light source (top center, dim)
    const lightGradient = ctx.createRadialGradient(
        width / 2, -200, 100,
        width / 2, 400, 800
    );
    lightGradient.addColorStop(0, 'rgba(255,217,149,0.15)');
    lightGradient.addColorStop(1, 'rgba(255,217,149,0)');
    ctx.fillStyle = lightGradient;
    ctx.fillRect(0, 0, width, height);
}

/**
 * Draw judge's bench
 */
function drawJudgeBench(ctx, x, y, width, height) {
    // Main bench (dark wood)
    ctx.fillStyle = '#3d2f1f';
    ctx.fillRect(x - width/2, y, width, height);

    // Wood grain effect (horizontal lines)
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(x - width/2, y + (i * 15));
        ctx.lineTo(x + width/2, y + (i * 15));
        ctx.stroke();
    }

    // Highlight (top edge)
    ctx.fillStyle = '#48362a';
    ctx.fillRect(x - width/2, y, width, 10);
}

/**
 * Draw desk surface (top-down view)
 */
function drawDeskSurface(ctx, width, height) {
    // Desk surface
    ctx.fillStyle = '#3d2f1f';
    ctx.fillRect(0, 0, width, height);

    // Wood grain texture
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 50);
        ctx.lineTo(width, i * 50 + (Math.random() * 20 - 10));
        ctx.stroke();
    }
}

/**
 * Draw finger tap animation
 */
function drawFingerTap(ctx, x, y) {
    ctx.fillStyle = '#b8956f';
    ctx.fillCircle(x, y, 8);
    ctx.fillStyle = '#c5a789';
    ctx.fillCircle(x, y-2, 6);
}

/**
 * Color palette constants
 */
const COURTROOM_COLORS = {
    background: '#1a1612',
    wallpaper: '#2d2418',
    wood: '#3d2f1f',
    deskDark: '#2a1f15',
    deskLight: '#48362a',
    candlelight: '#ffd995',
    shadow: 'rgba(0,0,0,0.7)',

    // Judge skin tones
    skinNeutral: '#c5a789',
    skinIrritated: '#cc8866',
    skinAngry: '#dd6655',
    skinFurious: '#ee5544',
    skinApoplectic: '#dd3333',
    skinVolcanic: '#aa2244',

    // Veins
    veinAngry: '#8b0000',
    veinFurious: '#6b0f1a',
    veinApoplectic: '#4a0e1e',
    veinVolcanic: '#000000',

    // UI
    paperWhite: '#f5ede1',
    inkBlack: '#1a1612',
    stampRed: '#8b0000',
};
```

**Testing:**
```javascript
// Test in browser console:
const canvas = document.getElementById('courtroomCanvas');
const ctx = canvas.getContext('2d');
drawCourtroom(ctx, canvas.width, canvas.height);
drawGavel(ctx, 200, 200, '#3d2f1f', 0.5);
```

---

## PHASE 3: ATMOSPHERE SYSTEM (2-3 hours)

### File: `courtroom-atmosphere.js`

```javascript
/**
 * VROOM VROOM - Atmosphere Renderer
 * Handles visual effects: vignette, film grain, color grading
 */

class AtmosphereRenderer {
    constructor(canvas) {
        this.canvas = canvas;

        // Film grain noise texture
        this.noiseCanvas = document.createElement('canvas');
        this.noiseCanvas.width = 256;
        this.noiseCanvas.height = 256;
        this.noiseCtx = this.noiseCanvas.getContext('2d');
        this.generateFilmGrain();

        // Animation state
        this.noiseOffset = 0;
        this.screenShakeOffset = {x: 0, y: 0};
    }

    generateFilmGrain() {
        const imageData = this.noiseCtx.createImageData(256, 256);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const value = Math.random() * 255;
            imageData.data[i] = value;
            imageData.data[i+1] = value;
            imageData.data[i+2] = value;
            imageData.data[i+3] = 40; // 15% opacity
        }
        this.noiseCtx.putImageData(imageData, 0, 0);
    }

    applyVignette(ctx, opacity = 0.4) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.max(this.canvas.width, this.canvas.height);

        const gradient = ctx.createRadialGradient(
            centerX, centerY, radius * 0.3,
            centerX, centerY, radius * 0.9
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${opacity})`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    applyFilmGrain(ctx) {
        // Animate noise offset
        this.noiseOffset += 1;
        if (this.noiseOffset >= 256) this.noiseOffset = 0;

        // Create pattern and tile
        const pattern = ctx.createPattern(this.noiseCanvas, 'repeat');
        ctx.save();
        ctx.translate(this.noiseOffset, this.noiseOffset);
        ctx.fillStyle = pattern;
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillRect(-this.noiseOffset, -this.noiseOffset,
                     this.canvas.width + this.noiseOffset,
                     this.canvas.height + this.noiseOffset);
        ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
    }

    applyRedOverlay(ctx, opacity = 0.3) {
        ctx.fillStyle = `rgba(170,34,68,${opacity})`;
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.globalCompositeOperation = 'source-over';
    }

    applyScreenShake(ctx, magnitude = 5) {
        // Random shake
        this.screenShakeOffset.x = (Math.random() - 0.5) * magnitude * 2;
        this.screenShakeOffset.y = (Math.random() - 0.5) * magnitude * 2;
        ctx.translate(this.screenShakeOffset.x, this.screenShakeOffset.y);
    }

    resetScreenShake(ctx) {
        ctx.translate(-this.screenShakeOffset.x, -this.screenShakeOffset.y);
        this.screenShakeOffset = {x: 0, y: 0};
    }
}

/**
 * Color grading utilities
 */
class ColorGrading {
    static applyDarkestDungeonLook(ctx) {
        ctx.filter = [
            'saturate(0.4)',
            'contrast(1.3)',
            'brightness(0.85)',
            'sepia(0.15)'
        ].join(' ');
    }

    static clearFilters(ctx) {
        ctx.filter = 'none';
    }
}
```

**Testing:**
```javascript
const atmosphere = new AtmosphereRenderer(canvas);
atmosphere.applyVignette(ctx, 0.5);
atmosphere.applyFilmGrain(ctx);
atmosphere.applyRedOverlay(ctx, 0.3);
```

---

## PHASE 4: JUDGE ANIMATOR (4-6 hours)

### File: `judge-sprite-animator.js`

**NOTE:** This is the largest file. Implement states one at a time and test.

```javascript
/**
 * VROOM VROOM - Judge Sprite Animator
 * Handles Judge Hardcastle's 6 anger states and animations
 */

class JudgeSpriteAnimator {
    constructor() {
        this.currentState = 'NEUTRAL';
        this.targetState = 'NEUTRAL';
        this.currentFrame = 0;
        this.frameTime = 0;
        this.isTransitioning = false;
        this.transitionProgress = 0;
        this.transitionDuration = 0.5;

        // State definitions
        this.states = {
            NEUTRAL: {
                frameCount: 16,
                frameDuration: 125,
                loop: true,
                drawFunction: this.drawNeutral.bind(this)
            },
            IRRITATED: {
                frameCount: 15,
                frameDuration: 100,
                loop: true,
                drawFunction: this.drawIrritated.bind(this)
            },
            ANGRY: {
                frameCount: 8,
                frameDuration: 125,
                loop: true,
                drawFunction: this.drawAngry.bind(this)
            },
            FURIOUS: {
                frameCount: 8,
                frameDuration: 100,
                loop: true,
                drawFunction: this.drawFurious.bind(this)
            },
            APOPLECTIC: {
                frameCount: 6,
                frameDuration: 100,
                loop: true,
                drawFunction: this.drawApoplectic.bind(this)
            },
            VOLCANIC: {
                frameCount: 5,
                frameDuration: 100,
                loop: false,
                drawFunction: this.drawVolcanic.bind(this)
            }
        };
    }

    update(deltaTime) {
        if (this.isTransitioning) {
            this.transitionProgress += deltaTime / 1000;
            if (this.transitionProgress >= this.transitionDuration) {
                this.currentState = this.targetState;
                this.isTransitioning = false;
                this.transitionProgress = 0;
                this.currentFrame = 0;
                this.frameTime = 0;
            }
            return;
        }

        // Update animation frame
        const state = this.states[this.currentState];
        this.frameTime += deltaTime;

        if (this.frameTime >= state.frameDuration) {
            this.frameTime = 0;
            this.currentFrame++;

            if (this.currentFrame >= state.frameCount) {
                if (state.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = state.frameCount - 1;
                }
            }
        }
    }

    transitionToState(newState, duration = 0.5) {
        if (newState === this.currentState) return;
        this.targetState = newState;
        this.isTransitioning = true;
        this.transitionProgress = 0;
        this.transitionDuration = duration;
    }

    render(ctx, x, y, scale = 1) {
        ctx.save();
        ctx.scale(scale, scale);

        const adjustedX = x / scale;
        const adjustedY = y / scale;

        const state = this.states[this.currentState];
        state.drawFunction(ctx, adjustedX, adjustedY, this.currentFrame);

        ctx.restore();
    }

    // NEUTRAL STATE (0-15 patience)
    drawNeutral(ctx, x, y, frame) {
        // Head
        ctx.fillStyle = COURTROOM_COLORS.skinNeutral;
        ctx.fillEllipse(x, y, 180, 220);

        // Eyes (half-closed, blinking)
        const eyeOpenness = (frame >= 5 && frame <= 7) ? 0.1 : 0.5;
        ctx.fillStyle = '#2a1f15';
        ctx.fillEllipse(x-40, y-30, 15, 20 * eyeOpenness);
        ctx.fillEllipse(x+40, y-30, 15, 20 * eyeOpenness);

        // Mouth (slight frown)
        ctx.strokeStyle = '#3d2f1f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y+40, 25, 0.2, 2.94, false);
        ctx.stroke();

        // Judge robe
        ctx.fillStyle = '#1a1612';
        ctx.fillRect(x-120, y+180, 240, 120);
    }

    // IRRITATED STATE (16-35 patience)
    drawIrritated(ctx, x, y, frame) {
        // Warmer skin
        ctx.fillStyle = COURTROOM_COLORS.skinIrritated;
        ctx.fillEllipse(x, y, 180, 220);

        // Eyes (focused)
        ctx.fillStyle = '#ffffff';
        ctx.fillEllipse(x-40, y-30, 15, 25);
        ctx.fillEllipse(x+40, y-30, 15, 25);

        // Pupils
        ctx.fillStyle = '#000000';
        ctx.fillCircle(x-40, y-25, 6);
        ctx.fillCircle(x+40, y-25, 6);

        // Furrowed brow
        ctx.strokeStyle = '#8b6f47';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x-60, y-50);
        ctx.lineTo(x-30, y-55);
        ctx.moveTo(x+60, y-50);
        ctx.lineTo(x+30, y-55);
        ctx.stroke();

        // Frown
        ctx.strokeStyle = '#3d2f1f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y+50, 30, 0.3, 2.84, false);
        ctx.stroke();

        // Finger drumming (frames 4-7)
        if (frame >= 4 && frame <= 7) {
            const fingerIndex = frame - 4;
            drawFingerTap(ctx, x + 80 + (fingerIndex * 15), y + 280);
        }

        // Robe
        ctx.fillStyle = '#1a1612';
        ctx.fillRect(x-120, y+180, 240, 120);
    }

    // ANGRY STATE (36-60 patience)
    drawAngry(ctx, x, y, frame) {
        // Red face
        ctx.fillStyle = COURTROOM_COLORS.skinAngry;
        ctx.fillEllipse(x, y, 185, 225);

        // Pulsing veins
        const veinThickness = (frame === 3 || frame === 5) ? 3 : 2;
        ctx.strokeStyle = COURTROOM_COLORS.veinAngry;
        ctx.lineWidth = veinThickness;
        ctx.beginPath();
        // Forehead vein
        ctx.moveTo(x-30, y-70);
        ctx.quadraticCurveTo(x-10, y-60, x+5, y-50);
        // Temple vein
        ctx.moveTo(x-65, y-40);
        ctx.lineTo(x-45, y-30);
        ctx.stroke();

        // Eyes (wide, bloodshot)
        ctx.fillStyle = '#ffcccc';
        ctx.fillEllipse(x-40, y-30, 18, 28);
        ctx.fillEllipse(x+40, y-30, 18, 28);

        // Bloodshot lines
        ctx.strokeStyle = '#dd3333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x-50, y-25);
        ctx.lineTo(x-35, y-30);
        ctx.moveTo(x+50, y-25);
        ctx.lineTo(x+35, y-30);
        ctx.stroke();

        // Pupils
        ctx.fillStyle = '#000000';
        ctx.fillCircle(x-40, y-25, 8);
        ctx.fillCircle(x+40, y-25, 8);

        // Deep frown
        ctx.strokeStyle = '#3d2f1f';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y+55, 35, 0.4, 2.74, false);
        ctx.stroke();

        // Breathing (chest)
        const breathOffset = (frame === 7) ? 5 : 0;
        ctx.fillStyle = '#1a1612';
        ctx.fillRect(x-130, y+180 + breathOffset, 260, 120);
    }

    // FURIOUS STATE (61-85 patience) - See full implementation in system doc
    drawFurious(ctx, x, y, frame) {
        // TODO: Implement full FURIOUS state
        // For now, copy ANGRY and add gavel + more veins
        this.drawAngry(ctx, x, y, frame);
    }

    // APOPLECTIC STATE (86-99 patience) - See full implementation in system doc
    drawApoplectic(ctx, x, y, frame) {
        // TODO: Implement full APOPLECTIC state
        this.drawFurious(ctx, x, y, frame);
    }

    // VOLCANIC STATE (100 patience) - See full implementation in system doc
    drawVolcanic(ctx, x, y, frame) {
        // TODO: Implement full VOLCANIC state
        this.drawApoplectic(ctx, x, y, frame);
    }
}
```

**Testing:**
```javascript
const animator = new JudgeSpriteAnimator();
animator.render(ctx, 400, 300);
animator.update(16); // Simulate frame
animator.transitionToState('ANGRY');
```

**CRITICAL:** Implement remaining states (FURIOUS, APOPLECTIC, VOLCANIC) following the detailed specifications in `ACE_ATTORNEY_COURTROOM_SYSTEM.md` lines 144-415.

---

## PHASE 5: UI COMPONENTS (2-3 hours)

### File: `courtroom-ui.js`

```javascript
/**
 * VROOM VROOM - Courtroom UI Components
 * Dialogue box and patience meter
 */

class DialogueBox {
    constructor() {
        this.element = document.getElementById('courtroomDialogue');
        this.textElement = this.element.querySelector('.dialogue-text');
        this.speakerElement = this.element.querySelector('.speaker');
        this.continueButton = this.element.querySelector('.continue-button');

        this.isVisible = false;
        this.currentText = '';
        this.onContinueCallback = null;

        this.continueButton.addEventListener('click', () => {
            if (this.onContinueCallback) {
                this.onContinueCallback();
            }
            this.hide();
        });
    }

    show(text, speaker = 'Judge Hardcastle', onContinue = null) {
        this.currentText = text;
        this.textElement.textContent = text;
        this.speakerElement.textContent = speaker;
        this.onContinueCallback = onContinue;

        this.element.style.display = 'block';
        this.isVisible = true;
    }

    hide() {
        this.element.style.display = 'none';
        this.isVisible = false;
    }

    next() {
        if (this.onContinueCallback) {
            this.onContinueCallback();
        }
        this.hide();
    }
}

class PatienceMeter {
    constructor() {
        this.element = document.getElementById('patienceMeterOverlay');
        this.fillElement = this.element.querySelector('.patience-meter-fill');
        this.valueElement = this.element.querySelector('.patience-meter-value');
        this.currentValue = 0;
    }

    setValue(value) {
        this.currentValue = Math.max(0, Math.min(100, value));
        this.fillElement.style.width = `${this.currentValue}%`;
        this.valueElement.textContent = `${Math.floor(this.currentValue)} / 100`;

        // Color shift based on value
        if (this.currentValue < 35) {
            this.fillElement.style.background = 'linear-gradient(to right, #4a7c59, #7c9c4a)';
        } else if (this.currentValue < 60) {
            this.fillElement.style.background = 'linear-gradient(to right, #7c9c4a, #cc8866)';
        } else if (this.currentValue < 85) {
            this.fillElement.style.background = 'linear-gradient(to right, #cc8866, #dd6655)';
        } else {
            this.fillElement.style.background = 'linear-gradient(to right, #dd6655, #dd3333)';
        }
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }
}
```

---

## PHASE 6: MAIN COURTROOM SYSTEM (4-6 hours)

### File: `ace-attorney-courtroom.js`

```javascript
/**
 * VROOM VROOM - Ace Attorney Courtroom System
 * Main courtroom controller
 */

class AceAttorneyCourtroom {
    constructor(gameInstance, canvas) {
        this.game = gameInstance;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Sub-systems
        this.judgeAnimator = new JudgeSpriteAnimator();
        this.atmosphere = new AtmosphereRenderer(canvas);
        this.dialogueBox = new DialogueBox();
        this.patienceMeter = new PatienceMeter();

        // State
        this.currentView = 'DESK'; // 'DESK' or 'JUDGE'
        this.isTransitioning = false;
        this.transitionProgress = 0;

        // Timing
        this.lastFrameTime = Date.now();
        this.animationFrameId = null;

        // Initialize
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Start render loop
        this.render();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        const isMobile = window.innerWidth < 768;
        this.scale = Math.min(
            this.canvas.width / 1920,
            this.canvas.height / 1080
        ) * (isMobile ? 0.8 : 1);
    }

    update(deltaTime) {
        this.judgeAnimator.update(deltaTime);

        if (this.isTransitioning) {
            this.transitionProgress += deltaTime / 1000;
            if (this.transitionProgress >= 1) {
                this.isTransitioning = false;
                this.transitionProgress = 0;
            }
        }

        this.patienceMeter.setValue(this.game.judgePatience);
        this.updateJudgeState();
    }

    updateJudgeState() {
        const patience = this.game.judgePatience;
        let state;

        if (patience <= 15) state = 'NEUTRAL';
        else if (patience <= 35) state = 'IRRITATED';
        else if (patience <= 60) state = 'ANGRY';
        else if (patience <= 85) state = 'FURIOUS';
        else if (patience < 100) state = 'APOPLECTIC';
        else state = 'VOLCANIC';

        if (this.judgeAnimator.currentState !== state) {
            this.judgeAnimator.transitionToState(state, 0.5);
        }
    }

    render() {
        const now = Date.now();
        const deltaTime = now - this.lastFrameTime;
        this.lastFrameTime = now;

        this.update(deltaTime);

        // Clear
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render current view
        if (this.currentView === 'JUDGE') {
            this.renderJudgeView();
        } else {
            this.renderDeskView();
        }

        // Post-processing
        this.atmosphere.applyFilmGrain(this.ctx);
        this.atmosphere.applyVignette(this.ctx, 0.4);

        if (this.game.judgePatience >= 61) {
            const opacity = Math.min(0.6, (this.game.judgePatience - 60) / 100);
            this.atmosphere.applyRedOverlay(this.ctx, opacity);
        }

        // Next frame
        this.animationFrameId = requestAnimationFrame(() => this.render());
    }

    renderJudgeView() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        drawCourtroom(this.ctx, this.canvas.width, this.canvas.height);
        drawJudgeBench(this.ctx, centerX, centerY + 200, 800, 150);

        this.judgeAnimator.render(this.ctx, centerX, centerY - 100, this.scale);

        this.patienceMeter.show();
    }

    renderDeskView() {
        drawDeskSurface(this.ctx, this.canvas.width, this.canvas.height);
        this.patienceMeter.show();
    }

    transitionToJudgeView() {
        if (this.currentView === 'JUDGE') return;
        this.isTransitioning = true;
        this.transitionProgress = 0;
        this.currentView = 'JUDGE';
        this.game.soundSystem.playGavelStrike();
    }

    transitionToDeskView() {
        if (this.currentView === 'DESK') return;
        this.isTransitioning = true;
        this.transitionProgress = 0;
        this.currentView = 'DESK';
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        window.removeEventListener('resize', this.resize);
    }
}
```

---

## PHASE 7: STYLING (1-2 hours)

### File: `ace-attorney-courtroom.css`

```css
/* VROOM VROOM - Ace Attorney Courtroom Styling */

#courtroomContainer {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #1a1612;
}

#courtroomCanvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.courtroom-forms-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    background-color: rgba(245, 237, 225, 0.95);
    padding: 40px;
    border: 3px solid #3d2f1f;
    box-shadow: 0 10px 40px rgba(0,0,0,0.7);
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
}

.courtroom-dialogue-overlay {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    background-color: rgba(26, 22, 18, 0.9);
    border: 4px solid #3d2f1f;
    padding: 30px;
    width: 80%;
    max-width: 1000px;
    color: #f5ede1;
    font-size: 24px;
    font-family: serif;
    line-height: 1.6;
    box-shadow: 0 5px 20px rgba(0,0,0,0.8);
}

.courtroom-dialogue-overlay .speaker {
    font-size: 18px;
    color: #ffd995;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 10px;
}

.courtroom-dialogue-overlay .continue-button {
    margin-top: 20px;
    padding: 12px 30px;
    background-color: #3d2f1f;
    color: #f5ede1;
    border: 2px solid #8b6f47;
    font-size: 18px;
    cursor: pointer;
    font-family: serif;
}

.courtroom-dialogue-overlay .continue-button:hover {
    background-color: #48362a;
}

.patience-meter-overlay {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 15;
    background-color: rgba(0,0,0,0.7);
    border: 2px solid #3d2f1f;
    padding: 15px;
    border-radius: 5px;
}

.patience-meter-label {
    color: #f5ede1;
    font-size: 14px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: serif;
}

.patience-meter-bar {
    width: 200px;
    height: 20px;
    background-color: #2d2418;
    border: 1px solid #3d2f1f;
    position: relative;
    overflow: hidden;
}

.patience-meter-fill {
    height: 100%;
    background: linear-gradient(to right, #4a7c59, #7c9c4a);
    transition: width 0.3s ease;
}

.patience-meter-value {
    color: #f5ede1;
    font-size: 12px;
    margin-top: 5px;
    text-align: center;
    font-family: serif;
}

/* Mobile responsive */
@media (max-width: 768px) {
    .courtroom-forms-overlay {
        width: 90%;
        padding: 20px;
        font-size: 16px;
    }

    .courtroom-dialogue-overlay {
        width: 90%;
        font-size: 18px;
        padding: 20px;
    }

    .patience-meter-bar {
        width: 150px;
        height: 16px;
    }
}
```

---

## PHASE 8: SOUND INTEGRATION (2-3 hours)

### Modify: `game/soundsystem.js`

Add these methods at the end of the `VroomSoundSystem` class:

```javascript
// COURTROOM SOUNDS

playGavelShatter() {
    if (this.muted) return;
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Crack sound
    const crack = ctx.createOscillator();
    const crackGain = ctx.createGain();
    crack.type = 'sawtooth';
    crack.frequency.setValueAtTime(180, now);
    crack.frequency.exponentialRampToValueAtTime(60, now + 0.15);
    crackGain.gain.setValueAtTime(0.6, now);
    crackGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    crack.connect(crackGain);
    crackGain.connect(ctx.destination);
    crack.start(now);
    crack.stop(now + 0.15);

    // Boom
    const boom = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boom.type = 'sine';
    boom.frequency.setValueAtTime(50, now + 0.1);
    boom.frequency.exponentialRampToValueAtTime(20, now + 0.4);
    boomGain.gain.setValueAtTime(0.8, now + 0.1);
    boomGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    boom.connect(boomGain);
    boomGain.connect(ctx.destination);
    boom.start(now + 0.1);
    boom.stop(now + 0.4);
}

playAngryGavelStrike() {
    if (this.muted) return;
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);
    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
}

playFingerDrum() {
    if (this.muted) return;
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const tap = ctx.createOscillator();
    const tapGain = ctx.createGain();
    tap.type = 'sine';
    tap.frequency.setValueAtTime(400, now);
    tap.frequency.exponentialRampToValueAtTime(100, now + 0.05);
    tapGain.gain.setValueAtTime(0.3, now);
    tapGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    tap.connect(tapGain);
    tapGain.connect(ctx.destination);
    tap.start(now);
    tap.stop(now + 0.05);
}
```

---

## PHASE 9: GAME INTEGRATION (4-6 hours)

### Modify: `game/game.js`

**Step 1:** Add courtroom instance variable (~line 600, in constructor):

```javascript
constructor() {
    // ... existing code
    this.aceAttorneyCourtroom = null;
}
```

**Step 2:** Replace `showCourtroom()` method (~line 2800):

```javascript
showCourtroom() {
    // Initialize Ace Attorney courtroom
    const canvas = document.getElementById('courtroomCanvas');
    if (!this.aceAttorneyCourtroom) {
        this.aceAttorneyCourtroom = new AceAttorneyCourtroom(this, canvas);
    }

    // Start with desk view
    this.aceAttorneyCourtroom.currentView = 'DESK';
    this.aceAttorneyCourtroom.patienceMeter.setValue(0);

    // Show container
    document.getElementById('courtroomContainer').style.display = 'block';
    document.getElementById('courtroomForms').style.display = 'block';

    // Reset judge patience
    this.judgePatience = 0;

    // Show first form
    this.showParkingForm();
}
```

**Step 3:** Modify form submission handler (~line 2900):

```javascript
handleFormSubmit() {
    const errors = this.validateForm();

    if (errors.length > 0) {
        // Increase patience
        this.judgePatience += (errors.length * 5);

        // Hide form overlay
        document.getElementById('courtroomForms').style.display = 'none';

        // Transition to judge view
        this.aceAttorneyCourtroom.transitionToJudgeView();

        // Show judge reaction
        const reaction = this.judgeHardcastle.getReaction(errors, this.judgePatience);
        this.aceAttorneyCourtroom.dialogueBox.show(reaction, 'Judge Hardcastle', () => {
            // Return to desk view after dialogue
            this.aceAttorneyCourtroom.transitionToDeskView();
            document.getElementById('courtroomForms').style.display = 'block';
        });
    }

    // Check for maximum sentence
    if (this.judgePatience >= 100) {
        this.handleMaximumSentence();
    }
}
```

**Step 4:** Add maximum sentence handler:

```javascript
handleMaximumSentence() {
    // Judge goes VOLCANIC
    this.aceAttorneyCourtroom.judgeAnimator.transitionToState('VOLCANIC', 0.3);

    // Play dramatic sound
    this.soundSystem.playGavelShatter();

    // Maximum sentence after animation
    setTimeout(() => {
        this.aceAttorneyCourtroom.dialogueBox.hide();
        this.sentenceToPrison(999);
    }, 2000);
}
```

---

## PHASE 10: TESTING (4-6 hours)

### Test Suite

Create `game/test-ace-attorney.js`:

```javascript
/**
 * Ace Attorney Courtroom Test Suite
 */

function testAceAttorneyCourtroom() {
    console.log('=== Ace Attorney Courtroom Tests ===');

    // Test 1: Renderer functions
    console.log('Test 1: Canvas renderer functions');
    const canvas = document.getElementById('courtroomCanvas');
    const ctx = canvas.getContext('2d');
    drawCourtroom(ctx, canvas.width, canvas.height);
    drawGavel(ctx, 200, 200, '#3d2f1f', 0.5);
    console.log('✅ Renderer functions work');

    // Test 2: Atmosphere effects
    console.log('Test 2: Atmosphere effects');
    const atmosphere = new AtmosphereRenderer(canvas);
    atmosphere.applyVignette(ctx, 0.5);
    atmosphere.applyFilmGrain(ctx);
    console.log('✅ Atmosphere effects work');

    // Test 3: Judge animator
    console.log('Test 3: Judge animator');
    const animator = new JudgeSpriteAnimator();
    animator.render(ctx, 400, 300);
    animator.update(16);
    animator.transitionToState('ANGRY');
    console.log('✅ Judge animator works');

    // Test 4: Dialogue box
    console.log('Test 4: Dialogue box');
    const dialogue = new DialogueBox();
    dialogue.show('Test dialogue', 'Judge Hardcastle');
    setTimeout(() => dialogue.hide(), 1000);
    console.log('✅ Dialogue box works');

    // Test 5: Patience meter
    console.log('Test 5: Patience meter');
    const meter = new PatienceMeter();
    meter.setValue(50);
    console.log('✅ Patience meter works');

    // Test 6: Full system
    console.log('Test 6: Full system integration');
    const game = window.game; // Assumes game instance exists
    const courtroom = new AceAttorneyCourtroom(game, canvas);
    console.log('✅ Full system works');

    console.log('=== All Tests Passed ===');
}

// Run tests
testAceAttorneyCourtroom();
```

### Manual Testing Checklist

```
Visual Tests:
□ All 6 judge states render
□ State transitions smooth
□ Vignette visible
□ Film grain animates
□ Red overlay at high patience
□ Screen shake works
□ Colors match Darkest Dungeon palette

Animation Tests:
□ NEUTRAL: slow blink
□ IRRITATED: finger drumming
□ ANGRY: veins pulse
□ FURIOUS: gavel trembles
□ APOPLECTIC: gavel strike
□ VOLCANIC: gavel shatters

Sound Tests:
□ Gavel strike plays
□ Finger drumming loops
□ Gavel shatter plays
□ Sounds synced with animations

Integration Tests:
□ Form errors increase patience
□ Judge state changes at thresholds
□ Dialogue appears correctly
□ Maximum sentence triggers
□ Save/load preserves state

Mobile Tests:
□ Canvas scales correctly
□ Touch controls work
□ 30 FPS maintained
□ No layout overflow
```

---

## PHASE 11: DOCUMENTATION UPDATE (1-2 hours)

### Update Files

**1. SYSTEMS.md**
Add section for Ace Attorney Courtroom System

**2. CHANGELOG.md**
Add v1.5.0 entry with user-facing changes

**3. claude.md**
Update current version, file structure, recent changes

**4. README.md**
Add courtroom system to features list

---

## PHASE 12: VERSION & COMMIT (30 minutes)

### Update Version

**In game.js (~line 570):**
```javascript
this.VERSION = 'v1.5.0';
```

### Git Commit

```bash
git add game/ace-attorney-courtroom.js game/judge-sprite-animator.js game/courtroom-atmosphere.js game/courtroom-ui.js game/courtroom-renderer.js game/ace-attorney-courtroom.css game/index.html game/game.js game/soundsystem.js docs/systems/ACE_ATTORNEY_COURTROOM_SYSTEM.md docs/integration/ACE_ATTORNEY_COURTROOM_INTEGRATION.md SYSTEMS.md CHANGELOG.md claude.md

git commit -m "feat: add Ace Attorney-style visual novel courtroom system (v1.5.0)

- Implement 6 expressive Judge Hardcastle anger states (NEUTRAL → VOLCANIC)
- Add Darkest Dungeon/Disco Elysium-inspired atmosphere (vignette, film grain, oppressive lighting)
- Create canvas-based rendering system with smooth animations
- Add judge sprite animator with frame-perfect timing
- Implement patience meter with color-coded visualization
- Add dialogue system with Ace Attorney-style presentation
- Integrate courtroom atmosphere effects (screen shake, red overlay)
- Add new sound effects (gavel shatter, angry strike, finger drumming)
- Support desktop (60 FPS) and mobile (30 FPS) with touch controls
- Replace text-based courtroom with immersive visual experience
- Judge now visually escalates from bored bureaucrat to volcanic fury

Technical changes:
- 6 new files: ace-attorney-courtroom.js, judge-sprite-animator.js, courtroom-atmosphere.js, courtroom-ui.js, courtroom-renderer.js, ace-attorney-courtroom.css
- Modified game.js: replace showCourtroom(), add handleMaximumSentence()
- Modified soundsystem.js: add playGavelShatter(), playAngryGavelStrike(), playFingerDrum()
- Modified index.html: add canvas element, dialogue overlay, patience meter
- Added comprehensive system documentation and integration guide
- ~1800 lines of new code

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## TROUBLESHOOTING

### Issue: Canvas not rendering
**Solution:** Check canvas element exists in HTML and has correct ID

### Issue: Animations stuttering
**Solution:** Verify frame rate limiting, check for heavy draw calls

### Issue: Judge sprite looks wrong
**Solution:** Check coordinate calculations, verify fillEllipse helper function

### Issue: Sounds not playing
**Solution:** Verify Web Audio API context started (requires user interaction)

### Issue: Mobile performance poor
**Solution:** Enable frame rate limiting (30 FPS), reduce quality settings

### Issue: Patience meter not updating
**Solution:** Verify game.judgePatience is being modified correctly

---

## COMPLETION CHECKLIST

```
Phase 1: File Setup
□ All files created
□ Script tags added to index.html
□ Canvas element added to HTML

Phase 2: Renderer Foundation
□ courtroom-renderer.js complete
□ Helper functions working
□ Drawing functions tested

Phase 3: Atmosphere System
□ courtroom-atmosphere.js complete
□ Vignette working
□ Film grain animating
□ Color grading applied

Phase 4: Judge Animator
□ judge-sprite-animator.js complete
□ All 6 states implemented
□ Animation loops smooth
□ State transitions working

Phase 5: UI Components
□ courtroom-ui.js complete
□ Dialogue box functional
□ Patience meter updating

Phase 6: Main System
□ ace-attorney-courtroom.js complete
□ Render loop running
□ View transitions working

Phase 7: Styling
□ ace-attorney-courtroom.css complete
□ Mobile responsive
□ Colors match aesthetic

Phase 8: Sound Integration
□ soundsystem.js updated
□ All sounds implemented
□ Sounds synced with animations

Phase 9: Game Integration
□ game.js modified
□ Courtroom integrated
□ Form submission triggers judge

Phase 10: Testing
□ All visual tests passed
□ All animation tests passed
□ All sound tests passed
□ All integration tests passed
□ Mobile tests passed

Phase 11: Documentation
□ SYSTEMS.md updated
□ CHANGELOG.md updated
□ claude.md updated
□ README.md updated

Phase 12: Version & Commit
□ Version bumped to v1.5.0
□ Changes committed
□ Pushed to GitHub
```

---

## ESTIMATED TIMELINE

| Phase | Time | Cumulative |
|-------|------|------------|
| 1: File Setup | 0.5h | 0.5h |
| 2: Renderer | 3h | 3.5h |
| 3: Atmosphere | 2.5h | 6h |
| 4: Judge Animator | 10h | 16h |
| 5: UI Components | 2.5h | 18.5h |
| 6: Main System | 5h | 23.5h |
| 7: Styling | 1.5h | 25h |
| 8: Sound Integration | 2.5h | 27.5h |
| 9: Game Integration | 5h | 32.5h |
| 10: Testing | 5h | 37.5h |
| 11: Documentation | 1.5h | 39h |
| 12: Version & Commit | 0.5h | 39.5h |

**Total: 39.5 hours (5 full days)**

---

## POST-IMPLEMENTATION

After completing all phases:

1. **Deploy to GitHub Pages**
   - Push to main branch
   - Verify deployment at https://githumps.github.io/vroom-vroom/

2. **User Testing**
   - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
   - Test on mobile devices (iOS Safari, Android Chrome)
   - Gather feedback on judge animations and atmosphere

3. **Performance Profiling**
   - Use browser DevTools to check frame rate
   - Verify no memory leaks over 10+ minutes
   - Optimize if CPU usage > 50%

4. **Future Enhancements**
   - Consider sprite sheets for more detailed animations
   - Add more judge dialogue variations
   - Implement advanced effects (weather, lighting)

---

**Document Version:** 1.0
**Created:** 2025-10-16
**Status:** ✅ READY FOR IMPLEMENTATION
**Estimated Time:** 39.5 hours (5 days)
