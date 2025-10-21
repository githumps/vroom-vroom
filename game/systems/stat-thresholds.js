/**
 * STAT THRESHOLD SYSTEM
 * Defines thresholds and effects for Intelligence, Strength, Hunger, and Good Behavior
 * Makes player stats actually matter in gameplay
 *
 * Version: 1.0.0
 * Created: 2025-10-20
 */

class StatThresholdSystem {
    constructor() {
        // Define all thresholds and their effects
        this.thresholds = {
            intelligence: [
                {
                    min: 0, max: 19,
                    tier: 'Illiterate',
                    color: '#ff4444',
                    effects: {
                        libraryAccess: 'blocked',
                        courtFormTime: 2.0, // 2x slower
                        missLoopholes: true,
                        randomEventPenalty: -0.2, // 20% worse outcomes
                        description: 'Cannot read books, court forms take 2x longer, miss legal loopholes'
                    },
                    unlocks: [],
                    penalties: [
                        'Library is locked - "You need to learn basic literacy first"',
                        'Court forms take twice as long to fill out',
                        'Miss obvious legal loopholes that could reduce sentence',
                        'Random events have worse outcomes (you miss clues)'
                    ]
                },
                {
                    min: 20, max: 39,
                    tier: 'Basic Literacy',
                    color: '#ff8844',
                    effects: {
                        libraryAccess: 'simple',
                        courtFormTime: 1.0,
                        canTutor: true,
                        tutorIncome: 5,
                        description: 'Can read simple books, normal court forms, can tutor inmates for credits'
                    },
                    unlocks: [
                        '"Traffic Laws" book unlocked',
                        'UNLOCK: Tutor other inmates (+5 credits/day)'
                    ],
                    penalties: []
                },
                {
                    min: 40, max: 59,
                    tier: 'Smart',
                    color: '#ffcc44',
                    effects: {
                        libraryAccess: 'all',
                        canSpotContradictions: true,
                        lawLibraryAccess: true,
                        gangStrategyRole: true,
                        description: 'All books accessible, spot contradictions, law library access, gang strategy role'
                    },
                    unlocks: [
                        'All library books unlocked',
                        'UNLOCK: Law library access (can reduce sentence by 5%)',
                        'UNLOCK: Gang strategy role (earn more reputation)',
                        'Can spot contradictions in court forms'
                    ],
                    penalties: []
                },
                {
                    min: 60, max: 79,
                    tier: 'Very Smart',
                    color: '#44ff44',
                    effects: {
                        legalLoopholes: true,
                        sentenceReduction: 0.1, // 10% reduction
                        mentorIncome: 10,
                        prisonTeachingJob: true,
                        courtFormAutofill: 0.25, // 25% fields auto-filled
                        description: 'Solve loopholes (-10% sentence), mentor inmates (+10 credits/day), auto-fill some forms'
                    },
                    unlocks: [
                        'UNLOCK: Solve legal loopholes (reduce sentence by 10%)',
                        'UNLOCK: Mentor inmates (+10 credits/day)',
                        'UNLOCK: Prison teaching job',
                        '25% of court form fields auto-fill correctly'
                    ],
                    penalties: []
                },
                {
                    min: 80, max: 99,
                    tier: 'Genius',
                    color: '#44ffff',
                    effects: {
                        prisonBlueprints: true,
                        negotiateWithGuards: true,
                        computerAccess: true,
                        priceDiscount: 0.2, // 20% off everything
                        courtFormAutofill: 0.5, // 50% auto-filled
                        description: 'Find blueprints (new escape route), negotiate with guards, computer access, 20% discounts'
                    },
                    unlocks: [
                        'UNLOCK: Discover prison blueprints (new escape route: VENTILATION SYSTEM)',
                        'UNLOCK: Negotiate with guards (better bribery deals)',
                        'UNLOCK: Computer access (hacking mini-game)',
                        '20% discount on all purchases',
                        '50% of court form fields auto-fill'
                    ],
                    penalties: []
                },
                {
                    min: 100, max: 100,
                    tier: 'Maximum Intelligence',
                    color: '#00ffff',
                    effects: {
                        representYourself: true,
                        autoWinChallenges: true,
                        hiddenDialogue: true,
                        achievementUnlocked: 'Too Smart For This Place',
                        courtFormAutofill: 1.0, // 100% auto-filled
                        description: 'ULTIMATE: Represent yourself in court, auto-win challenges, hidden dialogue options'
                    },
                    unlocks: [
                        '🏆 ACHIEVEMENT: "Too Smart For This Place"',
                        'UNLOCK: Represent yourself in court (no lawyer needed)',
                        'Auto-win some court challenges',
                        'See hidden dialogue options with guards and inmates',
                        'All court forms auto-fill perfectly'
                    ],
                    penalties: []
                }
            ],

            strength: [
                {
                    min: 0, max: 19,
                    tier: 'Weak',
                    color: '#ff4444',
                    effects: {
                        getBullied: true,
                        cigaretteLoss: 5, // lose 5/day
                        gymAccess: 'blocked',
                        randomEventPenalty: -0.2,
                        description: 'Get bullied (lose 5 cigarettes/day), cannot use gym, beaten up in random events'
                    },
                    unlocks: [],
                    penalties: [
                        'Lose 5 cigarettes per day to bullies',
                        'Gym is locked - "Come back when you can lift the bar"',
                        'Random events: beaten up, items stolen',
                        'Other inmates see you as an easy target'
                    ]
                },
                {
                    min: 20, max: 39,
                    tier: 'Average',
                    color: '#ff8844',
                    effects: {
                        defendChance: 0.5, // 50% defend successfully
                        gymAccess: 'basic',
                        description: 'Can defend yourself (50% success), basic gym access'
                    },
                    unlocks: [
                        'Gym unlocked (basic equipment)',
                        '50% chance to defend against bullies'
                    ],
                    penalties: []
                },
                {
                    min: 40, max: 59,
                    tier: 'Strong',
                    color: '#ffcc44',
                    effects: {
                        defendChance: 0.8, // 80% defend
                        intimidateBullies: true,
                        yardRespect: true,
                        gangRepBonus: 0.25, // +25% gang rep gains
                        gymGainsMultiplier: 1.5,
                        description: 'Defend yourself (80%), intimidate bullies, yard respect, faster strength gains'
                    },
                    unlocks: [
                        '80% chance to defend successfully',
                        'UNLOCK: Intimidate bullies (they leave you alone)',
                        'UNLOCK: Yard respect (+25% gang reputation gains)',
                        'Lift heavier weights (50% faster strength gains)'
                    ],
                    penalties: []
                },
                {
                    min: 60, max: 79,
                    tier: 'Very Strong',
                    color: '#44ff44',
                    effects: {
                        neverBullied: true,
                        winFights: true,
                        fightBettingIncome: 20,
                        bouncerJob: true,
                        protectionRequests: true,
                        description: 'Never bullied, win fights (earn credits from bets), bouncer job, protection requests'
                    },
                    unlocks: [
                        'Never get bullied (too intimidating)',
                        'UNLOCK: Win prison fights (earn 20+ credits from bets)',
                        'UNLOCK: Cafeteria bouncer job (+15 credits/day)',
                        'Other inmates ask for protection (earn favors)'
                    ],
                    penalties: []
                },
                {
                    min: 80, max: 99,
                    tier: 'Prison Champion',
                    color: '#44ffff',
                    effects: {
                        fightBettingIncome: 50,
                        gangLeaderAlliance: true,
                        trainingIncome: 25,
                        intimidationDialogue: true,
                        description: 'Fight bets earn 50+ credits, gang leader alliance, train others for money, intimidation dialogue'
                    },
                    unlocks: [
                        'Side bets on fights earn 50+ credits',
                        'UNLOCK: Gang leader offers personal alliance',
                        'UNLOCK: Training regime (train others for 25 credits/day)',
                        'Intimidation dialogue options unlock'
                    ],
                    penalties: []
                },
                {
                    min: 100, max: 100,
                    tier: 'Unstoppable',
                    color: '#00ff00',
                    effects: {
                        breakThroughWall: true,
                        autoWinFights: true,
                        guardsIntimidated: true,
                        achievementUnlocked: 'The Mountain',
                        description: 'ULTIMATE: Break through wall (new escape), auto-win fights, guards fear you'
                    },
                    unlocks: [
                        '🏆 ACHIEVEMENT: "The Mountain"',
                        'UNLOCK: Break Through Wall (new escape route)',
                        'Auto-win every fight',
                        'Guards won\'t mess with you (some favors ignored)'
                    ],
                    penalties: []
                }
            ],

            hunger: [
                {
                    min: 0, max: 19,
                    tier: 'Starving',
                    color: '#ff0000',
                    effects: {
                        strengthLoss: 2, // per day
                        intelligenceLoss: 1, // per day
                        cannotConcentrate: true,
                        collapseRisk: 0.1, // 10% chance to collapse
                        visualEffect: 'gaunt',
                        description: 'CRITICAL: Lose 2 STR & 1 INT per day, cannot concentrate, collapse risk, look gaunt'
                    },
                    unlocks: [],
                    penalties: [
                        '⚠️ CRITICAL: Lose 2 strength per day',
                        '⚠️ CRITICAL: Lose 1 intelligence per day',
                        'Cannot concentrate on activities (no stat gains)',
                        '10% chance to collapse (lose 1 day)',
                        'Visual: Character looks gaunt and malnourished',
                        'All activities cost 2x time'
                    ]
                },
                {
                    min: 20, max: 39,
                    tier: 'Very Hungry',
                    color: '#ff8844',
                    effects: {
                        strengthLoss: 1, // per day
                        activityTimePenalty: 2.0, // 2x time
                        distractedReading: true,
                        description: 'Lose 1 STR per day, activities cost 2x time, distracted reading'
                    },
                    unlocks: [],
                    penalties: [
                        'Lose 1 strength per day',
                        'Activities cost 2x time',
                        'Distracted reading (miss details in books)'
                    ]
                },
                {
                    min: 40, max: 59,
                    tier: 'Normal',
                    color: '#ffff44',
                    effects: {
                        description: 'Normal hunger - no penalties or bonuses'
                    },
                    unlocks: ['Standard gameplay - no hunger effects'],
                    penalties: []
                },
                {
                    min: 60, max: 79,
                    tier: 'Well-Fed',
                    color: '#44ff44',
                    effects: {
                        statGainBonus: 0.1, // +10% stat gains
                        fasterRecovery: true,
                        intelligenceBonus: 1, // passive
                        description: '+10% stat gains, faster recovery from fights, +1 INT bonus'
                    },
                    unlocks: [
                        '+10% stat gains from all activities',
                        'Faster recovery from fights',
                        'Better focus (+1 intelligence bonus)'
                    ],
                    penalties: []
                },
                {
                    min: 80, max: 99,
                    tier: 'Full',
                    color: '#00ff00',
                    effects: {
                        statGainBonus: 0.2, // +20% stat gains
                        immuneToIllness: true,
                        extraEnergy: true,
                        moodBonus: true,
                        description: '+20% stat gains, immune to illness, extra energy, better random events'
                    },
                    unlocks: [
                        '+20% stat gains from all activities',
                        'Immune to illness and infection',
                        'Extra energy (can do more activities per day)',
                        'Happy mood (better random event outcomes)'
                    ],
                    penalties: []
                },
                {
                    min: 100, max: 100,
                    tier: 'Food Coma',
                    color: '#00ffff',
                    effects: {
                        megaRestBonus: 5, // +5 all stats
                        thenDrop: 50, // drops to 50 after
                        achievementUnlocked: 'Feast Mode',
                        description: 'ULTIMATE: Sleep bonus (+5 all stats), then drops to 50 hunger'
                    },
                    unlocks: [
                        '🏆 ACHIEVEMENT: "Feast Mode"',
                        'Sleep bonus: +5 to ALL stats when waking',
                        'One-time mega rest',
                        'Then hunger drops to 50 (well-fed)'
                    ],
                    penalties: []
                }
            ],

            goodBehaviorPoints: [
                {
                    min: 0, max: 19,
                    tier: 'Troublemaker',
                    color: '#ff0000',
                    effects: {
                        solitaryRisk: 0.05, // 5% chance per day
                        guardHarassment: true,
                        noPrivileges: true,
                        priceIncrease: 0.25, // 25% higher prices
                        description: 'Solitary risk, guards harass you, no privileges, 25% higher prices'
                    },
                    unlocks: [],
                    penalties: [
                        '5% chance of solitary confinement each day (lose 1 day)',
                        'Guards harass you constantly',
                        'No privileges granted',
                        'Commissary prices 25% higher'
                    ]
                },
                {
                    min: 20, max: 39,
                    tier: 'Problematic',
                    color: '#ff8844',
                    effects: {
                        limitedActivities: false,
                        guardWatching: true,
                        description: 'Limited activities, guards watch closely, normal prices'
                    },
                    unlocks: [],
                    penalties: [
                        'Guards watch you closely',
                        'Normal treatment and pricing'
                    ]
                },
                {
                    min: 40, max: 59,
                    tier: 'Decent',
                    color: '#ffff44',
                    effects: {
                        allActivitiesAvailable: true,
                        libraryPrivileges: true,
                        description: 'All activities available, library privileges, normal treatment'
                    },
                    unlocks: [
                        'All activities available',
                        'UNLOCK: Library privileges (borrow books)'
                    ],
                    penalties: []
                },
                {
                    min: 60, max: 79,
                    tier: 'Good Prisoner',
                    color: '#44ff44',
                    effects: {
                        guardFavors: true,
                        visitationRights: true,
                        workReleaseProgram: true,
                        priceDiscount: 0.1, // 10% discount
                        description: 'Guards grant minor favors, visitation rights, work release, 10% discounts'
                    },
                    unlocks: [
                        'Guards like you (minor favors granted)',
                        'UNLOCK: Visitation rights',
                        'UNLOCK: Work release program (+20 credits/day)',
                        '10% discount on all purchases'
                    ],
                    penalties: []
                },
                {
                    min: 80, max: 99,
                    tier: 'Model Prisoner',
                    color: '#00ff00',
                    effects: {
                        earlyParoleConsideration: true,
                        sentenceReduction: 0.1, // 10% off sentence
                        bestCell: true,
                        blindEyeToInfractions: true,
                        priceDiscount: 0.2, // 20% discount
                        conjugalVisits: true,
                        description: 'Early parole, 10% sentence reduction, best cell, guards overlook minor infractions, 20% off'
                    },
                    unlocks: [
                        'Early parole consideration',
                        'Best cell assignment (bonus comfort)',
                        'Guards turn blind eye to minor infractions',
                        '20% discount on all purchases',
                        'UNLOCK: Conjugal visits'
                    ],
                    penalties: []
                },
                {
                    min: 100, max: 999,
                    tier: 'Perfect Behavior',
                    color: '#00ffff',
                    effects: {
                        sentenceReduction: 0.5, // 50% reduction!
                        trusteeStatus: true,
                        canLeaveGrounds: true,
                        guardsAsAllies: true,
                        achievementUnlocked: 'Angel in Orange',
                        description: 'ULTIMATE: 50% sentence reduction, trustee status, can leave grounds, guards as allies'
                    },
                    unlocks: [
                        '🏆 ACHIEVEMENT: "Angel in Orange"',
                        '⭐ SENTENCE REDUCED BY 50%!',
                        'UNLOCK: Trustee status (special jobs)',
                        'UNLOCK: Can leave prison grounds (work outside)',
                        'Guards are your allies (major favors)'
                    ],
                    penalties: []
                }
            ]
        };
    }

    /**
     * Get the current threshold tier for a given stat
     */
    getThreshold(statName, value) {
        const thresholds = this.thresholds[statName];
        if (!thresholds) return null;

        for (let tier of thresholds) {
            if (value >= tier.min && value <= tier.max) {
                return tier;
            }
        }

        return null;
    }

    /**
     * Check if player can perform an activity based on stats
     */
    canPerformActivity(activity, player) {
        const results = {
            allowed: true,
            reason: '',
            requirements: []
        };

        switch (activity) {
            case 'library':
                const intThreshold = this.getThreshold('intelligence', player.intelligence || 0);
                if (intThreshold && intThreshold.effects.libraryAccess === 'blocked') {
                    results.allowed = false;
                    results.reason = 'You need to learn basic literacy first. Try working or attending prison classes.';
                    results.requirements.push('Intelligence: 20+ required');
                }
                break;

            case 'gym':
                const strThreshold = this.getThreshold('strength', player.strength || 0);
                if (strThreshold && strThreshold.effects.gymAccess === 'blocked') {
                    results.allowed = false;
                    results.reason = 'Come back when you can lift the bar. Try doing pushups in your cell first.';
                    results.requirements.push('Strength: 20+ required');
                }
                break;

            case 'conjugalVisit':
                const behaviorThreshold = this.getThreshold('goodBehaviorPoints', player.goodBehaviorPoints || 0);
                if (!behaviorThreshold || !behaviorThreshold.effects.conjugalVisits) {
                    results.allowed = false;
                    results.reason = 'Conjugal visits require excellent behavior. Be a model prisoner.';
                    results.requirements.push('Good Behavior: 80+ required');
                }
                break;

            case 'workRelease':
                const behaviorThreshold2 = this.getThreshold('goodBehaviorPoints', player.goodBehaviorPoints || 0);
                if (!behaviorThreshold2 || !behaviorThreshold2.effects.workReleaseProgram) {
                    results.allowed = false;
                    results.reason = 'Work release requires good behavior.';
                    results.requirements.push('Good Behavior: 60+ required');
                }
                break;
        }

        return results;
    }

    /**
     * Get stat modifier for activity gains
     */
    getStatGainModifier(player) {
        let multiplier = 1.0;

        // Hunger affects all stat gains
        const hungerThreshold = this.getThreshold('hunger', player.hunger || 50);
        if (hungerThreshold) {
            if (hungerThreshold.effects.statGainBonus) {
                multiplier += hungerThreshold.effects.statGainBonus;
            }
            if (hungerThreshold.effects.cannotConcentrate) {
                multiplier = 0; // No gains when starving
            }
            if (hungerThreshold.effects.activityTimePenalty) {
                // Penalty handled separately in activity time
            }
        }

        return multiplier;
    }

    /**
     * Get strength gain multiplier for gym
     */
    getStrengthGainMultiplier(player) {
        let multiplier = 1.0;

        const strThreshold = this.getThreshold('strength', player.strength || 0);
        if (strThreshold && strThreshold.effects.gymGainsMultiplier) {
            multiplier *= strThreshold.effects.gymGainsMultiplier;
        }

        // Apply hunger modifier
        multiplier *= this.getStatGainModifier(player);

        return multiplier;
    }

    /**
     * Get price modifier for purchases
     */
    getPriceModifier(player) {
        let modifier = 1.0;

        // Intelligence discount
        const intThreshold = this.getThreshold('intelligence', player.intelligence || 0);
        if (intThreshold && intThreshold.effects.priceDiscount) {
            modifier -= intThreshold.effects.priceDiscount;
        }

        // Good behavior discount
        const behaviorThreshold = this.getThreshold('goodBehaviorPoints', player.goodBehaviorPoints || 0);
        if (behaviorThreshold) {
            if (behaviorThreshold.effects.priceDiscount) {
                modifier -= behaviorThreshold.effects.priceDiscount;
            }
            if (behaviorThreshold.effects.priceIncrease) {
                modifier += behaviorThreshold.effects.priceIncrease;
            }
        }

        return Math.max(0.1, modifier); // Never below 10% of original price
    }

    /**
     * Get gang reputation gain modifier
     */
    getGangRepModifier(player) {
        let modifier = 1.0;

        const strThreshold = this.getThreshold('strength', player.strength || 0);
        if (strThreshold && strThreshold.effects.gangRepBonus) {
            modifier += strThreshold.effects.gangRepBonus;
        }

        return modifier;
    }

    /**
     * Get daily passive effects that should be applied
     */
    getDailyEffects(player) {
        const effects = {
            strengthChange: 0,
            intelligenceChange: 0,
            moneyChange: 0,
            cigarettesChange: 0,
            messages: []
        };

        // Hunger effects
        const hungerThreshold = this.getThreshold('hunger', player.hunger || 50);
        if (hungerThreshold) {
            if (hungerThreshold.effects.strengthLoss) {
                effects.strengthChange -= hungerThreshold.effects.strengthLoss;
                effects.messages.push(`Starvation: -${hungerThreshold.effects.strengthLoss} Strength`);
            }
            if (hungerThreshold.effects.intelligenceLoss) {
                effects.intelligenceChange -= hungerThreshold.effects.intelligenceLoss;
                effects.messages.push(`Starvation: -${hungerThreshold.effects.intelligenceLoss} Intelligence`);
            }
            if (hungerThreshold.effects.intelligenceBonus) {
                effects.intelligenceChange += hungerThreshold.effects.intelligenceBonus;
                effects.messages.push(`Well-fed: +${hungerThreshold.effects.intelligenceBonus} Intelligence`);
            }
        }

        // Strength effects (bullying)
        const strThreshold = this.getThreshold('strength', player.strength || 0);
        if (strThreshold && strThreshold.effects.cigaretteLoss) {
            effects.cigarettesChange -= strThreshold.effects.cigaretteLoss;
            effects.messages.push(`Bullied: Lost ${strThreshold.effects.cigaretteLoss} cigarettes`);
        }

        // Intelligence income effects
        const intThreshold = this.getThreshold('intelligence', player.intelligence || 0);
        if (intThreshold) {
            if (intThreshold.effects.tutorIncome) {
                effects.moneyChange += intThreshold.effects.tutorIncome;
                effects.messages.push(`Tutoring: +${intThreshold.effects.tutorIncome} credits`);
            }
            if (intThreshold.effects.mentorIncome) {
                effects.moneyChange += intThreshold.effects.mentorIncome;
                effects.messages.push(`Mentoring: +${intThreshold.effects.mentorIncome} credits`);
            }
        }

        // Strength income effects
        if (strThreshold) {
            if (strThreshold.effects.bouncerJob && player.hasBouncerJob) {
                effects.moneyChange += 15;
                effects.messages.push(`Bouncer job: +15 credits`);
            }
            if (strThreshold.effects.trainingIncome && player.hasTrainingJob) {
                effects.moneyChange += strThreshold.effects.trainingIncome;
                effects.messages.push(`Training inmates: +${strThreshold.effects.trainingIncome} credits`);
            }
        }

        // Good behavior income
        const behaviorThreshold = this.getThreshold('goodBehaviorPoints', player.goodBehaviorPoints || 0);
        if (behaviorThreshold && behaviorThreshold.effects.workReleaseProgram && player.hasWorkRelease) {
            effects.moneyChange += 20;
            effects.messages.push(`Work release: +20 credits`);
        }

        return effects;
    }

    /**
     * Get all current unlocks for a player
     */
    getPlayerUnlocks(player) {
        const unlocks = {
            intelligence: [],
            strength: [],
            hunger: [],
            behavior: [],
            achievements: []
        };

        // Intelligence unlocks
        const intThreshold = this.getThreshold('intelligence', player.intelligence || 0);
        if (intThreshold) {
            unlocks.intelligence = intThreshold.unlocks;
            if (intThreshold.effects.achievementUnlocked) {
                unlocks.achievements.push(intThreshold.effects.achievementUnlocked);
            }
        }

        // Strength unlocks
        const strThreshold = this.getThreshold('strength', player.strength || 0);
        if (strThreshold) {
            unlocks.strength = strThreshold.unlocks;
            if (strThreshold.effects.achievementUnlocked) {
                unlocks.achievements.push(strThreshold.effects.achievementUnlocked);
            }
        }

        // Hunger unlocks
        const hungerThreshold = this.getThreshold('hunger', player.hunger || 50);
        if (hungerThreshold) {
            unlocks.hunger = hungerThreshold.unlocks;
            if (hungerThreshold.effects.achievementUnlocked) {
                unlocks.achievements.push(hungerThreshold.effects.achievementUnlocked);
            }
        }

        // Good behavior unlocks
        const behaviorThreshold = this.getThreshold('goodBehaviorPoints', player.goodBehaviorPoints || 0);
        if (behaviorThreshold) {
            unlocks.behavior = behaviorThreshold.unlocks;
            if (behaviorThreshold.effects.achievementUnlocked) {
                unlocks.achievements.push(behaviorThreshold.effects.achievementUnlocked);
            }
        }

        return unlocks;
    }

    /**
     * Format threshold display for UI
     */
    formatThresholdDisplay(statName, value) {
        const threshold = this.getThreshold(statName, value);
        if (!threshold) return '';

        const nextThreshold = this.getNextThreshold(statName, value);

        let html = `
            <div class="stat-threshold-display" style="margin-top: 5px;">
                <div style="color: ${threshold.color}; font-weight: bold; font-size: 0.9em;">
                    ${threshold.tier}
                </div>
                <div style="font-size: 0.8em; color: #aaa; margin-top: 2px;">
                    ${threshold.effects.description}
                </div>
        `;

        if (nextThreshold) {
            const pointsNeeded = nextThreshold.min - value;
            html += `
                <div style="font-size: 0.75em; color: #ff0; margin-top: 5px;">
                    Next tier: ${nextThreshold.tier} (${pointsNeeded} points away)
                </div>
            `;
        }

        html += `</div>`;
        return html;
    }

    /**
     * Get next threshold tier
     */
    getNextThreshold(statName, currentValue) {
        const thresholds = this.thresholds[statName];
        if (!thresholds) return null;

        for (let tier of thresholds) {
            if (tier.min > currentValue) {
                return tier;
            }
        }

        return null;
    }

    /**
     * Get threshold color for UI styling
     */
    getThresholdColor(statName, value) {
        const threshold = this.getThreshold(statName, value);
        return threshold ? threshold.color : '#ffff44';
    }
}

// Make it globally available
if (typeof window !== 'undefined') {
    window.StatThresholdSystem = StatThresholdSystem;
}
