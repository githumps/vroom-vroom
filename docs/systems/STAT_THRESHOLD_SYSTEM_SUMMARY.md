# STAT THRESHOLD SYSTEM - EXECUTIVE SUMMARY

**Version:** v4.1.0-alpha
**Status:** 🟡 50% Integrated (Core systems functional, hookups needed)
**Created:** 2025-10-20
**Time to Complete:** ~4 hours remaining

---

## WHAT THIS SYSTEM DOES

Makes player stats (Intelligence, Strength, Hunger, Good Behavior) **actually matter** through:

1. **Threshold-based progression** - 6 meaningful tiers per stat
2. **Activity gating** - Low stats lock activities (gym, library)
3. **Economic effects** - Stats modify prices (±20%)
4. **Daily passive effects** - Starvation, bullying, passive income
5. **Special unlocks** - New escape routes, court bonuses, achievements

---

## CURRENT STATUS (50% COMPLETE)

### ✅ COMPLETED
1. **Stat Threshold System Created** (`stat-thresholds.js`, 801 lines)
   - 6 tiers × 4 stats = 24 total threshold configurations
   - Effect definitions for all thresholds
   - Helper methods for checks and UI formatting

2. **Stat Effects System Created** (`stat-effects.js`, 567 lines)
   - Daily effect application
   - Activity gain modifiers
   - Price modifiers
   - Special event triggers
   - Achievement unlocks

3. **Systems Loaded**
   - Added to `index.html` (lines 2823-2824)
   - Initialized in `game.js` constructor (lines 773-779)
   - Available as `game.statThresholds` and `game.statEffects`

4. **Player Stats Initialized**
   - `intelligence: 0` (0-100)
   - `strength: 0` (0-100)
   - `hunger: 50` (0-100, lower = hungrier)
   - `goodBehaviorPoints: 50` (0-100+)

5. **Workout System Enhanced**
   - `completeWorkout()` now uses stat modifiers
   - Hunger affects strength gains
   - Strong players gain faster

6. **Integration Guide Created**
   - Complete hookup instructions in `docs/integration/STAT_THRESHOLD_INTEGRATION.md`
   - Code snippets ready to paste
   - Testing checklist included

### 🟡 PENDING (Next 4 Hours)
1. **Time Advancement Function** (30 min)
   - Centralized `advancePrisonTime()` method
   - Replaces 7 instances of manual time advancement
   - Triggers daily effects automatically

2. **Activity Gating** (1 hour)
   - Gym: Block access if STR < 20
   - Library: Block access if INT < 20
   - Show helpful error messages

3. **Price Modifiers** (30 min)
   - Commissary shop uses `modifyPrice()`
   - Intelligence discounts (up to -20%)
   - Good behavior discounts (up to -20%)
   - Bad behavior penalties (up to +25%)

4. **UI Threshold Displays** (1 hour)
   - Add HTML elements to stats panel
   - Color-coded tier names
   - "Next tier in X points" display
   - Update on stat changes

5. **Intelligence Court Bonuses** (30 min)
   - Auto-fill form fields (25-100%)
   - Legal loopholes reduce sentence
   - Represent yourself in court (INT 100)

6. **Reading Modifiers** (30 min)
   - Hunger affects concentration
   - Distraction chance (30% if hungry)
   - Reading speed modifiers

7. **Testing & Balance** (1 hour)
   - Test all threshold triggers
   - Verify daily effects work
   - Balance check (death spiral prevention)
   - Fix soft locks

---

## KEY THRESHOLD HIGHLIGHTS

### Intelligence
- **0-19:** Library blocked, court forms 2x slower ❌
- **80-99:** Prison blueprints unlock ventilation escape route 🔓
- **100:** Represent yourself in court 🏆

### Strength
- **0-19:** Lose 5 cigarettes/day to bullies, gym blocked ❌
- **100:** Break through wall (new escape route) 🔓

### Hunger
- **0-19:** CRITICAL - Lose 2 STR + 1 INT per day, 10% collapse risk ⚠️
- **80-99:** +20% stat gains, immune to illness ✨
- **100:** Food coma (+5 all stats) 🏆

### Good Behavior
- **0-19:** 5% solitary risk, 25% higher prices ❌
- **100+:** 50% sentence reduction 🏆

---

## GAMEPLAY IMPACT

### Before (Current)
- Stats display but don't affect gameplay
- No reason to read, workout, or behave
- Activities grant random stat increases
- No strategic stat management

### After (When Complete)
- **Strategic choices:** Do I eat or save money?
- **Risk/reward:** Get strong to avoid bullying
- **Unlocks:** Smart players find secret escape routes
- **Cascading effects:** Low hunger → weak → bullied → poor
- **Long-term planning:** Maintain good behavior for parole
- **Replayability:** Different stat builds

---

## EXAMPLE GAMEPLAY SCENARIOS

### Scenario 1: The Scholar
1. Focus on library reading (boost INT to 40+)
2. Unlock law library (-5% sentence)
3. Tutor inmates (+5 credits/day)
4. Reach INT 80 for 20% discounts
5. Find prison blueprints (ventilation escape)
6. **Result:** Short sentence, wealthy, smart escape

### Scenario 2: The Brute
1. Focus on gym workouts (boost STR to 40+)
2. Intimidate bullies (no cigarette loss)
3. Win prison fights (+20 credits/bet)
4. Reach STR 100 for wall-breaking
5. **Result:** Break through wall, escape with force

### Scenario 3: The Survivalist
1. Maintain hunger at 60-79 (well-fed)
2. Get +10% stat gains across all activities
3. Balanced approach to all stats
4. Maintain good behavior for privileges
5. **Result:** Efficient progression, early parole

### Scenario 4: Death Spiral (Risk)
1. Run out of money, can't eat
2. Hunger drops to 0-19 (starving)
3. Lose 2 STR + 1 INT per day
4. Too weak for gym, too dumb for library
5. Get bullied, lose more resources
6. **Result:** Soft lock - NEEDS EMERGENCY FIX

---

## BALANCE CONCERNS

### Death Spiral Prevention
**Problem:** If hunger gets too low, player loses stats daily and can't recover.

**Solutions:**
1. Add free basic meal option (reduces hunger by 10, available once/day)
2. Add "scavenge" option (find scraps, reduces hunger by 5, takes time)
3. Reduce stat loss from starvation (1 STR/day instead of 2)
4. Add random "kind guard" event (gives food)

### Soft Lock: Weak and Blocked
**Problem:** If STR 0-19, player can't use gym to increase it.

**Solutions:**
1. Add pushups in cell (slow gain, 0.5 STR/day, always available)
2. Lower gym requirement to STR 10
3. Add "beginner gym" (available 0-19 STR, slower gains)

### Overpowered: Perfect Behavior
**Problem:** 100 Good Behavior gives 50% sentence reduction (too strong).

**Solutions:**
1. Reduce to 25-30% sentence reduction
2. Make it harder to maintain (random events reduce it)
3. Add temptation events (contraband worth behavior points)

---

## IMPLEMENTATION CHECKLIST

- [x] Create stat-thresholds.js
- [x] Create stat-effects.js
- [x] Load scripts in index.html
- [x] Initialize in game.js
- [x] Add player stat properties
- [x] Modify workout system
- [ ] Add time advancement function
- [ ] Hook up daily effects
- [ ] Add activity gating (gym, library)
- [ ] Add price modifiers
- [ ] Add UI threshold displays
- [ ] Add intelligence court bonuses
- [ ] Add reading modifiers
- [ ] Add good behavior tracking
- [ ] Test all thresholds
- [ ] Balance test for 30 minutes
- [ ] Fix death spiral/soft locks
- [ ] Update documentation

---

## FILES INVOLVED

### Created
- `/game/systems/stat-thresholds.js` (801 lines)
- `/game/systems/stat-effects.js` (567 lines)
- `/docs/integration/STAT_THRESHOLD_INTEGRATION.md`
- `/docs/systems/STAT_THRESHOLD_SYSTEM_SUMMARY.md`

### Modified
- `/game/index.html` (added script tags)
- `/game/core/game.js` (initialization + workout)
- `/CHANGELOG.md` (added v4.1.0-alpha entry)

### Need Modification (Pending)
- `/game/core/game.js` (time advancement, activity checks, price modifiers)
- `/game/systems/library-methods.js` (reading modifiers)
- `/game/index.html` (UI threshold display elements)

---

## TESTING SCENARIOS

### Test Case 1: Gym Blocking
1. Start new game (STR = 0)
2. Try to access gym
3. **Expected:** Blocked with message "Come back when you can lift the bar"
4. Do pushups in cell to reach STR 20
5. Try gym again
6. **Expected:** Access granted

### Test Case 2: Hunger Effects
1. Start game with hunger = 50
2. Don't eat for 3 days
3. **Expected:** Hunger drops to ~10-15 (starving)
4. Check stats next day
5. **Expected:** Lost 2 STR + 1 INT from starvation
6. Try working out
7. **Expected:** No stat gains (too hungry to concentrate)

### Test Case 3: Price Discounts
1. Boost INT to 80 (genius)
2. Check commissary prices
3. **Expected:** All items 20% cheaper
4. Also boost Good Behavior to 80
5. **Expected:** Additional 20% off (40% total)
6. Buy cigarettes (normally 5 credits)
7. **Expected:** Pay 3 credits

### Test Case 4: Intelligence Unlocks
1. Boost INT to 60 (very smart)
2. Go to courtroom
3. **Expected:** 25% of form fields auto-fill
4. **Expected:** Spot legal loopholes message
5. **Expected:** Sentence reduced by 10%

### Test Case 5: Achievement Unlocks
1. Boost STR to 100
2. **Expected:** "The Mountain" achievement unlocks
3. Check escape routes
4. **Expected:** "Break Through Wall" option appears

---

## NEXT STEPS

1. **Review integration guide:** `docs/integration/STAT_THRESHOLD_INTEGRATION.md`
2. **Implement time advancement function** (highest priority)
3. **Add activity gating** to gym and library
4. **Test in browser** for 30 minutes
5. **Balance adjustments** based on testing
6. **Full documentation update** when 100% complete

---

## SUCCESS METRICS

System is **fully integrated** when:
- ✅ All 4 stats have visible threshold tiers in UI
- ✅ Low stats lock activities with helpful messages
- ✅ Daily effects apply automatically on time advancement
- ✅ Prices modify based on INT and behavior
- ✅ Intelligence affects courtroom outcomes
- ✅ Achievements unlock at stat milestones
- ✅ No death spirals or soft locks
- ✅ 30-minute test reveals balanced progression

---

**Estimated Completion:** 4 hours
**Current Progress:** 50%
**Blocker:** None - all systems functional, just need hookups

**Status:** 🟡 Ready for final integration pass
