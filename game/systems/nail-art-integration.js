/**
 * NAIL ART SYSTEM INTEGRATION
 * Connects the isometric pixel art rendering system with VROOM VROOM game mechanics
 *
 * This file extends the VroomVroomGame class with nail art functionality:
 * - Guard selection and nail decoration
 * - Favor token rewards based on quality
 * - Persistent guard hand saves
 * - Gallery view for decorated hands
 *
 * @version 1.0.0
 * @date 2025-10-19
 */

// ==================== NAIL ART SYSTEM INITIALIZATION ====================

/**
 * Initialize nail art system
 * Called from game constructor
 */
VroomVroomGame.prototype.initNailArtSystem = function() {
    // Create renderer instance
    this.nailArtRenderer = new NailArtRenderer();
    this.nailArtPalette = NAIL_ART_PALETTE;
    this.nailArtEffects = new NailArtEffects();

    // Current session state
    this.currentNailArtSession = {
        guardKey: null,
        decorations: {
            leftHand: Array(5).fill(null).map(() => this.createEmptyNailDecoration()),
            rightHand: Array(5).fill(null).map(() => this.createEmptyNailDecoration())
        },
        selectedNail: null,
        undoStack: [],
        startTime: null
    };

    console.log('[VROOM] Nail art system initialized');
};

/**
 * Create empty nail decoration object
 */
VroomVroomGame.prototype.createEmptyNailDecoration = function() {
    return {
        baseColor: null,
        specialEffect: null,
        pattern: 'solid',
        stickers: [],
        glitter: false
    };
};

// ==================== GUARD SELECTION ====================

/**
 * Start nail art session with selected guard
 * @param {string} guardKey - Guard identifier (jenkins, martinez, chen, thompson, rodriguez)
 */
VroomVroomGame.prototype.startNailArt = function(guardKey) {
    // Check if guard is on cooldown
    if (this.player.guardHands && this.player.guardHands[guardKey]) {
        const lastDecorated = this.player.guardHands[guardKey].lastDecorated;
        if (lastDecorated) {
            const hoursSince = (Date.now() - lastDecorated) / (1000 * 60 * 60);
            if (hoursSince < 24) {
                this.showMessage(`Guard ${guardKey} is still enjoying their nails. Wait ${Math.ceil(24 - hoursSince)} more hours.`, 3000);
                return;
            }
        }
    }

    // Check if player has enough credits
    if (this.player.money < 20) {
        this.showMessage('Not enough credits! Nail art costs 20 credits.', 2000);
        return;
    }

    // Initialize session
    this.currentNailArtSession = {
        guardKey: guardKey,
        decorations: {
            leftHand: Array(5).fill(null).map(() => this.createEmptyNailDecoration()),
            rightHand: Array(5).fill(null).map(() => this.createEmptyNailDecoration())
        },
        selectedNail: null,
        undoStack: [],
        startTime: Date.now()
    };

    // Deduct credits
    this.player.money -= 20;

    // Show nail art canvas
    this.showScreen('nailArtCanvas');

    // Initialize canvas
    setTimeout(() => {
        const canvas = document.getElementById('nailArtMainCanvas');
        if (canvas) {
            // Determine scale factor for mobile
            const scale = window.innerWidth < 600 ? 0.5 : 1.0;
            this.nailArtRenderer.initialize(canvas, scale);

            // Load existing decorations if any
            if (this.player.guardHands && this.player.guardHands[guardKey]) {
                this.currentNailArtSession.decorations = JSON.parse(JSON.stringify(this.player.guardHands[guardKey].currentDesign));
            }

            // Render initial scene
            this.renderNailArtScene();

            // Populate UI
            this.populateNailArtToolbar();

            // Update guard info
            document.getElementById('nailArtGuardName').textContent = `Guard ${guardKey.toUpperCase()}`;
            const preference = this.nailArtPalette.guardPreferences[guardKey];
            document.getElementById('nailArtGuardPreference').textContent = preference.preferenceText;

            // Set up click handling
            canvas.addEventListener('click', (e) => this.handleNailArtCanvasClick(e));
        }
    }, 100);
};

/**
 * Render current nail art scene
 */
VroomVroomGame.prototype.renderNailArtScene = function() {
    if (!this.nailArtRenderer || !this.currentNailArtSession.guardKey) return;

    const guardKey = this.currentNailArtSession.guardKey;
    const decorations = this.currentNailArtSession.decorations;
    const selectedNail = this.currentNailArtSession.selectedNail;

    this.nailArtRenderer.renderScene(guardKey, decorations, selectedNail);
};

/**
 * Handle canvas click for nail selection
 */
VroomVroomGame.prototype.handleNailArtCanvasClick = function(event) {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    // Get clicked nail from renderer
    const nailInfo = this.nailArtRenderer.getNailAtPosition(x, y);

    if (nailInfo) {
        this.currentNailArtSession.selectedNail = nailInfo;
        this.renderNailArtScene();
        console.log(`[VROOM] Selected nail: ${nailInfo.hand} hand, finger ${nailInfo.finger}`);
    }
};

// ==================== DECORATION TOOLBAR ====================

/**
 * Populate decoration toolbar with all options
 */
VroomVroomGame.prototype.populateNailArtToolbar = function() {
    // Base colors - palette structure has categories with arrays
    const colorPalette = document.getElementById('baseColorPalette');
    if (colorPalette) {
        colorPalette.innerHTML = '';
        // Iterate through all color categories
        Object.values(this.nailArtPalette.baseColors).forEach(categoryArray => {
            categoryArray.forEach(color => {
                const btn = document.createElement('button');
                btn.style.background = color.hex;
                btn.style.width = '50px';
                btn.style.height = '50px';
                btn.style.border = '2px solid #0f0';
                btn.style.cursor = 'pointer';
                btn.style.borderRadius = '4px';
                btn.title = color.name;
                btn.onclick = () => this.applyBaseColor(color.hex);
                colorPalette.appendChild(btn);
            });
        });
    }

    // Special effects - it's an array, not an object
    const effectsList = document.getElementById('specialEffectsList');
    if (effectsList) {
        effectsList.innerHTML = '';
        this.nailArtPalette.specialEffects.forEach(effect => {
            const btn = document.createElement('button');
            btn.textContent = effect.name;
            btn.style.width = '100%';
            btn.style.padding = '8px';
            btn.style.marginBottom = '5px';
            btn.onclick = () => this.applySpecialEffect(effect.id);
            effectsList.appendChild(btn);
        });
    }

    // Patterns - it's an array
    const patternsList = document.getElementById('patternsList');
    if (patternsList) {
        patternsList.innerHTML = '';
        this.nailArtPalette.patterns.forEach(pattern => {
            const btn = document.createElement('button');
            btn.textContent = pattern.name;
            btn.style.width = '100%';
            btn.style.padding = '8px';
            btn.style.marginBottom = '5px';
            btn.onclick = () => this.applyPattern(pattern.id);
            patternsList.appendChild(btn);
        });
    }

    // Stickers - has categories with arrays like baseColors
    const stickersList = document.getElementById('stickersList');
    if (stickersList) {
        stickersList.innerHTML = '';
        Object.values(this.nailArtPalette.stickers).forEach(categoryArray => {
            categoryArray.forEach(sticker => {
                const btn = document.createElement('button');
                btn.textContent = sticker.name;
                btn.style.padding = '8px';
                btn.onclick = () => this.applySticker(sticker.id);
                stickersList.appendChild(btn);
            });
        });
    }
};

/**
 * Apply base color to selected nail
 */
VroomVroomGame.prototype.applyBaseColor = function(colorHex) {
    if (!this.currentNailArtSession.selectedNail) {
        this.showMessage('Select a nail first!', 1500);
        return;
    }

    const { hand, index } = this.currentNailArtSession.selectedNail;
    const handKey = hand === 'left' ? 'leftHand' : 'rightHand';
    const nail = this.currentNailArtSession.decorations[handKey][index];

    // Save to undo stack
    this.saveNailArtUndoState();

    // Apply color
    nail.baseColor = colorHex;

    // Re-render
    this.renderNailArtScene();
};

/**
 * Apply special effect to selected nail
 */
VroomVroomGame.prototype.applySpecialEffect = function(effectKey) {
    if (!this.currentNailArtSession.selectedNail) {
        this.showMessage('Select a nail first!', 1500);
        return;
    }

    const { hand, index } = this.currentNailArtSession.selectedNail;
    const handKey = hand === 'left' ? 'leftHand' : 'rightHand';
    const nail = this.currentNailArtSession.decorations[handKey][index];

    // Save to undo stack
    this.saveNailArtUndoState();

    // Apply effect
    nail.specialEffect = effectKey;

    // Re-render
    this.renderNailArtScene();
};

/**
 * Apply pattern to selected nail
 */
VroomVroomGame.prototype.applyPattern = function(patternKey) {
    if (!this.currentNailArtSession.selectedNail) {
        this.showMessage('Select a nail first!', 1500);
        return;
    }

    const { hand, index } = this.currentNailArtSession.selectedNail;
    const handKey = hand === 'left' ? 'leftHand' : 'rightHand';
    const nail = this.currentNailArtSession.decorations[handKey][index];

    // Save to undo stack
    this.saveNailArtUndoState();

    // Apply pattern
    nail.pattern = patternKey;

    // Re-render
    this.renderNailArtScene();
};

/**
 * Apply sticker to selected nail
 */
VroomVroomGame.prototype.applySticker = function(stickerKey) {
    if (!this.currentNailArtSession.selectedNail) {
        this.showMessage('Select a nail first!', 1500);
        return;
    }

    const { hand, index } = this.currentNailArtSession.selectedNail;
    const handKey = hand === 'left' ? 'leftHand' : 'rightHand';
    const nail = this.currentNailArtSession.decorations[handKey][index];

    // Check sticker limit (5 per nail)
    if (nail.stickers.length >= 5) {
        this.showMessage('Maximum 5 stickers per nail!', 1500);
        return;
    }

    // Save to undo stack
    this.saveNailArtUndoState();

    // Add sticker at random position
    nail.stickers.push({
        type: stickerKey,
        position: {
            x: 10 + Math.random() * 10,
            y: 10 + Math.random() * 30
        }
    });

    // Re-render
    this.renderNailArtScene();
};

/**
 * Toggle glitter on selected nail
 */
VroomVroomGame.prototype.nailArtToggleGlitter = function() {
    if (!this.currentNailArtSession.selectedNail) {
        this.showMessage('Select a nail first!', 1500);
        return;
    }

    const { hand, index } = this.currentNailArtSession.selectedNail;
    const handKey = hand === 'left' ? 'leftHand' : 'rightHand';
    const nail = this.currentNailArtSession.decorations[handKey][index];

    // Save to undo stack
    this.saveNailArtUndoState();

    // Toggle glitter
    nail.glitter = !nail.glitter;

    // Update button
    const btn = document.getElementById('glitterToggle');
    if (btn) {
        btn.textContent = nail.glitter ? '✨ GLITTER: ON' : '✨ GLITTER: OFF';
    }

    // Re-render
    this.renderNailArtScene();
};

// ==================== UNDO/CLEAR ====================

/**
 * Save current state to undo stack
 */
VroomVroomGame.prototype.saveNailArtUndoState = function() {
    const state = JSON.stringify(this.currentNailArtSession.decorations);
    this.currentNailArtSession.undoStack.push(state);

    // Limit stack size
    if (this.currentNailArtSession.undoStack.length > 20) {
        this.currentNailArtSession.undoStack.shift();
    }
};

/**
 * Undo last action
 */
VroomVroomGame.prototype.nailArtUndo = function() {
    if (this.currentNailArtSession.undoStack.length === 0) {
        this.showMessage('Nothing to undo!', 1500);
        return;
    }

    const previousState = this.currentNailArtSession.undoStack.pop();
    this.currentNailArtSession.decorations = JSON.parse(previousState);
    this.renderNailArtScene();
    this.showMessage('Undone!', 1000);
};

/**
 * Clear current nail
 */
VroomVroomGame.prototype.nailArtClearCurrentNail = function() {
    if (!this.currentNailArtSession.selectedNail) {
        this.showMessage('Select a nail first!', 1500);
        return;
    }

    const { hand, index } = this.currentNailArtSession.selectedNail;
    const handKey = hand === 'left' ? 'leftHand' : 'rightHand';

    // Save to undo stack
    this.saveNailArtUndoState();

    // Clear nail
    this.currentNailArtSession.decorations[handKey][index] = this.createEmptyNailDecoration();

    // Re-render
    this.renderNailArtScene();
    this.showMessage('Nail cleared!', 1000);
};

/**
 * Clear all nails
 */
VroomVroomGame.prototype.nailArtClearAll = function() {
    if (!confirm('Clear all decorations? This cannot be undone.')) {
        return;
    }

    // Save to undo stack
    this.saveNailArtUndoState();

    // Clear all
    this.currentNailArtSession.decorations = {
        leftHand: Array(5).fill(null).map(() => this.createEmptyNailDecoration()),
        rightHand: Array(5).fill(null).map(() => this.createEmptyNailDecoration())
    };

    // Re-render
    this.renderNailArtScene();
    this.showMessage('All nails cleared!', 1500);
};

// ==================== SAVE & REWARDS ====================

/**
 * Save decorated nails and calculate rewards
 */
VroomVroomGame.prototype.nailArtSave = function() {
    const guardKey = this.currentNailArtSession.guardKey;
    const decorations = this.currentNailArtSession.decorations;
    const sessionDuration = (Date.now() - this.currentNailArtSession.startTime) / 1000; // seconds

    // Initialize guardHands if needed
    if (!this.player.guardHands) {
        this.player.guardHands = {};
    }

    if (!this.player.guardHands[guardKey]) {
        this.player.guardHands[guardKey] = {
            decorationCount: 0,
            totalTokensEarned: 0,
            lastDecorated: null,
            currentDesign: null
        };
    }

    // Calculate rewards
    const rewards = this.calculateNailArtRewards(guardKey, decorations, sessionDuration);

    // Save design
    this.player.guardHands[guardKey].currentDesign = JSON.parse(JSON.stringify(decorations));
    this.player.guardHands[guardKey].lastDecorated = Date.now();
    this.player.guardHands[guardKey].decorationCount++;
    this.player.guardHands[guardKey].totalTokensEarned += rewards.tokens;

    // Award tokens
    this.player.favorTokens = (this.player.favorTokens || 0) + rewards.tokens;

    // Add time
    this.player.prisonDays += (45 / (24 * 60)); // 45 minutes

    // Show results
    this.showMessage(rewards.message, 5000);

    // Save game
    this.saveGame();

    // Return to prison
    setTimeout(() => {
        this.showScreen('prisonMenu');
    }, 5000);
};

/**
 * Calculate favor token rewards based on decoration quality
 */
VroomVroomGame.prototype.calculateNailArtRewards = function(guardKey, decorations, sessionDuration) {
    let tokens = 1; // Base token for completion
    let bonusReasons = [];

    // Count decorated nails
    let decoratedCount = 0;
    let totalStickers = 0;
    let colorMatches = 0;
    let effectMatches = 0;

    ['leftHand', 'rightHand'].forEach(hand => {
        decorations[hand].forEach(nail => {
            if (nail.baseColor) decoratedCount++;
            totalStickers += nail.stickers.length;

            // Check guard preferences
            const pref = this.nailArtPalette.guardPreferences[guardKey];
            if (pref.favoriteColors.includes(nail.baseColor)) colorMatches++;
            if (nail.specialEffect === pref.preferredEffect) effectMatches++;
        });
    });

    // Bonus: All nails decorated
    if (decoratedCount === 10) {
        tokens++;
        bonusReasons.push('All nails decorated');
    }

    // Bonus: Color preferences (60%+)
    if (colorMatches >= 6) {
        tokens++;
        bonusReasons.push('Guard loves the colors');
    }

    // Bonus: Guard-specific preferences
    const pref = this.nailArtPalette.guardPreferences[guardKey];
    switch (guardKey) {
        case 'jenkins':
            // Prefers NO stickers
            if (totalStickers === 0) {
                tokens++;
                bonusReasons.push('Clean and simple (Jenkins approved)');
            }
            break;
        case 'martinez':
            // Prefers symmetry
            if (this.checkSymmetry(decorations)) {
                tokens++;
                bonusReasons.push('Perfect symmetry (Martinez impressed)');
            }
            break;
        case 'chen':
            // Prefers speed (<2 minutes)
            if (sessionDuration < 120) {
                tokens++;
                bonusReasons.push('Lightning fast (Chen satisfied)');
            }
            break;
        case 'thompson':
            // Prefers LOTS of stickers (15+)
            if (totalStickers >= 15) {
                tokens++;
                bonusReasons.push('Maximum dazzle! (Thompson ecstatic)');
            }
            break;
        case 'rodriguez':
            // Prefers holographic + glitter
            let holoGlitterCount = 0;
            ['leftHand', 'rightHand'].forEach(hand => {
                decorations[hand].forEach(nail => {
                    if (nail.specialEffect === 'holographic' && nail.glitter) {
                        holoGlitterCount++;
                    }
                });
            });
            if (holoGlitterCount >= 5) {
                tokens += 2; // Double bonus!
                bonusReasons.push('FABULOUS! (Rodriguez demands a raise)');
            }
            break;
    }

    // Build message
    let message = `Guard ${guardKey.toUpperCase()} is pleased!\n\n`;
    message += `Favor Tokens Earned: ${tokens}\n`;
    if (bonusReasons.length > 0) {
        message += `\nBonuses:\n`;
        bonusReasons.forEach(reason => {
            message += `• ${reason}\n`;
        });
    }

    return {
        tokens,
        message,
        decoratedCount,
        totalStickers
    };
};

/**
 * Check if left and right hands have symmetric decorations
 */
VroomVroomGame.prototype.checkSymmetry = function(decorations) {
    for (let i = 0; i < 5; i++) {
        const left = decorations.leftHand[i];
        const right = decorations.rightHand[i];

        if (left.baseColor !== right.baseColor) return false;
        if (left.specialEffect !== right.specialEffect) return false;
        if (left.pattern !== right.pattern) return false;
        if (left.glitter !== right.glitter) return false;
    }
    return true;
};

// ==================== GALLERY ====================

/**
 * Show nail art gallery
 */
VroomVroomGame.prototype.showNailArtGallery = function() {
    this.showScreen('nailArtGallery');

    // Render all guard hands
    setTimeout(() => {
        ['jenkins', 'martinez', 'chen', 'thompson', 'rodriguez'].forEach(guardKey => {
            this.renderGalleryPreview(guardKey);
        });
    }, 100);
};

/**
 * Render gallery preview for a guard
 */
VroomVroomGame.prototype.renderGalleryPreview = function(guardKey) {
    const canvas = document.getElementById(`galleryCanvas${guardKey.charAt(0).toUpperCase() + guardKey.slice(1)}`);
    const statsElement = document.getElementById(`galleryStats${guardKey.charAt(0).toUpperCase() + guardKey.slice(1)}`);

    if (!canvas) return;

    // Check if guard has been decorated
    if (this.player.guardHands && this.player.guardHands[guardKey] && this.player.guardHands[guardKey].currentDesign) {
        const guardData = this.player.guardHands[guardKey];

        // Initialize renderer for this canvas
        const tempRenderer = new NailArtRenderer();
        tempRenderer.initialize(canvas, 0.5);
        tempRenderer.renderScene(guardKey, guardData.currentDesign, null);

        // Update stats
        if (statsElement) {
            const lastDate = new Date(guardData.lastDecorated).toLocaleDateString();
            statsElement.textContent = `Decorated ${guardData.decorationCount} times | Last: ${lastDate} | Tokens earned: ${guardData.totalTokensEarned}`;
        }
    } else {
        // Not decorated yet
        if (statsElement) {
            statsElement.textContent = 'Not yet decorated';
        }
    }
};

/**
 * View nail art detail (zoom in on a guard's hands)
 */
VroomVroomGame.prototype.viewNailArtDetail = function(guardKey) {
    if (!this.player.guardHands || !this.player.guardHands[guardKey] || !this.player.guardHands[guardKey].currentDesign) {
        this.showMessage(`Guard ${guardKey} hasn't been decorated yet!`, 2000);
        return;
    }

    // Could implement a full-screen detailed view here
    // For now, just show a message
    this.showMessage(`Viewing ${guardKey}'s fabulous nails! (Full zoom view coming soon)`, 3000);
};

console.log('[VROOM] Nail art integration loaded');
