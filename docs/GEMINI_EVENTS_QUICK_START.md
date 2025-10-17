# GEMINI RANDOM EVENTS - QUICK START GUIDE

**⚡ Fast-track implementation guide for v1.5.0**

---

## 🎯 WHAT IS THIS?

AI-generated dynamic prison events that make every playthrough unique while using **only 1-2 API calls per session**.

**Result:** Infinite replayability with minimal API usage (0.04% of daily free tier limit).

---

## 📋 BEFORE YOU START

**Read these docs (in order):**

1. **This file** - Quick overview (5 min read)
2. **`docs/systems/GEMINI_RANDOM_EVENTS_SYSTEM.md`** - Complete technical design (30 min read)
3. **`docs/integration/GEMINI_EVENTS_INTEGRATION.md`** - Step-by-step integration (follow along)

**Optional but recommended:**
- Get Gemini API key from https://makersuite.google.com/app/apikey (free tier: 14,000 requests/day)
- Test API key with existing ApiKeyManager

---

## ⚡ 5-MINUTE SUMMARY

### What It Does

**For Players:**
- Random events every 2-5 minutes on prison menu
- Guard dialogue changes every time
- Corruption stat tracks your crimes
- Every playthrough feels unique

**For Developers:**
- 1 API call generates 80+ events (used all session)
- Graceful fallback to static events (no API key needed)
- Zero gameplay blocking
- Works seamlessly with existing systems

### How It Works

```
Session Start → Generate 80 Events (1 API call) → Store in Memory
     ↓
Gameplay Loop → Pull from Pool → Display Events
     ↓
Pool Empty? → Fallback to Static Events (no new API calls)
     ↓
Next Session → Fresh Pool (1 new API call)
```

**Efficiency:** 98% fewer API calls than naive approach.

---

## 🚀 INTEGRATION (10 STEPS)

### Step 1: Create gemini-events.js
```bash
# Create file
touch game/gemini-events.js

# Copy implementation from:
# docs/systems/GEMINI_RANDOM_EVENTS_SYSTEM.md
# Section: "Complete Implementation"
# Lines: ~800 of ready-to-use code
```

### Step 2: Add Script to index.html
```html
<!-- Find this section (around line 1700): -->
<script src="soundsystem.js"></script>
<script src="tattoo-system.js"></script>
<script src="car-selection.js"></script>
<!-- ADD THIS LINE: -->
<script src="gemini-events.js"></script>
<script src="game.js"></script>
```

### Step 3: Initialize in game.js Constructor
```javascript
// Find: constructor() method (line ~568)
// Add after: this.apiKeyManager = new ApiKeyManager();

this.geminiEvents = new GeminiRandomEventGenerator(this.apiKeyManager);
this.ambientTimer = new AmbientEventTimer(this.geminiEvents, this.soundSystem);
this.guardDialogue = new GuardDialogueSystem(this.geminiEvents);
this.corruptionTracker = new CorruptionTracker();
this.timedEvents = new TimedEventSystem(this.geminiEvents);
this.currentScreen = 'menu';
```

### Step 4: Generate Pool on Start
```javascript
// Find: init() method (line ~700)
// Add after: this.showScreen('menu');

setTimeout(() => {
    this.generateEventPoolIfPossible();
}, 2000);

// Add this new method to VroomVroomGame class:
async generateEventPoolIfPossible() {
    if (!this.apiKeyManager.hasApiKey()) {
        console.log('[GEMINI] No API key - using static events');
        return;
    }

    console.log('[GEMINI] Generating event pool...');
    const success = await this.geminiEvents.generateEventPool();

    if (success) {
        console.log('[GEMINI] Event pool ready!');
        console.log('[GEMINI] Pool status:', this.geminiEvents.getPoolStatus());
    } else {
        console.log('[GEMINI] Pool generation failed - using static events');
    }
}
```

### Step 5: Start Ambient Timer
```javascript
// Find: startPrison() method (line ~1940)
// Add at end:

this.corruptionTracker.initialize(this.player);
this.ambientTimer.start();
```

### Step 6: Stop Ambient Timer
```javascript
// Find: showScreen(screenName) method (line ~800)
// Modify to track screen and manage timer:

showScreen(screenName) {
    // ... existing code ...

    this.currentScreen = screenName;

    if (screenName !== 'prisonMenu' && this.ambientTimer) {
        this.ambientTimer.stop();
    }

    if (screenName === 'prisonMenu' && this.ambientTimer && this.gameState === 'prison') {
        this.ambientTimer.start();
    }
}
```

### Step 7: Add Corruption Tracking
```javascript
// Find existing methods, add corruption tracking:

// Guard manicure (if exists):
completeGuardManicure(guardName) {
    // ... existing code ...
    this.corruptionTracker.incrementCorruption('successful_manicure', this.player);
}

// Gang activities:
joinGang(gangName) {
    // ... existing code ...
    this.corruptionTracker.incrementCorruption('gang_activity', this.player);
}

// Escape planning:
planEscape(method) {
    // ... existing code ...
    this.corruptionTracker.incrementCorruption('escape_planning', this.player);
}
```

### Step 8: Add Corruption Display
```html
<!-- index.html, prison stats section: -->
<div id="prisonStats">
    <p>Sentence: <span id="sentenceLength"></span> years</p>
    <p>Days Served: <span id="timeServed"></span></p>
    <p>Credits: <span id="prisonCredits"></span></p>
    <p>Cigarettes: <span id="prisonCigarettes"></span></p>
    <!-- ADD THIS: -->
    <div id="corruptionMeter"></div>
</div>
```

```javascript
// game.js - Add method to VroomVroomGame class:
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

// Call in startPrison() and saveGame():
startPrison() {
    // ... existing code ...
    this.updateCorruptionDisplay();
}

saveGame() {
    // ... existing code ...
    this.updateCorruptionDisplay();
}
```

### Step 9: Add Player Properties
```javascript
// Find: resetPlayer() method (line ~650)
// Add to player object:

resetPlayer() {
    this.player = {
        // ... existing properties ...
        corruption: 0,
        // ... rest of properties ...
    };
}
```

### Step 10: Save/Load Integration
```javascript
// Find: loadGame() method
// Add after loading player:

loadGame() {
    // ... load player data ...

    if (this.corruptionTracker) {
        this.corruptionTracker.initialize(this.player);
    }

    // ... rest of load code ...
}
```

---

## ✅ TESTING (5 COMMANDS)

**Open browser console (F12), run:**

```javascript
// 1. Check initialization
console.log('Systems:', {
    gemini: game.geminiEvents,
    timer: game.ambientTimer,
    corruption: game.corruptionTracker
});

// 2. Test pool generation (if API key set)
game.generateEventPoolIfPossible();

// 3. Test ambient event (manual trigger)
game.ambientTimer.triggerAmbientEvent();

// 4. Test corruption
game.corruptionTracker.incrementCorruption('bribe_guard', game.player);
console.log('Corruption:', game.player.corruption);

// 5. Test pool status
console.log('Pool:', game.geminiEvents.getPoolStatus());
```

**Wait 2-5 minutes on prison menu → Ambient event should appear automatically.**

---

## 🐛 TROUBLESHOOTING

### "No events appearing"
```javascript
// Check timer active:
console.log('Timer active:', game.ambientTimer.isActive);

// Manually trigger:
game.ambientTimer.triggerAmbientEvent();
```

### "Pool generation failed"
```javascript
// Check API key:
console.log('Has key:', game.apiKeyManager.hasApiKey());

// This is OK - falls back to static events
```

### "Corruption not showing"
```javascript
// Check element exists:
console.log('Meter:', document.getElementById('corruptionMeter'));

// Manually update:
game.updateCorruptionDisplay();
```

**Full troubleshooting guide:** `docs/integration/GEMINI_EVENTS_INTEGRATION.md`

---

## 📊 EXPECTED RESULTS

**After integration:**

✅ Game loads without errors
✅ Event pool generates on start (if API key present)
✅ Ambient events appear every 2-5 min on prison menu
✅ Guard dialogue varies each time
✅ Corruption meter displays on prison HUD
✅ Corruption increases with crimes
✅ Save/load preserves corruption
✅ Works without API key (static fallback)

**Console shows:**
```
[GEMINI] Generating event pool...
[GEMINI] Generated 80 events in 1 API call
[GEMINI] Event pool ready!
[GEMINI] Pool status: { guardDialogue: 20, prisonEvents: 20, ... }
```

---

## 📈 PERFORMANCE METRICS

**Expected (measure after deployment):**

| Metric | Target | Actual |
|--------|--------|--------|
| API calls/session | 1-2 | ? |
| Events generated | 80+ | ? |
| Pool generation time | <3s | ? |
| Memory usage | ~8KB | ? |
| Console errors | 0 | ? |

**Check with:**
```javascript
console.log('Stats:', game.geminiEvents.stats);
// { totalGenerated: 80, totalUsed: 15, apiCallCount: 1, lastGenerated: ... }
```

---

## 🎯 VERIFICATION CHECKLIST

**Before committing:**

- [ ] Game loads without errors
- [ ] Gemini systems initialized
- [ ] Event pool generation works (if API key)
- [ ] Ambient events trigger every 2-5 min
- [ ] Guard dialogue varies
- [ ] Corruption tracks correctly
- [ ] Corruption meter displays
- [ ] Save/load works
- [ ] Static fallback works (no API key)
- [ ] No console errors
- [ ] Performance acceptable

---

## 💾 COMMIT

**When ready:**

```bash
# Stage files
git add game/gemini-events.js game/index.html game/game.js docs/

# Commit (use template from integration guide)
git commit -m "feat: integrate Gemini API random events system (v1.5.0)

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

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 🔄 ROLLBACK (IF NEEDED)

**If something breaks:**

```bash
# 1. Comment out script in index.html:
<!-- <script src="gemini-events.js"></script> -->

# 2. Comment out initialization in game.js:
// this.geminiEvents = new GeminiRandomEventGenerator(...);
// this.ambientTimer = ...;
// etc.

# 3. Remove corruption display:
<!-- <div id="corruptionMeter"></div> -->

# 4. Test game works

# 5. Commit rollback:
git add .
git commit -m "rollback: remove Gemini events integration"
```

**Estimated rollback time:** 15 minutes

---

## 📚 DOCUMENTATION REFERENCE

**Complete guides:**

1. **System Design:** `docs/systems/GEMINI_RANDOM_EVENTS_SYSTEM.md`
   - Architecture, implementation, testing (800+ lines)

2. **Integration Guide:** `docs/integration/GEMINI_EVENTS_INTEGRATION.md`
   - Step-by-step, troubleshooting, testing (500+ lines)

3. **Delivery Summary:** `docs/GEMINI_EVENTS_DELIVERY.md`
   - Overview, metrics, roadmap (400+ lines)

4. **This File:** Quick start reference

**Total documentation:** 2,000+ lines

---

## 🎉 SUCCESS CRITERIA

**You'll know it's working when:**

1. ✅ Console shows event pool generated
2. ✅ Ambient events appear automatically
3. ✅ Guard dialogue feels dynamic
4. ✅ Corruption meter updates
5. ✅ API usage stays low (1-2 calls/session)
6. ✅ Players notice unique events each playthrough

**Celebrate when all green!** 🎊

---

## 🚀 NEXT STEPS AFTER v1.5.0

**Once deployed:**

1. Monitor API usage (should be 0.04% of limit)
2. Gather player feedback on event variety
3. Check corruption system engagement
4. Plan v1.6.0 enhancements:
   - Enhanced cellmate dialogue
   - Dynamic event outcomes
   - Letter responses

**Long-term vision:**
- v1.6.0: AI cellmate & letters
- v1.7.0: Reputation system integration
- v2.0.0: Seasonal events, multi-language

---

## 💡 PRO TIPS

**During integration:**
- Read docs in order (this → design → integration)
- Test after each step
- Use browser console frequently
- Check `game.geminiEvents.getPoolStatus()` often

**During testing:**
- Start without API key (verify fallback works)
- Add API key (verify pool generation)
- Wait for ambient events (be patient, 2-5 min)
- Check corruption with crimes

**After deployment:**
- Monitor API call count daily
- Gather player feedback
- Adjust event frequency if needed

---

## ⏱️ TIME ESTIMATES

**Integration:** 4-6 hours
- Creating gemini-events.js: 30 min
- Modifying game.js: 2-3 hours
- Modifying index.html: 30 min
- Testing: 1-2 hours
- Documentation updates: 30 min

**Testing:** 1 hour
- Unit testing: 30 min
- Integration testing: 30 min

**Total:** 5-7 hours

---

## 🎯 FINAL CHECKLIST

**Before starting:**
- [ ] Read this quick start
- [ ] Read system design doc
- [ ] Read integration guide
- [ ] Get API key (optional)

**During integration:**
- [ ] Complete all 10 steps
- [ ] Test after each step
- [ ] Check console for errors

**Before committing:**
- [ ] All tests pass
- [ ] No console errors
- [ ] Documentation updated
- [ ] Commit message ready

**After deployment:**
- [ ] Monitor API usage
- [ ] Gather feedback
- [ ] Plan v1.6.0

---

**Good luck! You've got this!** 🚀

**Questions?** Check the comprehensive guides in `docs/systems/` and `docs/integration/`.

**Issues?** Review troubleshooting section in integration guide.

**Ready?** Start with Step 1! ⚡

---

**Created:** 2025-10-16
**Status:** ✅ READY FOR INTEGRATION
**Version:** v1.5.0
**Complexity:** Medium
**Time:** 4-6 hours
**Risk:** Low
