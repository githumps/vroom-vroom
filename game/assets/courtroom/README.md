# Courtroom Pixel Art Assets

**Disco Elysium-inspired Judge Hardcastle courtroom scene**
**Created:** 2025-10-19
**Status:** Ready for integration

---

## Quick Start

1. Add scripts to `index.html`:
```html
<script src="assets/courtroom/judge-sprite-data.js"></script>
<script src="assets/courtroom/courtroom-background-data.js"></script>
<script src="assets/courtroom/paperwork-ui-data.js"></script>
<script src="systems/courtroom-pixel-renderer.js"></script>
```

2. That's it! System automatically replaces existing courtroom rendering.

---

## What's Included

### Code Files
- **judge-sprite-data.js** - Judge Hardcastle sprites (6 anger states, animations)
- **courtroom-background-data.js** - Courtroom scene (5 parallax layers)
- **paperwork-ui-data.js** - Bureaucratic form rendering
- **courtroom-pixel-renderer.js** - Main rendering engine (in /systems/)

### Documentation
- **PIXEL_ART_GUIDE.md** - Complete specifications (15 KB, ~74 pages)
- **SPRITE_REFERENCE.md** - ASCII art visual reference
- **INTEGRATION_GUIDE.md** - Setup and customization
- **DELIVERY_SUMMARY.md** - Full project deliverable report

### Empty Directories (Ready for PNG Sprites)
- **sprites/** - For Aseprite exports (judge, gavel)
- **backgrounds/** - For background layer PNGs
- **ui/** - For paperwork UI elements

---

## Features

- ✅ 6 judge anger states (Neutral → Volcanic)
- ✅ Blinking, breathing, gavel animations
- ✅ 5-layer parallax background
- ✅ Dust particles, light rays, film grain
- ✅ Complete paperwork form system
- ✅ Drop-in replacement (no code changes)
- ✅ Works with or without PNG sprites

---

## Documentation Guide

**Start here:**
1. `DELIVERY_SUMMARY.md` - Project overview and status
2. `INTEGRATION_GUIDE.md` - How to integrate (5 minutes)
3. `PIXEL_ART_GUIDE.md` - Full technical specs
4. `SPRITE_REFERENCE.md` - Visual layouts

**For pixel artists:**
- Follow `PIXEL_ART_GUIDE.md` color palette
- Use `SPRITE_REFERENCE.md` for layouts
- Create sprites in Aseprite
- Export to `/sprites/` directory

---

## File Sizes

| File | Size | Purpose |
|------|------|---------|
| judge-sprite-data.js | 9.8 KB | Judge sprites |
| courtroom-background-data.js | 11.2 KB | Background |
| paperwork-ui-data.js | 13.5 KB | Forms/UI |
| courtroom-pixel-renderer.js | 8.9 KB | Renderer |
| **Total Code** | **43.4 KB** | All systems |

---

## Style

**Disco Elysium Aesthetic:**
- Painterly pixel art (not geometric)
- Limited palette (30 colors)
- Bureaucratic decay (aged, worn)
- Oppressive atmosphere (warm lighting, deep shadows)
- Expressive minimalism (emotion through few pixels)

---

## Support

- **Issues:** Check `INTEGRATION_GUIDE.md` troubleshooting
- **Questions:** See `PIXEL_ART_GUIDE.md` for full docs
- **Customization:** All code is open and documented

---

**Created by:** Isometric Pixel Artist Agent
**Version:** 1.0.0
**Status:** ✅ Production Ready
