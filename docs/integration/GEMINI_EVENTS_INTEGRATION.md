# GEMINI RANDOM EVENTS INTEGRATION GUIDE

**Ready-to-Use Implementation Steps**
**Time Required:** 4-6 hours
**Complexity:** Medium
**Prerequisites:** Understanding of game.js structure, API integration basics

---

## TABLE OF CONTENTS

1. [Quick Start](#quick-start)
2. [Step-by-Step Integration](#step-by-step-integration)
3. [Code Modifications](#code-modifications)
4. [Testing Instructions](#testing-instructions)
5. [Troubleshooting](#troubleshooting)

---

## QUICK START

### What You're Adding
- AI-generated prison events using Gemini API
- Ambient events every 2-5 minutes
- Dynamic guard dialogue
- Corruption tracking system
- Time-based event variations

### Files to Create
1. `C:\Users\evan\Documents\GitHub\vroom-vroom\game\gemini-events.js` (new file)

### Files to Modify
1. `C:\Users\evan\Documents\GitHub\vroom-vroom\game\index.html` (add script tag)
2. `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js` (initialize systems)

---

## STEP-BY-STEP INTEGRATION

### STEP 1: Create gemini-events.js File

**Location:** `C:\Users\evan\Documents\GitHub\vroom-vroom\game\gemini-events.js`

**Content:** Copy the complete implementation from `docs/systems/GEMINI_RANDOM_EVENTS_SYSTEM.md` (section: Complete Implementation)

**Verification:**
```bash
# Check file exists
ls game/gemini-events.js
```

---

### STEP 2: Add Script to index.html

**File:** `C:\Users\evan\Documents\GitHub\vroom-vroom\game\index.html`

**Find this section (around line 1700-1750):**
```html
<script src="soundsystem.js"></script>
<script src="tattoo-system.js"></script>
<script src="car-selection.js"></script>
<script src="game.js"></script>
```

**Add this line BEFORE `game.js`:**
```html
<script src="soundsystem.js"></script>
<script src="tattoo-system.js"></script>
<script src="car-selection.js"></script>
<script src="gemini-events.js"></script>  <!-- NEW -->
<script src="game.js"></script>
```

**Why:** gemini-events.js must load before game.js so classes are available during initialization.

---

### STEP 3: Initialize Systems in VroomVroomGame Constructor

**File:** `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`

**Find:** `constructor()` method (around line 568-650)

**Add AFTER existing initializations (after `this.apiKeyManager = new ApiKeyManager();`):**

```javascript
constructor() {
    // ... existing code ...

    // API Key Manager (existing)
    this.apiKeyManager = new ApiKeyManager();

    // NEW: Gemini Random Events System
    this.geminiEvents = new GeminiRandomEventGenerator(this.apiKeyManager);
    this.ambientTimer = new AmbientEventTimer(this.geminiEvents, this.soundSystem);
    this.guardDialogue = new GuardDialogueSystem(this.geminiEvents);
    this.corruptionTracker = new CorruptionTracker();
    this.timedEvents = new TimedEventSystem(this.geminiEvents);

    // Track current screen for ambient events
    this.currentScreen = 'menu';

    // ... rest of existing code ...
}
```

---

### STEP 4: Generate Event Pool on Game Start

**File:** `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`

**Find:** `init()` method (around line 700-800)

**Add AFTER menu initialization:**

```javascript
init() {
    // ... existing code ...

    this.showScreen('menu');

    // NEW: Generate event pool if API key available (non-blocking)
    setTimeout(() => {
        this.generateEventPoolIfPossible();
    }, 2000); // 2-second delay to not block game start

    // ... rest of existing code ...
}

// NEW METHOD: Add this method to VroomVroomGame class
async generateEventPoolIfPossible() {
    if (!this.apiKeyManager.hasApiKey()) {
        console.log('[GEMINI] No API key - events will use static fallbacks');
        return;
    }

    console.log('[GEMINI] Generating event pool...');
    const success = await this.geminiEvents.generateEventPool();

    if (success) {
        console.log('[GEMINI] Event pool ready!');
        const status = this.geminiEvents.getPoolStatus();
        console.log('[GEMINI] Pool status:', status);
    } else {
        console.log('[GEMINI] Pool generation failed - using static events');
    }
}
```

---

### STEP 5: Start/Stop Ambient Timer on Prison Menu

**File:** `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`

**Find:** `startPrison()` method (around line 1940-1970)

**Add at the END of the method:**

```javascript
startPrison() {
    this.gameState = 'prison';
    this.player.prisonStartTime = Date.now();
    this.showScreen('prisonMenu');
    document.getElementById('sentenceLength').textContent = this.player.sentence;
    document.getElementById('timeServed').textContent = this.player.prisonDays;

    // NEW: Initialize corruption system
    this.corruptionTracker.initialize(this.player);

    // NEW: Start ambient event timer
    this.ambientTimer.start();

    this.saveGame();
}
```

**Find:** `showScreen(screenName)` method (around line 800-850)

**Modify to track current screen and stop timer when leaving prison:**

```javascript
showScreen(screenName) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');

    // Show requested screen
    const screen = document.getElementById(screenName);
    if (screen) {
        screen.style.display = 'flex';
    }

    // NEW: Track current screen for ambient events
    this.currentScreen = screenName;

    // NEW: Stop ambient timer if leaving prison menu
    if (screenName !== 'prisonMenu' && this.ambientTimer) {
        this.ambientTimer.stop();
    }

    // NEW: Restart ambient timer if returning to prison menu
    if (screenName === 'prisonMenu' && this.ambientTimer && this.gameState === 'prison') {
        this.ambientTimer.start();
    }
}
```

---

### STEP 6: Add Corruption Tracking to Actions

**File:** `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`

**Find existing methods and add corruption tracking:**

**A) Guard Manicure (if exists, around line 2400+):**

```javascript
completeGuardManicure(guardName) {
    // ... existing code ...

    // NEW: Track corruption for successful manicure
    this.corruptionTracker.incrementCorruption('successful_manicure', this.player);

    // ... rest of existing code ...
}
```

**B) Gang Activities (around line 2100-2200):**

```javascript
joinGang(gangName) {
    // ... existing code ...

    // NEW: Track corruption for gang membership
    this.corruptionTracker.incrementCorruption('gang_activity', this.player);

    // ... rest of existing code ...
}
```

**C) Escape Planning (around line 2300-2400):**

```javascript
planEscape(method) {
    // ... existing code ...

    // NEW: Track corruption for escape planning
    this.corruptionTracker.incrementCorruption('escape_planning', this.player);

    // ... rest of existing code ...
}
```

**D) Good Behavior (add to daily progression):**

**Find:** `advanceDay()` or `updatePrisonTime()` method

**Add:**

```javascript
advanceDay() {
    // ... existing code ...

    // NEW: Reduce corruption slightly for good behavior
    if (this.player.goodBehaviorPoints > 50) {
        this.corruptionTracker.incrementCorruption('good_behavior_day', this.player);
    }

    // ... rest of existing code ...
}
```

---

### STEP 7: Add Corruption Display to Prison HUD

**File:** `C:\Users\evan\Documents\GitHub\vroom-vroom\game\index.html`

**Find:** Prison menu stats display (around line 900-1000)

**Add corruption meter:**

```html
<!-- Prison Stats Display -->
<div id="prisonStats">
    <p>Sentence: <span id="sentenceLength"></span> years</p>
    <p>Days Served: <span id="timeServed"></span></p>
    <p>Credits: <span id="prisonCredits"></span></p>
    <p>Cigarettes: <span id="prisonCigarettes"></span></p>

    <!-- NEW: Corruption Display -->
    <div id="corruptionMeter" style="margin-top: 10px;"></div>
</div>
```

**File:** `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`

**Add method to update corruption display:**

```javascript
// NEW METHOD: Add to VroomVroomGame class
updateCorruptionDisplay() {
    if (!this.corruptionTracker) return;

    const status = this.corruptionTracker.getCorruptionStatus();
    const level = this.corruptionTracker.corruptionLevel;

    const meter = document.getElementById('corruptionMeter');
    if (meter) {
        meter.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; opacity: 0.7;">
                <div style="color: ${status.color}; font-size: 0.8em;">CORRUPTION</div>
                <div style="width: 100px; height: 8px; background: #222; border: 1px solid ${status.color};">
                    <div style="width: ${level}%; height: 100%; background: ${status.color};"></div>
                </div>
                <div style="color: ${status.color}; font-size: 0.8em;">${level}</div>
            </div>
        `;
    }
}
```

**Call this method in `startPrison()` and `saveGame()`:**

```javascript
startPrison() {
    // ... existing code ...

    this.updateCorruptionDisplay(); // NEW

    this.saveGame();
}

saveGame() {
    // ... existing code ...

    this.updateCorruptionDisplay(); // NEW
}
```

---

### STEP 8: Integrate Guard Dialogue with Existing Systems

**File:** `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`

**Find:** Guard manicure system (if exists)

**Replace static guard dialogue with dynamic:**

```javascript
// BEFORE:
const guardDialogue = "Make it look good.";

// AFTER:
const guardDialogue = this.guardDialogue.getGuardDialogue(guardName, 'manicure');
```

**Find:** Random events with guards

**Replace static dialogue:**

```javascript
// In random event handling:
const guardComment = this.guardDialogue.getContextualDialogue('patrol');
```

---

### STEP 9: Add Player Object Properties

**File:** `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`

**Find:** Player initialization in `resetPlayer()` or `constructor()` (around line 650-750)

**Add corruption property:**

```javascript
resetPlayer() {
    this.player = {
        // ... existing properties ...

        // NEW: Corruption tracking
        corruption: 0,

        // ... rest of existing properties ...
    };
}
```

---

### STEP 10: Save/Load Integration

**File:** `C:\Users\evan\Documents\GitHub\vroom-vroom\game\game.js`

**Find:** `saveGame()` method

**Verify corruption is saved (should be automatic if in player object):**

```javascript
saveGame() {
    const saveData = {
        player: this.player, // Includes corruption automatically
        // ... rest of save data ...
    };

    localStorage.setItem('vroomVroomSave', JSON.stringify(saveData));
}
```

**Find:** `loadGame()` method

**Initialize corruption tracker after loading:**

```javascript
loadGame() {
    // ... load player data ...

    // NEW: Initialize corruption tracker
    if (this.corruptionTracker) {
        this.corruptionTracker.initialize(this.player);
    }

    // ... rest of load code ...
}
```

---

## CODE MODIFICATIONS SUMMARY

### Files Created
- `game/gemini-events.js` - Complete event system (800+ lines)

### Files Modified
- `game/index.html` - Script tag, corruption display
- `game/game.js` - Initialization, integration, corruption tracking

### Lines Added to game.js
- Constructor: ~10 lines (system initialization)
- init(): ~15 lines (pool generation)
- startPrison(): ~5 lines (timer start, corruption init)
- showScreen(): ~10 lines (timer management)
- Various methods: ~20 lines (corruption tracking)
- New methods: ~30 lines (updateCorruptionDisplay, generateEventPoolIfPossible)
- **Total:** ~90 lines added

---

## TESTING INSTRUCTIONS

### Pre-Integration Testing

**1. Verify File Structure:**
```bash
ls game/gemini-events.js
# Should exist

grep "gemini-events.js" game/index.html
# Should show script tag
```

**2. Check Syntax:**
```bash
node -c game/gemini-events.js
node -c game/game.js
```

### Post-Integration Testing

**1. Load Game in Browser:**
- Open developer console (F12)
- Check for errors
- Should see: `[GEMINI] No API key - events will use static fallbacks` (if no key)

**2. Test Event Pool Generation:**

**Console commands:**
```javascript
// Check system initialized
console.log('Gemini Events:', game.geminiEvents);
console.log('Ambient Timer:', game.ambientTimer);
console.log('Corruption Tracker:', game.corruptionTracker);

// Test pool generation (if API key set)
game.generateEventPoolIfPossible();

// Check pool status
console.log(game.geminiEvents.getPoolStatus());
```

**3. Test Ambient Events:**

**Steps:**
1. Start game
2. Get arrested, go to prison
3. Wait 2-5 minutes on prison menu
4. Should see ambient notification (bottom-left)

**Console check:**
```javascript
// Manually trigger event
game.ambientTimer.triggerAmbientEvent();
```

**4. Test Corruption System:**

**Console commands:**
```javascript
// Check initial corruption
console.log('Corruption:', game.player.corruption);

// Test corruption increase
game.corruptionTracker.incrementCorruption('bribe_guard', game.player);
console.log('Corruption after bribe:', game.player.corruption);

// Test corruption effects
console.log('Effects:', game.corruptionTracker.getCorruptionEffects());

// Test status display
game.updateCorruptionDisplay();
```

**5. Test Guard Dialogue:**

**Console commands:**
```javascript
// Test contextual dialogue
console.log(game.guardDialogue.getContextualDialogue('patrol'));
console.log(game.guardDialogue.getContextualDialogue('manicure'));
console.log(game.guardDialogue.getContextualDialogue('search'));

// Test guard-specific dialogue
console.log(game.guardDialogue.getGuardDialogue('Jenkins', 'manicure'));
```

**6. Test Event Retrieval:**

**Console commands:**
```javascript
// Get events from each category
console.log('Guard:', game.geminiEvents.getEvent('guardDialogue'));
console.log('Prison:', game.geminiEvents.getEvent('prisonEvents'));
console.log('Cellmate:', game.geminiEvents.getEvent('cellmateRemarks'));
console.log('Ambient:', game.geminiEvents.getEvent('ambientEvents'));

// Check stats
console.log('Stats:', game.geminiEvents.stats);
```

**7. Test Save/Load:**

**Steps:**
1. Increase corruption to 50+
2. Save game (should auto-save)
3. Reload page
4. Load game
5. Check corruption preserved

**Console check:**
```javascript
console.log('Loaded corruption:', game.player.corruption);
```

**8. Test Time-Based Events:**

**Console commands:**
```javascript
// Get time-specific event
console.log(game.timedEvents.getTimedEvent());

// Change system time and test different hours
```

---

## TROUBLESHOOTING

### Issue: Events not appearing

**Check:**
1. Is ambient timer started?
   ```javascript
   console.log('Timer active:', game.ambientTimer.isActive);
   ```
2. Is player on prison menu?
   ```javascript
   console.log('Current screen:', game.currentScreen);
   ```
3. Wait full 2-5 minutes (timer is random)

**Solution:**
```javascript
// Manually trigger event
game.ambientTimer.triggerAmbientEvent();
```

---

### Issue: Pool generation fails

**Check:**
1. API key set?
   ```javascript
   console.log('Has key:', game.apiKeyManager.hasApiKey());
   ```
2. Network connectivity?
3. API call limit reached? (unlikely with 14,000/day)

**Solution:**
```javascript
// Check error messages
game.generateEventPoolIfPossible();
// Watch console for error details
```

---

### Issue: Static events only (no AI events)

**Expected if:**
- No API key set
- API call failed
- Pool depleted

**Check:**
```javascript
console.log('Pool status:', game.geminiEvents.getPoolStatus());
```

**This is normal behavior** - system falls back to static events gracefully.

---

### Issue: Corruption not displaying

**Check:**
1. Element exists?
   ```javascript
   console.log('Meter:', document.getElementById('corruptionMeter'));
   ```
2. Corruption initialized?
   ```javascript
   console.log('Corruption:', game.player.corruption);
   ```

**Solution:**
```javascript
// Manually update display
game.updateCorruptionDisplay();
```

---

### Issue: Ambient timer doesn't stop

**Check:**
```javascript
console.log('Timer:', game.ambientTimer.timer);
console.log('Active:', game.ambientTimer.isActive);
```

**Solution:**
```javascript
// Manually stop
game.ambientTimer.stop();
```

---

## VERIFICATION CHECKLIST

**After integration, verify all these work:**

- [ ] Game loads without errors
- [ ] Gemini systems initialized in constructor
- [ ] Event pool generation attempted (if API key present)
- [ ] Ambient timer starts on prison menu
- [ ] Ambient timer stops when leaving prison
- [ ] Ambient events appear every 2-5 minutes
- [ ] Guard dialogue varies
- [ ] Corruption increases/decreases correctly
- [ ] Corruption meter displays
- [ ] Corruption effects apply
- [ ] Save/load preserves corruption
- [ ] Static fallbacks work without API key
- [ ] No console errors
- [ ] No gameplay blocking

---

## PERFORMANCE VALIDATION

**Expected metrics:**

**API Calls:**
- Session start: 1 call
- Per session: 1-2 calls max
- Daily (5 sessions): 5-10 calls

**Check actual usage:**
```javascript
console.log('API calls:', game.geminiEvents.stats.apiCallCount);
console.log('Events generated:', game.geminiEvents.stats.totalGenerated);
console.log('Events used:', game.geminiEvents.stats.totalUsed);
```

**Memory usage:**
- Event pool: ~8KB
- Should not grow over time

**Timing:**
- Pool generation: ~2 seconds
- Event retrieval: <1ms
- Ambient timer: No performance impact

---

## NEXT STEPS AFTER INTEGRATION

### Immediate (v1.5.0)
1. Test in production with real API key
2. Monitor API usage for 1 week
3. Gather player feedback on events
4. Adjust event frequency if needed

### Future Enhancements (v1.6.0+)
1. Enhanced cellmate dialogue
2. Dynamic random event outcomes
3. Seasonal event variations
4. Letter response generation

---

## ROLLBACK PROCEDURE

**If integration causes issues:**

**1. Remove script tag from index.html:**
```html
<!-- Comment out or delete: -->
<!-- <script src="gemini-events.js"></script> -->
```

**2. Comment out initialization in game.js:**
```javascript
// this.geminiEvents = new GeminiRandomEventGenerator(this.apiKeyManager);
// this.ambientTimer = new AmbientEventTimer(this.geminiEvents, this.soundSystem);
// etc.
```

**3. Remove corruption display:**
```html
<!-- <div id="corruptionMeter"></div> -->
```

**4. Test game still works**

**5. Commit changes:**
```bash
git add .
git commit -m "rollback: remove Gemini events integration"
```

---

## COMMIT MESSAGE TEMPLATE

```
feat: integrate Gemini API random events system (v1.5.0)

Adds AI-generated dynamic prison events with intelligent API call management.

FEATURES:
- Gemini API batch event generation (1-2 calls/session)
- Ambient prison events (every 2-5 minutes)
- Dynamic guard dialogue system
- Corruption tracking (0-100 stat)
- Time-based event variations
- Graceful fallback to static events

FILES ADDED:
- game/gemini-events.js (800+ lines)

FILES MODIFIED:
- game/index.html (script tag, corruption display)
- game/game.js (initialization, integration, ~90 lines)

TESTING:
- API call count verified (1-2 per session)
- Event pool generation tested
- Ambient timer tested (2-5 min intervals)
- Corruption tracking tested
- Save/load compatibility verified
- Static fallback tested (no API key)

PERFORMANCE:
- Event pool: ~8KB memory
- API usage: 0.04% of daily limit (5 sessions)
- No gameplay blocking
- No console errors

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

**END OF INTEGRATION GUIDE**

**Status:** ✅ Ready to Implement
**Estimated Time:** 4-6 hours
**Difficulty:** Medium
**Risk:** Low (graceful fallback built-in)
