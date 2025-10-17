# ENHANCED COURTROOM - QUICK REFERENCE

**Design Document:** `ENHANCED_COURTROOM_TECHNICAL_DESIGN.md`
**Target Version:** v1.5.0
**Estimated Implementation Time:** 28-37 hours

---

## AT A GLANCE

**What:** Transform courtroom from simple HTML forms into immersive first-person canvas experience

**Core Mechanic:** Look down at desk (fill paperwork) → Look up at judge (face consequences)

**Atmosphere:** Papers Please + Disco Elysium + Phoenix Wright + Dark Souls boss fight

---

## KEY FEATURES

### 1. First-Person Canvas System
- **Desk View:** Wooden desk, stacked papers, player hands, dramatic lamp lighting
- **Judge View:** Nearly full-screen Judge Hardcastle sprite, imposing courtroom backdrop
- **Transitions:** 600ms smooth camera movement (look up/down)
- **Effects:** Vignette darkening, camera shake, film grain

### 2. Judge Hardcastle Sprite (6 Anger States)
1. **NEUTRAL** - First offense, barely contained
2. **IRRITATED** - Slight frown, fingers drumming
3. **ANGRY** - Face reddening, brow furrowed, gavel ready
4. **FURIOUS** - Veins bulging, yelling, gavel striking
5. **APOPLECTIC** - Face crimson, screaming, violent shaking
6. **VOLCANIC** - Face purple, inhuman rage, gavel shattered

### 3. Enhanced Paperwork (25-30 Questions)
**5 Pages:**
- **Page 1:** Vehicle Condition Assessment (tire tread, wash date, odometer)
- **Page 2:** Psychological Evaluation (why you drove, dream analysis, guilt scale)
- **Page 3:** Temporal Circumstances (exact time, moon phase, biorhythm)
- **Page 4:** Philosophical Justifications (free will, social contract, trolley problem)
- **Page 5:** Character Witnesses & Final Declaration (witnesses, apology, acknowledgement)

**PLUS:** 15+ random absurd questions (favorite color, haiku, sign name backwards)

### 4. Interaction Mechanics
- **Desktop:** SPACE (toggle view), Arrow keys (navigate), Tab/Enter (forms)
- **Mobile:** Swipe up/down (change view), tap (fill forms)
- **Patience Meter:** Visual bar showing judge's remaining patience
- **Sentence Accumulation:** Real-time display of years being added

---

## SAMPLE QUESTIONS (15+ New Absurd Questions)

1. **Blood Type** - "For record purposes" (totally not relevant)
2. **Astrological Sign** - "Prosecutorial astrology is real"
3. **Favorite Judge** - "Hint: There is a correct answer"
4. **Math Problem** - "If a car travels 60 km/h for 30 min, how guilty are you?"
5. **Haiku About Regret** - "5-7-5 structure. Seasonal reference optional"
6. **Mother's Opinion** - "What would your mother say about your driving?"
7. **Dream About Driving** - "If you never dreamed about driving, explain why not"
8. **Quantify Regret** - "e.g., '3.7 megaRegrets' or '0.002 sorrow-lumens'"
9. **Phase of Moon** - "During your transgression"
10. **Circadian Biorhythm** - "Were you alert? Drowsy? Caffeinated?"
11. **Free Will Essay** - "If yes, why did you choose to drive?"
12. **Social Contract** - "Cite Rousseau, Locke, or Hobbes. Failure = charges"
13. **Trolley Problem** - "You are driving a car..."
14. **Categorical Imperative** - "Answer in exactly 10 words"
15. **Sign Name Backwards** - "Exactly backwards. Legally binding."

---

## ASCII SPRITE EXAMPLES

### NEUTRAL (State 1)
```
            [Calm face, neutral expression]
            Eyes: Open, not glaring
            Mouth: Straight line
            Posture: Upright, formal
            Gavel: Resting on bench
```

### FURIOUS (State 4)
```
            [Red face, veins throbbing]
            Eyes: Wide, furious
            Mouth: Open, yelling
            Veins: Visible on forehead/temples
            Gavel: Mid-strike \GAVEL/ *BANG*
            Screen: Shaking violently
```

### VOLCANIC (State 6)
```
            [Purple face, inhuman rage]
            Eyes: BLAZING
            Mouth: SCREAMING
            Veins: THROBBING EVERYWHERE
            Gavel: |SHATTERED|
            Screen: APOCALYPTIC SHAKING
            Text: "THE COURTROOM TREMBLES"
```

Full ASCII art in main design document (Section 2.3)

---

## CODE STRUCTURE OUTLINE

### New Files
```
game/enhanced-courtroom.js          (Main system - 800+ lines)
game/enhanced-courtroom.css         (Styling - 200+ lines)
```

### Main Classes
```javascript
class EnhancedCourtroomSystem {
    // Orchestrates entire system
    // Manages canvas, renderer, paperwork, reactions
}

class EnhancedCourtroomRenderer {
    // Canvas rendering engine
    // Handles desk view, judge view, transitions, effects
}

class EnhancedPaperworkSystem {
    // Multi-page form system
    // Question generation, validation, error detection
}

class JudgeReactionSystem {
    // Judge responses to player actions
    // Triggers dialogue, gavel strikes, anger escalation
}
```

### Integration Points
```javascript
// game.js modifications:

constructor() {
    this.enhancedCourtroom = new EnhancedCourtroomSystem(this);
}

arrest() {
    this.enhancedCourtroom.activate();
    this.showScreen('courtroom');
}

submitCourtForms() {
    const results = this.enhancedCourtroom.paperwork.validate();
    this.enhancedCourtroom.processFormErrors(results.errors);
    this.calculateFinalSentence();
}
```

---

## IMPLEMENTATION PHASES

### Phase 1: Core Rendering (4-6 hours)
Create canvas system, desk view, judge view, transitions

### Phase 2: Judge Sprites (3-4 hours)
Create 6 anger state sprites, gavel animations, camera shake

### Phase 3: Paperwork (6-8 hours)
Build 5-page form system, 30+ questions, validation logic

### Phase 4: Interactions (4-5 hours)
Desktop controls, mobile gestures, patience meter, reactions

### Phase 5: Sound (2-3 hours)
Chair creak, paper rustle, judge yell, gavel strike

### Phase 6: Integration (4-5 hours)
Connect to game.js, test full flow, mobile testing

### Phase 7: Polish (3-4 hours)
Optimize rendering, fine-tune animations, balance tuning

### Phase 8: Documentation (2 hours)
Update SYSTEMS.md, CHANGELOG.md, create integration guide

**TOTAL: 28-37 hours**

---

## MOBILE SUPPORT

### Touch Gestures
- **Swipe Up:** Look at judge
- **Swipe Down:** Look at desk
- **Tap:** Fill form fields
- **Double-Tap Judge:** Trigger reaction
- **Pinch:** DISABLED (prevent zoom)

### Responsive Design
- Canvas auto-scales (maintains 3:2 aspect ratio)
- Form inputs 48px minimum touch targets
- 16px font size (prevents iOS zoom)
- Simplified navigation buttons

---

## SOUND EFFECTS

**New sounds needed:**
1. **Chair Creak** - When looking up/down (80Hz sawtooth, 0.3s)
2. **Paper Rustle** - When changing pages (white noise, highpass filtered)
3. **Judge Yell** - APOPLECTIC/VOLCANIC states (distorted 150-200Hz)
4. **Gavel Strike** - Already exists in soundsystem.js

---

## TESTING CHECKLIST

- [ ] Canvas renders at 60fps on desktop
- [ ] Canvas scales correctly on mobile (375px - 1920px widths)
- [ ] All 6 anger states transition smoothly
- [ ] Gavel animations sync with sound
- [ ] Camera shake intensity scales with anger
- [ ] All 30+ questions validate correctly
- [ ] Error detection catches contradictions
- [ ] Patience meter updates in real-time
- [ ] Sentence accumulation displays correctly
- [ ] Touch gestures work on iOS and Android
- [ ] Keyboard navigation works (Tab, Enter, Space, Arrows)
- [ ] Save/load preserves courtroom state
- [ ] No console errors during full arrest flow

---

## EXPECTED PLAYER EXPERIENCE

1. **Arrest** → Canvas fades in, player looks down at desk
2. **Overwhelm** → Sees massive stack of paperwork, 5 pages
3. **Filling Forms** → Absurd questions (moon phase? blood type? haiku?)
4. **Curiosity** → Presses SPACE to look up
5. **DREAD** → Judge Hardcastle looms, nearly full-screen
6. **Judge Reacts** → "The forms are DOWN THERE. Not UP HERE."
7. **Back to Work** → Looks down, continues forms
8. **Mistakes** → Validation errors trigger judge anger
9. **Escalation** → Judge progresses: IRRITATED → ANGRY → FURIOUS
10. **Gavel Strike** → Screen shakes, sentence increases
11. **More Mistakes** → Judge reaches APOPLECTIC or VOLCANIC
12. **Final Submission** → Judge calculates sentence based on errors
13. **Sentencing** → "I hereby sentence you to 7 years, plus 6 months for that look on your face"
14. **Prison** → Enhanced courtroom deactivates, prison menu loads

---

## WHY THIS IS EPIC

**Visual Drama:** First-person perspective makes bureaucracy visceral
**Atmospheric Dread:** Dark lighting, vignette, oppressive judge presence
**Escalating Tension:** Judge anger system creates stakes
**Dark Humor:** Absurd questions contrast with serious consequences
**Player Agency:** Look up/down mechanic creates rhythm and pacing
**Mobile-First:** Touch gestures feel natural and intuitive

This isn't just a form-filling minigame. It's a **boss encounter with bureaucracy**.

---

## NEXT STEPS

1. Read full design document: `ENHANCED_COURTROOM_TECHNICAL_DESIGN.md`
2. Review existing code: `game.js` lines 337-566 (JudgeHardcastle class)
3. Start Phase 1: Create `enhanced-courtroom.js` and implement renderer
4. Follow implementation checklist in sequential order
5. Test frequently on both desktop and mobile

---

**Document Last Updated:** 2025-10-15
**Status:** DESIGN COMPLETE - READY FOR IMPLEMENTATION
