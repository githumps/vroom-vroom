# STAT THRESHOLD SYSTEM - INTEGRATION GUIDE

**Version:** v4.1.0
**Status:** ✅ Partially Integrated (50% complete)
**Created:** 2025-10-20

---

## OVERVIEW

This system makes player stats (Intelligence, Strength, Hunger, Good Behavior) **actually matter** in gameplay through:

1. **Thresholds** - 6 tiers per stat (0-19, 20-39, 40-59, 60-79, 80-99, 100)
2. **Effects** - Locked activities, price modifiers, stat gain bonuses/penalties
3. **Daily Effects** - Passive gains/losses (starvation, bullying, income)
4. **Special Events** - Collapse from hunger, solitary confinement

---

## WHAT'S ALREADY DONE ✅

### 1. System Files Created
- ✅ `/game/systems/stat-thresholds.js` (801 lines) - Complete threshold definitions
- ✅ `/game/systems/stat-effects.js` (567 lines) - Daily effects and modifiers

### 2. Scripts Loaded
- ✅ Added to `index.html` lines 2823-2824

### 3. Systems Initialized
- ✅ Added to `game.js` constructor `init()` method (lines 773-779)
- ✅ `this.statThresholds` and `this.statEffects` available

### 4. Player Stats Initialized
- ✅ Added to player object (lines 620-624):
  ```javascript
  intelligence: 0,     // 0-100
  strength: 0,         // 0-100
  hunger: 50,          // 0-100 (lower = hungrier)
  goodBehaviorPoints: 50  // 0-100+
  ```

### 5. Workout Modified
- ✅ `completeWorkout()` now uses `statEffects.modifyActivityGain()` (line 3438)
- ✅ Hunger affects strength gains
- ✅ Current strength affects gym gains (stronger = faster gains)

---

## WHAT STILL NEEDS TO BE DONE 🟡

### CRITICAL: Time Advancement Function

**Add this method to game.js (before `endPrison()` around line 3986):**

```javascript
// Time advancement with stat effects - NEW v4.1.0
advancePrisonTime(days = 1) {
    // Advance time
    this.player.prisonDays += days;

    // Apply daily stat effects (hunger decay, bullying, passive income, etc.)
    if (this.statEffects) {
        for (let i = 0; i < days; i++) {
            this.statEffects.applyDailyEffects();
        }
    }

    // Update UI
    const timeServedElement = document.getElementById('timeServed');
    if (timeServedElement) {
        timeServedElement.textContent = this.player.prisonDays;
    }

    // Check if sentence complete
    if (this.player.prisonDays >= this.player.sentence * 7) {
        setTimeout(() => this.endPrison(), 2000);
        return true; // Sentence completed
    }

    return false; // Still serving time
}
```

**Then replace ALL instances of:**
```javascript
this.player.prisonDays += 1;
document.getElementById('timeServed').textContent = this.player.prisonDays;
```

**With:**
```javascript
this.advancePrisonTime(1);
```

**Locations to replace (7 total):**
- Line 2347 (library)
- Line 2443 (library)
- Line 2689 (eating)
- Line 2718 (cafeteria)
- Line 2739 (yard)
- Line 2793 (laundry)
- Line 3462 (workout) - already partially done

---

### Prison Activity Gating

**Add stat checks BEFORE allowing activities:**

#### Library Access (around line 3806)
```javascript
startLibrary() {
    // Check if player can access library
    if (this.statThresholds) {
        const check = this.statThresholds.canPerformActivity('library', this.player);
        if (!check.allowed) {
            this.showMessage(check.reason, 5000);
            return; // Block access
        }
    }

    // ... rest of existing code
}
```

#### Gym Access (around line 3255)
```javascript
initializeWeightLifting() {
    // Check if player can use gym
    if (this.statThresholds) {
        const check = this.statThresholds.canPerformActivity('gym', this.player);
        if (!check.allowed) {
            this.showMessage(check.reason, 5000);
            return; // Block access
        }
    }

    // ... rest of existing code
}
```

---

### Intelligence Gains Modified

**In library reading completion (library-methods.js or game.js):**

```javascript
// When finishing reading
let intelligenceGain = 1;

// Apply stat modifiers (hunger affects concentration)
if (this.statEffects) {
    intelligenceGain = this.statEffects.modifyActivityGain(intelligenceGain, 'intelligence');

    // Check if distracted by hunger
    if (this.statEffects.checkReadingDistraction()) {
        intelligenceGain = 0; // Too hungry to focus
        this.showMessage('You were too distracted by hunger to absorb anything.', 3000);
    }
}

this.player.intelligence = Math.min(100, this.player.intelligence + intelligenceGain);
```

---

### Price Modifiers

**In commissary shop `buyItem()` method (around line 4009):**

```javascript
buyItem(item, basePrice) {
    // Apply stat-based price modifier
    let price = basePrice;
    if (this.statEffects) {
        price = this.statEffects.modifyPrice(basePrice, item);
    }

    // Check if player has enough money
    if (this.player.money < price) {
        this.showMessage(`Not enough credits. You need ${price}, but only have ${this.player.money}.`, 3000);
        return;
    }

    // ... rest of purchase logic
}
```

---

### Eating System Integration

**In `finishEating()` method:**

```javascript
finishEating() {
    // Reduce hunger
    this.player.hunger = Math.max(0, this.player.hunger - 20);

    // Check for food coma achievement (hunger = 100)
    if (this.player.hunger === 100 && this.statThresholds) {
        const threshold = this.statThresholds.getThreshold('hunger', 100);
        if (threshold && threshold.effects.megaRestBonus) {
            // Apply +5 to all stats
            this.player.strength = Math.min(100, this.player.strength + 5);
            this.player.intelligence = Math.min(100, this.player.intelligence + 5);
            this.player.goodBehaviorPoints = Math.min(100, this.player.goodBehaviorPoints + 5);

            this.showMessage('🏆 FOOD COMA! +5 to all stats! Now you just need to sleep it off...', 5000);

            // Then drop to 50
            setTimeout(() => {
                this.player.hunger = 50;
                this.saveGame();
            }, 6000);
        }
    }

    this.saveGame();
}
```

---

### UI Stat Display Enhancement

**In `updateStatsPanel()` method (around line 1220):**

```javascript
updateStatsPanel() {
    // ... existing stat bar code ...

    // Add threshold tier displays (NEW v4.1.0)
    if (this.statThresholds) {
        // Intelligence tier
        const intDisplay = document.getElementById('intelligenceThresholdDisplay');
        if (intDisplay) {
            intDisplay.innerHTML = this.statThresholds.formatThresholdDisplay('intelligence', this.player.intelligence || 0);
        }

        // Strength tier
        const strDisplay = document.getElementById('strengthThresholdDisplay');
        if (strDisplay) {
            strDisplay.innerHTML = this.statThresholds.formatThresholdDisplay('strength', this.player.strength || 0);
        }

        // Hunger tier
        const hungerDisplay = document.getElementById('hungerThresholdDisplay');
        if (hungerDisplay) {
            hungerDisplay.innerHTML = this.statThresholds.formatThresholdDisplay('hunger', this.player.hunger || 50);
        }

        // Good Behavior tier
        const behaviorDisplay = document.getElementById('goodBehaviorThresholdDisplay');
        if (behaviorDisplay) {
            hungerDisplay.innerHTML = this.statThresholds.formatThresholdDisplay('goodBehaviorPoints', this.player.goodBehaviorPoints || 50);
        }
    }
}
```

**Add to HTML stats panel (in index.html):**

```html
<!-- Inside stats panel, after each stat bar -->
<div id="intelligenceThresholdDisplay"></div>
<div id="strengthThresholdDisplay"></div>
<div id="hungerThresholdDisplay"></div>
<div id="goodBehaviorThresholdDisplay"></div>
```

---

### Courtroom Intelligence Bonuses

**In courtroom form submission (around courtroom methods):**

```javascript
submitCourtroomForm() {
    // ... existing validation ...

    // Intelligence bonus: auto-fill some fields
    if (this.statThresholds) {
        const intThreshold = this.statThresholds.getThreshold('intelligence', this.player.intelligence || 0);

        if (intThreshold && intThreshold.effects.courtFormAutofill) {
            const autofillPercent = intThreshold.effects.courtFormAutofill;
            const fieldsToFill = Math.floor(totalFields * autofillPercent);

            this.showMessage(`Your intelligence auto-filled ${fieldsToFill} fields correctly!`, 3000);

            // Reduce required fields or add bonus points
            correctAnswers += fieldsToFill;
        }

        // Check for sentence reduction
        if (intThreshold && intThreshold.effects.legalLoopholes) {
            this.showMessage('You spot a legal loophole! Sentence reduced by 10%!', 5000);
            this.player.sentence = Math.ceil(this.player.sentence * 0.9);
        }
    }

    // ... rest of form processing ...
}
```

---

### Random Bullying Events

**Add to prison menu or random event system:**

```javascript
checkDailyBullying() {
    if (!this.statEffects) return;

    const bullyResult = this.statEffects.checkBullyingEvent();

    if (bullyResult && bullyResult.happened) {
        if (bullyResult.cigarettesLost > 0) {
            this.player.cigarettes = Math.max(0, this.player.cigarettes - bullyResult.cigarettesLost);
        }

        this.showMessage(bullyResult.message, 5000);
        this.saveGame();
    }
}
```

---

### Good Behavior Tracking

**Add good behavior point changes throughout the game:**

```javascript
// Good behavior gains
this.player.goodBehaviorPoints = Math.min(100, this.player.goodBehaviorPoints + 5); // Completing activities
this.player.goodBehaviorPoints = Math.min(100, this.player.goodBehaviorPoints + 10); // Helping inmates

// Good behavior losses
this.player.goodBehaviorPoints = Math.max(0, this.player.goodBehaviorPoints - 10); // Fighting
this.player.goodBehaviorPoints = Math.max(0, this.player.goodBehaviorPoints - 20); // Caught with contraband
this.player.goodBehaviorPoints = Math.max(0, this.player.goodBehaviorPoints - 30); // Escape attempt
```

---

## TESTING CHECKLIST

### Basic Functionality
- [ ] Stats display correctly on stats panel
- [ ] Threshold tiers show with colors
- [ ] "Next tier" displays correctly

### Gym System
- [ ] Weak players (0-19 STR) are blocked from gym
- [ ] Strength gains modified by hunger
- [ ] Strong players (40-59 STR) get 50% faster gains
- [ ] Gains displayed correctly in messages

### Library System
- [ ] Low intelligence (0-19 INT) blocks library access
- [ ] Hunger affects reading speed and concentration
- [ ] Intelligence gains work with modifiers

### Daily Effects
- [ ] Starvation (0-19 hunger) loses 2 STR, 1 INT per day
- [ ] Weak players (0-19 STR) lose 5 cigarettes/day to bullies
- [ ] Well-fed players (60-79 hunger) get +10% stat gains
- [ ] Daily effects notification appears

### Special Events
- [ ] Collapse event triggers at low hunger (10% chance)
- [ ] Solitary confinement triggers at low behavior (5% chance)
- [ ] Achievements unlock at stat milestones

### Prices
- [ ] High intelligence (80+) gives 20% discount
- [ ] Good behavior (60+) gives 10% discount
- [ ] Bad behavior (0-19) increases prices 25%

### Courtroom
- [ ] High intelligence auto-fills forms
- [ ] Legal loopholes reduce sentence

---

## ACHIEVEMENT UNLOCKS

When players reach specific stat thresholds, achievements should unlock:

- **Intelligence 100:** "Too Smart For This Place"
- **Strength 100:** "The Mountain"
- **Hunger 100:** "Feast Mode"
- **Good Behavior 100+:** "Angel in Orange"

---

## BALANCE SPREADSHEET

| Stat | Threshold | Effect | Balanced? |
|------|-----------|--------|-----------|
| Intelligence 0-19 | Library blocked, 2x court time | ⚠️ Maybe too harsh for new players |
| Intelligence 80+ | 20% discount, blueprints | ✅ Good reward |
| Strength 0-19 | Bullied (-5 cigs/day), gym blocked | ✅ Punishing but fair |
| Strength 100 | Break through wall escape | ✅ Epic reward |
| Hunger 0-19 | -2 STR, -1 INT per day | ⚠️ Death spiral possible |
| Hunger 80-99 | +20% gains, immune to illness | ✅ Strong incentive to eat |
| Behavior 0-19 | 5% solitary risk, 25% price increase | ✅ Punishing as intended |
| Behavior 100+ | 50% sentence reduction | 🔥 OVERPOWERED - consider 25% |

**Recommendation:** Reduce perfect behavior sentence reduction from 50% to 25-30% to maintain challenge.

---

## IMPLEMENTATION PRIORITY

1. **HIGH:** Time advancement function (enables daily effects)
2. **HIGH:** Activity gating (gym, library blocks)
3. **MEDIUM:** Price modifiers (economic balance)
4. **MEDIUM:** UI threshold displays (player feedback)
5. **LOW:** Courtroom intelligence bonuses (nice-to-have)
6. **LOW:** Special dialogue options (flavor)

---

## ESTIMATED TIME

- **Remaining integration:** 2-3 hours
- **Testing:** 1 hour
- **Balance tweaking:** 30 minutes
- **Total:** ~4 hours to full completion

---

## FILES TO MODIFY

1. `/game/core/game.js` - Main integration (7 locations for time advancement, activity checks)
2. `/game/systems/library-methods.js` - Reading modifiers
3. `/game/index.html` - UI threshold display elements
4. `/game/visual-system.css` - Threshold display styling (optional)

---

## KNOWN ISSUES

1. **Death Spiral:** If hunger gets too low, player loses stats daily and can't recover
   - **Fix:** Add minimum free food option or emergency rations

2. **Soft Lock:** If strength is 0-19, can't use gym to increase it
   - **Fix:** Add pushups in cell (slow strength gain 0.5/day)

3. **Achievement spam:** Multiple achievements could unlock at once
   - **Already handled:** StatEffectsSystem checks `player.achievements` array

---

## NEXT STEPS

1. Implement time advancement function
2. Add activity gating to gym and library
3. Test daily effects in browser
4. Add UI threshold displays
5. Balance test for 30 minutes of gameplay
6. Update CHANGELOG.md and version to v4.1.0

---

**Status:** Ready for final integration pass.
**Blocker:** None - all systems functional, just need hookups.
