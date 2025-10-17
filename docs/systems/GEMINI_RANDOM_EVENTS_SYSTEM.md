# GEMINI API RANDOM EVENTS SYSTEM - COMPREHENSIVE DESIGN

**Status:** 📋 Design Complete - Ready for Implementation
**Version:** 1.0.0
**Created:** 2025-10-16
**Target Release:** v1.5.0

---

## TABLE OF CONTENTS

1. [Vision & Goals](#vision--goals)
2. [Architecture Overview](#architecture-overview)
3. [API Call Management Strategy](#api-call-management-strategy)
4. [Event Pool System](#event-pool-system)
5. [Ambient Prison Events](#ambient-prison-events)
6. [Guard Dialogue System](#guard-dialogue-system)
7. [Time of Day Integration](#time-of-day-integration)
8. [Corruption System](#corruption-system)
9. [Gemini Prompt Templates](#gemini-prompt-templates)
10. [Complete Implementation](#complete-implementation)
11. [Testing & Validation](#testing--validation)
12. [Performance & Optimization](#performance--optimization)

---

## VISION & GOALS

### Primary Objective
Use Gemini API to make **every playthrough unique** through AI-generated content while **intelligently conserving API calls** to respect free tier limits.

### Success Criteria
- **1-2 API calls per gaming session** (not per event)
- **100+ unique events** generated from 1-2 calls
- **Seamless fallback** when API unavailable or pool depleted
- **Zero gameplay blocking** while waiting for API responses
- **No perceptible difference** between AI and static events for players

### Constraints
- **Free tier limit:** 14,000 requests/day
- **Model:** gemma-3-27b-it (current implementation)
- **Session-based:** New pool per session, not per event
- **Graceful degradation:** Must work without API key

---

## ARCHITECTURE OVERVIEW

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                   GEMINI RANDOM EVENT SYSTEM                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  GeminiRandomEventGenerator                          │  │
│  │  - Event pool management                             │  │
│  │  - Batch generation (20+ events per call)            │  │
│  │  │  - Static fallback when pool empty                │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│           ┌─────────────┴─────────────┐                     │
│           ▼                           ▼                     │
│  ┌─────────────────┐         ┌─────────────────┐           │
│  │  Ambient Events │         │ Guard Dialogue  │           │
│  │  - Timer-based  │         │  - Context-aware│           │
│  │  - 2-5 min      │         │  - Personality  │           │
│  └─────────────────┘         └─────────────────┘           │
│           │                           │                     │
│           └─────────────┬─────────────┘                     │
│                         ▼                                   │
│            ┌────────────────────────┐                       │
│            │  Time of Day System    │                       │
│            │  - Schedule-based      │                       │
│            │  - Real-time clock     │                       │
│            └────────────────────────┘                       │
│                         │                                   │
│                         ▼                                   │
│            ┌────────────────────────┐                       │
│            │  Corruption System     │                       │
│            │  - Player stat 0-100   │                       │
│            │  - Affects outcomes    │                       │
│            └────────────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

### Integration Points

**Existing Systems:**
- `ApiKeyManager` (lines 4-148 in game.js) - Already implemented
- Time system (docs/systems/TIME_SYSTEM_README.md) - Clock integration
- Random events (docs/integration/PRISON_ENHANCEMENTS_IMPLEMENTATION.md) - Event framework

**New Components:**
- `GeminiRandomEventGenerator` class
- `AmbientEventTimer` class
- `GuardDialogueSystem` class
- `CorruptionTracker` class

---

## API CALL MANAGEMENT STRATEGY

### Problem Statement
Cannot call Gemini on every single event - would exhaust free tier (14,000/day) within hours of active gameplay.

### Solution: Hybrid Batch Generation

**Strategy:**
1. **Pre-generate** a pool of random content on session start (1 API call)
2. **Store** generated content in sessionStorage (not localStorage - fresh per session)
3. **Use** pre-generated content throughout gameplay
4. **Refresh** pool only when depleted or on new session
5. **Fallback** to static events when API unavailable

### API Call Flow

```
Session Start
     ↓
 Has API key?  ──No──→ Use static events only
     ↓ Yes
     ↓
Generate event pool (1 API call)
     ↓
Store in sessionStorage
     ↓
Gameplay loop uses pool
     ↓
Pool depleted?  ──Yes──→ Fallback to static events
     ↓ No
Continue using pool
```

### Expected API Usage

**Typical Gaming Session (2 hours):**
- **Session start:** 1 API call (batch generation)
- **Pool refresh:** 0 calls (20+ events last entire session)
- **Total:** 1 API call per session

**Daily Usage (5 sessions):**
- **Total:** 5 API calls
- **Free tier remaining:** 13,995 calls
- **Efficiency:** 0.04% of daily limit

**Worst Case (pool depletion mid-session):**
- **Session start:** 1 call
- **Pool refresh:** 1 call
- **Total:** 2 calls per session
- **Daily (5 sessions):** 10 calls (0.07% of limit)

---

## EVENT POOL SYSTEM

### GeminiRandomEventGenerator Class

**Purpose:** Manage batch generation and retrieval of AI-generated events.

**Implementation:**

```javascript
class GeminiRandomEventGenerator {
    constructor(apiKeyManager) {
        this.apiKeyManager = apiKeyManager;
        this.poolSize = 20; // Generate 20 of each type per call

        // Event pools stored in memory (session-based)
        this.eventPools = {
            guardDialogue: [],
            prisonEvents: [],
            cellmateRemarks: [],
            ambientEvents: [],
            courtCharges: [] // Reuse existing charge generation
        };

        // Static fallbacks (always available)
        this.staticFallbacks = this.initializeStaticFallbacks();

        // Stats
        this.stats = {
            totalGenerated: 0,
            totalUsed: 0,
            apiCallCount: 0,
            lastGenerated: null
        };
    }

    // Generate all event pools in ONE API call
    async generateEventPool() {
        if (!this.apiKeyManager.hasApiKey()) {
            console.log('[GEMINI] No API key - using static events only');
            return false;
        }

        const prompt = this.buildBatchPrompt();

        try {
            const response = await this.callGemini(prompt);
            const success = this.parseAndStoreEvents(response);

            if (success) {
                this.stats.totalGenerated += this.poolSize * 4; // 4 categories
                this.stats.apiCallCount++;
                this.stats.lastGenerated = Date.now();
                console.log(`[GEMINI] Generated ${this.poolSize * 4} events in 1 API call`);
            }

            return success;
        } catch (error) {
            console.error('[GEMINI] Pool generation failed:', error);
            return false;
        }
    }

    // Build comprehensive batch prompt (all event types in one call)
    buildBatchPrompt() {
        return `You are a creative writer for VROOM VROOM, a dark comedy prison game with Disco Elysium-style absurd bureaucracy and existential dread.

Generate varied, unique content for prison gameplay. Return ONLY valid JSON, no markdown, no explanations.

TONE GUIDELINES:
- Dark humor, not mean-spirited
- Absurd bureaucracy (forms, procedures, nonsense rules)
- Existential dread mixed with mundane details
- Cynical guards, resigned inmates
- Unexpected humanity in bleak moments

Generate 20 of each category below:

{
    "guardDialogue": [
        // 20 short (1-2 sentence) guard remarks
        // Examples: "Quiet night... too quiet.", "Don't make me come in there.", "My kid's birthday is today. I'm stuck here with you people."
    ],
    "prisonEvents": [
        // 20 brief (2-3 sentence) ambient prison events
        // Examples: "Fight breaks out in cafeteria. Guards rush past.", "Power flickers. Emergency lights activate.", "Visitor day. Wonder who it is."
    ],
    "cellmateRemarks": [
        // 20 brief cellmate observations (1-2 sentences)
        // Examples: "You ever think about clouds? Me neither.", "I had a dream about driving. Felt so real.", "The walls are listening. They always listen."
    ],
    "ambientEvents": [
        // 20 background prison sounds/events (1 sentence)
        // Examples: "Distant shouts from C Block.", "Meal cart rolling by.", "Guard radio chatter about overtime."
    ]
}

IMPORTANT: Return ONLY the JSON object. No markdown code blocks. No additional text.`;
    }

    // Call Gemini API (reuses existing ApiKeyManager pattern)
    async callGemini(prompt) {
        const apiKey = this.apiKeyManager.getApiKey();
        if (!apiKey) return null;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    // Parse API response and store in pools
    parseAndStoreEvents(responseText) {
        try {
            // Extract JSON from response (handle markdown code blocks)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const events = JSON.parse(jsonMatch[0]);

            // Validate and store each category
            if (events.guardDialogue && Array.isArray(events.guardDialogue)) {
                this.eventPools.guardDialogue = events.guardDialogue;
            }
            if (events.prisonEvents && Array.isArray(events.prisonEvents)) {
                this.eventPools.prisonEvents = events.prisonEvents;
            }
            if (events.cellmateRemarks && Array.isArray(events.cellmateRemarks)) {
                this.eventPools.cellmateRemarks = events.cellmateRemarks;
            }
            if (events.ambientEvents && Array.isArray(events.ambientEvents)) {
                this.eventPools.ambientEvents = events.ambientEvents;
            }

            return true;
        } catch (error) {
            console.error('[GEMINI] Failed to parse events:', error);
            return false;
        }
    }

    // Get random event from pool (with fallback)
    getEvent(category) {
        this.stats.totalUsed++;

        // Try to get from AI pool
        if (this.eventPools[category] && this.eventPools[category].length > 0) {
            const index = Math.floor(Math.random() * this.eventPools[category].length);
            return this.eventPools[category].splice(index, 1)[0];
        }

        // Fallback to static events
        return this.getStaticFallback(category);
    }

    // Static fallback events (always available)
    initializeStaticFallbacks() {
        return {
            guardDialogue: [
                "Keep it down in there.",
                "Lights out in 10 minutes.",
                "You're on notice, prisoner.",
                "Don't test me today.",
                "I've had enough of this place."
            ],
            prisonEvents: [
                "Another day. Same walls. Same routine.",
                "Distant alarm. Lockdown somewhere else.",
                "Cafeteria smell wafts through ventilation.",
                "Guard shift change. Keys jangling.",
                "Clock ticks. Time passes. Slowly."
            ],
            cellmateRemarks: [
                "You ever wonder what's beyond these walls?",
                "I miss the outside. The sky.",
                "This is our life now.",
                "At least we have each other. Sort of.",
                "Quiet today. Too quiet."
            ],
            ambientEvents: [
                "Footsteps echo down the corridor.",
                "Someone coughing in the next cell.",
                "Fluorescent light buzzing overhead.",
                "Metal door clangs shut somewhere.",
                "Radio static from guard station."
            ]
        };
    }

    getStaticFallback(category) {
        const fallbacks = this.staticFallbacks[category];
        if (!fallbacks || fallbacks.length === 0) {
            return "Nothing happens. Time passes.";
        }
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // Check pool status
    getPoolStatus() {
        return {
            guardDialogue: this.eventPools.guardDialogue.length,
            prisonEvents: this.eventPools.prisonEvents.length,
            cellmateRemarks: this.eventPools.cellmateRemarks.length,
            ambientEvents: this.eventPools.ambientEvents.length,
            stats: this.stats
        };
    }

    // Check if pool needs refresh
    needsRefresh() {
        const totalRemaining =
            this.eventPools.guardDialogue.length +
            this.eventPools.prisonEvents.length +
            this.eventPools.cellmateRemarks.length +
            this.eventPools.ambientEvents.length;

        return totalRemaining < 10; // Refresh if less than 10 events total
    }
}
```

---

## AMBIENT PRISON EVENTS

### Overview
**Random events every 2-5 minutes** while in prison menu, creating living, breathing prison atmosphere.

### AmbientEventTimer Class

```javascript
class AmbientEventTimer {
    constructor(eventGenerator) {
        this.eventGenerator = eventGenerator;
        this.timer = null;
        this.isActive = false;
        this.minInterval = 120000; // 2 minutes
        this.maxInterval = 300000; // 5 minutes
    }

    start() {
        if (this.isActive) return;
        this.isActive = true;
        this.scheduleNextEvent();
    }

    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.isActive = false;
    }

    scheduleNextEvent() {
        if (!this.isActive) return;

        const interval = Math.random() * (this.maxInterval - this.minInterval) + this.minInterval;

        this.timer = setTimeout(() => {
            this.triggerAmbientEvent();
            this.scheduleNextEvent();
        }, interval);
    }

    triggerAmbientEvent() {
        // Only trigger if on prison menu
        if (game.currentScreen !== 'prisonMenu') return;

        // Get random ambient event type
        const eventType = Math.random() < 0.5 ? 'ambientEvents' : 'guardDialogue';
        const event = this.eventGenerator.getEvent(eventType);

        // Determine if guard is walking by
        const isGuardWalking = eventType === 'guardDialogue' && Math.random() < 0.7;

        if (isGuardWalking) {
            this.showGuardWalkingEvent(event);
        } else {
            this.showSimpleAmbientEvent(event);
        }
    }

    showGuardWalkingEvent(dialogue) {
        // Play footsteps approaching
        game.soundSystem.playFootstepsApproaching();

        // Show notification after 1 second
        setTimeout(() => {
            const guardName = this.getRandomGuardName();
            this.showAmbientNotification(`Guard ${guardName} walks by: "${dialogue}"`, 5000);

            // Play footsteps fading after dialogue shows
            setTimeout(() => {
                game.soundSystem.playFootstepsFading();
            }, 2000);
        }, 1000);
    }

    showSimpleAmbientEvent(event) {
        this.showAmbientNotification(event, 5000);
    }

    showAmbientNotification(text, duration) {
        // Create notification element if doesn't exist
        let notification = document.getElementById('ambientNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'ambientNotification';
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                max-width: 400px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #0f0;
                padding: 15px 20px;
                color: #0f0;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
                opacity: 0;
                transition: opacity 0.5s;
                z-index: 1000;
            `;
            document.body.appendChild(notification);
        }

        // Update text and fade in
        notification.textContent = text;
        notification.style.opacity = '1';

        // Fade out and remove after duration
        setTimeout(() => {
            notification.style.opacity = '0';
        }, duration);
    }

    getRandomGuardName() {
        const names = ['Jenkins', 'Martinez', 'Chen', 'Thompson', 'Rodriguez', 'Kowalski', 'O\'Brien', 'Davis'];
        return names[Math.floor(Math.random() * names.length)];
    }
}
```

### Event Types

**Guard Walking By:**
- Footsteps approaching (synthesized sound)
- Guard dialogue appears
- Footsteps fading (synthesized sound)
- Duration: ~5 seconds

**Distant Events:**
- Shouts from other cells
- PA announcements
- Fight breaking out nearby
- Radio chatter
- Duration: 5-10 seconds

**Atmospheric:**
- Meal cart rolling by
- Keys jangling
- Doors clanging
- Fluorescent light buzzing
- Duration: 3-5 seconds

---

## GUARD DIALOGUE SYSTEM

### GuardDialogueSystem Class

```javascript
class GuardDialogueSystem {
    constructor(eventGenerator) {
        this.eventGenerator = eventGenerator;

        // Guard personalities
        this.guards = {
            jenkins: { nervousness: 0.7, tone: 'strict' },
            martinez: { nervousness: 0.3, tone: 'perfectionist' },
            chen: { nervousness: 0.9, tone: 'impatient' },
            thompson: { nervousness: 0.5, tone: 'chatty' },
            rodriguez: { nervousness: 0.6, tone: 'paranoid' }
        };
    }

    // Get context-aware guard dialogue
    getContextualDialogue(context) {
        // Context can be: 'patrol', 'manicure', 'search', 'fight', 'general'

        // 70% chance to use AI-generated dialogue
        if (Math.random() < 0.7) {
            return this.eventGenerator.getEvent('guardDialogue');
        }

        // 30% chance to use context-specific static dialogue
        return this.getContextSpecificDialogue(context);
    }

    getContextSpecificDialogue(context) {
        const dialogues = {
            patrol: [
                "Quiet night... too quiet.",
                "Keep it down in there.",
                "Lights out in 10 minutes.",
                "You're on notice, prisoner."
            ],
            manicure: [
                "Make it look good. My wife notices.",
                "Don't cut me. I'm watching you.",
                "This better be worth it.",
                "Steady hands. I'm trusting you here."
            ],
            search: [
                "Turn around. Hands on the wall.",
                "Don't make this harder than it needs to be.",
                "You better not have anything on you.",
                "Routine inspection. Stay calm."
            ],
            fight: [
                "Break it up! NOW!",
                "Both of you, against the wall!",
                "I don't have time for this!",
                "You want solitary? Keep going."
            ],
            general: [
                "Another day in paradise.",
                "I've had enough of this place.",
                "Don't test me today.",
                "Move along, prisoner."
            ]
        };

        const category = dialogues[context] || dialogues.general;
        return category[Math.floor(Math.random() * category.length)];
    }

    // Get guard-specific dialogue (for known guards like manicure system)
    getGuardDialogue(guardName, context) {
        const guard = this.guards[guardName.toLowerCase()];
        if (!guard) return this.getContextualDialogue(context);

        // Modify tone based on guard personality
        let dialogue = this.getContextualDialogue(context);

        // High nervousness guards add nervous phrases
        if (guard.nervousness > 0.7) {
            const nervous = [' Uh...', ' I guess...', ' Maybe...'];
            if (Math.random() < 0.3) {
                dialogue += nervous[Math.floor(Math.random() * nervous.length)];
            }
        }

        return dialogue;
    }
}
```

### Integration Points

**Prison Menu Interactions:**
- Random ambient events (every 2-5 min)
- Guard manicure system (existing)
- Contraband searches (existing random events)
- Prison activities (weights, library, etc.)

**Dialogue Categories:**
- **Patrol small talk** - "Quiet night... too quiet."
- **Threats** - "Don't make me come in there."
- **Random observations** - "You look like you're planning something."
- **Dark humor** - "Enjoy the meatloaf. It's probably raccoon."
- **Personal anecdotes** - "My kid's birthday is today. I'm stuck here with you people."

---

## TIME OF DAY INTEGRATION

### Current System
Time system already exists (docs/systems/TIME_SYSTEM_README.md) with real-time clock and prison schedule.

### Schedule of Activities (Already Implemented)

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

### Dynamic Events Based on Time

**Enhancements to Add:**

```javascript
class TimedEventSystem {
    constructor(eventGenerator) {
        this.eventGenerator = eventGenerator;
    }

    // Get time-specific ambient events
    getTimedEvent() {
        const hour = new Date().getHours();

        // Morning events (6-9 AM)
        if (hour >= 6 && hour < 9) {
            const morningEvents = [
                "Wake up call blares. 'RISE AND SHINE, INMATES!'",
                "Breakfast cart rattles down the corridor.",
                "Guards conduct morning count. Voices echo.",
                this.eventGenerator.getEvent('ambientEvents')
            ];
            return morningEvents[Math.floor(Math.random() * morningEvents.length)];
        }

        // Yard time (10-12 PM)
        if (hour >= 10 && hour < 12) {
            const yardEvents = [
                "Yard door opens. Fresh air. Relatively.",
                "Basketball bouncing in the distance.",
                "Weights clanking. Someone's training.",
                this.eventGenerator.getEvent('ambientEvents')
            ];
            return yardEvents[Math.floor(Math.random() * yardEvents.length)];
        }

        // Lunch (12-1 PM)
        if (hour >= 12 && hour < 13) {
            const lunchEvents = [
                "Lunch bell. The stampede begins.",
                "Mystery meat smell intensifies.",
                "Cafeteria noise reaches your cell.",
                this.eventGenerator.getEvent('ambientEvents')
            ];
            return lunchEvents[Math.floor(Math.random() * lunchEvents.length)];
        }

        // Dinner (6-7 PM)
        if (hour >= 18 && hour < 19) {
            const dinnerEvents = [
                "Dinner time. You're not optimistic.",
                "Trays clattering. Guards yelling.",
                "Food cart passes. Today's special: regret.",
                this.eventGenerator.getEvent('ambientEvents')
            ];
            return dinnerEvents[Math.floor(Math.random() * dinnerEvents.length)];
        }

        // Lights out (10 PM - 6 AM)
        if (hour >= 22 || hour < 6) {
            const nightEvents = [
                "Lights out. Darkness. Thoughts.",
                "Someone snoring in C Block.",
                "Guard night shift radio chatter.",
                "Footsteps. Flashlight beam. Patrol.",
                this.eventGenerator.getEvent('ambientEvents')
            ];
            return nightEvents[Math.floor(Math.random() * nightEvents.length)];
        }

        // Default to AI-generated
        return this.eventGenerator.getEvent('ambientEvents');
    }
}
```

### Visual Time Display

**Add to Prison Menu:**

```javascript
// Update prison menu with time display
updatePrisonTimeDisplay() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const schedule = this.getPrisonSchedule();

    const timeDisplay = document.getElementById('prisonTimeDisplay');
    if (timeDisplay) {
        timeDisplay.innerHTML = `
            <div style="color: #0f0; font-size: 1.2em;">
                ${hours}:${minutes} - Cell Block C
            </div>
            <div style="color: #ff0; font-size: 0.9em;">
                ${schedule.activity}
            </div>
        `;
    }
}
```

---

## CORRUPTION SYSTEM

### Overview
**Player stat (0-100)** tracking how "corrupt" the player becomes through bribes, contraband, and gang activities.

### CorruptionTracker Class

```javascript
class CorruptionTracker {
    constructor() {
        this.corruptionLevel = 0; // 0-100
        this.corruptionThresholds = {
            clean: { max: 20, color: '#0f0', label: 'CLEAN RECORD' },
            questionable: { max: 40, color: '#ff0', label: 'QUESTIONABLE' },
            corrupt: { max: 60, color: '#f80', label: 'CORRUPT' },
            notorious: { max: 80, color: '#f00', label: 'NOTORIOUS' },
            criminal: { max: 100, color: '#f0f', label: 'CRIMINAL MASTERMIND' }
        };
    }

    // Initialize player corruption
    initialize(player) {
        if (!player.corruption) {
            player.corruption = 0;
        }
        this.corruptionLevel = player.corruption;
    }

    // Adjust corruption
    adjustCorruption(amount, reason, player) {
        const oldLevel = this.corruptionLevel;
        this.corruptionLevel = Math.max(0, Math.min(100, this.corruptionLevel + amount));
        player.corruption = this.corruptionLevel;

        // Check for threshold crossing
        const oldStatus = this.getCorruptionStatus(oldLevel);
        const newStatus = this.getCorruptionStatus(this.corruptionLevel);

        if (oldStatus.label !== newStatus.label) {
            game.showMessage(`CORRUPTION STATUS: ${newStatus.label}`, 5000);
        }

        console.log(`[CORRUPTION] ${reason}: ${amount > 0 ? '+' : ''}${amount} (${this.corruptionLevel}/100)`);
    }

    getCorruptionStatus(level = this.corruptionLevel) {
        for (let status in this.corruptionThresholds) {
            if (level <= this.corruptionThresholds[status].max) {
                return {
                    label: this.corruptionThresholds[status].label,
                    color: this.corruptionThresholds[status].color
                };
            }
        }
        return this.corruptionThresholds.criminal;
    }

    // Get corruption effects
    getCorruptionEffects() {
        const effects = {
            contrabandAccessBonus: 0,
            searchChanceModifier: 0,
            guardIgnoreChance: 0,
            blackMarketDiscount: 0,
            investigationRisk: 0,
            sentencePenaltyMultiplier: 1.0
        };

        if (this.corruptionLevel >= 80) {
            effects.contrabandAccessBonus = 30;
            effects.searchChanceModifier = -30; // 30% less searches
            effects.guardIgnoreChance = 40;
            effects.blackMarketDiscount = 25;
            effects.investigationRisk = 70;
            effects.sentencePenaltyMultiplier = 1.5;
        } else if (this.corruptionLevel >= 60) {
            effects.contrabandAccessBonus = 20;
            effects.searchChanceModifier = -20;
            effects.guardIgnoreChance = 25;
            effects.blackMarketDiscount = 15;
            effects.investigationRisk = 40;
            effects.sentencePenaltyMultiplier = 1.3;
        } else if (this.corruptionLevel >= 40) {
            effects.contrabandAccessBonus = 10;
            effects.searchChanceModifier = -10;
            effects.guardIgnoreChance = 10;
            effects.blackMarketDiscount = 10;
            effects.investigationRisk = 20;
            effects.sentencePenaltyMultiplier = 1.15;
        }

        return effects;
    }

    // Corruption actions
    incrementCorruption(action, player) {
        const corruptionActions = {
            'bribe_guard': { amount: 5, reason: 'Bribing guard' },
            'smuggle_contraband': { amount: 10, reason: 'Smuggling contraband' },
            'gang_activity': { amount: 3, reason: 'Gang activity' },
            'successful_manicure': { amount: 2, reason: 'Guard manicure bribe' },
            'escape_planning': { amount: 15, reason: 'Planning escape' },
            'refused_bribe': { amount: -5, reason: 'Refusing bribe' },
            'snitch': { amount: -10, reason: 'Snitching on others' },
            'good_behavior_day': { amount: -1, reason: 'Good behavior' }
        };

        const data = corruptionActions[action];
        if (data) {
            this.adjustCorruption(data.amount, data.reason, player);
        }
    }
}
```

### Corruption Increases With:
- Bribing guards (+5 per bribe)
- Contraband smuggling (+10)
- Gang activities (+3 per activity)
- Successful manicure bribes (+2)
- Escape planning (+15)

### Corruption Decreases With:
- Good behavior (-1 per day)
- Refusing bribes (-5)
- Snitching on others (-10)
- Rehabilitation activities (-2)

### Effects of High Corruption

**PROS:**
- Access to better contraband (+30% at 80+)
- Guards look the other way (40% ignore chance)
- Reduced inspections (-30% search chance)
- Better black market prices (-25% cost)

**CONS:**
- Warden attention (+70% investigation risk)
- Other inmates distrust you
- Higher risk of setup/sting operations
- If caught, +50% sentence

### Visual Indicator

```javascript
// Add to prison HUD
showCorruptionMeter() {
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

---

## GEMINI PROMPT TEMPLATES

### 1. Event Pool Generation (Batch)

**Used:** Once per session on startup

```javascript
buildBatchPrompt() {
    return `You are a creative writer for VROOM VROOM, a dark comedy prison game with Disco Elysium-style absurd bureaucracy and existential dread.

Generate varied, unique content for prison gameplay. Return ONLY valid JSON, no markdown, no explanations.

TONE GUIDELINES:
- Dark humor, not mean-spirited
- Absurd bureaucracy (forms, procedures, nonsense rules)
- Existential dread mixed with mundane details
- Cynical guards, resigned inmates
- Unexpected humanity in bleak moments

Generate 20 of each category below:

{
    "guardDialogue": [
        // 20 short (1-2 sentence) guard remarks
        // Mix: patrol comments, threats, observations, dark humor, personal anecdotes
    ],
    "prisonEvents": [
        // 20 brief (2-3 sentence) ambient prison events
        // Examples: fights, inspections, arrivals, emergencies, routine events
    ],
    "cellmateRemarks": [
        // 20 brief cellmate observations (1-2 sentences)
        // Philosophical, mundane, absurd, touching
    ],
    "ambientEvents": [
        // 20 background prison sounds/events (1 sentence)
        // PA announcements, distant sounds, environmental events
    ]
}

IMPORTANT: Return ONLY the JSON object. No markdown code blocks. No additional text.`;
}
```

### 2. Context-Specific Guard Dialogue (Optional)

**Used:** If pool depleted and need fresh dialogue for specific context

```javascript
buildGuardDialoguePrompt(context, count = 5) {
    const contextDescriptions = {
        'patrol': 'walking past cells on routine patrol',
        'manicure': 'getting their nails done by a prisoner (absurd bribery)',
        'search': 'conducting a contraband inspection',
        'fight': 'breaking up a fight between inmates',
        'general': 'general prison guard duties'
    };

    return `Generate ${count} short (1-2 sentence) guard dialogue lines for a dark comedy prison game.

Context: Guard is ${contextDescriptions[context] || context}

Tone: Disco Elysium style (cynical, tired, unexpectedly human, dark humor)

Return as JSON array ONLY:
["line 1", "line 2", "line 3", ...]

No markdown. No explanations.`;
}
```

### 3. Cellmate Dialogue (Optional)

**Used:** For enhanced cellmate system

```javascript
buildCellmateDialoguePrompt(relationship, days) {
    return `Generate 5 brief cellmate remarks for a prison game.

Relationship level: ${relationship}/100 (${relationship < 30 ? 'distant' : relationship < 60 ? 'friendly' : 'close'})
Days together: ${days}

Tone: Disco Elysium style (existential, absurd, touching, resigned)

Return as JSON array ONLY:
["remark 1", "remark 2", ...]

No markdown. No explanations.`;
}
```

### 4. Random Event Outcomes (Optional)

**Used:** For dynamic event consequences

```javascript
buildEventOutcomePrompt(eventType, playerChoice) {
    return `Generate 1 brief (2-3 sentence) outcome description for a prison game random event.

Event: ${eventType}
Player choice: ${playerChoice}

Tone: Dark comedy, consequences should feel absurd but logical

Return ONLY the outcome text. No JSON. No markdown.`;
}
```

---

## COMPLETE IMPLEMENTATION

### File: `game/gemini-events.js`

**Full implementation-ready code:**

```javascript
// ==================== GEMINI RANDOM EVENTS SYSTEM ====================
// VROOM VROOM - AI-Generated Prison Events
// Uses Gemini API for dynamic content with intelligent caching

class GeminiRandomEventGenerator {
    constructor(apiKeyManager) {
        this.apiKeyManager = apiKeyManager;
        this.poolSize = 20;

        this.eventPools = {
            guardDialogue: [],
            prisonEvents: [],
            cellmateRemarks: [],
            ambientEvents: []
        };

        this.staticFallbacks = this.initializeStaticFallbacks();

        this.stats = {
            totalGenerated: 0,
            totalUsed: 0,
            apiCallCount: 0,
            lastGenerated: null
        };
    }

    async generateEventPool() {
        if (!this.apiKeyManager.hasApiKey()) {
            console.log('[GEMINI] No API key - using static events only');
            return false;
        }

        const prompt = this.buildBatchPrompt();

        try {
            const response = await this.callGemini(prompt);
            const success = this.parseAndStoreEvents(response);

            if (success) {
                this.stats.totalGenerated += this.poolSize * 4;
                this.stats.apiCallCount++;
                this.stats.lastGenerated = Date.now();
                console.log(`[GEMINI] Generated ${this.poolSize * 4} events in 1 API call`);
            }

            return success;
        } catch (error) {
            console.error('[GEMINI] Pool generation failed:', error);
            return false;
        }
    }

    buildBatchPrompt() {
        return `You are a creative writer for VROOM VROOM, a dark comedy prison game with Disco Elysium-style absurd bureaucracy and existential dread.

Generate varied, unique content for prison gameplay. Return ONLY valid JSON, no markdown, no explanations.

TONE GUIDELINES:
- Dark humor, not mean-spirited
- Absurd bureaucracy (forms, procedures, nonsense rules)
- Existential dread mixed with mundane details
- Cynical guards, resigned inmates
- Unexpected humanity in bleak moments

Generate 20 of each category below:

{
    "guardDialogue": [
        // 20 short (1-2 sentence) guard remarks
        // Examples: "Quiet night... too quiet.", "Don't make me come in there.", "My kid's birthday is today. I'm stuck here with you people."
    ],
    "prisonEvents": [
        // 20 brief (2-3 sentence) ambient prison events
        // Examples: "Fight breaks out in cafeteria. Guards rush past.", "Power flickers. Emergency lights activate.", "Visitor day. Wonder who it is."
    ],
    "cellmateRemarks": [
        // 20 brief cellmate observations (1-2 sentences)
        // Examples: "You ever think about clouds? Me neither.", "I had a dream about driving. Felt so real.", "The walls are listening. They always listen."
    ],
    "ambientEvents": [
        // 20 background prison sounds/events (1 sentence)
        // Examples: "Distant shouts from C Block.", "Meal cart rolling by.", "Guard radio chatter about overtime."
    ]
}

IMPORTANT: Return ONLY the JSON object. No markdown code blocks. No additional text.`;
    }

    async callGemini(prompt) {
        const apiKey = this.apiKeyManager.getApiKey();
        if (!apiKey) return null;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    parseAndStoreEvents(responseText) {
        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const events = JSON.parse(jsonMatch[0]);

            if (events.guardDialogue && Array.isArray(events.guardDialogue)) {
                this.eventPools.guardDialogue = events.guardDialogue;
            }
            if (events.prisonEvents && Array.isArray(events.prisonEvents)) {
                this.eventPools.prisonEvents = events.prisonEvents;
            }
            if (events.cellmateRemarks && Array.isArray(events.cellmateRemarks)) {
                this.eventPools.cellmateRemarks = events.cellmateRemarks;
            }
            if (events.ambientEvents && Array.isArray(events.ambientEvents)) {
                this.eventPools.ambientEvents = events.ambientEvents;
            }

            return true;
        } catch (error) {
            console.error('[GEMINI] Failed to parse events:', error);
            return false;
        }
    }

    getEvent(category) {
        this.stats.totalUsed++;

        if (this.eventPools[category] && this.eventPools[category].length > 0) {
            const index = Math.floor(Math.random() * this.eventPools[category].length);
            return this.eventPools[category].splice(index, 1)[0];
        }

        return this.getStaticFallback(category);
    }

    initializeStaticFallbacks() {
        return {
            guardDialogue: [
                "Keep it down in there.",
                "Lights out in 10 minutes.",
                "You're on notice, prisoner.",
                "Don't test me today.",
                "I've had enough of this place.",
                "Move along. Nothing to see here.",
                "You know the rules. Follow them.",
                "Shift ends in 2 hours. Not soon enough.",
                "Another day, another paycheck.",
                "Stay in line, prisoner."
            ],
            prisonEvents: [
                "Another day. Same walls. Same routine.",
                "Distant alarm. Lockdown somewhere else.",
                "Cafeteria smell wafts through ventilation.",
                "Guard shift change. Keys jangling.",
                "Clock ticks. Time passes. Slowly.",
                "Someone yelling in D Block.",
                "Overhead fluorescent light flickers.",
                "Maintenance crew working on pipes.",
                "PA system crackles. Announcement incoming.",
                "Rain pattering on distant windows."
            ],
            cellmateRemarks: [
                "You ever wonder what's beyond these walls?",
                "I miss the outside. The sky.",
                "This is our life now.",
                "At least we have each other. Sort of.",
                "Quiet today. Too quiet.",
                "I had a dream about driving last night.",
                "The guards don't even look at us anymore.",
                "Time moves differently in here.",
                "You think they remember we exist?",
                "Another day closer to release. Hopefully."
            ],
            ambientEvents: [
                "Footsteps echo down the corridor.",
                "Someone coughing in the next cell.",
                "Fluorescent light buzzing overhead.",
                "Metal door clangs shut somewhere.",
                "Radio static from guard station.",
                "Ventilation system humming.",
                "Keys jangling on guard's belt.",
                "Distant laughter from yard.",
                "Water dripping somewhere.",
                "Clock on wall ticks steadily."
            ]
        };
    }

    getStaticFallback(category) {
        const fallbacks = this.staticFallbacks[category];
        if (!fallbacks || fallbacks.length === 0) {
            return "Nothing happens. Time passes.";
        }
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    getPoolStatus() {
        return {
            guardDialogue: this.eventPools.guardDialogue.length,
            prisonEvents: this.eventPools.prisonEvents.length,
            cellmateRemarks: this.eventPools.cellmateRemarks.length,
            ambientEvents: this.eventPools.ambientEvents.length,
            stats: this.stats
        };
    }

    needsRefresh() {
        const totalRemaining =
            this.eventPools.guardDialogue.length +
            this.eventPools.prisonEvents.length +
            this.eventPools.cellmateRemarks.length +
            this.eventPools.ambientEvents.length;

        return totalRemaining < 10;
    }
}

// ==================== AMBIENT EVENT TIMER ====================

class AmbientEventTimer {
    constructor(eventGenerator, soundSystem) {
        this.eventGenerator = eventGenerator;
        this.soundSystem = soundSystem;
        this.timer = null;
        this.isActive = false;
        this.minInterval = 120000; // 2 minutes
        this.maxInterval = 300000; // 5 minutes
    }

    start() {
        if (this.isActive) return;
        this.isActive = true;
        this.scheduleNextEvent();
    }

    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.isActive = false;
    }

    scheduleNextEvent() {
        if (!this.isActive) return;

        const interval = Math.random() * (this.maxInterval - this.minInterval) + this.minInterval;

        this.timer = setTimeout(() => {
            this.triggerAmbientEvent();
            this.scheduleNextEvent();
        }, interval);
    }

    triggerAmbientEvent() {
        if (!window.game || window.game.currentScreen !== 'prisonMenu') return;

        const eventType = Math.random() < 0.5 ? 'ambientEvents' : 'guardDialogue';
        const event = this.eventGenerator.getEvent(eventType);

        const isGuardWalking = eventType === 'guardDialogue' && Math.random() < 0.7;

        if (isGuardWalking) {
            this.showGuardWalkingEvent(event);
        } else {
            this.showSimpleAmbientEvent(event);
        }
    }

    showGuardWalkingEvent(dialogue) {
        // Play footsteps approaching (if sound system supports it)
        if (this.soundSystem && this.soundSystem.playFootstepsApproaching) {
            this.soundSystem.playFootstepsApproaching();
        }

        setTimeout(() => {
            const guardName = this.getRandomGuardName();
            this.showAmbientNotification(`Guard ${guardName} walks by: "${dialogue}"`, 5000);

            setTimeout(() => {
                if (this.soundSystem && this.soundSystem.playFootstepsFading) {
                    this.soundSystem.playFootstepsFading();
                }
            }, 2000);
        }, 1000);
    }

    showSimpleAmbientEvent(event) {
        this.showAmbientNotification(event, 5000);
    }

    showAmbientNotification(text, duration) {
        let notification = document.getElementById('ambientNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'ambientNotification';
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                max-width: 400px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #0f0;
                padding: 15px 20px;
                color: #0f0;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
                opacity: 0;
                transition: opacity 0.5s;
                z-index: 1000;
            `;
            document.body.appendChild(notification);
        }

        notification.textContent = text;
        notification.style.opacity = '1';

        setTimeout(() => {
            notification.style.opacity = '0';
        }, duration);
    }

    getRandomGuardName() {
        const names = ['Jenkins', 'Martinez', 'Chen', 'Thompson', 'Rodriguez', 'Kowalski', 'O\'Brien', 'Davis'];
        return names[Math.floor(Math.random() * names.length)];
    }
}

// ==================== GUARD DIALOGUE SYSTEM ====================

class GuardDialogueSystem {
    constructor(eventGenerator) {
        this.eventGenerator = eventGenerator;

        this.guards = {
            jenkins: { nervousness: 0.7, tone: 'strict' },
            martinez: { nervousness: 0.3, tone: 'perfectionist' },
            chen: { nervousness: 0.9, tone: 'impatient' },
            thompson: { nervousness: 0.5, tone: 'chatty' },
            rodriguez: { nervousness: 0.6, tone: 'paranoid' }
        };
    }

    getContextualDialogue(context) {
        if (Math.random() < 0.7) {
            return this.eventGenerator.getEvent('guardDialogue');
        }

        return this.getContextSpecificDialogue(context);
    }

    getContextSpecificDialogue(context) {
        const dialogues = {
            patrol: [
                "Quiet night... too quiet.",
                "Keep it down in there.",
                "Lights out in 10 minutes.",
                "You're on notice, prisoner."
            ],
            manicure: [
                "Make it look good. My wife notices.",
                "Don't cut me. I'm watching you.",
                "This better be worth it.",
                "Steady hands. I'm trusting you here."
            ],
            search: [
                "Turn around. Hands on the wall.",
                "Don't make this harder than it needs to be.",
                "You better not have anything on you.",
                "Routine inspection. Stay calm."
            ],
            fight: [
                "Break it up! NOW!",
                "Both of you, against the wall!",
                "I don't have time for this!",
                "You want solitary? Keep going."
            ],
            general: [
                "Another day in paradise.",
                "I've had enough of this place.",
                "Don't test me today.",
                "Move along, prisoner."
            ]
        };

        const category = dialogues[context] || dialogues.general;
        return category[Math.floor(Math.random() * category.length)];
    }

    getGuardDialogue(guardName, context) {
        const guard = this.guards[guardName.toLowerCase()];
        if (!guard) return this.getContextualDialogue(context);

        let dialogue = this.getContextualDialogue(context);

        if (guard.nervousness > 0.7) {
            const nervous = [' Uh...', ' I guess...', ' Maybe...'];
            if (Math.random() < 0.3) {
                dialogue += nervous[Math.floor(Math.random() * nervous.length)];
            }
        }

        return dialogue;
    }
}

// ==================== CORRUPTION TRACKER ====================

class CorruptionTracker {
    constructor() {
        this.corruptionLevel = 0;
        this.corruptionThresholds = {
            clean: { max: 20, color: '#0f0', label: 'CLEAN RECORD' },
            questionable: { max: 40, color: '#ff0', label: 'QUESTIONABLE' },
            corrupt: { max: 60, color: '#f80', label: 'CORRUPT' },
            notorious: { max: 80, color: '#f00', label: 'NOTORIOUS' },
            criminal: { max: 100, color: '#f0f', label: 'CRIMINAL MASTERMIND' }
        };
    }

    initialize(player) {
        if (!player.corruption) {
            player.corruption = 0;
        }
        this.corruptionLevel = player.corruption;
    }

    adjustCorruption(amount, reason, player) {
        const oldLevel = this.corruptionLevel;
        this.corruptionLevel = Math.max(0, Math.min(100, this.corruptionLevel + amount));
        player.corruption = this.corruptionLevel;

        const oldStatus = this.getCorruptionStatus(oldLevel);
        const newStatus = this.getCorruptionStatus(this.corruptionLevel);

        if (oldStatus.label !== newStatus.label && window.game) {
            window.game.showMessage(`CORRUPTION STATUS: ${newStatus.label}`, 5000);
        }

        console.log(`[CORRUPTION] ${reason}: ${amount > 0 ? '+' : ''}${amount} (${this.corruptionLevel}/100)`);
    }

    getCorruptionStatus(level = this.corruptionLevel) {
        for (let status in this.corruptionThresholds) {
            if (level <= this.corruptionThresholds[status].max) {
                return {
                    label: this.corruptionThresholds[status].label,
                    color: this.corruptionThresholds[status].color
                };
            }
        }
        return this.corruptionThresholds.criminal;
    }

    getCorruptionEffects() {
        const effects = {
            contrabandAccessBonus: 0,
            searchChanceModifier: 0,
            guardIgnoreChance: 0,
            blackMarketDiscount: 0,
            investigationRisk: 0,
            sentencePenaltyMultiplier: 1.0
        };

        if (this.corruptionLevel >= 80) {
            effects.contrabandAccessBonus = 30;
            effects.searchChanceModifier = -30;
            effects.guardIgnoreChance = 40;
            effects.blackMarketDiscount = 25;
            effects.investigationRisk = 70;
            effects.sentencePenaltyMultiplier = 1.5;
        } else if (this.corruptionLevel >= 60) {
            effects.contrabandAccessBonus = 20;
            effects.searchChanceModifier = -20;
            effects.guardIgnoreChance = 25;
            effects.blackMarketDiscount = 15;
            effects.investigationRisk = 40;
            effects.sentencePenaltyMultiplier = 1.3;
        } else if (this.corruptionLevel >= 40) {
            effects.contrabandAccessBonus = 10;
            effects.searchChanceModifier = -10;
            effects.guardIgnoreChance = 10;
            effects.blackMarketDiscount = 10;
            effects.investigationRisk = 20;
            effects.sentencePenaltyMultiplier = 1.15;
        }

        return effects;
    }

    incrementCorruption(action, player) {
        const corruptionActions = {
            'bribe_guard': { amount: 5, reason: 'Bribing guard' },
            'smuggle_contraband': { amount: 10, reason: 'Smuggling contraband' },
            'gang_activity': { amount: 3, reason: 'Gang activity' },
            'successful_manicure': { amount: 2, reason: 'Guard manicure bribe' },
            'escape_planning': { amount: 15, reason: 'Planning escape' },
            'refused_bribe': { amount: -5, reason: 'Refusing bribe' },
            'snitch': { amount: -10, reason: 'Snitching on others' },
            'good_behavior_day': { amount: -1, reason: 'Good behavior' }
        };

        const data = corruptionActions[action];
        if (data) {
            this.adjustCorruption(data.amount, data.reason, player);
        }
    }
}

// ==================== TIMED EVENT SYSTEM ====================

class TimedEventSystem {
    constructor(eventGenerator) {
        this.eventGenerator = eventGenerator;
    }

    getTimedEvent() {
        const hour = new Date().getHours();

        if (hour >= 6 && hour < 9) {
            const morningEvents = [
                "Wake up call blares. 'RISE AND SHINE, INMATES!'",
                "Breakfast cart rattles down the corridor.",
                "Guards conduct morning count. Voices echo.",
                this.eventGenerator.getEvent('ambientEvents')
            ];
            return morningEvents[Math.floor(Math.random() * morningEvents.length)];
        }

        if (hour >= 10 && hour < 12) {
            const yardEvents = [
                "Yard door opens. Fresh air. Relatively.",
                "Basketball bouncing in the distance.",
                "Weights clanking. Someone's training.",
                this.eventGenerator.getEvent('ambientEvents')
            ];
            return yardEvents[Math.floor(Math.random() * yardEvents.length)];
        }

        if (hour >= 12 && hour < 13) {
            const lunchEvents = [
                "Lunch bell. The stampede begins.",
                "Mystery meat smell intensifies.",
                "Cafeteria noise reaches your cell.",
                this.eventGenerator.getEvent('ambientEvents')
            ];
            return lunchEvents[Math.floor(Math.random() * lunchEvents.length)];
        }

        if (hour >= 18 && hour < 19) {
            const dinnerEvents = [
                "Dinner time. You're not optimistic.",
                "Trays clattering. Guards yelling.",
                "Food cart passes. Today's special: regret.",
                this.eventGenerator.getEvent('ambientEvents')
            ];
            return dinnerEvents[Math.floor(Math.random() * dinnerEvents.length)];
        }

        if (hour >= 22 || hour < 6) {
            const nightEvents = [
                "Lights out. Darkness. Thoughts.",
                "Someone snoring in C Block.",
                "Guard night shift radio chatter.",
                "Footsteps. Flashlight beam. Patrol.",
                this.eventGenerator.getEvent('ambientEvents')
            ];
            return nightEvents[Math.floor(Math.random() * nightEvents.length)];
        }

        return this.eventGenerator.getEvent('ambientEvents');
    }
}

// ==================== END GEMINI RANDOM EVENTS SYSTEM ====================
```

---

## TESTING & VALIDATION

### Test Checklist

**Pre-Integration Testing:**
- [ ] Verify ApiKeyManager exists and works
- [ ] Test Gemini API key with test call
- [ ] Confirm free tier access (14,000/day)

**Pool Generation Testing:**
- [ ] Generate event pool with valid API key
- [ ] Verify 80 events generated (20 × 4 categories)
- [ ] Check JSON parsing works correctly
- [ ] Test fallback when API unavailable
- [ ] Verify pool doesn't persist between sessions

**Event Retrieval Testing:**
- [ ] Pull events from each category
- [ ] Verify pool depletion triggers fallback
- [ ] Test static fallback events work
- [ ] Confirm no duplicate events in pool

**Ambient Event Testing:**
- [ ] Start timer on prison menu
- [ ] Verify events trigger every 2-5 minutes
- [ ] Test notification display/fade
- [ ] Confirm timer stops when leaving prison
- [ ] Test guard walking events

**Guard Dialogue Testing:**
- [ ] Test contextual dialogue (patrol, search, fight)
- [ ] Verify guard personality modifiers work
- [ ] Test manicure system integration

**Corruption Testing:**
- [ ] Initialize corruption stat
- [ ] Test corruption increase actions
- [ ] Test corruption decrease actions
- [ ] Verify threshold crossing messages
- [ ] Test corruption effects on gameplay

**Performance Testing:**
- [ ] Monitor API call count
- [ ] Verify 1-2 calls per session max
- [ ] Test with no API key (fallback only)
- [ ] Confirm no gameplay blocking

### Browser Console Testing Commands

```javascript
// Test event pool generation
game.geminiEvents.generateEventPool().then(success => {
    console.log('Pool generated:', success);
    console.log('Pool status:', game.geminiEvents.getPoolStatus());
});

// Test event retrieval
console.log('Guard dialogue:', game.geminiEvents.getEvent('guardDialogue'));
console.log('Prison event:', game.geminiEvents.getEvent('prisonEvents'));
console.log('Cellmate remark:', game.geminiEvents.getEvent('cellmateRemarks'));
console.log('Ambient event:', game.geminiEvents.getEvent('ambientEvents'));

// Test ambient timer
game.ambientTimer.start();
// Wait 2-5 minutes for event

// Test corruption
game.corruptionTracker.incrementCorruption('bribe_guard', game.player);
console.log('Corruption:', game.corruptionTracker.corruptionLevel);
console.log('Effects:', game.corruptionTracker.getCorruptionEffects());

// Test pool stats
console.log('Stats:', game.geminiEvents.stats);
```

---

## PERFORMANCE & OPTIMIZATION

### API Call Optimization

**Strategy:**
- **Batch generation:** 80 events per call
- **Session-based:** Fresh pool each session
- **No persistence:** Events not saved to localStorage
- **Smart fallback:** Static events when pool empty

**Expected Performance:**
- **Session start:** 1 API call (~2 seconds)
- **Average session:** 1 call total
- **Daily usage:** 5-10 calls (0.04%-0.07% of limit)

### Memory Management

**Event Pool Storage:**
- **Location:** In-memory only (not localStorage)
- **Size:** ~80 events × ~100 chars = ~8KB
- **Lifetime:** Session duration only
- **Cleanup:** Automatic on session end

### Graceful Degradation

**No API Key:**
- System initializes normally
- All events use static fallbacks
- No user-facing errors
- Identical gameplay experience

**API Call Fails:**
- Retry once after 5 seconds
- If still fails, use static events
- Log error to console
- Show message to user (optional)

**Pool Depleted:**
- Switch to static events seamlessly
- No interruption to gameplay
- Consider refreshing pool in background

### Network Optimization

**API Call Timing:**
- **Session start:** Generate pool after 2-second delay
- **Background:** Don't block game initialization
- **Retry logic:** Max 1 retry, 5-second delay
- **Timeout:** 10-second timeout on API calls

**Caching Strategy:**
- **No caching:** Fresh events each session
- **Reason:** 14,000/day limit is generous
- **Benefit:** Always unique events

---

## INTEGRATION CHECKLIST

### Phase 1: Core System
- [ ] Create `game/gemini-events.js` file
- [ ] Add script to `index.html` (after `game.js`)
- [ ] Initialize in `VroomVroomGame` constructor
- [ ] Test pool generation manually

### Phase 2: Ambient Events
- [ ] Add ambient timer initialization
- [ ] Start timer on prison menu entry
- [ ] Stop timer on prison menu exit
- [ ] Test 2-5 minute intervals

### Phase 3: Guard Dialogue
- [ ] Integrate with guard manicure system
- [ ] Add to random event system
- [ ] Test context-aware dialogue

### Phase 4: Corruption System
- [ ] Add corruption stat to player object
- [ ] Track corruption actions
- [ ] Apply corruption effects
- [ ] Add visual corruption meter

### Phase 5: Testing & Polish
- [ ] Run all test scenarios
- [ ] Verify API usage statistics
- [ ] Test fallback systems
- [ ] Performance profiling

### Phase 6: Documentation
- [ ] Update SYSTEMS.md
- [ ] Update CHANGELOG.md
- [ ] Create integration guide
- [ ] Update claude.md

---

## FUTURE ENHANCEMENTS

### Priority: HIGH
- [ ] Enhanced cellmate dialogue system
- [ ] Dynamic random event outcomes
- [ ] Time-specific event variations
- [ ] Corruption visual effects (screen darkening)

### Priority: MEDIUM
- [ ] Letter response generation
- [ ] Judge Hardcastle dynamic commentary
- [ ] Prison PA announcements
- [ ] Gang-specific events

### Priority: LOW
- [ ] Seasonal event variations
- [ ] Holiday-specific events
- [ ] Player birthday events
- [ ] Multi-language support

---

**END OF COMPREHENSIVE DESIGN**

**Status:** ✅ Ready for Implementation
**Estimated Integration Time:** 4-6 hours
**Expected Benefits:**
- Infinite replayability
- Unique playthrough experiences
- Living, breathing prison atmosphere
- Efficient API usage (1-2 calls/session)
