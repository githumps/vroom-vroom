# NAIL ART DECORATION SYSTEM - QUICK REFERENCE

**Version:** 1.0.0
**Target:** v1.6.0
**Status:** Design Complete

---

## 🎨 COLOR PALETTE (15 Colors)

### Classic Glamour
```javascript
'#FF1493' // Hot Pink
'#FF0000' // Brilliant Red
'#FFD700' // Gold
'#FFFFFF' // Pure White
'#000000' // Midnight Black
```

### Dystopian Muted
```javascript
'#8B7355' // Rust Brown
'#6B8E23' // Olive Drab
'#708090' // Slate Gray
'#4682B4' // Steel Blue
'#8B0000' // Dark Red
```

### Pastel Pretty
```javascript
'#FFB6C1' // Light Pink
'#E6E6FA' // Lavender
'#98FB98' // Pale Green
'#FFE4B5' // Peach
'#B0E0E6' // Powder Blue
```

---

## 💎 SPECIAL EFFECTS (5 Options)

```javascript
'chrome'      // Metallic reflective finish
'iridescent'  // Color-changing shimmer
'holographic' // Rainbow sparkle effect
'matte'       // Non-shiny, flat appearance
'glossy'      // Extra shiny, wet-look finish
```

---

## 🎨 PATTERNS (3 Options)

```javascript
'solid'  // Single base color (DEFAULT)
'french' // Base color + white/contrasting tip
'ombre'  // Gradient from base to lighter/darker shade
```

---

## ✨ STICKERS (20 Types)

### Stars (5)
```javascript
'star-gold', 'star-silver', 'star-small', 'star-sparkle', 'star-rainbow'
```

### Hearts (4)
```javascript
'heart-red', 'heart-pink', 'heart-broken', 'heart-outline'
```

### Gems & Bling (5)
```javascript
'gem-diamond', 'gem-ruby', 'gem-emerald', 'gem-sapphire', 'gem-cluster'
```

### Shapes (3)
```javascript
'circle-gold', 'square-silver', 'triangle-rainbow'
```

### Thematic (3)
```javascript
'flower-tiny', 'moon-crescent', 'skull-tiny'
```

---

## 👮 GUARD PREFERENCES

| Guard | Colors | Effects | Patterns | Stickers | Special Bonus |
|-------|--------|---------|----------|----------|---------------|
| **Jenkins** | Red, Black | Matte | Solid | None (0) | No stickers = +1 |
| **Martinez** | White, Gold, Pink | Chrome, Glossy | French, Solid | Gems, Flowers (3) | Symmetry = +1 |
| **Chen** | Black, Dark Purple, Gray | Matte | Solid | None (0) | Speed <2min = +1 |
| **Thompson** | Pastels | Glossy, Iridescent | Ombre, French | Hearts, Stars (5) | 15+ stickers = +1 |
| **Rodriguez** | Hot Pink, Gold, Red | Holographic, Chrome | Ombre, French | All (5) | Glitter + Holo = +2 |

---

## 🏆 REWARD STRUCTURE

### Base Reward
```
1 token = Completion (guaranteed)
```

### Bonus Tokens (0-3)
```
+1 = All 10 nails decorated (completeness)
+1 = 60%+ nails use favorite colors (preference)
+1 = Guard-specific bonus met (see table above)
```

### Maximum
```
4 tokens per session (1 base + 3 bonus)
```

### Diminishing Returns
```
Decorations 1-3:   100% rewards
Decorations 4-6:    75% rewards
Decorations 7-10:   50% rewards
Decorations 11+:    25% rewards (minimum 1 token)
```

---

## 💰 ECONOMY

| Item | Value |
|------|-------|
| **Cost** | 20 credits |
| **Time** | 45 minutes (0.03 days) |
| **Cooldown** | 24 hours per guard |
| **Guards Available** | 5 (rotate between them) |
| **Max Tokens/Day** | ~10 (5 guards x 2 avg) |

---

## 📊 DATA STRUCTURES

### Nail Object
```javascript
{
    baseColor: '#FF1493',        // Color hex
    specialEffect: 'chrome',     // Effect type or null
    pattern: 'solid',            // Pattern type
    stickers: [                  // Array of stickers (max 5)
        {
            type: 'star-gold',
            position: {x: 15, y: 10},
            size: 'small'
        }
    ],
    glitter: true                // Boolean
}
```

### Guard Hand Data
```javascript
guardHands: {
    jenkins: {
        lastDecorated: 1729350000000,    // Timestamp
        decorationCount: 3,              // Total sessions
        totalTokensEarned: 10,           // Lifetime tokens
        currentDesign: {
            version: "1.0",
            timestamp: 1729350000000,
            leftHand: [nail0, nail1, nail2, nail3, nail4],
            rightHand: [nail0, nail1, nail2, nail3, nail4],
            decorationTime: 145,         // Seconds
            tokensEarned: 4,
            satisfactionLevel: 'delighted'
        }
    },
    // ... martinez, chen, thompson, rodriguez
}
```

---

## 🎮 GAME FLOW

```
Prison Menu
  ↓
"GIVE MANICURE TO GUARD"
  ↓
Guard Selection Screen
  ├─ View current designs
  ├─ Check cooldowns
  └─ Select guard (cost: 20 credits)
  ↓
Decoration Interface
  ├─ Select nail (1-10)
  ├─ Apply base color
  ├─ Add effect (optional)
  ├─ Choose pattern (optional)
  ├─ Add stickers (optional, max 5)
  └─ Toggle glitter (optional)
  ↓
Save Design
  ↓
Guard Reaction
  ├─ Personality dialogue
  ├─ Reward breakdown
  └─ Award 1-4 tokens
  ↓
Return to Prison Menu
```

---

## 🖼️ UI COMPONENTS

### Main Screens
```
1. Guard Selection Screen (id="guardSelection")
2. Nail Art Decoration Interface (id="nailArtDecoration")
3. Guard Reaction Screen (id="guardReaction")
4. Manicure Gallery (id="manicureGallery")
```

### Decoration Tools (Left Panel)
```
1. Color Palette (15 swatches, 5x3 grid)
2. Effect Selector (5 radio buttons)
3. Pattern Selector (3 radio buttons)
4. Sticker Palette (20 icons, 4x5 grid)
5. Glitter Toggle (ON/OFF buttons)
```

### Canvas (Center)
```
Canvas: 800x600 (desktop), 400x300 (mobile)
Left hand: X:200, Y:300
Right hand: X:600, Y:300
10 clickable nails (5 per hand)
```

### Control Buttons (Bottom)
```
[UNDO] [CLEAR NAIL] [CLEAR ALL] [PREVIEW] [SAVE] [CANCEL]
```

---

## 🔧 INTEGRATION CHECKLIST

### Files to Create
- [ ] `game/systems/guard-nail-art.js` (~800 lines)
- [ ] `game/assets/nail-art/` directory (sprites, atlas, effects)
- [ ] `game/styles/nail-art.css` (or add to main.css)

### Files to Modify
- [ ] `game/core/game.js` (player object, save/load, prison menu)
- [ ] `game/index.html` (add 4 new screens, script tag)
- [ ] `SYSTEMS.md` (add nail art section)
- [ ] `CHANGELOG.md` (add v1.6.0 entry)
- [ ] `claude.md` (update version to v1.6.0)

### Player Object Extension
```javascript
// Add to player object in game.js
guardHands: {
    jenkins: { lastDecorated: null, decorationCount: 0, totalTokensEarned: 0, currentDesign: null },
    martinez: { lastDecorated: null, decorationCount: 0, totalTokensEarned: 0, currentDesign: null },
    chen: { lastDecorated: null, decorationCount: 0, totalTokensEarned: 0, currentDesign: null },
    thompson: { lastDecorated: null, decorationCount: 0, totalTokensEarned: 0, currentDesign: null },
    rodriguez: { lastDecorated: null, decorationCount: 0, totalTokensEarned: 0, currentDesign: null }
}
```

### Save/Load Extension
```javascript
// In saveGame()
saveData.guardHands = this.player.guardHands;

// In loadGame()
if (saveData.guardHands) {
    this.player.guardHands = saveData.guardHands;
} else {
    this.initializeGuardHands();
}
```

---

## 🧪 TESTING COMMANDS

**Type "TEST" on main menu, then:**

```javascript
// Test nail art system
game.loadNailArtSystem();
game.nailArtSystem.startDecorationSession('martinez');

// Award tokens for testing
game.player.favorTokens += 10;

// Reset cooldowns
Object.keys(game.player.guardHands).forEach(key => {
    game.player.guardHands[key].lastDecorated = null;
});

// Give perfect Martinez design
game.player.guardHands.martinez.currentDesign = {
    leftHand: [/* perfect design */],
    rightHand: [/* perfect design */],
    tokensEarned: 4,
    satisfactionLevel: 'delighted'
};
```

---

## ⚡ PERFORMANCE TARGETS

### Desktop (1920x1080, 60 FPS)
- Canvas render: <16ms per frame
- Decoration apply: <50ms
- Save: <200ms
- Load: <300ms

### Mobile (iPhone 12, 30 FPS)
- Canvas render: <33ms per frame
- Decoration apply: <100ms
- Save: <400ms
- Load: <600ms

---

## 🐛 COMMON ISSUES

| Issue | Cause | Solution |
|-------|-------|----------|
| Assets fail to load | Incorrect paths | Verify file structure matches asset loading |
| Canvas slow/laggy | Too many draw calls | Implement dirty rectangles, cache static |
| Save doesn't persist | Missing guardHands in saveData | Verify saveGame() includes property |
| Guards don't give bonus | Preference logic error | Debug calculateBonusTokens() |
| Touch unresponsive | Coordinate scaling issue | Fix touch event to canvas conversion |
| Stickers don't show | Atlas not loaded | Check sticker atlas JSON metadata |
| Gallery black canvas | Rendering before load | Add await for asset loading |
| Memory leak | Undo stack unlimited | Cap at MAX_UNDO_STACK |

---

## 📚 FULL DOCUMENTATION

**Complete Design Document:**
`/Users/ccqw/Developer/vroom-vroom/docs/systems/NAIL_ART_DECORATION_SYSTEM.md`

**Integration Guide:**
`/Users/ccqw/Developer/vroom-vroom/docs/integration/NAIL_ART_INTEGRATION_GUIDE.md`

**Quick Reference (This File):**
`/Users/ccqw/Developer/vroom-vroom/docs/systems/NAIL_ART_QUICK_REFERENCE.md`

---

## 🚀 NEXT STEPS

1. **Coordinate with isometric-pixel-artist agent** for asset delivery
2. **Implement GuardNailArtSystem class** (~800 lines)
3. **Create HTML/CSS UI elements** (4 screens)
4. **Extend player object and save/load** (backwards compatible)
5. **Integrate with prison menu** (2 buttons)
6. **Test all features** (unit tests + manual scenarios)
7. **Update documentation** (SYSTEMS.md, CHANGELOG.md, claude.md)
8. **Version bump to v1.6.0** and deploy

**Estimated Time:** 12-16 hours

---

**Document Version:** 1.0.0
**Created:** 2025-10-19
**Status:** Ready for Implementation
