# VROOM VROOM - Pixel Art Integration Guide

**Version:** 1.0
**Created:** 2025-10-19
**Agent:** isometric-pixel-artist
**Status:** Ready for Integration

---

## Overview

This document provides complete integration instructions for the professional pixel art assets created for VROOM VROOM's main menu and character creation screens.

**Style:** Vibey isometric pixel art with warm cyberpunk aesthetic (pinks, purples, teals)
**Quality:** Indie game professional (Stardew Valley / Celeste vibes)
**Format:** Base64-encoded PNG sprites + CSS

---

## File Structure

```
game/
├── assets/
│   ├── pixel-art-generator.js      # Procedural pixel art generator
│   ├── generate-assets.html         # Asset generation tool
│   └── pixel-art-styles.css         # Generated CSS (output)
│
├── index.html                       # Main game HTML (MODIFY)
└── game.js                          # Main game code
```

---

## Step 1: Generate Assets

### Option A: Use the Generation Tool (RECOMMENDED)

1. Open `game/assets/generate-assets.html` in your browser
2. Click "Generate All Assets" button
3. Review previews of all generated pixel art
4. Click "Copy CSS Code" to get integration CSS
5. Click "Download JSON Manifest" to save asset data

### Option B: Run in Browser Console

```javascript
// In browser console:
const generator = new PixelArtGenerator();

// Generate individual assets:
const menuBg = generator.generateMainMenuBackground();
const logo = generator.generateLogo();
const uiFrame = generator.generateUIFrame();
const button = generator.generateButton();
const icons = generator.generateIcons();
const character = generator.generateCharacterSprite(2, 'short', '#3d2f1f');

// Export manifest:
const manifest = generator.exportManifest();
console.log(manifest);
```

---

## Step 2: Add CSS to index.html

Add the generated CSS to your `<style>` section in `game/index.html`:

```html
<style>
    /* EXISTING STYLES... */

    /* ===== PIXEL ART INTEGRATION ===== */

    /* Color Palette */
    :root {
        --vroom-sky-dark: #1a0f2e;
        --vroom-sky-mid: #2d1b3d;
        --vroom-sky-light: #4a2d5c;
        --vroom-neon-pink: #ff6ec7;
        --vroom-neon-purple: #bf5af2;
        --vroom-neon-teal: #52ffe8;
        --vroom-neon-yellow: #ffd700;
        --vroom-ui-dark: #1f1833;
        --vroom-ui-mid: #332d47;
        --vroom-ui-light: #4a4363;
    }

    /* Main Menu Background */
    #mainMenu {
        background-image: url('[INSERT BASE64 DATA URL]');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
    }

    /* Atmospheric overlay */
    #mainMenu::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
            circle at center,
            rgba(255, 110, 199, 0.1) 0%,
            transparent 70%
        );
        pointer-events: none;
    }

    /* Logo replacement */
    #mainMenu h1 {
        background-image: url('[INSERT LOGO BASE64]');
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        width: 400px;
        height: 80px;
        margin: 20px auto;
        text-indent: -9999px; /* Hide text, show pixel art */
        filter: drop-shadow(0 0 20px var(--vroom-neon-pink));
    }

    /* Pixel-perfect rendering */
    .pixel-art,
    #mainMenu h1,
    button {
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
    }

    /* UI Frame borders (9-slice) */
    .form-container {
        border-image-source: url('[INSERT FRAME BASE64]');
        border-image-slice: 16 16 16 16 fill;
        border-image-width: 16px;
        border-image-repeat: stretch;
        border-width: 16px;
        border-style: solid;
        background: var(--vroom-ui-dark);
    }

    /* Button sprite states */
    button {
        background-image: url('[INSERT BUTTON BASE64]');
        background-size: 200px 150px;
        background-position: 0 0; /* Normal */
        background-repeat: no-repeat;
        width: 200px;
        height: 50px;
        border: none;
        color: #ff6ec7;
        text-shadow: 0 0 10px #ff6ec7;
        font-family: 'Courier New', monospace;
        font-size: 1em;
        font-weight: bold;
        cursor: pointer;
        transition: background-position 0.1s;
    }

    button:hover {
        background-position: 0 -50px; /* Hover state */
        color: #ffffff;
    }

    button:active {
        background-position: 0 -100px; /* Active state */
        color: var(--vroom-ui-dark);
    }

    /* Icon sprites */
    .icon {
        display: inline-block;
        width: 32px;
        height: 32px;
        background-image: url('[INSERT ICONS BASE64]');
        background-repeat: no-repeat;
        vertical-align: middle;
        margin-right: 8px;
        image-rendering: pixelated;
    }

    .icon-save { background-position: 0 0; }
    .icon-load { background-position: -32px 0; }
    .icon-settings { background-position: -64px 0; }
    .icon-export { background-position: -96px 0; }
    .icon-import { background-position: -128px 0; }
    .icon-credits { background-position: -160px 0; }

    /* Character preview (creation screen) */
    #characterPreview {
        width: 64px;
        height: 64px;
        background-image: url('[INSERT CHARACTER BASE64]');
        background-size: contain;
        background-repeat: no-repeat;
        margin: 20px auto;
        image-rendering: pixelated;
    }

    /* Character creation screen */
    #characterCreation {
        background: linear-gradient(
            180deg,
            var(--vroom-sky-dark) 0%,
            var(--vroom-sky-mid) 50%,
            var(--vroom-sky-light) 100%
        );
    }
</style>
```

---

## Step 3: Add Character Preview to Creation Screen

Add this HTML to the character creation screen (around line 902 in index.html):

```html
<div class="form-field">
    <label>Character Preview:</label>
    <div id="characterPreview" class="pixel-art"></div>
</div>
```

---

## Step 4: Add Icons to Buttons (Optional)

Update your menu buttons to include icons:

```html
<!-- MAIN MENU -->
<div id="mainMenu" class="screen active">
    <h1>VROOM VROOM</h1>
    <p style="font-size: 1.2em; margin-bottom: 10px;">A game about freedom, bureaucracy, and consequences</p>
    <p style="font-size: 0.9em; color: #888; margin-bottom: 30px;">Version <span id="gameVersion">1.0.0</span></p>

    <button onclick="game.startNewGame()">
        <span class="icon icon-save"></span>
        NEW GAME
    </button>
    <button onclick="game.loadGame()">
        <span class="icon icon-load"></span>
        LOAD GAME
    </button>
    <button onclick="game.exportSaveCode()">
        <span class="icon icon-export"></span>
        EXPORT SAVE CODE
    </button>
    <button onclick="game.showImportModal()">
        <span class="icon icon-import"></span>
        IMPORT SAVE CODE
    </button>
    <button onclick="game.showModal('settingsModal')">
        <span class="icon icon-settings"></span>
        SETTINGS
    </button>
    <button onclick="game.showScreen('credits')">
        <span class="icon icon-credits"></span>
        CREDITS
    </button>
</div>
```

---

## Step 5: Update Character Preview Dynamically

Add this to `game.js` in the `updateCharacterPreview()` method:

```javascript
updateCharacterPreview() {
    // Get character settings
    const skinTone = document.getElementById('skinTone').value;
    const hairStyle = document.getElementById('hairStyle').value;
    const hairColor = document.getElementById('hairColor').value;

    // Generate character sprite
    const generator = new PixelArtGenerator();
    const sprite = generator.generateCharacterSprite(
        parseInt(skinTone),
        hairStyle,
        hairColor
    );

    // Update preview
    const preview = document.getElementById('characterPreview');
    if (preview) {
        preview.style.backgroundImage = `url(${sprite.dataUrl})`;
    }
}
```

---

## Asset Details

### Main Menu Background (800x600px)
- Isometric cityscape at dusk
- Layered depth (background buildings, street, foreground)
- Warm gradient sky (dark purple → pink → orange)
- Pixel-perfect stars
- Neon window lights
- Atmospheric glow overlay

### VROOM VROOM Logo (400x80px)
- Custom pixel font (8x8 characters)
- Dual-layer neon effect (pink + teal)
- Glowing shadow effect
- Professional indie game quality

### UI Frame (48x48px 9-slice)
- Corner decorations with neon accents
- Cyberpunk border styling
- Seamless tiling
- Compatible with CSS border-image

### Button States (200x50px × 3)
- Normal: Dark background, neon border
- Hover: Lighter background, brighter glow
- Active: Inverted colors (neon fill)
- Pixel-perfect corner accents

### Icons (32x32px × 6)
- Save (floppy disk)
- Load (folder)
- Settings (gear)
- Export (arrow up)
- Import (arrow down)
- Credits (star)
- Neon color coded

### Character Sprite (64x64px)
- Isometric pixel person
- Customizable skin tone (6 options)
- Hair styles (short, long, bald, etc.)
- Prison jumpsuit orange
- Simple, readable design

---

## Color Palette Reference

```javascript
{
    // Sky/Background
    skyDark: '#1a0f2e',
    skyMid: '#2d1b3d',
    skyLight: '#4a2d5c',
    horizonPink: '#8b4d6f',
    horizonOrange: '#c96a5e',

    // Neon Accents
    neonPink: '#ff6ec7',
    neonPurple: '#bf5af2',
    neonTeal: '#52ffe8',
    neonYellow: '#ffd700',

    // Buildings
    buildingDark: '#2a1f3d',
    buildingMid: '#4a3d5c',
    buildingLight: '#6b5d7c',

    // UI Elements
    uiFrameDark: '#1f1833',
    uiFrameMid: '#332d47',
    uiFrameLight: '#4a4363',

    // Character Skin Tones
    skin1: '#ffdfc4', // Lightest
    skin2: '#e8b892',
    skin3: '#c98b6f',
    skin4: '#a66e4a',
    skin5: '#7d5436',
    skin6: '#5a3825'  // Darkest
}
```

---

## Performance Considerations

### Optimization Tips:
1. **Base64 vs External Files**: Base64 is embedded in CSS (no additional HTTP requests), but increases CSS file size. For production, consider using external PNG files.

2. **Image Rendering**: The `image-rendering: pixelated` CSS ensures pixel-perfect scaling without blur.

3. **Sprite Sheets**: Icons and button states use sprite sheets to minimize assets.

4. **Lazy Loading**: Character preview is generated on-demand only when creation screen is visible.

### Browser Compatibility:
- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support (use -webkit- prefix)
- ✅ Mobile browsers: Full support

---

## Testing Checklist

### Visual Tests:
- [ ] Main menu background loads correctly
- [ ] Logo displays with neon glow effect
- [ ] Buttons show all 3 states (normal, hover, active)
- [ ] Icons appear next to button text
- [ ] UI frames render with 9-slice borders
- [ ] Character preview updates on customization
- [ ] Pixel art renders sharp (no blurring)

### Responsive Tests:
- [ ] Background scales on different screen sizes
- [ ] Logo remains centered
- [ ] Buttons stack properly on mobile
- [ ] Icons scale appropriately
- [ ] Frame borders don't break

### Performance Tests:
- [ ] No lag when hovering buttons
- [ ] Character preview updates smoothly
- [ ] CSS loads without blocking
- [ ] No console errors

---

## Troubleshooting

### Issue: Pixel art looks blurry
**Solution:** Add `image-rendering: pixelated` to affected elements

### Issue: Background doesn't cover full screen
**Solution:** Use `background-size: cover` and check viewport meta tag

### Issue: Icons not showing
**Solution:** Verify base64 data URL is complete and sprite positions are correct

### Issue: Button text invisible
**Solution:** Remove `text-indent: -9999px` if you want visible text over sprite

### Issue: 9-slice border looks wrong
**Solution:** Check `border-image-slice` values match sprite corner size (16px)

---

## Future Enhancements

### Planned Additions:
1. **Animated sprites** - Character idle animation, blinking lights
2. **Weather effects** - Pixel rain, snow overlay
3. **Parallax scrolling** - Multi-layer depth in menu background
4. **Dynamic time-of-day** - Sky gradient changes based on system time
5. **Loading animation** - Pixel art spinner/progress bar
6. **Achievement badges** - Pixel art icons for game milestones

### Style Variations:
- Alternate color palettes (cool blues, warm oranges, monochrome)
- Seasonal themes (winter, summer, etc.)
- Event-specific backgrounds (holidays, updates)

---

## Code Generation Reference

All pixel art is generated procedurally using the `PixelArtGenerator` class. This means:

✅ **Consistent style** - All assets follow the same design rules
✅ **Modifiable** - Change palette colors, sizes, styles in code
✅ **Reproducible** - Re-generate assets anytime with same parameters
✅ **Scalable** - Create variations without manual pixel work

**Regeneration Command:**
```javascript
const gen = new PixelArtGenerator();
gen.palette.neonPink = '#ff0099'; // Modify palette
gen.generateAllAssets(); // Regenerate with new colors
```

---

## Credits

**Created by:** isometric-pixel-artist agent
**Date:** 2025-10-19
**Project:** VROOM VROOM v1.5.0
**Style:** Vibey isometric cyberpunk pixel art
**Inspired by:** Stardew Valley, Celeste, Disco Elysium

---

**Next Steps:**
1. Generate assets using `generate-assets.html`
2. Copy base64 data URLs from manifest
3. Replace placeholders in CSS code
4. Add to `index.html`
5. Test in browser
6. Adjust colors/styles as needed

**Questions? Check:**
- `pixel-art-generator.js` source code for customization
- Browser console for generation logs
- Generated manifest JSON for asset metadata
