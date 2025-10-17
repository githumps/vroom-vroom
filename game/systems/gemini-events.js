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

    getStatus() {
        return {
            level: this.corruptionLevel,
            status: this.getCorruptionStatus(),
            effects: this.getCorruptionEffects()
        };
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
