// ============================================================================
// GUARD MANICURE SYSTEM - INTEGRATION CODE FOR GAME.JS
// ============================================================================
// Copy these methods into your main Game class in game.js

// ============================================================================
// 1. INITIALIZATION - Add to constructor or init()
// ============================================================================
initializeManicureSystem() {
    this.manicureSystem = new GuardManicureSystem(this);
}

// ============================================================================
// 2. PRISON ACTIVITY HANDLER - Add to existing prisonActivity() method
// ============================================================================
// Add this case to your prisonActivity switch/if statements:
if (activity === 'manicure') {
    this.manicureSystem.startManicure();
    return;
}

// ============================================================================
// 3. SHOW GUARD FAVORS MENU
// ============================================================================
showGuardFavorsMenu() {
    const tokens = this.player.favorTokens || 0;
    document.getElementById('favorTokenCount').textContent = tokens;
    this.showScreen('guardFavorsMenu');
}

// ============================================================================
// 4. SPEND FAVOR TOKENS
// ============================================================================
spendFavorToken(type) {
    const tokens = this.player.favorTokens || 0;

    const costs = {
        ignore: 1,
        cigarettes: 2,
        contraband: 3,
        escape: 3,
        reduce: 4
    };

    const cost = costs[type];

    if (tokens < cost) {
        this.showMessage(`Not enough favor tokens! Need ${cost}, have ${tokens}.`, 3000);
        return;
    }

    // Deduct tokens
    this.player.favorTokens -= cost;

    // Apply benefit
    switch(type) {
        case 'ignore':
            if (!this.player.guardFavors) {
                this.player.guardFavors = {};
            }
            this.player.guardFavors.ignoreViolation = true;
            this.showMessage('Guard will ignore your next minor violation.', 3000);
            break;

        case 'cigarettes':
            if (!this.player.inventory) {
                this.player.inventory = {};
            }
            this.player.inventory.cigarettes = (this.player.inventory.cigarettes || 0) + 20;
            this.player.cigarettes = (this.player.cigarettes || 0) + 20;
            this.showMessage('Received 20 cigarettes! Guard looked the other way.', 3000);
            break;

        case 'contraband':
            const contrabandItems = ['phone', 'screwdriver', 'magazine', 'chocolate', 'map'];
            const randomItem = contrabandItems[Math.floor(Math.random() * contrabandItems.length)];
            if (!this.player.inventory) {
                this.player.inventory = {};
            }
            this.player.inventory[randomItem] = (this.player.inventory[randomItem] || 0) + 1;
            this.showMessage(`Received contraband: ${randomItem}! Don't get caught.`, 3000);
            break;

        case 'escape':
            // Boost escape success rate
            if (this.player.escapeProgress) {
                Object.keys(this.player.escapeProgress).forEach(route => {
                    if (this.player.escapeProgress[route].progress !== undefined) {
                        this.player.escapeProgress[route].progress += 15;
                    }
                });
            }
            this.showMessage('Guard looked away during escape prep. +15% success rate!', 3000);
            break;

        case 'reduce':
            this.player.prisonDays = Math.max(0, this.player.prisonDays - 7);
            this.showMessage('Paperwork "adjusted". Sentence reduced by 7 days!', 3000);

            // Update prison UI if method exists
            if (typeof this.updatePrisonUI === 'function') {
                this.updatePrisonUI();
            }

            // Update time served display
            if (document.getElementById('timeServed')) {
                document.getElementById('timeServed').textContent = Math.floor(this.player.prisonDays);
            }
            break;
    }

    // Update display and save
    document.getElementById('favorTokenCount').textContent = this.player.favorTokens;
    if (document.getElementById('favorTokensDisplay')) {
        document.getElementById('favorTokensDisplay').textContent = this.player.favorTokens;
    }
    this.saveGame();
}

// ============================================================================
// 5. UPDATE PLAYER OBJECT - Add these properties to your player initialization
// ============================================================================
/*
Add these to your player object in constructor or createNewPlayer():

this.player = {
    // ... existing properties ...

    // Guard manicure system
    favorTokens: 0,
    guardManicures: {},
    guardFavors: {
        ignoreViolation: false
    },
    goodBehavior: 100
};
*/

// ============================================================================
// 6. SAVE/LOAD SUPPORT - Add to saveGame() and loadGame() methods
// ============================================================================
/*
In saveGame():
    favorTokens: this.player.favorTokens || 0,
    guardManicures: this.player.guardManicures || {},
    guardFavors: this.player.guardFavors || {},
    goodBehavior: this.player.goodBehavior || 100

In loadGame() after loading save data:
    this.player.favorTokens = saveData.favorTokens || 0;
    this.player.guardManicures = saveData.guardManicures || {};
    this.player.guardFavors = saveData.guardFavors || {};
    this.player.goodBehavior = saveData.goodBehavior || 100;
*/

// ============================================================================
// 7. UPDATE PRISON UI - Add favor token display updates
// ============================================================================
/*
Add this to your showScreen() method or wherever you update the prison menu:

if (screen === 'prisonMenu') {
    const favorTokens = this.player.favorTokens || 0;
    if (document.getElementById('favorTokensDisplay')) {
        document.getElementById('favorTokensDisplay').textContent = favorTokens;
    }
}
*/

// ============================================================================
// COMPLETE EXAMPLE INTEGRATION
// ============================================================================
/*

class Game {
    constructor() {
        // ... existing initialization ...

        // Initialize manicure system
        this.initializeManicureSystem();

        this.player = {
            name: '',
            // ... existing properties ...
            favorTokens: 0,
            guardManicures: {},
            guardFavors: { ignoreViolation: false },
            goodBehavior: 100
        };
    }

    initializeManicureSystem() {
        this.manicureSystem = new GuardManicureSystem(this);
    }

    prisonActivity(activity) {
        if (activity === 'manicure') {
            this.manicureSystem.startManicure();
            return;
        }

        // ... rest of existing prisonActivity code ...
    }

    showGuardFavorsMenu() {
        const tokens = this.player.favorTokens || 0;
        document.getElementById('favorTokenCount').textContent = tokens;
        this.showScreen('guardFavorsMenu');
    }

    spendFavorToken(type) {
        // ... (copy the complete spendFavorToken method above) ...
    }

    saveGame() {
        const saveData = {
            // ... existing save properties ...
            favorTokens: this.player.favorTokens || 0,
            guardManicures: this.player.guardManicures || {},
            guardFavors: this.player.guardFavors || {},
            goodBehavior: this.player.goodBehavior || 100
        };

        // ... rest of save logic ...
    }

    loadGame() {
        // ... load saveData ...

        this.player.favorTokens = saveData.favorTokens || 0;
        this.player.guardManicures = saveData.guardManicures || {};
        this.player.guardFavors = saveData.guardFavors || {};
        this.player.goodBehavior = saveData.goodBehavior || 100;

        // ... rest of load logic ...
    }
}

*/

// ============================================================================
// NOTES
// ============================================================================
//
// 1. Call initializeManicureSystem() in your game constructor
// 2. Add manicure case to prisonActivity() method
// 3. Add favor token properties to player object
// 4. Update save/load methods to include manicure data
// 5. Ensure script tag for guard-manicure.js is in index.html (ALREADY DONE)
//
// All HTML/CSS changes are complete. Only game.js integration remains.
// ============================================================================
