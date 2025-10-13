// Skill System inspired by Disco Elysium
// Four main attributes with various skills that provide internal dialogue and checks

class SkillSystem {
    constructor() {
        this.skills = {
            // PHYSICAL - Your body and raw power
            physical: {
                endurance: {
                    name: "Endurance",
                    level: 1,
                    description: "How long can you keep driving before exhaustion?",
                    thoughts: [
                        "Your hands are cramping on the wheel.",
                        "The seat is becoming part of your spine.",
                        "Just... one... more... kilometer..."
                    ]
                },
                handEyeCoordination: {
                    name: "Hand/Eye Coordination",
                    level: 1,
                    description: "Dodge police, navigate traffic, parallel park under pressure.",
                    thoughts: [
                        "Your reflexes are sharp. Too sharp. Suspiciously sharp.",
                        "The wheel responds to your thoughts before your hands.",
                        "You could thread this car through a needle."
                    ]
                },
                physicalInstrument: {
                    name: "Physical Instrument",
                    level: 1,
                    description: "Assert dominance through sheer presence.",
                    thoughts: [
                        "You could probably lift this car. If you wanted to.",
                        "The prison weights await you.",
                        "Your muscles remember freedom."
                    ]
                }
            },

            // MENTAL - Your intellect and education
            mental: {
                logic: {
                    name: "Logic",
                    level: 1,
                    description: "Deduce why driving is illegal. Fail to find answers.",
                    thoughts: [
                        "If driving is illegal, why do roads exist?",
                        "This is a paradox wrapped in bureaucracy.",
                        "The math doesn't add up. It never did."
                    ]
                },
                encyclopedia: {
                    name: "Encyclopedia",
                    level: 1,
                    description: "Recall obscure traffic laws from memory.",
                    thoughts: [
                        "Municipal Code 247.3-B was enacted in 1987 after the Great Driving Incident.",
                        "Did you know? The first traffic violation was issued before cars were invented.",
                        "Form 27-B has existed in 47 different versions since 1923."
                    ]
                },
                rhetoric: {
                    name: "Rhetoric",
                    level: 1,
                    description: "Argue your case. Lose anyway.",
                    thoughts: [
                        "Your words are weapons. Useless weapons.",
                        "You could convince anyone. Except Judge Hardcastle.",
                        "The perfect argument exists. You'll never find it."
                    ]
                }
            },

            // PSYCHE - Your personality and psyche
            psyche: {
                authority: {
                    name: "Authority",
                    level: 1,
                    description: "Command respect. From no one.",
                    thoughts: [
                        "You ARE the law. Were. Before the arrest.",
                        "These cops don't know who they're dealing with.",
                        "Your presence demands... nothing. Absolutely nothing."
                    ]
                },
                suggestion: {
                    name: "Suggestion",
                    level: 1,
                    description: "Read people's intentions. They all want to arrest you.",
                    thoughts: [
                        "That cop is thinking about arresting you.",
                        "That other cop is also thinking about arresting you.",
                        "Everyone is thinking about arresting you."
                    ]
                },
                inlandEmpire: {
                    name: "Inland Empire",
                    level: 1,
                    description: "Your imagination. It's not helping.",
                    thoughts: [
                        "The car whispers secrets. Dark secrets about traffic.",
                        "The road is alive. It judges you.",
                        "In another timeline, you're still driving. Free."
                    ]
                }
            },

            // MOTORICS - Your senses and dexterity
            motorics: {
                reactionSpeed: {
                    name: "Reaction Speed",
                    level: 1,
                    description: "React to danger. It's everywhere.",
                    thoughts: [
                        "POLICE! Swerve left! No, right! No, surrender!",
                        "Your synapses fire at the speed of bureaucracy.",
                        "Time slows down. The arrest is inevitable."
                    ]
                },
                perception: {
                    name: "Perception",
                    level: 1,
                    description: "Notice details. Like the 50 police cars.",
                    thoughts: [
                        "You count 17 police cars in your immediate vicinity.",
                        "That's not a civilian vehicle. None of them are.",
                        "The sirens are getting closer. They're always getting closer."
                    ]
                },
                interfacing: {
                    name: "Interfacing",
                    level: 1,
                    description: "Interact with machinery. Cars. Handcuffs.",
                    thoughts: [
                        "The steering wheel fits perfectly in your criminal hands.",
                        "You know exactly how these handcuffs work.",
                        "The prison door mechanism is surprisingly simple."
                    ]
                }
            }
        };

        // Skill check history
        this.checkHistory = [];

        // Active thoughts providing passive bonuses/penalties
        this.activeThoughts = [];

        // Experience points for each attribute
        this.experience = {
            physical: 0,
            mental: 0,
            psyche: 0,
            motorics: 0
        };
    }

    // Perform a skill check
    rollSkillCheck(attribute, skill, difficulty = 10) {
        const skillObj = this.skills[attribute][skill];
        if (!skillObj) {
            console.error(`Skill ${attribute}.${skill} not found`);
            return { success: false, margin: -999 };
        }

        // Base roll: 2d6 + skill level
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        const roll = die1 + die2 + skillObj.level;

        // Apply thought modifiers
        let modifier = 0;
        this.activeThoughts.forEach(thought => {
            if (thought.affects === skill) {
                modifier += thought.bonus;
            }
        });

        const total = roll + modifier;
        const success = total >= difficulty;
        const margin = total - difficulty;

        // Record check
        this.checkHistory.push({
            attribute,
            skill,
            roll: die1 + die2,
            total,
            difficulty,
            success,
            timestamp: Date.now()
        });

        // Generate internal dialogue
        const thought = this.generateThought(skillObj, success, margin);

        // Gain experience
        if (!success && margin >= -2) {
            // Close failures teach you more
            this.gainExperience(attribute, 2);
        } else if (success) {
            this.gainExperience(attribute, 1);
        }

        return {
            success,
            margin,
            total,
            thought,
            critical: die1 === die2 && die1 === 6,
            criticalFailure: die1 === die2 && die1 === 1
        };
    }

    // Generate internal dialogue based on skill check
    generateThought(skill, success, margin) {
        let thought = "";

        if (success) {
            if (margin > 5) {
                thought = `[${skill.name}] - LEGENDARY SUCCESS: `;
            } else if (margin > 2) {
                thought = `[${skill.name}] - Success: `;
            } else {
                thought = `[${skill.name}] - Barely: `;
            }
        } else {
            if (margin < -5) {
                thought = `[${skill.name}] - CATASTROPHIC FAILURE: `;
            } else if (margin < -2) {
                thought = `[${skill.name}] - Failure: `;
            } else {
                thought = `[${skill.name}] - Close: `;
            }
        }

        // Add specific thought
        thought += skill.thoughts[Math.floor(Math.random() * skill.thoughts.length)];

        return thought;
    }

    // Passive skill checks (happen automatically)
    passiveCheck(attribute, skill) {
        const skillObj = this.skills[attribute][skill];
        if (!skillObj) return null;

        // Passive checks have lower difficulty but no player input
        const difficulty = 8;
        const roll = Math.floor(Math.random() * 6) + 1 + skillObj.level;

        if (roll >= difficulty) {
            return {
                triggered: true,
                thought: skillObj.thoughts[Math.floor(Math.random() * skillObj.thoughts.length)],
                skill: skillObj.name
            };
        }

        return { triggered: false };
    }

    // Gain experience and potentially level up
    gainExperience(attribute, amount) {
        this.experience[attribute] += amount;

        // Check for level up (every 10 exp)
        while (this.experience[attribute] >= 10) {
            this.experience[attribute] -= 10;
            this.levelUpAttribute(attribute);
        }
    }

    // Level up a random skill in an attribute
    levelUpAttribute(attribute) {
        const skillNames = Object.keys(this.skills[attribute]);
        const randomSkill = skillNames[Math.floor(Math.random() * skillNames.length)];

        this.skills[attribute][randomSkill].level++;

        return {
            attribute,
            skill: randomSkill,
            newLevel: this.skills[attribute][randomSkill].level,
            message: `${this.skills[attribute][randomSkill].name} increased to level ${this.skills[attribute][randomSkill].level}!`
        };
    }

    // Get all skills for UI display
    getAllSkills() {
        const result = {};
        for (const attr in this.skills) {
            result[attr] = {};
            for (const skill in this.skills[attr]) {
                result[attr][skill] = {
                    ...this.skills[attr][skill],
                    experience: this.experience[attr]
                };
            }
        }
        return result;
    }

    // Modify skill temporarily (from items, states, etc)
    modifySkill(attribute, skill, amount, duration = null) {
        const original = this.skills[attribute][skill].level;
        this.skills[attribute][skill].level += amount;

        if (duration) {
            setTimeout(() => {
                this.skills[attribute][skill].level = original;
            }, duration);
        }
    }

    // Check if player meets skill requirements
    meetsRequirement(attribute, skill, required) {
        return this.skills[attribute][skill].level >= required;
    }

    // Get internal monologue for current situation
    getInternalMonologue(situation) {
        const monologues = [];

        // Check each skill for relevant thoughts
        for (const attr in this.skills) {
            for (const skillName in this.skills[attr]) {
                const passive = this.passiveCheck(attr, skillName);
                if (passive && passive.triggered) {
                    monologues.push({
                        skill: passive.skill,
                        thought: passive.thought,
                        attribute: attr
                    });
                }
            }
        }

        return monologues;
    }

    // Save skill data
    save() {
        return {
            skills: this.skills,
            experience: this.experience,
            activeThoughts: this.activeThoughts,
            checkHistory: this.checkHistory.slice(-50) // Keep last 50 checks
        };
    }

    // Load skill data
    load(data) {
        if (data.skills) this.skills = data.skills;
        if (data.experience) this.experience = data.experience;
        if (data.activeThoughts) this.activeThoughts = data.activeThoughts;
        if (data.checkHistory) this.checkHistory = data.checkHistory;
    }
}

export default SkillSystem;