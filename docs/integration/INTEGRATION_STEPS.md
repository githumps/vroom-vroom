# Quick Integration Steps for Time System

## Files Created

1. **time-system.js** - All time system methods (copy these into game.js)
2. **TIME_SYSTEM_README.md** - Full documentation
3. **INTEGRATION_STEPS.md** - This file

## 3-Step Integration Process

### Step 1: Copy Methods to game.js

Open `time-system.js` and copy ALL methods (everything after the header comments).

Paste them into `game.js` in the `VroomVroomGame` class, right before the `animate()` method.

Location in game.js:
```javascript
    endPrison() {
        // Show release from prison cinematic
        this.cinematics.play('release', () => {
            this.showMessage('THE END. Your crime: driving. Your punishment: ' + this.player.sentence + ' years.', 5000);
            setTimeout(() => this.showScreen('credits'), 5000);
        });
    }

    // PASTE ALL TIME-SYSTEM.JS METHODS HERE
    // (getCurrentTime, getPrisonSchedule, generatePrisonTimeDigest, etc.)

    animate() {
        requestAnimationFrame(() => this.animate());
        // ... rest of animate
    }
```

### Step 2: Track Prison Start Time

Find the `startPrison()` method and add one line:

**BEFORE:**
```javascript
startPrison() {
    this.gameState = 'prison';
    this.showScreen('prisonMenu');
    document.getElementById('sentenceLength').textContent = this.player.sentence;
    document.getElementById('timeServed').textContent = this.player.prisonDays;
    this.saveGame();
}
```

**AFTER:**
```javascript
startPrison() {
    this.gameState = 'prison';
    this.player.prisonStartTime = Date.now();  // ADD THIS LINE
    this.showScreen('prisonMenu');
    document.getElementById('sentenceLength').textContent = this.player.sentence;
    document.getElementById('timeServed').textContent = this.player.prisonDays;
    this.saveGame();
}
```

### Step 3: Test It

1. Save and reload the game
2. Start new game, get arrested, go to prison
3. Close game
4. Wait 1 hour (or change system clock forward)
5. Load game
6. You should see the time digest screen!

## Optional: Add Time-Based Restrictions

If you want activities to be restricted by real-world time, find the `prisonActivity(activity)` method and add these lines at the START:

```javascript
prisonActivity(activity) {
    // Check if activity is available at current time
    if (!this.isActivityAvailable(activity)) {
        this.showTimeRestriction(activity);
        return;
    }

    // ... rest of existing code ...
}
```

## Verification Checklist

- [ ] Time-system.js methods copied to game.js before animate()
- [ ] player.lastPlayed exists in constructor (already there)
- [ ] player.prisonStartTime exists in constructor (already there)
- [ ] player.eventHistory exists in constructor (already there)
- [ ] saveGame() updates lastPlayed (already there)
- [ ] loadGame() checks time difference (already there)
- [ ] startPrison() sets prisonStartTime (ADD THIS)
- [ ] Game compiles with no errors
- [ ] Time digest appears after being away for 1+ hour

## Quick Test Without Waiting

Change system clock:
1. Windows: Settings > Time & Language > Date & Time
2. Turn off "Set time automatically"
3. Manually set time forward by 1 day
4. Load game
5. Should see time digest
6. Turn "Set time automatically" back on

## Troubleshooting

**Digest doesn't appear:**
- Check browser console for errors
- Verify all methods were copied from time-system.js
- Confirm player.lastPlayed is being saved
- Try clearing localStorage and starting fresh game

**Time not syncing:**
- Verify Date.now() is being used, not custom time
- Check that lastPlayed is updating in saveGame()
- Confirm loadGame() is calculating timeDiffHours

**Activities not restricted:**
- This is optional - only implement if you added the restriction check
- Verify getPrisonSchedule() is returning correct schedule
- Check current hour with getCurrentTime()

## Need Help?

Read full documentation in TIME_SYSTEM_README.md

Key sections:
- **Prison Schedule** - See exact time blocks
- **Event Types** - See all possible events
- **Testing** - Full test scenarios
- **Future Enhancements** - Ideas for expansion
