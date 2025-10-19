# NAIL ART DECORATION SYSTEM - COMPLETE GAME DESIGN DOCUMENT

**Version:** 1.0.0 (Design Phase)
**Target Version:** v1.6.0
**Status:** 🟡 DESIGN COMPLETE - PENDING IMPLEMENTATION
**Last Updated:** 2025-10-19
**Designer:** game-dev-specialist agent
**Artist Collaboration:** isometric-pixel-artist agent (visual assets)

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Design Philosophy](#design-philosophy)
4. [Gameplay Workflow](#gameplay-workflow)
5. [Decoration Tools & Assets](#decoration-tools--assets)
6. [Guard Personality System](#guard-personality-system)
7. [Data Persistence Architecture](#data-persistence-architecture)
8. [Reward & Economy Balance](#reward--economy-balance)
9. [UI/UX Specifications](#uiux-specifications)
10. [Technical Implementation Plan](#technical-implementation-plan)
11. [Integration Code Snippets](#integration-code-snippets)
12. [Testing & Validation](#testing--validation)
13. [Future Expansion Opportunities](#future-expansion-opportunities)

---

## EXECUTIVE SUMMARY

Transform the current basic nail-cleaning mini-game into a **comprehensive nail art decoration system** that allows players to create gorgeous, persistent nail designs for prison guards. This system adds creative expression, long-term progression, and absurd charm to the prison experience.

### Key Features
- **Full decoration interface** with 15+ base colors, 20+ stickers, 5+ special effects
- **Persistent designs** saved per guard and viewable throughout game
- **Enhanced rewards** (1-4 favor tokens based on quality/preferences)
- **Guard personality preferences** (each guard has favorite colors/styles)
- **Manicure gallery** to view all decorated guard hands
- **Multiple sessions** per guard with diminishing returns

### Design Pillars
1. **Creative Expression** - Players design unique nail art
2. **Persistence** - Designs saved and referenced throughout game
3. **Personality** - Each guard reacts uniquely to decorations
4. **Balance** - Fair favor token economy with progression curve
5. **Absurdity** - Gorgeous nail art in dystopian driving prison

---

## SYSTEM OVERVIEW

### Current System (v1.4.0)
Located in `/game/systems/guard-manicure-visual.js`

**Basic Mechanics:**
- Click dirt spots to clean 10 nails
- Avoid clicking skin (3 mistakes = guard injured)
- Injured guards exploitable at clinic
- Earn 1 favor token on success

**Limitations:**
- No creative expression
- No persistence (decorations don't save)
- Binary success/failure (no quality grades)
- Single interaction per guard
- No personality-based preferences

### New System (v1.6.0)
**Enhanced Mechanics:**
- Full nail decoration canvas
- 40+ decoration options (colors, effects, stickers)
- Designs saved per guard permanently
- Quality-based rewards (1-4 tokens)
- Multiple sessions per guard
- Guard-specific preferences and reactions
- Gallery view for all decorated hands

**Technical Architecture:**
- New file: `guard-nail-art.js` (~800 lines)
- New data structure: `player.guardHands` (decoration storage)
- Integration: Prison menu, guard dialogues, save/load system
- Rendering: Isometric pixel art hands (collaboration with artist agent)

---

## DESIGN PHILOSOPHY

### Tone & Atmosphere
**Absurd Glamour in Dystopian Prison**

The nail art system embodies VROOM VROOM's core absurdity: in a world where driving is illegal and prisoners serve time for "reckless acceleration," creating fabulous nail art for guards is both ridiculous and delightful. This is peak Disco Elysium energy - serious craftsmanship applied to absurd contexts.

### Player Psychology
**Intrinsic vs. Extrinsic Motivation**

1. **Intrinsic Motivation (Creative Expression)**
   - Players enjoy designing beautiful nail art
   - Satisfaction from matching colors/stickers
   - Pride in viewing their created designs later

2. **Extrinsic Motivation (Rewards)**
   - Favor tokens enable gameplay benefits
   - Guard reactions provide immediate feedback
   - Collection aspect (decorate all 5 guards)

3. **Social Motivation (Personality Matching)**
   - Learning guard preferences creates mastery
   - Satisfaction from "reading" guard personalities
   - Narrative integration (guards reference their nails)

### Design Goals
1. **Depth without Complexity** - Easy to learn, satisfying to master
2. **Persistence Creates Meaning** - Designs matter beyond the moment
3. **Personality Creates Connection** - Guards feel unique and memorable
4. **Balance Prevents Exploitation** - Fair economy with diminishing returns
5. **Visual Delight** - Gorgeous nail art contrasts with prison bleakness

---

## GAMEPLAY WORKFLOW

### Phase 1: Guard Selection
```
Prison Menu
  ↓
Click "GIVE MANICURE TO GUARD"
  ↓
Guard Selection Screen
  ├─ Guard Jenkins (Gruff, strict)
  ├─ Guard Martinez (Perfectionist, enthusiastic)
  ├─ Guard Chen (Impatient, dismissive)
  ├─ Guard Thompson (Chatty, appreciative)
  └─ Guard Rodriguez (Paranoid, fashion-forward)
  ↓
View Guard's Current Nail State
  ├─ If never decorated: "Unkempt, dirty nails"
  ├─ If previously decorated: Show mini preview of current design
  └─ Show decoration count: "Manicures given: 3"
  ↓
Confirm Selection (Cost: 20 credits, Time: 45 minutes)
```

**Design Notes:**
- Guard selection shows current nail state (creates continuity)
- Preview mini-canvas shows last decoration (persistence visible)
- Cost increase (was free → 20 credits) balances enhanced rewards
- Time increase (30 min → 45 min) reflects complexity

### Phase 2: Nail Decoration Interface
```
Full-Screen Decoration Canvas
  ┌─────────────────────────────────────────────┐
  │  GUARD NAIL ART DECORATION                  │
  │  Guard: Martinez                            │
  ├────────┬────────────────────────────────────┤
  │ TOOLS  │  ISOMETRIC HANDS CANVAS (800x600)  │
  │        │                                     │
  │ COLORS │  [Left Hand]      [Right Hand]     │
  │ • Pink │                                     │
  │ • Gold │  Select nail → Apply decoration    │
  │ • Red  │  Highlighted nail shows current    │
  │        │  decoration in real-time           │
  │ EFFECT │                                     │
  │ Chrome │  Current Nail: Left Thumb           │
  │        │  Base: Pink   Effect: Chrome        │
  │ STICK  │  Stickers: Star (gold), Gem         │
  │ Stars  │                                     │
  │ Gems   │                                     │
  ├────────┴────────────────────────────────────┤
  │ [Undo] [Clear All] [Preview] [Save] [Cancel]│
  └─────────────────────────────────────────────┘
```

**Decoration Workflow:**
1. **Select Nail** - Click one of 10 nails to edit
2. **Apply Base Color** - Click color swatch from palette
3. **Add Special Effect** (Optional) - Chrome, Iridescent, Holographic
4. **Choose Pattern** (Optional) - French Tip, Ombre, Solid
5. **Add Stickers** (Optional) - Drag up to 5 stickers per nail
6. **Toggle Glitter** (Optional) - Sparkle overlay on entire nail
7. **Repeat** for all 10 nails (or subset)
8. **Preview Mode** - Rotate hands to view from different angles
9. **Save & Exit** - Commit decoration and proceed to guard reaction

**Quality Indicators:**
- **Incomplete Warning** - "Only 3/10 nails decorated. Continue anyway?"
- **Symmetry Suggestion** - "Left and right hands don't match. Martinez prefers symmetry."
- **Preference Hint** - "Rodriguez loves holographic effects!"

### Phase 3: Guard Reaction & Rewards
```
Guard Reaction Screen
  ↓
Guard appears with decorated hands visible
  ↓
Personality-based feedback dialogue
  ↓
Reward calculation displayed
  ├─ Base: 1 token (completion)
  ├─ Bonus: +1 token (all 10 nails decorated)
  ├─ Bonus: +1 token (special effects used)
  └─ Bonus: +1 token (guard preferences matched)
  ↓
Total: 1-4 Favor Tokens
  ↓
Guard Satisfaction Level
  ├─ DELIGHTED (4 tokens): Enthusiastic, suggests next session
  ├─ PLEASED (3 tokens): Appreciative, approves design
  ├─ SATISFIED (2 tokens): Neutral, acceptable work
  └─ TOLERANT (1 token): Minimal approval, could be better
  ↓
Design saved to player.guardHands[guardKey]
  ↓
Return to Prison Menu
```

**Guard Reaction Examples:**

**Jenkins (Gruff, prefers simple):**
- 4 Tokens: "Hmph. I'll admit it... these are perfect. Simple. Professional. I respect that."
- 1 Token: "Too flashy. I'm not some fashion model. But... I guess they're clean."

**Martinez (Perfectionist, enthusiastic):**
- 4 Tokens: "MAGNIFICO! Perfection! The symmetry! The colors! You are an ARTIST!"
- 1 Token: "Hmm. You tried, but... the ombre is uneven. The stickers are misaligned. Practice more."

**Chen (Impatient, dismissive):**
- 4 Tokens: "Finally. Fast work, good results. Didn't waste my time. Yeah, these look great."
- 1 Token: "Took you forever and they're just... whatever. They're fine. I guess."

**Thompson (Chatty, appreciative):**
- 4 Tokens: "OH MY GOSH THESE ARE AMAZING! You know, my sister does nails and she would LOVE this design! The little stars remind me of..."
- 1 Token: "Oh these are nice! Not my favorite color but I appreciate the effort! My cousin had nails like this once..."

**Rodriguez (Paranoid, fashion-forward):**
- 4 Tokens: "I... I'll admit these are GORGEOUS. You're not trying to poison me with the polish, right? No? Okay, these are FABULOUS."
- 1 Token: "What's your angle here? Are you trying to make me look bad? These are too plain!"

---

## DECORATION TOOLS & ASSETS

### Base Color Palette (15 Colors)
**Organized by theme:**

**Classic Glamour:**
1. `#FF1493` - Hot Pink (DeepPink)
2. `#FF0000` - Brilliant Red (Red)
3. `#FFD700` - Gold (Gold)
4. `#FFFFFF` - Pure White (White)
5. `#000000` - Midnight Black (Black)

**Dystopian Muted (VROOM VROOM palette):**
6. `#8B7355` - Rust Brown
7. `#6B8E23` - Olive Drab (Muted green)
8. `#708090` - Slate Gray
9. `#4682B4` - Steel Blue (Faded blue)
10. `#8B0000` - Dark Red (Dried blood)

**Pastel Pretty:**
11. `#FFB6C1` - Light Pink
12. `#E6E6FA` - Lavender
13. `#98FB98` - Pale Green
14. `#FFE4B5` - Peach
15. `#B0E0E6` - Powder Blue

**Visual Display:**
- Color swatches in 3x5 grid
- Large swatches (40px x 40px) for mobile touch
- Selected color highlighted with bright border
- Color name appears on hover/selection

### Special Effects (5 Options)
**Mutually Exclusive - Only one per nail**

1. **Chrome Powder** (`chrome`)
   - Metallic reflective finish
   - Visual: Gradient shine effect overlay
   - Popular with: Martinez, Rodriguez
   - Technical: Canvas gradient with metallic shimmer

2. **Iridescent** (`iridescent`)
   - Color-changing shimmer (pink/purple/blue shift)
   - Visual: Multi-color gradient overlay
   - Popular with: Rodriguez, Thompson
   - Technical: Animated color cycle

3. **Holographic** (`holographic`)
   - Rainbow sparkle effect
   - Visual: Prismatic overlay with animated sparkles
   - Popular with: Rodriguez (favorite!)
   - Technical: Particle system or animated sprite

4. **Matte Finish** (`matte`)
   - Non-shiny, flat appearance
   - Visual: Remove default gloss/shine
   - Popular with: Jenkins, Chen
   - Technical: Disable shine rendering

5. **Glossy** (`glossy`)
   - Extra shiny, wet-look finish
   - Visual: Enhanced gloss/reflection
   - Popular with: Martinez, Thompson
   - Technical: Brighten highlight rendering

**Technical Note:** Effects apply as overlay shaders/filters on base color. Artist agent will provide visual specifications for rendering.

### Patterns (3 Options)
**Mutually Exclusive - Only one per nail**

1. **Solid** (`solid`) - DEFAULT
   - Single base color fills entire nail
   - No gradient or variation
   - Universal appeal

2. **French Tip** (`french`)
   - Base color on nail body, white (or contrasting) tip
   - Classic, elegant look
   - Popular with: Martinez (perfectionist loves classic)
   - Technical: Base color + tip color (1/3 of nail)

3. **Ombre** (`ombre`)
   - Gradient from base color (cuticle) to lighter/darker shade (tip)
   - Modern, fashionable
   - Popular with: Rodriguez, Thompson
   - Technical: Gradient from base color to computed tint/shade

**Implementation Note:** Patterns affect how base color is applied, not a separate layer.

### Stickers & Dazzles (20 Types, 5 Max Per Nail)
**Categories:**

**Stars (5 variations):**
1. `star-gold` - Gold 5-point star
2. `star-silver` - Silver 5-point star
3. `star-small` - Tiny star cluster (3 stars)
4. `star-sparkle` - Animated twinkling star
5. `star-rainbow` - Holographic rainbow star

**Hearts (4 variations):**
6. `heart-red` - Classic red heart
7. `heart-pink` - Pink heart
8. `heart-broken` - Broken heart (prison theme!)
9. `heart-outline` - Heart outline (minimalist)

**Gems & Bling (5 variations):**
10. `gem-diamond` - Clear diamond rhinestone
11. `gem-ruby` - Red gemstone
12. `gem-emerald` - Green gemstone
13. `gem-sapphire` - Blue gemstone
14. `gem-cluster` - Small gem cluster (3 gems)

**Shapes (3 variations):**
15. `circle-gold` - Gold circle stud
16. `square-silver` - Silver square
17. `triangle-rainbow` - Rainbow triangle

**Thematic (3 variations):**
18. `flower-tiny` - Small flower
19. `moon-crescent` - Crescent moon
20. `skull-tiny` - Tiny skull (prison theme!)

**Sticker Mechanics:**
- Drag and drop onto nail canvas
- Position anywhere on nail surface
- Max 5 stickers per nail (prevents clutter)
- Can remove individual stickers
- Stickers render on top of base color + effects
- Size: Small (8px), Medium (12px), Large (16px) based on type

**Popular Stickers by Guard:**
- Jenkins: None (prefers clean)
- Martinez: Gems, flowers (elegant)
- Chen: None or minimal
- Thompson: Hearts, stars (cheerful)
- Rodriguez: ALL OF THEM (maximum dazzle)

### Glitter Toggle
**Boolean on/off for entire nail**

- **ON:** Animated sparkle overlay across entire nail
- **OFF:** No sparkle effect
- Applies over base color + effects + stickers
- Popular with: Rodriguez, Thompson
- Technical: Particle system or animated sparkle sprite

**Visual Specification:**
- Small sparkles (2-4px)
- Random positions across nail
- Fade in/out animation (1-2 second cycle)
- 5-10 sparkles visible at any time

---

## GUARD PERSONALITY SYSTEM

### Guard Database
**Expanded from current system with decoration preferences**

```javascript
guards: {
    jenkins: {
        name: "Guard Jenkins",
        skin: "#f4c8a8",
        nailColor: "#e8d4c0",
        nervousness: 0.7,
        personality: "strict",

        // NEW: Decoration preferences
        favoriteColors: ['#FF0000', '#000000'], // Red, Black
        favoriteEffects: ['matte'],
        favoritePatterns: ['solid'],
        favoriteStickers: [], // Prefers no stickers
        maxStickerBonus: 0, // No stickers = bonus

        // NEW: Reaction thresholds
        delightedThreshold: 4, // 4 tokens
        pleasedThreshold: 3,
        satisfiedThreshold: 2,
        tolerantThreshold: 1,

        // NEW: Dialogue by satisfaction level
        reactions: {
            delighted: "Hmph. I'll admit it... these are perfect. Simple. Professional. I respect that.",
            pleased: "Not bad. Clean, simple, professional. I can work with this.",
            satisfied: "Acceptable. They're clean. That's all I need.",
            tolerant: "Too flashy. I'm not some fashion model. But... I guess they're clean."
        }
    },

    martinez: {
        name: "Guard Martinez",
        skin: "#d4a574",
        nailColor: "#c99766",
        nervousness: 0.3,
        personality: "perfectionist",

        favoriteColors: ['#FFFFFF', '#FFD700', '#FF1493'], // White, Gold, Pink
        favoriteEffects: ['chrome', 'glossy'],
        favoritePatterns: ['french', 'solid'],
        favoriteStickers: ['gem-diamond', 'gem-ruby', 'flower-tiny'],
        maxStickerBonus: 3, // Perfect symmetry with 3 stickers
        symmetryRequired: true, // Left/right hands must match for bonus

        reactions: {
            delighted: "MAGNIFICO! Perfection! The symmetry! The colors! You are an ARTIST!",
            pleased: "Excellent work. Beautiful. You understand aesthetics.",
            satisfied: "Good. Not perfect, but good. The colors work well.",
            tolerant: "Hmm. You tried, but... the ombre is uneven. Practice more."
        }
    },

    chen: {
        name: "Guard Chen",
        skin: "#f0d5be",
        nailColor: "#e8d0ba",
        nervousness: 0.9,
        personality: "impatient",

        favoriteColors: ['#000000', '#4B0082', '#708090'], // Black, Dark Purple, Slate Gray
        favoriteEffects: ['matte'],
        favoritePatterns: ['solid'],
        favoriteStickers: [], // Minimalist
        maxStickerBonus: 0,
        speedBonus: true, // Bonus if decorated quickly (under 2 minutes)

        reactions: {
            delighted: "Finally. Fast work, good results. Didn't waste my time. Yeah, these look great.",
            pleased: "Quick and clean. I like that. These are fine.",
            satisfied: "Yeah, whatever. They look okay. Can I go now?",
            tolerant: "Took you forever and they're just... whatever. They're fine. I guess."
        }
    },

    thompson: {
        name: "Guard Thompson",
        skin: "#ffd7ba",
        nailColor: "#f5d8c4",
        nervousness: 0.5,
        personality: "chatty",

        favoriteColors: ['#FFB6C1', '#98FB98', '#FFE4B5'], // Pastel colors
        favoriteEffects: ['glossy', 'iridescent'],
        favoritePatterns: ['ombre', 'french'],
        favoriteStickers: ['heart-pink', 'star-rainbow', 'flower-tiny'],
        maxStickerBonus: 5, // Loves decorations

        reactions: {
            delighted: "OH MY GOSH THESE ARE AMAZING! You know, my sister does nails and she would LOVE this design! The little stars remind me of...",
            pleased: "These are SO pretty! I love the colors! My friend has a similar design!",
            satisfied: "Oh these are nice! I really like them! They're cheerful!",
            tolerant: "Oh these are nice! Not my favorite color but I appreciate the effort!"
        }
    },

    rodriguez: {
        name: "Guard Rodriguez",
        skin: "#c88a5a",
        nailColor: "#b87d52",
        nervousness: 0.6,
        personality: "paranoid",

        favoriteColors: ['#FF1493', '#FFD700', '#FF0000'], // Hot Pink, Gold, Red
        favoriteEffects: ['holographic', 'chrome', 'iridescent'],
        favoritePatterns: ['ombre', 'french'],
        favoriteStickers: ['star-gold', 'gem-diamond', 'star-rainbow', 'gem-ruby'],
        maxStickerBonus: 5, // Maximum dazzle
        glitterBonus: true, // LOVES glitter

        reactions: {
            delighted: "I... I'll admit these are GORGEOUS. You're not trying to poison me with the polish, right? No? Okay, these are FABULOUS.",
            pleased: "These are... actually really good. You have an eye for fashion. Still watching you though.",
            satisfied: "Okay, these look decent. Still don't trust you, but... nice work.",
            tolerant: "What's your angle here? Are you trying to make me look bad? These are too plain!"
        }
    }
}
```

### Preference Matching Algorithm

```javascript
calculateDecorationBonus(guardKey, decorationData) {
    const guard = this.guards[guardKey];
    let bonusTokens = 0;

    // 1. BASE TOKEN (always awarded for completion)
    // Awarded in main completion function

    // 2. COMPLETENESS BONUS (+1 if all 10 nails decorated)
    const decoratedCount = decorationData.leftHand.filter(n => n.baseColor).length +
                          decorationData.rightHand.filter(n => n.baseColor).length;
    if (decoratedCount === 10) {
        bonusTokens += 1;
    }

    // 3. COLOR PREFERENCE BONUS (+1 if majority uses favorite colors)
    let favoriteColorCount = 0;
    [...decorationData.leftHand, ...decorationData.rightHand].forEach(nail => {
        if (nail.baseColor && guard.favoriteColors.includes(nail.baseColor)) {
            favoriteColorCount++;
        }
    });
    if (favoriteColorCount >= 6) { // 60% or more
        bonusTokens += 1;
    }

    // 4. SPECIAL PREFERENCE BONUSES (guard-specific)

    // Jenkins: No stickers bonus
    if (guardKey === 'jenkins') {
        const stickerCount = [...decorationData.leftHand, ...decorationData.rightHand]
            .reduce((sum, nail) => sum + (nail.stickers?.length || 0), 0);
        if (stickerCount === 0) {
            bonusTokens += 1;
        }
    }

    // Martinez: Symmetry bonus
    if (guardKey === 'martinez' && guard.symmetryRequired) {
        const isSymmetric = this.checkSymmetry(decorationData.leftHand, decorationData.rightHand);
        if (isSymmetric) {
            bonusTokens += 1;
        }
    }

    // Chen: Speed bonus (tracked separately)
    if (guardKey === 'chen' && this.decorationTime < 120) { // Under 2 minutes
        bonusTokens += 1;
    }

    // Rodriguez: Glitter bonus
    if (guardKey === 'rodriguez' && guard.glitterBonus) {
        const glitterCount = [...decorationData.leftHand, ...decorationData.rightHand]
            .filter(nail => nail.glitter).length;
        if (glitterCount >= 8) { // 80% or more
            bonusTokens += 1;
        }
    }

    // Rodriguez: Holographic effect bonus
    if (guardKey === 'rodriguez') {
        const holoCount = [...decorationData.leftHand, ...decorationData.rightHand]
            .filter(nail => nail.specialEffect === 'holographic').length;
        if (holoCount >= 5) {
            bonusTokens += 1;
        }
    }

    // Thompson: Sticker bonus (loves decorations)
    if (guardKey === 'thompson') {
        const stickerCount = [...decorationData.leftHand, ...decorationData.rightHand]
            .reduce((sum, nail) => sum + (nail.stickers?.length || 0), 0);
        if (stickerCount >= 15) { // Lots of stickers
            bonusTokens += 1;
        }
    }

    // CAP AT 3 BONUS TOKENS (base 1 + 3 bonus = 4 total max)
    return Math.min(bonusTokens, 3);
}

checkSymmetry(leftHand, rightHand) {
    // Check if left and right hands are mirrored
    for (let i = 0; i < 5; i++) {
        const left = leftHand[i];
        const right = rightHand[i];

        if (left.baseColor !== right.baseColor) return false;
        if (left.specialEffect !== right.specialEffect) return false;
        if (left.pattern !== right.pattern) return false;
        if (left.glitter !== right.glitter) return false;
        // Stickers don't need to match exactly
    }
    return true;
}
```

### Satisfaction Level Determination

```javascript
getSatisfactionLevel(totalTokens) {
    if (totalTokens >= 4) return 'delighted';
    if (totalTokens >= 3) return 'pleased';
    if (totalTokens >= 2) return 'satisfied';
    return 'tolerant';
}

getGuardReaction(guardKey, satisfactionLevel) {
    const guard = this.guards[guardKey];
    return guard.reactions[satisfactionLevel];
}
```

---

## DATA PERSISTENCE ARCHITECTURE

### Player Object Extension

**Add to existing player object in game.js (line ~632):**

```javascript
player: {
    // ... existing properties ...

    // Guard Nail Art System (NEW v1.6.0)
    guardHands: {
        jenkins: {
            lastDecorated: null,        // Date timestamp
            decorationCount: 0,         // Total times decorated
            totalTokensEarned: 0,       // Lifetime tokens from this guard
            currentDesign: null         // Full nail decoration data
        },
        martinez: {
            lastDecorated: null,
            decorationCount: 0,
            totalTokensEarned: 0,
            currentDesign: null
        },
        chen: {
            lastDecorated: null,
            decorationCount: 0,
            totalTokensEarned: 0,
            currentDesign: null
        },
        thompson: {
            lastDecorated: null,
            decorationCount: 0,
            totalTokensEarned: 0,
            currentDesign: null
        },
        rodriguez: {
            lastDecorated: null,
            decorationCount: 0,
            totalTokensEarned: 0,
            currentDesign: null
        }
    }
}
```

### Nail Decoration Data Structure

**Complete decoration stored in `player.guardHands[guardKey].currentDesign`:**

```javascript
{
    version: "1.0",  // Data structure version (future-proofing)
    timestamp: 1729350000000,  // When created

    leftHand: [
        // Thumb (index 0)
        {
            baseColor: '#FF1493',           // Hot Pink
            specialEffect: 'chrome',         // Chrome powder
            pattern: 'solid',                // Solid fill
            stickers: [
                { type: 'star-gold', position: {x: 15, y: 10}, size: 'small' },
                { type: 'gem-diamond', position: {x: 15, y: 30}, size: 'medium' }
            ],
            glitter: true
        },
        // Index finger (index 1)
        {
            baseColor: '#FFD700',           // Gold
            specialEffect: 'holographic',
            pattern: 'ombre',
            stickers: [],
            glitter: true
        },
        // Middle finger (index 2)
        { /* ... */ },
        // Ring finger (index 3)
        { /* ... */ },
        // Pinky (index 4)
        { /* ... */ }
    ],

    rightHand: [
        // Same structure as leftHand
        // 5 nail objects (thumb to pinky)
    ],

    // Metadata
    decorationTime: 145,  // Seconds spent decorating (for Chen's speed bonus)
    tokensEarned: 4,      // How many tokens this design earned
    satisfactionLevel: 'delighted'  // Guard's reaction level
}
```

### Save/Load Integration

**Add to saveGame() method:**

```javascript
saveGame() {
    const saveData = {
        // ... existing save data ...

        // NEW: Guard hands data
        guardHands: this.player.guardHands,

        version: this.VERSION
    };

    localStorage.setItem('vroomVroomSave', JSON.stringify(saveData));

    // Also save to exportable save code
    this.generateSaveCode(saveData);
}
```

**Add to loadGame() method:**

```javascript
loadGame() {
    const saveData = JSON.parse(localStorage.getItem('vroomVroomSave'));

    // ... existing load logic ...

    // NEW: Load guard hands data
    if (saveData.guardHands) {
        this.player.guardHands = saveData.guardHands;
    } else {
        // Initialize if missing (backwards compatibility)
        this.initializeGuardHands();
    }
}
```

### Backwards Compatibility

**For players upgrading from v1.4.0 to v1.6.0:**

```javascript
initializeGuardHands() {
    this.player.guardHands = {
        jenkins: { lastDecorated: null, decorationCount: 0, totalTokensEarned: 0, currentDesign: null },
        martinez: { lastDecorated: null, decorationCount: 0, totalTokensEarned: 0, currentDesign: null },
        chen: { lastDecorated: null, decorationCount: 0, totalTokensEarned: 0, currentDesign: null },
        thompson: { lastDecorated: null, decorationCount: 0, totalTokensEarned: 0, currentDesign: null },
        rodriguez: { lastDecorated: null, decorationCount: 0, totalTokensEarned: 0, currentDesign: null }
    };
}
```

---

## REWARD & ECONOMY BALANCE

### Token Reward Structure

**Base Reward:** 1 favor token (guaranteed for any completion)

**Bonus Tokens (0-3 additional):**
- +1 token: All 10 nails decorated (completeness)
- +1 token: Favorite colors used (60%+ nails)
- +1 token: Guard-specific bonus met (personality preference)

**Maximum:** 4 favor tokens per session

**Token Distribution Probability:**
```
1 token:  30% (minimal effort, few decorations)
2 tokens: 35% (decent effort, some preferences matched)
3 tokens: 25% (good effort, multiple bonuses)
4 tokens: 10% (perfect design, all bonuses)
```

**Expected Value:** ~2.15 tokens per session (balanced for economy)

### Cost & Time Balance

**Current System (v1.4.0):**
- Cost: Free
- Time: 30 minutes (0.02 prison days)
- Reward: 1 favor token
- Cooldown: None (can spam)

**New System (v1.6.0):**
- Cost: 20 credits
- Time: 45 minutes (0.03 prison days)
- Reward: 1-4 favor tokens (avg 2.15)
- Cooldown: 1 day per guard (can rotate between 5 guards)

**Economic Analysis:**

| Metric | v1.4.0 | v1.6.0 | Change |
|--------|--------|--------|--------|
| Cost per token | 0 credits | ~9.3 credits | More expensive |
| Time per token | 30 min | ~21 min | More efficient |
| Tokens per day | Unlimited | ~10 tokens (5 guards x 2 avg) | Capped progression |
| Creative investment | None | High (design effort) | Intrinsic motivation |

**Balance Rationale:**
1. **Cost increase** prevents exploitation (requires earning credits)
2. **Time efficiency** rewards creative investment
3. **Cooldown system** prevents grinding, encourages rotation
4. **Multiple guards** provides variety and collection goal
5. **Quality-based rewards** incentivize learning preferences

### Favor Token Economy

**Existing Favor Token Uses (from current system):**
- 1 token: Skip 1 day of sentence
- 2 tokens: Extra commissary item
- 3 tokens: Private cell upgrade
- 4 tokens: Look the other way (minor violation ignored)

**Recommended Pricing (balanced for v1.6.0):**

With average 2.15 tokens/session and 5 guards/day max = ~10 tokens/day potential

| Benefit | Cost | Sessions Needed | Days to Earn |
|---------|------|-----------------|--------------|
| Skip 1 day sentence | 2 tokens | 1 session | 1 day |
| Extra commissary item | 3 tokens | 2 sessions | 1 day |
| Private cell upgrade | 8 tokens | 4 sessions | 1 day |
| Ignore minor violation | 4 tokens | 2 sessions | 1 day |
| **NEW:** Reduce sentence 5 days | 15 tokens | 7 sessions | 2 days |
| **NEW:** Smuggle contraband | 10 tokens | 5 sessions | 1 day |

**Balanced Progression:**
- Early game: Players decorate 1-2 guards for small benefits
- Mid game: Players learn preferences, optimize for 3-4 tokens
- Late game: Players collect all 5 guard designs, max efficiency

### Diminishing Returns System

**Prevent repetitive grinding:**

```javascript
calculateDiminishingReturns(guardKey) {
    const guardData = this.player.guardHands[guardKey];
    const decorationCount = guardData.decorationCount;

    // First 3 decorations: Full rewards
    if (decorationCount < 3) return 1.0;

    // 4-6 decorations: 75% rewards
    if (decorationCount < 6) return 0.75;

    // 7-10 decorations: 50% rewards
    if (decorationCount < 10) return 0.5;

    // 11+ decorations: 25% rewards (minimum)
    return 0.25;
}

applyDiminishingReturns(baseTokens, guardKey) {
    const multiplier = this.calculateDiminishingReturns(guardKey);
    return Math.max(1, Math.floor(baseTokens * multiplier)); // Always minimum 1 token
}
```

**Example Progression (Jenkins):**
```
Decoration 1: 4 tokens earned → 4 tokens awarded (100%)
Decoration 2: 3 tokens earned → 3 tokens awarded (100%)
Decoration 3: 4 tokens earned → 4 tokens awarded (100%)
Decoration 4: 4 tokens earned → 3 tokens awarded (75%)
Decoration 5: 2 tokens earned → 1 token awarded (75%)
Decoration 7: 4 tokens earned → 2 tokens awarded (50%)
Decoration 12: 4 tokens earned → 1 token awarded (25%)
```

**Design Rationale:**
- Encourages decorating ALL 5 guards (variety)
- Prevents single-guard farming
- Maintains minimum 1 token (respect player time)
- Still allows repeated decorations (some players enjoy it)

---

## UI/UX SPECIFICATIONS

### Screen Layout

**Full-Screen Decoration Interface (1920x1080 base, responsive)**

```
┌─────────────────────────────────────────────────────────────────┐
│  GUARD NAIL ART DECORATION                    [HELP] [CLOSE]    │
│  Guard: Martinez │ Session #3 │ Best: 4 tokens                  │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                       │
│  TOOLS   │            ISOMETRIC HANDS CANVAS                     │
│  (200px) │                  (800x600)                            │
│          │                                                       │
│  ┌─────┐ │     [Left Hand Preview]    [Right Hand Preview]      │
│  │COLOR│ │                                                       │
│  │GRID │ │     Click nail to select → Highlighted border        │
│  └─────┘ │                                                       │
│          │     Selected: Left Index Finger                       │
│  ┌─────┐ │                                                       │
│  │EFFCT│ │                                                       │
│  └─────┘ │                                                       │
│          │                                                       │
│  ┌─────┐ │  ┌─────────────────────────────────────────────┐    │
│  │STICK│ │  │ CURRENT NAIL PREVIEW                        │    │
│  │ ERS │ │  │ Base: Hot Pink  Effect: Chrome              │    │
│  └─────┘ │  │ Pattern: Solid  Glitter: ON                 │    │
│          │  │ Stickers: Star (gold), Gem (diamond)        │    │
│  [GLTR]  │  └─────────────────────────────────────────────┘    │
│          │                                                       │
├──────────┴──────────────────────────────────────────────────────┤
│ [UNDO] [CLEAR CURRENT] [CLEAR ALL] [PREVIEW] [SAVE] [CANCEL]   │
└─────────────────────────────────────────────────────────────────┘
```

**Mobile Layout (768px and below):**
```
┌─────────────────────────┐
│ NAIL ART - Martinez     │
│ Session #3              │
├─────────────────────────┤
│                         │
│   HANDS CANVAS          │
│   (400x300)             │
│                         │
│   [Left]    [Right]     │
│                         │
├─────────────────────────┤
│ Selected: Left Thumb    │
│ Base: Pink  Effect: --  │
├─────────────────────────┤
│ COLORS (scrollable)     │
│ ■ ■ ■ ■ ■ ■ ■ ■        │
├─────────────────────────┤
│ EFFECTS (tabs)          │
│ [Chrome][Holo][Matte]   │
├─────────────────────────┤
│ STICKERS (scrollable)   │
│ ⭐ 💎 ❤️ ✨            │
├─────────────────────────┤
│ [Glitter: OFF]          │
├─────────────────────────┤
│ [Save] [Clear] [Cancel] │
└─────────────────────────┘
```

### Tool Panels

**1. Color Palette Panel**
```
COLORS
┌───┬───┬───┬───┬───┐
│ ■ │ ■ │ ■ │ ■ │ ■ │  Hot Pink, Red, Gold, White, Black
├───┼───┼───┼───┼───┤
│ ■ │ ■ │ ■ │ ■ │ ■ │  Rust Brown, Olive, Slate, Steel, Dark Red
├───┼───┼───┼───┼───┤
│ ■ │ ■ │ ■ │ ■ │ ■ │  Light Pink, Lavender, Pale Green, Peach, Powder Blue
└───┴───┴───┴───┴───┘

Selected: Hot Pink (#FF1493)
```

**Specs:**
- Swatch size: 40px x 40px (desktop), 50px x 50px (mobile)
- Border: 2px solid #333 (default), 4px solid #FFD700 (selected)
- Tooltip: Color name on hover
- Click to select and apply to current nail

**2. Special Effects Panel**
```
EFFECTS (Select One)
┌──────────────┐
│ ◯ None       │
│ ◯ Chrome     │  ← Radio button selection
│ ● Holographic│  ← Currently selected
│ ◯ Iridescent │
│ ◯ Matte      │
│ ◯ Glossy     │
└──────────────┘
```

**Specs:**
- Radio buttons (mutually exclusive)
- Preview icon next to each effect name
- Selected effect highlighted with background color
- Click to select and apply to current nail

**3. Pattern Panel**
```
PATTERN (Select One)
┌──────────────┐
│ ● Solid      │
│ ◯ French Tip │
│ ◯ Ombre      │
└──────────────┘
```

**Specs:**
- Radio buttons (mutually exclusive)
- Small preview thumbnail of pattern
- Default: Solid

**4. Stickers Panel**
```
STICKERS (Max 5 per nail)
┌────┬────┬────┬────┐
│ ⭐ │ ⭐ │ ⭐ │ ⭐ │  Stars
├────┼────┼────┼────┤
│ ❤️ │ ❤️ │ 💔 │ ♡  │  Hearts
├────┼────┼────┼────┤
│ 💎 │ 💎 │ 💎 │ 💎 │  Gems
├────┼────┼────┼────┤
│ ● │ ■ │ ▲ │ 🌸 │  Shapes
└────┴────┴────┴────┘

Current Nail: 2/5 stickers
```

**Specs:**
- Grid layout (4 columns x 5 rows)
- Icon size: 32px x 32px (desktop), 40px x 40px (mobile)
- Click to add to current nail
- Drag to position on nail canvas (advanced)
- Counter shows stickers on current nail

**5. Glitter Toggle**
```
┌──────────────┐
│ ✨ GLITTER   │
│  [ON] [OFF]  │  ← Toggle button
└──────────────┘
```

**Specs:**
- Large toggle button (120px wide)
- Visual preview (sparkles animate when ON)
- Applies to current nail only

### Hand Canvas Rendering

**Isometric Pixel Art Hands (Artist Agent Deliverable)**

**Specifications for Artist:**
- Canvas size: 800x600 (desktop), 400x300 (mobile)
- View angle: Isometric top-down (30° angle)
- Hand positioning:
  - Left hand: X:200, Y:300 (palm down, fingers spread)
  - Right hand: X:600, Y:300 (palm down, fingers spread)
- Nail visibility: All 10 fingernails clearly visible
- Nail size: 40-50px per nail (clickable area)
- Art style: Pixel art consistent with VROOM VROOM aesthetic
- Color palette: Guard skin tones (5 guards, 5 skin colors)

**Nail States:**
1. **Undecorated** - Default nail color, no decorations
2. **Selected** - Highlighted border (gold), pulsing animation
3. **Decorated** - Render base color + effects + stickers + glitter
4. **Preview Mode** - Hands rotate slowly (0.5 RPM)

**Rendering Layers (bottom to top):**
```
Layer 1: Skin (palm and fingers)
Layer 2: Nail base (oval shape)
Layer 3: Base color fill
Layer 4: Pattern (french tip, ombre, or solid)
Layer 5: Special effect (chrome, holographic, etc.)
Layer 6: Stickers (positioned elements)
Layer 7: Glitter (animated particles)
Layer 8: Selection highlight (if selected)
```

**Performance:**
- Render at 30 FPS (smooth but not resource-intensive)
- Cache unchanged nails (only re-render selected/modified)
- Mobile optimization: Lower particle count for glitter

### Control Buttons

**Bottom Action Bar:**
```
┌──────┬────────────┬───────────┬─────────┬──────┬────────┐
│ UNDO │ CLEAR NAIL │ CLEAR ALL │ PREVIEW │ SAVE │ CANCEL │
└──────┴────────────┴───────────┴─────────┴──────┴────────┘
```

**Button Specs:**
- Size: 120px x 48px (desktop), 100% width stacked (mobile)
- Font: 16px monospace, bold
- Colors:
  - UNDO: #FFA500 (Orange) - Reverts last action
  - CLEAR NAIL: #FF6347 (Tomato) - Clears current nail only
  - CLEAR ALL: #DC143C (Crimson) - Clears all 10 nails (confirmation prompt!)
  - PREVIEW: #4682B4 (Steel Blue) - Rotate hands view
  - SAVE: #32CD32 (Lime Green) - Save design and proceed
  - CANCEL: #696969 (Dim Gray) - Exit without saving
- Hover effect: Brighten by 20%
- Click effect: Scale down 95% for 100ms

**Undo Stack:**
- Track last 10 actions (per session)
- Actions: Color change, effect change, sticker add, sticker remove, glitter toggle
- Display: "Undo: Added sticker" (descriptive text)

**Confirmation Prompts:**
- CLEAR ALL: "Clear all decorations? This cannot be undone."
- CANCEL: "Exit without saving? Decorations will be lost."

### Guard Selection Screen

**Before entering decoration interface:**

```
┌─────────────────────────────────────────────┐
│  SELECT GUARD TO DECORATE                   │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ GUARD JENKINS          [PREVIEW]     │  │
│  │ Personality: Strict, gruff           │  │
│  │ Manicures given: 3                   │  │
│  │ Last decorated: 2 days ago           │  │
│  │ Current nails: Simple red, no decor  │  │  ← Shows mini preview
│  │ Tokens earned: 10                    │  │
│  │                                      │  │
│  │ [SELECT JENKINS - 20 credits, 45min]│  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ GUARD MARTINEZ         [PREVIEW]     │  │
│  │ Personality: Perfectionist, excited  │  │
│  │ Manicures given: 0                   │  │
│  │ Last decorated: Never                │  │
│  │ Current nails: Unkempt, dirty        │  │
│  │ Tokens earned: 0                     │  │
│  │                                      │  │
│  │ [SELECT MARTINEZ - 20 credits, 45min│  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ... (Chen, Thompson, Rodriguez)            │
│                                             │
│  [BACK TO PRISON MENU]                     │
└─────────────────────────────────────────────┘
```

**Selection Card Specs:**
- Size: 600px width x 180px height (desktop)
- Background: Dark gray (#2a2a2a), lighter on hover (#3a3a3a)
- Border: 2px solid #555
- Mini preview canvas: 120px x 90px (shows current nail design)
- Click entire card to select guard

**Cooldown Display:**
- If decorated within last 24 hours: "Cooldown: 18 hours remaining" (button disabled)
- Button color: #555 (gray) when on cooldown

### Manicure Gallery Screen

**New screen to view all decorated guard hands:**

```
┌─────────────────────────────────────────────┐
│  GUARD MANICURE GALLERY                     │
│  Your Masterpieces                          │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────┐  ┌───────┐  ┌───────┐           │
│  │JENKINS│  │MARTINE│  │ CHEN  │           │
│  │       │  │  Z    │  │       │           │
│  │ [IMG] │  │ [IMG] │  │ [IMG] │           │  ← Thumbnail of hands
│  │       │  │       │  │       │           │
│  │  10   │  │  12   │  │   8   │           │  ← Tokens earned
│  │tokens │  │tokens │  │tokens │           │
│  └───────┘  └───────┘  └───────┘           │
│                                             │
│  ┌───────┐  ┌───────┐                      │
│  │THOMPSN│  │RODRIGZ│                      │
│  │       │  │       │                      │
│  │ [IMG] │  │ [IMG] │                      │
│  │       │  │       │                      │
│  │   6   │  │  15   │                      │
│  │tokens │  │tokens │                      │
│  └───────┘  └───────┘                      │
│                                             │
│  Click any guard to view full-size design  │
│                                             │
│  Total Manicures: 15                       │
│  Total Tokens Earned: 51                   │
│                                             │
│  [BACK TO PRISON MENU]                     │
└─────────────────────────────────────────────┘
```

**Gallery Card Specs:**
- Grid: 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- Card size: 200px x 250px
- Thumbnail canvas: 180px x 135px
- Click to open full-screen preview (800x600 canvas)
- Statistics displayed below thumbnail

**Full-Screen Preview:**
```
┌─────────────────────────────────────────────┐
│  ← BACK                    GUARD JENKINS    │
├─────────────────────────────────────────────┤
│                                             │
│           [FULL SIZE HANDS RENDER]          │
│                 (800x600)                   │
│                                             │
│  Decorated: 3 days ago                      │
│  Tokens earned: 4 (Delighted)               │
│  Total sessions: 3                          │
│                                             │
│  Design:                                    │
│  - Base colors: Red, Black                  │
│  - Effects: Matte finish                    │
│  - Pattern: Solid                           │
│  - Stickers: None                           │
│  - Glitter: No                              │
│                                             │
│  Jenkins: "Hmph. Perfect. Simple."          │  ← Guard's reaction
│                                             │
└─────────────────────────────────────────────┘
```

### Accessibility Features

**Color Blindness Support:**
- All colors labeled with names (not just swatches)
- High contrast mode toggle (increases border visibility)
- Icon-based indicators (not just color-coded)

**Mobile Touch Optimization:**
- Minimum touch target: 48px x 48px (iOS guidelines)
- Swipe gestures: Swipe left/right to switch between nails
- Pinch to zoom on hand canvas (precision sticker placement)
- Haptic feedback on sticker placement (mobile vibration)

**Keyboard Navigation:**
- Tab through all interactive elements
- Arrow keys to select nails (1-0 for left hand, Shift+1-5 for right)
- C key to cycle colors
- E key to cycle effects
- Space to toggle glitter
- Enter to save, Esc to cancel

**Screen Reader Support:**
- All buttons have descriptive ARIA labels
- Current nail state announced on selection
- Decoration changes announced ("Added chrome effect to left thumb")

---

## TECHNICAL IMPLEMENTATION PLAN

### File Structure

**New Files:**
```
game/systems/guard-nail-art.js          (~800 lines) - Main nail art system
game/assets/nail-stickers/              (directory)  - Sticker sprite images
game/assets/nail-effects/               (directory)  - Effect shader/sprites
```

**Modified Files:**
```
game/core/game.js                       - Integration, save/load, player object
game/index.html                         - New HTML screens and UI elements
game/styles/main.css                    - Nail art UI styling
```

### Class Architecture

**GuardNailArtSystem class (guard-nail-art.js):**

```javascript
class GuardNailArtSystem {
    constructor(game) {
        this.game = game;

        // Guard database (extended from visual manicure system)
        this.guards = { /* ... see Guard Personality System section ... */ };

        // Canvas references
        this.canvas = null;
        this.ctx = null;
        this.scale = 1.0;

        // Current session state
        this.currentGuard = null;
        this.selectedNail = null; // { hand: 'left'|'right', index: 0-4 }
        this.decorationData = {
            leftHand: [null, null, null, null, null],
            rightHand: [null, null, null, null, null]
        };
        this.undoStack = [];
        this.decorationStartTime = null;

        // Hand rendering (collaboration with artist agent)
        this.handRenderer = null; // Isometric pixel art renderer

        // Preview mode
        this.previewMode = false;
        this.previewRotation = 0;
    }

    // === SESSION MANAGEMENT ===

    startDecorationSession(guardKey) {
        // Validate cooldown, cost, initialize session
        // Show decoration interface
        // Load existing design if present
    }

    loadExistingDesign(guardKey) {
        // Load player.guardHands[guardKey].currentDesign into decorationData
    }

    // === NAIL SELECTION ===

    handleCanvasClick(event) {
        // Detect which nail was clicked
        // Set selectedNail
        // Update UI to show selected nail state
    }

    selectNail(hand, index) {
        // Set selectedNail = { hand, index }
        // Highlight selected nail on canvas
        // Update current nail preview panel
    }

    // === DECORATION APPLICATION ===

    applyBaseColor(colorHex) {
        // Apply color to selectedNail
        // Add action to undo stack
        // Re-render canvas
    }

    applySpecialEffect(effectType) {
        // Apply effect to selectedNail (replaces existing)
        // Add action to undo stack
        // Re-render canvas
    }

    applyPattern(patternType) {
        // Apply pattern to selectedNail
        // Add action to undo stack
        // Re-render canvas
    }

    addSticker(stickerType, position) {
        // Validate sticker count (max 5)
        // Add sticker to selectedNail.stickers array
        // Add action to undo stack
        // Re-render canvas
    }

    removeSticker(stickerIndex) {
        // Remove sticker from selectedNail.stickers array
        // Add action to undo stack
        // Re-render canvas
    }

    toggleGlitter() {
        // Toggle selectedNail.glitter boolean
        // Add action to undo stack
        // Re-render canvas
    }

    // === UNDO/CLEAR ===

    undo() {
        // Pop last action from undo stack
        // Revert decoration state
        // Re-render canvas
    }

    clearCurrentNail() {
        // Reset selectedNail to default state
        // Add action to undo stack
        // Re-render canvas
    }

    clearAllNails() {
        // Confirmation prompt
        // Reset all decorationData to default
        // Clear undo stack
        // Re-render canvas
    }

    // === RENDERING ===

    render() {
        // Clear canvas
        // Draw both hands using handRenderer
        // For each nail, render layers:
        //   1. Base nail shape
        //   2. Base color
        //   3. Pattern (french/ombre/solid)
        //   4. Special effect (chrome/holo/etc)
        //   5. Stickers
        //   6. Glitter particles
        //   7. Selection highlight (if selected)
        // Request next animation frame
    }

    renderNail(hand, index) {
        // Render individual nail with all decorations
        // Called by main render() loop
    }

    // === PREVIEW MODE ===

    enterPreviewMode() {
        // Set previewMode = true
        // Start rotation animation
        // Hide tool panels, show full canvas
    }

    exitPreviewMode() {
        // Set previewMode = false
        // Reset rotation to 0
        // Show tool panels
    }

    // === SAVE & COMPLETION ===

    saveDesign() {
        // Calculate decoration time
        // Calculate bonus tokens
        // Create decoration data object
        // Save to player.guardHands[currentGuard]
        // Show guard reaction screen
        // Award favor tokens
        // Update statistics
        // Return to prison menu
    }

    calculateBonusTokens() {
        // Implement preference matching algorithm
        // Return 0-3 bonus tokens
        // See "Preference Matching Algorithm" section
    }

    showGuardReaction(tokensEarned) {
        // Determine satisfaction level
        // Get guard reaction dialogue
        // Display reaction screen with decorated hands visible
        // Show token reward breakdown
    }

    // === GALLERY ===

    showGallery() {
        // Display all 5 guards with thumbnails
        // Render mini previews of current designs
        // Show statistics (tokens earned, session count)
        // Allow clicking for full-screen preview
    }

    showFullPreview(guardKey) {
        // Render full-size decorated hands
        // Show decoration metadata
        // Show guard's reaction from last session
    }

    // === INTEGRATION WITH GAME ===

    canDecorateGuard(guardKey) {
        // Check cooldown (24 hours since last decoration)
        // Check player has 20 credits
        // Return boolean
    }

    getCooldownRemaining(guardKey) {
        // Calculate hours remaining until next allowed decoration
        // Return 0 if ready, hours remaining otherwise
    }
}
```

### Integration Points

**1. Prison Menu (game.js)**

Add button to prison menu:

```javascript
// In showScreen('prisonMenu') function
const prisonMenuHTML = `
    <!-- ... existing buttons ... -->

    <button onclick="game.nailArtSystem.startGuardSelection()">
        GIVE MANICURE TO GUARD
    </button>

    <button onclick="game.nailArtSystem.showGallery()">
        VIEW MANICURE GALLERY
    </button>
`;
```

**2. Save/Load System (game.js)**

Extend save data:

```javascript
// In saveGame()
saveData.guardHands = this.player.guardHands;

// In loadGame()
this.player.guardHands = saveData.guardHands || this.initializeGuardHands();
```

**3. Guard Dialogue Integration (game.js)**

When guards appear in random events or interactions:

```javascript
// In guard interaction functions
if (this.player.guardHands[guardKey].currentDesign) {
    // Show mini preview of decorated hands
    this.showNailPreview(guardKey);

    // Guard references their nails
    const nailDialogue = [
        "My nails still look fabulous, by the way.",
        "Thanks again for the manicure. Best in the cell block.",
        "I showed the other guards my nails. They're all jealous.",
        "I'm almost out of top coat. When's our next session?"
    ];
    dialogue.push(this.randomChoice(nailDialogue));
}
```

**4. Testing Menu Integration (game.js)**

Add debug commands:

```javascript
// In debug menu (type TEST on main menu)
testCommands.push({
    name: "Test Nail Art System",
    action: () => {
        this.nailArtSystem.startDecorationSession('martinez');
    }
});

testCommands.push({
    name: "Award 10 Favor Tokens",
    action: () => {
        this.player.favorTokens += 10;
        this.showMessage("Added 10 favor tokens for testing.", 2000);
    }
});

testCommands.push({
    name: "Reset Guard Cooldowns",
    action: () => {
        Object.keys(this.player.guardHands).forEach(guardKey => {
            this.player.guardHands[guardKey].lastDecorated = null;
        });
        this.showMessage("All guard cooldowns reset.", 2000);
    }
});
```

### Rendering Collaboration with Artist Agent

**Artist Deliverables Needed:**

1. **Isometric Hand Sprite Sheets**
   - 5 hand sets (one per guard skin tone)
   - Left and right hand
   - Each finger separately rendered (for nail overlays)
   - PNG format with transparency

2. **Nail Overlay Templates**
   - Nail shape masks (for clipping base colors)
   - 10 positions per hand set (one per fingernail)
   - Multiple sizes (40px, 50px, 60px for different zoom levels)

3. **Sticker Sprite Atlas**
   - All 20 sticker types in single sprite sheet
   - Individual sprites at 16px, 24px, 32px sizes
   - PNG with transparency

4. **Effect Shaders/Overlays**
   - Chrome: Gradient mask for metallic reflection
   - Holographic: Rainbow gradient sprite
   - Iridescent: Multi-color shimmer sprite
   - Glitter: Particle sprites (3-5 variations)

5. **Animation Frames**
   - Glitter particle fade in/out (4 frames)
   - Holographic color cycle (8 frames)
   - Selection pulse (6 frames)

**Technical Specifications:**
- All sprites: PNG-24 with alpha transparency
- Color space: sRGB
- Resolution: 2x retina assets (scale down for standard displays)
- Atlas format: JSON metadata + single PNG image

**Example Asset Request:**

```
File: nail-sprite-atlas.png (1024x1024)
Metadata: nail-sprite-atlas.json

{
    "frames": {
        "star-gold-small": { "x": 0, "y": 0, "w": 16, "h": 16 },
        "star-gold-medium": { "x": 16, "y": 0, "w": 24, "h": 24 },
        "star-gold-large": { "x": 40, "y": 0, "w": 32, "h": 32 },
        ... (all 20 sticker types, 3 sizes each)
    }
}
```

### Performance Optimization

**Rendering Optimizations:**

1. **Dirty Rectangles**
   - Only re-render changed nails (not entire canvas)
   - Track which nails modified since last render

2. **Canvas Layering**
   - Static layer: Hand shapes (rarely changes)
   - Dynamic layer: Nail decorations (changes frequently)
   - Overlay layer: Selection highlights, UI elements

3. **Sprite Caching**
   - Pre-render base colors to off-screen canvas
   - Cache sticker sprites at common sizes
   - Reuse cached sprites when possible

4. **Mobile Optimization**
   - Reduce glitter particle count (50 desktop → 20 mobile)
   - Lower animation frame rate (60fps → 30fps on mobile)
   - Smaller canvas resolution (800x600 → 400x300)

**Memory Management:**

```javascript
// Cleanup when exiting decoration screen
destroy() {
    this.canvas = null;
    this.ctx = null;
    this.handRenderer.destroy();
    this.decorationData = null;
    this.undoStack = [];
    // Release all cached sprites
}
```

---

## INTEGRATION CODE SNIPPETS

### Snippet 1: Initialize Nail Art System in game.js

**Location:** `game/core/game.js`, inside `constructor()` (~line 684)

```javascript
// Initialize Guard Manicure System (lazy initialization)
this.manicureSystem = null;

// NEW: Initialize Guard Nail Art System (v1.6.0)
this.nailArtSystem = null;
```

**Location:** `game/core/game.js`, inside `init()` method (~line 692)

```javascript
init() {
    // ... existing initialization ...

    // Lazy initialize nail art system (loaded on first use)
    // This prevents loading heavy asset files until needed

    // Initialize guard hands data if not present
    if (!this.player.guardHands) {
        this.initializeGuardHands();
    }
}
```

### Snippet 2: Initialize Guard Hands Data

**Location:** `game/core/game.js`, new method

```javascript
initializeGuardHands() {
    // Initialize guard hands data structure for all 5 guards
    // Called on first load or when upgrading from older version

    this.player.guardHands = {
        jenkins: {
            lastDecorated: null,
            decorationCount: 0,
            totalTokensEarned: 0,
            currentDesign: null
        },
        martinez: {
            lastDecorated: null,
            decorationCount: 0,
            totalTokensEarned: 0,
            currentDesign: null
        },
        chen: {
            lastDecorated: null,
            decorationCount: 0,
            totalTokensEarned: 0,
            currentDesign: null
        },
        thompson: {
            lastDecorated: null,
            decorationCount: 0,
            totalTokensEarned: 0,
            currentDesign: null
        },
        rodriguez: {
            lastDecorated: null,
            decorationCount: 0,
            totalTokensEarned: 0,
            currentDesign: null
        }
    };

    console.log("[NAIL ART] Initialized guard hands data for 5 guards");
}
```

### Snippet 3: Lazy Load Nail Art System

**Location:** `game/core/game.js`, new method

```javascript
loadNailArtSystem() {
    // Lazy load nail art system on first use
    // Prevents loading heavy assets until player actually uses the feature

    if (!this.nailArtSystem) {
        console.log("[NAIL ART] Lazy loading nail art system...");

        // Dynamically load script
        const script = document.createElement('script');
        script.src = 'systems/guard-nail-art.js';
        script.onload = () => {
            this.nailArtSystem = new GuardNailArtSystem(this);
            console.log("[NAIL ART] System loaded successfully");
        };
        document.head.appendChild(script);
    }

    return this.nailArtSystem;
}
```

### Snippet 4: Add Prison Menu Buttons

**Location:** `game/core/game.js`, inside `showPrisonMenu()` or HTML generator

```javascript
// Add to prison menu button list
const nailArtButton = document.createElement('button');
nailArtButton.className = 'prison-menu-button';
nailArtButton.textContent = 'GIVE MANICURE TO GUARD';
nailArtButton.onclick = () => {
    // Lazy load system if not loaded
    if (!this.nailArtSystem) {
        this.loadNailArtSystem();
        setTimeout(() => this.nailArtSystem.startGuardSelection(), 100);
    } else {
        this.nailArtSystem.startGuardSelection();
    }
};

const galleryButton = document.createElement('button');
galleryButton.className = 'prison-menu-button';
galleryButton.textContent = 'VIEW MANICURE GALLERY';
galleryButton.onclick = () => {
    if (!this.nailArtSystem) {
        this.loadNailArtSystem();
        setTimeout(() => this.nailArtSystem.showGallery(), 100);
    } else {
        this.nailArtSystem.showGallery();
    }
};

// Insert into prison menu container
prisonMenuContainer.appendChild(nailArtButton);
prisonMenuContainer.appendChild(galleryButton);
```

### Snippet 5: Save/Load Integration

**Location:** `game/core/game.js`, inside `saveGame()` method (~line 1500+)

```javascript
saveGame() {
    const saveData = {
        // ... existing save data ...

        // NEW v1.6.0: Guard nail art data
        guardHands: this.player.guardHands,

        version: this.VERSION
    };

    // Save to localStorage
    localStorage.setItem('vroomVroomSave', JSON.stringify(saveData));

    // Also save to exportable save code
    this.generateSaveCode(saveData);

    console.log("[SAVE] Guard hands data saved:", this.player.guardHands);
}
```

**Location:** `game/core/game.js`, inside `loadGame()` method (~line 1600+)

```javascript
loadGame() {
    const savedData = localStorage.getItem('vroomVroomSave');
    if (!savedData) return false;

    try {
        const saveData = JSON.parse(savedData);

        // ... existing load logic ...

        // NEW v1.6.0: Load guard hands data
        if (saveData.guardHands) {
            this.player.guardHands = saveData.guardHands;
            console.log("[LOAD] Guard hands data loaded:", this.player.guardHands);
        } else {
            // Backwards compatibility: Initialize if missing
            console.log("[LOAD] No guard hands data found, initializing...");
            this.initializeGuardHands();
        }

        return true;
    } catch (error) {
        console.error("[LOAD] Failed to load guard hands data:", error);
        return false;
    }
}
```

### Snippet 6: Guard Dialogue Integration

**Location:** `game/core/game.js`, inside random event or guard interaction functions

```javascript
// When guard appears in event or dialogue
generateGuardDialogue(guardKey) {
    let dialogue = [];

    // ... existing dialogue generation ...

    // NEW v1.6.0: Reference nail decorations if present
    if (this.player.guardHands[guardKey]?.currentDesign) {
        const guardData = this.player.guardHands[guardKey];
        const daysSince = Math.floor((Date.now() - guardData.lastDecorated) / (1000 * 60 * 60 * 24));

        const nailReferenceDialogue = [
            `My nails still look fabulous, by the way. Thanks again.`,
            `I showed the other guards my nails. They're all jealous.`,
            `${daysSince} days and my nails still look perfect. You're talented.`,
            `When's our next manicure session? I'm ready for a new design.`,
            `Best manicure in the entire prison. Don't tell the warden.`
        ];

        dialogue.push(this.randomChoice(nailReferenceDialogue));

        // Optional: Show mini preview of decorated hands
        this.showNailMiniPreview(guardKey);
    }

    return dialogue;
}
```

### Snippet 7: Mini Nail Preview in Dialogue

**Location:** `game/core/game.js`, new method

```javascript
showNailMiniPreview(guardKey) {
    // Show small preview of guard's decorated nails in dialogue box
    // Uses smaller canvas (120x90) for compact display

    const designData = this.player.guardHands[guardKey]?.currentDesign;
    if (!designData) return;

    // Create mini canvas element
    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = 120;
    previewCanvas.height = 90;
    previewCanvas.className = 'nail-mini-preview';

    // Render simplified version of decorated hands
    if (this.nailArtSystem) {
        this.nailArtSystem.renderMiniPreview(previewCanvas, designData);
    }

    // Insert into dialogue box
    const dialogueBox = document.getElementById('eventDialogue');
    if (dialogueBox) {
        dialogueBox.appendChild(previewCanvas);
    }
}
```

### Snippet 8: Testing/Debug Commands

**Location:** `game/core/game.js`, inside `showTestMenu()` method (~line 4200+)

```javascript
showTestMenu() {
    // ... existing test commands ...

    // NEW v1.6.0: Nail art testing commands
    this.addTestCommand("Test Nail Art (Martinez)", () => {
        if (!this.nailArtSystem) this.loadNailArtSystem();
        setTimeout(() => this.nailArtSystem.startDecorationSession('martinez'), 100);
    });

    this.addTestCommand("Award 10 Favor Tokens", () => {
        this.player.favorTokens += 10;
        this.showMessage(`Added 10 favor tokens. Total: ${this.player.favorTokens}`, 2000);
    });

    this.addTestCommand("Reset All Guard Cooldowns", () => {
        Object.keys(this.player.guardHands).forEach(guardKey => {
            this.player.guardHands[guardKey].lastDecorated = null;
        });
        this.showMessage("All guard cooldowns reset. Ready to decorate!", 2000);
    });

    this.addTestCommand("Give Perfect Martinez Design", () => {
        // Auto-apply perfect design for Martinez (testing rewards)
        this.player.guardHands.martinez.currentDesign = {
            version: "1.0",
            timestamp: Date.now(),
            leftHand: [
                { baseColor: '#FFFFFF', specialEffect: 'chrome', pattern: 'french', stickers: [{type: 'gem-diamond', position: {x:15, y:20}, size: 'small'}], glitter: false },
                { baseColor: '#FFFFFF', specialEffect: 'chrome', pattern: 'french', stickers: [{type: 'gem-diamond', position: {x:15, y:20}, size: 'small'}], glitter: false },
                { baseColor: '#FFFFFF', specialEffect: 'chrome', pattern: 'french', stickers: [{type: 'gem-diamond', position: {x:15, y:20}, size: 'small'}], glitter: false },
                { baseColor: '#FFFFFF', specialEffect: 'chrome', pattern: 'french', stickers: [{type: 'gem-diamond', position: {x:15, y:20}, size: 'small'}], glitter: false },
                { baseColor: '#FFFFFF', specialEffect: 'chrome', pattern: 'french', stickers: [{type: 'gem-diamond', position: {x:15, y:20}, size: 'small'}], glitter: false }
            ],
            rightHand: [ /* Same as leftHand for symmetry */ ],
            decorationTime: 90,
            tokensEarned: 4,
            satisfactionLevel: 'delighted'
        };
        this.player.favorTokens += 4;
        this.showMessage("Perfect Martinez design applied! +4 tokens", 2000);
    });

    this.addTestCommand("View Nail Art Gallery", () => {
        if (!this.nailArtSystem) this.loadNailArtSystem();
        setTimeout(() => this.nailArtSystem.showGallery(), 100);
    });
}
```

### Snippet 9: HTML Screen Template

**Location:** `game/index.html`, add new screen elements

```html
<!-- NAIL ART DECORATION SCREEN -->
<div id="nailArtDecoration" class="screen" style="display: none;">
    <div class="nail-art-container">
        <!-- Header -->
        <div class="nail-art-header">
            <h1>GUARD NAIL ART DECORATION</h1>
            <div class="nail-art-info">
                <span id="currentGuardName">Guard: Martinez</span>
                <span id="sessionNumber">Session #3</span>
                <span id="bestTokens">Best: 4 tokens</span>
            </div>
        </div>

        <!-- Main Content -->
        <div class="nail-art-content">
            <!-- Tool Panel (Left Side) -->
            <div class="nail-art-tools">
                <h3>COLORS</h3>
                <div id="colorPalette" class="color-palette">
                    <!-- Color swatches dynamically generated -->
                </div>

                <h3>EFFECTS</h3>
                <div id="effectSelector" class="effect-selector">
                    <!-- Effect radio buttons dynamically generated -->
                </div>

                <h3>PATTERNS</h3>
                <div id="patternSelector" class="pattern-selector">
                    <!-- Pattern radio buttons dynamically generated -->
                </div>

                <h3>STICKERS</h3>
                <div id="stickerPalette" class="sticker-palette">
                    <!-- Sticker icons dynamically generated -->
                </div>

                <h3>GLITTER</h3>
                <div id="glitterToggle" class="glitter-toggle">
                    <button id="glitterOn" class="toggle-btn">ON</button>
                    <button id="glitterOff" class="toggle-btn active">OFF</button>
                </div>
            </div>

            <!-- Canvas (Center) -->
            <div class="nail-art-canvas-container">
                <canvas id="nailArtCanvas" width="800" height="600"></canvas>

                <!-- Current Nail Preview -->
                <div class="current-nail-preview">
                    <h4>Current Nail: <span id="selectedNailName">Left Thumb</span></h4>
                    <p>Base: <span id="selectedNailColor">None</span></p>
                    <p>Effect: <span id="selectedNailEffect">None</span></p>
                    <p>Pattern: <span id="selectedNailPattern">Solid</span></p>
                    <p>Stickers: <span id="selectedNailStickers">None</span></p>
                    <p>Glitter: <span id="selectedNailGlitter">No</span></p>
                </div>
            </div>
        </div>

        <!-- Control Buttons (Bottom) -->
        <div class="nail-art-controls">
            <button id="undoBtn" class="control-btn undo-btn">UNDO</button>
            <button id="clearNailBtn" class="control-btn clear-nail-btn">CLEAR NAIL</button>
            <button id="clearAllBtn" class="control-btn clear-all-btn">CLEAR ALL</button>
            <button id="previewBtn" class="control-btn preview-btn">PREVIEW</button>
            <button id="saveDesignBtn" class="control-btn save-btn">SAVE</button>
            <button id="cancelBtn" class="control-btn cancel-btn">CANCEL</button>
        </div>
    </div>
</div>

<!-- GUARD SELECTION SCREEN -->
<div id="guardSelection" class="screen" style="display: none;">
    <h1>SELECT GUARD TO DECORATE</h1>
    <div id="guardSelectionList" class="guard-selection-list">
        <!-- Guard cards dynamically generated -->
    </div>
    <button onclick="game.showScreen('prisonMenu')" class="back-btn">BACK TO PRISON</button>
</div>

<!-- MANICURE GALLERY SCREEN -->
<div id="manicureGallery" class="screen" style="display: none;">
    <h1>GUARD MANICURE GALLERY</h1>
    <p class="gallery-subtitle">Your Masterpieces</p>
    <div id="galleryGrid" class="gallery-grid">
        <!-- Gallery cards dynamically generated -->
    </div>
    <div class="gallery-stats">
        <p>Total Manicures: <span id="totalManicures">0</span></p>
        <p>Total Tokens Earned: <span id="totalTokensFromNails">0</span></p>
    </div>
    <button onclick="game.showScreen('prisonMenu')" class="back-btn">BACK TO PRISON</button>
</div>

<!-- GUARD REACTION SCREEN -->
<div id="guardReaction" class="screen" style="display: none;">
    <h1>GUARD REACTION</h1>
    <div class="reaction-content">
        <canvas id="reactionCanvas" width="800" height="600"></canvas>
        <h2 id="reactionGuardName">Guard Martinez</h2>
        <p id="reactionDialogue" class="reaction-dialogue">"MAGNIFICO! Perfect work!"</p>

        <div class="reward-breakdown">
            <h3>REWARD BREAKDOWN</h3>
            <p>Base: <span id="baseTokenReward">1 token</span></p>
            <p>Completeness Bonus: <span id="completenessBonus">+1 token</span></p>
            <p>Preference Bonus: <span id="preferenceBonus">+1 token</span></p>
            <p>Special Bonus: <span id="specialBonus">+1 token</span></p>
            <hr>
            <p class="total-reward">TOTAL: <span id="totalTokenReward">4 FAVOR TOKENS</span></p>
        </div>

        <p class="satisfaction-level">Satisfaction: <span id="satisfactionLevel">DELIGHTED</span></p>
    </div>
    <button onclick="game.nailArtSystem.returnToPrison()" class="continue-btn">CONTINUE</button>
</div>
```

### Snippet 10: CSS Styling

**Location:** `game/styles/main.css` or new `nail-art.css`

```css
/* NAIL ART DECORATION SCREEN */
.nail-art-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #1a1a1a;
    color: #fff;
    font-family: monospace;
}

.nail-art-header {
    background-color: #2a2a2a;
    padding: 20px;
    border-bottom: 2px solid #444;
}

.nail-art-info {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 14px;
    color: #aaa;
}

.nail-art-content {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.nail-art-tools {
    width: 220px;
    background-color: #222;
    padding: 20px;
    overflow-y: auto;
    border-right: 2px solid #444;
}

.nail-art-tools h3 {
    margin-top: 20px;
    margin-bottom: 10px;
    color: #FFD700;
    font-size: 14px;
}

.color-palette {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 5px;
}

.color-swatch {
    width: 36px;
    height: 36px;
    border: 2px solid #555;
    cursor: pointer;
    transition: all 0.2s;
}

.color-swatch:hover {
    transform: scale(1.1);
    border-color: #aaa;
}

.color-swatch.selected {
    border: 4px solid #FFD700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.effect-selector,
.pattern-selector {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.effect-option,
.pattern-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    background-color: #2a2a2a;
    border: 1px solid #444;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.effect-option:hover,
.pattern-option:hover {
    background-color: #333;
}

.effect-option.selected,
.pattern-option.selected {
    background-color: #444;
    border-color: #FFD700;
}

.sticker-palette {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
}

.sticker-icon {
    width: 40px;
    height: 40px;
    background-color: #2a2a2a;
    border: 1px solid #444;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    transition: all 0.2s;
}

.sticker-icon:hover {
    transform: scale(1.1);
    background-color: #333;
}

.glitter-toggle {
    display: flex;
    gap: 10px;
}

.toggle-btn {
    flex: 1;
    padding: 10px;
    background-color: #2a2a2a;
    border: 2px solid #444;
    color: #fff;
    font-family: monospace;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
}

.toggle-btn:hover {
    background-color: #333;
}

.toggle-btn.active {
    background-color: #FFD700;
    color: #000;
    border-color: #FFD700;
}

.nail-art-canvas-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
}

#nailArtCanvas {
    border: 2px solid #444;
    background-color: #1a1a1a;
    max-width: 100%;
    height: auto;
}

.current-nail-preview {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background-color: rgba(0, 0, 0, 0.9);
    border: 2px solid #FFD700;
    padding: 15px;
    border-radius: 8px;
    min-width: 250px;
}

.current-nail-preview h4 {
    margin-top: 0;
    color: #FFD700;
    font-size: 16px;
}

.current-nail-preview p {
    margin: 5px 0;
    font-size: 14px;
}

.nail-art-controls {
    display: flex;
    gap: 10px;
    padding: 20px;
    background-color: #2a2a2a;
    border-top: 2px solid #444;
}

.control-btn {
    flex: 1;
    padding: 15px 20px;
    font-family: monospace;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

.control-btn:hover {
    filter: brightness(1.2);
    transform: translateY(-2px);
}

.control-btn:active {
    transform: translateY(0) scale(0.95);
}

.undo-btn { background-color: #FFA500; color: #000; }
.clear-nail-btn { background-color: #FF6347; color: #fff; }
.clear-all-btn { background-color: #DC143C; color: #fff; }
.preview-btn { background-color: #4682B4; color: #fff; }
.save-btn { background-color: #32CD32; color: #000; }
.cancel-btn { background-color: #696969; color: #fff; }

/* GUARD SELECTION SCREEN */
.guard-selection-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.guard-card {
    background-color: #2a2a2a;
    border: 2px solid #555;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    gap: 20px;
    cursor: pointer;
    transition: all 0.3s;
}

.guard-card:hover {
    background-color: #3a3a3a;
    border-color: #FFD700;
    transform: translateX(5px);
}

.guard-card-preview {
    width: 120px;
    height: 90px;
    background-color: #1a1a1a;
    border: 1px solid #444;
    border-radius: 4px;
}

.guard-card-info {
    flex: 1;
}

.guard-card-info h3 {
    margin-top: 0;
    color: #FFD700;
}

.guard-card-info p {
    margin: 5px 0;
    color: #aaa;
}

.guard-card-button {
    align-self: center;
    padding: 15px 30px;
    background-color: #32CD32;
    color: #000;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.guard-card-button:disabled {
    background-color: #555;
    color: #888;
    cursor: not-allowed;
}

/* MANICURE GALLERY */
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.gallery-card {
    background-color: #2a2a2a;
    border: 2px solid #555;
    border-radius: 8px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.3s;
}

.gallery-card:hover {
    border-color: #FFD700;
    transform: scale(1.05);
}

.gallery-thumbnail {
    width: 100%;
    aspect-ratio: 4/3;
    background-color: #1a1a1a;
    border: 1px solid #444;
    border-radius: 4px;
    margin-bottom: 10px;
}

.gallery-card h3 {
    margin: 10px 0 5px 0;
    color: #FFD700;
    text-align: center;
}

.gallery-card p {
    text-align: center;
    color: #aaa;
    font-size: 14px;
}

.gallery-stats {
    text-align: center;
    padding: 20px;
    font-size: 18px;
    color: #FFD700;
}

/* GUARD REACTION SCREEN */
.reaction-content {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
}

#reactionCanvas {
    border: 2px solid #FFD700;
    margin: 20px auto;
    display: block;
}

.reaction-dialogue {
    font-size: 20px;
    font-style: italic;
    color: #FFD700;
    margin: 30px 0;
    padding: 20px;
    background-color: rgba(255, 215, 0, 0.1);
    border-radius: 8px;
}

.reward-breakdown {
    background-color: #2a2a2a;
    border: 2px solid #444;
    border-radius: 8px;
    padding: 20px;
    margin: 30px 0;
}

.reward-breakdown h3 {
    color: #FFD700;
    margin-top: 0;
}

.reward-breakdown p {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    font-size: 16px;
}

.reward-breakdown hr {
    border: none;
    border-top: 2px solid #444;
    margin: 15px 0;
}

.total-reward {
    font-size: 24px !important;
    font-weight: bold;
    color: #32CD32;
}

.satisfaction-level {
    font-size: 20px;
    font-weight: bold;
    color: #FFD700;
}

.continue-btn {
    padding: 15px 50px;
    font-size: 18px;
    font-weight: bold;
    background-color: #32CD32;
    color: #000;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 30px;
}

.continue-btn:hover {
    filter: brightness(1.2);
}

/* MOBILE RESPONSIVE */
@media (max-width: 768px) {
    .nail-art-content {
        flex-direction: column;
    }

    .nail-art-tools {
        width: 100%;
        max-height: 200px;
        border-right: none;
        border-bottom: 2px solid #444;
    }

    #nailArtCanvas {
        width: 100%;
        height: auto;
    }

    .current-nail-preview {
        position: static;
        margin-top: 20px;
    }

    .nail-art-controls {
        flex-wrap: wrap;
    }

    .control-btn {
        flex: 1 1 calc(50% - 5px);
        min-width: 120px;
    }

    .gallery-grid {
        grid-template-columns: 1fr;
    }
}
```

---

## TESTING & VALIDATION

### Unit Testing Checklist

**Decoration System:**
- [ ] All 15 base colors apply correctly
- [ ] Special effects render properly (chrome, holographic, etc.)
- [ ] Patterns apply correctly (french tip, ombre, solid)
- [ ] Stickers can be added (max 5 per nail enforced)
- [ ] Stickers can be removed individually
- [ ] Glitter toggle works on all nails
- [ ] Undo function reverts last 10 actions
- [ ] Clear current nail resets selected nail
- [ ] Clear all nails prompts confirmation and resets all
- [ ] Preview mode rotates hands smoothly

**Reward Calculation:**
- [ ] Base 1 token always awarded on completion
- [ ] Completeness bonus (+1) awarded for all 10 nails
- [ ] Color preference bonus calculated correctly (60% threshold)
- [ ] Jenkins no-sticker bonus works
- [ ] Martinez symmetry bonus works
- [ ] Chen speed bonus works (under 2 minutes)
- [ ] Thompson sticker bonus works (15+ stickers)
- [ ] Rodriguez glitter bonus works (80%+ nails)
- [ ] Rodriguez holographic bonus works (5+ nails)
- [ ] Maximum 4 tokens enforced (1 base + 3 bonus)

**Persistence:**
- [ ] Decoration saves to player.guardHands on completion
- [ ] Last decorated timestamp recorded
- [ ] Decoration count increments correctly
- [ ] Total tokens earned tracked per guard
- [ ] Save game includes guardHands data
- [ ] Load game restores guardHands data
- [ ] Backwards compatibility initializes missing data

**Cooldown System:**
- [ ] 24-hour cooldown enforced per guard
- [ ] Cooldown timer displays remaining hours
- [ ] Button disabled during cooldown
- [ ] Can rotate between 5 guards (no global cooldown)
- [ ] Debug command resets cooldowns

**Diminishing Returns:**
- [ ] First 3 decorations: 100% rewards
- [ ] Decorations 4-6: 75% rewards
- [ ] Decorations 7-10: 50% rewards
- [ ] Decorations 11+: 25% rewards (minimum 1 token)
- [ ] Multiplier applied correctly to earned tokens

**UI/UX:**
- [ ] Guard selection screen shows all 5 guards
- [ ] Mini previews render current designs
- [ ] Decoration interface loads correctly
- [ ] Selected nail highlighted on canvas
- [ ] Current nail preview updates in real-time
- [ ] Tool panels responsive and clickable
- [ ] Control buttons trigger correct actions
- [ ] Guard reaction screen displays correct dialogue
- [ ] Reward breakdown shows all bonuses
- [ ] Gallery screen shows all decorated guards
- [ ] Gallery thumbnails render correctly
- [ ] Full-screen preview opens on card click

**Mobile Optimization:**
- [ ] Touch controls work on canvas (select nails)
- [ ] Color swatches large enough (48px minimum)
- [ ] Buttons stack vertically on small screens
- [ ] Canvas scales to fit screen width
- [ ] Tool panels scroll correctly
- [ ] Glitter particle count reduced (20 vs 50)
- [ ] Frame rate capped at 30 FPS

**Integration:**
- [ ] Prison menu buttons appear correctly
- [ ] Lazy loading works (script loaded on first use)
- [ ] Guard dialogue references nails if decorated
- [ ] Mini preview appears in dialogue box
- [ ] Testing menu commands work
- [ ] Save/load includes nail art data
- [ ] Exportable save codes include nail art data

### Manual Testing Scenarios

**Scenario 1: First-Time User**
1. Start new game, reach prison
2. Click "GIVE MANICURE TO GUARD"
3. Select Guard Martinez (never decorated)
4. Decorate all 10 nails with white + chrome + french tip + gems
5. Save design
6. Verify 4 tokens awarded (completeness + symmetry + color preference)
7. Check gallery shows Martinez with decorated hands

**Scenario 2: Preference Matching**
1. Select Guard Rodriguez
2. Decorate with hot pink + holographic + ombre + glitter on all nails
3. Add 5+ stickers per nail (stars, gems)
4. Save design
5. Verify 4 tokens awarded (all bonuses: completeness, color, holographic, glitter)
6. Verify reaction: "GORGEOUS!" dialogue

**Scenario 3: Minimal Decoration**
1. Select Guard Chen
2. Decorate only 3 nails with black + matte
3. Complete in under 2 minutes
4. Save design
5. Verify 2 tokens awarded (base + speed bonus)
6. Verify reaction: "Quick and clean" dialogue

**Scenario 4: Cooldown System**
1. Decorate Jenkins completely
2. Immediately try to decorate Jenkins again
3. Verify button disabled with cooldown timer
4. Select different guard (Martinez)
5. Verify can decorate different guard
6. Use debug command to reset cooldown
7. Verify Jenkins available again

**Scenario 5: Gallery & Persistence**
1. Decorate all 5 guards over multiple sessions
2. Save game and close browser
3. Reload game
4. Open manicure gallery
5. Verify all 5 guards show correct decorations
6. Click on Rodriguez to view full-screen
7. Verify design details and statistics correct

**Scenario 6: Guard Dialogue Integration**
1. Decorate Martinez beautifully
2. Trigger random prison event with Martinez
3. Verify Martinez references their nails in dialogue
4. Verify mini preview shows decorated hands in dialogue box

**Scenario 7: Diminishing Returns**
1. Decorate Jenkins 3 times (track tokens earned)
2. Verify decorations 1-3 award full tokens
3. Decorate Jenkins 3 more times
4. Verify decorations 4-6 award 75% tokens
5. Verify total tokens tracked correctly

**Scenario 8: Mobile Testing**
1. Load game on mobile device (iPhone/Android)
2. Open nail art decoration screen
3. Verify canvas fits screen width
4. Verify touch controls work (select nails, swatches)
5. Verify buttons stack vertically
6. Verify scrolling works on tool panels
7. Verify performance smooth (30 FPS)

### Performance Benchmarks

**Desktop (1920x1080, 60 FPS target):**
- Canvas render time: <16ms per frame
- Nail decoration application: <50ms
- Gallery thumbnail generation: <100ms per thumbnail
- Save operation: <200ms
- Load operation: <300ms

**Mobile (iPhone 12, 30 FPS target):**
- Canvas render time: <33ms per frame
- Nail decoration application: <100ms
- Gallery thumbnail generation: <200ms per thumbnail
- Save operation: <400ms
- Load operation: <600ms

**Memory Usage:**
- Desktop: <50MB for nail art system assets
- Mobile: <30MB for optimized assets
- No memory leaks after 10 decoration sessions

### Bug Tracking Template

```
BUG REPORT:
Title: [Brief description]
Severity: Critical | High | Medium | Low
Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Behavior: [What should happen]
Actual Behavior: [What actually happens]
Screenshots: [If applicable]
Environment: Desktop | Mobile | Browser version
Related Code: [File and line number]
```

---

## FUTURE EXPANSION OPPORTUNITIES

### Phase 2 Enhancements (v1.7.0+)

**1. Nail Art Competition System**
- Weekly contests: "Best Martinez Design"
- Other prisoners vote on designs
- Winner gets bonus favor tokens + reputation
- Leaderboard of top nail artists in prison

**2. Advanced Decoration Tools**
- **Custom Patterns:** Player-drawn designs (freehand mode)
- **Gradients:** Multi-color ombre (3+ colors)
- **Textures:** Wood grain, marble, snake skin
- **Decals:** Prison-themed (barbed wire, handcuffs, etc.)
- **3D Elements:** Raised studs, rhinestones with depth

**3. Guard Nail Care Simulation**
- Nails degrade over time (chip, fade)
- Guards request touch-ups (maintenance sessions)
- Better quality decorations last longer
- Urgent repair requests (guard event)

**4. Nail Polish Brand System**
- Different polish brands with quality tiers
- Cheap polish: Chips easily, limited colors
- Premium polish: Lasts longer, more colors, special effects
- Rare polish: Holographic, glow-in-dark, color-changing
- Acquire via commissary or conjugal visit smuggling

**5. Nail Art Skill Progression**
- Skill level: Beginner → Intermediate → Expert → Master
- Unlock new decoration options as skill increases
- Faster decoration time at higher skill
- Higher skill = better guard reactions (bonus multiplier)
- Skill increases with each decoration session

**6. Guard Nail Art Preferences Evolution**
- Guards change preferences over time
- Seasonal preferences (holiday themes)
- Guards get bored of repeated designs (diminishing satisfaction)
- Surprise guards with new styles for bonus tokens

**7. Expanded Guard Roster**
- Add 5 more guards (total 10)
- Each with unique personality and preferences
- Special guards: Warden, Captain, Rookie
- Secret guard unlocked at high reputation

**8. Nail Art Tutorials**
- In-game tutorial system for new players
- Step-by-step guided decorations
- Practice mode (no cost, no rewards)
- Achievements for completing tutorials

**9. Nail Art Business System**
- Accept decoration requests from other prisoners
- Earn credits + reputation
- Build clientele (recurring customers)
- Rival nail artist (competition)

**10. Photo Mode & Sharing**
- Screenshot decorated hands
- Export as PNG image
- Share code for designs (other players can import)
- Gallery of community-created designs

### Technical Debt & Optimizations

**Rendering Performance:**
- Implement WebGL shaders for effects (chrome, holographic)
- Use off-screen canvas for caching
- Lazy load sticker sprites (only load used stickers)
- Progressive loading for gallery thumbnails

**Data Compression:**
- Compress decoration data (Base64 encoding)
- Delta compression for save files
- Reduce save file size by 30-40%

**Accessibility Improvements:**
- Full keyboard navigation implementation
- Screen reader optimization
- High contrast mode for color blindness
- Haptic feedback API for mobile

**Code Quality:**
- Refactor GuardNailArtSystem into smaller modules
- Add TypeScript definitions for type safety
- Comprehensive JSDoc documentation
- Unit test coverage (80%+ target)

---

## APPENDIX: QUICK REFERENCE

### Color Palette Reference

| Name | Hex | RGB | Category |
|------|-----|-----|----------|
| Hot Pink | #FF1493 | (255, 20, 147) | Glamour |
| Brilliant Red | #FF0000 | (255, 0, 0) | Glamour |
| Gold | #FFD700 | (255, 215, 0) | Glamour |
| Pure White | #FFFFFF | (255, 255, 255) | Glamour |
| Midnight Black | #000000 | (0, 0, 0) | Glamour |
| Rust Brown | #8B7355 | (139, 115, 85) | Dystopian |
| Olive Drab | #6B8E23 | (107, 142, 35) | Dystopian |
| Slate Gray | #708090 | (112, 128, 144) | Dystopian |
| Steel Blue | #4682B4 | (70, 130, 180) | Dystopian |
| Dark Red | #8B0000 | (139, 0, 0) | Dystopian |
| Light Pink | #FFB6C1 | (255, 182, 193) | Pastel |
| Lavender | #E6E6FA | (230, 230, 250) | Pastel |
| Pale Green | #98FB98 | (152, 251, 152) | Pastel |
| Peach | #FFE4B5 | (255, 228, 181) | Pastel |
| Powder Blue | #B0E0E6 | (176, 224, 230) | Pastel |

### Guard Preference Quick Reference

| Guard | Favorite Colors | Favorite Effects | Special Bonus |
|-------|----------------|------------------|---------------|
| Jenkins | Red, Black | Matte | No stickers |
| Martinez | White, Gold, Pink | Chrome, Glossy | Symmetry |
| Chen | Black, Dark Purple, Gray | Matte | Speed (<2 min) |
| Thompson | Pastels (Pink, Green, Peach) | Glossy, Iridescent | Many stickers (15+) |
| Rodriguez | Hot Pink, Gold, Red | Holographic, Chrome | Glitter + Holo |

### Token Economy Reference

| Action | Cost (Credits) | Time (Minutes) | Reward (Tokens) |
|--------|---------------|----------------|-----------------|
| Decorate Guard (Minimal) | 20 | 45 | 1 |
| Decorate Guard (Decent) | 20 | 45 | 2 |
| Decorate Guard (Good) | 20 | 45 | 3 |
| Decorate Guard (Perfect) | 20 | 45 | 4 |

| Favor Token Use | Cost (Tokens) |
|----------------|---------------|
| Skip 1 day sentence | 2 |
| Extra commissary item | 3 |
| Private cell upgrade | 8 |
| Ignore minor violation | 4 |
| Reduce sentence 5 days | 15 |
| Smuggle contraband | 10 |

### Keyboard Shortcuts Reference

| Key | Action |
|-----|--------|
| 1-5 | Select left hand nails (thumb to pinky) |
| Shift+1-5 | Select right hand nails (thumb to pinky) |
| C | Cycle through colors |
| E | Cycle through effects |
| P | Cycle through patterns |
| G | Toggle glitter |
| Space | Toggle glitter |
| Z | Undo last action |
| X | Clear current nail |
| Shift+X | Clear all nails |
| V | Preview mode |
| Enter | Save design |
| Esc | Cancel/exit |
| Tab | Next tool panel |
| Shift+Tab | Previous tool panel |

### File Size Reference

**Estimated File Sizes:**
- `guard-nail-art.js`: ~80 KB (minified)
- `nail-sticker-atlas.png`: ~150 KB (compressed)
- `nail-effects.png`: ~50 KB (compressed)
- `nail-art.css`: ~15 KB (minified)
- **Total new assets:** ~300 KB

**Save Data Impact:**
- Per guard decoration: ~500 bytes
- 5 guards fully decorated: ~2.5 KB
- Negligible impact on save file size

---

## CONCLUSION

This Nail Art Decoration System transforms a simple mini-game into a comprehensive creative expression system with:

✅ **40+ decoration options** (colors, effects, patterns, stickers)
✅ **Persistent designs** saved per guard and viewable throughout game
✅ **Quality-based rewards** (1-4 favor tokens)
✅ **Guard personality preferences** with unique reactions
✅ **Balanced economy** preventing exploitation
✅ **Manicure gallery** for viewing all creations
✅ **Mobile optimization** for touch controls
✅ **Future expansion** opportunities (competitions, skills, business)

**Design Status:** ✅ COMPLETE - Ready for collaboration with isometric-pixel-artist agent

**Next Steps:**
1. Artist agent creates isometric hand sprites and sticker assets
2. Implement GuardNailArtSystem class (~800 lines)
3. Create HTML/CSS UI elements
4. Integrate with existing game systems
5. Unit testing and validation
6. Mobile optimization and performance testing
7. Deploy in v1.6.0 release

**Estimated Implementation Time:** 12-16 hours (including artist collaboration)

---

**Document Version:** 1.0.0
**Created:** 2025-10-19
**Designer:** game-dev-specialist agent
**Status:** Design Complete - Awaiting Artist Assets

*"In a dystopian world where driving is illegal, prisoners find freedom through fabulous nail art. This is VROOM VROOM."* 💅✨
