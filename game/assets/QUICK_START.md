# Pixel Art Assets - Quick Start Guide

**⏱️ 5-Minute Integration** | **⭐ Professional Pixel Art UI**

---

## 🚀 Fastest Integration Path

### 1. Generate Assets (1 minute)
```bash
# Open in browser:
/game/assets/generate-assets.html

# Auto-generates 6 pixel art sprites on page load
```

### 2. Copy Base64 Strings (2 minutes)
Click "Download JSON Manifest" → Open JSON file → Copy all `dataUrl` values

### 3. Paste Into CSS (2 minutes)
In `index.html` `<style>` section, replace existing styles:

```css
/* Main Menu Background */
#mainMenu {
    background-image: url('[PASTE_MENU_BG_DATA_URL]');
    background-size: cover;
    background-position: center;
}

/* Logo */
#mainMenu h1 {
    background-image: url('[PASTE_LOGO_DATA_URL]');
    width: 400px;
    height: 80px;
    text-indent: -9999px;
}

/* Buttons */
button {
    background-image: url('[PASTE_BUTTON_DATA_URL]');
    background-size: 200px 150px;
    background-position: 0 0;
}
button:hover { background-position: 0 -50px; }
button:active { background-position: 0 -100px; }

/* Pixel-Perfect Rendering */
#mainMenu h1, button, .icon {
    image-rendering: pixelated;
}
```

### 4. Test (30 seconds)
Open `index.html` in browser → Verify background, logo, buttons work

---

## 📦 What You Get

✅ Main menu cyberpunk cityscape background
✅ Animated neon logo
✅ 3-state button sprites (normal/hover/active)
✅ 6 UI icons (save, load, settings, etc.)
✅ Character preview sprite
✅ UI frame borders

**Total time:** 5 minutes
**Total size:** ~47KB (all sprites base64-encoded)
**Performance:** Zero impact

---

## 📚 Full Documentation

- **Complete Guide:** `/docs/integration/PIXEL_ART_INTEGRATION.md`
- **Step-by-Step:** `/docs/integration/PIXEL_ART_INTEGRATION_CHECKLIST.md`
- **Visual Reference:** `/docs/systems/PIXEL_ART_VISUAL_REFERENCE.md`
- **This Folder:** `/game/assets/README.md`

---

## 🎨 Customization

### Change Colors
Edit `pixel-art-generator.js`:
```javascript
this.palette.neonPink = '#YOUR_COLOR';
```
Then regenerate using `generate-assets.html`

### Create Variations
```javascript
const gen = new PixelArtGenerator();
gen.palette.neonPink = '#ff0099';
const variant = gen.generateMainMenuBackground();
console.log(variant.dataUrl); // Copy this base64
```

---

## ⚡ Pro Tips

1. **Base64 too long?** Extract to external PNG files instead
2. **Blurry pixels?** Add `image-rendering: pixelated` CSS
3. **Need mobile?** Use responsive breakpoints in CSS
4. **Want animations?** Logo glow and character breathing included

---

## 🆘 Common Issues

**Background not showing**
→ Check base64 string is complete (starts with `data:image/png;base64,`)

**Buttons not changing on hover**
→ Verify `background-position` CSS is correct

**Pixels look blurry**
→ Add `image-rendering: pixelated` to element

---

**Agent:** isometric-pixel-artist | **Date:** 2025-10-19 | **Version:** 1.0
