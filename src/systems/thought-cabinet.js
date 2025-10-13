// Thought Cabinet System
// Collect and internalize thoughts that affect gameplay and provide bonuses/penalties

class ThoughtCabinet {
    constructor() {
        this.maxSlots = 12; // Maximum thoughts that can be held
        this.activeThoughts = [];
        this.availableThoughts = this.initializeThoughts();
        this.completedThoughts = [];
        this.researchProgress = {}; // Track research progress for each thought
    }

    initializeThoughts() {
        return {
            // Driving-related thoughts
            whyIsDrivingIllegal: {
                id: 'whyIsDrivingIllegal',
                name: "Why Is Driving Illegal?",
                description: "A fundamental question that haunts you. If driving is illegal, why do roads exist? Why do cars exist? Why do YOU exist?",
                researchTime: 300000, // 5 minutes in ms
                problem: "You can't stop thinking about the paradox of illegal driving on legal roads.",
                solution: "The answer is there is no answer. The system doesn't need logic.",
                effects: {
                    onComplete: { mental_logic: +2, psyche_authority: -1 },
                    whileResearching: { mental_encyclopedia: -1 }
                },
                unlockCondition: () => true, // Always available
                dialogue: [
                    "The roads call to you, yet they forbid you.",
                    "Every car is a prison on wheels.",
                    "Freedom is just another word for pre-arrest."
                ]
            },

            theSystemIsWatching: {
                id: 'theSystemIsWatching',
                name: "The System Is Watching",
                description: "They're everywhere. The police. The judges. The forms. They see everything you do.",
                researchTime: 180000, // 3 minutes
                problem: "Paranoia grips you. Every car could be an undercover cop.",
                solution: "They ARE all cops. Your paranoia was justified.",
                effects: {
                    onComplete: { motorics_perception: +3, psyche_suggestion: +1 },
                    whileResearching: { psyche_authority: -2 }
                },
                unlockCondition: (player) => player.arrestCount > 0,
                dialogue: [
                    "That sedan has been following you for blocks.",
                    "The streetlights blink in morse code: G-U-I-L-T-Y",
                    "Even the birds work for the traffic department."
                ]
            },

            iAmSpeedItself: {
                id: 'iAmSpeedItself',
                name: "I Am Speed Itself",
                description: "You and the car are one. The road flows through your veins. You were born to drive.",
                researchTime: 240000, // 4 minutes
                problem: "Delusions of automotive grandeur consume you.",
                solution: "You're not speed. You're a traffic violation waiting to happen.",
                effects: {
                    onComplete: { motorics_reactionSpeed: +2, physical_handEyeCoordination: +2 },
                    whileResearching: { mental_logic: -1 }
                },
                unlockCondition: (player) => player.topSpeed > 100,
                dialogue: [
                    "The engine purrs in harmony with your heartbeat.",
                    "You don't drive the car. You ARE the car.",
                    "Gasoline runs through your veins."
                ]
            },

            bureaucraticMasochism: {
                id: 'bureaucraticMasochism',
                name: "Bureaucratic Masochism",
                description: "You're beginning to enjoy the forms. The paperwork. The endless, soul-crushing documentation.",
                researchTime: 420000, // 7 minutes
                problem: "You find yourself looking forward to filling out forms.",
                solution: "You've developed Stockholm Syndrome for paperwork.",
                effects: {
                    onComplete: { mental_encyclopedia: +3, courtroomBonus: +20 },
                    whileResearching: { psyche_inlandEmpire: -2 }
                },
                unlockCondition: (player) => player.formsCompleted > 5,
                dialogue: [
                    "Form 27-B calls to you like a siren song.",
                    "Your handwriting has never been more beautiful.",
                    "You dream in triplicate."
                ]
            },

            prisonIsHome: {
                id: 'prisonIsHome',
                name: "Prison Is Home",
                description: "After so many sentences, the prison feels more like home than the outside world.",
                researchTime: 600000, // 10 minutes
                problem: "You miss your cell when you're not in it.",
                solution: "Institutionalization complete. You're free only when imprisoned.",
                effects: {
                    onComplete: { prisonActivities: +3, physical_endurance: +2 },
                    whileResearching: { psyche_authority: -3 }
                },
                unlockCondition: (player) => player.totalPrisonDays > 30,
                dialogue: [
                    "Your cellmate understands you better than anyone.",
                    "The mystery meat tastes like home.",
                    "These walls protect you from the chaos outside."
                ]
            },

            judgeHardcastleIsMyNemesis: {
                id: 'judgeHardcastleIsMyNemesis',
                name: "Judge Hardcastle Is My Nemesis",
                description: "This isn't just legal procedure anymore. This is personal. You and Judge Hardcastle are locked in an eternal struggle.",
                researchTime: 360000, // 6 minutes
                problem: "You see Judge Hardcastle's disappointed face everywhere.",
                solution: "You're not enemies. You're dance partners in the ballet of justice.",
                effects: {
                    onComplete: { courtroomDebate: +4, mental_rhetoric: +2 },
                    whileResearching: { stressLevel: +10 }
                },
                unlockCondition: (player) => player.judgeEncounters > 3,
                dialogue: [
                    "Hardcastle's gavel echoes in your dreams.",
                    "You know each other's legal arguments by heart.",
                    "This courtroom isn't big enough for both of you."
                ]
            },

            existentialVehicularCrisis: {
                id: 'existentialVehicularCrisis',
                name: "Existential Vehicular Crisis",
                description: "What if you're not driving the car? What if the car is driving you? What if there is no car?",
                researchTime: 480000, // 8 minutes
                problem: "Reality becomes questionable when you're behind the wheel.",
                solution: "Nothing is real except the arrests. The arrests are very real.",
                effects: {
                    onComplete: { psyche_inlandEmpire: +4, mental_logic: -2 },
                    whileResearching: { drivingControl: -20 }
                },
                unlockCondition: (player) => player.drivingTime > 600,
                dialogue: [
                    "Are you driving or is driving you-ing?",
                    "The car doesn't exist. But neither do you.",
                    "Motion is an illusion. Arrest is reality."
                ]
            },

            theGreatEscape: {
                id: 'theGreatEscape',
                name: "The Great Escape",
                description: "You're planning the ultimate prison break. It's elaborate, complex, and absolutely doomed to fail.",
                researchTime: 900000, // 15 minutes
                problem: "You spend all your time planning an impossible escape.",
                solution: "The only escape is acceptance. Or serving your time.",
                effects: {
                    onComplete: { escapeChance: +5, motorics_interfacing: +3 },
                    whileResearching: { prisonActivities: -2 }
                },
                unlockCondition: (player) => player.escapeAttempts > 0,
                dialogue: [
                    "You've memorized the guard rotations.",
                    "The ventilation system is calling your name.",
                    "Freedom is just 47 impossible steps away."
                ]
            },

            carWhisperer: {
                id: 'carWhisperer',
                name: "The Car Whisperer",
                description: "You can hear what cars are thinking. They're all very sad.",
                researchTime: 300000, // 5 minutes
                problem: "Every vehicle you see is crying out in mechanical anguish.",
                solution: "Cars don't have feelings. But if they did, they'd hate you.",
                effects: {
                    onComplete: { motorics_interfacing: +3, psyche_inlandEmpire: +2 },
                    whileResearching: { mental_logic: -3 }
                },
                unlockCondition: (player) => player.carsEntered > 10,
                dialogue: [
                    "This sedan is depressed about its paint job.",
                    "That truck dreams of being a sports car.",
                    "Your car wishes it had a different driver."
                ]
            },

            legalNihilism: {
                id: 'legalNihilism',
                name: "Legal Nihilism",
                description: "Laws are meaningless. Justice is random. Nothing matters except the inevitability of arrest.",
                researchTime: 666000, // 11.1 minutes
                problem: "You've given up on understanding the legal system.",
                solution: "The law isn't meant to be understood. It's meant to be endured.",
                effects: {
                    onComplete: { stressReduction: +50, mental_rhetoric: -3 },
                    whileResearching: { motivation: -10 }
                },
                unlockCondition: (player) => player.guiltyVerdicts > 10,
                dialogue: [
                    "Guilt and innocence are just words.",
                    "Every law contradicts another law.",
                    "Justice is just ice with extra letters."
                ]
            }
        };
    }

    // Start researching a thought
    startResearch(thoughtId) {
        const thought = this.availableThoughts[thoughtId];
        if (!thought) return { success: false, error: "Thought not found" };

        if (this.activeThoughts.length >= this.maxSlots) {
            return { success: false, error: "Thought cabinet full" };
        }

        if (this.activeThoughts.find(t => t.id === thoughtId)) {
            return { success: false, error: "Already researching this thought" };
        }

        // Add to active thoughts
        this.activeThoughts.push(thought);
        this.researchProgress[thoughtId] = {
            startTime: Date.now(),
            timeRequired: thought.researchTime,
            completed: false
        };

        // Apply research penalties
        this.applyEffects(thought.effects.whileResearching);

        return {
            success: true,
            thought: thought,
            message: `Started researching: ${thought.name}`
        };
    }

    // Check research progress
    updateResearch() {
        const completed = [];

        this.activeThoughts.forEach(thought => {
            const progress = this.researchProgress[thought.id];
            if (progress && !progress.completed) {
                const elapsed = Date.now() - progress.startTime;

                if (elapsed >= progress.timeRequired) {
                    // Complete the thought
                    progress.completed = true;
                    this.completedThoughts.push(thought.id);

                    // Remove research penalties
                    this.removeEffects(thought.effects.whileResearching);

                    // Apply completion bonuses
                    this.applyEffects(thought.effects.onComplete);

                    completed.push({
                        thought: thought,
                        solution: thought.solution
                    });
                }
            }
        });

        return completed;
    }

    // Get progress percentage for a thought
    getProgress(thoughtId) {
        const progress = this.researchProgress[thoughtId];
        if (!progress) return 0;

        const elapsed = Date.now() - progress.startTime;
        return Math.min(100, (elapsed / progress.timeRequired) * 100);
    }

    // Forget a thought (remove from cabinet)
    forgetThought(thoughtId) {
        const index = this.activeThoughts.findIndex(t => t.id === thoughtId);
        if (index === -1) return { success: false, error: "Thought not active" };

        const thought = this.activeThoughts[index];
        const progress = this.researchProgress[thoughtId];

        // Remove effects
        if (progress.completed) {
            this.removeEffects(thought.effects.onComplete);
        } else {
            this.removeEffects(thought.effects.whileResearching);
        }

        // Remove from active thoughts
        this.activeThoughts.splice(index, 1);
        delete this.researchProgress[thoughtId];

        return {
            success: true,
            message: `Forgot: ${thought.name}`
        };
    }

    // Apply effects from a thought
    applyEffects(effects) {
        // This would integrate with the skill system
        // Effects modify skill levels, add bonuses, etc.
        return effects;
    }

    // Remove effects from a thought
    removeEffects(effects) {
        // Reverse the effects
        return effects;
    }

    // Get available thoughts based on conditions
    getAvailableThoughts(player) {
        const available = [];

        for (const id in this.availableThoughts) {
            const thought = this.availableThoughts[id];

            // Check if already researching or completed
            if (this.activeThoughts.find(t => t.id === id)) continue;
            if (this.completedThoughts.includes(id)) continue;

            // Check unlock condition
            if (thought.unlockCondition(player)) {
                available.push(thought);
            }
        }

        return available;
    }

    // Get random dialogue from active thoughts
    getThoughtDialogue() {
        const dialogues = [];

        this.activeThoughts.forEach(thought => {
            if (thought.dialogue && thought.dialogue.length > 0) {
                const randomDialogue = thought.dialogue[
                    Math.floor(Math.random() * thought.dialogue.length)
                ];
                dialogues.push({
                    thought: thought.name,
                    text: randomDialogue
                });
            }
        });

        return dialogues;
    }

    // Save thought cabinet data
    save() {
        return {
            activeThoughts: this.activeThoughts.map(t => t.id),
            completedThoughts: this.completedThoughts,
            researchProgress: this.researchProgress
        };
    }

    // Load thought cabinet data
    load(data) {
        if (data.completedThoughts) {
            this.completedThoughts = data.completedThoughts;
        }

        if (data.activeThoughts) {
            this.activeThoughts = data.activeThoughts.map(id =>
                this.availableThoughts[id]
            ).filter(t => t); // Filter out any null thoughts
        }

        if (data.researchProgress) {
            this.researchProgress = data.researchProgress;
        }
    }

    // Get UI display data
    getDisplayData() {
        return {
            slots: this.maxSlots,
            used: this.activeThoughts.length,
            thoughts: this.activeThoughts.map(thought => ({
                ...thought,
                progress: this.getProgress(thought.id),
                completed: this.researchProgress[thought.id]?.completed || false
            }))
        };
    }
}

export default ThoughtCabinet;