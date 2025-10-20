# COURTROOM PIXEL ART INTEGRATION GUIDE

**Quick reference for integrating the pixel art courtroom system**

---

## QUICK START (5 Minutes)

### 1. Add Scripts to HTML

Add BEFORE the closing `</body>` tag in `index.html`:

```html
<!-- Courtroom Pixel Art System (add after existing courtroom script) -->
<script src="assets/courtroom/judge-sprite-data.js"></script>
<script src="assets/courtroom/courtroom-background-data.js"></script>
<script src="assets/courtroom/paperwork-ui-data.js"></script>
<script src="systems/courtroom-pixel-renderer.js"></script>
```

### 2. No Code Changes Required!

The pixel art system is a **drop-in replacement** for the existing `AceAttorneyCourtroom` class.

Current code will work as-is:
```javascript
// Existing code - NO CHANGES NEEDED
this.courtroom = new AceAttorneyCourtroom('judgeCanvas', 'courtroomDialogue');
this.courtroom.start(0);
this.courtroom.updatePatience(50);
this.courtroom.triggerGavelStrike();
```

The `courtroom-pixel-renderer.js` automatically replaces the class when loaded!

### 3. Test It

1. Load game in browser
2. Navigate to courtroom
3. Judge should now render with pixel art sprites
4. All animations work automatically

---

## ADVANCED: USING PNG SPRITE SHEETS

Once you create actual PNG sprite sheets in Aseprite:

### 1. Place PNG Files

```
/game/assets/courtroom/
├── sprites/
│   ├── judge_spritesheet.png (128x896 - 7 frames)
│   └── gavel_spritesheet.png (32x192 - 3 frames)
├── backgrounds/
│   ├── wall.png (800x600)
│   ├── background_props.png (800x600)
│   ├── judges_bench.png (800x600)
│   ├── foreground_props.png (800x600)
│   └── atmosphere.png (800x600)
└── ui/
    ├── paper_texture.png (600x800)
    ├── stamp_approved.png (72x72)
    └── signature_scrawl.png (variable)
```

### 2. Update Renderer to Load Images

Edit `/game/systems/courtroom-pixel-renderer.js`:

```javascript
class PixelArtRenderer {
    constructor(canvas) {
        // ... existing code ...

        // Load sprite sheets
        this.imagesLoaded = false;
        this.loadAssets();
    }

    async loadAssets() {
        try {
            this.judgeSheet = await this.loadImage('assets/courtroom/sprites/judge_spritesheet.png');
            this.gavelSheet = await this.loadImage('assets/courtroom/sprites/gavel_spritesheet.png');
            this.bgWall = await this.loadImage('assets/courtroom/backgrounds/wall.png');
            this.bgBench = await this.loadImage('assets/courtroom/backgrounds/judges_bench.png');

            this.imagesLoaded = true;
            console.log('Courtroom pixel art loaded successfully');
        } catch (error) {
            console.warn('Could not load PNG sprites, using procedural fallback:', error);
            this.imagesLoaded = false;
        }
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    // Update renderPixelSprite to use images if available
    renderPixelSprite(sprite, x, y, scale = 1) {
        if (this.imagesLoaded && sprite.imageSource) {
            // Use PNG sprite sheet
            this.ctx.drawImage(
                sprite.imageSource,
                sprite.sourceX, sprite.sourceY, sprite.sourceW, sprite.sourceH,
                x, y, sprite.sourceW * scale, sprite.sourceH * scale
            );
        } else {
            // Fallback to procedural rendering (existing code)
            // ... current renderPixelSprite implementation ...
        }
    }
}
```

### 3. Map Sprites to Sheet Frames

```javascript
updateJudgeState(patience) {
    const frameMap = {
        'NEUTRAL': 0,
        'IRRITATED': 2,
        'ANGRY': 3,
        'FURIOUS': 4,
        'APOPLECTIC': 5,
        'VOLCANIC': 6
    };

    const frame = this.blinking ? 1 : frameMap[this.currentState];

    this.judge = {
        imageSource: this.judgeSheet,
        sourceX: 0,
        sourceY: frame * 128,
        sourceW: 128,
        sourceH: 128
    };
}
```

---

## CUSTOMIZATION

### Adjust Judge Position

Edit `courtroom-pixel-renderer.js`:

```javascript
draw() {
    // ...
    if (this.judge) {
        const judgeX = this.width / 2 - 64; // Change X position
        const judgeY = 140 + this.breathing;  // Change Y position
        this.renderPixelSprite(this.judge, judgeX, judgeY, 2.5); // Change scale
    }
}
```

### Modify Anger Thresholds

Edit `judge-sprite-data.js`:

```javascript
const JUDGE_STATES = {
    NEUTRAL: { patienceRange: [0, 10], ... },      // Was [0, 15]
    IRRITATED: { patienceRange: [11, 25], ... },   // Was [16, 35]
    ANGRY: { patienceRange: [26, 50], ... },       // Was [36, 60]
    // ... etc
};
```

### Change Dust Particle Count

```javascript
initializeDustParticles() {
    const particles = [];
    for (let i = 0; i < 60; i++) { // Was 40
        // ...
    }
    return particles;
}
```

### Disable Film Grain

```javascript
draw() {
    // ...
    // Comment out this line:
    // this.renderFilmGrain();
}
```

---

## TROUBLESHOOTING

### Judge Not Rendering

**Symptom:** Blank canvas or old programmatic judge
**Fix:** Check browser console for errors. Ensure scripts loaded in correct order.

```javascript
// Debug: Check if pixel art system loaded
console.log(typeof PixelArtCourtroom); // Should be "function"
console.log(window.AceAttorneyCourtroom === PixelArtCourtroom); // Should be true
```

### Performance Issues

**Symptom:** Low FPS, stuttering
**Fix:** Reduce particle count, disable film grain

```javascript
// In PixelArtRenderer constructor:
this.dustParticles = this.initializeDustParticles(20); // Reduce from 40

// In draw():
// this.renderFilmGrain(); // Comment out
```

### Sprites Look Blurry

**Symptom:** Fuzzy pixels instead of crisp
**Fix:** Ensure image smoothing disabled

```javascript
// In PixelArtRenderer constructor:
this.ctx.imageSmoothingEnabled = false;
this.ctx.webkitImageSmoothingEnabled = false;
this.ctx.mozImageSmoothingEnabled = false;
this.ctx.msImageSmoothingEnabled = false;
```

### PNG Sprites Not Loading

**Symptom:** Console errors about missing images
**Fix:** Check file paths, ensure PNG files exist

```javascript
// Add error handling in loadAssets:
async loadAssets() {
    try {
        // ... load images ...
    } catch (error) {
        console.warn('PNG sprites not found, using procedural fallback');
        // Fallback to procedural rendering works automatically
    }
}
```

---

## TESTING CHECKLIST

- [ ] Judge renders on screen
- [ ] Patience updates change sprite (0 → 50 → 100)
- [ ] Blinking animation triggers randomly
- [ ] Breathing animation (subtle vertical movement)
- [ ] Gavel appears when patience ≥ 61
- [ ] Gavel strike shows impact flash
- [ ] Screen shakes at high anger
- [ ] Red overlay increases with patience
- [ ] Dust particles float across screen
- [ ] Film grain animates
- [ ] Background layers render correctly
- [ ] No console errors
- [ ] 60fps maintained
- [ ] Works on mobile/tablet

---

## PERFORMANCE TARGETS

- **Desktop:** 60fps @ 1920x1080
- **Mobile:** 30fps @ 1280x720
- **Memory:** < 50MB total
- **Load Time:** < 500ms for all assets

---

## FUTURE ENHANCEMENTS

### Parallax Scrolling

```javascript
// Add subtle camera movement
draw() {
    const parallaxX = Math.sin(this.time * 0.1) * 5;
    const parallaxY = Math.cos(this.time * 0.15) * 3;

    this.background.render(this.ctx, { x: parallaxX, y: parallaxY });
}
```

### Dynamic Lighting

```javascript
// Add pulsing desk lamp
renderLightRays() {
    const lampPulse = Math.sin(this.time) * 0.02 + 1.0;
    this.lightRays[0].opacity *= lampPulse;
    // ... existing code ...
}
```

### More Expressions

Add to `judge-sprite-data.js`:
- Confused
- Sleeping
- Shocked
- Smirking

---

## CONTACT

**Issues:** Report bugs in game's GitHub Issues
**Questions:** Check PIXEL_ART_GUIDE.md for full documentation
**Sprites:** See SPRITE_REFERENCE.md for visual reference

---

**Last Updated:** 2025-10-19
**Version:** 1.0.0
**Status:** Ready for Integration
