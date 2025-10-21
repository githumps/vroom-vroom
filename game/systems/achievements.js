// VROOM VROOM - Achievement System Data Structure
// 30 achievements designed for viral shareability, retention, and player goals

/**
 * Achievement System - Complete Data Structure
 *
 * Features:
 * - 30 unique achievements across driving, courtroom, prison, meta, and absurd categories
 * - Rarity system (common, uncommon, rare, legendary)
 * - Point system for completionists
 * - Progress tracking for multi-step achievements
 * - Shareable achievement unlocks
 */

const ACHIEVEMENTS = {
    // ========================================================================
    // DRIVING ACHIEVEMENTS (6 total)
    // ========================================================================

    speed_demon: {
        id: 'speed_demon',
        category: 'driving',
        name: 'Speed Demon',
        desc: 'Hit 100 mph',
        icon: '🏎️',
        rarity: 'uncommon',
        points: 15,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => game.player.speed >= 100
    },

    slowpoke: {
        id: 'slowpoke',
        category: 'driving',
        name: 'Slowpoke',
        desc: 'Drive under 5 mph for 60 seconds',
        icon: '🐌',
        rarity: 'uncommon',
        points: 15,
        unlocked: false,
        unlockedAt: null,
        progress: 0,
        maxProgress: 60,
        checkCondition: (game) => {
            // This requires continuous tracking in game loop
            return false; // Tracked externally
        }
    },

    untouchable: {
        id: 'untouchable',
        category: 'driving',
        name: 'Untouchable',
        desc: 'Evade police for 5 minutes',
        icon: '👻',
        rarity: 'rare',
        points: 25,
        unlocked: false,
        unlockedAt: null,
        progress: 0,
        maxProgress: 300,
        checkCondition: (game) => {
            // Tracked externally during chase
            return false;
        }
    },

    first_timer: {
        id: 'first_timer',
        category: 'driving',
        name: 'First Timer',
        desc: 'Get arrested (your first arrest)',
        icon: '🚨',
        rarity: 'common',
        points: 10,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => game.player.arrests >= 1
    },

    frequent_flyer: {
        id: 'frequent_flyer',
        category: 'driving',
        name: 'Frequent Flyer',
        desc: 'Get arrested 10 times',
        icon: '🚓',
        rarity: 'uncommon',
        points: 20,
        unlocked: false,
        unlockedAt: null,
        progress: 0,
        maxProgress: 10,
        checkCondition: (game) => game.player.arrests >= 10
    },

    career_criminal: {
        id: 'career_criminal',
        category: 'driving',
        name: 'Career Criminal',
        desc: 'Get arrested 100 times',
        icon: '🏆',
        rarity: 'legendary',
        points: 100,
        unlocked: false,
        unlockedAt: null,
        progress: 0,
        maxProgress: 100,
        checkCondition: (game) => game.player.arrests >= 100
    },

    // ========================================================================
    // COURTROOM ACHIEVEMENTS (6 total)
    // ========================================================================

    lawyer_up: {
        id: 'lawyer_up',
        category: 'courtroom',
        name: 'Lawyer Up',
        desc: 'Cite actual traffic law (INT 100 required)',
        icon: '⚖️',
        rarity: 'rare',
        points: 30,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => false // Manual trigger from courtroom
    },

    contempt_of_court: {
        id: 'contempt_of_court',
        category: 'courtroom',
        name: 'Contempt of Court',
        desc: 'Anger Judge 10 times',
        icon: '😡',
        rarity: 'uncommon',
        points: 20,
        unlocked: false,
        unlockedAt: null,
        progress: 0,
        maxProgress: 10,
        checkCondition: (game) => {
            // Tracked via judge anger events
            return false;
        }
    },

    perfect_form: {
        id: 'perfect_form',
        category: 'courtroom',
        name: 'Perfect Form',
        desc: 'Submit flawless paperwork',
        icon: '📝',
        rarity: 'uncommon',
        points: 20,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => false // Manual trigger
    },

    speed_reader: {
        id: 'speed_reader',
        category: 'courtroom',
        name: 'Speed Reader',
        desc: 'Complete form in under 30 seconds',
        icon: '⏱️',
        rarity: 'rare',
        points: 25,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => false // Manual trigger with timer
    },

    objection: {
        id: 'objection',
        category: 'courtroom',
        name: 'Objection!',
        desc: 'Catch contradiction in form',
        icon: '❗',
        rarity: 'rare',
        points: 30,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => false // Manual trigger
    },

    guilty_as_charged: {
        id: 'guilty_as_charged',
        category: 'courtroom',
        name: 'Guilty as Charged',
        desc: 'Accept all charges without objection',
        icon: '🙋',
        rarity: 'common',
        points: 10,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => false // Manual trigger
    },

    // ========================================================================
    // PRISON ACHIEVEMENTS (8 total)
    // ========================================================================

    bookworm: {
        id: 'bookworm',
        category: 'prison',
        name: 'Bookworm',
        desc: 'Read 100 books',
        icon: '📚',
        rarity: 'rare',
        points: 30,
        unlocked: false,
        unlockedAt: null,
        progress: 0,
        maxProgress: 100,
        checkCondition: (game) => (game.player.booksRead?.length || 0) >= 100
    },

    gym_rat: {
        id: 'gym_rat',
        category: 'prison',
        name: 'Gym Rat',
        desc: 'Work out 100 times',
        icon: '💪',
        rarity: 'rare',
        points: 30,
        unlocked: false,
        unlockedAt: null,
        progress: 0,
        maxProgress: 100,
        checkCondition: (game) => false // Tracked via workout count
    },

    ink_addict: {
        id: 'ink_addict',
        category: 'prison',
        name: 'Ink Addict',
        desc: 'Get 10 tattoos',
        icon: '🎨',
        rarity: 'uncommon',
        points: 20,
        unlocked: false,
        unlockedAt: null,
        progress: 0,
        maxProgress: 10,
        checkCondition: (game) => (game.player.tattoos?.length || 0) >= 10
    },

    master_chef: {
        id: 'master_chef',
        category: 'prison',
        name: 'Master Chef',
        desc: 'Eat every food type',
        icon: '🍽️',
        rarity: 'uncommon',
        points: 15,
        unlocked: false,
        unlockedAt: null,
        foodsEaten: [],
        checkCondition: (game) => false // Tracked via food types
    },

    gang_leader: {
        id: 'gang_leader',
        category: 'prison',
        name: 'Gang Leader',
        desc: 'Max reputation with any gang',
        icon: '👊',
        rarity: 'rare',
        points: 30,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => {
            const reps = game.player.gangRep || {};
            return Object.values(reps).some(rep => rep >= 100);
        }
    },

    model_prisoner: {
        id: 'model_prisoner',
        category: 'prison',
        name: 'Model Prisoner',
        desc: 'Reach 100 good behavior points',
        icon: '⭐',
        rarity: 'uncommon',
        points: 20,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => (game.player.goodBehavior || 0) >= 100
    },

    troublemaker: {
        id: 'troublemaker',
        category: 'prison',
        name: 'Troublemaker',
        desc: 'Drop to 0 good behavior points',
        icon: '😈',
        rarity: 'uncommon',
        points: 20,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => (game.player.goodBehavior || 100) <= 0
    },

    escape_artist: {
        id: 'escape_artist',
        category: 'prison',
        name: 'Escape Artist',
        desc: 'Successfully escape from prison',
        icon: '🏃',
        rarity: 'legendary',
        points: 50,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => false // Manual trigger
    },

    // ========================================================================
    // META ACHIEVEMENTS (6 total)
    // ========================================================================

    completionist: {
        id: 'completionist',
        category: 'meta',
        name: 'Completionist',
        desc: 'Do every prison activity at least once',
        icon: '✅',
        rarity: 'rare',
        points: 35,
        unlocked: false,
        unlockedAt: null,
        activitiesDone: [],
        checkCondition: (game) => false // Tracked via activity completion
    },

    millionaire: {
        id: 'millionaire',
        category: 'meta',
        name: 'Millionaire',
        desc: 'Accumulate 1000+ credits',
        icon: '💰',
        rarity: 'rare',
        points: 30,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => (game.player.money || 0) >= 1000
    },

    cigarette_baron: {
        id: 'cigarette_baron',
        category: 'meta',
        name: 'Cigarette Baron',
        desc: 'Accumulate 500+ cigarettes',
        icon: '🚬',
        rarity: 'rare',
        points: 30,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => (game.player.cigarettes || 0) >= 500
    },

    minimalist: {
        id: 'minimalist',
        category: 'meta',
        name: 'Minimalist',
        desc: 'Complete 30 days with 0 purchases',
        icon: '🎯',
        rarity: 'rare',
        points: 35,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => false // Tracked via purchase history
    },

    pacifist: {
        id: 'pacifist',
        category: 'meta',
        name: 'Pacifist',
        desc: 'Never fight back (30+ days)',
        icon: '☮️',
        rarity: 'uncommon',
        points: 25,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => false // Tracked via fight events
    },

    aggressive: {
        id: 'aggressive',
        category: 'meta',
        name: 'Aggressive',
        desc: 'Win 50 fights',
        icon: '🥊',
        rarity: 'rare',
        points: 30,
        unlocked: false,
        unlockedAt: null,
        progress: 0,
        maxProgress: 50,
        checkCondition: (game) => false // Tracked via fight wins
    },

    // ========================================================================
    // ABSURD ACHIEVEMENTS (4 total)
    // ========================================================================

    eternal_prisoner: {
        id: 'eternal_prisoner',
        category: 'absurd',
        name: 'Eternal Prisoner',
        desc: 'Receive a sentence over 100 years',
        icon: '⏳',
        rarity: 'uncommon',
        points: 20,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => (game.player.sentence || 0) >= 36500 // 100 years in days
    },

    lifer: {
        id: 'lifer',
        category: 'absurd',
        name: 'Lifer',
        desc: 'Receive a sentence over 1,000 years',
        icon: '🪦',
        rarity: 'rare',
        points: 30,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => (game.player.sentence || 0) >= 365000 // 1000 years in days
    },

    immortal: {
        id: 'immortal',
        category: 'absurd',
        name: 'Immortal',
        desc: 'Receive a sentence over 10,000 years',
        icon: '👴',
        rarity: 'legendary',
        points: 50,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => (game.player.sentence || 0) >= 3650000 // 10,000 years in days
    },

    time_lord: {
        id: 'time_lord',
        category: 'absurd',
        name: 'Time Lord',
        desc: 'Receive a sentence over 100,000 years',
        icon: '⏰',
        rarity: 'legendary',
        points: 100,
        unlocked: false,
        unlockedAt: null,
        checkCondition: (game) => (game.player.sentence || 0) >= 36500000 // 100,000 years in days
    }
};

// Achievement categories for filtering
const ACHIEVEMENT_CATEGORIES = {
    all: 'All Achievements',
    driving: 'Driving',
    courtroom: 'Courtroom',
    prison: 'Prison',
    meta: 'Meta',
    absurd: 'Absurd'
};

// Rarity configuration
const ACHIEVEMENT_RARITIES = {
    common: {
        name: 'Common',
        color: '#999999',
        glowColor: '#cccccc'
    },
    uncommon: {
        name: 'Uncommon',
        color: '#4CAF50',
        glowColor: '#81C784'
    },
    rare: {
        name: 'Rare',
        color: '#2196F3',
        glowColor: '#64B5F6'
    },
    legendary: {
        name: 'Legendary',
        color: '#FFD700',
        glowColor: '#FFE55C'
    }
};

// Helper function to get total points
function getTotalAchievementPoints(achievements) {
    return Object.values(achievements)
        .filter(ach => ach.unlocked)
        .reduce((sum, ach) => sum + ach.points, 0);
}

// Helper function to get achievement count by category
function getAchievementCountByCategory(achievements) {
    const counts = {};
    Object.values(ACHIEVEMENT_CATEGORIES).forEach(cat => {
        counts[cat] = { total: 0, unlocked: 0 };
    });

    Object.values(achievements).forEach(ach => {
        const category = ACHIEVEMENT_CATEGORIES[ach.category] || 'All Achievements';
        counts[category].total++;
        if (ach.unlocked) {
            counts[category].unlocked++;
        }
        counts['All Achievements'].total++;
        if (ach.unlocked) {
            counts['All Achievements'].unlocked++;
        }
    });

    return counts;
}

// Helper function to generate share text
function getAchievementShareText(achievement) {
    const messages = [
        `🏆 I just unlocked "${achievement.name}" in VROOM VROOM! ${achievement.desc}`,
        `Achievement Unlocked: ${achievement.name} - ${achievement.desc} 🎮`,
        `Just got "${achievement.name}" in VROOM VROOM! (${achievement.points} points) 🚗`,
        `${achievement.icon} ${achievement.name}: ${achievement.desc} | Playing VROOM VROOM`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ACHIEVEMENTS,
        ACHIEVEMENT_CATEGORIES,
        ACHIEVEMENT_RARITIES,
        getTotalAchievementPoints,
        getAchievementCountByCategory,
        getAchievementShareText
    };
}
