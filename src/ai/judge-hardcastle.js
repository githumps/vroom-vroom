// Judge Hardcastle AI System
// Dynamic dialogue system with LLM integration for context-aware responses

class JudgeHardcastle {
    constructor() {
        this.name = "Judge Hardcastle";
        this.mood = "irritated"; // irritated, angry, furious, apoplectic
        this.patience = 100;
        this.memory = [];
        this.arrestCount = 0;
        this.currentCharges = [];

        // Personality traits
        this.traits = {
            pedantic: 0.8,
            authoritarian: 0.9,
            bureaucratic: 1.0,
            humor: 0.1,
            mercy: 0.05
        };

        // Dialogue state
        this.dialogueTree = null;
        this.currentNode = null;

        // LLM configuration (can use OpenAI API or local fallback)
        this.llmEnabled = false;
        this.apiKey = null;
        this.llmModel = 'gpt-3.5-turbo'; // or claude-3-sonnet
    }

    // Initialize LLM connection (optional)
    async initializeLLM(apiKey, provider = 'openai') {
        this.apiKey = apiKey;
        this.llmEnabled = true;
        this.provider = provider;

        // Test connection
        try {
            const response = await this.generateLLMResponse("Test", {});
            console.log("Judge Hardcastle LLM initialized successfully");
            return true;
        } catch (error) {
            console.error("Failed to initialize LLM, falling back to scripted responses", error);
            this.llmEnabled = false;
            return false;
        }
    }

    // Generate response based on context
    async generateResponse(playerContext) {
        const context = {
            arrestCount: this.arrestCount,
            drivingTime: playerContext.drivingTime,
            speed: playerContext.speed,
            previousOffenses: this.memory,
            currentMood: this.mood,
            patience: this.patience,
            charges: this.currentCharges
        };

        // Try LLM if enabled
        if (this.llmEnabled) {
            try {
                return await this.generateLLMResponse(playerContext.lastAction, context);
            } catch (error) {
                console.error("LLM generation failed, using fallback", error);
            }
        }

        // Fallback to scripted responses
        return this.generateScriptedResponse(context);
    }

    // LLM-based response generation
    async generateLLMResponse(playerAction, context) {
        const systemPrompt = `You are Judge Hardcastle, an increasingly frustrated judge in an absurdist driving simulator where driving itself is basically illegal. You're pedantic, bureaucratic, and have seen this defendant ${context.arrestCount} times before.

Your mood is ${context.mood} and your patience is at ${context.patience}%.

The defendant was driving for ${context.drivingTime} seconds at ${context.speed} km/h.

Previous offenses: ${context.previousOffenses.join(', ')}

Respond in character with 2-3 sentences. Be increasingly frustrated with repeat offenders. Reference specific bureaucratic forms and subsections. Your responses should be darkly humorous but maintain judicial authority.`;

        const userPrompt = `The defendant says: "${playerAction}"`;

        if (this.provider === 'openai') {
            return await this.callOpenAI(systemPrompt, userPrompt);
        } else if (this.provider === 'anthropic') {
            return await this.callAnthropic(systemPrompt, userPrompt);
        }
    }

    // OpenAI API call
    async callOpenAI(systemPrompt, userPrompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.llmModel,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 150
            })
        });

        const data = await response.json();
        return {
            text: data.choices[0].message.content,
            mood: this.calculateNewMood()
        };
    }

    // Anthropic Claude API call
    async callAnthropic(systemPrompt, userPrompt) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                system: systemPrompt,
                messages: [
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 150
            })
        });

        const data = await response.json();
        return {
            text: data.content[0].text,
            mood: this.calculateNewMood()
        };
    }

    // Scripted response fallback
    generateScriptedResponse(context) {
        const responses = {
            firstOffense: [
                "Do you know why you're here? You were DRIVING. In a MOTOR VEHICLE. On a PUBLIC ROAD.",
                "Says here you were operating a vehicle at ${speed} kilometers per hour. That's ${speed} violations of Municipal Code 247.3-B.",
                "First time, I see. Well, ignorance of our 47,000 traffic regulations is no excuse."
            ],
            repeatOffender: [
                "You again. ${arrestCount} times now. Are you mentally incapable of NOT driving?",
                "Back already? It's been what, ${timeSinceLastArrest} minutes since your last arrest?",
                "At this point, I'm considering naming a wing of the courthouse after you."
            ],
            angry: [
                "ENOUGH! You've exhausted my patience and violated subsections A through ZZ of the Vehicle Code!",
                "I've seen career criminals with more respect for the law than you have for basic traffic regulations!",
                "Do you think this is a GAME? Do you think driving is some kind of JOKE?"
            ],
            sentencing: [
                "I hereby sentence you to ${sentence} years in correctional facility #7734. May you learn the error of your ways.",
                "Your flagrant disregard for Penal Code Section 12.34.56 Subsection J leaves me no choice. ${sentence} years.",
                "The court finds you guilty of existing in a vehicular manner. Sentence: ${sentence} years, no parole."
            ],
            paperwork: [
                "You failed to properly complete Form 27-B. That's an additional violation right there.",
                "I see you initialed Form 13-C but not 13-D. That's contempt of bureaucracy.",
                "Your handwriting on Form 42-A is barely legible. I'm adding 6 months for poor penmanship."
            ]
        };

        // Select appropriate response category
        let category = 'firstOffense';
        if (context.arrestCount > 5) {
            category = 'angry';
        } else if (context.arrestCount > 1) {
            category = 'repeatOffender';
        }

        // Get random response from category
        const categoryResponses = responses[category];
        const response = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

        // Replace placeholders
        const formattedResponse = this.formatResponse(response, context);

        return {
            text: formattedResponse,
            mood: this.mood,
            action: this.determineAction(context)
        };
    }

    // Format response with context variables
    formatResponse(template, context) {
        return template
            .replace('${speed}', context.speed)
            .replace('${arrestCount}', context.arrestCount)
            .replace('${sentence}', this.calculateSentence(context))
            .replace('${timeSinceLastArrest}', this.getTimeSinceLastArrest());
    }

    // Calculate sentence based on offenses
    calculateSentence(context) {
        let baseYears = 1;

        // Add time for speed
        baseYears += Math.floor(context.speed / 50);

        // Add time for repeat offenses
        baseYears += context.arrestCount * 2;

        // Add time for low patience
        if (this.patience < 20) {
            baseYears *= 2;
        }

        // Add random bureaucratic additions
        const additions = [
            "plus 6 months for that look on your face",
            "plus 1 year for wasting the court's time",
            "plus 3 months for breathing too loudly",
            "doubled for occurring on a Tuesday"
        ];

        const addition = additions[Math.floor(Math.random() * additions.length)];

        return `${baseYears} years, ${addition}`;
    }

    // Update Judge's mood based on player behavior
    updateMood(playerBehavior) {
        this.patience -= 10;

        if (this.patience < 0) this.patience = 0;

        // Update mood based on patience
        if (this.patience > 75) {
            this.mood = "irritated";
        } else if (this.patience > 50) {
            this.mood = "angry";
        } else if (this.patience > 25) {
            this.mood = "furious";
        } else {
            this.mood = "apoplectic";
        }

        // Special cases
        if (playerBehavior.includes('honk')) {
            this.patience -= 20;
            this.addMemory("Honked horn in court");
        }

        if (playerBehavior.includes('argue')) {
            this.patience -= 15;
            this.addMemory("Argued with the court");
        }
    }

    // Add to judge's memory of player
    addMemory(event) {
        this.memory.push({
            event: event,
            timestamp: Date.now(),
            mood: this.mood
        });

        // Keep only last 10 memories
        if (this.memory.length > 10) {
            this.memory.shift();
        }
    }

    // Get time since last arrest
    getTimeSinceLastArrest() {
        if (this.memory.length < 2) return "an eternity";

        const lastArrest = this.memory[this.memory.length - 1].timestamp;
        const previousArrest = this.memory[this.memory.length - 2].timestamp;
        const minutes = Math.floor((lastArrest - previousArrest) / 60000);

        if (minutes < 1) return "literally seconds";
        if (minutes < 5) return `${minutes} pathetic minutes`;
        if (minutes < 60) return `${minutes} minutes`;
        return `${Math.floor(minutes / 60)} hours`;
    }

    // Determine what action the judge takes
    determineAction(context) {
        if (context.arrestCount > 10) {
            return { type: 'life_sentence', severity: 'maximum' };
        }

        if (this.mood === 'apoplectic') {
            return { type: 'immediate_sentencing', severity: 'harsh' };
        }

        if (context.speed > 100) {
            return { type: 'additional_charges', charges: ['reckless_driving', 'endangerment'] };
        }

        return { type: 'standard_sentencing', severity: 'normal' };
    }

    // Calculate new mood after interaction
    calculateNewMood() {
        this.arrestCount++;
        this.patience = Math.max(0, this.patience - 15);

        if (this.patience > 60) return "irritated";
        if (this.patience > 30) return "angry";
        if (this.patience > 10) return "furious";
        return "apoplectic";
    }

    // Generate dynamic charges based on driving
    generateCharges(drivingData) {
        const charges = [];

        // Speed-related charges
        if (drivingData.speed > 0) {
            charges.push(`Operating a vehicle at ${drivingData.speed} km/h`);
        }

        if (drivingData.speed > 50) {
            charges.push("Excessive velocity in a no-velocity zone");
        }

        // Time-related charges
        if (drivingData.time > 60) {
            charges.push("Prolonged vehicular operation");
        }

        // Location-related charges
        charges.push("Existing in a vehicle on a public road");
        charges.push("Possession of car keys with intent to drive");

        // Random bureaucratic charges
        const randomCharges = [
            "Failure to file Form TX-401 before driving",
            "Operating vehicle without submitting daily driving intention report",
            "Unlicensed use of turn signals",
            "Aggressive adherence to traffic laws",
            "Suspicious compliance with speed limits",
            "Unauthorized use of vehicular momentum"
        ];

        // Add 1-3 random charges
        const numRandom = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numRandom; i++) {
            const charge = randomCharges[Math.floor(Math.random() * randomCharges.length)];
            if (!charges.includes(charge)) {
                charges.push(charge);
            }
        }

        this.currentCharges = charges;
        return charges;
    }

    // Reset for new game
    reset() {
        this.mood = "irritated";
        this.patience = 100;
        this.memory = [];
        this.arrestCount = 0;
        this.currentCharges = [];
    }
}

export default JudgeHardcastle;