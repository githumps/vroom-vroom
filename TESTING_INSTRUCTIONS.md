# Testing Instructions - Pixel Art Courtroom System

**Version:** v1.5.0-alpha
**Date:** 2025-10-20
**Test Target:** Enhanced Ace Attorney Courtroom with Judge Hardcastle

---

## 🎯 QUICK START TEST

### 1. Open the Game
```
Open: file:///Users/ccqw/Developer/vroom-vroom/game/index.html
```

### 2. Create Character
- Enter name
- Select skin tone
- Select height
- Select voice (click preview to hear)
- Select car model and color
- Click "START GAME"

### 3. Drive Until Arrested
- Click "DRIVE" on main menu
- Press W (or up arrow) to accelerate
- Drive for ~5-10 seconds
- Police will spawn automatically
- Keep driving until caught
- Press SPACE to surrender (or get caught)

### 4. Test Courtroom System
**Expected Flow:**
1. License inspection animation (4 seconds)
2. Arrest cinematic plays
3. Courtroom screen appears
4. Judge Hardcastle pixel art renders
5. Opening dialogue plays (typewriter effect)
6. Charges list displays
7. Forms appear on canvas
8. Fill out all 6 form fields
9. Click SUBMIT FORMS button
10. Verdict animation plays
11. Judgment cinematic plays
12. Prison screen appears

---

## 🔍 DETAILED TEST CASES

### Test Case 1: Judge Animations
**Objective:** Verify Judge Hardcastle pixel art renders and animates

**Steps:**
1. Enter courtroom
2. Observe judge sprite

**Expected Results:**
- [ ] Judge sprite visible in center of canvas
- [ ] Judge has white wig, black robes, skin tone
- [ ] Breathing animation (2-pixel vertical movement)
- [ ] Random blinking (every 5-10 seconds)
- [ ] Patience starts at ~0-20 (neutral expression)
- [ ] No veins visible at low patience

**Pass Criteria:** All animations smooth at 60fps, sprite renders correctly

---

### Test Case 2: Background Rendering
**Objective:** Verify courtroom environment renders

**Steps:**
1. Enter courtroom
2. Look at background elements

**Expected Results:**
- [ ] Wood paneling on lower 2/3 of screen
- [ ] Judge's bench (mahogany)
- [ ] Green banker's lamp (left side of bench)
- [ ] Law books on shelves (background)
- [ ] Wall clock showing time
- [ ] Framed portrait on wall
- [ ] Dust particles floating
- [ ] Light rays from above
- [ ] Film grain overlay
- [ ] Vignette effect on edges

**Pass Criteria:** All elements visible, Disco Elysium aesthetic maintained

---

### Test Case 3: Opening Dialogue
**Objective:** Verify dialogue system works

**Steps:**
1. Enter courtroom
2. Wait for dialogue to appear

**Expected Results:**
- [ ] Dialogue box appears at bottom of screen
- [ ] "JUDGE HARDCASTLE" label in yellow
- [ ] Judge's opening statement displays
- [ ] Typewriter effect (30ms per character)
- [ ] "▼ Click to continue" prompt visible
- [ ] Clicking advances dialogue
- [ ] Clicking again shows charges
- [ ] Final click shows forms

**Pass Criteria:** Dialogue readable, typewriter smooth, click advances correctly

---

### Test Case 4: Form Field Interaction
**Objective:** Verify form fields are interactive

**Steps:**
1. Wait for forms to appear
2. Click on "FORM 27-B: Reason for Driving" field
3. Type text
4. Click on next field

**Expected Results:**
- [ ] Field gains focus (blue border)
- [ ] Cursor blinks inside field
- [ ] Typed characters appear
- [ ] Backspace removes characters
- [ ] Previous field loses focus when new field clicked
- [ ] Field border turns blue when focused
- [ ] Field border returns to grey when blurred

**Pass Criteria:** All form interactions work smoothly

---

### Test Case 5: Dropdown Select
**Objective:** Verify dropdown menu works

**Steps:**
1. Click on "FORM 99-Z: Statement of Intent" dropdown
2. Observe dropdown opens
3. Hover over options
4. Click an option

**Expected Results:**
- [ ] Dropdown opens below field
- [ ] 4 options visible:
  - "I was going to buy groceries"
  - "I was going to work"
  - "I was experiencing joy"
  - "I was simply existing"
- [ ] Hovered option highlights (yellow)
- [ ] Clicked option selects
- [ ] Dropdown closes after selection
- [ ] Selected option displays in field

**Pass Criteria:** Dropdown fully functional, options selectable

---

### Test Case 6: Judge Commentary
**Objective:** Verify Judge reacts to form input

**Steps:**
1. Fill out "Reason for Driving" field
2. Click away from field (blur)
3. Observe Judge reaction

**Expected Results:**
- [ ] Temporary message appears (red text)
- [ ] One of 4 random snarky comments displays
- [ ] Judge patience increases by 5
- [ ] Judge anger animation updates
- [ ] If patience > 50, gavel strike triggers
- [ ] Message fades after 3 seconds

**Repeat for:**
- [ ] Vehicle Description field
- [ ] Statement of Intent dropdown

**Pass Criteria:** Judge reacts to every filled field, comments are humorous and fit Judge Hardcastle's personality

---

### Test Case 7: Form Validation
**Objective:** Verify incomplete forms are rejected

**Steps:**
1. Leave some fields blank
2. Click SUBMIT FORMS button

**Expected Results:**
- [ ] OBJECTION! overlay appears (red, large text)
- [ ] Judge error message displays
- [ ] One of 8 random incomplete comments shows
- [ ] Patience increases by 30
- [ ] Judge anger animation increases
- [ ] Gavel strike sound plays
- [ ] OBJECTION! fades after 2 seconds
- [ ] Forms remain visible
- [ ] Empty fields highlighted with red borders

**Pass Criteria:** Validation prevents submission, user feedback is clear and dramatic

---

### Test Case 8: Complete Form Submission
**Objective:** Verify successful form submission

**Steps:**
1. Fill all 6 form fields:
   - Reason for Driving (any text)
   - Vehicle Description (any text)
   - Statement of Intent (select any option)
   - Initial 1 (3 characters)
   - Initial 2 (3 characters)
   - Initial 3 (3 characters)
2. Click SUBMIT FORMS button

**Expected Results:**
- [ ] Forms disappear
- [ ] Judge returns to center view
- [ ] Judge patience sets to 100 (maximum drama)
- [ ] Judge face turns red/purple
- [ ] 9 veins pulsing on forehead
- [ ] Gavel raised high
- [ ] Screen shaking violently
- [ ] Verdict dialogue appears:
  - "VERDICT: GUILTY!"
  - Judge's sentencing statement
  - Sentence in years
  - "May this serve as a lesson..."
- [ ] Gavel strike animation plays
- [ ] Screen flash effect
- [ ] Judgment cinematic starts
- [ ] Prison door clang sound plays
- [ ] Prison screen appears

**Pass Criteria:** Complete flow from submission to prison, all dramatic effects trigger

---

### Test Case 9: Anger Progression
**Objective:** Verify Judge anger states progress correctly

**Steps:**
1. Enter courtroom (patience: 0-15, neutral)
2. Fill first field (patience: ~5)
3. Fill second field (patience: ~10)
4. Fill third field (patience: ~15)
5. Try submitting incomplete (patience: ~45)
6. Fill fourth field (patience: ~50)
7. Fill fifth field (patience: ~55)
8. Fill sixth field (patience: ~60)
9. Submit complete form (patience: 100)

**Expected Anger States:**
- [ ] **Neutral (0-15):** Normal skin, no veins, neutral expression
- [ ] **Irritated (16-35):** Slightly pink skin, 1 vein, eyebrows lowered
- [ ] **Angry (36-60):** Pink skin, 3 veins, deep frown
- [ ] **Furious (61-85):** Red skin, 5 veins, gavel raised, light screen shake
- [ ] **Apoplectic (86-99):** Dark red skin, 7 veins, heavy screen shake
- [ ] **Volcanic (100):** Purple-red skin, 9 veins, violent shake, red overlay

**Pass Criteria:** Smooth progression through all anger states, visual changes clear

---

### Test Case 10: Mobile Responsiveness
**Objective:** Verify system works on mobile devices

**Steps:**
1. Open game on mobile browser (or resize browser to 375px width)
2. Complete full courtroom flow

**Expected Results:**
- [ ] Canvas scales to fit mobile screen
- [ ] Forms are readable (text not too small)
- [ ] Touch input works for all fields
- [ ] Mobile keyboard appears when tapping text fields
- [ ] Dropdown works with touch
- [ ] SUBMIT button is large enough to tap (48px minimum)
- [ ] Dialogue box fits mobile screen
- [ ] OBJECTION! overlay readable on small screen
- [ ] Judge animations smooth (60fps)
- [ ] No horizontal scrolling
- [ ] All text readable without zoom

**Pass Criteria:** Full functionality on mobile, smooth performance

---

### Test Case 11: Multiple Arrests
**Objective:** Verify system works across multiple arrests

**Steps:**
1. Complete first arrest → courtroom → prison
2. Escape or serve sentence
3. Drive again → Get arrested again
4. Complete courtroom again
5. Check arrest count and license stamps

**Expected Results:**
- [ ] Second arrest works identically to first
- [ ] Arrest count increments correctly
- [ ] License renderer adds new stamp
- [ ] Judge patience may start higher (remembers player)
- [ ] Sentence increases with repeat offenses
- [ ] Achievement triggers at arrest milestones:
  - First arrest: "First Timer" achievement
  - 10th arrest: "Frequent Flyer" achievement
  - 100th arrest: "Career Criminal" achievement

**Pass Criteria:** System handles multiple arrests without issues

---

## 🐛 BUG REPORTING

If you find a bug during testing, document it with:

### Bug Report Template
```
**Title:** [Brief description]
**Severity:** [Critical / Major / Minor / Cosmetic]
**Steps to Reproduce:**
1. ...
2. ...
3. ...

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots/Console Errors:**
[Attach if available]

**Environment:**
- Browser: [Chrome/Firefox/Safari/Mobile Safari]
- OS: [macOS/Windows/iOS/Android]
- Screen Size: [e.g., 1920x1080, iPhone 14 Pro]
```

---

## ✅ TEST COMPLETION CHECKLIST

- [ ] Judge animations working
- [ ] Background renders correctly
- [ ] Dialogue system functional
- [ ] Form fields interactive
- [ ] Dropdown select works
- [ ] Judge commentary triggers
- [ ] Form validation works
- [ ] Complete submission works
- [ ] Anger progression correct
- [ ] Mobile responsive
- [ ] Multiple arrests work
- [ ] Audio plays correctly (if enabled)
- [ ] No console errors
- [ ] Performance smooth (60fps)
- [ ] Save/load compatible

**Test Date:** __________
**Tester:** __________
**Result:** ☐ PASS ☐ FAIL (see bug reports)

---

## 📝 NOTES SECTION

Use this space for additional observations:

```
[Your notes here]
```

---

**Happy Testing! May Judge Hardcastle have mercy on your soul.**
