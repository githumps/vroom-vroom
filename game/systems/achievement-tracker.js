// VROOM VROOM - Achievement Tracking System
// Manages achievement progress, unlocks, and persistence

/**
 * Achievement Tracker
 *
 * Responsibilities:
 * - Track progress toward achievements
 * - Check achievement conditions
 * - Trigger unlock notifications
 * - Persist achievement data
 * - Provide achievement statistics
 */

class AchievementTracker {
    constructor(game) {
        this.game = game;
        this.achievements = null;
        this.notificationQueue = [];
        this.isShowingNotification = false;

        // Special counters for time-based achievements
        this.slowDrivingTimer = 0;
        this.policeEvadeTimer = 0;
        this.judgeAngerCount = 0;
        this.workoutCount = 0;
        this.fightWins = 0;
        this.fightCount = 0;
        this.purchaseCount = 0;
        this.activitiesDone = new Set();
        this.foodsEaten = new Set();

        this.initialized = false;
    }

    /**
     * Initialize achievement system
     * Load from player data or create new structure
     */
    init() {
        if (this.initialized) return;

        // Deep clone achievements from ACHIEVEMENTS constant
        this.achievements = JSON.parse(JSON.stringify(ACHIEVEMENTS));

        // Load saved achievement data from player object
        if (this.game.player.achievements) {
            this.loadFromPlayerData(this.game.player.achievements);
        }

        // Load counters
        if (this.game.player.achievementCounters) {
            const c = this.game.player.achievementCounters;
            this.slowDrivingTimer = c.slowDrivingTimer || 0;
            this.policeEvadeTimer = c.policeEvadeTimer || 0;
            this.judgeAngerCount = c.judgeAngerCount || 0;
            this.workoutCount = c.workoutCount || 0;
            this.fightWins = c.fightWins || 0;
            this.fightCount = c.fightCount || 0;
            this.purchaseCount = c.purchaseCount || 0;
            this.activitiesDone = new Set(c.activitiesDone || []);
            this.foodsEaten = new Set(c.foodsEaten || []);
        }

        this.initialized = true;
        console.log('[Achievements] System initialized with', Object.keys(this.achievements).length, 'achievements');
    }

    /**
     * Load achievement data from player save
     */
    loadFromPlayerData(savedAchievements) {
        Object.keys(savedAchievements).forEach(id => {
            if (this.achievements[id]) {
                this.achievements[id].unlocked = savedAchievements[id].unlocked || false;
                this.achievements[id].unlockedAt = savedAchievements[id].unlockedAt || null;
                this.achievements[id].progress = savedAchievements[id].progress || 0;
            }
        });
    }

    /**
     * Save achievement data to player object
     */
    saveToPlayerData() {
        const achievementData = {};
        Object.keys(this.achievements).forEach(id => {
            achievementData[id] = {
                unlocked: this.achievements[id].unlocked,
                unlockedAt: this.achievements[id].unlockedAt,
                progress: this.achievements[id].progress || 0
            };
        });

        this.game.player.achievements = achievementData;
        this.game.player.achievementCounters = {
            slowDrivingTimer: this.slowDrivingTimer,
            policeEvadeTimer: this.policeEvadeTimer,
            judgeAngerCount: this.judgeAngerCount,
            workoutCount: this.workoutCount,
            fightWins: this.fightWins,
            fightCount: this.fightCount,
            purchaseCount: this.purchaseCount,
            activitiesDone: Array.from(this.activitiesDone),
            foodsEaten: Array.from(this.foodsEaten)
        };
    }

    /**
     * Check a specific achievement and unlock if conditions met
     */
    checkAchievement(achievementId, forceCheck = false) {
        if (!this.initialized) this.init();

        const achievement = this.achievements[achievementId];
        if (!achievement) {
            console.warn('[Achievements] Achievement not found:', achievementId);
            return false;
        }

        // Already unlocked
        if (achievement.unlocked && !forceCheck) {
            return false;
        }

        // Check condition
        const conditionMet = achievement.checkCondition(this.game);
        if (conditionMet && !achievement.unlocked) {
            this.unlockAchievement(achievementId);
            return true;
        }

        return false;
    }

    /**
     * Check all achievements
     * Useful after major game events
     */
    checkAllAchievements() {
        if (!this.initialized) this.init();

        const unlockedCount = Object.keys(this.achievements)
            .filter(id => this.checkAchievement(id))
            .length;

        if (unlockedCount > 0) {
            console.log('[Achievements] Unlocked', unlockedCount, 'new achievements');
        }

        return unlockedCount;
    }

    /**
     * Manually unlock an achievement (for event-triggered achievements)
     */
    unlockAchievement(achievementId) {
        if (!this.initialized) this.init();

        const achievement = this.achievements[achievementId];
        if (!achievement) {
            console.warn('[Achievements] Achievement not found:', achievementId);
            return;
        }

        if (achievement.unlocked) {
            return; // Already unlocked
        }

        // Unlock it!
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();

        console.log('[Achievements] 🏆 UNLOCKED:', achievement.name);

        // Queue notification
        this.queueNotification(achievement);

        // Save immediately
        this.saveToPlayerData();
        this.game.saveGame();

        // Play sound
        if (this.game.soundSystem) {
            this.game.soundSystem.playAchievementUnlock(achievement.rarity);
        }
    }

    /**
     * Queue achievement notification
     */
    queueNotification(achievement) {
        this.notificationQueue.push(achievement);
        if (!this.isShowingNotification) {
            this.showNextNotification();
        }
    }

    /**
     * Show next notification in queue
     */
    showNextNotification() {
        if (this.notificationQueue.length === 0) {
            this.isShowingNotification = false;
            return;
        }

        this.isShowingNotification = true;
        const achievement = this.notificationQueue.shift();

        if (window.AchievementNotification) {
            window.AchievementNotification.show(achievement, () => {
                // After 5 seconds, show next
                setTimeout(() => {
                    this.showNextNotification();
                }, 500);
            });
        } else {
            // Fallback if notification system not loaded
            console.log('[Achievements] Notification system not available for:', achievement.name);
            this.isShowingNotification = false;
        }
    }

    // ========================================================================
    // EVENT TRACKING METHODS
    // Called from game.js during gameplay
    // ========================================================================

    /**
     * Track slow driving (called every frame during driving)
     */
    trackSlowDriving(speed, deltaTime) {
        if (speed < 5) {
            this.slowDrivingTimer += deltaTime;
            const achievement = this.achievements.slowpoke;
            if (achievement && !achievement.unlocked) {
                achievement.progress = Math.min(60, this.slowDrivingTimer);
                if (this.slowDrivingTimer >= 60) {
                    this.unlockAchievement('slowpoke');
                }
            }
        } else {
            this.slowDrivingTimer = 0;
            if (this.achievements.slowpoke && !this.achievements.slowpoke.unlocked) {
                this.achievements.slowpoke.progress = 0;
            }
        }
    }

    /**
     * Track police evasion (called every frame during chase)
     */
    trackPoliceEvasion(isBeingChased, deltaTime) {
        if (isBeingChased) {
            this.policeEvadeTimer += deltaTime;
            const achievement = this.achievements.untouchable;
            if (achievement && !achievement.unlocked) {
                achievement.progress = Math.min(300, this.policeEvadeTimer);
                if (this.policeEvadeTimer >= 300) {
                    this.unlockAchievement('untouchable');
                }
            }
        } else {
            this.policeEvadeTimer = 0;
            if (this.achievements.untouchable && !this.achievements.untouchable.unlocked) {
                this.achievements.untouchable.progress = 0;
            }
        }
    }

    /**
     * Track arrest
     */
    trackArrest() {
        this.checkAchievement('first_timer');

        const arrests = this.game.player.arrests || 0;
        if (this.achievements.frequent_flyer && !this.achievements.frequent_flyer.unlocked) {
            this.achievements.frequent_flyer.progress = Math.min(10, arrests);
        }
        if (this.achievements.career_criminal && !this.achievements.career_criminal.unlocked) {
            this.achievements.career_criminal.progress = Math.min(100, arrests);
        }

        this.checkAchievement('frequent_flyer');
        this.checkAchievement('career_criminal');
    }

    /**
     * Track judge anger
     */
    trackJudgeAnger() {
        this.judgeAngerCount++;
        const achievement = this.achievements.contempt_of_court;
        if (achievement && !achievement.unlocked) {
            achievement.progress = Math.min(10, this.judgeAngerCount);
            if (this.judgeAngerCount >= 10) {
                this.unlockAchievement('contempt_of_court');
            }
        }
    }

    /**
     * Track workout
     */
    trackWorkout() {
        this.workoutCount++;
        const achievement = this.achievements.gym_rat;
        if (achievement && !achievement.unlocked) {
            achievement.progress = Math.min(100, this.workoutCount);
            if (this.workoutCount >= 100) {
                this.unlockAchievement('gym_rat');
            }
        }
    }

    /**
     * Track fight
     */
    trackFight(won) {
        this.fightCount++;
        if (won) {
            this.fightWins++;
            const achievement = this.achievements.aggressive;
            if (achievement && !achievement.unlocked) {
                achievement.progress = Math.min(50, this.fightWins);
                if (this.fightWins >= 50) {
                    this.unlockAchievement('aggressive');
                }
            }
        }

        // Check pacifist (if never fought back for 30+ days)
        if (this.fightCount === 0 && (this.game.player.prisonDays || 0) >= 30) {
            this.unlockAchievement('pacifist');
        }
    }

    /**
     * Track purchase
     */
    trackPurchase() {
        this.purchaseCount++;
    }

    /**
     * Track prison activity
     */
    trackActivity(activityName) {
        this.activitiesDone.add(activityName);

        // Check completionist
        const requiredActivities = ['workout', 'library', 'yard', 'cafeteria', 'shower', 'sleep', 'work', 'tattoo'];
        const hasAllActivities = requiredActivities.every(act => this.activitiesDone.has(act));

        if (hasAllActivities) {
            this.unlockAchievement('completionist');
        }
    }

    /**
     * Track food eaten
     */
    trackFoodEaten(foodType) {
        this.foodsEaten.add(foodType);

        // Check master chef (all 5 food types)
        const requiredFoods = ['mystery_meat', 'rice', 'beans', 'bread', 'apple'];
        const hasAllFoods = requiredFoods.every(food => this.foodsEaten.has(food));

        if (hasAllFoods) {
            this.unlockAchievement('master_chef');
        }
    }

    /**
     * Check minimalist (30 days with 0 purchases)
     */
    checkMinimalist() {
        if (this.purchaseCount === 0 && (this.game.player.prisonDays || 0) >= 30) {
            this.unlockAchievement('minimalist');
        }
    }

    /**
     * Check stat-based achievements
     */
    checkStatAchievements() {
        this.checkAchievement('bookworm');
        this.checkAchievement('ink_addict');
        this.checkAchievement('gang_leader');
        this.checkAchievement('model_prisoner');
        this.checkAchievement('troublemaker');
        this.checkAchievement('millionaire');
        this.checkAchievement('cigarette_baron');
    }

    /**
     * Check sentence-based achievements
     */
    checkSentenceAchievements() {
        this.checkAchievement('eternal_prisoner');
        this.checkAchievement('lifer');
        this.checkAchievement('immortal');
        this.checkAchievement('time_lord');
    }

    // ========================================================================
    // STATISTICS AND QUERIES
    // ========================================================================

    /**
     * Get total unlocked count
     */
    getUnlockedCount() {
        return Object.values(this.achievements).filter(a => a.unlocked).length;
    }

    /**
     * Get total achievement count
     */
    getTotalCount() {
        return Object.keys(this.achievements).length;
    }

    /**
     * Get total points earned
     */
    getTotalPoints() {
        return getTotalAchievementPoints(this.achievements);
    }

    /**
     * Get max possible points
     */
    getMaxPoints() {
        return Object.values(this.achievements).reduce((sum, a) => sum + a.points, 0);
    }

    /**
     * Get achievements by category
     */
    getByCategory(category) {
        return Object.values(this.achievements).filter(a => a.category === category);
    }

    /**
     * Get unlocked achievements
     */
    getUnlocked() {
        return Object.values(this.achievements).filter(a => a.unlocked);
    }

    /**
     * Get locked achievements
     */
    getLocked() {
        return Object.values(this.achievements).filter(a => !a.unlocked);
    }

    /**
     * Get achievement by ID
     */
    getAchievement(id) {
        return this.achievements[id] || null;
    }

    /**
     * Get all achievements
     */
    getAllAchievements() {
        return Object.values(this.achievements);
    }

    /**
     * Get completion percentage
     */
    getCompletionPercentage() {
        const total = this.getTotalCount();
        const unlocked = this.getUnlockedCount();
        return total > 0 ? Math.round((unlocked / total) * 100) : 0;
    }
}

// Export for use in game
if (typeof window !== 'undefined') {
    window.AchievementTracker = AchievementTracker;
}
