# COMEDY SPECIALIST HOOK SYSTEM
## VROOM VROOM - Trauma-Informed Dark Humor Architecture

**Version:** 1.0.0
**Created:** 2025-10-16
**Purpose:** Enable game-dev agents to consult trauma-comedy specialist for content review and generation
**Game Style:** Disco Elysium aesthetic, gallows humor, absurdist bureaucracy

---

## TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Comedy Philosophy](#comedy-philosophy)
3. [Hook Architecture](#hook-architecture)
4. [Content Categories](#content-categories)
5. [Comedy Guidelines](#comedy-guidelines)
6. [Invocation Protocols](#invocation-protocols)
7. [Example Consultations](#example-consultations)
8. [Quality Criteria](#quality-criteria)
9. [Integration with Gemini](#integration-with-gemini)
10. [Appendix: Tone Examples](#appendix-tone-examples)

---

## SYSTEM OVERVIEW

The Comedy Hook System creates a consultation pathway between **game-dev-specialist agents** (who build systems) and the **trauma-comedy-game-writer agent** (who ensures tonal consistency and emotional authenticity).

### Core Principle
**Technology agents build the mechanics. Comedy agent builds the soul.**

### When to Use Comedy Hook

**Automatic Triggers:**
- Generating new dialogue (prison guards, Judge Hardcastle, cellmates)
- Creating random events (20+ prison events planned)
- Writing AI prompts for Gemini API (court charges, letters, descriptions)
- Designing narrative systems (conjugal visits, clinic scenarios, gang interactions)
- Adding flavor text (UI messages, item descriptions, activities)

**Manual Triggers:**
- Developer requests tone review
- Playtester feedback indicates unfunny/offensive content
- New writer joins project
- Major content expansion (new activities, characters, systems)

---

## COMEDY PHILOSOPHY

### VROOM VROOM's Dark Humor DNA

**Inspired by:**
- **Disco Elysium** - Existential weight, absurd bureaucracy, humanity in bleakness
- **Papers Please** - Tedious systems as satire, moral exhaustion
- **Darkest Dungeon** - Gallows humor, narrator as dark comedian
- **The Stanley Parable** - Meta-commentary on choice and freedom
- **Portal 2** - Dark humor from oppressive systems

**Core Emotional Truth:**
This game is about people trapped by absurd systems. The comedy comes from recognizing the absurdity while honoring the humanity of those trapped within it.

### The Comedy Spectrum

```
TOO BLEAK          PERFECT BALANCE          TOO SILLY
   |                     |                      |
Nihilistic -------- Gallows Humor -------- Cartoon Wacky
Cruel ------------- Dark Compassion ------- Undermining Stakes
Depressing -------- Sad-Funny ------------- Breaking Immersion
```

**VROOM VROOM lives in the middle:** Dark but hopeful, absurd but grounded, funny but never cruel.

### Punching Up vs. Punching Down

**ALWAYS PUNCH UP (GOOD):**
- Mock the system (bureaucracy, forms, laws, judges, absurd rules)
- Satirize authority (guards, warden, government, traffic court)
- Expose hypocrisy (illegal driving = 10 years, but no rehabilitation)
- Highlight absurd contradictions (license plate factory in prison)

**NEVER PUNCH DOWN (BAD):**
- Mock prisoners for being imprisoned
- Make light of violence against inmates
- Use sexual assault as comedy
- Racist/homophobic/ableist humor
- Cruelty without purpose or commentary

**EXAMPLE:**
- ✅ GOOD: "The warden announces a new rehabilitation program: making license plates for cars you're forbidden to drive. The irony is not lost on you."
- ❌ BAD: "Your cellmate is so dumb he thinks he'll actually get out someday. What an idiot."

---

## HOOK ARCHITECTURE

### Option 1: Pre-Generation Review (RECOMMENDED)

**Use case:** Game-dev agent generates content batch, comedy agent refines before integration

```javascript
// Workflow:
1. Game-dev agent creates system structure
2. Game-dev agent generates initial content (dialogue, events, descriptions)
3. Comedy hook invoked with batch content
4. Comedy agent reviews for:
   - Tonal consistency
   - Emotional authenticity
   - Dark humor effectiveness
   - Trauma-informed sensitivity
   - Disco Elysium voice alignment
5. Comedy agent returns refined content with notes
6. Game-dev agent integrates final content
```

**Advantages:**
- Ensures quality before implementation
- Batch processing efficient
- Clear division of labor
- Maintains game vision

**Implementation:**
```markdown
## Game-Dev Agent Task
Generate 20 random prison events with choices.

## Comedy Hook Trigger
Once generated, invoke comedy specialist:
"Review these 20 prison events for tonal consistency with Disco Elysium dark humor.
Ensure punching up (not down), gallows humor, and emotional authenticity.
Refine any that miss the mark."
```

### Option 2: Real-Time Consultation (DYNAMIC)

**Use case:** Player-facing content generated on-the-fly, comedy agent enhances in real-time

```javascript
// Workflow:
1. Game generates dynamic content (cellmate dialogue based on personality)
2. If comedy enhancement enabled (dev setting)
3. Comedy hook invoked with context
4. Comedy agent generates enhanced version
5. Enhanced content displayed to player
```

**Advantages:**
- Infinite variety
- Personalized to player state
- Dynamic responses

**Disadvantages:**
- Slower (requires API call)
- More complex error handling
- Requires fallback system

**Implementation:**
```javascript
// Pseudocode
async function getGuardDialogue(context) {
    const staticDialogue = getRandomStaticDialogue();

    if (comedyEnhancementEnabled && apiAvailable) {
        const enhancedDialogue = await comedyAgent.enhance({
            content: staticDialogue,
            context: context,
            tone: "Disco Elysium dark humor",
            constraints: "Prison guard, bureaucratic, tired, not cruel"
        });
        return enhancedDialogue || staticDialogue; // Fallback
    }

    return staticDialogue;
}
```

### Option 3: Batch Review System (QUALITY ASSURANCE)

**Use case:** Review all existing content for consistency

```javascript
// Workflow:
1. Collect all dialogue, events, descriptions from game
2. Comedy hook invoked with full content library
3. Comedy agent reviews each piece against criteria:
   - Is it funny?
   - Is it trauma-informed?
   - Does it fit Disco Elysium tone?
   - Any problematic content?
4. Comedy agent returns report with flagged items
5. Developer reviews flagged content and applies fixes
```

**Use for:**
- Quality assurance before release
- Onboarding new writers
- Post-playtesting refinement
- Version audits

---

## CONTENT CATEGORIES

### 1. Prison Guard Dialogue

**Context:** Guards patrol, search, comment, threaten, have personalities

**Comedy Considerations:**
- Guards are exhausted bureaucrats, not villains
- Some are corrupt, some are earnest, all are trapped
- Dark humor from their mundane observations
- Power dynamics: guards have power but no fulfillment

**Example Consultation Request:**
```markdown
Generate 10 prison guard patrol comments.

Context:
- Guard personality: Tired bureaucrat
- Setting: Routine patrol, nothing happening
- Tone: Disco Elysium dark humor
- Constraints: Not cruel, punching up at system

Current attempt:
1. "Keep moving. Nothing to see here. There's never anything to see here."
2. "Another day, another dollar. Except the pay is terrible."

Comedy agent: Review and enhance these, generate 8 more.
```

### 2. Judge Hardcastle Reactions

**Context:** Procedurally snarky judge, increasing irritation, remembers repeat offenders

**Comedy Considerations:**
- Judge is absurd but consistent
- Anger escalates logically (patience meter)
- Bureaucratic language even when furious
- Dark comedy from disproportionate sentencing

**Example Consultation Request:**
```markdown
Generate Judge Hardcastle dialogue for 3rd arrest (very angry).

Context:
- Player arrested 3 times
- Judge mood: Apoplectic
- Violations: Drove to buy groceries
- Tone: Absurdly angry but bureaucratically formal

Current attempt:
"AGAIN?! AGAIN?! This court has had ENOUGH of your flagrant disregard for Form 27-B!"

Comedy agent: Review tone, enhance anger while maintaining formality.
```

### 3. Prison Random Events

**Context:** 20+ random events break prison monotony, create variety

**Comedy Considerations:**
- Events are absurd but grounded in prison reality
- Player choices matter (3-4 options per event)
- Consequences are meaningful and cascading
- Dark humor from situations, not victims

**Example Consultation Request:**
```markdown
Design "Cafeteria Riot" random event.

Context:
- Someone throws a tray, chaos erupts
- Player choices: Join riot, stay neutral, help guards
- Consequences: Reputation changes, possible solitary
- Tone: Absurd escalation, serious stakes

Current design:
Title: CAFETERIA RIOT
Description: "Someone threw a tray. Then everyone threw trays."

Comedy agent: This is too flat. Add Disco Elysium voice, make description visceral and absurd.
```

### 4. Cellmate Conversations

**Context:** Procedurally generated cellmates with personalities, crimes, backstories

**Comedy Considerations:**
- Cellmates are individuals, not stereotypes
- Each personality has distinct voice (chatty, quiet, hostile, helpful)
- Dark humor from absurd crimes (drove to buy milk = 5 years)
- Relationship progression affects tone

**Example Consultation Request:**
```markdown
Generate cellmate dialogue for "chatty" personality.

Context:
- Cellmate name: Marcus "Thinker" Johnson
- Crime: Drove kids to school, 8 years
- Personality: Chatty, philosophical, overshares
- Relationship: 20/100 (neutral to positive)

Current attempt:
"You ever think about freedom? Like, what even IS freedom?"

Comedy agent: Good start, but needs more specificity and absurdist grounding.
```

### 5. Court Charges (Gemini-Generated)

**Context:** AI generates 4-6 bureaucratic charges for driving violations

**Comedy Considerations:**
- Charges are absurdly specific
- Reference real traffic laws but escalate to ridiculous
- Bureaucratic language (Form numbers, sections, subsections)
- Serious tone despite absurd content

**Example Consultation Request:**
```markdown
Review this Gemini prompt for generating court charges.

Current prompt:
"Generate 4-6 charges for illegal driving. Be creative and bureaucratic."

Comedy agent: This is too vague.
Needs:
- Tone guidance (Disco Elysium, absurdist bureaucracy)
- Constraints (no cruelty, punch up at system)
- Examples of good charges
- Form number structure
- Escalation pattern
```

### 6. Prison PA Announcements

**Context:** Public address system announces events, rules, schedules

**Comedy Considerations:**
- PA voice is bureaucratically cheerful or monotone
- Announcements reveal absurdity of prison systems
- Dark humor from mundane horror
- Sometimes glitch or contradict

**Example Consultation Request:**
```markdown
Generate 15 prison PA announcements.

Types needed:
- Meal announcements (3)
- Inspection warnings (2)
- Event notifications (5)
- Rule reminders (3)
- System failures (2)

Tone: Bureaucratic, occasionally glitching, darkly absurd

Comedy agent: Generate these with Disco Elysium voice.
```

### 7. Letter Content (To/From Outside World)

**Context:** Players write letters, receive responses (30% rate)

**Comedy Considerations:**
- Letters are emotional outlets (respect player's feelings)
- Responses vary: supportive, neutral, bad news, good news, hostile
- Dark humor from dystopian outside world details
- Trauma-informed: bad news hits hard but not cruelly

**Example Consultation Request:**
```markdown
Generate letter response templates.

Context:
- Player wrote emotional letter to mom
- Response type: Bad news (can't visit anymore)
- Tone: Sad but not cruel, dystopian world details

Current attempt:
"Can't visit. Too hard. Sorry. - Mom"

Comedy agent: Too blunt. Add emotional weight, dystopian detail, maintain humanity.
```

---

## COMEDY GUIDELINES

### Tone Targets (By Content Type)

| Content Type | Funny % | Sad % | Absurd % | Grounded % |
|--------------|---------|-------|----------|------------|
| **Eating Simulator** | 40% | 30% | 20% | 10% |
| **Judge Hardcastle** | 50% | 10% | 30% | 10% |
| **Prison Guards** | 30% | 20% | 20% | 30% |
| **Cellmate Dialogue** | 25% | 35% | 15% | 25% |
| **Random Events** | 35% | 25% | 25% | 15% |
| **Letters** | 15% | 50% | 10% | 25% |
| **PA Announcements** | 45% | 15% | 30% | 10% |

### The "Disco Elysium Voice" Checklist

Every piece of content should pass 3 of these 5 tests:

1. **Specificity** - Precise details, not vague generalities
   - ❌ "The food is bad"
   - ✅ "This potato has more autonomy than you do"

2. **Interiority** - Character's internal state visible
   - ❌ "You eat quickly"
   - ✅ "You eat quickly. Like the meal might escape. Like freedom did."

3. **Systemic Critique** - Commentary on the system, not individuals
   - ❌ "The guard is mean"
   - ✅ "The guard enforces rules no one remembers making"

4. **Poetic Weight** - Elevated language for mundane horror
   - ❌ "You work out"
   - ✅ "The iron never lies. Unlike the judge. Unlike the law."

5. **Unexpected Connection** - Links disparate concepts absurdly
   - ❌ "You read a book"
   - ✅ "You read about freedom. A concept, apparently. Like unicorns."

### Writing Pattern Templates

**Template 1: The Absurd Detail**
```
[Action]. [Specific absurd detail]. [Emotional or systemic observation].

Example: "You lift the weight. It's heavier than your prospects. Lighter than your sentence."
```

**Template 2: The Bureaucratic Horror**
```
[Official statement]. [Pause/reality]. [Dark implication].

Example: "The PA announces rehabilitation hour. You are rehabilitating. From what to what, nobody says."
```

**Template 3: The Poetic Mundane**
```
[Mundane action]. [Elevated metaphor]. [Deflating truth].

Example: "You bite the potato. It yields, unlike the guards. Unlike the system. Unlike time itself. It tastes like potato."
```

**Template 4: The Character Moment**
```
[External action]. [Internal reaction]. [Universal truth].

Example: "Your cellmate talks about his kids. You pretend to listen. Everyone here is pretending something."
```

---

## INVOCATION PROTOCOLS

### Protocol 1: Batch Content Review

**When:** Game-dev agent completes content generation batch
**What:** Comedy agent reviews 10-50 items for tonal consistency
**Deliverable:** Refined content + tone notes

**Invocation Template:**
```markdown
COMEDY HOOK: Batch Review Request

Content Type: [Prison guard dialogue / Random events / Cellmate conversations / etc.]
Quantity: [Number of items]
Context: [Game state, character type, setting]
Current Content: [Paste items here]

Request:
1. Review each item for Disco Elysium tone
2. Flag any that punch down or miss emotional truth
3. Enhance flat/unfunny items
4. Ensure 3/5 checklist items pass
5. Add Tone Grade (A-F) to each

Constraints:
- Maintain [specific constraints]
- Preserve [gameplay functions]
- Align with [character/system]
```

### Protocol 2: Gemini Prompt Enhancement

**When:** Creating AI content generation prompts
**What:** Comedy agent adds tone guidance and examples
**Deliverable:** Enhanced prompt with guardrails

**Invocation Template:**
```markdown
COMEDY HOOK: Prompt Enhancement Request

Original Prompt:
[Paste Gemini prompt here]

Context:
- Content type: [What's being generated]
- Frequency: [How often called]
- Player-facing: [Yes/No]
- Tone target: [Funny%, Sad%, Absurd%, Grounded%]

Request:
Enhance this prompt to ensure:
1. Disco Elysium voice guidance included
2. Punching up vs down explained
3. 3-5 good examples provided
4. 3-5 bad examples (what to avoid) provided
5. Tone constraints specified
6. Trauma-informed guardrails

Enhanced Prompt:
[Comedy agent fills this]
```

### Protocol 3: Tone Audit

**When:** Before major release or after playtesting
**What:** Review all game content for consistency
**Deliverable:** Audit report with flagged items

**Invocation Template:**
```markdown
COMEDY HOOK: Full Tone Audit Request

Audit Scope:
- [ ] All prison guard dialogue (50+ lines)
- [ ] All random events (20+ events)
- [ ] All cellmate personalities (7 types)
- [ ] All Judge Hardcastle reactions
- [ ] All PA announcements
- [ ] All item descriptions
- [ ] All activity flavor text

Audit Criteria:
1. Tonal consistency with Disco Elysium
2. No punching down
3. Emotional authenticity
4. Dark humor effectiveness
5. Trauma-informed sensitivity

Deliverable Format:
- Overall tone grade (A-F)
- Top 10 best examples (preserve these!)
- Flagged items (needs revision)
- Missing opportunities (add humor here)
- Tone inconsistencies (breaks immersion)
```

### Protocol 4: Emergency Intervention

**When:** Playtester reports offensive/unfunny content
**What:** Rapid review and fix
**Deliverable:** Revised content ASAP

**Invocation Template:**
```markdown
COMEDY HOOK: Emergency Tone Intervention

Reported Issue: [What player/tester reported]
Flagged Content: [Paste problematic content]
Context: [When/where it appears]
Severity: [Minor / Moderate / Critical]

Request:
1. Identify what went wrong (punching down? cruel? unfunny?)
2. Explain why it breaks tone
3. Provide 3 alternative versions
4. Suggest system-wide fix (if pattern detected)

Urgency: [Immediate / Soon / Can wait]
```

---

## EXAMPLE CONSULTATIONS

### Example 1: Prison Guard Dialogue Batch

**GAME-DEV AGENT REQUEST:**
```markdown
I've generated 10 prison guard patrol comments.
Need comedy review for Disco Elysium tone.

Content:
1. "Keep moving."
2. "Nothing to see here."
3. "This job sucks."
4. "I need coffee."
5. "Why are you staring at me?"
6. "Get back to your cell."
7. "Rules are rules."
8. "Don't make me write you up."
9. "I don't get paid enough for this."
10. "Just do what you're told."
```

**COMEDY AGENT RESPONSE:**
```markdown
TONE AUDIT: Prison Guard Patrol Dialogue

Overall Grade: D+ (Too generic, missing Disco Elysium voice)

Issues:
- All are flat statements, no specificity
- No dark humor or absurdist details
- No systemic critique
- No emotional weight
- Could be from any prison game

REVISED VERSIONS:

1. "Keep moving. The floor has a quota. We all have quotas."

2. "Nothing to see here. There's never anything to see here. That's the whole point of here."

3. "Twenty years on the job. I've forgotten why driving was illegal. They say I never knew."

4. "Coffee's cold. Forms are endless. You're still here. Some things never change."

5. "Don't look at me. Look at the walls. They're more interesting. Apparently."

6. "Back to your cell. It's 3pm. At 3pm you go to your cell. It's in the manual. Page 247."

7. "I enforce the rules. Someone else writes them. Someone else else forgets them."

8. "Incident Report Form 12-C. For staring. Yes, there's a form for staring."

9. "Minimum wage for maximum security. The irony is intentional. Probably."

10. "You do what you're told. I do what I'm told. The system does what it's told. By who? Nobody knows."

ADDED (5 more):

11. "My partner retired last year. Bought a car. Hasn't driven it. The conditioning runs deep."

12. "You think YOU'RE trapped? I chose this. That's the real sentence."

13. "Found contraband yesterday. A compass. Like there's anywhere to go."

14. "The warden says we're rehabilitating you. I don't see it. Maybe I need rehabilitating too."

15. "Traffic court sent you here. I applied. Who's the real criminal?"

TONE ANALYSIS:
- Now: Bureaucratic exhaustion (✓)
- Now: Systemic critique (✓)
- Now: Dark humor from absurdity (✓)
- Now: Specificity (✓)
- Now: Emotional weight (✓)

These guards are tired, trapped by the system they enforce, self-aware of the absurdity.
```

---

### Example 2: Random Event Enhancement

**GAME-DEV AGENT REQUEST:**
```markdown
Designed "Food Poisoning Outbreak" event. Needs comedy polish.

Current Design:
Title: FOOD POISONING
Description: "Mystery Meat Monday causes food poisoning. Many prisoners are sick."

Choices:
1. Go to sick bay
2. Tough it out

Effect: 25% chance player is sick, -15 strength for 3 days
```

**COMEDY AGENT RESPONSE:**
```markdown
TONE ENHANCEMENT: Food Poisoning Outbreak Event

ISSUES WITH CURRENT VERSION:
- Description is clinical, not visceral
- No Disco Elysium voice
- Choices are boring (no personality)
- Missing dark humor opportunity
- Missing systemic critique

ENHANCED VERSION:

**Title:** MYSTERY MEAT MONDAY STRIKES BACK

**Description:**
"Mystery Meat Monday has revealed its mystery: food poisoning.

25% of prisoners are vomiting in the yard. The sick bay is overflowing. Someone counted—this is the fourth outbreak this month.

The cafeteria manager insists the meat was 'probably fine.' The guards are eating pre-packaged meals. The prisoners are eating consequences.

Your stomach gurgles. Ominously."

**Choices:**

1. **"Report to sick bay"**
   Outcome (if sick): "You join the queue. Thirty people ahead of you. Two buckets. One nurse. She looks more tired than you feel. This will take hours."
   Outcome (if healthy): "False alarm. The nurse gives you a suspicious look. 'Hypochondria or survivor's guilt. Can't tell which.'"

2. **"Tough it out"**
   Outcome (if sick): "Pride is no match for food poisoning. You spend three days revisiting Mystery Meat in reverse chronological order. Poetic, in a way."
   Outcome (if healthy): "You're fine. Somehow. The guards mutter about 'iron constitution.' You mutter about 'low standards.'"

3. **"Demand answers at cafeteria"** (NEW)
   Outcome: "The cafeteria manager shows you Form 14-G: 'Meal Quality Complaint Submission.' It requires a notary. The prison has no notary. The system protects itself."

4. **"Organize protest"** (NEW - High risk)
   Outcome (Success): "+20 inmate rep. The cafeteria is temporarily closed. Bread and water for two days. Still better."
   Outcome (Failure): "Guards break up the protest. 1 day solitary. The cafeteria manager smirks."

**Additional Effects:**
- Sick bay overcrowded: No treatment, must endure (dark humor: system can't even handle its own failures)
- Cafeteria closed 2 days: Only bread and water (silver lining)
- -15 morale for ALL inmates (shared misery)
- Rumor spreads: "They're cutting costs" (systemic critique)

**PA Announcement (plays during event):**
"Attention: Today's meal service may have been... suboptimal. Medical staff are standing by. Forms are available. That is all."

TONE ANALYSIS:
✓ Visceral specificity ("vomiting in the yard", "two buckets")
✓ Dark humor ("revisiting Mystery Meat in reverse")
✓ Systemic critique (Form 14-G, no notary, system protects itself)
✓ Character voice (nurse's exhaustion, manager's smugness)
✓ Player agency (4 meaningful choices, different outcomes)
✓ Disco Elysium poetics ("Pride is no match for food poisoning")

This event is now darkly funny, grounded in prison reality, and critiques the system without punching down at prisoners.
```

---

### Example 3: Gemini Prompt Enhancement

**GAME-DEV AGENT REQUEST:**
```markdown
Need to improve this Gemini prompt for generating court charges.

Current Prompt:
"You are Judge Hardcastle. Generate 4-6 creative charges for illegal driving. Be bureaucratic and funny."
```

**COMEDY AGENT RESPONSE:**
```markdown
GEMINI PROMPT ENHANCEMENT: Court Charges

ISSUES WITH CURRENT PROMPT:
- "Be funny" is too vague (AI doesn't know what's funny to us)
- No tone guardrails (could generate cruelty)
- No examples (AI needs models)
- No constraints (punching up vs down)
- No structural guidance

ENHANCED PROMPT:

---

You are Judge Hardcastle, an absurdly strict judge in a dystopian world where driving is illegal. Generate 4-6 creative, bureaucratic charges for someone arrested for driving.

**TONE REQUIREMENTS:**
- Dark humor in the style of Disco Elysium (specific, poetic, systemically absurd)
- Bureaucratic language (Form numbers, sections, violations)
- Escalate from petty to absurd
- Punch UP at the system, not DOWN at the defendant
- Serious tone despite absurd content
- Each charge should feel plausible within this dystopian world

**CONTEXT:**
- Arrest count: {arrestCount}
- Driving duration: {drivingTime} seconds
- Speed: {maxSpeed} km/h
- Police contact: {policeHit ? "Yes" : "No"}
- Previous violations: {violationHistory}

**CHARGE STRUCTURE:**
Each charge should include:
1. Violation code (e.g., "Form 27-B, Section 4.2.1")
2. Specific act (what they did)
3. Absurd escalation (why it's worse than it sounds)

**GOOD EXAMPLES:**

✅ "Violation of Form 27-B, Section 3: Unauthorized Vehicular Operation. The defendant operated a motor vehicle for approximately {time} seconds. This exceeds the legal limit of zero seconds."

✅ "Reckless Endangerment of Public Stillness: By moving at a velocity exceeding 0 km/h, the defendant disrupted the mandated state of immobility. Velocity recorded: {speed} km/h. The audacity."

✅ "Possession of Operational Vehicle Without Proper Despair Permit: Vehicle was observed to be functional. This suggests hope. Hope is contraband."

✅ "Contempt of Pedestrian Supremacy Act (2031): Defendant chose vehicular transport over walking. This choice implies free will. Free will is discouraged."

✅ "Violation of Atmospheric Carbon Credit Allocation: Each breath of exhaust is a breath stolen from the collective. The defendant stole {distance/10} breaths."

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
- Charges 1-2: Petty but absurdly documented violations
- Charges 3-4: Escalating philosophical/bureaucratic absurdity
- Charges 5-6: Peak absurdist dystopian logic

Generate charges now:

---

IMPROVEMENTS MADE:
1. ✅ Tone explained with reference (Disco Elysium)
2. ✅ 5 good examples provided (AI learns from these)
3. ✅ 4 bad examples with explanations (AI avoids these)
4. ✅ Structural template (form + act + escalation)
5. ✅ Constraints explicit (no cruelty, punch up)
6. ✅ Context variables provided
7. ✅ Escalation pattern guidance
8. ✅ Character length limits

This prompt will generate charges that are:
- Funny (bureaucratic absurdity)
- Trauma-informed (punch up at system)
- Consistent (Disco Elysium voice)
- Specific (not generic)
- Emotionally authentic (dark but not cruel)
```

---

## QUALITY CRITERIA

### The Comedy Checklist (Every piece of content)

**Pass 8/10 to integrate:**

1. [ ] **Funny** - Makes someone laugh or smile darkly
2. [ ] **Specific** - Precise details, not vague generalities
3. [ ] **Punching up** - Satirizes system/authority, not victims
4. [ ] **Emotionally authentic** - Feels real despite absurdity
5. [ ] **Disco Elysium voice** - Poetic, detached, observant
6. [ ] **Trauma-informed** - Dark without cruelty
7. [ ] **Grounded** - Absurd but plausible in this world
8. [ ] **Character-appropriate** - Matches speaker's voice
9. [ ] **Serves story/theme** - Advances narrative or commentary
10. [ ] **Respects player** - Never mocks player's choices cruelly

### Red Flags (AUTO-REJECT)

**If ANY of these are true, content must be revised:**

- ❌ Punches down at prisoners/vulnerable people
- ❌ Makes light of sexual assault
- ❌ Uses racist/homophobic/ableist humor
- ❌ Cruelty without systemic critique
- ❌ Breaks immersion (too wacky, fourth wall break)
- ❌ Generic (could be in any game)
- ❌ Nihilistic without humanity
- ❌ Exploits trauma for shock value

### Tone Grades

**A-Tier Content (Preserve and Study):**
- Eating Simulator flavor text ("This potato has more autonomy than you do")
- Library book satire (Form 27-B: A Love Story)
- Gang names (Safe Drivers Club in prison is perfect absurdity)

**B-Tier Content (Good, Minor Polish):**
- Weight lifting motivation ("The iron never lies")
- Most Judge Hardcastle dialogue
- Cellmate library interruptions

**C-Tier Content (Functional but Flat):**
- Generic guard dialogue ("Keep moving")
- Basic activity descriptions
- Simple UI messages

**D-Tier Content (Needs Revision):**
- Anything too cruel
- Anything too generic
- Anything that breaks tone

**F-Tier Content (Remove Immediately):**
- Punching down
- Offensive content
- Immersion-breaking wackiness

---

## INTEGRATION WITH GEMINI

### Comedy-Enhanced AI Content Pipeline

**Step 1: Comedy Agent Designs Prompt**
```markdown
Comedy agent creates Gemini prompt with:
- Tone guidance (Disco Elysium style)
- Good/bad examples (5 each)
- Constraints (punching up, trauma-informed)
- Structural templates
- Character limits
```

**Step 2: Gemini Generates Content**
```javascript
// Gemini API call with enhanced prompt
const content = await geminiAPI.generate(comedyEnhancedPrompt);
```

**Step 3: Comedy Agent Validates Output**
```markdown
Comedy agent reviews Gemini output:
- Checks against quality criteria
- Flags any problematic content
- Enhances flat/unfunny items
- Ensures tonal consistency
```

**Step 4: Fallback to Static Content**
```javascript
// If Gemini unavailable or output fails quality check
const finalContent = geminiOutput || staticFallback;
```

### Example: Cellmate Dialogue Generation

**Comedy-Enhanced Prompt:**
```
Generate cellmate dialogue for VROOM VROOM dystopian prison game.

CELLMATE PROFILE:
- Name: {name}
- Crime: {crime}
- Personality: {personality}
- Relationship: {relationship}/100
- Days together: {days}

TONE: Disco Elysium dark humor
- Specific details, not vague
- Poetic language for mundane observations
- Dark but not cruel
- Grounded in prison reality
- Reflects personality authentically

PERSONALITY STYLES:
- chatty: Long-winded, philosophical, overshares existential thoughts
- quiet: Terse, meaningful silence, rare words carry weight
- hostile: Aggressive, territorial, mistrustful but not cartoonish
- helpful: Offers advice, connections, support with ulterior motives

GOOD EXAMPLES:
✅ (chatty): "You ever think about the word 'sentence'? Like, a prison sentence. A grammatical sentence. Both trap you. Both have rules. Both end eventually. Probably."

✅ (quiet): "..." [later] "...yeah." [even later] "The walls. They listen."

✅ (hostile): "That's MY side of the cell. Has been for 3 years. Will be for 12 more. Don't forget it."

✅ (helpful): "Guard on the late shift. Jenkins. Likes cigarettes. Needs money. Do with that what you will."

BAD EXAMPLES (AVOID):
❌ "Hey buddy!" (Too cheerful, breaks tone)
❌ "This place sucks" (Generic, no poetry)
❌ "I'll kill you" (Cartoonish threat, not grounded)
❌ "Wanna hear a joke?" (Wrong tone entirely)

Generate ONE line of dialogue (under 150 characters) that matches {personality}, reflects {relationship}, and uses Disco Elysium voice:
```

**Validation Check:**
```javascript
function validateCellmateDialogue(dialogue, personality) {
    const checks = {
        length: dialogue.length < 150,
        personality: matchesPersonality(dialogue, personality),
        tone: hasDiscoElysiumVoice(dialogue),
        notGeneric: !isGeneric(dialogue),
        notCruel: !punchesDown(dialogue)
    };

    return Object.values(checks).filter(v => v).length >= 4; // 4/5 pass
}
```

---

## APPENDIX: TONE EXAMPLES

### GOLD STANDARD: Eating Simulator

**Why it's perfect:**
- Specific details ("This potato", not "the food")
- Poetic observations ("has more autonomy than you do")
- Dark humor (comparing freedom to potato)
- Emotionally authentic (really does feel oppressive)
- Disco Elysium voice (detached poetry)

**Full collection of eating flavor text:**

```
"You eat. The food is gray. Your future is grayer."

"This potato has more autonomy than you do."

"The spoon is heavier than your freedom was."

"Mashed potatoes. Allegedly. The texture suggests otherwise."

"You chew. Time passes. Both feel eternal."

"The cafeteria calls this 'nutrition.' You call it 'evidence.'"

"Someone salted this. Not enough. Never enough."

"You wonder if they season it with despair. It would explain the flavor."

"Bite 12. You've lost count before. You'll lose count again."

"This meal is a metaphor. For what, you're afraid to ask."

"The potato yields. Unlike the judge. Unlike the law. Unlike time."

"You taste something. Best not to investigate."

"Fast or slow, the meal ends the same way. Unlike your sentence."

"The spoon scrapes the tray. A sound you'll remember. Forever."
```

**Pattern Analysis:**
- Structure: [Action]. [Specific observation]. [Philosophical weight].
- Rhythm: Short sentences. Staccato. Builds weight.
- Metaphor: Prison/freedom connected to mundane objects.
- Voice: Detached narrator, close third person, tired poetry.

### PATTERN LIBRARY: Reusable Comedy Structures

**Pattern 1: The Bureaucratic Specific**
```
Template: "[Action] per [Form Number], [Subsection]. [Absurd detail]."

Examples:
- "Form 27-B, Section 4.2: Mealtime. Subsection (a): You must eat. Subsection (b): Enjoying it is optional."
- "Violation Code 14-G: Unauthorized Hope. Penalty: Additional hope suppression."
- "Per Regulation 7.3.9: Silence after 9pm. Thoughts are silent. You are in compliance."
```

**Pattern 2: The Contrast Observation**
```
Template: "[Thing] is [quality]. [Related thing] is [opposite quality]. [Truth]."

Examples:
- "The iron is heavy. Your sentence is heavier. Your prospects are heaviest."
- "The guard is strict. The rules are stricter. The irony is strictest."
- "The walls are thick. The despair is thicker. The coffee is water."
```

**Pattern 3: The False Reassurance**
```
Template: "[Reassuring statement]. [Pause]. [Dark truth]."

Examples:
- "The warden says you're making progress. Toward what, nobody specifies."
- "Rehabilitation is working. You're becoming rehabilitated. To captivity."
- "There's hope for early release. Statistically. Very statistically."
```

**Pattern 4: The System Speaks**
```
Template: "[Authority figure] says [official line]. [Reality]. [Dark observation]."

Examples:
- "The guard says 'for your own good.' You doubt it. The good, that is. Not the ownership."
- "The judge said justice. You heard the word. Couldn't see it anywhere."
- "They call it correctional facility. You're being corrected. Into what, they won't say."
```

**Pattern 5: The Mundane Profound**
```
Template: "[Simple action]. [Deep implication]. [Deflating return to mundane]."

Examples:
- "You turn the page. Each one brings you closer to the end. Of the book."
- "You count the days. Math was never your strong suit. Still isn't."
- "You hope. It's free. Everything else costs commissary credits."
```

---

## CONCLUSION

This Comedy Hook System ensures that VROOM VROOM maintains its unique dark humor voice across all content, whether generated by humans or AI, whether written by tech specialists or narrative designers.

**Core Principles:**
1. Technology builds the mechanics
2. Comedy builds the soul
3. All content passes through tone review
4. Disco Elysium voice is sacred
5. Punch up, never down
6. Dark but never cruel
7. Absurd but always grounded
8. Trauma-informed always

**Success Criteria:**
- Players laugh darkly
- Players feel seen (their captivity, their absurd situation)
- Players recognize the system as the villain
- Players feel empathy for characters (even guards)
- Players want to replay for the writing

**When in doubt, ask:**
- Is it funny?
- Is it kind?
- Is it true?
- Is it Disco Elysium?

---

**Document Version:** 1.0.0
**Created:** 2025-10-16
**Author:** trauma-comedy-game-writer agent
**For:** VROOM VROOM development team
**Next Review:** After first implementation

**Related Documents:**
- `SYSTEMS.md` - Master game systems reference
- `PRISON_SYSTEM.md` - Prison mechanics and content
- `API_VERIFICATION_REPORT.md` - Gemini integration details
- `DEV_MODE_INTEGRATION.md` - Testing and debugging tools
