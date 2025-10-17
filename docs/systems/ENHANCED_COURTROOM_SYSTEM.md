# ENHANCED COURTROOM SYSTEM - Technical Design Document

**Game:** VROOM VROOM
**System:** Doom-Filled Courtroom with Judge Hardcastle Sprite System
**Created:** 2025-10-15
**Status:** Ready for Implementation
**Estimated Time:** 28-37 hours

---

## 🎯 VISION

Transform the courtroom from a text-based form-filling exercise into a **doom-filled, atmospheric, first-person bureaucratic nightmare**. The player sits at their desk, looking down at mountains of paperwork, occasionally looking up to witness Judge Hardcastle's face growing increasingly purple with rage, his gavel crashes getting louder and more violent, the screen shaking with his fury.

**Inspiration:**
- **Papers Please** - Bureaucratic tedium and form validation
- **Disco Elysium** - Oppressive atmosphere and character art
- **Phoenix Wright** - Dramatic character reactions
- **The Stanley Parable** - First-person mundane tasks with dark humor

---

## 📐 SYSTEM ARCHITECTURE

### Core Components

1. **EnhancedCourtroomSystem** - Main controller class
2. **EnhancedCourtroomRenderer** - Canvas-based rendering engine
3. **JudgeReactionSystem** - Dynamic judge response system
4. **PaperworkManager** - Multi-page form system
5. **CameraController** - Look up/down mechanic
6. **SoundManager** - Courtroom sound effects

---

## 🎨 VISUAL SYSTEM

### 1. Canvas-Based Rendering

**Setup:**
- Primary canvas: 1920x1080 (scales to viewport)
- Two camera states: DESK_VIEW and JUDGE_VIEW
- Smooth transitions between views (0.5 seconds)
- Letterbox effect (black bars top/bottom) for cinematic feel

**Layout:**

```
DESK VIEW (Looking Down):
┌────────────────────────────────────────┐
│         BLACK LETTERBOX (10%)          │
├────────────────────────────────────────┤
│                                        │
│        📄  PAPERWORK FORMS             │
│                                        │
│    Page 1 of 5                         │
│                                        │
│   [Form Questions Here]                │
│                                        │
│   [Input Fields]                       │
│                                        │
│                                        │
│        [Next Page Button]              │
│                                        │
│   💡 Press SPACE to look up at judge  │
│                                        │
├────────────────────────────────────────┤
│         BLACK LETTERBOX (10%)          │
└────────────────────────────────────────┘

JUDGE VIEW (Looking Up):
┌────────────────────────────────────────┐
│         BLACK LETTERBOX (5%)           │
├────────────────────────────────────────┤
│                                        │
│                                        │
│          [JUDGE HARDCASTLE]            │
│                                        │
│            ┌─────────┐                 │
│            │  ASCII  │                 │
│            │  JUDGE  │                 │
│            │  FACE   │                 │
│            │  SPRITE │                 │
│            └─────────┘                 │
│                                        │
│         🔨  *GAVEL STRIKE*             │
│                                        │
│   "Young lady/man, this is your       │
│    THIRD appearance before me..."     │
│                                        │
│     Patience: [████████░░] 80%        │
│                                        │
│   💡 Press SPACE to return to desk    │
│                                        │
├────────────────────────────────────────┤
│         BLACK LETTERBOX (5%)           │
└────────────────────────────────────────┘
```

### 2. Desk View Details

**Visual Elements:**
- Wooden desk surface (dark brown gradient)
- Desk lamp in corner (creates focused light pool)
- Stack of papers (left side, decreases as pages completed)
- Pen/pencil (right side)
- Coffee mug (optional, for atmosphere)
- Current form in center (well-lit)

**Lighting:**
- Warm desk lamp (circle gradient from center)
- Vignette darkening towards edges
- Paper glows slightly under lamp

**Form Display:**
- Large, clear text (18-24px)
- Input fields with green glow border
- Page indicator (Page 1 of 5)
- Progress bar (subtle)

### 3. Judge View Details

**Visual Elements:**
- Judge Hardcastle sprite (nearly full screen, 80-90% height)
- Gavel in hand (position varies by anger state)
- Dialogue box below judge (dark background, green text)
- Patience meter (bar showing current mood)
- Background: Dark courtroom (wood paneling implied)

**Lighting:**
- Uplighting (creates dramatic shadows on face)
- Gets darker/redder as anger increases
- Spotlight effect on judge

**Camera Shake:**
- No shake: NEUTRAL, IRRITATED
- Subtle shake (±2px): ANGRY
- Medium shake (±5px): FURIOUS
- Heavy shake (±10px): APOPLECTIC
- Violent shake (±15px): VOLCANIC

---

## 👨‍⚖️ JUDGE HARDCASTLE SPRITE SYSTEM

### Anger States (6 Total)

#### STATE 1: NEUTRAL (0-15 Patience)
**First offense, barely contained annoyance**

```
         _____
        /     \
       | o   o |
       |   ^   |
       |  ___  |
        \_____/
          |||
      🔨 *tap*
```

**Dialogue:** "Name and offense, please. Let's get this over with."
**Gavel:** Gentle tap
**Screen:** No shake

---

#### STATE 2: IRRITATED (16-35 Patience)
**Slight frown, fingers drumming**

```
         _____
        /     \
       | -   - |
       |   >   |
       |  ___  |
        \_____/
          |||
      🔨 *tap tap*
```

**Dialogue:** "Again? This is becoming a habit, isn't it?"
**Gavel:** Slightly louder tap
**Screen:** No shake

---

#### STATE 3: ANGRY (36-60 Patience)
**Face reddening, brow furrowed, veins visible**

```
         _____
        / ≡≡≡ \
       | >   < |
       |   v   |
       |  \_/  |
        \_____/
          |||
      🔨 *THUD*
```

**Dialogue:** "Do you ENJOY wasting my time?!"
**Gavel:** Loud strike
**Screen:** Subtle shake (±2px)
**Vignette:** Starts to redden

---

#### STATE 4: FURIOUS (61-85 Patience)
**Veins bulging, yelling, eyes wide**

```
         _____
        /≡≡≡≡≡\
       | Ö   Ö |
       |   V   |
       | \___/ |
        \_____/
          |||
     🔨 *BANG!*
```

**Dialogue:** "THAT'S IT! I've HAD it with you!"
**Gavel:** Very loud strike (multiple bangs)
**Screen:** Medium shake (±5px)
**Vignette:** Red glow intensifies

---

#### STATE 5: APOPLECTIC (86-99 Patience)
**Face crimson, screaming, unhinged**

```
        ╔═════╗
        ║≡≡≡≡≡║
       ║ ಠ_ಠ ║
       ║  ╳  ║
       ║ ╚═╝ ║
        ╚═════╝
          |||
   🔨 *SMASH! SMASH!*
```

**Dialogue:** "I will BURY you under this courthouse!!"
**Gavel:** Violent striking (3-4 rapid strikes)
**Screen:** Heavy shake (±10px)
**Vignette:** Deep red, pulsing
**Sound:** Judge yelling

---

#### STATE 6: VOLCANIC (100 Patience)
**Face purple, inhuman rage, gavel shattered**

```
        ╔═════╗
        ║█████║
       ║ ☠ ☠ ║
       ║  ☢  ║
       ║ ███ ║
        ╚═════╝
          |||
    💥 *CRACK!*
```

**Dialogue:** "TWENTY. FIVE. YEARS!!!"
**Gavel:** Shattered (splinters flying)
**Screen:** Violent shake (±15px)
**Vignette:** Purple, screen flashing
**Sound:** Gavel snapping, judge screaming

---

### Sprite Rendering System

**Technical Implementation:**
```javascript
class JudgeSprite {
    constructor() {
        this.currentState = 'NEUTRAL';
        this.sprites = {
            NEUTRAL: [...ASCII art...],
            IRRITATED: [...ASCII art...],
            ANGRY: [...ASCII art...],
            FURIOUS: [...ASCII art...],
            APOPLECTIC: [...ASCII art...],
            VOLCANIC: [...ASCII art...]
        };
    }

    render(ctx, angerLevel) {
        const state = this.getStateFromAngerLevel(angerLevel);
        const sprite = this.sprites[state];

        // Calculate position (centered, 80% screen height)
        const x = canvas.width / 2;
        const y = canvas.height * 0.4;

        // Apply camera shake if needed
        if (state in ['ANGRY', 'FURIOUS', 'APOPLECTIC', 'VOLCANIC']) {
            x += this.calculateShake(state);
            y += this.calculateShake(state);
        }

        // Render ASCII sprite
        this.renderASCII(ctx, sprite, x, y);

        // Apply lighting effects
        this.applyUplighting(ctx, state);
    }
}
```

---

## 📄 PAPERWORK SYSTEM

### Multi-Page Form Structure

**5 Pages Total, 25-30 Questions:**

#### **Page 1: Vehicle and Incident Details (6 questions)**
1. Full legal name (validation: not empty)
2. Date and time of offense (to the minute)
3. Vehicle make, model, year
4. Vehicle color (dropdown)
5. License plate number
6. Speedometer reading at time of arrest

#### **Page 2: Driver Assessment (6 questions)**
7. Driver's license number
8. Years of driving experience
9. Previous traffic violations (number)
10. Last vehicle maintenance date
11. Tire tread depth (millimeters)
12. When was vehicle last washed? (absurd question)

#### **Page 3: Psychological Evaluation (6 questions)**
13. Why did you choose to drive? (500 word essay)
14. Describe your relationship with your mother (checkbox: Good/Bad/Complicated/Freudian)
15. Do you believe in free will? (Yes/No, affects later questions)
16. Rate your guilt on a scale of 1-10
17. What is your zodiac sign? (for sentencing calculations)
18. Complete this sentence: "Driving makes me feel..." (text input)

#### **Page 4: Philosophical Justifications (6 questions)**
19. Cite three sections of the social contract you violated
20. Did you consider the greater good? (Yes/No)
21. Solve the trolley problem (checkbox maze)
22. Apply Kantian ethics to your decision (essay)
23. What would Jesus do? (multiple choice)
24. Sign your name backwards (handwriting validation)

#### **Page 5: Final Declarations (6 questions)**
25. List three character witnesses (names, addresses, phone numbers)
26. Have you ever been convicted of a felony? (Yes/No, honesty test)
27. Do you intend to drive again? (Yes/No, truth check against question 16)
28. Write a haiku about your regret (5-7-5 syllable validation)
29. Quantify your regret in standardized units (number with units)
30. Sign here: _________________ (signature validation)

### **Random Absurd Questions (Insert 3-5 randomly):**
- Blood type (for sentencing compatibility)
- Favorite color of the judge's robe (multiple choice: Black/Black/Black/Other (Wrong))
- Number of times you've thought about driving in the last 24 hours
- Current moon phase (dropdown)
- Your opinion on the Oxford comma (Yes/No/It's complicated)
- Social security number... just kidding! (trick question)

### Validation Rules

**Field Types:**
- Text input (min length, max length)
- Textarea (word count requirements)
- Number input (range validation)
- Dropdown (must select)
- Checkbox (must check at least one)
- Signature (must draw something)

**Error Handling:**
- Red border on invalid fields
- Error message appears below field
- Cannot proceed to next page with errors
- Cannot submit final page with incomplete fields

**Contradictions:**
- If claim low guilt (Q16) but intend to drive again (Q27) = +2 years
- If deny felony (Q26) but have prior arrests = +5 years (perjury)
- If claim to consider greater good (Q20) but can't solve trolley problem (Q21) = +1 year

---

## 🎮 INTERACTION MECHANICS

### Desktop Controls

**Look Up/Down:**
- Press **SPACE** or **UP ARROW** to look up at judge
- Press **SPACE** or **DOWN ARROW** to look down at desk
- Smooth 0.5 second transition between views

**Navigation:**
- **TAB** or **ENTER** to navigate between form fields
- **ARROW KEYS** to navigate within field
- **Mouse CLICK** to select field
- **Next Page** button at bottom of form
- **Previous Page** button (disabled on page 1)

**Form Interaction:**
- Type directly into fields
- Dropdown menus on click
- Checkboxes on click
- Signature pad (mouse drag or touch)

### Mobile Controls

**Look Up/Down:**
- **Swipe UP** gesture to look up at judge
- **Swipe DOWN** gesture to look down at desk
- **Button** alternative (for accessibility)

**Navigation:**
- **Touch** to select form field
- **On-screen keyboard** appears
- **Scroll** to see full form
- **Next/Previous buttons** at bottom (48px minimum)

**Form Interaction:**
- Touch keyboard for text input
- Touch dropdowns for selection
- Touch checkboxes
- Finger drawing for signature

### Feedback Systems

**Judge Patience Meter:**
- Visible when looking up at judge
- Visual bar (████████░░) showing remaining patience
- Decreases with:
  - Time spent on form (1% per 30 seconds)
  - Incorrect answers submitted (-5% each)
  - Looking up too frequently (-2% each look)
  - Contradiction detected (-10%)
- When patience reaches 0: instant max sentence

**Form Progress:**
- Page indicator (Page X of 5)
- Completion percentage (60% Complete)
- Field counter (12/25 fields completed)

**Visual Feedback:**
- Field turns green when valid
- Field turns red when invalid
- Checkmark appears next to completed sections
- Save icon flashes when progress auto-saved

---

## 🔊 SOUND SYSTEM

### Existing Sounds (Already Implemented)
- `playGavelStrike()` - Deep thud (80Hz→40Hz) + impact noise

### New Sounds Needed

**Courtroom Ambiance:**
```javascript
playCourtAmbiance() {
    // Subtle room tone, occasional cough, paper rustle
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = 60; // Low rumble
    // ... (similar to existing sound system)
}

playChairCreak() {
    // Wood creaking when player shifts
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 120;
    // Apply envelope
}

playPaperRustle() {
    // Paper shuffling
    const noise = audioContext.createBufferSource();
    // White noise with filter sweep
}

playPenWriting() {
    // Pen scratching on paper (subtle)
    // High frequency scraping sound
}
```

**Judge Sounds:**
```javascript
playJudgeClearing Throat() {
    // Ahem sound
}

playJudgeYell(angerLevel) {
    // Synthesized yelling (pitch rises with anger)
    // Use existing voice system with modifications
}

playGavelBreaking() {
    // CRACK sound (for VOLCANIC state)
    // Splintering wood
}

playJudgeFingersDrumming() {
    // Tap tap tap (IRRITATED state)
}
```

---

## 🔗 INTEGRATION WITH EXISTING CODE

### File Structure

**New Files:**
```
game/enhanced-courtroom.js         (Main system class, ~600 lines)
game/enhanced-courtroom-renderer.js (Canvas rendering, ~400 lines)
```

**Modified Files:**
```
game/game.js                       (Integration points)
game/index.html                    (Canvas element, CSS)
game/soundsystem.js                (New sound methods)
```

### Integration Points in game.js

**1. Import Enhanced System (line ~10):**
```javascript
<script src="enhanced-courtroom.js"></script>
<script src="enhanced-courtroom-renderer.js"></script>
```

**2. Initialize in Constructor (line ~600):**
```javascript
this.enhancedCourtroom = new EnhancedCourtroomSystem(this);
```

**3. Replace Courtroom Entry (line ~1800):**
```javascript
handleArrest() {
    this.hideScreen('driving');
    // OLD: this.showScreen('courtroom');
    // NEW: this.enhancedCourtroom.start();
}
```

**4. Exit Courtroom to Prison (after sentencing):**
```javascript
endCourtroom(sentence) {
    this.enhancedCourtroom.destroy(); // Cleanup
    this.player.sentence = sentence;
    this.showScreen('prison');
}
```

### Canvas Element (index.html)

**Add after gameCanvas (line ~1850):**
```html
<!-- Enhanced Courtroom Canvas -->
<canvas id="courtroomCanvas" width="1920" height="1080"
        style="display: none; position: absolute; top: 0; left: 0;
               width: 100%; height: 100%; z-index: 1001;">
</canvas>
```

---

## 📱 MOBILE CONSIDERATIONS

### Responsive Canvas
```javascript
resizeCanvas() {
    const canvas = document.getElementById('courtroomCanvas');
    const aspectRatio = 16 / 9;

    if (window.innerWidth / window.innerHeight > aspectRatio) {
        // Letterbox sides
        canvas.style.width = (window.innerHeight * aspectRatio) + 'px';
        canvas.style.height = window.innerHeight + 'px';
    } else {
        // Letterbox top/bottom
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = (window.innerWidth / aspectRatio) + 'px';
    }
}
```

### Touch Gestures
```javascript
setupTouchControls() {
    let touchStartY = 0;

    canvas.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    canvas.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;

        if (Math.abs(deltaY) > 50) { // Minimum swipe distance
            if (deltaY > 0) {
                this.lookUp(); // Swipe up
            } else {
                this.lookDown(); // Swipe down
            }
        }
    });
}
```

### Text Input Adjustments
- Larger input fields (min 48px height)
- Prevent zoom on input focus (font-size: 16px minimum)
- Virtual keyboard-aware layout (fields stay visible)

---

## 🧪 IMPLEMENTATION CHECKLIST

### Phase 1: Core Rendering System (4-6 hours)
- [ ] Create EnhancedCourtroomRenderer class
- [ ] Implement canvas setup and resize handling
- [ ] Create desk view rendering (background, desk, papers)
- [ ] Create judge view rendering (background, sprite area)
- [ ] Implement letterbox effect
- [ ] Add vignette and lighting effects
- [ ] Test rendering on desktop and mobile

### Phase 2: Judge Sprite System (3-4 hours)
- [ ] Create JudgeSprite class
- [ ] Convert ASCII art to renderable format
- [ ] Implement sprite state machine (6 states)
- [ ] Add sprite positioning and scaling
- [ ] Implement camera shake for each state
- [ ] Add uplighting effects
- [ ] Test all anger states

### Phase 3: Paperwork System (6-8 hours)
- [ ] Create PaperworkManager class
- [ ] Design 25-30 form questions (5 pages)
- [ ] Implement field validation (text, number, textarea, dropdown, checkbox)
- [ ] Create multi-page navigation
- [ ] Add form progress tracking
- [ ] Implement contradiction detection
- [ ] Add error messaging system
- [ ] Test form completion flow

### Phase 4: Interaction Mechanics (4-5 hours)
- [ ] Implement look up/down transition
- [ ] Add desktop controls (SPACE, arrows, mouse)
- [ ] Add mobile controls (swipe gestures, touch)
- [ ] Create patience meter system
- [ ] Implement form field focus/selection
- [ ] Add judge dialogue system
- [ ] Test all interactions

### Phase 5: Sound Integration (2-3 hours)
- [ ] Add courtroom ambiance sound
- [ ] Create chair creak sound
- [ ] Create paper rustle sound
- [ ] Add judge yelling sounds (anger-based)
- [ ] Add gavel breaking sound (VOLCANIC state)
- [ ] Integrate with existing gavel strike
- [ ] Test sound synchronization

### Phase 6: Integration & Testing (4-5 hours)
- [ ] Integrate with game.js
- [ ] Replace old courtroom system
- [ ] Connect to arrest handler
- [ ] Connect to sentencing/prison transition
- [ ] Test full game flow (arrest → courtroom → prison)
- [ ] Test save/load compatibility
- [ ] Test on multiple devices (desktop, tablet, phone)

### Phase 7: Polish & Optimization (3-4 hours)
- [ ] Optimize canvas rendering (only redraw on changes)
- [ ] Add loading transitions
- [ ] Smooth camera movements
- [ ] Polish dialogue timing
- [ ] Add subtle animations (pen moving, papers shuffling)
- [ ] Performance testing (maintain 60fps)
- [ ] Accessibility improvements

### Phase 8: Documentation (2 hours)
- [ ] Update SYSTEMS.md
- [ ] Update CHANGELOG.md
- [ ] Update claude.md
- [ ] Add code comments
- [ ] Create troubleshooting guide

**Total Estimated Time:** 28-37 hours

---

## 🎬 EXPECTED PLAYER EXPERIENCE

### First Court Appearance (NEUTRAL Judge)
1. Player arrested, screen fades to black
2. Sound of handcuffs, police radio
3. Fade in to **desk view** - player looking down at paperwork
4. Desk lamp illuminates form, pile of papers to the left
5. Subtle instruction: "Press SPACE to look at the judge"
6. Player presses SPACE
7. Smooth camera tilt up (0.5 seconds)
8. **Judge view** - Judge Hardcastle appears, nearly full screen
9. ASCII art judge face: NEUTRAL state
10. Judge dialogue: "Name and offense, please. Let's get this over with."
11. Gentle gavel tap (*thud*)
12. Patience meter visible: [██████████] 100%
13. Player presses SPACE again
14. Camera tilts back down to desk
15. Player fills out Page 1 of 5
16. Occassionally looks up to check judge's mood
17. Completes all 5 pages (15-20 minutes of gameplay)
18. Submits final page
19. Camera auto-tilts up to judge
20. Judge delivers sentence based on completeness/contradictions
21. Gavel strike, fade to prison

### Third Court Appearance (ANGRY Judge)
1. Same arrest sequence
2. Fade to desk view
3. **Judge's voice immediately heard (angry):** "You AGAIN?!"
4. Player looks up
5. Judge face: ANGRY state (veins visible)
6. Patience meter: [█████░░░░░] 50% (starts lower!)
7. Judge: "Do you ENJOY wasting my time?!"
8. Loud gavel THUD
9. Screen shakes (±2px)
10. Vignette starts to redden
11. Player nervously returns to desk
12. Patience decreases faster (1% per 20 seconds now)
13. Each incorrect answer: Judge yells, gavel strike, -5% patience
14. Player frantically completes forms
15. Makes mistake on Page 3 (contradiction)
16. Looks up to check progress
17. Judge: FURIOUS state (eyes wide, yelling)
18. Patience: [██░░░░░░░░] 20%
19. Very loud gavel BANG!
20. Screen shakes hard (±5px)
21. Red vignette pulsing
22. Player panics, rushes through remaining pages
23. Submits with several errors
24. Judge: APOPLECTIC state (face crimson)
25. Patience: [░░░░░░░░░░] 0%
26. Judge screaming: "I will BURY you!!"
27. Multiple rapid gavel SMASHES
28. Heavy screen shake (±10px)
29. Sentence: 25 YEARS (maximum penalty)
30. Judge calms slightly, delivers verdict
31. Final gavel crack, fade to prison

---

## 🚀 DEPLOYMENT PLAN

### v1.5.0 Release (Enhanced Courtroom Update)
- Launch as major feature update
- Announce on game page: "NEW: Doom-Filled Courtroom Experience!"
- Highlight features:
  - First-person paperwork simulation
  - Dynamic Judge Hardcastle with 6 anger states
  - 25+ absurd bureaucratic questions
  - Fully animated courtroom drama

### Marketing Angle
- "Papers Please meets Disco Elysium in the courtroom"
- Screenshots of Judge VOLCANIC state
- GIF of screen shaking during gavel strikes
- Player testimonials of paperwork frustration (positive!)

### Performance Targets
- 60fps canvas rendering on desktop
- 30fps minimum on mobile
- < 2 second load time for courtroom entry
- Smooth transitions (no janky animations)

---

## 🎨 FUTURE ENHANCEMENTS (Post-Launch)

### Phase 2 Features (v1.6.0)
- **Jury Box** - 12 jurors with reactions
- **Lawyer Assistant** - Visual lawyer character beside player
- **Gallery** - Family members watching from seats
- **Bailiff** - Security officer near judge
- **Multiple Judges** - Different personalities (lenient vs. harsh)
- **Courtroom Sketch Artist** - Drawing player during trial

### Phase 3 Features (v1.7.0)
- **Animated Gavel** - Actual gavel raising and striking animation
- **Judge Emotes** - Eye twitching, vein pulsing, sweat drops
- **Paperwork Physics** - Papers falling off desk when judge yells
- **Desk Items** - Coffee spills, pen breaks
- **Weather Outside** - Window shows rain during depressing moments

---

**END OF TECHNICAL DESIGN DOCUMENT**

This system is ready for implementation. May Judge Hardcastle have mercy on the developer's soul.

🔨 *GAVEL STRIKE*

---

**Document Version:** 1.0
**Last Updated:** 2025-10-15
**Status:** ✅ IMPLEMENTATION READY
