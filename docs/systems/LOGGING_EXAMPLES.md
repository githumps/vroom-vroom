# VROOM VROOM - Logging Instrumentation Examples

Comprehensive examples of how to add logging throughout the codebase.

---

## Table of Contents
1. [Save/Load System](#saveload-system)
2. [Prison Activities](#prison-activities)
3. [Tattoo System](#tattoo-system)
4. [Gang System](#gang-system)
5. [Driving Mechanics](#driving-mechanics)
6. [Court/Judge System](#courtjudge-system)
7. [Eating Simulator](#eating-simulator)
8. [Weight Lifting](#weight-lifting)
9. [Library System](#library-system)
10. [Commissary Shop](#commissary-shop)
11. [Escape System](#escape-system)
12. [Cinematic System](#cinematic-system)
13. [Sound System](#sound-system)

---

## Save/Load System

### saveGame() Method
```javascript
saveGame() {
    vroomLogger.info('SAVE', 'Starting game save', {
        playerName: this.player.name,
        prisonDays: this.player.prisonDays,
        credits: this.player.money,
        arrestCount: this.judge.arrestCount
    });

    try {
        const saveData = {
            player: this.player,
            judge: this.judge,
            version: '1.0.0',
            timestamp: Date.now()
        };

        localStorage.setItem('vroom_vroom_save', JSON.stringify(saveData));

        vroomLogger.debug('SAVE', 'Save data serialized', {
            size: JSON.stringify(saveData).length,
            timestamp: new Date().toISOString()
        });

        vroomLogger.info('SAVE', 'Game saved successfully');
        return true;

    } catch (error) {
        vroomLogger.error('SAVE', 'Failed to save game', {
            error: error.message,
            stack: error.stack
        });

        this.showMessage('Failed to save game: ' + error.message, 3000);
        return false;
    }
}
```

### loadGame() Method
```javascript
loadGame() {
    vroomLogger.info('SAVE', 'Attempting to load game');

    try {
        const saveData = localStorage.getItem('vroom_vroom_save');

        if (!saveData) {
            vroomLogger.warn('SAVE', 'No save data found');
            this.showMessage('No save game found', 2000);
            return false;
        }

        vroomLogger.debug('SAVE', 'Save data found', {
            size: saveData.length
        });

        const parsed = JSON.parse(saveData);

        vroomLogger.debug('SAVE', 'Save data parsed', {
            version: parsed.version,
            playerName: parsed.player?.name,
            timestamp: new Date(parsed.timestamp).toISOString()
        });

        // Load data
        this.player = parsed.player;
        this.judge = parsed.judge;

        vroomLogger.info('SAVE', 'Game loaded successfully', {
            playerName: this.player.name,
            prisonDays: this.player.prisonDays,
            credits: this.player.money
        });

        this.showScreen('prisonMenu');
        return true;

    } catch (error) {
        vroomLogger.error('SAVE', 'Failed to load game', {
            error: error.message,
            stack: error.stack
        });

        this.showMessage('Failed to load game: ' + error.message, 3000);
        return false;
    }
}
```

### exportSaveCode() Method
```javascript
exportSaveCode() {
    vroomLogger.info('SAVE', 'Exporting save code');

    try {
        const saveData = {
            player: this.player,
            judge: this.judge,
            version: '1.0.0'
        };

        const encoded = btoa(JSON.stringify(saveData));

        vroomLogger.debug('SAVE', 'Save code generated', {
            originalSize: JSON.stringify(saveData).length,
            encodedSize: encoded.length
        });

        document.getElementById('saveCodeDisplay').value = encoded;
        this.showModal('saveCodeModal');

        vroomLogger.info('SAVE', 'Save code exported successfully');

    } catch (error) {
        vroomLogger.error('SAVE', 'Failed to export save code', {
            error: error.message
        });
    }
}
```

---

## Prison Activities

### prisonActivity() Method
```javascript
prisonActivity(activity) {
    vroomLogger.info('PRISON', `Starting activity: ${activity}`, {
        playerStrength: this.player.strength,
        playerIntelligence: this.player.intelligence,
        prisonDay: this.player.prisonDays
    });

    // Route to specific activity
    switch (activity) {
        case 'weights':
            vroomLogger.debug('PRISON', 'Routing to weight lifting');
            this.showScreen('weightLifting');
            break;

        case 'eat':
            vroomLogger.debug('PRISON', 'Routing to eating simulator');
            this.showScreen('eatingSimulator');
            this.startEatingSimulator();
            break;

        case 'read':
            vroomLogger.debug('PRISON', 'Routing to library');
            this.showScreen('prisonLibrary');
            break;

        case 'letter':
            vroomLogger.debug('PRISON', 'Routing to letter writing');
            this.showScreen('letterWriting');
            break;

        case 'cellmate':
            vroomLogger.debug('PRISON', 'Initiating cellmate conversation');
            this.talkToCellmate();
            break;

        case 'tattoo':
            vroomLogger.debug('PRISON', 'Routing to tattoo studio');
            this.showScreen('tattooStudio');
            this.initTattooSystem();
            break;

        case 'commissary':
            vroomLogger.debug('PRISON', 'Routing to commissary');
            this.showScreen('commissaryShop');
            this.updateCommissaryDisplay();
            break;

        case 'gang':
            vroomLogger.debug('PRISON', 'Routing to gang system');
            this.showScreen('gangSystem');
            this.updateGangDisplay();
            break;

        default:
            vroomLogger.warn('PRISON', `Unknown activity: ${activity}`);
    }
}
```

### Complete Activity with Reward
```javascript
completeActivity(activity, reward) {
    const earnedCredits = reward || Math.floor(Math.random() * 5) + 1;

    vroomLogger.info('PRISON', `Activity completed: ${activity}`, {
        reward: earnedCredits,
        activityType: activity
    });

    this.player.money = (this.player.money || 0) + earnedCredits;
    this.player.prisonDays++;

    vroomLogger.debug('PRISON', 'Player stats updated', {
        totalCredits: this.player.money,
        totalDays: this.player.prisonDays
    });

    this.saveGame();

    this.showMessage(`Activity complete! Earned ${earnedCredits} credits.`, 2000);
}
```

---

## Tattoo System

### Create Stencil
```javascript
createStencil() {
    const filledCells = this.tattooGrid.filter(cell => cell).length;

    vroomLogger.info('TATTOO', 'Creating tattoo stencil', {
        designSize: filledCells,
        gridSize: this.tattooGrid.length
    });

    if (filledCells === 0) {
        vroomLogger.warn('TATTOO', 'Cannot create stencil: empty design');
        this.showMessage('Draw something first!', 2000);
        return;
    }

    vroomLogger.debug('TATTOO', 'Stencil created successfully', {
        cellsFilled: filledCells,
        percentage: ((filledCells / this.tattooGrid.length) * 100).toFixed(1)
    });

    this.tattooStep = 'INK';
    this.updateTattooUI();
}
```

### Apply Ink
```javascript
applyInk() {
    vroomLogger.info('TATTOO', 'Applying ink to tattoo');

    // Infection check
    const infectionRoll = Math.random();
    const infected = infectionRoll < 0.25;

    vroomLogger.debug('TATTOO', 'Infection check', {
        roll: infectionRoll.toFixed(3),
        threshold: 0.25,
        result: infected ? 'INFECTED' : 'CLEAN'
    });

    if (infected) {
        vroomLogger.warn('TATTOO', 'Tattoo became infected!', {
            infectionChance: '25%'
        });

        this.showMessage('The needle wasn\'t clean. You feel... unwell.', 3000);
        document.getElementById('infectionStatus').style.display = 'block';

        // Apply negative effects
        this.player.health = Math.max(0, (this.player.health || 100) - 20);

        vroomLogger.debug('TATTOO', 'Infection applied', {
            healthRemaining: this.player.health
        });
    } else {
        vroomLogger.info('TATTOO', 'Tattoo applied successfully (no infection)');
    }

    this.tattooStep = 'PLACEMENT';
    this.updateTattooUI();
}
```

### Body Placement
```javascript
selectBodyPart(bodyPart) {
    vroomLogger.info('TATTOO', `Body placement selected: ${bodyPart}`, {
        existingTattoos: this.player.tattoos?.length || 0
    });

    // Save tattoo
    const tattoo = {
        design: this.tattooGrid,
        bodyPart: bodyPart,
        date: Date.now(),
        infected: document.getElementById('infectionStatus').style.display === 'block'
    };

    this.player.tattoos = this.player.tattoos || [];
    this.player.tattoos.push(tattoo);

    vroomLogger.debug('TATTOO', 'Tattoo saved to player', {
        totalTattoos: this.player.tattoos.length,
        location: bodyPart,
        infected: tattoo.infected
    });

    this.completeActivity('tattoo', 0);
}
```

---

## Gang System

### Interact with Gang
```javascript
interactWithGang(gangId) {
    vroomLogger.info('GANG', `Interacting with gang: ${gangId}`, {
        currentGang: this.player.gang,
        reputation: this.player.gangReps?.[gangId] || 0
    });

    this.currentGang = gangId;
    this.showScreen('gangInteraction');
    this.updateGangInteractionUI();
}
```

### Gang Action
```javascript
gangAction(action) {
    const gangId = this.currentGang;

    vroomLogger.info('GANG', `Gang action: ${action}`, {
        gang: gangId,
        playerCigarettes: this.player.cigarettes,
        currentRep: this.player.gangReps?.[gangId] || 0
    });

    switch (action) {
        case 'talk':
            vroomLogger.debug('GANG', 'Talking to gang leader');
            this.gangTalk(gangId);
            break;

        case 'share_cigarettes':
            if (this.player.cigarettes < 5) {
                vroomLogger.warn('GANG', 'Not enough cigarettes to share', {
                    required: 5,
                    has: this.player.cigarettes
                });
                this.showMessage('You need 5 cigarettes to share', 2000);
                return;
            }

            this.player.cigarettes -= 5;
            this.increaseGangRep(gangId, 10);

            vroomLogger.info('GANG', 'Shared cigarettes with gang', {
                cost: 5,
                repGain: 10,
                newRep: this.player.gangReps[gangId]
            });
            break;

        case 'join':
            vroomLogger.info('GANG', `Attempting to join gang: ${gangId}`);
            this.attemptJoinGang(gangId);
            break;

        default:
            vroomLogger.warn('GANG', `Unknown gang action: ${action}`);
    }

    this.saveGame();
}
```

---

## Driving Mechanics

### Start Driving
```javascript
startDriving() {
    vroomLogger.info('DRIVING', 'Player started driving', {
        arrestCount: this.judge.arrestCount,
        carModel: this.player.carModel,
        carColor: this.player.carColor
    });

    // Show cinematic
    this.cinematics.play('driving_start', () => {
        vroomLogger.debug('DRIVING', 'Cinematic complete, entering driving mode');

        this.gameState = 'driving';
        this.player.speed = 0;
        this.player.drivingTime = 0;

        this.showScreen(null);
        document.getElementById('drivingHUD').style.display = 'block';

        vroomLogger.debug('DRIVING', 'Driving mode initialized', {
            initialSpeed: 0,
            initialTime: 0
        });

        this.startDrivingLoop();
    });
}
```

### Driving Loop
```javascript
updateDriving(deltaTime) {
    this.player.drivingTime += deltaTime;

    // Speed calculation
    if (this.keys.forward) {
        this.player.speed = Math.min(this.player.speed + 2, 150);

        vroomLogger.debug('DRIVING', 'Accelerating', {
            currentSpeed: Math.floor(this.player.speed),
            maxSpeed: 150
        });
    }

    // Update HUD
    document.getElementById('speed').textContent = Math.floor(this.player.speed);
    document.getElementById('drivingTime').textContent = Math.floor(this.player.drivingTime);

    // Arrest check
    if (this.player.drivingTime > 5 && Math.random() < 0.001) {
        vroomLogger.warn('DRIVING', 'Random arrest triggered', {
            drivingTime: Math.floor(this.player.drivingTime),
            speed: Math.floor(this.player.speed),
            probability: '0.1%'
        });

        this.arrestPlayer();
    }
}
```

### Arrest Player
```javascript
arrestPlayer() {
    const stats = {
        speed: Math.floor(this.player.speed),
        time: Math.floor(this.player.drivingTime),
        arrestNumber: this.judge.arrestCount + 1
    };

    vroomLogger.warn('DRIVING', 'Player arrested', stats);

    this.gameState = 'arrested';

    vroomLogger.debug('DRIVING', 'Stopping driving systems');

    // Stop driving
    this.stopDrivingLoop();
    document.getElementById('drivingHUD').style.display = 'none';

    // Play arrest sound
    if (this.soundSystem) {
        vroomLogger.debug('SOUND', 'Playing arrest sound');
        this.soundSystem.playArrestSound();
    }

    // Show cinematic
    this.cinematics.play('arrest', () => {
        vroomLogger.debug('DRIVING', 'Arrest cinematic complete, moving to courtroom');
        this.showScreen('courtroom');
        this.setupCourtroom();
    });
}
```

---

## Court/Judge System

### Setup Courtroom
```javascript
async setupCourtroom() {
    vroomLogger.info('COURT', 'Entering courtroom', {
        arrestNumber: this.judge.arrestCount + 1,
        judgeMood: this.judge.mood,
        judgePatienceremaining: this.judge.patience,
        drivingStats: {
            speed: Math.floor(this.player.speed),
            time: Math.floor(this.player.drivingTime)
        }
    });

    // Play cop sound
    if (this.soundSystem) {
        vroomLogger.debug('SOUND', 'Playing cop mumbling');
        this.soundSystem.playCopMumbling();
    }

    // Generate charges (API or default)
    let charges;

    if (this.apiKeyManager.hasApiKey()) {
        vroomLogger.info('API', 'Attempting to generate AI charges');

        this.showMessage('Judge Hardcastle is consulting the AI legal database...', 2000);

        charges = await this.apiKeyManager.generateAICharges({
            speed: this.player.speed,
            time: this.player.drivingTime
        }, this.judge.arrestCount + 1);

        if (charges) {
            vroomLogger.info('API', 'AI charges generated successfully', {
                chargeCount: charges.length
            });
        } else {
            vroomLogger.warn('API', 'AI charge generation failed, using defaults');
        }
    } else {
        vroomLogger.debug('COURT', 'No API key, using default charges');
    }

    // Fallback to default charges
    if (!charges) {
        charges = this.judge.generateCharges({
            speed: this.player.speed,
            time: this.player.drivingTime
        });

        vroomLogger.debug('COURT', 'Default charges generated', {
            chargeCount: charges.length
        });
    }

    // Display charges
    this.displayCharges(charges);

    vroomLogger.info('COURT', 'Courtroom setup complete', {
        totalCharges: charges.length
    });
}
```

### Submit Court Forms
```javascript
submitCourtForms() {
    vroomLogger.info('COURT', 'Forms submitted');

    // Validate forms
    const forms = {
        reason: document.getElementById('reasonForDriving').value.trim(),
        vehicle: document.getElementById('vehicleDesc').value.trim(),
        intent: document.getElementById('intentStatement').value,
        initial1: document.getElementById('initial1').value.trim(),
        initial2: document.getElementById('initial2').value.trim(),
        initial3: document.getElementById('initial3').value.trim()
    };

    vroomLogger.debug('COURT', 'Validating forms', {
        reasonLength: forms.reason.length,
        vehicleLength: forms.vehicle.length,
        intentSelected: !!forms.intent,
        initialsComplete: !!forms.initial1 && !!forms.initial2 && !!forms.initial3
    });

    // Check completion
    if (!forms.reason || !forms.vehicle || !forms.intent ||
        !forms.initial1 || !forms.initial2 || !forms.initial3) {

        vroomLogger.warn('COURT', 'Incomplete paperwork submitted', forms);

        this.judge.patience = Math.max(0, this.judge.patience - 30);

        vroomLogger.debug('COURT', 'Judge patience reduced', {
            newPatienceence: this.judge.patience
        });

        this.showMessage('INCOMPLETE PAPERWORK. All forms must be filled completely.', 4000);
        return;
    }

    vroomLogger.info('COURT', 'Forms validated successfully');

    // Calculate sentence
    const sentence = this.calculateSentence();

    vroomLogger.info('COURT', 'Sentence calculated', {
        years: sentence,
        arrestCount: this.judge.arrestCount
    });

    this.player.sentence = sentence;
    this.player.prisonDays = 0;

    // Judge final statement
    this.showJudgeSentencing(sentence);
}
```

---

## Eating Simulator

### Start Eating
```javascript
startEatingSimulator() {
    vroomLogger.info('EATING', 'Starting eating simulator', {
        hungerLevel: this.player.hunger || 100
    });

    this.bites = 20;
    this.hunger = 100;

    vroomLogger.debug('EATING', 'Eating session initialized', {
        totalBites: this.bites,
        initialHunger: this.hunger
    });

    this.renderPlate();
}
```

### Eat Bite
```javascript
eatBite() {
    if (this.bites <= 0) {
        vroomLogger.warn('EATING', 'Attempted to eat with no bites remaining');
        return;
    }

    this.bites--;
    this.hunger = Math.max(0, this.hunger - 5);

    vroomLogger.debug('EATING', 'Bite consumed', {
        bitesRemaining: this.bites,
        hungerLevel: this.hunger,
        percentEaten: ((20 - this.bites) / 20 * 100).toFixed(1)
    });

    // Update UI
    document.getElementById('bitesRemaining').textContent = this.bites;
    document.getElementById('hungerLevel').textContent = this.hunger;

    // Flavor text
    const flavors = [
        'The texture is... questionable.',
        'It tastes like regret.',
        'You miss real food.',
        'This is technically edible.',
        'The smell is worse than the taste.'
    ];

    const flavorText = flavors[Math.floor(Math.random() * flavors.length)];
    document.getElementById('flavorText').textContent = flavorText;

    vroomLogger.debug('EATING', 'Flavor text displayed', { text: flavorText });

    // Check if done
    if (this.bites === 0) {
        vroomLogger.info('EATING', 'Meal completed', {
            finalHunger: this.hunger
        });

        this.completeMeal();
    }

    this.renderPlate();
}
```

---

## Weight Lifting

### Start Workout
```javascript
startWeightLifting() {
    vroomLogger.info('WEIGHTS', 'Starting workout', {
        currentStrength: this.player.strength || 0,
        currentFatigue: this.player.fatigue || 0
    });

    this.currentSet = 1;
    this.currentRep = 0;
    this.totalSets = 5;
    this.repsPerSet = 10;
    this.isLifting = false;

    vroomLogger.debug('WEIGHTS', 'Workout parameters', {
        sets: this.totalSets,
        repsPerSet: this.repsPerSet,
        targetReps: this.totalSets * this.repsPerSet
    });

    this.updateWorkoutUI();
}
```

### Complete Rep
```javascript
completeRep() {
    this.currentRep++;

    vroomLogger.debug('WEIGHTS', 'Rep completed', {
        set: this.currentSet,
        rep: this.currentRep,
        totalReps: (this.currentSet - 1) * this.repsPerSet + this.currentRep
    });

    // Check if set complete
    if (this.currentRep >= this.repsPerSet) {
        vroomLogger.info('WEIGHTS', `Set ${this.currentSet} completed`, {
            repsCompleted: this.repsPerSet,
            setsRemaining: this.totalSets - this.currentSet
        });

        this.completeSet();
    }

    this.updateWorkoutUI();
}
```

### Complete Workout
```javascript
completeWorkout() {
    const strengthGain = 5;
    const fatigueGain = 20;

    vroomLogger.info('WEIGHTS', 'Workout completed', {
        setsCompleted: this.totalSets,
        totalReps: this.totalSets * this.repsPerSet,
        strengthGain: strengthGain,
        fatigueGain: fatigueGain
    });

    this.player.strength = (this.player.strength || 0) + strengthGain;
    this.player.fatigue = Math.min(100, (this.player.fatigue || 0) + fatigueGain);

    vroomLogger.debug('WEIGHTS', 'Player stats updated', {
        newStrength: this.player.strength,
        newFatigue: this.player.fatigue
    });

    this.completeActivity('weights', 5);
}
```

---

## Library System

### Select Book
```javascript
selectBook(bookIndex) {
    vroomLogger.info('LIBRARY', `Selected book: ${bookIndex}`, {
        currentIntelligence: this.player.intelligence || 0,
        booksRead: this.player.booksRead?.length || 0
    });

    this.currentBook = bookIndex;
    this.currentPage = this.player.bookProgress?.[bookIndex] || 0;

    vroomLogger.debug('LIBRARY', 'Loading book', {
        bookIndex: bookIndex,
        startPage: this.currentPage,
        totalPages: this.books[bookIndex].pages.length
    });

    this.showScreen('readBook');
    this.displayBookPage();
}
```

### Turn Page
```javascript
nextPage() {
    this.currentPage++;

    vroomLogger.debug('LIBRARY', 'Page turned', {
        book: this.currentBook,
        page: this.currentPage,
        totalPages: this.books[this.currentBook].pages.length
    });

    // Gain intelligence
    this.player.intelligence = (this.player.intelligence || 0) + 1;

    vroomLogger.debug('LIBRARY', 'Intelligence gained', {
        newIntelligence: this.player.intelligence
    });

    // Check if book complete
    if (this.currentPage >= this.books[this.currentBook].pages.length) {
        vroomLogger.info('LIBRARY', `Book completed: ${this.currentBook}`, {
            intelligenceGained: this.books[this.currentBook].pages.length
        });

        this.completeBook();
    } else {
        this.displayBookPage();
    }
}
```

---

## Commissary Shop

### Buy Item
```javascript
buyItem(itemId, price) {
    vroomLogger.info('COMMISSARY', `Attempting to buy: ${itemId}`, {
        price: price,
        playerMoney: this.player.money,
        currentStock: this.commissary[itemId]?.stock
    });

    // Check money
    if (this.player.money < price) {
        vroomLogger.warn('COMMISSARY', 'Insufficient funds', {
            required: price,
            has: this.player.money,
            shortfall: price - this.player.money
        });

        this.showMessage('Not enough credits!', 2000);
        return;
    }

    // Check stock
    if (this.commissary[itemId].stock <= 0) {
        vroomLogger.warn('COMMISSARY', 'Item out of stock', {
            item: itemId
        });

        this.showMessage('Out of stock!', 2000);
        return;
    }

    // Purchase
    this.player.money -= price;
    this.commissary[itemId].stock--;
    this.player.items[itemId] = (this.player.items[itemId] || 0) + 1;

    vroomLogger.info('COMMISSARY', 'Purchase successful', {
        item: itemId,
        pricePaid: price,
        newBalance: this.player.money,
        itemCount: this.player.items[itemId]
    });

    this.updateCommissaryDisplay();
    this.saveGame();

    this.showMessage(`Purchased ${itemId} for ${price} credits`, 2000);
}
```

---

## Escape System

### Attempt Escape
```javascript
attemptEscape(route) {
    const success = Math.random() < (this.escapeRoutes[route].successRate / 100);

    vroomLogger.warn('ESCAPE', `Escape attempt: ${route}`, {
        route: route,
        successRate: this.escapeRoutes[route].successRate,
        roll: (Math.random() * 100).toFixed(1),
        result: success ? 'SUCCESS' : 'FAILURE'
    });

    if (success) {
        vroomLogger.info('ESCAPE', 'Escape successful!', {
            daysServed: this.player.prisonDays,
            routeUsed: route
        });

        this.handleEscapeSuccess(route);
    } else {
        vroomLogger.error('ESCAPE', 'Escape failed', {
            routeUsed: route,
            penalty: '+10 years'
        });

        this.handleEscapeFailure(route);
    }
}
```

---

## Cinematic System

### Play Cinematic
```javascript
play(sceneType, callback) {
    vroomLogger.info('CINEMATIC', `Playing scene: ${sceneType}`);

    if (this.isPlaying) {
        vroomLogger.warn('CINEMATIC', 'Scene already playing, queueing callback');
        if (callback) callback();
        return;
    }

    this.isPlaying = true;

    const scene = this.getScene(sceneType);

    vroomLogger.debug('CINEMATIC', 'Scene loaded', {
        type: sceneType,
        duration: scene.duration
    });

    // Show scene
    this.overlay.classList.add('active');
    this.renderScene(scene);

    // Hide after duration
    setTimeout(() => {
        vroomLogger.debug('CINEMATIC', 'Scene complete', { type: sceneType });
        this.hide();
        if (callback) callback();
    }, scene.duration);
}
```

---

## Sound System

### Play Sound
```javascript
playSound(soundId) {
    vroomLogger.debug('SOUND', `Playing sound: ${soundId}`, {
        volume: this.volume,
        muted: this.muted
    });

    if (this.muted) {
        vroomLogger.debug('SOUND', 'Sound muted, skipping playback');
        return;
    }

    const sound = this.sounds[soundId];

    if (!sound) {
        vroomLogger.warn('SOUND', `Sound not found: ${soundId}`);
        return;
    }

    sound.volume = this.volume;
    sound.play().catch(error => {
        vroomLogger.error('SOUND', 'Failed to play sound', {
            soundId: soundId,
            error: error.message
        });
    });
}
```

---

## General Patterns

### User Actions
```javascript
// Log all button clicks
buttonClick(buttonName, context = {}) {
    vroomLogger.info('USER', `Button clicked: ${buttonName}`, context);
}

// Log all input changes
inputChange(fieldName, value) {
    vroomLogger.debug('USER', `Input changed: ${fieldName}`, {
        length: value.length,
        hasValue: !!value
    });
}
```

### Error Handling
```javascript
try {
    // Operation
    vroomLogger.debug('SYSTEM', 'Starting operation');
    doSomething();
    vroomLogger.info('SYSTEM', 'Operation completed');

} catch (error) {
    vroomLogger.error('SYSTEM', 'Operation failed', {
        error: error.message,
        stack: error.stack
    });

    this.showMessage('Operation failed: ' + error.message, 3000);
}
```

### State Transitions
```javascript
changeState(newState) {
    const oldState = this.gameState;

    vroomLogger.info('SYSTEM', 'State transition', {
        from: oldState,
        to: newState
    });

    this.gameState = newState;

    vroomLogger.debug('SYSTEM', 'State changed', {
        currentState: this.gameState
    });
}
```

---

**Best Practice**: Log generously in dev mode. The logger automatically limits history to 100 entries, and logs are only active when dev mode is enabled, so there's minimal performance impact.
