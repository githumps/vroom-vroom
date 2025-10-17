# ACE ATTORNEY COURTROOM SYSTEM
**Feature Name:** Ace Attorney-Style Visual Novel Courtroom
**Target Version:** v1.5.0
**Status:** Design Phase - Implementation Ready
**Created:** 2025-10-16
**Art Style:** Ace Attorney + Darkest Dungeon + Disco Elysium

---

## TABLE OF CONTENTS
1. [Vision Overview](#vision-overview)
2. [Visual Design Specifications](#visual-design-specifications)
3. [Judge Hardcastle Sprite States](#judge-hardcastle-sprite-states)
4. [Technical Architecture](#technical-architecture)
5. [Canvas Rendering System](#canvas-rendering-system)
6. [Animation System](#animation-system)
7. [Atmosphere & Mood System](#atmosphere--mood-system)
8. [Integration with Existing System](#integration-with-existing-system)
9. [Sound Design Integration](#sound-design-integration)
10. [Mobile Support](#mobile-support)
11. [Performance Optimization](#performance-optimization)
12. [Implementation Timeline](#implementation-timeline)

---

## VISION OVERVIEW

Transform the current text-based courtroom into an **Ace Attorney-inspired visual novel experience** with the **oppressive atmosphere** of Darkest Dungeon and Disco Elysium. Players will face Judge Hardcastle as a massive, expressive character sprite that dominates the screen, escalating visually as their bureaucratic mistakes pile up.

### Core Principles
- **Expressive Character Art** - Judge fills 70-80% of screen in "Judge View"
- **Oppressive Atmosphere** - Darkest Dungeon color palette and mood
- **Dynamic Anger Visualization** - 6 distinct visual states tied to patience meter
- **Smooth Animations** - Subtle breathing, blinking, anger escalation
- **Screen Effects** - Shake, vignette, film grain, color grading
- **Visual Novel Flow** - Desk view (forms) ↔ Judge view (reactions)

### Mood & Tone
Players should feel **dread** as Judge Hardcastle's anger escalates. The courtroom is **dim, oppressive, bureaucratic**. Each mistake makes the judge more **visibly furious** - veins pulse, face reddens, gavel raises. At 100 patience, he achieves **volcanic apoplexy**.

---

## VISUAL DESIGN SPECIFICATIONS

### Overall Art Style

#### Color Palette (Darkest Dungeon/Disco Elysium)
```javascript
const COURTROOM_PALETTE = {
    // Base colors (desaturated)
    background: '#1a1612',      // Dark brown-black
    wallpaper: '#2d2418',       // Slightly lighter brown
    wood: '#3d2f1f',            // Mahogany brown

    // Judge desk
    deskDark: '#2a1f15',
    deskLight: '#48362a',

    // Lighting
    candlelight: '#ffd995',     // Warm, dim light
    shadow: 'rgba(0,0,0,0.7)',  // Deep shadows

    // Judge skin tones (progression)
    skinNeutral: '#c5a789',     // Pale, sickly
    skinIrritated: '#cc8866',   // Slight warmth
    skinAngry: '#dd6655',       // Reddening
    skinFurious: '#ee5544',     // Red
    skinApoplectic: '#dd3333',  // Crimson
    skinVolcanic: '#aa2244',    // Purple-red

    // UI elements
    paperWhite: '#f5ede1',      // Off-white, aged paper
    inkBlack: '#1a1612',
    stampRed: '#8b0000',
};
```

#### Visual Effects
- **Vignette** - Heavy darkening at edges (40% opacity black radial gradient)
- **Film Grain** - Subtle noise texture (15% opacity, animated)
- **Chiaroscuro** - Strong light/shadow contrast from single light source (desk lamp)
- **Brush Strokes** - Visible texture in background (CSS filter or canvas noise)
- **Color Grading** - Desaturated except for anger states (reds become vivid)

### Layout Specifications

#### Judge View (70% of screen)
```
┌─────────────────────────────────────┐
│  COURTROOM BACKGROUND (Dark, moody) │
│  ┌─────────────────────────────┐   │
│  │                             │   │  ← Vignette edges
│  │    JUDGE BENCH (wood)       │   │
│  │  ┌─────────────────────┐   │   │
│  │  │  JUDGE HARDCASTLE   │   │   │  ← 70-80% vertical
│  │  │  (Large sprite)      │   │   │
│  │  │                      │   │   │
│  │  │  Angry expression    │   │   │
│  │  │  Veins pulsing       │   │   │
│  │  └─────────────────────┘   │   │
│  │    Patience: [████░░] 67%   │   │  ← Visible meter
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ "OBJECTION! Your form is... │   │  ← Dialogue box
│  │  [CONTINUE]                  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Desk View (Forms/Paperwork)
```
┌─────────────────────────────────────┐
│        COURTROOM BACKGROUND         │
│  ┌─────────────────────────────┐   │
│  │  Desk surface (top-down)    │   │
│  │  ┌───────────────────┐      │   │
│  │  │ PARKING VIOLATION │      │   │
│  │  │ FORM 27-B         │      │   │  ← Form front-center
│  │  │                   │      │   │
│  │  │ [Input fields]    │      │   │
│  │  │                   │      │   │
│  │  └───────────────────┘      │   │
│  │     [Stamp] [Submit]        │   │  ← Action buttons
│  └─────────────────────────────┘   │
│  Judge patience: [█████░] 87%      │  ← Small meter
└─────────────────────────────────────┘
```

---

## JUDGE HARDCASTLE SPRITE STATES

Each state represents a range on the patience meter (0-100). As player makes mistakes, patience **increases** (meter fills up) and Judge becomes more angry.

### State 1: NEUTRAL (Patience 0-15)
**Mood:** Tired, bored, bureaucratically numb

**Visual Description:**
- **Face:** Neutral expression, bags under eyes
- **Eyes:** Half-closed, occasionally blinking slowly
- **Body:** Slumped slightly in chair
- **Hands:** One hand propping up chin, other holding gavel limply
- **Color:** Fully desaturated skin (#c5a789), gray-brown judge robes
- **Lighting:** Dim, even lighting
- **Background:** Dark courtroom, barely visible

**Animation Loop (2 seconds):**
- Frame 1-4: Idle (0.5s)
- Frame 5-6: Eyes close (0.2s)
- Frame 7-8: Eyes open (0.2s)
- Frame 9-12: Idle (0.5s)
- Frame 13: Slight head tilt (0.1s)
- Frame 14-16: Return to idle (0.5s)

**Canvas Drawing Specs:**
```javascript
drawJudgeNeutral(ctx, x, y, frame) {
    // Head (oval)
    ctx.fillStyle = '#c5a789';
    ctx.fillEllipse(x, y, 180, 220);

    // Eyes (half-closed)
    const eyeOpenness = frame < 5 ? 0.5 : (frame < 7 ? 0.1 : 0.5);
    ctx.fillStyle = '#2a1f15';
    ctx.fillEllipse(x-40, y-30, 15, 20 * eyeOpenness);
    ctx.fillEllipse(x+40, y-30, 15, 20 * eyeOpenness);

    // Mouth (slight frown)
    ctx.strokeStyle = '#3d2f1f';
    ctx.lineWidth = 3;
    ctx.arc(x, y+40, 25, 0.2, 2.94, false);

    // Judge robe collar
    ctx.fillStyle = '#1a1612';
    ctx.fillRect(x-120, y+180, 240, 120);

    // Judge's bench (wood)
    ctx.fillStyle = '#3d2f1f';
    ctx.fillRect(0, y+250, canvas.width, 150);
}
```

---

### State 2: IRRITATED (Patience 16-35)
**Mood:** Starting to lose patience, bureaucratic annoyance

**Visual Description:**
- **Face:** Slight frown, furrowed brow
- **Eyes:** More focused, staring at player
- **Body:** Sitting up straighter
- **Hands:** Fingers drumming on desk (animated)
- **Color:** Very slight warmth to skin (#cc8866)
- **Lighting:** Slightly brighter on face (focus)
- **Details:** Slight tension lines on forehead

**Animation Loop (1.5 seconds):**
- Frame 1-3: Idle with frown (0.3s)
- Frame 4: First finger taps desk (0.1s)
- Frame 5: Second finger taps (0.1s)
- Frame 6: Third finger taps (0.1s)
- Frame 7: Fourth finger taps (0.1s)
- Frame 8-9: Brief eye squint (0.2s)
- Frame 10-12: Return to idle (0.3s)
- Frame 13-15: Slow blink (0.3s)

**New Visual Elements:**
- Finger drumming animation on desk
- Eyebrows slightly furrowed
- Mouth corners pulled down
- Tension lines appear on forehead (thin, subtle)

**Canvas Drawing Specs:**
```javascript
drawJudgeIrritated(ctx, x, y, frame) {
    // Warmer skin tone
    ctx.fillStyle = '#cc8866';
    ctx.fillEllipse(x, y, 180, 220);

    // Eyes (focused stare)
    ctx.fillStyle = '#2a1f15';
    ctx.fillEllipse(x-40, y-30, 15, 25);
    ctx.fillEllipse(x+40, y-30, 15, 25);

    // Pupils (tracking player)
    ctx.fillStyle = '#000000';
    ctx.fillCircle(x-40, y-25, 6);
    ctx.fillCircle(x+40, y-25, 6);

    // Furrowed brow
    ctx.strokeStyle = '#8b6f47';
    ctx.lineWidth = 2;
    ctx.moveTo(x-60, y-50);
    ctx.lineTo(x-30, y-55);
    ctx.moveTo(x+60, y-50);
    ctx.lineTo(x+30, y-55);
    ctx.stroke();

    // Frown
    ctx.arc(x, y+50, 30, 0.3, 2.84, false);

    // Finger drumming (if in drum frames)
    if (frame >= 4 && frame <= 7) {
        const fingerIndex = frame - 4;
        drawFingerTap(ctx, x + 80 + (fingerIndex * 15), y + 280);
    }
}
```

---

### State 3: ANGRY (Patience 36-60)
**Mood:** Actively angry, visible frustration

**Visual Description:**
- **Face:** Deep frown, visible veins on forehead (pulsing)
- **Eyes:** Wide, intense stare
- **Body:** Leaning forward slightly
- **Hands:** Gripping gavel tightly, knuckles white
- **Color:** Face reddening (#dd6655), veins darker (#8b0000)
- **Lighting:** Warmer light on face (anger radiates)
- **Details:** 2-3 visible veins pulsing on forehead and temples

**Animation Loop (1 second):**
- Frame 1-2: Idle angry (0.2s)
- Frame 3: Vein pulse (thicker) (0.1s)
- Frame 4: Vein returns (0.1s)
- Frame 5: Second vein pulse (0.1s)
- Frame 6: Return (0.1s)
- Frame 7: Deep breath (chest expands) (0.2s)
- Frame 8: Exhale through nose (0.2s)

**New Visual Elements:**
- **Veins:** 2-3 curved lines on forehead, pulsing thicker/thinner
- **Breathing:** Visible chest rise/fall
- **Gavel grip:** Hand visibly squeezing gavel
- **Face tint:** Red overlay on skin
- **Eye whites:** Slightly bloodshot (red lines in whites)

**Canvas Drawing Specs:**
```javascript
drawJudgeAngry(ctx, x, y, frame) {
    // Red face
    ctx.fillStyle = '#dd6655';
    ctx.fillEllipse(x, y, 185, 225); // Slightly larger (tension)

    // Veins (pulsing)
    const veinThickness = (frame === 3 || frame === 5) ? 3 : 2;
    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = veinThickness;

    // Forehead vein 1
    ctx.beginPath();
    ctx.moveTo(x-30, y-70);
    ctx.quadraticCurveTo(x-10, y-60, x+5, y-50);
    ctx.stroke();

    // Temple vein 2
    ctx.beginPath();
    ctx.moveTo(x-65, y-40);
    ctx.lineTo(x-45, y-30);
    ctx.stroke();

    // Eyes (wide, intense)
    ctx.fillStyle = '#ffffff';
    ctx.fillEllipse(x-40, y-30, 18, 28);
    ctx.fillEllipse(x+40, y-30, 18, 28);

    // Bloodshot lines in whites
    ctx.strokeStyle = '#dd3333';
    ctx.lineWidth = 1;
    ctx.moveTo(x-50, y-25);
    ctx.lineTo(x-35, y-30);
    ctx.moveTo(x+50, y-25);
    ctx.lineTo(x+35, y-30);
    ctx.stroke();

    // Pupils (dilated)
    ctx.fillStyle = '#000000';
    ctx.fillCircle(x-40, y-25, 8);
    ctx.fillCircle(x+40, y-25, 8);

    // Deep frown
    ctx.strokeStyle = '#3d2f1f';
    ctx.lineWidth = 4;
    ctx.arc(x, y+55, 35, 0.4, 2.74, false);

    // Breathing animation (chest)
    const breathOffset = (frame === 7) ? 5 : 0;
    ctx.fillStyle = '#1a1612';
    ctx.fillRect(x-130, y+180 + breathOffset, 260, 120);
}
```

---

### State 4: FURIOUS (Patience 61-85)
**Mood:** Nearly out of control, on the edge

**Visual Description:**
- **Face:** Eyes extremely wide, teeth visible (grimace)
- **Eyes:** Bloodshot, veins visible in whites
- **Body:** Halfway standing, leaning far forward
- **Hands:** Gavel raised mid-air (trembling)
- **Color:** Deep red face (#ee5544), purple veins (#6b0f1a)
- **Lighting:** Red vignette begins at edges of screen
- **Details:** Multiple thick veins, sweat drops, clenched jaw

**Animation Loop (0.8 seconds):**
- Frame 1: Gavel at mid-height (0.1s)
- Frame 2: Gavel trembles left (0.1s)
- Frame 3: Gavel trembles right (0.1s)
- Frame 4: All veins pulse thick (0.15s)
- Frame 5: Veins return (0.15s)
- Frame 6: Face color flash brighter (0.1s)
- Frame 7: Return to base (0.1s)
- Frame 8: Heavy breath (0.15s)

**New Visual Elements:**
- **Gavel raised:** Visible above head, trembling
- **Teeth:** Visible through grimace (white rectangles)
- **Sweat drops:** 2-3 drops on forehead
- **Screen shake:** ±5px horizontal
- **Red vignette:** 30% opacity red gradient at edges
- **Multiple veins:** 5-6 veins visible, pulsing in sync

**Canvas Drawing Specs:**
```javascript
drawJudgeFurious(ctx, x, y, frame) {
    // Apply screen shake
    const shakeX = (frame === 2) ? -5 : (frame === 3) ? 5 : 0;
    x += shakeX;

    // Deep red face (larger, more tense)
    ctx.fillStyle = '#ee5544';
    ctx.fillEllipse(x, y-10, 190, 235); // Taller (leaning forward)

    // Multiple pulsing veins
    const veinThickness = (frame === 4) ? 4 : 2.5;
    ctx.strokeStyle = '#6b0f1a';
    ctx.lineWidth = veinThickness;

    // Vein network
    ctx.beginPath();
    ctx.moveTo(x-35, y-75);
    ctx.quadraticCurveTo(x-15, y-65, x, y-55);
    ctx.moveTo(x+35, y-75);
    ctx.quadraticCurveTo(x+15, y-65, x, y-55);
    ctx.moveTo(x-70, y-35);
    ctx.lineTo(x-50, y-25);
    ctx.moveTo(x+70, y-35);
    ctx.lineTo(x+50, y-25);
    ctx.moveTo(x-25, y-85);
    ctx.lineTo(x-20, y-70);
    ctx.stroke();

    // Eyes (extremely wide, bloodshot)
    ctx.fillStyle = '#ffcccc'; // Bloodshot whites
    ctx.fillEllipse(x-40, y-35, 22, 35);
    ctx.fillEllipse(x+40, y-35, 22, 35);

    // Many bloodshot lines
    ctx.strokeStyle = '#dd3333';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
        ctx.moveTo(x-55 + Math.random()*30, y-50);
        ctx.lineTo(x-35 + Math.random()*10, y-30);
    }
    ctx.stroke();

    // Pupils (dilated, intense)
    ctx.fillStyle = '#000000';
    ctx.fillCircle(x-40, y-30, 10);
    ctx.fillCircle(x+40, y-30, 10);

    // Grimace (teeth visible)
    ctx.strokeStyle = '#3d2f1f';
    ctx.lineWidth = 5;
    ctx.arc(x, y+60, 40, 0.5, 2.64, false);

    // Teeth (white rectangles)
    ctx.fillStyle = '#f5ede1';
    for (let i = -3; i <= 3; i++) {
        ctx.fillRect(x + (i * 8), y + 50, 6, 12);
    }

    // Sweat drops
    ctx.fillStyle = '#aaddff';
    ctx.fillCircle(x-50, y-20, 3);
    ctx.fillCircle(x+35, y-15, 3);

    // Raised gavel (trembling)
    const gavelX = x + 120;
    const gavelY = y - 80;
    const gavelTremble = (frame === 2 || frame === 3) ?
        (Math.random() * 6 - 3) : 0;

    drawGavel(ctx, gavelX + gavelTremble, gavelY, '#3d2f1f');

    // Red vignette (applied after main render)
    applyRedVignette(ctx, 0.3);
}
```

---

### State 5: APOPLECTIC (Patience 86-99)
**Mood:** Complete loss of control, volcanic rage

**Visual Description:**
- **Face:** Crimson, almost purple in places
- **Eyes:** Bulging, completely bloodshot
- **Body:** Standing fully, leaning over bench
- **Hands:** Gavel mid-strike, coming down violently
- **Color:** Crimson (#dd3333), purple veins (#4a0e1e)
- **Lighting:** Red screen pulse, harsh shadows
- **Details:** Veins everywhere, mouth open (yelling), spit flying

**Animation Loop (0.6 seconds):**
- Frame 1: Gavel at top of arc (0.1s)
- Frame 2: Gavel mid-swing (0.1s)
- Frame 3: IMPACT - gavel hits desk (0.1s)
  - Screen shake ±10px
  - White flash frame
  - Sound: BANG
- Frame 4: Recoil (0.1s)
- Frame 5: Face color pulse bright (0.1s)
- Frame 6: Veins all pulse (0.1s)

**New Visual Elements:**
- **Full body visible:** Standing up behind bench
- **Motion lines:** Behind gavel swing
- **Impact burst:** White radial lines on gavel strike
- **Screen shake:** ±10px radial (all directions)
- **Screen flash:** White 50% opacity on frame 3
- **Spit particles:** 3-4 white dots flying from mouth
- **Red screen pulse:** 50% red overlay fading in/out

**Canvas Drawing Specs:**
```javascript
drawJudgeApoplectic(ctx, x, y, frame) {
    // Apply violent screen shake
    const shakeAngle = Math.random() * Math.PI * 2;
    const shakeMagnitude = (frame === 3) ? 10 : 5;
    x += Math.cos(shakeAngle) * shakeMagnitude;
    y += Math.sin(shakeAngle) * shakeMagnitude;

    // Crimson face (even larger)
    const colorBrightness = (frame === 5) ? '#ff4444' : '#dd3333';
    ctx.fillStyle = colorBrightness;
    ctx.fillEllipse(x, y-30, 200, 250); // Much larger

    // Extensive vein network (all pulsing)
    const veinThickness = (frame === 6) ? 5 : 3;
    ctx.strokeStyle = '#4a0e1e';
    ctx.lineWidth = veinThickness;

    // Dense vein network (10+ veins)
    ctx.beginPath();
    // Forehead veins
    ctx.moveTo(x-40, y-85);
    ctx.quadraticCurveTo(x-20, y-75, x-5, y-65);
    ctx.moveTo(x+40, y-85);
    ctx.quadraticCurveTo(x+20, y-75, x+5, y-65);
    ctx.moveTo(x, y-90);
    ctx.lineTo(x, y-70);
    // Temple veins
    ctx.moveTo(x-75, y-50);
    ctx.lineTo(x-55, y-35);
    ctx.moveTo(x+75, y-50);
    ctx.lineTo(x+55, y-35);
    // Cheek veins
    ctx.moveTo(x-60, y);
    ctx.lineTo(x-45, y+10);
    ctx.moveTo(x+60, y);
    ctx.lineTo(x+45, y+10);
    // Neck veins
    ctx.moveTo(x-30, y+100);
    ctx.lineTo(x-25, y+120);
    ctx.moveTo(x+30, y+100);
    ctx.lineTo(x+25, y+120);
    ctx.stroke();

    // Eyes (bulging, completely bloodshot)
    ctx.fillStyle = '#ff9999'; // Very bloodshot
    ctx.fillEllipse(x-42, y-40, 25, 40); // Bulging
    ctx.fillEllipse(x+42, y-40, 25, 40);

    // Dense bloodshot lines
    ctx.strokeStyle = '#cc0000';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.moveTo(x-42 + Math.cos(angle) * 12, y-40 + Math.sin(angle) * 20);
        ctx.lineTo(x-42, y-40);
        ctx.moveTo(x+42 + Math.cos(angle) * 12, y-40 + Math.sin(angle) * 20);
        ctx.lineTo(x+42, y-40);
    }
    ctx.stroke();

    // Pupils (huge, dilated)
    ctx.fillStyle = '#000000';
    ctx.fillCircle(x-42, y-35, 12);
    ctx.fillCircle(x+42, y-35, 12);

    // Mouth (wide open, yelling)
    ctx.fillStyle = '#3d1a1a';
    ctx.fillEllipse(x, y+70, 50, 40);

    // Teeth (top and bottom)
    ctx.fillStyle = '#f5ede1';
    for (let i = -4; i <= 4; i++) {
        ctx.fillRect(x + (i * 10), y + 50, 8, 15); // Top
        ctx.fillRect(x + (i * 10), y + 75, 8, 12); // Bottom
    }

    // Spit particles (flying out)
    ctx.fillStyle = '#ffffff';
    ctx.fillCircle(x + 60, y + 60, 3);
    ctx.fillCircle(x + 75, y + 55, 2);
    ctx.fillCircle(x + 55, y + 70, 2);
    ctx.fillCircle(x + 70, y + 65, 3);

    // Body (standing, leaning forward)
    ctx.fillStyle = '#1a1612';
    ctx.fillRect(x-140, y+140, 280, 200);

    // Gavel animation
    let gavelX = x + 130;
    let gavelY = y - 100;
    let gavelAngle = 0;
    let showImpactBurst = false;

    if (frame === 1) {
        gavelY = y - 100; // Top of arc
        gavelAngle = -0.5;
    } else if (frame === 2) {
        gavelY = y + 50; // Mid-swing
        gavelAngle = 0.5;
    } else if (frame === 3) {
        gavelY = y + 180; // IMPACT
        gavelAngle = 1.2;
        showImpactBurst = true;
    } else {
        gavelY = y + 150; // Resting on desk
        gavelAngle = 0.8;
    }

    // Motion lines behind gavel (frames 1-2)
    if (frame <= 2) {
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 3; i++) {
            ctx.moveTo(gavelX, gavelY - (i * 20));
            ctx.lineTo(gavelX - 20, gavelY - (i * 20) - 30);
        }
        ctx.stroke();
    }

    drawGavel(ctx, gavelX, gavelY, '#3d2f1f', gavelAngle);

    // Impact burst (frame 3)
    if (showImpactBurst) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.moveTo(gavelX, gavelY);
            ctx.lineTo(gavelX + Math.cos(angle) * 40,
                      gavelY + Math.sin(angle) * 40);
        }
        ctx.stroke();

        // White flash (applied after main render)
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Red screen pulse
    const pulseOpacity = (frame === 5) ? 0.5 : 0.35;
    applyRedVignette(ctx, pulseOpacity);
}
```

---

### State 6: VOLCANIC (Patience 100) - GAME OVER
**Mood:** Complete meltdown, immediate sentencing

**Visual Description:**
- **Face:** Purple-red, inhuman fury
- **Eyes:** Whites completely red, pupils pinpricks
- **Body:** Fully standing, both hands on desk
- **Hands:** Gavel SHATTERED (pieces flying through air)
- **Color:** Purple-red (#aa2244), black veins (#000000)
- **Lighting:** Entire screen red overlay (60% opacity)
- **Details:** Everything at maximum intensity

**Animation Loop (0.5 seconds) - Plays ONCE then freezes:**
- Frame 1: Gavel shattering (0.1s)
  - Screen shake ±15px
  - 6-8 gavel fragments flying outward
  - Sound: CRACK + BOOM
- Frame 2: Judge fully standing (0.1s)
- Frame 3: Red screen flash 80% (0.1s)
- Frame 4: All veins pulse max thickness (0.1s)
- Frame 5: FREEZE FRAME (hold)
  - Text appears: "MAXIMUM SENTENCE"

**New Visual Elements:**
- **Gavel fragments:** 6-8 pieces with motion trails
- **Both hands:** Visible, slamming desk
- **Full body:** Entire judge visible, towering
- **Screen effects:**
  - ±15px violent shake
  - 80% red flash
  - Vignette becomes full red overlay (60%)
- **Particle effects:** Wood splinters, dust cloud
- **Final freeze:** Everything stops, dramatic pause

**Canvas Drawing Specs:**
```javascript
drawJudgeVolcanic(ctx, x, y, frame) {
    // MAXIMUM screen shake
    const shakeAngle = Math.random() * Math.PI * 2;
    const shakeMagnitude = (frame <= 2) ? 15 : 8;
    x += Math.cos(shakeAngle) * shakeMagnitude;
    y += Math.sin(shakeAngle) * shakeMagnitude;

    // Purple-red face (inhuman)
    const faceColor = (frame === 3) ? '#dd2255' : '#aa2244';
    ctx.fillStyle = faceColor;
    ctx.fillEllipse(x, y-50, 210, 260); // Massive

    // Maximum vein network (black, pulsing)
    const veinThickness = (frame === 4) ? 6 : 4;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = veinThickness;

    // Dense, chaotic vein network (20+ veins)
    ctx.beginPath();
    // Create chaotic web of veins
    for (let i = 0; i < 15; i++) {
        const startX = x + (Math.random() * 140 - 70);
        const startY = y - 90 + (Math.random() * 80);
        const endX = startX + (Math.random() * 40 - 20);
        const endY = startY + (Math.random() * 50);
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
    }
    ctx.stroke();

    // Eyes (completely bloodshot, pinprick pupils)
    ctx.fillStyle = '#ff0000'; // Pure red whites
    ctx.fillEllipse(x-45, y-45, 28, 45); // Very bulging
    ctx.fillEllipse(x+45, y-45, 28, 45);

    // Pinprick pupils
    ctx.fillStyle = '#000000';
    ctx.fillCircle(x-45, y-40, 3);
    ctx.fillCircle(x+45, y-40, 3);

    // Mouth (impossibly wide, roaring)
    ctx.fillStyle = '#1a0000';
    ctx.fillEllipse(x, y+80, 70, 50);

    // Many teeth
    ctx.fillStyle = '#f5ede1';
    for (let i = -6; i <= 6; i++) {
        ctx.fillRect(x + (i * 9), y + 55, 7, 18); // Top
        ctx.fillRect(x + (i * 9), y + 90, 7, 15); // Bottom
    }

    // Full body (towering)
    ctx.fillStyle = '#1a1612';
    ctx.fillRect(x-160, y+120, 320, 280);

    // Both arms visible (slamming desk)
    ctx.fillStyle = '#c5a789';
    // Left arm
    ctx.fillRect(x-140, y+150, 40, 180);
    // Right arm
    ctx.fillRect(x+100, y+150, 40, 180);

    // Hands slamming desk
    ctx.fillStyle = '#b8956f';
    ctx.fillEllipse(x-120, y+320, 30, 40);
    ctx.fillEllipse(x+120, y+320, 30, 40);

    // Shattered gavel (frame 1: fragments flying)
    if (frame === 1) {
        const fragments = [
            {x: x+100, y: y+150, angle: 0.3, vx: 5, vy: -3},
            {x: x+110, y: y+160, angle: -0.5, vx: 7, vy: -5},
            {x: x+105, y: y+155, angle: 1.2, vx: 4, vy: -7},
            {x: x+115, y: y+165, angle: 0.8, vx: 6, vy: -4},
            {x: x+95, y: y+145, angle: -0.3, vx: 3, vy: -6},
            {x: x+120, y: y+170, angle: 1.5, vx: 8, vy: -2},
        ];

        ctx.fillStyle = '#3d2f1f';
        fragments.forEach(frag => {
            ctx.save();
            ctx.translate(frag.x, frag.y);
            ctx.rotate(frag.angle);
            ctx.fillRect(-5, -15, 10, 30); // Fragment piece

            // Motion trail
            ctx.strokeStyle = 'rgba(61,47,31,0.5)';
            ctx.lineWidth = 3;
            ctx.moveTo(0, 0);
            ctx.lineTo(-frag.vx * 5, -frag.vy * 5);
            ctx.stroke();

            ctx.restore();
        });

        // Dust cloud at impact point
        ctx.fillStyle = 'rgba(139,111,71,0.6)';
        for (let i = 0; i < 10; i++) {
            const dustX = x + 110 + (Math.random() * 40 - 20);
            const dustY = y + 180 + (Math.random() * 40 - 20);
            const dustSize = Math.random() * 8 + 4;
            ctx.fillCircle(dustX, dustY, dustSize);
        }
    } else if (frame > 1) {
        // Gavel fragments on ground
        ctx.fillStyle = '#3d2f1f';
        ctx.fillRect(x+95, y+320, 12, 35);
        ctx.fillRect(x+115, y+315, 10, 28);
        ctx.fillRect(x+105, y+325, 8, 20);
    }

    // Maximum red overlay
    const overlayOpacity = (frame === 3) ? 0.8 : 0.6;
    ctx.fillStyle = `rgba(170,34,68,${overlayOpacity})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // "MAXIMUM SENTENCE" text (frame 5)
    if (frame === 5) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 72px serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText('MAXIMUM SENTENCE', canvas.width / 2, canvas.height / 2);
        ctx.fillText('MAXIMUM SENTENCE', canvas.width / 2, canvas.height / 2);
    }
}
```

---

## TECHNICAL ARCHITECTURE

### System Components

```javascript
// Primary classes
class AceAttorneyCourtroom {
    constructor(gameInstance, canvas)
    init()
    update(deltaTime)
    render()
    transitionToJudgeView()
    transitionToDeskView()
    destroy()
}

class JudgeSpriteAnimator {
    constructor()
    setState(patienceLevel)
    update(deltaTime)
    render(ctx, x, y)
    getCurrentFrame()
    transitionToState(newState, duration)
}

class AtmosphereRenderer {
    constructor(canvas)
    renderBackground()
    applyVignette(opacity)
    applyFilmGrain()
    applyRedOverlay(opacity)
    applyScreenShake(magnitude)
}

class DialogueBox {
    constructor()
    show(text, speaker)
    hide()
    setChoices(choices)
    render(ctx, x, y)
}

class PatienceMeter {
    constructor()
    setValue(value)
    render(ctx, x, y, isLarge)
}

class CourtRecorder {
    // Records all interactions for case summary
    recordAction(action, timestamp)
    generateCaseSummary()
}
```

### File Structure

**New Files to Create:**
```
game/
├── ace-attorney-courtroom.js    (450 lines) - Main courtroom system
├── judge-sprite-animator.js     (350 lines) - Animation controller
├── courtroom-atmosphere.js      (200 lines) - Visual effects
├── courtroom-ui.js              (250 lines) - Dialogue, buttons, meters
├── courtroom-renderer.js        (400 lines) - Canvas drawing functions
└── ace-attorney-courtroom.css   (150 lines) - Styling
```

**Integration Points in Existing Files:**
- `game.js` - Replace `showCourtroom()` method (~line 2800)
- `index.html` - Add canvas element for courtroom
- `soundsystem.js` - Add new sound effects

---

## CANVAS RENDERING SYSTEM

### Main Rendering Pipeline

```javascript
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

        // Size
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        // Make canvas fill screen
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Calculate scale for different screen sizes
        this.scale = Math.min(
            this.canvas.width / 1920,
            this.canvas.height / 1080
        );
    }

    update(deltaTime) {
        // Update judge animator
        this.judgeAnimator.update(deltaTime);

        // Update transitions
        if (this.isTransitioning) {
            this.transitionProgress += deltaTime / 1000; // 1 second transition
            if (this.transitionProgress >= 1) {
                this.isTransitioning = false;
                this.transitionProgress = 0;
            }
        }

        // Update patience meter based on game state
        this.patienceMeter.setValue(this.game.judgePatience);

        // Update judge anger state based on patience
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
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Save context state
        this.ctx.save();

        // Apply atmosphere background
        this.atmosphere.renderBackground(this.ctx);

        // Render current view
        if (this.currentView === 'JUDGE') {
            this.renderJudgeView();
        } else {
            this.renderDeskView();
        }

        // Apply post-processing effects
        this.atmosphere.applyFilmGrain(this.ctx);
        this.atmosphere.applyVignette(this.ctx, 0.4);

        // Apply red overlay if judge is angry enough
        if (this.game.judgePatience >= 61) {
            const opacity = Math.min(0.6, (this.game.judgePatience - 60) / 100);
            this.atmosphere.applyRedOverlay(this.ctx, opacity);
        }

        // Apply screen shake if furious/apoplectic/volcanic
        if (this.game.judgePatience >= 61) {
            const magnitude = (this.game.judgePatience - 60) / 4;
            this.atmosphere.applyScreenShake(this.ctx, magnitude);
        }

        // Restore context
        this.ctx.restore();

        // Request next frame
        this.animationFrameId = requestAnimationFrame(() => {
            const now = Date.now();
            const deltaTime = now - this.lastFrameTime;
            this.lastFrameTime = now;

            this.update(deltaTime);
            this.render();
        });
    }

    renderJudgeView() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Draw courtroom background
        this.drawCourtroom(this.ctx);

        // Draw judge's bench
        this.drawJudgeBench(this.ctx, centerX, centerY + 200);

        // Draw judge sprite (large, centered)
        this.judgeAnimator.render(
            this.ctx,
            centerX,
            centerY - 100,
            this.scale
        );

        // Draw patience meter (visible, top-right)
        this.patienceMeter.render(
            this.ctx,
            this.canvas.width - 250,
            50,
            true // large version
        );

        // Draw dialogue box (bottom)
        this.dialogueBox.render(
            this.ctx,
            centerX,
            this.canvas.height - 150
        );
    }

    renderDeskView() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Draw desk background
        this.drawDeskSurface(this.ctx);

        // Draw current form (handled by existing game.js code)
        // This is where paperwork appears

        // Draw small patience meter (top corner)
        this.patienceMeter.render(
            this.ctx,
            this.canvas.width - 180,
            30,
            false // small version
        );
    }

    drawCourtroom(ctx) {
        // Background (dark, oppressive)
        const bgGradient = ctx.createLinearGradient(
            0, 0, 0, this.canvas.height
        );
        bgGradient.addColorStop(0, '#1a1612');
        bgGradient.addColorStop(1, '#2d2418');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Faint light source (top center, dim)
        const lightGradient = ctx.createRadialGradient(
            this.canvas.width / 2, -200, 100,
            this.canvas.width / 2, 400, 800
        );
        lightGradient.addColorStop(0, 'rgba(255,217,149,0.15)');
        lightGradient.addColorStop(1, 'rgba(255,217,149,0)');
        ctx.fillStyle = lightGradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawJudgeBench(ctx, x, y) {
        // Judge's bench (dark wood)
        ctx.fillStyle = '#3d2f1f';
        ctx.fillRect(x - 400, y, 800, 150);

        // Wood grain effect (horizontal lines)
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(x - 400, y + (i * 15));
            ctx.lineTo(x + 400, y + (i * 15));
            ctx.stroke();
        }

        // Highlight (top edge)
        ctx.fillStyle = '#48362a';
        ctx.fillRect(x - 400, y, 800, 10);
    }

    drawDeskSurface(ctx) {
        // Desk surface (top-down view)
        ctx.fillStyle = '#3d2f1f';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Wood grain texture
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * 50);
            ctx.lineTo(this.canvas.width, i * 50 + (Math.random() * 20 - 10));
            ctx.stroke();
        }
    }

    transitionToJudgeView() {
        if (this.currentView === 'JUDGE') return;

        this.isTransitioning = true;
        this.transitionProgress = 0;

        // Fade to black, then reveal judge view
        const fadeOut = () => {
            const alpha = this.transitionProgress * 2;
            this.ctx.fillStyle = `rgba(0,0,0,${Math.min(1, alpha)})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            if (this.transitionProgress >= 0.5 && this.currentView !== 'JUDGE') {
                this.currentView = 'JUDGE';
            }
        };

        // Play transition sound
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

### Helper Functions for Canvas Drawing

```javascript
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
```

---

## ANIMATION SYSTEM

### JudgeSpriteAnimator Class

```javascript
class JudgeSpriteAnimator {
    constructor() {
        this.currentState = 'NEUTRAL';
        this.targetState = 'NEUTRAL';
        this.currentFrame = 0;
        this.frameTime = 0;
        this.isTransitioning = false;
        this.transitionProgress = 0;
        this.transitionDuration = 0.5;

        // Animation data for each state
        this.states = {
            NEUTRAL: {
                frameCount: 16,
                frameDuration: 125, // ms
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
                loop: false, // Plays once, freezes
                drawFunction: this.drawVolcanic.bind(this)
            }
        };
    }

    update(deltaTime) {
        // Handle state transition
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
                    // Freeze on last frame (VOLCANIC state)
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

        // Get current state's draw function
        const state = this.states[this.currentState];
        state.drawFunction(ctx, adjustedX, adjustedY, this.currentFrame);

        ctx.restore();
    }

    // Drawing functions defined earlier in Judge Sprite States section
    drawNeutral(ctx, x, y, frame) {
        // Implementation from "State 1: NEUTRAL" section above
    }

    drawIrritated(ctx, x, y, frame) {
        // Implementation from "State 2: IRRITATED" section above
    }

    drawAngry(ctx, x, y, frame) {
        // Implementation from "State 3: ANGRY" section above
    }

    drawFurious(ctx, x, y, frame) {
        // Implementation from "State 4: FURIOUS" section above
    }

    drawApoplectic(ctx, x, y, frame) {
        // Implementation from "State 5: APOPLECTIC" section above
    }

    drawVolcanic(ctx, x, y, frame) {
        // Implementation from "State 6: VOLCANIC" section above
    }
}
```

### Animation Timing Reference

| State | Frame Count | Frame Duration | Total Loop Time | Loops |
|-------|-------------|----------------|-----------------|-------|
| NEUTRAL | 16 | 125ms | 2.0s | Yes |
| IRRITATED | 15 | 100ms | 1.5s | Yes |
| ANGRY | 8 | 125ms | 1.0s | Yes |
| FURIOUS | 8 | 100ms | 0.8s | Yes |
| APOPLECTIC | 6 | 100ms | 0.6s | Yes |
| VOLCANIC | 5 | 100ms | 0.5s | No (freeze) |

---

## ATMOSPHERE & MOOD SYSTEM

### AtmosphereRenderer Class

```javascript
class AtmosphereRenderer {
    constructor(canvas) {
        this.canvas = canvas;

        // Film grain noise
        this.noiseCanvas = document.createElement('canvas');
        this.noiseCanvas.width = 256;
        this.noiseCanvas.height = 256;
        this.generateFilmGrain();

        // Animation
        this.noiseOffset = 0;
        this.screenShakeOffset = {x: 0, y: 0};
    }

    generateFilmGrain() {
        const ctx = this.noiseCanvas.getContext('2d');
        const imageData = ctx.createImageData(256, 256);

        for (let i = 0; i < imageData.data.length; i += 4) {
            const value = Math.random() * 255;
            imageData.data[i] = value;
            imageData.data[i+1] = value;
            imageData.data[i+2] = value;
            imageData.data[i+3] = 40; // 15% opacity
        }

        ctx.putImageData(imageData, 0, 0);
    }

    renderBackground(ctx) {
        // Already handled in AceAttorneyCourtroom.drawCourtroom()
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

        // Tile noise texture across screen
        const pattern = ctx.createPattern(this.noiseCanvas, 'repeat');
        ctx.save();
        ctx.translate(this.noiseOffset, this.noiseOffset);
        ctx.fillStyle = pattern;
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillRect(-this.noiseOffset, -this.noiseOffset,
                     this.canvas.width + this.noiseOffset,
                     this.canvas.height + this.noiseOffset);
        ctx.restore();
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
}
```

### Color Grading System

```javascript
class ColorGrading {
    static desaturate(ctx, amount = 0.7) {
        // Apply CSS filter (modern browsers)
        ctx.filter = `saturate(${1 - amount})`;
    }

    static applyDarkestDungeonLook(ctx) {
        // Combine multiple filters
        ctx.filter = [
            'saturate(0.4)',      // Heavy desaturation
            'contrast(1.3)',      // High contrast
            'brightness(0.85)',   // Slightly darker
            'sepia(0.15)'         // Slight sepia tone
        ].join(' ');
    }

    static clearFilters(ctx) {
        ctx.filter = 'none';
    }
}
```

---

## INTEGRATION WITH EXISTING SYSTEM

### Replacing Current Courtroom

**Current System (game.js ~line 2800):**
```javascript
showCourtroom() {
    this.showScreen('courtroom');
    this.judgePatience = 0;
    // ... existing form logic
}
```

**New Integration:**
```javascript
showCourtroom() {
    // Initialize Ace Attorney courtroom
    const canvas = document.getElementById('courtroomCanvas');
    this.aceAttorneyCourtroom = new AceAttorneyCourtroom(this, canvas);

    // Start with desk view (filling out forms)
    this.aceAttorneyCourtroom.currentView = 'DESK';
    this.aceAttorneyCourtroom.render();

    // Show form overlay
    this.showScreen('courtroomForms');
    this.judgePatience = 0;
}

// After each form submission/mistake
handleFormSubmit() {
    // Check for errors
    const errors = this.validateForm();

    if (errors.length > 0) {
        // Increase judge patience
        this.judgePatience += (errors.length * 5);

        // Transition to judge view to show reaction
        this.aceAttorneyCourtroom.transitionToJudgeView();

        // Show judge dialogue
        const reaction = this.judgeHardcastle.getReaction(errors, this.judgePatience);
        this.aceAttorneyCourtroom.dialogueBox.show(reaction, 'Judge Hardcastle');

        // After dialogue, return to desk view
        setTimeout(() => {
            this.aceAttorneyCourtroom.transitionToDeskView();
        }, 3000);
    }

    // Check for max patience (game over)
    if (this.judgePatience >= 100) {
        this.handleMaximumSentence();
    }
}

handleMaximumSentence() {
    // Judge goes VOLCANIC
    this.aceAttorneyCourtroom.judgeAnimator.transitionToState('VOLCANIC', 0.3);

    // Play dramatic sound
    this.soundSystem.playGavelShatter(); // New sound

    // Show maximum sentence screen after animation
    setTimeout(() => {
        this.sentenceToPrison(999); // Maximum sentence
    }, 2000);
}
```

### HTML Structure

```html
<!-- Add to game/index.html -->
<div id="courtroomContainer" class="screen" style="display:none;">
    <!-- Main canvas for courtroom rendering -->
    <canvas id="courtroomCanvas"></canvas>

    <!-- Overlay for forms (desk view) -->
    <div id="courtroomForms" class="courtroom-forms-overlay">
        <!-- Existing form HTML stays here -->
        <!-- Forms appear on top of canvas when in desk view -->
    </div>

    <!-- Dialogue box overlay (judge view) -->
    <div id="courtroomDialogue" class="courtroom-dialogue-overlay">
        <!-- Managed by DialogueBox class -->
    </div>
</div>
```

### CSS Styling

```css
/* Add to game/ace-attorney-courtroom.css */
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

/* Patience meter styling */
.patience-meter {
    background-color: rgba(0,0,0,0.7);
    border: 2px solid #3d2f1f;
    padding: 10px;
    border-radius: 5px;
}

.patience-meter-label {
    color: #f5ede1;
    font-size: 14px;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 1px;
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
    background: linear-gradient(to right,
        #4a7c59 0%,
        #7c9c4a 30%,
        #cc8866 60%,
        #dd6655 80%,
        #dd3333 100%
    );
    transition: width 0.3s ease;
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
}
```

---

## SOUND DESIGN INTEGRATION

### New Sound Effects Needed

Add to `soundsystem.js`:

```javascript
// Gavel shatter (VOLCANIC state)
playGavelShatter() {
    if (this.muted) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Crack sound (wood splitting)
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

    // Boom (impact)
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

    // Wood fragments falling
    for (let i = 0; i < 5; i++) {
        const fragment = ctx.createOscillator();
        const fragmentGain = ctx.createGain();
        fragment.type = 'square';
        fragment.frequency.setValueAtTime(200 + (i * 50), now + 0.2 + (i * 0.05));
        fragment.frequency.exponentialRampToValueAtTime(80, now + 0.4 + (i * 0.05));
        fragmentGain.gain.setValueAtTime(0.2, now + 0.2 + (i * 0.05));
        fragmentGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4 + (i * 0.05));
        fragment.connect(fragmentGain);
        fragmentGain.connect(ctx.destination);
        fragment.start(now + 0.2 + (i * 0.05));
        fragment.stop(now + 0.4 + (i * 0.05));
    }
}

// Angry gavel strike (APOPLECTIC state)
playAngryGavelStrike() {
    if (this.muted) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Use existing playGavelStrike() but louder and deeper
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, now); // Lower pitch
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

    gain.gain.setValueAtTime(0.9, now); // Louder
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);

    // Add impact noise (louder)
    const noise = ctx.createBufferSource();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * 0.5;
    }
    noise.buffer = noiseBuffer;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
}

// Desk creak (when judge leans forward)
playDeskCreak() {
    if (this.muted) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const creak = ctx.createOscillator();
    const creakGain = ctx.createGain();

    creak.type = 'sawtooth';
    creak.frequency.setValueAtTime(120, now);
    creak.frequency.linearRampToValueAtTime(150, now + 0.3);
    creak.frequency.linearRampToValueAtTime(110, now + 0.6);

    creakGain.gain.setValueAtTime(0.15, now);
    creakGain.gain.linearRampToValueAtTime(0.2, now + 0.3);
    creakGain.gain.linearRampToValueAtTime(0.01, now + 0.6);

    creak.connect(creakGain);
    creakGain.connect(ctx.destination);

    creak.start(now);
    creak.stop(now + 0.6);
}

// Finger drum (IRRITATED state)
playFingerDrum() {
    if (this.muted) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Short percussive tap
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

// Heavy breathing (ANGRY state and above)
playHeavyBreathing() {
    if (this.muted) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Low rumble (inhale)
    const inhale = ctx.createOscillator();
    const inhaleGain = ctx.createGain();

    inhale.type = 'sine';
    inhale.frequency.setValueAtTime(80, now);
    inhale.frequency.linearRampToValueAtTime(90, now + 0.4);

    inhaleGain.gain.setValueAtTime(0, now);
    inhaleGain.gain.linearRampToValueAtTime(0.15, now + 0.4);
    inhaleGain.gain.linearRampToValueAtTime(0, now + 0.8);

    inhale.connect(inhaleGain);
    inhaleGain.connect(ctx.destination);

    inhale.start(now);
    inhale.stop(now + 0.8);

    // Noise component (breathing texture)
    const noise = ctx.createBufferSource();
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * 0.1;
    }
    noise.buffer = noiseBuffer;
    noise.loop = false;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.1, now + 0.4);
    noiseGain.gain.linearRampToValueAtTime(0, now + 0.8);

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 300;

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
}
```

### Sound Trigger Map

| Event | Sound Effect | When Triggered |
|-------|-------------|----------------|
| Form error | `playGavelStrike()` | Every mistake |
| Transition to judge view | `playGavelStrike()` | View change |
| Judge enters IRRITATED | `playFingerDrum()` | State change |
| Judge enters ANGRY | `playHeavyBreathing()` | State change |
| Judge enters FURIOUS | `playDeskCreak()` + `playHeavyBreathing()` | State change |
| Judge enters APOPLECTIC | `playAngryGavelStrike()` | Gavel strike animation |
| Judge enters VOLCANIC | `playGavelShatter()` | Gavel breaks |
| Finger drumming (loop) | `playFingerDrum()` | Every 0.4s in IRRITATED |
| Heavy breathing (loop) | `playHeavyBreathing()` | Every 2s in ANGRY+ |

---

## MOBILE SUPPORT

### Touch Controls

```javascript
class MobileCourtroom {
    constructor(aceAttorneyCourtroom) {
        this.courtroom = aceAttorneyCourtroom;
        this.setupTouchControls();
    }

    setupTouchControls() {
        const canvas = this.courtroom.canvas;

        // Tap to continue dialogue
        canvas.addEventListener('touchend', (e) => {
            if (this.courtroom.dialogueBox.isVisible) {
                this.courtroom.dialogueBox.next();
            }
        });

        // Swipe up to see full patience meter
        let touchStartY = 0;
        canvas.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });

        canvas.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;

            if (deltaY > 50) {
                // Swipe up - show patience details
                this.showPatienceDetails();
            }
        });
    }

    showPatienceDetails() {
        // Show modal with patience breakdown
        // "Judge patience: 67/100"
        // "Mistakes made: 13"
        // "Current state: FURIOUS"
    }
}
```

### Responsive Canvas Sizing

```javascript
class AceAttorneyCourtroom {
    resize() {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // Mobile adjustments
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            // Scale judge smaller on mobile
            this.scale = Math.min(
                this.canvas.width / 1920,
                this.canvas.height / 1080
            ) * 0.8; // 80% size on mobile

            // Adjust dialogue box size
            this.dialogueBox.fontSize = 18;
        } else {
            // Desktop
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.scale = Math.min(
                this.canvas.width / 1920,
                this.canvas.height / 1080
            );

            this.dialogueBox.fontSize = 24;
        }
    }
}
```

### Mobile CSS Overrides

```css
@media (max-width: 768px) {
    #courtroomCanvas {
        touch-action: none; /* Prevent scrolling */
    }

    .courtroom-forms-overlay {
        width: 95%;
        height: 70vh;
        padding: 15px;
        font-size: 16px;
    }

    .courtroom-dialogue-overlay {
        width: 95%;
        bottom: 20px;
        font-size: 18px;
        padding: 15px;
    }

    .patience-meter-bar {
        width: 150px;
        height: 16px;
    }
}

@media (max-width: 480px) {
    .courtroom-dialogue-overlay {
        font-size: 16px;
        padding: 12px;
    }

    .patience-meter {
        padding: 5px;
    }
}
```

---

## PERFORMANCE OPTIMIZATION

### Target Frame Rates
- **Desktop:** 60 FPS
- **Mobile:** 30 FPS (with automatic detection)

### Optimization Strategies

```javascript
class PerformanceOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.targetFPS = this.isMobile ? 30 : 60;
        this.frameInterval = 1000 / this.targetFPS;
        this.lastFrameTime = Date.now();
    }

    detectMobile() {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
               window.innerWidth < 768;
    }

    shouldRender() {
        const now = Date.now();
        const elapsed = now - this.lastFrameTime;

        if (elapsed >= this.frameInterval) {
            this.lastFrameTime = now - (elapsed % this.frameInterval);
            return true;
        }
        return false;
    }
}

// In AceAttorneyCourtroom.render()
render() {
    if (!this.performanceOptimizer.shouldRender()) {
        requestAnimationFrame(() => this.render());
        return;
    }

    // ... normal render code
}
```

### Canvas Optimization

```javascript
// Use offscreen canvas for static elements
class OptimizedRenderer {
    constructor(canvas) {
        this.canvas = canvas;

        // Offscreen canvas for background (drawn once)
        this.bgCanvas = document.createElement('canvas');
        this.bgCanvas.width = canvas.width;
        this.bgCanvas.height = canvas.height;
        this.bgCtx = this.bgCanvas.getContext('2d');

        this.renderBackground();
    }

    renderBackground() {
        // Draw courtroom background once
        // ... expensive background rendering
        this.backgroundRendered = true;
    }

    render(ctx) {
        if (this.backgroundRendered) {
            // Just copy the offscreen canvas (fast)
            ctx.drawImage(this.bgCanvas, 0, 0);
        }

        // Draw dynamic elements on top
        // (judge, animations, effects)
    }
}
```

### Reduce Draw Calls

```javascript
// Batch similar drawing operations
function drawVeins(ctx, veins) {
    ctx.beginPath();
    veins.forEach(vein => {
        ctx.moveTo(vein.x1, vein.y1);
        ctx.lineTo(vein.x2, vein.y2);
    });
    ctx.stroke(); // Single stroke call for all veins
}
```

### Conditional Detail Levels

```javascript
class QualitySettings {
    constructor() {
        this.detectQuality();
    }

    detectQuality() {
        const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
        const isLowEnd = navigator.hardwareConcurrency <= 2;

        if (isMobile || isLowEnd) {
            this.filmGrain = false;
            this.veinCount = 'low'; // 3 veins instead of 10+
            this.shadowQuality = 'low';
        } else {
            this.filmGrain = true;
            this.veinCount = 'high';
            this.shadowQuality = 'high';
        }
    }
}
```

### Memory Management

```javascript
class ResourceManager {
    constructor() {
        this.textures = new Map();
    }

    preloadTextures() {
        // Pre-generate film grain texture (once)
        this.textures.set('filmGrain', this.generateFilmGrain());
    }

    cleanup() {
        // Clear texture cache when leaving courtroom
        this.textures.clear();
    }
}
```

---

## IMPLEMENTATION TIMELINE

### Phase 1: Core System (Week 1)
**Estimated Time:** 8-12 hours

- [x] Create `ace-attorney-courtroom.js` base class
- [x] Implement canvas rendering pipeline
- [x] Create `AtmosphereRenderer` class
- [x] Implement background rendering
- [x] Add vignette and film grain effects
- [x] Test on desktop browser

**Deliverables:**
- Working canvas courtroom (no judge yet)
- Atmosphere effects working
- Desk/Judge view transition

### Phase 2: Judge Animation System (Week 1-2)
**Estimated Time:** 10-15 hours

- [x] Create `JudgeSpriteAnimator` class
- [x] Implement NEUTRAL state (drawing + animation)
- [x] Implement IRRITATED state
- [x] Implement ANGRY state
- [x] Implement FURIOUS state
- [x] Implement APOPLECTIC state
- [x] Implement VOLCANIC state
- [x] Add state transitions
- [x] Test animation loops

**Deliverables:**
- All 6 judge states animated
- Smooth state transitions
- Frame-perfect timing

### Phase 3: UI & Dialogue (Week 2)
**Estimated Time:** 6-8 hours

- [ ] Create `DialogueBox` class
- [ ] Implement text rendering
- [ ] Add continue button/tap support
- [ ] Create `PatienceMeter` class
- [ ] Implement meter animations
- [ ] Style with CSS

**Deliverables:**
- Working dialogue system
- Visible patience meter
- UI matches Darkest Dungeon aesthetic

### Phase 4: Sound Integration (Week 2)
**Estimated Time:** 4-6 hours

- [ ] Add new sound effects to `soundsystem.js`
- [ ] Implement sound triggers
- [ ] Add looping sounds (breathing, drumming)
- [ ] Test sound timing with animations

**Deliverables:**
- All sounds implemented
- Synced with animations
- Volume balanced

### Phase 5: Integration with Game (Week 3)
**Estimated Time:** 6-10 hours

- [ ] Modify `game.js` courtroom methods
- [ ] Hook up form validation to judge reactions
- [ ] Implement patience increase logic
- [ ] Add judge dialogue system
- [ ] Test full courtroom flow
- [ ] Handle edge cases

**Deliverables:**
- Courtroom fully integrated
- Forms trigger judge reactions
- Patience system working
- Maximum sentence triggers correctly

### Phase 6: Mobile Support (Week 3)
**Estimated Time:** 4-6 hours

- [ ] Implement touch controls
- [ ] Add responsive canvas sizing
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Optimize performance for mobile

**Deliverables:**
- Touch controls working
- Responsive layout
- 30 FPS on mobile

### Phase 7: Performance Optimization (Week 4)
**Estimated Time:** 4-6 hours

- [ ] Implement frame rate limiting
- [ ] Add offscreen canvas caching
- [ ] Reduce draw calls
- [ ] Add quality settings
- [ ] Profile and optimize bottlenecks

**Deliverables:**
- 60 FPS on desktop
- 30 FPS on mobile
- No memory leaks

### Phase 8: Polish & Testing (Week 4)
**Estimated Time:** 6-8 hours

- [ ] Add screen shake refinements
- [ ] Fine-tune color grading
- [ ] Adjust animation timing
- [ ] Test all patience thresholds
- [ ] Test all dialogue paths
- [ ] Bug fixes

**Deliverables:**
- No visual glitches
- Smooth animations
- All states tested
- Ready for v1.5.0 release

### Total Estimated Time: 48-71 hours (6-9 full days)

---

## TESTING CHECKLIST

### Visual Tests
- [ ] All 6 judge states render correctly
- [ ] State transitions are smooth (0.5s)
- [ ] Vignette is visible but not overpowering
- [ ] Film grain animates without flickering
- [ ] Red overlay appears at correct patience levels
- [ ] Screen shake magnitude scales correctly
- [ ] Gavel shatter fragments fly realistically
- [ ] Color palette matches Darkest Dungeon aesthetic
- [ ] Text is readable in all states

### Animation Tests
- [ ] NEUTRAL: Slow blink, occasional yawn
- [ ] IRRITATED: Finger drumming synced with sound
- [ ] ANGRY: Veins pulse in sync
- [ ] FURIOUS: Gavel trembles, screen shakes
- [ ] APOPLECTIC: Gavel strike creates impact burst
- [ ] VOLCANIC: Gavel shatters, freeze frame works
- [ ] All loops seamlessly repeat
- [ ] Frame rate is consistent (60/30 FPS)

### Sound Tests
- [ ] Gavel strike plays on mistakes
- [ ] Finger drumming loops correctly
- [ ] Heavy breathing loops without clicks
- [ ] Gavel shatter has all components (crack, boom, fragments)
- [ ] Sounds match animation timing
- [ ] Volume levels are balanced
- [ ] Mute setting works

### Integration Tests
- [ ] Form errors increase patience correctly
- [ ] Patience meter updates in real-time
- [ ] Judge state changes at correct thresholds
- [ ] Dialogue appears at right moments
- [ ] Maximum sentence triggers at 100 patience
- [ ] Save/load preserves patience state
- [ ] Desk ↔ Judge view transitions work

### Mobile Tests
- [ ] Canvas scales to screen size
- [ ] Touch controls respond
- [ ] Dialogue tap-to-continue works
- [ ] Patience meter is visible
- [ ] 30 FPS maintained
- [ ] No layout overflow
- [ ] iOS Safari compatibility
- [ ] Android Chrome compatibility

### Performance Tests
- [ ] Desktop: 60 FPS sustained
- [ ] Mobile: 30 FPS sustained
- [ ] No memory leaks over 10 minutes
- [ ] CPU usage reasonable (< 50%)
- [ ] GPU acceleration working
- [ ] Canvas drawing optimized

---

## FUTURE ENHANCEMENTS (Post v1.5.0)

### Phase 9: Advanced Features
- [ ] **Sprite sheets** - Replace canvas drawing with image-based sprites
- [ ] **Lip sync** - Mouth moves during dialogue
- [ ] **Eye tracking** - Judge's eyes follow mouse/cursor
- [ ] **Background details** - Animated courtroom elements (flags, scales of justice)
- [ ] **Weather effects** - Rain on windows, lightning flashes
- [ ] **Jury reactions** - Silhouettes in background reacting
- [ ] **Case summary replay** - Ken Burns-style recap of mistakes
- [ ] **Achievement system** - "Survived VOLCANIC state", "Zero mistakes"

### Phase 10: Expanded Dialogue
- [ ] **Context-aware reactions** - Judge comments on specific mistakes
- [ ] **Personality variations** - Judge mood based on time of day
- [ ] **Catch phrases** - Memorable recurring lines
- [ ] **Fourth wall breaks** - Judge comments on player's repeated mistakes

### Phase 11: Customization
- [ ] **Judge appearance options** - Different robes, wigs
- [ ] **Courtroom themes** - Day/night, modern/classical
- [ ] **Accessibility options** - High contrast mode, photosensitivity mode

---

## APPENDIX

### Quick Reference: Judge State Thresholds

```javascript
function getJudgeState(patience) {
    if (patience <= 15) return 'NEUTRAL';
    if (patience <= 35) return 'IRRITATED';
    if (patience <= 60) return 'ANGRY';
    if (patience <= 85) return 'FURIOUS';
    if (patience < 100) return 'APOPLECTIC';
    return 'VOLCANIC'; // Game over
}
```

### Quick Reference: Animation Frame Counts

| State | Frames | Duration per Frame | Total Loop |
|-------|--------|-------------------|------------|
| NEUTRAL | 16 | 125ms | 2.0s |
| IRRITATED | 15 | 100ms | 1.5s |
| ANGRY | 8 | 125ms | 1.0s |
| FURIOUS | 8 | 100ms | 0.8s |
| APOPLECTIC | 6 | 100ms | 0.6s |
| VOLCANIC | 5 | 100ms | 0.5s (no loop) |

### Quick Reference: Sound Effects

| Sound | Duration | Type | When |
|-------|----------|------|------|
| Gavel strike | 0.15s | Impact | Form errors |
| Finger drum | 0.05s | Tap | IRRITATED loop |
| Heavy breathing | 0.8s | Ambience | ANGRY+ loop |
| Desk creak | 0.6s | Wood | FURIOUS enter |
| Angry gavel strike | 0.15s | Impact | APOPLECTIC |
| Gavel shatter | 0.4s | Destruction | VOLCANIC |

### Quick Reference: Color Codes

```javascript
const COLORS = {
    background: '#1a1612',
    wood: '#3d2f1f',
    paper: '#f5ede1',

    skinNeutral: '#c5a789',
    skinIrritated: '#cc8866',
    skinAngry: '#dd6655',
    skinFurious: '#ee5544',
    skinApoplectic: '#dd3333',
    skinVolcanic: '#aa2244',

    veinAngry: '#8b0000',
    veinFurious: '#6b0f1a',
    veinApoplectic: '#4a0e1e',
    veinVolcanic: '#000000',
};
```

---

## CONCLUSION

This Ace Attorney-style courtroom system will transform VROOM VROOM's bureaucratic nightmare into a **visceral, visual experience**. Judge Hardcastle's escalating fury will be **felt** through expressive animations, oppressive atmosphere, and dramatic sound design.

**Key Features:**
- 6 distinct judge anger states with unique animations
- Darkest Dungeon/Disco Elysium art style (painterly, dark, oppressive)
- Canvas-based rendering (no external images needed initially)
- Full mobile support (touch controls, responsive)
- 60 FPS desktop, 30 FPS mobile
- Smooth integration with existing paperwork system

**Implementation Time:** 6-9 full days (48-71 hours)

**Target Release:** v1.5.0

This design document is **implementation-ready**. All technical specifications, code structures, animation timings, and visual descriptions are complete. Development can begin immediately.

---

**Document Version:** 1.0
**Author:** Claude (game-dev-specialist)
**Date:** 2025-10-16
**Status:** ✅ READY FOR IMPLEMENTATION
