# COMEDY HOOK INTEGRATION GUIDE
## How Game-Dev Agents Use the Comedy Specialist System

**Version:** 1.0.0
**Created:** 2025-10-16
**Purpose:** Step-by-step guide for invoking comedy consultation
**Target Audience:** game-dev-specialist agents, developers, content creators

---

## TABLE OF CONTENTS

1. [Quick Start](#quick-start)
2. [When to Invoke Comedy Hook](#when-to-invoke-comedy-hook)
3. [Integration Workflows](#integration-workflows)
4. [Invocation Templates](#invocation-templates)
5. [Example Integrations](#example-integrations)
6. [Quality Assurance](#quality-assurance)
7. [Troubleshooting](#troubleshooting)

---

## QUICK START

### 30-Second Summary

**Before writing any player-facing narrative content:**

1. Build the system mechanics first (game-dev agent's job)
2. Generate initial content draft (dialogue, events, descriptions)
3. Invoke comedy specialist agent for tone review
4. Integrate refined content into game
5. Test with playtester feedback

**Golden Rule:** Tech builds the skeleton, comedy adds the soul.

---

## WHEN TO INVOKE COMEDY HOOK

### Automatic Triggers (ALWAYS invoke)

- [ ] Generating prison guard dialogue (patrol comments, search threats, personal anecdotes)
- [ ] Creating random prison events (20+ events planned for v1.5.0)
- [ ] Writing Gemini API prompts (court charges, letters, cellmate dialogue)
- [ ] Designing Judge Hardcastle reactions (anger escalation, repeat offender remarks)
- [ ] Creating prison PA announcements (meal time, inspections, events)
- [ ] Writing cellmate conversations (backstories, philosophical discussions, requests)
- [ ] Generating letter responses (family, friends, lawyers, bureaucrats)
- [ ] Adding flavor text to activities (eating, weights, library, commissary)
- [ ] Creating item descriptions (commissary items, contraband, books)

### Manual Triggers (invoke as needed)

- [ ] Developer requests tone review of existing content
- [ ] Playtester reports content is unfunny, offensive, or tonally inconsistent
- [ ] New writer joins project (needs tone onboarding)
- [ ] Major content expansion (new systems, activities, characters)
- [ ] Pre-release quality assurance audit
- [ ] Version-to-version consistency check

### When NOT to Invoke

- Pure mechanics (collision detection, save/load, rendering)
- UI layout and visual design (unless text content)
- Technical systems (time tracking, stat calculations, AI pathfinding)
- Bug fixes (unless bug is in narrative content)
- Performance optimization

---

## INTEGRATION WORKFLOWS

### Workflow 1: New Content Generation (STANDARD)

**Use for:** Creating new dialogue, events, or narrative content from scratch

```
STEP 1: Design System Mechanics
- Game-dev agent designs gameplay structure
- Define choices, outcomes, stat changes
- Create wireframes/flowcharts
- NO FLAVOR TEXT YET

Example: Design "Cafeteria Riot" event
- 3 player choices
- Reputation changes per choice
- 50% chance solitary confinement
- 1-day lockdown effect

STEP 2: Generate Draft Content
- Game-dev agent writes initial content
- Focus on functional clarity
- Use placeholder tone
- Include all necessary game info

Example Draft:
Title: CAFETERIA RIOT
Description: "A riot happens in the cafeteria."
Choices:
1. Join riot
2. Don't join riot
3. Help guards

STEP 3: Invoke Comedy Specialist
- Submit draft to comedy agent
- Provide full context (see templates below)
- Request tone enhancement

Invocation:
"Review this cafeteria riot event. Enhance with Disco Elysium dark humor.
Ensure punching up, emotional authenticity, and player agency respect."

STEP 4: Receive Enhanced Content
- Comedy agent returns refined content
- Includes tone analysis and notes
- May suggest additional choices/outcomes

STEP 5: Integrate and Test
- Game-dev agent integrates final content
- Test in-game display
- Verify tone consistency
- Playtester feedback loop

STEP 6: Iterate if Needed
- If playtesting reveals issues, return to Step 3
- Comedy agent refines based on feedback
```

### Workflow 2: Gemini Prompt Enhancement (AI CONTENT)

**Use for:** Creating prompts that will generate player-facing content via AI

```
STEP 1: Identify AI Content Need
- What content needs to be generated? (charges, dialogue, letters)
- How often? (every arrest, random events, player actions)
- What context is available? (player state, game variables)

STEP 2: Write Basic Prompt
- Game-dev agent writes functional prompt
- Include necessary variables
- Focus on content structure

Example Basic Prompt:
"Generate 4-6 court charges for driving violation.
Context: {arrestCount}, {speed}, {time}"

STEP 3: Invoke Comedy for Prompt Enhancement
- Submit basic prompt to comedy agent
- Request tone guardrails and examples

Invocation Template:
"Enhance this Gemini prompt to ensure Disco Elysium tone.
Add good/bad examples, constraints, and comedy guidance."

STEP 4: Receive Enhanced Prompt
- Comedy agent returns prompt with:
  - Tone requirements explained
  - 5+ good examples
  - 5+ bad examples (what to avoid)
  - Structural templates
  - Character limits
  - Punching up/down guidance

STEP 5: Implement Enhanced Prompt
- Game-dev agent integrates into API call
- Add fallback static content
- Test with multiple API calls
- Verify consistency

STEP 6: Validate Output Quality
- First 10 API responses reviewed by comedy agent
- Flag any problematic patterns
- Refine prompt if needed
```

### Workflow 3: Batch Content Review (QUALITY ASSURANCE)

**Use for:** Auditing existing content for tonal consistency

```
STEP 1: Collect All Content
- Gather all dialogue, events, descriptions
- Organize by category
- Note current implementation status

Example Collection:
- Prison guard patrol: 50 lines
- Random events: 20 events
- Judge reactions: 30 variants
- PA announcements: 15 messages

STEP 2: Invoke Comedy Audit
- Submit full content library
- Request comprehensive tone review

Invocation:
"Tone audit: Review all prison guard dialogue (50 lines).
Flag any that break Disco Elysium tone.
Identify top 10 best (preserve) and bottom 10 worst (revise)."

STEP 3: Receive Audit Report
- Comedy agent returns:
  - Overall tone grade (A-F)
  - Top examples to preserve
  - Flagged items needing revision
  - Missing opportunities
  - Tone inconsistencies

STEP 4: Prioritize Revisions
- Fix F-tier (critical) immediately
- Revise D-tier (poor) before release
- Polish C-tier (functional) if time
- Study A-tier (excellent) as models

STEP 5: Implement Fixes
- Game-dev agent applies revisions
- Re-submit changed content for validation
- Update documentation

STEP 6: Final Approval
- Comedy agent confirms fixes pass quality bar
- Content locked for release
```

---

## INVOCATION TEMPLATES

### Template 1: Dialogue Generation

```markdown
COMEDY HOOK: Dialogue Generation Request

Content Type: [Prison guard / Judge / Cellmate / PA announcement]
Quantity: [Number of lines needed]
Character: [Name and personality if applicable]
Context: [When/where dialogue appears]

Character Profile (if applicable):
- Name: [Character name]
- Personality: [Traits, quirks, voice]
- Role: [Guard, inmate, authority figure]
- Relationship to player: [Hostile, neutral, helpful]

Current Draft (if any):
[Paste draft dialogue here]

Request:
1. Generate [number] lines of dialogue
2. Match Disco Elysium tone (dark humor, poetic, systemic critique)
3. Ensure character consistency
4. Punch up at system, not down at individuals
5. Provide tone analysis for each line

Constraints:
- Character limit: [e.g., 150 characters per line]
- Must reference: [specific game elements]
- Avoid: [specific topics or tones]

Example tone target:
[Paste 1-2 examples of desired tone]
```

**Usage Example:**
```markdown
COMEDY HOOK: Dialogue Generation Request

Content Type: Prison guard patrol comments
Quantity: 15 lines
Character: Generic exhausted guard
Context: Random patrol dialogue when player is in yard/hallway

Character Profile:
- Name: Generic guard (procedurally varied)
- Personality: Tired, bureaucratic, self-aware of absurdity
- Role: Enforcement with no fulfillment
- Relationship to player: Professional distance, not cruel

Current Draft:
1. "Keep moving."
2. "Nothing to see here."
3. "Get back to work."

Request:
1. Generate 15 lines of guard patrol dialogue
2. Match Disco Elysium tone (dark humor, poetic, systemic critique)
3. Guards are trapped by system they enforce
4. Punch up at bureaucracy, not down at prisoners
5. Provide tone analysis for each line

Constraints:
- Character limit: 150 characters per line
- Must reference: Prison routine, forms, regulations, or existential exhaustion
- Avoid: Cruelty, violence, generic cop dialogue

Example tone target:
"Twenty years on the job. I've forgotten why driving was illegal. They say I never knew."
```

### Template 2: Event Design

```markdown
COMEDY HOOK: Random Event Design Request

Event Type: [Food poisoning / Riot / Inspection / etc.]
Trigger: [When event occurs]
Frequency: [How often player encounters]

Event Structure:
- Title: [Current title]
- Description: [Current description]
- Choices: [List of player options]
- Outcomes: [Consequences per choice]

Current Draft:
[Paste full event design]

Request:
1. Enhance description with Disco Elysium voice
2. Make choices feel meaningful and character-revealing
3. Add dark humor without cruelty
4. Ensure outcomes cascade logically
5. Suggest additional choices if needed

Constraints:
- Description: Under 300 characters
- Choices: 3-4 options
- Outcomes: Must affect stats/reputation/progression
- Tone: Dark but not nihilistic

Tone Target:
[Describe desired emotional impact]
```

### Template 3: Gemini Prompt Enhancement

```markdown
COMEDY HOOK: Gemini Prompt Enhancement Request

Content Being Generated: [Court charges / Letters / Dialogue / etc.]
Frequency: [How often this prompt is called]
Player-Facing: [Yes/No]

Current Prompt:
---
[Paste original Gemini prompt here]
---

Context Variables Available:
- {variable1}: [Description]
- {variable2}: [Description]

Request:
1. Add Disco Elysium tone guidance
2. Provide 5+ good examples
3. Provide 5+ bad examples (what to avoid)
4. Add punching up/down constraints
5. Include structural templates
6. Specify character limits
7. Add trauma-informed guardrails

Tone Requirements:
- Funny%: [percentage]
- Sad%: [percentage]
- Absurd%: [percentage]
- Grounded%: [percentage]

Enhanced Prompt:
[Comedy agent fills this section]
```

### Template 4: Emergency Tone Fix

```markdown
COMEDY HOOK: Emergency Tone Intervention

Severity: [Minor / Moderate / Critical]

Reported Issue:
[What playtester/developer reported]

Flagged Content:
---
[Paste problematic content here]
---

Context:
- Where: [Game location/screen]
- When: [Trigger conditions]
- Who: [Character/system responsible]

Request:
1. Identify what went wrong (tone analysis)
2. Explain why it breaks game voice
3. Provide 3 alternative versions
4. Suggest system-wide fix if pattern detected

Urgency: [Immediate / Within 24hr / Can wait]

Additional Context:
[Any relevant game state, player feedback, or technical constraints]
```

---

## EXAMPLE INTEGRATIONS

### Example 1: Adding Random Prison Events (v1.5.0)

**SCENARIO:** Game-dev agent is implementing 20 random prison events system

**STEP 1: Build Event System (Game-Dev Agent)**
```javascript
// game.js - Event system structure
class RandomEventSystem {
    constructor(game) {
        this.game = game;
        this.events = []; // Will be populated with content
        this.triggerChance = 0.20; // 20% per prison day
    }

    triggerEvent() {
        if (Math.random() > this.triggerChance) return;
        const event = this.selectRandomEvent();
        this.showEventScreen(event);
    }

    selectRandomEvent() {
        // Weighted random selection
        const totalWeight = this.events.reduce((sum, e) => sum + e.weight, 0);
        let roll = Math.random() * totalWeight;
        for (let event of this.events) {
            roll -= event.weight;
            if (roll <= 0) return event;
        }
    }

    showEventScreen(event) {
        // Display event UI
        this.game.showScreen('randomEvent');
        document.getElementById('eventTitle').textContent = event.title;
        document.getElementById('eventDesc').textContent = event.description;

        // Generate choice buttons
        const container = document.getElementById('eventChoices');
        container.innerHTML = '';
        event.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.textContent = choice.text;
            btn.onclick = () => this.handleChoice(choice);
            container.appendChild(btn);
        });
    }

    handleChoice(choice) {
        const outcome = choice.outcome(this.game.player);
        this.game.showMessage(outcome.message, 5000);
        this.applyEffects(outcome.effects);
    }
}
```

**STEP 2: Design Event Structure (Game-Dev Agent)**
```javascript
// Draft event - functional but no tone
const cafeteriaRiotEvent = {
    id: 'cafeteria_riot',
    weight: 5,
    title: 'CAFETERIA RIOT',
    description: 'A riot starts in the cafeteria.',
    choices: [
        {
            text: 'Join the riot',
            outcome: (player) => ({
                message: 'You join the riot.',
                effects: {
                    inmateRep: +10,
                    solitary: Math.random() < 0.5 ? 3 : 0
                }
            })
        },
        {
            text: 'Stay neutral',
            outcome: (player) => ({
                message: 'You stay out of it.',
                effects: { lockdown: 1 }
            })
        },
        {
            text: 'Help guards',
            outcome: (player) => ({
                message: 'You help the guards.',
                effects: {
                    guardRep: +15,
                    inmateRep: -20
                }
            })
        }
    ]
};
```

**STEP 3: Invoke Comedy Hook**
```markdown
COMEDY HOOK: Random Event Design Request

Event Type: Cafeteria Riot
Trigger: 20% chance per prison day (random event system)
Frequency: Rare (5% weight in event pool)

Event Structure:
- Title: CAFETERIA RIOT
- Description: "A riot starts in the cafeteria."
- Choices:
  1. Join the riot (+10 inmate rep, 50% chance 3 days solitary)
  2. Stay neutral (1 day lockdown)
  3. Help guards (+15 guard rep, -20 inmate rep)

Current Draft:
See above (functional but tonally flat)

Request:
1. Enhance description with Disco Elysium voice (visceral, absurd, specific)
2. Make choices feel character-revealing
3. Add dark humor to outcome messages
4. Ensure punching up (system failure, not inmate foolishness)
5. Suggest 4th choice if thematically appropriate

Constraints:
- Description: Under 300 characters
- Choices: 3-4 options with distinct moral/practical implications
- Outcomes: Must show consequences (stat changes + narrative message)
- Tone: Dark, absurd, but grounded in prison reality

Tone Target:
Player should feel: "This is ridiculous but also totally plausible in this world"
Example: Eating Simulator voice (specific, poetic, systemic critique)
```

**STEP 4: Receive Enhanced Content (Comedy Agent Response)**
```javascript
// Enhanced version with Disco Elysium tone
const cafeteriaRiotEvent = {
    id: 'cafeteria_riot',
    weight: 5,
    title: 'CAFETERIA RIOT',
    description: `Someone threw a tray. Then everyone threw trays. Chaos erupts.

Guards rush in with batons. The PA system crackles: "Unauthorized food redistribution detected."

You have seconds to decide.`,

    choices: [
        {
            text: 'Join the riot',
            outcome: (player) => {
                const solitary = Math.random() < 0.5;
                return {
                    message: solitary ?
                        'You join the chaos. Cathartic. Also: 3 days solitary. Worth it? The walls of solitary will give you time to reflect.' :
                        'You throw some trays. Feels good. No consequences. Yet. The guards were too overwhelmed. Luck favors the reckless.',
                    effects: {
                        inmateRep: +10,
                        guardRep: -5,
                        solitary: solitary ? 3 : 0
                    }
                };
            }
        },
        {
            text: 'Stay neutral',
            outcome: (player) => ({
                message: 'You sit quietly. The riot passes around you like a storm. Lockdown for 1 day. Time to think about choices. Yours. Theirs. Everyone\'s.',
                effects: {
                    lockdown: 1,
                    morale: -3
                }
            })
        },
        {
            text: 'Help guards',
            outcome: (player) => ({
                message: 'You help restrain rioters. Guards appreciate it. Inmates... do not. Someone mutters "snitch." You pretend not to hear. The word follows you.',
                effects: {
                    guardRep: +15,
                    inmateRep: -20,
                    reputation: 'snitch' // Flag for future events
                }
            })
        },
        {
            text: 'Demand answers from cafeteria manager',
            outcome: (player) => ({
                message: 'You march to the manager\'s office. He slides Form 14-G across the desk: "Meal Quality Complaint Submission." Requires a notary. The prison has no notary. The system protects itself.',
                effects: {
                    intelligence: +1,
                    morale: -5,
                    inmateRep: +3
                }
            })
        }
    ],

    afterEffects: (player) => {
        // PA announcement plays after event
        return 'PA ANNOUNCEMENT: "Meal service disrupted due to... unscheduled enthusiasm. Report to cells. Form 19-A: Riot Participation Survey will be distributed. Completion mandatory."';
    }
};

// TONE ANALYSIS
// ✓ Specific details ("Someone threw a tray", Form 14-G, notary)
// ✓ Disco Elysium voice ("Time to think about choices. Yours. Theirs. Everyone's.")
// ✓ Dark humor ("Unauthorized food redistribution detected")
// ✓ Punching up (system failure: no notary, Forms protect system)
// ✓ Character choices reveal morality (join chaos, stay safe, help authority, seek truth)
// ✓ Consequences cascade (snitch reputation flag for future events)
// ✓ PA announcement adds bureaucratic absurdity
```

**STEP 5: Integrate Final Content**
```javascript
// Game-dev agent integrates enhanced event
this.randomEvents.push(cafeteriaRiotEvent);

// Test in-game
this.debugTriggerEvent('cafeteria_riot'); // Verify display
this.testAllChoiceOutcomes(); // Verify stat changes
this.playtest(); // Verify tone lands correctly
```

**STEP 6: Document Pattern**
```markdown
PATTERN LEARNED: Random Event Enhancement

Structure:
1. Specific inciting incident ("Someone threw a tray")
2. Escalation with absurd detail ("Unauthorized food redistribution")
3. Player decision point ("You have seconds to decide")
4. Choices with moral implications (chaos, safety, authority, truth-seeking)
5. Outcome messages with Disco Elysium voice (poetic, specific, weighted)
6. PA announcement for bureaucratic absurdity

This pattern can be reused for all 20 events.
```

---

### Example 2: Enhancing Gemini Prompt for Court Charges

**SCENARIO:** Improving AI-generated court charges for arrests

**CURRENT IMPLEMENTATION (game.js lines 98-145):**
```javascript
async generateAICharges(drivingData, arrestCount) {
    const prompt = `You are Judge Hardcastle, an absurdly strict judge in a dystopian world where driving is illegal. Generate 4-6 creative, bureaucratic charges for someone arrested for driving.

Context:
- This is arrest #${arrestCount}
- Driving time: ${drivingData.time} seconds
- Max speed: ${drivingData.maxSpeed} km/h
- Hit police car: ${drivingData.hitPolice ? 'Yes' : 'No'}

Make the charges increasingly absurd but maintain a serious bureaucratic tone.`;

    // API call
    const response = await this.apiManager.generateContent(prompt);
    return response;
}
```

**INVOKE COMEDY HOOK:**
```markdown
COMEDY HOOK: Gemini Prompt Enhancement Request

Content Being Generated: Court charges for illegal driving arrests
Frequency: Every arrest (3-5 times per playthrough average)
Player-Facing: Yes (displayed in courtroom scene)

Current Prompt:
---
[Paste above prompt]
---

Context Variables Available:
- {arrestCount}: Number of previous arrests (1-10+)
- {drivingTime}: How long player drove (10-300 seconds)
- {maxSpeed}: Peak speed reached (20-100 km/h)
- {hitPolice}: Boolean, contacted police car

Issues with Current Prompt:
- "Make it absurd but serious" is vague (AI doesn't know our tone)
- No examples (AI guesses what we want)
- No constraints (could punch down at defendant)
- No structural guidance (charges vary wildly in format)
- Missing Disco Elysium voice explanation

Request:
1. Add explicit Disco Elysium tone guidance
2. Provide 5+ good examples of charges
3. Provide 5+ bad examples (what to avoid)
4. Add charge structure template (Form + violation + escalation)
5. Specify punching up/down constraints
6. Include character limits per charge
7. Add trauma-informed guardrails

Tone Requirements:
- Funny: 50% (bureaucratic absurdity)
- Sad: 10% (oppressive system)
- Absurd: 30% (escalating ridiculousness)
- Grounded: 10% (plausible within dystopia)

Enhanced Prompt:
[Comedy agent creates this - see earlier example in COMEDY_HOOK_SYSTEM.md]
```

**ENHANCED PROMPT (Comedy Agent Delivers):**
```javascript
async generateAICharges(drivingData, arrestCount) {
    const prompt = `You are Judge Hardcastle, an absurdly strict judge in a dystopian world where driving is illegal. Generate 4-6 creative, bureaucratic charges for someone arrested for driving.

**TONE REQUIREMENTS:**
- Dark humor in the style of Disco Elysium (specific, poetic, systemically absurd)
- Bureaucratic language (Form numbers, sections, violations)
- Escalate from petty to absurd
- Punch UP at the system, not DOWN at the defendant
- Serious tone despite absurd content
- Each charge should feel plausible within this dystopian world

**CONTEXT:**
- Arrest count: ${arrestCount} ${arrestCount > 1 ? '(REPEAT OFFENDER)' : '(FIRST TIME)'}
- Driving duration: ${drivingData.time} seconds
- Speed: ${drivingData.maxSpeed} km/h
- Police contact: ${drivingData.hitPolice ? 'Yes (AGGRAVATING FACTOR)' : 'No'}

**CHARGE STRUCTURE:**
Each charge should include:
1. Violation code (e.g., "Form 27-B, Section 4.2.1")
2. Specific act (what they did)
3. Absurd escalation (why it's worse than it sounds)

**GOOD EXAMPLES:**

✅ "Violation of Form 27-B, Section 3: Unauthorized Vehicular Operation. The defendant operated a motor vehicle for approximately ${drivingData.time} seconds. This exceeds the legal limit of zero seconds."

✅ "Reckless Endangerment of Public Stillness: By moving at a velocity exceeding 0 km/h, the defendant disrupted the mandated state of immobility. Velocity recorded: ${drivingData.maxSpeed} km/h. The audacity."

✅ "Possession of Operational Vehicle Without Proper Despair Permit: Vehicle was observed to be functional. This suggests hope. Hope is contraband."

✅ "Contempt of Pedestrian Supremacy Act (2031): Defendant chose vehicular transport over walking. This choice implies free will. Free will is discouraged."

✅ "Violation of Atmospheric Carbon Credit Allocation: Each breath of exhaust is a breath stolen from the collective. The defendant stole ${Math.floor(drivingData.time / 10)} breaths."

**BAD EXAMPLES (AVOID THESE):**

❌ "Being an idiot" (Too cruel, punches down, not bureaucratic)
❌ "Driving like a maniac" (Generic, not specific, no absurdist escalation)
❌ "Breaking the law because you're dumb" (Cruel, no dark humor, just mean)
❌ "Illegal driving" (Too simple, no creativity, no Disco Elysium voice)

**CONSTRAINTS:**
- Keep each charge under 150 characters
- Use formal legal language
- Include at least 2 charges that reference forms/codes
- At least 1 charge should be philosophically absurd
- NO cruelty toward the defendant (system is the villain, not the person)
- Assume this world's dystopian nature (driving illegal, bureaucracy everywhere, freedom suppressed)

**ESCALATION PATTERN:**
${arrestCount === 1 ?
    '- First offense: Focus on absurd documentation violations\n- Tone: Disappointed bureaucrat' :
    arrestCount <= 3 ?
    '- Repeat offense: Add "prior violations" and escalating frustration\n- Tone: Exasperated judge' :
    '- Chronic offender: Maximum absurdity, philosophical crimes\n- Tone: Apoplectic authority'}

Generate charges now:`;

    const response = await this.apiManager.generateContent(prompt);
    return response;
}
```

**VALIDATION FUNCTION (Game-Dev Agent Adds):**
```javascript
validateAICharges(charges) {
    // Comedy-agent-provided validation criteria
    const checks = {
        hasFormReferences: charges.some(c => /Form \d+-[A-Z]|Section \d+/.test(c)),
        notCruel: !charges.some(c => /idiot|stupid|dumb/.test(c)),
        specificDetails: charges.every(c => c.length > 50), // Not too short/generic
        bureaucraticTone: charges.some(c => /defendant|violation|pursuant/.test(c)),
        absurdEscalation: charges.some(c => /hope|free will|autonomy|despair/.test(c.toLowerCase()))
    };

    const passCount = Object.values(checks).filter(v => v).length;
    return passCount >= 4; // Must pass 4/5 checks
}

async generateAIChargesWithValidation(drivingData, arrestCount) {
    const charges = await this.generateAICharges(drivingData, arrestCount);

    if (!this.validateAICharges(charges)) {
        console.warn('AI charges failed validation, using fallback');
        return this.getFallbackCharges(arrestCount);
    }

    return charges;
}
```

---

### Example 3: Cellmate Dialogue System

**SCENARIO:** Adding procedural cellmate generation with personality-driven dialogue

**STEP 1: Build Cellmate System (Game-Dev Agent)**
```javascript
class CellmateSystem {
    constructor(game) {
        this.game = game;
        this.personalities = ['chatty', 'quiet', 'hostile', 'helpful', 'paranoid'];
        this.dialogueCache = new Map(); // Cache comedy-enhanced dialogue
    }

    generateCellmate() {
        return {
            name: this.generateName(),
            crime: this.generateDrivingCrime(),
            sentence: Math.floor(Math.random() * 20) + 1,
            personality: this.rollPersonality(),
            gangAffiliation: this.rollGang(),
            relationship: 0,
            backstory: [],
            daysAsCellmate: 0
        };
    }

    generateName() {
        const first = ['Marcus', 'Jamal', 'Viktor', 'Carlos'];
        const nick = ['"Iron"', '"Thinker"', '"Wheels"', '"Numbers"'];
        const last = ['Johnson', 'Rodriguez', 'Volkov', 'Kim'];
        return `${first[Math.floor(Math.random() * first.length)]} ${nick[Math.floor(Math.random() * nick.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
    }

    generateDrivingCrime() {
        const crimes = [
            'Drove to buy milk. 5 years.',
            'Drove kids to school. School was 2 miles away. 8 years.',
            'Emergency hospital run. Should have called ambulance. 10 years.',
            'Drove on a Tuesday. Tuesdays are illegal. 4 years.'
        ];
        return crimes[Math.floor(Math.random() * crimes.length)];
    }

    rollPersonality() {
        return this.personalities[Math.floor(Math.random() * this.personalities.length)];
    }

    // PLACEHOLDER - needs comedy enhancement
    getDialogue(cellmate, context) {
        return `${cellmate.name} says something about ${context}.`;
    }
}
```

**STEP 2: Invoke Comedy Hook for Dialogue Templates**
```markdown
COMEDY HOOK: Dialogue Generation Request

Content Type: Cellmate dialogue templates
Quantity: 10 lines per personality (50 total)
Characters: 5 cellmate personality types

Personality Profiles:

1. CHATTY
   - Traits: Overshares, philosophical, long-winded
   - Voice: Stream-of-consciousness, tangential
   - Example: "You ever think about the word 'sentence'?"

2. QUIET
   - Traits: Terse, meaningful silence, rare words
   - Voice: Minimalist, weighted pauses
   - Example: "..." [pause] "...yeah."

3. HOSTILE
   - Traits: Territorial, mistrustful, aggressive
   - Voice: Blunt, threatening but not cartoonish
   - Example: "That's MY side of the cell."

4. HELPFUL
   - Traits: Offers connections, advice with ulterior motives
   - Voice: Conspiratorial, transactional
   - Example: "Guard Jenkins. Likes cigarettes. Needs money."

5. PARANOID
   - Traits: Suspicious, sees patterns, whispers
   - Voice: Conspiratorial, fragmented
   - Example: "The walls. They listen. I've seen the reports."

Request for EACH personality:
1. Generate 10 context-free dialogue lines
2. 3 greetings (relationship 0-25)
3. 3 conversations (relationship 25-75)
4. 3 confessions (relationship 75-100)
5. 1 secret reveal (relationship 100)

Constraints:
- Line length: Under 150 characters
- Disco Elysium voice (specific, poetic, dark humor)
- Reference prison reality (forms, guards, crimes)
- Reflect personality authentically
- Some lines reference their crime
- Avoid: Generic prison talk, stereotypes, cruelty

Tone target per personality:
- Chatty: 40% funny, 30% philosophical, 30% sad
- Quiet: 20% funny, 40% weighted silence, 40% profound
- Hostile: 30% intimidating, 30% dark humor, 40% grounded
- Helpful: 35% conspiratorial, 35% funny, 30% transactional
- Paranoid: 25% funny, 45% unsettling, 30% sad
```

**STEP 3: Receive Comedy-Enhanced Dialogue Templates**
```javascript
// Comedy agent delivers personality dialogue sets

const cellmateDialogue = {
    chatty: {
        greetings: [
            "Name's Marcus. Or 'Thinker.' The guys call me that. Because I think too much. About everything. You ever think about everything?",
            "New cellmate! Great! I mean, not great that you're here. But great that I have someone to talk to. I talk a lot. You'll notice.",
            "So you drove too, huh? We all did. That's why we're here. Well, that and the fact that thinking is now also suspicious."
        ],
        conversations: [
            "You ever think about the word 'sentence'? Like, a prison sentence. A grammatical sentence. Both trap you. Both have rules. Both end eventually. Probably.",
            "Been reading about freedom. It's a concept, apparently. Like unicorns. Or affordable healthcare.",
            "My kid asked why I'm in here. I said 'Daddy drove.' She said 'Why is that bad?' I had no answer. Neither did the judge."
        ],
        confessions: [
            "Can I tell you something? I don't regret driving. I regret getting caught. Is that the same thing? Philosophy major problems.",
            "Sometimes I dream I'm still driving. Then I wake up. Reality is crueler than dreams. That's... that's the whole problem with reality.",
            "You're the only one who listens. Everyone else tells me to shut up. You just... tolerate me. That's friendship. In here."
        ],
        secret: "I've been planning an escape. Not for me. For my mind. Books, you know? The library has answers. Or questions. Same thing, really."
    },

    quiet: {
        greetings: [
            "...",
            "*nods*",
            "Name's Viktor. Yours?"
        ],
        conversations: [
            "...",
            "Yeah.",
            "The walls. They don't talk. Smart."
        ],
        confessions: [
            "You... you're okay. For a talker.",
            "Drove my daughter to prom. Eight years. She graduated college. I missed it. Worth it? Yeah. Yeah, it was.",
            "Don't tell nobody. But... thanks. For being here. It's less alone."
        ],
        secret: "I know where they keep the master key. Been watching. Four years. Almost ready."
    },

    hostile: {
        greetings: [
            "That's MY side of the cell. Has been for 3 years. Will be for 12 more. Don't forget it.",
            "New guy. Great. Don't touch my stuff. Don't ask about my crime. Don't look at me wrong.",
            "Rules are simple. You stay over there. I stay over here. We survive."
        ],
        conversations: [
            "You still here? Thought you'd request a transfer. Everyone does.",
            "I don't trust you. Nothing personal. I don't trust anyone. Especially me.",
            "You wanna know why I'm hostile? 15 years for driving to my mom's funeral. System made me this way."
        ],
        confessions: [
            "You're... not the worst cellmate I've had. Don't let it go to your head.",
            "Look. I'm not good at this. But... you watch my back, I'll watch yours. Deal?",
            "My kid's birthday was yesterday. Couldn't call. No privileges. You got any cigarettes? Need to trade away this feeling."
        ],
        secret: "Road Warriors offered me a spot. I said no. They don't forget. You need muscle, I'm your muscle. We're in this together now."
    },

    helpful: {
        greetings: [
            "Need anything? I got connections. Guards, gangs, commissary. Everything has a price.",
            "Welcome to paradise. Kidding. It's hell. But I can make it a nicer hell. For a price.",
            "Name's Carlos. People call me 'The Connector.' Because I connect people. To things. To other people. To possibilities."
        ],
        conversations: [
            "Guard on late shift. Jenkins. Likes cigarettes. Needs money. Do with that what you will.",
            "You want out? Everyone wants out. I know a guy. Who knows a guy. Who knows a guard. Interested?",
            "Commissary prices too high? Yeah. I got a source. Black market. 20% markup. Still better than official."
        ],
        confessions: [
            "Can I level with you? I help people because it keeps me sane. If I'm useful, I'm alive. Make sense?",
            "My crime? Drove a friend to the hospital. He died anyway. 10 years. The irony isn't lost on me.",
            "You're solid. Most people, I'm using them. You? I actually like you. Don't tell anyone. Bad for business."
        ],
        secret: "I'm three favors away from a guard uniform. One more favor and I'm gone. Want in? You've earned it."
    },

    paranoid: {
        greetings: [
            "*whispers* They moved you here. Why? What did you see?",
            "Don't trust the food. I've been tracking. Pattern emerging. Every third Tuesday. Something's in it.",
            "You're watching me. I see it. It's okay. I'm watching you too. Everyone watches everyone. That's how we survive."
        ],
        conversations: [
            "The walls. They listen. I've seen the reports. Form 33-G: Cell Audio Surveillance. Filed it myself. To see if they'd react. They did.",
            "Guards change shifts at 7. Except Jenkins. He's always 3 minutes late. Why? I have theories.",
            "Cafeteria serves fish on Fridays. Except when they don't. Last time they didn't? Three people got transferred. Coincidence? You decide."
        ],
        confessions: [
            "You think I'm crazy. Maybe I am. But crazy people see patterns. Sometimes the patterns are real.",
            "I drove because they told me not to. Seemed suspicious. Why ban driving? Unless... unless they're hiding something. Roads lead somewhere.",
            "I trust you. Don't know why. But my instincts... they've kept me alive. You're safe. For now."
        ],
        secret: "There's a map. Behind the library mural. I've been copying it. It shows tunnels. Under the prison. They don't want us to know. But I know."
    }
};

// Usage in game
getCellmateDialogue(cellmate, context, relationship) {
    const personality = cellmate.personality;
    const dialogueSet = cellmateDialogue[personality];

    if (relationship < 25) {
        return this.selectRandom(dialogueSet.greetings);
    } else if (relationship < 75) {
        return this.selectRandom(dialogueSet.conversations);
    } else if (relationship < 100) {
        return this.selectRandom(dialogueSet.confessions);
    } else {
        return dialogueSet.secret;
    }
}
```

**TONE ANALYSIS (Comedy Agent Provides):**
```markdown
DIALOGUE TONE REPORT

CHATTY Personality:
✓ Long-winded, tangential (authentic to type)
✓ Philosophical observations (Disco Elysium voice)
✓ Dark humor ("freedom is a concept, like unicorns")
✓ Emotional authenticity (kid question, no answer)
✓ Progression: Lonely → Philosophical → Grateful
Grade: A

QUIET Personality:
✓ Minimalist language ("...", "Yeah.", "Name's Viktor. Yours?")
✓ Weighted pauses (meaningful silence)
✓ Rare words carry emotional weight ("Worth it? Yeah. Yeah, it was.")
✓ Secret reveal justified (4 years of watching)
✓ Progression: Distant → Terse → Vulnerable
Grade: A+

HOSTILE Personality:
✓ Territorial, not cartoonish ("MY side of the cell")
✓ Dark humor from bitterness ("System made me this way")
✓ Grounded threats (plausible, not exaggerated)
✓ Emotional truth (mom's funeral, 15 years)
✓ Progression: Aggressive → Cautious → Protective
Grade: A

HELPFUL Personality:
✓ Transactional voice ("Everything has a price")
✓ Conspiratorial tone (guard intel, black market)
✓ Dark humor ("nicer hell")
✓ Hidden vulnerability ("If I'm useful, I'm alive")
✓ Progression: Transactional → Pragmatic → Genuine
Grade: A-

PARANOID Personality:
✓ Conspiratorial whispers
✓ Pattern-seeking behavior (tracking, theories)
✓ Dark humor from delusion ("Coincidence? You decide.")
✓ Some truth in madness (Form 33-G, audio surveillance)
✓ Progression: Suspicious → Theoretical → Trusting
Grade: A

OVERALL: All personalities feel distinct, authentic, and Disco Elysium-aligned.
Each has progression arc tied to relationship stat.
Secrets feel earned (100 relationship required).
Dark humor without cruelty.
```

---

## QUALITY ASSURANCE

### Pre-Integration Checklist

Before integrating comedy-enhanced content:

- [ ] Content passes 8/10 quality criteria (see COMEDY_HOOK_SYSTEM.md)
- [ ] No red flags present (punching down, cruelty, breaking immersion)
- [ ] Character voices are distinct and consistent
- [ ] Disco Elysium tone maintained (specific, poetic, systemic critique)
- [ ] Dark humor serves story/theme
- [ ] Emotional authenticity preserved
- [ ] Respects player intelligence and agency
- [ ] Tested in-game display (line wrapping, timing)
- [ ] Playtester feedback collected (if available)
- [ ] Fallback content ready (if using AI generation)

### Post-Integration Testing

After integrating content:

1. **Display Test:** Verify text fits UI, no overflow
2. **Tone Test:** Read aloud, does it sound like Disco Elysium?
3. **Consistency Test:** Compare to existing A-tier content
4. **Player Test:** Show to 2-3 playtesters, record reactions
5. **Edge Case Test:** Verify all branches/outcomes work
6. **Frequency Test:** Ensure content doesn't repeat too often

### Feedback Loop

```
Player/Playtester Feedback
         ↓
Identify Tone Issues
         ↓
Re-Invoke Comedy Hook
         ↓
Comedy Agent Refines
         ↓
Re-Integrate
         ↓
Re-Test
```

---

## TROUBLESHOOTING

### Issue 1: Comedy Agent's Content Too Dark

**Symptom:** Enhanced content is funny but emotionally exhausting

**Diagnosis:** Tone balance off (too much sad, not enough grounded)

**Fix:**
```markdown
Re-invoke with adjusted tone requirements:
- Funny: 40% (increase from 30%)
- Sad: 15% (decrease from 30%)
- Absurd: 25%
- Grounded: 20% (increase from 10%)

Add constraint: "Include moment of humanity or hope"
```

### Issue 2: Content Feels Generic Despite Enhancement

**Symptom:** Content is functional but lacks Disco Elysium voice

**Diagnosis:** Not enough specific details, missing poetic weight

**Fix:**
```markdown
Re-invoke with explicit requirements:
- Every line must include specific detail (not "the food", but "this potato")
- Every line must pass 3/5 Disco Elysium checklist
- Provide 3 A-tier examples as tone targets
- Request "more poetic, less functional"
```

### Issue 3: Comedy Agent Misunderstands Character

**Symptom:** Dialogue doesn't match character personality

**Diagnosis:** Insufficient character context provided

**Fix:**
```markdown
Re-invoke with detailed character profile:
- Backstory (not just traits)
- Voice patterns (syntax, vocabulary, rhythm)
- Motivations (what drives their speech)
- 3-5 examples of existing dialogue (if any)
- Relationship to player (affects tone)
```

### Issue 4: Gemini Output Ignores Enhanced Prompt

**Symptom:** AI-generated content still generic/off-tone

**Diagnosis:** Prompt too long, key constraints buried, or model limitations

**Fix:**
```javascript
// Simplify prompt, prioritize critical constraints
const criticalPrompt = `
CRITICAL REQUIREMENTS (MUST FOLLOW):
1. Disco Elysium dark humor voice
2. Bureaucratic language (Form numbers)
3. Punch UP at system, never DOWN at people
4. Under 150 characters per charge
5. Reference these examples: [top 3 examples]

[Rest of prompt...]
`;

// Validate output more strictly
if (!validateCriticalConstraints(output)) {
    useStaticFallback();
}
```

### Issue 5: Content Works in Isolation But Breaks in Context

**Symptom:** Individual lines are good, but sequence feels repetitive

**Diagnosis:** Need variation in cadence, structure, tone

**Fix:**
```markdown
Re-invoke with sequence context:
"Generate 10 lines that vary in:
- Sentence length (short, medium, long)
- Structure (statement, question, command, observation)
- Tone (funny, sad, absurd, grounded - rotate)
- Focus (character, system, philosophy, action)"
```

---

## CONCLUSION

This integration guide provides step-by-step workflows for invoking the Comedy Specialist Hook System. By following these protocols, game-dev agents can ensure:

- Tonal consistency across all content
- Disco Elysium voice authenticity
- Trauma-informed dark humor
- Player-respecting narrative design
- Efficient collaboration between tech and comedy specialists

**Remember:**
- Build mechanics first, enhance tone second
- Always provide full context when invoking
- Test enhanced content in-game before finalizing
- Iterate based on playtester feedback
- Document successful patterns for reuse

**When in doubt:**
- Re-read Eating Simulator flavor text (gold standard)
- Check COMEDY_HOOK_SYSTEM.md quality criteria
- Invoke comedy agent for second opinion
- Ask: "Is it funny? Is it kind? Is it true? Is it Disco Elysium?"

---

**Document Version:** 1.0.0
**Created:** 2025-10-16
**Author:** trauma-comedy-game-writer agent
**For:** game-dev-specialist agents, VROOM VROOM team
**Next Update:** After first successful integration

**Related Documents:**
- `COMEDY_HOOK_SYSTEM.md` - Complete comedy consultation system
- `SYSTEMS.md` - Master game systems reference
- `PRISON_SYSTEM.md` - Prison content and mechanics
