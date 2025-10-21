/**
 * STAT EFFECTS SYSTEM
 * Applies daily passive effects and cascading consequences based on player stats
 * Integrates with StatThresholdSystem to make stats matter
 *
 * Version: 1.0.0
 * Created: 2025-10-20
 */

class StatEffectsSystem {
    constructor(game, thresholdSystem) {
        this.game = game;
        this.thresholds = thresholdSystem;
        this.lastEffectsApplied = Date.now();
        this.effectHistory = []; // Track recent effects for UI
    }

    /**
     * Apply daily passive effects when time passes
     * Call this during time advancement (each day in prison)
     */
    applyDailyEffects() {
        const player = this.game.player;
        const effects = this.thresholds.getDailyEffects(player);

        // Apply stat changes
        if (effects.strengthChange !== 0) {
            player.strength = Math.max(0, Math.min(100, player.strength + effects.strengthChange));
        }

        if (effects.intelligenceChange !== 0) {
            player.intelligence = Math.max(0, Math.min(100, player.intelligence + effects.intelligenceChange));
        }

        if (effects.moneyChange !== 0) {
            player.money = Math.max(0, player.money + effects.moneyChange);
        }

        if (effects.cigarettesChange !== 0) {
            player.cigarettes = Math.max(0, player.cigarettes + effects.cigarettesChange);
        }

        // Store effect messages
        if (effects.messages.length > 0) {
            this.effectHistory.push({
                timestamp: Date.now(),
                messages: effects.messages
            });

            // Keep only last 10 days of effects
            if (this.effectHistory.length > 10) {
                this.effectHistory.shift();
            }

            // Show messages to player
            this.showEffectNotification(effects.messages);
        }

        // Check for special events triggered by stats
        this.checkSpecialEvents();

        // Save game after applying effects
        this.game.saveGame();
    }

    /**
     * Show notification of daily effects
     */
    showEffectNotification(messages) {
        if (messages.length === 0) return;

        const notification = document.createElement('div');
        notification.className = 'stat-effect-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #ff0;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;

        let html = '<div style="color: #ff0; font-weight: bold; margin-bottom: 8px;">DAILY EFFECTS</div>';
        messages.forEach(msg => {
            const color = msg.includes('-') ? '#f44' : (msg.includes('+') ? '#4f4' : '#fff');
            html += `<div style="color: ${color}; font-size: 0.9em; margin: 4px 0;">${msg}</div>`;
        });

        notification.innerHTML = html;
        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    /**
     * Check for special events triggered by stat thresholds
     */
    checkSpecialEvents() {
        const player = this.game.player;

        // Starvation collapse event
        const hungerThreshold = this.thresholds.getThreshold('hunger', player.hunger || 50);
        if (hungerThreshold && hungerThreshold.effects.collapseRisk) {
            if (Math.random() < hungerThreshold.effects.collapseRisk) {
                this.triggerCollapseEvent();
            }
        }

        // Solitary confinement risk
        const behaviorThreshold = this.thresholds.getThreshold('goodBehaviorPoints', player.goodBehaviorPoints || 0);
        if (behaviorThreshold && behaviorThreshold.effects.solitaryRisk) {
            if (Math.random() < behaviorThreshold.effects.solitaryRisk) {
                this.triggerSolitaryEvent();
            }
        }

        // Check for achievement unlocks
        this.checkAchievements();
    }

    /**
     * Trigger starvation collapse event
     */
    triggerCollapseEvent() {
        const messages = [
            'You collapse from hunger in the yard. The guards drag you to your cell.',
            'Weakness overcomes you. You black out. When you wake, a day has passed.',
            'Your vision goes dark. Malnutrition has taken its toll. You lose consciousness.',
            'The world spins. You fall. The concrete is cold. Everything fades to black.'
        ];

        const message = messages[Math.floor(Math.random() * messages.length)];

        this.game.showMessage(message, 5000);

        // Lose a day
        this.game.player.prisonDays += 1;

        // Guards force-feed you (hunger goes to 40)
        this.game.player.hunger = 40;

        this.game.saveGame();
    }

    /**
     * Trigger solitary confinement event
     */
    triggerSolitaryEvent() {
        const reasons = [
            'You mouthed off to a guard. Bad move. They throw you in solitary.',
            'A guard catches you plotting something. Into the hole you go.',
            'Your bad behavior has consequences. Welcome to solitary confinement.',
            'They decide to make an example of you. 24 hours in the hole.'
        ];

        const reason = reasons[Math.floor(Math.random() * reasons.length)];

        this.game.showMessage(`SOLITARY CONFINEMENT: ${reason}`, 5000);

        // Lose a day and some good behavior
        this.game.player.prisonDays += 1;
        this.game.player.goodBehaviorPoints = Math.max(0, this.game.player.goodBehaviorPoints - 10);

        // Solitary is boring - lose some intelligence
        this.game.player.intelligence = Math.max(0, this.game.player.intelligence - 2);

        this.game.saveGame();
    }

    /**
     * Check and unlock achievements based on stats
     */
    checkAchievements() {
        const player = this.game.player;
        if (!player.achievements) player.achievements = [];

        const stats = {
            intelligence: player.intelligence || 0,
            strength: player.strength || 0,
            hunger: player.hunger || 50,
            goodBehaviorPoints: player.goodBehaviorPoints || 0
        };

        // Check each stat for achievement-worthy thresholds
        Object.keys(stats).forEach(statName => {
            const threshold = this.thresholds.getThreshold(statName, stats[statName]);
            if (threshold && threshold.effects.achievementUnlocked) {
                const achievementName = threshold.effects.achievementUnlocked;

                // Only unlock once
                if (!player.achievements.includes(achievementName)) {
                    player.achievements.push(achievementName);
                    this.showAchievementUnlock(achievementName, threshold.tier);
                }
            }
        });
    }

    /**
     * Show achievement unlock animation
     */
    showAchievementUnlock(name, tier) {
        const achievement = document.createElement('div');
        achievement.className = 'achievement-unlock';
        achievement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            border: 3px solid #0ff;
            padding: 30px 40px;
            border-radius: 10px;
            z-index: 10001;
            text-align: center;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
            animation: achievementPulse 2s ease-out;
        `;

        achievement.innerHTML = `
            <div style="font-size: 3em; margin-bottom: 10px;">🏆</div>
            <div style="color: #0ff; font-size: 1.5em; font-weight: bold; margin-bottom: 10px;">
                ACHIEVEMENT UNLOCKED
            </div>
            <div style="color: #fff; font-size: 1.2em; margin-bottom: 5px;">
                ${name}
            </div>
            <div style="color: #ff0; font-size: 0.9em;">
                ${tier}
            </div>
        `;

        document.body.appendChild(achievement);

        // Play achievement sound if available
        if (this.game.soundSystem && this.game.soundSystem.playGavelStrike) {
            this.game.soundSystem.playGavelStrike();
        }

        // Remove after 4 seconds
        setTimeout(() => {
            achievement.style.animation = 'fadeOut 0.5s ease-in';
            setTimeout(() => achievement.remove(), 500);
        }, 4000);
    }

    /**
     * Apply stat modifiers to activity outcomes
     */
    modifyActivityGain(baseGain, activityType) {
        const player = this.game.player;
        let finalGain = baseGain;

        // General stat gain modifier (hunger affects everything)
        const generalModifier = this.thresholds.getStatGainModifier(player);
        finalGain *= generalModifier;

        // Activity-specific modifiers
        switch (activityType) {
            case 'strength':
                const strengthModifier = this.thresholds.getStrengthGainMultiplier(player);
                finalGain *= strengthModifier;
                break;

            case 'intelligence':
                // Well-fed bonus applies
                break;

            case 'gang':
                const gangModifier = this.thresholds.getGangRepModifier(player);
                finalGain *= gangModifier;
                break;
        }

        return Math.round(finalGain);
    }

    /**
     * Modify purchase price based on stat bonuses
     */
    modifyPrice(basePrice, itemName) {
        const modifier = this.thresholds.getPriceModifier(this.game.player);
        const finalPrice = Math.ceil(basePrice * modifier);

        return finalPrice;
    }

    /**
     * Check if bullying should occur (strength-based)
     */
    checkBullyingEvent() {
        const player = this.game.player;
        const strThreshold = this.thresholds.getThreshold('strength', player.strength || 0);

        if (!strThreshold) return null;

        // If player is weak, bullying always happens
        if (strThreshold.effects.getBullied) {
            return {
                happened: true,
                defended: false,
                message: 'A larger inmate takes your cigarettes. You\'re too weak to resist.',
                cigarettesLost: strThreshold.effects.cigaretteLoss
            };
        }

        // If player is average, there's a chance to defend
        if (strThreshold.effects.defendChance !== undefined) {
            const bullyAttempt = Math.random() < 0.3; // 30% chance someone tries
            if (bullyAttempt) {
                const defended = Math.random() < strThreshold.effects.defendChance;
                return {
                    happened: true,
                    defended: defended,
                    message: defended
                        ? 'Someone tries to intimidate you. You stand your ground. They back off.'
                        : 'Someone pushes you around and takes your stuff. You tried to fight back but failed.',
                    cigarettesLost: defended ? 0 : 3
                };
            }
        }

        // If player is strong enough to intimidate, no bullying
        if (strThreshold.effects.intimidateBullies || strThreshold.effects.neverBullied) {
            return {
                happened: false,
                defended: true,
                message: 'Other inmates keep their distance. They know better.',
                cigarettesLost: 0
            };
        }

        return null;
    }

    /**
     * Get reading speed modifier based on hunger
     */
    getReadingSpeedModifier() {
        const player = this.game.player;
        const hungerThreshold = this.thresholds.getThreshold('hunger', player.hunger || 50);

        if (hungerThreshold && hungerThreshold.effects.activityTimePenalty) {
            return hungerThreshold.effects.activityTimePenalty;
        }

        return 1.0; // Normal speed
    }

    /**
     * Check if player misses details while reading (hunger-based)
     */
    checkReadingDistraction() {
        const player = this.game.player;
        const hungerThreshold = this.thresholds.getThreshold('hunger', player.hunger || 50);

        if (hungerThreshold && hungerThreshold.effects.distractedReading) {
            return Math.random() < 0.3; // 30% chance to miss intelligence gain
        }

        return false;
    }

    /**
     * Get sentence reduction from intelligence and good behavior
     */
    getSentenceReduction() {
        const player = this.game.player;
        let totalReduction = 0;

        // Intelligence-based reduction
        const intThreshold = this.thresholds.getThreshold('intelligence', player.intelligence || 0);
        if (intThreshold && intThreshold.effects.sentenceReduction) {
            totalReduction += intThreshold.effects.sentenceReduction;
        }

        // Good behavior reduction
        const behaviorThreshold = this.thresholds.getThreshold('goodBehaviorPoints', player.goodBehaviorPoints || 0);
        if (behaviorThreshold && behaviorThreshold.effects.sentenceReduction) {
            totalReduction += behaviorThreshold.effects.sentenceReduction;
        }

        return totalReduction;
    }

    /**
     * Apply sentence reduction (call when calculating release)
     */
    getModifiedSentence(originalSentence) {
        const reduction = this.getSentenceReduction();
        const reducedSentence = originalSentence * (1 - reduction);

        return Math.max(1, Math.ceil(reducedSentence)); // Minimum 1 day
    }

    /**
     * Get current stat threshold info for UI display
     */
    getStatThresholdInfo(statName) {
        const player = this.game.player;
        let value = 0;

        switch (statName) {
            case 'intelligence':
                value = player.intelligence || 0;
                break;
            case 'strength':
                value = player.strength || 0;
                break;
            case 'hunger':
                value = player.hunger || 50;
                break;
            case 'goodBehaviorPoints':
                value = player.goodBehaviorPoints || 0;
                break;
        }

        return {
            value: value,
            threshold: this.thresholds.getThreshold(statName, value),
            nextThreshold: this.thresholds.getNextThreshold(statName, value),
            color: this.thresholds.getThresholdColor(statName, value)
        };
    }

    /**
     * Get special dialogue options based on stats
     */
    getSpecialDialogueOptions(context) {
        const player = this.game.player;
        const options = [];

        const intThreshold = this.thresholds.getThreshold('intelligence', player.intelligence || 0);
        const strThreshold = this.thresholds.getThreshold('strength', player.strength || 0);
        const behaviorThreshold = this.thresholds.getThreshold('goodBehaviorPoints', player.goodBehaviorPoints || 0);

        // Intelligence-based dialogue
        if (intThreshold) {
            if (intThreshold.effects.hiddenDialogue && context === 'guard') {
                options.push({
                    text: '[Intelligence] Point out the legal inconsistency in their accusation',
                    effect: 'Guard backs off, impressed by your knowledge'
                });
            }
            if (intThreshold.effects.negotiateWithGuards && context === 'bribery') {
                options.push({
                    text: '[Intelligence] Negotiate a better deal using logic',
                    effect: '20% discount on bribery cost'
                });
            }
        }

        // Strength-based dialogue
        if (strThreshold) {
            if (strThreshold.effects.intimidationDialogue && context === 'confrontation') {
                options.push({
                    text: '[Strength] Flex menacingly without saying a word',
                    effect: 'Opponent backs down immediately'
                });
            }
        }

        // Good behavior dialogue
        if (behaviorThreshold && behaviorThreshold.effects.guardFavors && context === 'guard') {
            options.push({
                text: '[Good Behavior] Politely remind them you\'ve been a model prisoner',
                effect: 'Guard grants you a small favor'
            });
        }

        return options;
    }

    /**
     * Check if player can access special escape routes
     */
    getUnlockedEscapeRoutes() {
        const player = this.game.player;
        const routes = [];

        const intThreshold = this.thresholds.getThreshold('intelligence', player.intelligence || 0);
        if (intThreshold && intThreshold.effects.prisonBlueprints) {
            routes.push({
                name: 'Ventilation System',
                description: 'You discovered the ventilation blueprints. There\'s a path through the vents.',
                requirement: 'Intelligence 80+'
            });
        }

        const strThreshold = this.thresholds.getThreshold('strength', player.strength || 0);
        if (strThreshold && strThreshold.effects.breakThroughWall) {
            routes.push({
                name: 'Break Through Wall',
                description: 'You\'re strong enough to literally break through the cell wall.',
                requirement: 'Strength 100'
            });
        }

        return routes;
    }
}

// Add CSS animations for notifications
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        @keyframes achievementPulse {
            0% {
                transform: translate(-50%, -50%) scale(0.5);
                opacity: 0;
            }
            50% {
                transform: translate(-50%, -50%) scale(1.1);
            }
            100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Make it globally available
if (typeof window !== 'undefined') {
    window.StatEffectsSystem = StatEffectsSystem;
}
