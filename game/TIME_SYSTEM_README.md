# Real-Time Clock and Events System for VROOM VROOM

## Overview

This system implements an Animal Crossing-style real-time clock where:
- Game time syncs with real-world time
- Prison sentences progress while the player is away
- Events are generated for time spent away from the game
- Prison activities are restricted based on the current real-world hour

## File Location

**C:\Users\evan\Documents\GitHub\vroom-vroom\game\time-system.js**

This file contains all time system methods that should be added to the `VroomVroomGame` class in `game.js`.

## Key Features Implemented

### 1. Real-World Time Tracking

**Changes to Player Object (already in game.js):**
```javascript
player: {
    // ... existing properties ...
    lastPlayed: Date.now(),           // Real-world timestamp
    prisonStartTime: null,            // When prison sentence started
    eventHistory: []                  // Track events while away
}
```

**Modified Methods:**
- `saveGame()` - Now updates `lastPlayed` timestamp on every save
- `loadGame()` - Now checks time difference and generates event digest if player was away

### 2. Prison Sentence Time Conversion

**Time Mapping:**
- 1 prison year = 7 real-world days (168 hours)
- When player is in prison and not playing, time continues to pass
- Example: If player has 5-year sentence (35 game days) and is away for 7 real days, they serve 1 full year

### 3. Event Digest System

When player loads the game after being away, they see:

**Prison Events Digest** (if in prison):
- 15-30 random events based on days served
- Events include: routine activities, cellmate interactions, contraband incidents, philosophical moments
- Milestone events at 7 days (1 week) and 30 days (1 month)
- Shows current prison schedule based on real-world time

**Free Time Digest** (if not in prison):
- 10 events showing what happened in the outside world
- Themes: yearning for driving, encounters with cars, PTSD from arrest
- Reminds player they're free but can never drive legally

### 4. Prison Schedule (Real-Time Based)

Activities are restricted based on current real-world hour:

```
6:00-7:00   Wake Up Call        [cellmate only]
7:00-8:00   Breakfast           [eat, cellmate]
8:00-10:00  Morning Work        [read, letter, cellmate]
10:00-12:00 Yard Time           [weights, gang, cellmate]
12:00-13:00 Lunch               [eat, cellmate]
13:00-14:00 Free Time           [read, letter, tattoo, cellmate]
14:00-17:00 Afternoon Activities [weights, gang, read, cellmate]
17:00-18:00 Commissary Hours    [commissary, cellmate]
18:00-19:00 Dinner              [eat, cellmate]
19:00-22:00 Evening Recreation  [read, letter, tattoo, cellmate]
22:00-6:00  Lights Out          [cellmate only]
```

### 5. New Methods Added

#### Time Utility Methods
```javascript
getCurrentTime()             // Get current hour, minute, timestamp, date
getPrisonSchedule()          // Get current activity and restrictions
```

#### Event Generation
```javascript
generatePrisonTimeDigest(daysServed)    // Generate prison events
generateFreeTimeDigest(hoursAway)       // Generate free world events
```

#### UI/Display Methods
```javascript
showTimeDigestScreen(digest, isReleased, wasFree)  // Show event digest
storeTimeDigestState(isReleased, wasFree)          // Store digest state
closeTimeDigest()                                   // Close digest, continue game
getEventColor(type)                                 // Color code event types
```

#### Activity Restriction Methods
```javascript
isActivityAvailable(activity)        // Check if activity allowed now
showTimeRestriction(activity)        // Show why activity is restricted
```

## Integration Instructions

### Step 1: Add Methods to game.js

Copy all methods from `time-system.js` and paste them into the `VroomVroomGame` class in `game.js`, right before the `animate()` method.

### Step 2: Modify startPrison()

Add this line to track when prison sentence starts:
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

### Step 3: Add Time-Based Activity Restrictions (Optional)

Modify `prisonActivity(activity)` to check time restrictions:
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

## Event Types and Colors

Events are color-coded by type:
- **Routine** (#666) - Daily prison activities
- **Cellmate** (#888) - Interactions with cellmate
- **Incident** (#f00) - Fights, lockdowns, contraband
- **Shower** (#0ff) - Shower-related events (includes soap jokes)
- **Gang** (#0f0) - Safe Drivers Club meetings
- **Mail** (#ff0) - Letters and mail received
- **Reflection** (#88f) - Philosophical moments
- **Work** (#f80) - Work detail activities
- **Absurd** (#f0f) - Surreal prison moments
- **Milestone** (#0f0) - Achievement milestones

## Testing the System

### Test Scenario 1: Prison Time Passage
1. Start new game, get arrested, go to prison
2. Close game
3. Change system clock forward by 1 day
4. Load game
5. Should see time digest showing 1 day of prison events

### Test Scenario 2: Sentence Completion
1. Get short sentence (1-2 years)
2. Close game
3. Change system clock forward by 7-14 days
4. Load game
5. Should see release digest and be freed

### Test Scenario 3: Time-Based Restrictions
1. Load game at different times of day
2. Try different activities
3. Should see restrictions based on prison schedule

### Test Scenario 4: Free Time Digest
1. Complete prison sentence, be released
2. Close game
3. Change system clock forward by 1 day
4. Load game
5. Should see free time digest

## Animal Crossing-Style Features

Like Animal Crossing, this system:
- **Syncs with real-world time** - Events happen whether you play or not
- **Rewards checking in** - Player sees what happened while away
- **Time-gated activities** - Certain activities only available at certain times
- **Persistent world** - Time continues even when not playing
- **No time manipulation benefit** - Changing system clock just fast-forwards time

## Future Enhancements (Not Implemented)

Possible additions:
- **Special timed events** - Events that only happen on specific days/times
- **Seasonal changes** - Prison looks different in different seasons
- **Birthday events** - Special events on player's birthday
- **Holiday events** - Special activities on real-world holidays
- **NPCs on schedules** - Judge Hardcastle appears at certain times
- **Time acceleration items** - Items that let you skip time (sleep through night)

## Performance Considerations

- Event generation is capped at 15 events per digest to prevent UI slowdown
- Events are generated on load, not stored, to save memory
- Timestamp checks are lightweight (simple subtraction)
- No continuous timers running (all checks happen on load/action)

## Credits

Inspired by:
- **Animal Crossing** (Nintendo) - Real-time game mechanics
- **Disco Elysium** (ZA/UM) - Narrative tone and existential despair
- **Papers, Please** (Lucas Pope) - Bureaucratic absurdity

## License

Part of VROOM VROOM game system.
All rights reserved.
