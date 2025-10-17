# ENHANCED COURTROOM SYSTEM - TECHNICAL DESIGN DOCUMENT

**Version:** 1.0.0
**Created:** 2025-10-15
**Status:** DESIGN PHASE - Ready for Implementation
**Target Version:** v1.5.0

---

## EXECUTIVE SUMMARY

Transform the current paperwork simulator into an oppressive, doom-filled first-person courtroom experience. Players look down at an overwhelming desk of bureaucratic forms, then look up to face Judge Hardcastle's towering, sprite-based fury. Think Papers Please meets Disco Elysium meets Phoenix Wright, with the atmospheric dread of a dark souls boss encounter.

**Key Features:**
- First-person canvas-based rendering system
- Look up/down perspective switching mechanic
- Nearly full-screen Judge Hardcastle sprite (6 anger states)
- Expanded paperwork system (20-30 questions per arrest)
- Multi-page form navigation
- Progressive atmospheric effects
- Mobile-responsive touch controls

---

## 1. VISUAL SYSTEM ARCHITECTURE

### 1.1 Canvas-Based Rendering System

**Primary Canvas Element:**
```html
<canvas id="courtroomCanvas" width="1200" height="800"></canvas>
```

**Canvas Layers (Rendering Order):**
1. **Background Layer** - Courtroom environment (dark, vignette)
2. **Desk/Paperwork Layer** - Forms, papers, hands (when looking down)
3. **Judge Layer** - Judge Hardcastle sprite (when looking up)
4. **Effects Layer** - Vignette, lighting, particles
5. **UI Layer** - Patience meter, page counter, hints

**Rendering Architecture:**
```javascript
class EnhancedCourtroomRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.currentView = 'down'; // 'down' or 'up'
        this.transitionProgress = 0; // 0-1 for smooth transitions
        this.vignette = 0.3; // Darkness around edges (0-1)
        this.shake = { x: 0, y: 0, intensity: 0 }; // Screen shake
    }

    render(deltaTime) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.currentView === 'down') {
            this.renderDeskView();
        } else {
            this.renderJudgeView();
        }

        this.renderEffects();
        this.renderUI();
    }
}
```

### 1.2 Desk/Paperwork View (Looking Down)

**Visual Components:**
- Wooden desk surface (dark, worn texture)
- Stacked paperwork (offset, shadow effects)
- Current form centered (highlighted, readable)
- Player's hands at bottom edges (idle animations)
- Ink pen/stamp visible
- Coffee stain details
- Dramatic desk lamp lighting (single source, top-left)

**Desk Rendering Specification:**
```javascript
renderDeskView() {
    // 1. Render desk surface (dark wood grain pattern)
    this.renderDeskSurface();

    // 2. Render background papers (stacked, offset)
    this.renderPaperStack();

    // 3. Render current form (centered, highlighted)
    this.renderCurrentForm();

    // 4. Render player hands (bottom edges)
    this.renderPlayerHands();

    // 5. Render desk items (pen, stamp, coffee)
    this.renderDeskItems();

    // 6. Render lighting (single lamp, dramatic shadows)
    this.renderDeskLighting();
}
```

**Desk Surface ASCII Pattern:**
```
████████████████████████████████████████████████████████████
██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
██▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓██
██▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓██
██▓▓░░░░░░[FORM 27-B VISIBLE HERE]░░░░░░░░░░░░░░░░░░░░▓▓██
██▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓██
██▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓██
██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
████████████████████████████████████████████████████████████
     [HAND]                                    [HAND]
```

**Form Paper Rendering:**
- White/cream paper with subtle texture
- Black text, official stamps
- Red checkmarks/corrections appear dynamically
- Coffee stain in corner (random placement)
- Slight curl at edges
- Shadow beneath paper

### 1.3 Judge View (Looking Up)

**Visual Components:**
- Nearly full-screen Judge Hardcastle sprite
- Dark courtroom background (stone, wood paneling)
- Gavel on bench (animated when struck)
- Legal books stacked (intimidating backdrop)
- Dramatic uplighting (from player's position)
- Procedural vignette darkening

**Judge Sprite Specifications:**
- **Canvas Coverage:** 80-90% of screen height
- **Position:** Center-top (looking down at player)
- **Style:** Disco Elysium painterly/sketch aesthetic
- **Animation States:** Idle breathing, talking, gavel strike, anger transitions
- **Lighting:** Dramatic uplighting, harsh shadows

**Background Rendering:**
```javascript
renderJudgeView() {
    // 1. Render dark courtroom background
    this.renderCourtroomBackground();

    // 2. Render judge bench (wood, imposing)
    this.renderJudgeBench();

    // 3. Render Judge Hardcastle sprite (current anger state)
    this.renderJudgeSprite();

    // 4. Render gavel (if animating)
    this.renderGavel();

    // 5. Render dramatic lighting
    this.renderJudgeLighting();

    // 6. Apply camera shake if judge is angry
    this.applyCameraShake();
}
```

**Courtroom Background ASCII:**
```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░
░░▒▒                                                  ▒▒░░
░░▒▒        [LEGAL TOMES]    [LEGAL TOMES]           ▒▒░░
░░▒▒                                                  ▒▒░░
░░▒▒                                                  ▒▒░░
░░▒▒            [JUDGE HARDCASTLE SPRITE]            ▒▒░░
░░▒▒                                                  ▒▒░░
░░▒▒                                                  ▒▒░░
░░▒▒                                                  ▒▒░░
░░▒▒                                                  ▒▒░░
░░▒▒       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀         ▒▒░░
░░▒▒       [  J U D G E ' S   B E N C H  ]  ⚖        ▒▒░░
░░▒▒       ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄         ▒▒░░
░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

### 1.4 Transition Animations

**Look Up/Down Transition:**
- Duration: 600ms
- Easing: EaseInOutQuad
- Effects: Vertical camera movement simulation
- Audio: Creaking chair sound

**Transition States:**
```javascript
transitionToJudge(duration = 600) {
    this.transitioning = true;
    this.transitionStart = Date.now();
    this.transitionDuration = duration;
    this.targetView = 'up';

    // Tween from desk view to judge view
    // Simulate head tilting up (desk slides down, judge slides up)
}

updateTransition() {
    const elapsed = Date.now() - this.transitionStart;
    const progress = Math.min(elapsed / this.transitionDuration, 1);

    // Ease in-out quad
    this.transitionProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    if (progress >= 1) {
        this.transitioning = false;
        this.currentView = this.targetView;
    }
}
```

### 1.5 Lighting and Atmospheric Effects

**Desk Lighting:**
- Single desk lamp (top-left)
- Warm yellow-white (color: #FFE4B5)
- Radial gradient falloff
- Dramatic shadows on papers

**Judge Lighting:**
- Uplighting from player position (harsh, stark)
- Cold institutional white (color: #F0F0F0)
- Deep shadows on judge's face
- Backlit halo effect (intimidating)

**Vignette Effect:**
```javascript
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
```

**Dynamic Effects:**
- Vignette increases with judge's anger (0.3 → 0.7)
- Subtle film grain overlay
- Occasional paper flutter particles (desk view)
- Dust motes in judge's light beam

---

## 2. JUDGE HARDCASTLE SPRITE SYSTEM

### 2.1 Anger State Progression

**6 Anger States:**
1. **NEUTRAL** - First offense, barely contained annoyance
2. **IRRITATED** - 2-3 arrests, visible frustration
3. **ANGRY** - 4-5 arrests, raised voice, red face
4. **FURIOUS** - 6-7 arrests, gavel striking, bulging veins
5. **APOPLECTIC** - 8-10 arrests, screaming, shaking
6. **VOLCANIC** - 11+ arrests, inhuman rage, maximum sentences

**Anger State Triggers:**
```javascript
calculateJudgeAngerState(arrestCount, paperworkErrors, patience) {
    let angerLevel = 0;

    // Base anger from arrests
    angerLevel += arrestCount;

    // Paperwork errors add significant anger
    angerLevel += paperworkErrors * 2;

    // Low patience compounds anger
    if (patience < 20) angerLevel += 3;
    else if (patience < 50) angerLevel += 1;

    // Map to anger states
    if (angerLevel <= 1) return 'NEUTRAL';
    if (angerLevel <= 3) return 'IRRITATED';
    if (angerLevel <= 5) return 'ANGRY';
    if (angerLevel <= 7) return 'FURIOUS';
    if (angerLevel <= 10) return 'APOPLECTIC';
    return 'VOLCANIC';
}
```

### 2.2 Judge Sprite Specifications

**Sprite Dimensions:**
- **Width:** 800px (67% of 1200px canvas)
- **Height:** 900px (112% of 800px canvas, extends beyond top)
- **Position:** Centered horizontally, top-aligned (extends upward)
- **Format:** ASCII block art (for web compatibility) or PNG sprite sheet

**Sprite Rendering:**
```javascript
renderJudgeSprite() {
    const sprite = this.judgeSprites[this.currentAngerState];
    const x = (this.canvas.width - sprite.width) / 2;
    const y = -100; // Extends beyond canvas top

    // Apply camera shake
    const shakeX = x + this.shake.x;
    const shakeY = y + this.shake.y;

    // Render sprite
    if (sprite.type === 'ascii') {
        this.renderASCIISprite(sprite.art, shakeX, shakeY);
    } else {
        this.ctx.drawImage(sprite.image, shakeX, shakeY, sprite.width, sprite.height);
    }

    // Render breathing animation (subtle)
    this.animateBreathing();
}
```

### 2.3 ASCII Art Sprites

**STATE 1: NEUTRAL**
```
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
          ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
            ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
              ████░░░░░░░░░░░░░░░░░░░░░░████
                  ████████████████████████
            ████████████████████████████████████
          ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
          ██░░░░░░[  J U D G E   R O B E ]░░░░██
          ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
          ██████████████████████████████████████
        ██                                      ██
       ██        [BENCH]   ⚖   [GAVEL]          ██
      ████████████████████████████████████████████
```

**STATE 2: IRRITATED**
```
                    ████████████████████
                ████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████
              ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
            ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
          ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
        ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
        ██▒▒▒▒▒▒██████▒▒▒▒▒▒▒▒▒▒██████▒▒▒▒▒▒▒▒▒▒██
        ██▒▒▒▒██▒▒▒▒▒▒██▒▒▒▒▒▒██▒▒▒▒▒▒██▒▒▒▒▒▒▒▒██
        ██▒▒▒▒██▒▒██▒▒██▒▒▒▒▒▒██▒▒██▒▒██▒▒▒▒▒▒▒▒██
        ██▒▒▒▒▒▒██████▒▒▒▒▒▒▒▒▒▒██████▒▒▒▒▒▒▒▒▒▒██
        ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
        ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██  < slight frown
        ██▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
        ██▒▒▒▒▒▒▒▒▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▒▒▒▒▒▒▒▒▒▒▒▒██
        ██▒▒▒▒▒▒▄▄░░░░░░░░░░░░░░░░░░▄▄▒▒▒▒▒▒▒▒▒▒██  < frown deepens
        ██▒▒▒▒▒▒▒▒░░░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒██
          ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
          ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
            ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
              ████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████
                  ████████████████████████
            ████████████████████████████████████
          ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
          ██▒▒▒▒▒▒[  J U D G E   R O B E ]▒▒▒▒██
          ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
          ██████████████████████████████████████
        ██                                      ██
       ██        [BENCH]   ⚖   [GAVEL]          ██
      ████████████████████████████████████████████
      *FINGERS DRUMMING ON BENCH*
```

**STATE 3: ANGRY**
```
                    ████████████████████
                ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████
              ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
            ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓▓▓██
        ██▓▓▓▓██▓▓▓▓▓▓██▓▓▓▓▓▓██▓▓▓▓▓▓██▓▓▓▓▓▓▓▓██
        ██▓▓▓▓██▓▓██▓▓██▓▓▓▓▓▓██▓▓██▓▓██▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██  < brow furrows
        ██▓▓▓▓▓▓▓▓▓▓▓▓██░░░░░░██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██  < face reddening
        ██▓▓▓▓▓▓▓▓██████████████████▓▓▓▓▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓██░░░░░░░░░░░░░░░░░░██▓▓▓▓▓▓▓▓▓▓██  < deep scowl
        ██▓▓▓▓▓▓▓▓██░░░░░░░░░░░░░░██▓▓▓▓▓▓▓▓▓▓▓▓██
          ██▓▓▓▓▓▓▓▓████████████████▓▓▓▓▓▓▓▓▓▓██
          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
            ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
              ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████
                  ████████████████████████
            ████████████████████████████████████
          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
          ██▓▓▓▓▓▓[  J U D G E   R O B E ]▓▓▓▓██
          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
          ██████████████████████████████████████
        ██                                      ██
       ██        [BENCH]   ⚖   |GAVEL|          ██  < gavel ready
      ████████████████████████████████████████████
      **VEINS VISIBLE ON FOREHEAD**
```

**STATE 4: FURIOUS**
```
                    ████████████████████
                ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████
              ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
            ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓░░░░░░░░▓▓▓▓▓▓▓▓░░░░░░░░▓▓▓▓▓▓██ < veins bulging
        ██▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓██
        ██▓▓▓▓██▓▓▓▓▓▓██▓▓▓▓▓▓██▓▓▓▓▓▓██▓▓▓▓▓▓██
        ██▓▓▓▓██▓▓██▓▓██▓▓▓▓▓▓██▓▓██▓▓██▓▓▓▓▓▓██
        ██▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓▓▓▓▓▓▓██▓▓▓▓▓▓██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██  < face red
        ██▓▓▓▓▓▓▓▓████████████████████▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██▓▓▓▓▓▓██  < mouth open, yelling
        ██▓▓▓▓▓▓▓▓██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██▓▓▓▓▓▓▓▓██
          ██▓▓▓▓▓▓▓▓████████████████▓▓▓▓▓▓▓▓██
          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
            ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
              ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████
                  ████████████████████████
            ████████████████████████████████████
          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
          ██▓▓▓▓▓▓[  J U D G E   R O B E ]▓▓▓▓██
          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
          ██████████████████████████████████████
        ██                                      ██
       ██        [BENCH]   ⚖   \GAVEL/  *BANG*  ██  < gavel striking
      ████████████████████████████████████████████
      ***GAVEL STRIKES ECHOING*** ***SHAKING***
```

**STATE 5: APOPLECTIC**
```
                    ████████████████████
                ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████
              ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
            ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
          ██▓▓▓▓░░░░░░░░░░▓▓▓▓░░░░░░░░░░▓▓▓▓▓▓██ < severe vein bulge
        ██▓▓▓▓▓▓░░████░░▓▓▓▓▓▓▓▓░░████░░▓▓▓▓▓▓██
        ██▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓██
        ██▓▓▓▓██▓▓▓▓▓▓██▓▓▓▓▓▓██▓▓▓▓▓▓██▓▓▓▓▓▓██
        ██▓▓▓▓██▓▓██▓▓██▓▓▓▓▓▓██▓▓██▓▓██▓▓▓▓▓▓██ < eyes wide, furious
        ██▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓▓▓▓▓▓▓██▓▓▓▓▓▓██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██  < face crimson
        ██▓▓▓▓▓▓▓▓████████████████████▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██▓▓▓▓▓▓██  < screaming
        ██▓▓▓▓▓▓██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██▓▓▓▓▓▓██  < spittle flying
          ██▓▓▓▓▓▓████████████████████▓▓▓▓▓▓██
          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
            ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
              ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████
                  ████████████████████████
            ████████████████████████████████████
          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
          ██▓▓▓▓▓▓[  J U D G E   R O B E ]▓▓▓▓██
          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
          ██████████████████████████████████████
        ██                                      ██
       ██   [BENCH] ⚖ \GAVEL/ *BANG!* *BANG!*   ██  < repeated strikes
      ████████████████████████████████████████████
      ****VIOLENT SHAKING**** ****THUNDER****
```

**STATE 6: VOLCANIC**
```
                    ████████████████████
                ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████
              ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
            ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
          ██▓▓▓▓██████████▓▓▓▓██████████▓▓▓▓▓▓██ < veins throbbing
        ██▓▓▓▓▓▓████████▓▓▓▓▓▓▓▓████████▓▓▓▓▓▓██
        ██▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓██
        ██▓▓▓▓██▓▓▓▓▓▓██▓▓▓▓▓▓██▓▓▓▓▓▓██▓▓▓▓▓▓██
        ██▓▓▓▓██▓▓██▓▓██▓▓▓▓▓▓██▓▓██▓▓██▓▓▓▓▓▓██ < eyes BLAZING
        ██▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓▓▓▓▓▓▓██▓▓▓▓▓▓██▓▓▓▓▓▓▓▓▓▓▓▓▓▓██  < face PURPLE
        ██▓▓▓▓▓▓▓▓████████████████████▓▓▓▓▓▓▓▓██
        ██▓▓▓▓▓▓██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██▓▓▓▓▓▓██  < INHUMAN SCREAM
        ██▓▓▓▓▓▓██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██▓▓▓▓▓▓██  < RAGE INCARNATE
          ██▓▓▓▓▓▓████████████████████▓▓▓▓▓▓██
          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
            ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
              ████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████
                  ████████████████████████
            ████████████████████████████████████
          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
          ██▓▓▓▓▓▓[  J U D G E   R O B E ]▓▓▓▓██
          ██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
          ██████████████████████████████████████
        ██                                      ██
       ██   [BENCH] ⚖ |GAVEL SHATTERED|  ***    ██  < gavel broken
      ████████████████████████████████████████████
      *****APOCALYPTIC RAGE***** *****DOOM*****
      ░░░░░░░░THE COURTROOM TREMBLES░░░░░░░░░░░░
```

### 2.4 Gavel Animation States

**Gavel States:**
1. **Resting** - Laying on bench, neutral position
2. **Raised** - Judge has picked up gavel (warning)
3. **Striking** - Mid-swing, about to hit
4. **Impact** - Gavel strikes bench (screen shake trigger)
5. **Shattered** - Gavel broken from excessive use (VOLCANIC state)

**Gavel Animation Timing:**
```javascript
animateGavelStrike() {
    const timeline = [
        { time: 0,    state: 'resting' },
        { time: 200,  state: 'raised' },
        { time: 400,  state: 'striking' },
        { time: 500,  state: 'impact', shake: true },
        { time: 700,  state: 'resting' }
    ];

    // If VOLCANIC state, gavel shatters
    if (this.judgeAngerState === 'VOLCANIC') {
        timeline[3].state = 'shattered';
    }
}
```

### 2.5 Camera Shake Effects

**Shake Intensity by Anger State:**
```javascript
getShakeIntensity(angerState) {
    const intensities = {
        'NEUTRAL': 0,
        'IRRITATED': 0,
        'ANGRY': 2,
        'FURIOUS': 5,
        'APOPLECTIC': 10,
        'VOLCANIC': 20
    };
    return intensities[angerState];
}

applyCameraShake() {
    if (this.shake.intensity > 0) {
        this.shake.x = (Math.random() - 0.5) * this.shake.intensity;
        this.shake.y = (Math.random() - 0.5) * this.shake.intensity;

        // Decay shake over time
        this.shake.intensity *= 0.9;

        if (this.shake.intensity < 0.1) {
            this.shake.intensity = 0;
            this.shake.x = 0;
            this.shake.y = 0;
        }
    }
}
```

---

## 3. PAPERWORK SYSTEM ENHANCEMENT

### 3.1 Multi-Page Form System

**Form Structure:**
```javascript
class EnhancedPaperworkSystem {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 5; // 5 pages per arrest
        this.questionsPerPage = 5-6; // 25-30 total questions
        this.answers = {}; // Stores all answers
        this.errors = []; // Tracks errors
        this.completionTime = 0;
    }

    getFormPages() {
        return [
            this.getVehicleAssessmentPage(),
            this.getPsychologicalEvaluationPage(),
            this.getTemporalCircumstancesPage(),
            this.getPhilosophicalJustificationPage(),
            this.getCharacterWitnessPage()
        ];
    }
}
```

**Page Navigation:**
- **Next Page Button** - Disabled until all questions answered
- **Previous Page Button** - Review previous answers
- **Page Counter** - "Page 2 of 5" display
- **Progress Bar** - Visual completion indicator

### 3.2 New Question Categories

#### PAGE 1: VEHICLE CONDITION ASSESSMENT
```javascript
getVehicleAssessmentPage() {
    return {
        title: "FORM 27-B: VEHICLE CONDITION ASSESSMENT",
        subtitle: "Complete ALL fields. Omissions will result in additional charges.",
        questions: [
            {
                id: 'vehicleColor',
                type: 'text',
                label: 'What color was your vehicle at the time of the offense?',
                placeholder: 'Be specific. "Blue" is insufficient. Provide Pantone code if possible.',
                required: true,
                validation: (answer) => answer.length > 3
            },
            {
                id: 'vehicleAge',
                type: 'number',
                label: 'Age of vehicle in months (not years)?',
                placeholder: 'Months since manufacture',
                required: true,
                validation: (answer) => answer > 0
            },
            {
                id: 'tireCondition',
                type: 'select',
                label: 'Condition of front-left tire tread?',
                options: [
                    'Excellent (8/32" or greater)',
                    'Good (6/32" to 7/32")',
                    'Fair (4/32" to 5/32")',
                    'Poor (2/32" to 3/32")',
                    'Illegal (less than 2/32")',
                    'I do not know my tire tread depth'
                ],
                required: true
            },
            {
                id: 'lastWash',
                type: 'datetime',
                label: 'Date and time of last vehicle wash?',
                placeholder: 'MM/DD/YYYY HH:MM AM/PM',
                required: true,
                validation: (answer) => this.isValidDateTime(answer)
            },
            {
                id: 'odometer',
                type: 'number',
                label: 'Exact odometer reading at time of arrest?',
                placeholder: 'To the nearest tenth of a kilometer',
                required: true,
                validation: (answer) => answer >= 0
            },
            {
                id: 'modifications',
                type: 'textarea',
                label: 'List ALL modifications made to vehicle, no matter how minor:',
                placeholder: 'Include air fresheners, bumper stickers, floor mats, etc.',
                required: true,
                validation: (answer) => answer.length > 10
            }
        ]
    };
}
```

#### PAGE 2: DRIVER PSYCHOLOGICAL EVALUATION
```javascript
getPsychologicalEvaluationPage() {
    return {
        title: "FORM 42-A: DRIVER PSYCHOLOGICAL EVALUATION",
        subtitle: "Your mental fitness for vehicular operation must be assessed.",
        questions: [
            {
                id: 'whyDrive',
                type: 'textarea',
                label: 'In 500 words or more, explain why you believed driving was necessary:',
                placeholder: 'Do not say "I needed to go somewhere." Explain the existential necessity.',
                required: true,
                validation: (answer) => answer.split(' ').length >= 50 // Reduced from 500 for gameplay
            },
            {
                id: 'dreamAnalysis',
                type: 'textarea',
                label: 'Describe your most recent dream about driving:',
                placeholder: 'If you have never dreamed about driving, explain why not.',
                required: true
            },
            {
                id: 'motherOpinion',
                type: 'text',
                label: 'What would your mother say about your driving habits?',
                placeholder: 'Be honest.',
                required: true
            },
            {
                id: 'guiltyFeeling',
                type: 'select',
                label: 'On a scale of 1-10, how guilty do you feel about driving?',
                options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                required: true
            },
            {
                id: 'alternativeTransport',
                type: 'checkbox-multiple',
                label: 'Why did you not consider these alternatives? (Check ALL that apply)',
                options: [
                    'Walking seemed too difficult',
                    'I don\'t trust public transportation',
                    'Bicycles are beneath me',
                    'Teleportation has not been invented yet',
                    'I enjoy breaking the law',
                    'Cars make me feel powerful'
                ],
                required: true,
                validation: (answer) => answer.length > 0
            },
            {
                id: 'regretLevel',
                type: 'text',
                label: 'Do you feel regret? If so, quantify it in measurable units:',
                placeholder: 'e.g., "3.7 megaRegrets" or "0.002 sorrow-lumens"',
                required: true
            }
        ]
    };
}
```

#### PAGE 3: TEMPORAL CIRCUMSTANCES
```javascript
getTemporalCircumstancesPage() {
    return {
        title: "FORM 99-Z: TEMPORAL CIRCUMSTANCES DECLARATION",
        subtitle: "When you drove matters as much as why you drove.",
        questions: [
            {
                id: 'exactTime',
                type: 'text',
                label: 'Exact time you entered the vehicle (to the second):',
                placeholder: 'HH:MM:SS.mmm (include milliseconds)',
                required: true
            },
            {
                id: 'weatherCondition',
                type: 'select',
                label: 'Meteorological conditions at time of offense:',
                options: [
                    'Clear skies',
                    'Partly cloudy',
                    'Overcast',
                    'Light precipitation',
                    'Heavy precipitation',
                    'Atmospheric conditions irrelevant to my crime'
                ],
                required: true
            },
            {
                id: 'phaseOfMoon',
                type: 'select',
                label: 'Phase of the moon during your transgression:',
                options: [
                    'New Moon',
                    'Waxing Crescent',
                    'First Quarter',
                    'Waxing Gibbous',
                    'Full Moon',
                    'Waning Gibbous',
                    'Last Quarter',
                    'Waning Crescent',
                    'I did not check the moon phase before driving'
                ],
                required: true
            },
            {
                id: 'dayOfWeek',
                type: 'text',
                label: 'What day of the week were you arrested?',
                placeholder: 'Spell it correctly.',
                required: true,
                validation: (answer) => {
                    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                    return days.includes(answer.toLowerCase());
                }
            },
            {
                id: 'biorhythm',
                type: 'textarea',
                label: 'Describe your circadian biorhythm state at time of arrest:',
                placeholder: 'Were you alert? Drowsy? Had you consumed caffeine?',
                required: true
            },
            {
                id: 'lastMeal',
                type: 'text',
                label: 'Time elapsed since your last meal (in minutes):',
                placeholder: 'This is somehow relevant.',
                required: true,
                validation: (answer) => !isNaN(answer) && answer >= 0
            }
        ]
    };
}
```

#### PAGE 4: PHILOSOPHICAL JUSTIFICATIONS
```javascript
getPhilosophicalJustificationPage() {
    return {
        title: "FORM 13-C/D/E/F: PHILOSOPHICAL JUSTIFICATION",
        subtitle: "Defend your actions in the court of ethics and reason.",
        questions: [
            {
                id: 'freewill',
                type: 'textarea',
                label: 'Do you believe in free will? If yes, why did you choose to drive?',
                placeholder: 'If no, why should you be held responsible?',
                required: true
            },
            {
                id: 'socialContract',
                type: 'textarea',
                label: 'Explain how driving violates the social contract:',
                placeholder: 'Cite Rousseau, Locke, or Hobbes. Failure to cite = additional charges.',
                required: true
            },
            {
                id: 'trolleyProblem',
                type: 'select',
                label: 'The Trolley Problem: You are driving a car...',
                options: [
                    'I would swerve to hit fewer people',
                    'I would not swerve and hit more people',
                    'I would stop the car',
                    'I would never have gotten in the car in the first place',
                    'This is a false dichotomy'
                ],
                required: true
            },
            {
                id: 'categorical imperative',
                type: 'text',
                label: 'Would you will that everyone drive? (Kantian Categorical Imperative)',
                placeholder: 'Yes or No. Explain in exactly 10 words.',
                required: true,
                validation: (answer) => answer.split(' ').length === 10
            },
            {
                id: 'utilitarian',
                type: 'number',
                label: 'How many utils of pleasure did you derive from driving?',
                placeholder: 'Quantify your hedonistic calculus.',
                required: true
            },
            {
                id: 'existential',
                type: 'textarea',
                label: 'Does driving define your essence, or does your essence define your driving?',
                placeholder: 'Sartre would be disappointed in you.',
                required: true
            }
        ]
    };
}
```

#### PAGE 5: CHARACTER WITNESSES & FINAL DECLARATIONS
```javascript
getCharacterWitnessPage() {
    return {
        title: "FORM 77-X: CHARACTER WITNESSES & FINAL DECLARATION",
        subtitle: "Your last chance to provide context before sentencing.",
        questions: [
            {
                id: 'witness1Name',
                type: 'text',
                label: 'Name of first character witness:',
                placeholder: 'Full legal name',
                required: true
            },
            {
                id: 'witness1Relationship',
                type: 'text',
                label: 'Relationship to first witness:',
                placeholder: 'e.g., "Mother," "Cellmate," "Imaginary friend"',
                required: true
            },
            {
                id: 'witness1Statement',
                type: 'textarea',
                label: 'What would your first witness say about your character?',
                placeholder: 'Write in first person as if you are the witness.',
                required: true
            },
            {
                id: 'priorConvictions',
                type: 'number',
                label: 'Number of prior driving convictions:',
                placeholder: 'We already know. This is a test of honesty.',
                required: true,
                validation: (answer) => {
                    // Game secretly checks if answer matches actual arrest count
                    return true; // Always validate, but flag dishonesty
                }
            },
            {
                id: 'finalStatement',
                type: 'textarea',
                label: 'Final statement to the court:',
                placeholder: 'Choose your words carefully. The judge is watching.',
                required: true,
                validation: (answer) => answer.length > 20
            },
            {
                id: 'acknowledgement',
                type: 'checkbox',
                label: 'I acknowledge that I have read and understood all 47,000 traffic regulations:',
                options: ['I solemnly swear that I have read every single regulation'],
                required: true,
                validation: (answer) => answer === true
            }
        ]
    };
}
```

### 3.3 Additional Absurd Questions (Randomized Pool)

**Random Question Pool** (system picks 3-5 random questions to inject):
```javascript
getRandomAbsurdQuestions() {
    return [
        {
            id: 'favoriteColor',
            type: 'text',
            label: 'What is your favorite color? (This will be used against you)',
            placeholder: 'Choose wisely.',
            required: true
        },
        {
            id: 'petName',
            type: 'text',
            label: 'If you have a pet, what is its name? If not, what WOULD you name a pet?',
            placeholder: 'Relevance: Unknown',
            required: true
        },
        {
            id: 'pizzaTopping',
            type: 'select',
            label: 'Preferred pizza topping:',
            options: ['Pepperoni', 'Mushrooms', 'Pineapple (illegal in some jurisdictions)', 'I don\'t eat pizza'],
            required: true
        },
        {
            id: 'mathProblem',
            type: 'number',
            label: 'Solve: If a car travels at 60 km/h for 30 minutes, how guilty are you?',
            placeholder: 'Show your work.',
            required: true
        },
        {
            id: 'haiku',
            type: 'textarea',
            label: 'Write a haiku about your regret:',
            placeholder: '5-7-5 syllable structure. Seasonal reference optional.',
            required: true
        },
        {
            id: 'initials_redundant',
            type: 'text',
            label: 'Initial here to confirm you initialed the previous initial box:',
            placeholder: 'Initials',
            required: true,
            maxlength: 3
        },
        {
            id: 'signature_mirror',
            type: 'text',
            label: 'Sign your name backwards:',
            placeholder: 'Exactly backwards. This is legally binding.',
            required: true
        },
        {
            id: 'bloodType',
            type: 'select',
            label: 'Blood type (for record purposes):',
            options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown/Refused'],
            required: true
        },
        {
            id: 'zodiac',
            type: 'select',
            label: 'Astrological sign (prosecutorial astrology is real):',
            options: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
            required: true
        },
        {
            id: 'confession',
            type: 'textarea',
            label: 'Confess any other crimes you may have committed:',
            placeholder: 'This is voluntary. Technically.',
            required: false
        },
        {
            id: 'futureIntent',
            type: 'select',
            label: 'Do you intend to drive again after your release?',
            options: [
                'Absolutely not',
                'Probably not',
                'Maybe',
                'Probably yes',
                'Definitely yes',
                'I am already planning my next drive'
            ],
            required: true
        },
        {
            id: 'parkingTickets',
            type: 'number',
            label: 'Number of unpaid parking tickets:',
            placeholder: 'Zero is an acceptable answer. If you are lying, we will know.',
            required: true
        },
        {
            id: 'fingerCount',
            type: 'number',
            label: 'How many fingers do you have? (Total, both hands)',
            placeholder: 'Count carefully.',
            required: true,
            validation: (answer) => answer >= 0 && answer <= 12
        },
        {
            id: 'favoriteJudge',
            type: 'text',
            label: 'Who is your favorite judge in the district?',
            placeholder: 'Hint: There is a correct answer.',
            required: true
        },
        {
            id: 'apology',
            type: 'textarea',
            label: 'Write a formal apology to society for your actions:',
            placeholder: 'Begin with "To Whom It May Concern..."',
            required: true,
            validation: (answer) => answer.toLowerCase().includes('to whom it may concern')
        }
    ];
}
```

### 3.4 Error Detection & Penalties

**Automatic Error Detection:**
```javascript
validateForm(page, answers) {
    const errors = [];

    // Check required fields
    page.questions.forEach(q => {
        if (q.required && !answers[q.id]) {
            errors.push({
                field: q.id,
                message: `FORM ${page.title}: Field "${q.label}" is required.`,
                penalty: 6 // months added to sentence
            });
        }

        // Run custom validations
        if (q.validation && answers[q.id]) {
            if (!q.validation(answers[q.id])) {
                errors.push({
                    field: q.id,
                    message: `FORM ${page.title}: Invalid response to "${q.label}".`,
                    penalty: 3
                });
            }
        }
    });

    // Check for contradictions across pages
    errors.push(...this.detectContradictions(answers));

    return errors;
}

detectContradictions(answers) {
    const contradictions = [];

    // Example: If they said they feel guilty but also would drive again
    if (answers.guiltyFeeling >= 7 && answers.futureIntent === 'Definitely yes') {
        contradictions.push({
            message: 'CONTRADICTION DETECTED: You claim high guilt but intent to reoffend.',
            penalty: 12
        });
    }

    // Check if prior convictions match actual arrest count
    if (answers.priorConvictions !== this.game.judge.arrestCount - 1) {
        contradictions.push({
            message: 'DISHONESTY DETECTED: Prior conviction count incorrect.',
            penalty: 24
        });
    }

    return contradictions;
}
```

**Judge Reaction to Errors:**
```javascript
processFormErrors(errors) {
    if (errors.length === 0) {
        this.judge.say("Hmm. Surprisingly thorough. I'll give you that.");
        return;
    }

    // Trigger judge anger for each error
    errors.forEach(error => {
        this.judge.updateMood(-10); // Lose patience
        this.judge.say(error.message);
        this.player.sentence += error.penalty / 12; // Convert months to years
    });

    // Gavel strike for multiple errors
    if (errors.length >= 3) {
        this.triggerGavelStrike();
    }
}
```

---

## 4. INTERACTION MECHANICS

### 4.1 Controls

**Desktop Controls:**
```javascript
setupDesktopControls() {
    // Spacebar: Toggle view (up/down)
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            this.toggleView();
        }
    });

    // Arrow keys: Navigate form (when looking down)
    document.addEventListener('keydown', (e) => {
        if (this.currentView === 'down') {
            if (e.code === 'ArrowLeft') this.previousPage();
            if (e.code === 'ArrowRight') this.nextPage();
            if (e.code === 'ArrowUp') this.previousQuestion();
            if (e.code === 'ArrowDown') this.nextQuestion();
        }
    });

    // Tab: Next field
    // Shift+Tab: Previous field
    // Enter: Submit current page

    // Mouse click: Click to fill forms (when looking down)
    // Mouse click on judge area: Trigger random judge reaction
}
```

**Mobile Controls:**
```javascript
setupMobileControls() {
    // Swipe up: Look at judge
    // Swipe down: Look at desk

    const canvas = document.getElementById('courtroomCanvas');
    let touchStartY = 0;

    canvas.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    canvas.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaY) > 50) { // Minimum swipe distance
            if (deltaY < 0 && this.currentView === 'down') {
                // Swiped up: Look at judge
                this.transitionToJudge();
            } else if (deltaY > 0 && this.currentView === 'up') {
                // Swiped down: Look at desk
                this.transitionToDesk();
            }
        }
    });

    // Touch buttons for page navigation
    this.renderMobileNavButtons();
}
```

### 4.2 Patience Meter Visualization

**Patience Meter UI:**
```javascript
renderPatienceMeter() {
    const x = 50;
    const y = this.canvas.height - 50;
    const width = 200;
    const height = 20;

    // Background
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(x, y, width, height);

    // Patience fill (color changes based on level)
    const patiencePercent = this.judge.patience / 100;
    const fillWidth = width * patiencePercent;

    if (patiencePercent > 0.6) {
        this.ctx.fillStyle = '#0f0'; // Green
    } else if (patiencePercent > 0.3) {
        this.ctx.fillStyle = '#ff0'; // Yellow
    } else {
        this.ctx.fillStyle = '#f00'; // Red
    }

    this.ctx.fillRect(x, y, fillWidth, height);

    // Border
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, height);

    // Label
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px monospace';
    this.ctx.fillText('JUDGE PATIENCE', x, y - 5);
    this.ctx.fillText(`${Math.floor(this.judge.patience)}%`, x + width + 10, y + 15);
}
```

### 4.3 Judge Reactions to Player Actions

**Reaction Triggers:**
```javascript
class JudgeReactionSystem {
    constructor(judge, renderer) {
        this.judge = judge;
        this.renderer = renderer;
    }

    // Trigger when player looks up
    onPlayerLooksUp() {
        const reactions = [
            "Yes? Do you have something to say?",
            "The forms are down THERE. Not up HERE.",
            "Stop wasting time. Complete the paperwork.",
            "Looking at me won't make your sentence any shorter.",
            "I'm not getting any younger. And neither are you."
        ];

        this.judge.say(this.randomChoice(reactions));
        this.judge.updateMood(-2);

        // Slight gavel tap if patience is low
        if (this.judge.patience < 30) {
            this.renderer.triggerGavelTap();
        }
    }

    // Trigger when player hesitates too long
    onDelayTooLong(secondsIdle) {
        if (secondsIdle > 30) {
            this.judge.say("Are you SLEEPING down there? Fill out the forms!");
            this.judge.updateMood(-5);
            this.renderer.triggerGavelStrike();
        } else if (secondsIdle > 60) {
            this.judge.say("CONTEMPT OF COURT! That's an additional year!");
            this.player.sentence += 1;
            this.judge.updateMood(-10);
            this.renderer.triggerGavelStrike();
        }
    }

    // Trigger on wrong answer
    onWrongAnswer(question, answer) {
        const reactions = [
            `"${answer}"? WRONG. Try again.`,
            `That's not even close to a correct answer.`,
            `Are you illiterate? Read the question again.`,
            `I see you enjoy making my job difficult.`
        ];

        this.judge.say(this.randomChoice(reactions));
        this.judge.updateMood(-5);
    }

    // Trigger on page completion
    onPageComplete(page, timeTaken, errors) {
        if (errors === 0 && timeTaken < 60) {
            this.judge.say("Surprisingly competent. Proceed.");
        } else if (errors > 0) {
            this.judge.say(`${errors} mistakes. Typical.`);
            this.judge.updateMood(-errors * 3);
            this.renderer.triggerGavelStrike();
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

### 4.4 Sentence Accumulation Feedback

**Real-Time Sentence Display:**
```javascript
renderSentenceAccumulation() {
    // Display current sentence at top of desk view
    if (this.currentView === 'down') {
        const x = this.canvas.width / 2;
        const y = 50;

        this.ctx.fillStyle = '#f00';
        this.ctx.font = 'bold 24px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`CURRENT SENTENCE: ${this.player.sentence.toFixed(1)} YEARS`, x, y);

        // Show recent additions
        if (this.recentSentenceAdded > 0) {
            this.ctx.fillStyle = '#ff0';
            this.ctx.font = '18px monospace';
            this.ctx.fillText(`+${this.recentSentenceAdded.toFixed(1)} years added!`, x, y + 30);
        }
    }
}

addSentenceWithFeedback(years, reason) {
    this.player.sentence += years;
    this.recentSentenceAdded = years;

    // Flash effect
    this.sentenceFeedbackTimer = 3000; // Show for 3 seconds

    // Judge comment
    this.judge.say(reason);

    // Screen shake for large additions
    if (years >= 1) {
        this.renderer.shake.intensity = years * 5;
    }
}
```

---

## 5. INTEGRATION STRATEGY

### 5.1 New JavaScript Class: EnhancedCourtroomSystem

**File Structure:**
```
game/
├── enhanced-courtroom.js     (NEW - Main system)
├── enhanced-courtroom.css    (NEW - Styling)
└── game.js                   (MODIFIED - Integration)
```

**Class Architecture:**
```javascript
// enhanced-courtroom.js

class EnhancedCourtroomSystem {
    constructor(game) {
        this.game = game;
        this.canvas = null;
        this.renderer = null;
        this.paperwork = null;
        this.reactions = null;
        this.active = false;
    }

    initialize() {
        this.setupCanvas();
        this.renderer = new EnhancedCourtroomRenderer(this.canvas);
        this.paperwork = new EnhancedPaperworkSystem();
        this.reactions = new JudgeReactionSystem(this.game.judge, this.renderer);

        this.setupControls();
        this.startRenderLoop();
    }

    setupCanvas() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'courtroomCanvas';
        this.canvas.width = 1200;
        this.canvas.height = 800;

        // Responsive sizing
        this.canvas.style.maxWidth = '100%';
        this.canvas.style.height = 'auto';

        // Append to courtroom screen
        const courtroomScreen = document.getElementById('courtroom');
        courtroomScreen.insertBefore(this.canvas, courtroomScreen.firstChild);
    }

    activate() {
        this.active = true;
        this.renderer.currentView = 'down'; // Start looking at desk
        this.paperwork.reset();
        this.game.judge.calculateNewMood();
    }

    deactivate() {
        this.active = false;
    }

    startRenderLoop() {
        let lastTime = Date.now();

        const loop = () => {
            if (!this.active) {
                requestAnimationFrame(loop);
                return;
            }

            const now = Date.now();
            const deltaTime = now - lastTime;
            lastTime = now;

            this.update(deltaTime);
            this.renderer.render(deltaTime);

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    update(deltaTime) {
        // Update judge anger state
        this.renderer.currentAngerState = this.calculateJudgeAngerState();

        // Update vignette based on anger
        this.updateAtmosphere();

        // Check for delays
        this.checkPlayerDelay(deltaTime);
    }

    calculateJudgeAngerState() {
        const arrestCount = this.game.judge.arrestCount;
        const paperworkErrors = this.paperwork.errors.length;
        const patience = this.game.judge.patience;

        let angerLevel = arrestCount + (paperworkErrors * 2);
        if (patience < 20) angerLevel += 3;
        else if (patience < 50) angerLevel += 1;

        if (angerLevel <= 1) return 'NEUTRAL';
        if (angerLevel <= 3) return 'IRRITATED';
        if (angerLevel <= 5) return 'ANGRY';
        if (angerLevel <= 7) return 'FURIOUS';
        if (angerLevel <= 10) return 'APOPLECTIC';
        return 'VOLCANIC';
    }

    updateAtmosphere() {
        const angerLevels = {
            'NEUTRAL': 0.3,
            'IRRITATED': 0.4,
            'ANGRY': 0.5,
            'FURIOUS': 0.6,
            'APOPLECTIC': 0.7,
            'VOLCANIC': 0.85
        };

        this.renderer.vignette = angerLevels[this.renderer.currentAngerState];
    }
}

class EnhancedCourtroomRenderer {
    // (As defined in Section 1)
}

class EnhancedPaperworkSystem {
    // (As defined in Section 3)
}

class JudgeReactionSystem {
    // (As defined in Section 4.3)
}
```

### 5.2 Canvas Element Integration

**HTML Changes (index.html):**
```html
<!-- COURTROOM -->
<div id="courtroom" class="screen">
    <!-- Canvas will be injected here by EnhancedCourtroomSystem -->

    <!-- UI Overlay (sits on top of canvas) -->
    <div id="courtroomUI" class="courtroom-overlay">
        <!-- Page navigation -->
        <div id="pageNavigation">
            <button id="prevPageBtn" onclick="game.enhancedCourtroom.previousPage()">◀ PREVIOUS</button>
            <span id="pageCounter">Page 1 of 5</span>
            <button id="nextPageBtn" onclick="game.enhancedCourtroom.nextPage()">NEXT ▶</button>
        </div>

        <!-- Form container (overlays desk area) -->
        <div id="formOverlay">
            <!-- Dynamic form fields rendered here -->
        </div>

        <!-- Mobile swipe hint -->
        <div id="swipeHint" class="mobile-only">
            Swipe up to face the judge ▲
        </div>

        <!-- Look up/down button (desktop) -->
        <button id="toggleViewBtn" class="desktop-only" onclick="game.enhancedCourtroom.toggleView()">
            <span id="viewBtnText">LOOK UP (SPACE)</span>
        </button>
    </div>
</div>
```

**CSS (enhanced-courtroom.css):**
```css
#courtroomCanvas {
    display: block;
    width: 100%;
    max-width: 1200px;
    height: auto;
    margin: 0 auto;
    border: 2px solid #0f0;
    background: #000;
}

.courtroom-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Allow clicks to pass through */
}

.courtroom-overlay button,
.courtroom-overlay input,
.courtroom-overlay textarea,
.courtroom-overlay select {
    pointer-events: auto; /* Re-enable clicks for interactive elements */
}

#pageNavigation {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 20px;
    align-items: center;
}

#formOverlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid #0f0;
    padding: 20px;
    max-width: 600px;
    max-height: 70%;
    overflow-y: auto;
}

#toggleViewBtn {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    font-size: 14px;
}

#swipeHint {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: #0f0;
    font-size: 12px;
    text-align: center;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

/* Mobile adjustments */
@media (max-width: 768px) {
    .desktop-only { display: none; }

    #formOverlay {
        max-width: 90%;
        font-size: 14px;
    }

    #pageNavigation button {
        padding: 10px 15px;
        font-size: 12px;
    }
}

@media (min-width: 769px) {
    .mobile-only { display: none; }
}
```

### 5.3 Integration with Existing JudgeHardcastle Class

**Modifications to game.js:**
```javascript
// game.js - VroomVroomGame class

constructor() {
    // ... existing code ...

    this.judge = new JudgeHardcastle();
    this.enhancedCourtroom = null; // NEW
}

init() {
    // ... existing code ...

    // Initialize enhanced courtroom system
    this.enhancedCourtroom = new EnhancedCourtroomSystem(this);
    this.enhancedCourtroom.initialize();
}

arrest() {
    // ... existing arrest code ...

    // Activate enhanced courtroom
    this.enhancedCourtroom.activate();
    this.showScreen('courtroom');
}

submitCourtForms() {
    // NEW: Use enhanced paperwork system
    const results = this.enhancedCourtroom.paperwork.validate();

    if (results.errors.length > 0) {
        // Process errors, add sentence
        this.enhancedCourtroom.processFormErrors(results.errors);
    } else {
        // Success - minimal errors
        this.judge.say("Acceptable. Proceed to sentencing.");
    }

    // Calculate final sentence
    this.calculateFinalSentence();

    // Transition to prison
    this.enhancedCourtroom.deactivate();
    this.sendToPrison();
}
```

### 5.4 Sound Effects Integration

**New Sound Effects Needed:**
```javascript
// soundsystem.js - Add new methods

playChairCreak() {
    // Creaking chair sound when looking up/down
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
    // Paper rustling sound when changing pages
    const ctx = this.audioContext;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const data = buffer.getChannelData(0);

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
    // Distorted yell sound for APOPLECTIC/VOLCANIC states
    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const distortion = ctx.createWaveShaper();

    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
    osc.type = 'sawtooth';

    // Distortion curve
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
        curve[i] = Math.tanh((i - 128) / 32);
    }
    distortion.curve = curve;

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.connect(distortion);
    distortion.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
}
```

---

## 6. MOBILE CONSIDERATIONS

### 6.1 Touch Gestures

**Gesture Mapping:**
- **Swipe Up** (50px+ movement): Look at judge
- **Swipe Down** (50px+ movement): Look at desk
- **Tap** on form field: Focus field, open keyboard
- **Double-tap** on judge: Trigger random reaction
- **Pinch zoom**: DISABLED (prevent accidental zoom)

**Implementation:**
```javascript
setupTouchGestures() {
    const canvas = this.canvas;
    let touchStartY = 0;
    let touchStartX = 0;
    let touchStartTime = 0;

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent scroll
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndTime = Date.now();

        const deltaY = touchEndY - touchStartY;
        const deltaX = touchEndX - touchStartX;
        const deltaTime = touchEndTime - touchStartTime;

        // Detect swipe vs tap
        if (Math.abs(deltaY) > 50 && deltaTime < 500) {
            // Swipe gesture
            if (deltaY < 0 && this.currentView === 'down') {
                this.transitionToJudge();
            } else if (deltaY > 0 && this.currentView === 'up') {
                this.transitionToDesk();
            }
        } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300) {
            // Tap gesture
            this.handleTap(touchEndX, touchEndY);
        }
    });

    // Prevent pinch zoom
    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
}
```

### 6.2 Responsive Canvas Sizing

**Auto-Scaling:**
```javascript
resizeCanvas() {
    const container = document.getElementById('courtroom');
    const containerWidth = container.clientWidth;

    // Maintain 3:2 aspect ratio
    const aspectRatio = 3 / 2;
    const maxWidth = 1200;
    const maxHeight = 800;

    let canvasWidth = Math.min(containerWidth * 0.95, maxWidth);
    let canvasHeight = canvasWidth / aspectRatio;

    if (canvasHeight > window.innerHeight * 0.7) {
        canvasHeight = window.innerHeight * 0.7;
        canvasWidth = canvasHeight * aspectRatio;
    }

    this.canvas.style.width = canvasWidth + 'px';
    this.canvas.style.height = canvasHeight + 'px';
}

// Call on window resize
window.addEventListener('resize', () => {
    if (this.enhancedCourtroom) {
        this.enhancedCourtroom.renderer.resizeCanvas();
    }
});
```

### 6.3 Touch-Friendly Form Inputs

**Mobile Form Adjustments:**
```css
/* Larger touch targets on mobile */
@media (max-width: 768px) {
    input[type="text"],
    input[type="number"],
    textarea,
    select {
        font-size: 16px !important; /* Prevent iOS zoom */
        padding: 12px;
        min-height: 48px; /* Touch target size */
    }

    button {
        min-height: 48px;
        min-width: 48px;
        padding: 12px 20px;
        font-size: 16px;
    }

    textarea {
        min-height: 120px;
    }
}
```

---

## 7. IMPLEMENTATION CHECKLIST

### Phase 1: Core Rendering System (4-6 hours)
- [ ] Create `enhanced-courtroom.js` file
- [ ] Implement `EnhancedCourtroomRenderer` class
- [ ] Create desk view rendering (surface, papers, hands)
- [ ] Create judge view rendering (background, bench)
- [ ] Implement view transition animations
- [ ] Add vignette and lighting effects
- [ ] Test rendering on desktop and mobile

### Phase 2: Judge Sprite System (3-4 hours)
- [ ] Create ASCII art sprites for all 6 anger states
- [ ] Implement sprite rendering system
- [ ] Add breathing animation (subtle idle)
- [ ] Create gavel animation states
- [ ] Implement camera shake system
- [ ] Test anger state transitions
- [ ] Verify sprites display correctly at all resolutions

### Phase 3: Paperwork System (6-8 hours)
- [ ] Implement `EnhancedPaperworkSystem` class
- [ ] Create all 5 form pages (25-30 questions total)
- [ ] Add random question pool (15+ questions)
- [ ] Implement multi-page navigation
- [ ] Add form validation system
- [ ] Create error detection logic
- [ ] Add contradiction detection
- [ ] Test all question types and validations

### Phase 4: Interaction Mechanics (4-5 hours)
- [ ] Implement desktop controls (Space, arrows, Tab, Enter)
- [ ] Implement mobile touch gestures (swipe, tap)
- [ ] Create patience meter visualization
- [ ] Implement `JudgeReactionSystem` class
- [ ] Add real-time sentence accumulation display
- [ ] Add delay detection (idle timer)
- [ ] Test all interaction flows

### Phase 5: Sound Integration (2-3 hours)
- [ ] Add chair creak sound (look up/down)
- [ ] Add paper rustle sound (page change)
- [ ] Add judge yell sound (high anger states)
- [ ] Add gavel strike sound (already exists, verify integration)
- [ ] Test sound timing with animations
- [ ] Verify mute/volume controls work

### Phase 6: Integration & Testing (4-5 hours)
- [ ] Integrate with existing `JudgeHardcastle` class
- [ ] Modify `game.js` arrest flow
- [ ] Update `submitCourtForms()` method
- [ ] Create `enhanced-courtroom.css` stylesheet
- [ ] Add canvas to `index.html`
- [ ] Test full arrest → courtroom → prison flow
- [ ] Test on multiple screen sizes
- [ ] Test on iOS and Android devices
- [ ] Verify save/load compatibility

### Phase 7: Polish & Optimization (3-4 hours)
- [ ] Optimize canvas rendering (60fps target)
- [ ] Add loading states for transitions
- [ ] Fine-tune animation timings
- [ ] Adjust anger state thresholds for balance
- [ ] Add tutorial hints ("Press SPACE to look up")
- [ ] Test with screen readers (accessibility)
- [ ] Final QA pass

### Phase 8: Documentation (2 hours)
- [ ] Update `SYSTEMS.md` with enhanced courtroom system
- [ ] Create integration guide in `docs/integration/`
- [ ] Update `CHANGELOG.md` for v1.5.0
- [ ] Update `claude.md` version and status
- [ ] Add code comments and JSDoc
- [ ] Create developer testing guide

**Total Estimated Time:** 28-37 hours

---

## 8. TECHNICAL NOTES & CONSIDERATIONS

### Performance Optimization
- Use `requestAnimationFrame` for smooth 60fps rendering
- Cache ASCII sprites as textures (avoid redrawing)
- Debounce form validation (validate on blur, not on keypress)
- Lazy load form pages (only render visible page)

### Browser Compatibility
- Target: Chrome, Firefox, Safari, Edge (last 2 versions)
- Mobile: iOS Safari 14+, Chrome Mobile 90+
- Fallback: If canvas not supported, show traditional HTML forms

### Accessibility
- Provide keyboard-only navigation option
- Add ARIA labels to all form fields
- Ensure sufficient color contrast (green on black)
- Support screen reader announcements for judge dialogue

### Save Game Compatibility
- Enhanced courtroom state must serialize to save file
- Current page, answers, errors must persist
- Handle legacy saves without enhanced courtroom data

### Future Enhancements
- Animated judge mouth when speaking
- Particle effects (dust, paper flutter)
- Parallax background layers
- Alternative judge sprites (different robes, seasons)
- Courtroom background variants (time of day)

---

## CONCLUSION

This enhanced courtroom system transforms a simple form-filling experience into an oppressive, doom-filled atmospheric encounter. The combination of first-person perspective, nearly full-screen judge sprite, excessive bureaucratic paperwork, and progressive anger states creates a uniquely stressful and darkly comedic gameplay moment.

**Core Pillars:**
1. **Visual Drama** - Canvas-based rendering with dramatic lighting and imposing judge presence
2. **Absurdist Bureaucracy** - 25-30 questions of increasing absurdity and philosophical weight
3. **Escalating Tension** - Judge anger system with 6 states, gavel strikes, and screen shake
4. **Player Agency** - Look up/down mechanic creates rhythm and pacing
5. **Mobile Support** - Touch gestures and responsive design ensure cross-platform compatibility

**Expected Player Experience:**
- Initial overwhelm at paperwork volume
- Tension from judge looming overhead
- Dark humor from absurd questions
- Dread from accumulating sentence
- Satisfaction from completing all forms correctly (or chaos from errors)

This system is ready for implementation. All technical specifications, code structures, and integration points are defined. Begin with Phase 1 (Core Rendering System) and proceed sequentially through the checklist.

**May Judge Hardcastle have mercy on your soul.**

---

**END OF TECHNICAL DESIGN DOCUMENT**
