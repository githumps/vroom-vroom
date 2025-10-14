# PRISON SYSTEM ENHANCEMENTS - IMPLEMENTATION GUIDE
## Ready-to-Use Code Snippets

**Quick Start:** Copy/paste these code blocks into game.js to implement prison enhancements.

---

## 1. RANDOM EVENT SYSTEM (Copy to game.js after line 3500)

```javascript
// ==================== RANDOM EVENT SYSTEM ====================

// Add to player initialization in constructor:
/*
Add to player object:
randomEvents: [],
lastEventDay: 0
*/

// Trigger random event - call this in startPrison() or after activities
triggerRandomEvent() {
    // Only trigger if it's been at least 1 day since last event
    if (this.player.prisonDays === this.player.lastEventDay) return;

    // 20% chance to trigger
    if (Math.random() > 0.20) return;

    const event = this.rollRandomEvent();
    if (!event) return;

    this.player.lastEventDay = this.player.prisonDays;
    this.showRandomEventScreen(event);
}

rollRandomEvent() {
    const events = this.getRandomEventsList();

    // Weighted random selection
    const totalProb = events.reduce((sum, e) => sum + (e.probability || 5), 0);
    let roll = Math.random() * totalProb;

    for (let event of events) {
        roll -= (event.probability || 5);
        if (roll <= 0) return event;
    }

    return events[0];
}

getRandomEventsList() {
    return [
        {
            id: 'cafeteria_riot',
            probability: 5,
            title: 'CAFETERIA RIOT',
            description: 'Someone threw a tray. Then everyone threw trays. Chaos erupts. Guards rush in with batons. You have seconds to decide.',
            choices: [
                {
                    text: 'Join the riot',
                    action: () => {
                        this.adjustReputation('inmates', 10);
                        if (this.player.currentGang) {
                            this.adjustGangRep(this.player.currentGang, 5);
                        }
                        if (Math.random() < 0.5) {
                            this.addCondition('solitary', 3, 'No activities');
                            return 'You join the chaos. Cathartic. Also: 3 days solitary. Worth it.';
                        }
                        return 'You throw some trays. Feels good. No consequences. Yet. Guards are still watching.';
                    }
                },
                {
                    text: 'Stay neutral',
                    action: () => {
                        this.player.prisonDays += 1;
                        return 'You sit quietly. The riot passes. Lockdown for 1 day. Everyone stares at walls.';
                    }
                },
                {
                    text: 'Help guards',
                    action: () => {
                        this.adjustReputation('guards', 15);
                        this.adjustReputation('inmates', -20);
                        return 'You help restrain rioters. Guards appreciate it. Inmates... do not. You are marked.';
                    }
                }
            ]
        },
        {
            id: 'surprise_inspection',
            probability: 8,
            title: 'SURPRISE INSPECTION',
            description: 'Whistles blow. "EVERYONE OUT! INSPECTION!" Guards tear through cells. If you have contraband, pray to whatever god governs prisons.',
            choices: [
                {
                    text: 'Wait for inspection',
                    action: () => {
                        const contraband = this.checkPlayerContraband();
                        if (contraband.length === 0) {
                            this.adjustReputation('guards', 5);
                            return 'Cell is clean. Guard nods approvingly. "Model prisoner." You feel nothing.';
                        } else {
                            return this.contrabandFoundOutcome(contraband);
                        }
                    }
                }
            ]
        },
        {
            id: 'celebrity_inmate',
            probability: 3,
            title: 'CELEBRITY INMATE ARRIVES',
            description: 'Former F1 champion "Lightning Lars" arrested for driving to buy groceries. Media trucks swarm outside. Guards are starstruck. This is surreal.',
            choices: [
                {
                    text: 'Approach celebrity',
                    action: () => {
                        this.adjustReputation('legend', 10);
                        this.player.morale = (this.player.morale || 50) + 20;
                        return 'Lars signs your prison shirt. "We all just wanted to drive, mate." +10 legend, +20 morale for 7 days.';
                    }
                },
                {
                    text: 'Ignore the hype',
                    action: () => {
                        return 'Celebrity worship is beneath you. You return to your cell. The noise continues outside.';
                    }
                }
            ]
        },
        {
            id: 'food_poisoning',
            probability: 7,
            title: 'FOOD POISONING OUTBREAK',
            description: 'Mystery Meat Monday strikes back. 25% of prisoners are vomiting. Including you, potentially. The sick bay is overflowing. Everyone suspects the cafeteria lady.',
            choices: [
                {
                    text: 'Roll the dice',
                    action: () => {
                        if (Math.random() < 0.25) {
                            this.addCondition('food_poisoning', 3, '-15 strength, nausea');
                            this.player.strength = Math.max(0, (this.player.strength || 0) - 15);
                            return 'You are affected. Violent illness. -15 strength for 3 days. The bathroom becomes your home.';
                        } else {
                            return 'Your stomach holds. You are one of the lucky 75%. The screams echo from the bathrooms.';
                        }
                    }
                }
            ]
        },
        {
            id: 'cell_phone_found',
            probability: 3,
            title: 'CONTRABAND CELL PHONE',
            description: 'Someone dropped a phone in the yard. Everyone saw it. Now it is a race. Who grabs it? Who reports it? Who uses it to call home?',
            choices: [
                {
                    text: 'Grab it',
                    action: () => {
                        if (Math.random() < 0.4) {
                            this.player.sentence += 3;
                            this.adjustReputation('guards', -30);
                            return 'You grab it. Guards saw. +3 years sentence. The phone is confiscated. It was not worth it.';
                        } else {
                            if (!this.player.inventory) this.player.inventory = {};
                            this.player.inventory.cellphone = true;
                            this.adjustReputation('legend', 15);
                            return 'You grab it. Nobody saw. You have a phone. This changes everything. (Can make 1 call/day, 10% risk)';
                        }
                    }
                },
                {
                    text: 'Report it',
                    action: () => {
                        this.adjustReputation('guards', 20);
                        this.adjustReputation('inmates', -20);
                        return 'You report it immediately. Guards nod. Inmates glare. You are a snitch now. That label sticks.';
                    }
                },
                {
                    text: 'Ignore it',
                    action: () => {
                        return 'You walk away. Someone else takes it. Drama averted. For now.';
                    }
                }
            ]
        },
        {
            id: 'rat_infestation',
            probability: 5,
            title: 'THE RATS ARRIVE',
            description: 'Rats everywhere. In cells. In the cafeteria. In the walls. The guards released prison cats. Now it is cats vs rats vs inmates. Complete chaos for 5 days.',
            choices: [
                {
                    text: 'Accept the chaos',
                    action: () => {
                        this.addCondition('rat_chaos', 5, 'Random rat encounters, -5 morale');
                        this.player.morale = (this.player.morale || 50) - 5;
                        return 'Rats and cats fight at night. Sleep is impossible. This is your life now. -5 morale for 5 days.';
                    }
                }
            ]
        },
        {
            id: 'movie_night',
            probability: 6,
            title: 'PRISON MOVIE NIGHT',
            description: 'Projector set up in common area. Movie tonight: "The Pedestrian Trials" - a dystopian film where walking is illegal. The irony is not lost on anyone.',
            choices: [
                {
                    text: 'Attend movie',
                    action: () => {
                        this.player.morale = (this.player.morale || 50) + 10;
                        if (Math.random() < 0.05) {
                            this.escapeInspirationBonus = 5;
                            return 'You watch. The protagonist escapes through bureaucratic loophole. Inspiring. +10 morale, +5% escape success.';
                        }
                        return 'You watch. It is absurd. But it is different. +10 morale. You discuss it for days.';
                    }
                },
                {
                    text: 'Skip movie',
                    action: () => {
                        return 'You skip. Movies are for people with hope. You have none. You lie in your cell.';
                    }
                }
            ]
        },
        {
            id: 'earthquake',
            probability: 2,
            title: 'EARTHQUAKE',
            description: 'The ground shakes. Walls crack. Power flickers. Alarm systems fail. For 10 minutes, there is no authority. Just chaos. Opportunities. Choices.',
            choices: [
                {
                    text: 'Attempt immediate escape',
                    action: () => {
                        if (Math.random() < 0.30) {
                            this.showMessage('ESCAPE SUCCESSFUL! You run. You do not stop. You are FREE!', 5000);
                            setTimeout(() => this.startDriving(true), 5000);
                            return 'You run through the cracked walls. No one stops you. YOU ARE FREE!';
                        } else {
                            this.player.sentence += 15;
                            this.addCondition('solitary', 10, 'Failed escape attempt');
                            return 'You try. You fail. Caught 100 yards from the fence. +15 years, 10 days solitary. Hope dies.';
                        }
                    }
                },
                {
                    text: 'Help injured inmates',
                    action: () => {
                        this.adjustReputation('inmates', 30);
                        this.adjustReputation('legend', 20);
                        return 'You pull people from rubble. You save 3 lives. +30 inmate rep, +20 legend. You are a hero.';
                    }
                },
                {
                    text: 'Loot commissary',
                    action: () => {
                        const cigs = 50;
                        this.player.cigarettes = (this.player.cigarettes || 0) + cigs;
                        this.adjustReputation('guards', -10);
                        return `You break into commissary. +${cigs} cigarettes. Guards suspect, but cannot prove. -10 guard rep.`;
                    }
                },
                {
                    text: 'Hide in cell',
                    action: () => {
                        return 'You hide. You survive. Cowardice is also a strategy. No consequences. No glory either.';
                    }
                }
            ]
        },
        {
            id: 'birthday',
            probability: 1,
            title: 'BIRTHDAY',
            description: 'Another year older. Another year in here. Your cellmate gives you a cigarette. "Happy birthday, I guess." It is the thought that counts.',
            choices: [
                {
                    text: 'Accept gift',
                    action: () => {
                        this.player.cigarettes = (this.player.cigarettes || 0) + 1;
                        this.player.morale = (this.player.morale || 50) + 10;
                        if (this.player.cellmate) {
                            this.player.cellmate.relationship = (this.player.cellmate.relationship || 0) + 5;
                        }
                        return 'You take the cigarette. +1 cigarette, +10 morale, +5 cellmate relationship. Birthdays in prison. This is your life.';
                    }
                }
            ]
        },
        {
            id: 'guard_strike',
            probability: 4,
            title: 'GUARD STRIKE',
            description: 'Guards are striking for better pay. Minimal staff. National Guard called in. They do not know prison routines. This is opportunity. Or danger.',
            choices: [
                {
                    text: 'Exploit the chaos',
                    action: () => {
                        this.addCondition('guard_strike', 3, '+20% escape success, commissary closed');
                        this.escapeBonus = (this.escapeBonus || 0) + 20;
                        return 'Guards distracted. 3 days of chaos. +20% escape success rate. Commissary closed. Choose wisely.';
                    }
                },
                {
                    text: 'Stay low',
                    action: () => {
                        return 'You stay in your cell. National Guard is trigger-happy. Better safe. 3 days pass slowly.';
                    }
                }
            ]
        }
    ];
}

showRandomEventScreen(event) {
    // Store current event
    this.currentRandomEvent = event;

    // Create or show event screen
    let eventScreen = document.getElementById('randomEventScreen');
    if (!eventScreen) {
        eventScreen = document.createElement('div');
        eventScreen.id = 'randomEventScreen';
        eventScreen.className = 'screen';
        eventScreen.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto; padding: 40px;">
                <h1 id="randomEventTitle" style="color: #ff0; text-align: center; margin-bottom: 20px;"></h1>
                <div style="background: rgba(255, 0, 0, 0.1); border: 2px solid #ff0; padding: 30px; margin-bottom: 30px;">
                    <p id="randomEventDescription" style="color: #0f0; font-size: 1.1em; line-height: 1.6;"></p>
                </div>
                <div id="randomEventChoices" style="display: flex; flex-direction: column; gap: 15px;"></div>
            </div>
        `;
        document.getElementById('ui').appendChild(eventScreen);
    }

    // Update content
    document.getElementById('randomEventTitle').textContent = event.title;
    document.getElementById('randomEventDescription').textContent = event.description;

    // Generate choice buttons
    const choicesContainer = document.getElementById('randomEventChoices');
    choicesContainer.innerHTML = '';

    event.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.textContent = choice.text;
        btn.style.cssText = 'padding: 15px 30px; font-size: 1.1em; width: 100%;';
        btn.onclick = () => this.handleRandomEventChoice(choice);
        choicesContainer.appendChild(btn);
    });

    this.showScreen('randomEventScreen');
}

handleRandomEventChoice(choice) {
    const outcome = choice.action();

    // Show outcome message
    this.showMessage(outcome, 6000);

    // Save event to history
    if (!this.player.randomEvents) this.player.randomEvents = [];
    this.player.randomEvents.push({
        id: this.currentRandomEvent.id,
        day: this.player.prisonDays,
        choice: choice.text,
        outcome: outcome
    });

    // Return to prison menu
    setTimeout(() => {
        this.showScreen('prisonMenu');
        this.saveGame();
    }, 6000);
}

checkPlayerContraband() {
    const contraband = [];
    if (!this.player.inventory) return contraband;

    if (this.player.inventory.cellphone) contraband.push('cellphone');
    if (this.player.inventory.weapon) contraband.push('weapon');
    if (this.player.inventory.drugs) contraband.push('drugs');
    if (this.player.inventory.bannedBooks > 0) contraband.push('banned_books');

    return contraband;
}

contrabandFoundOutcome(contraband) {
    let outcome = 'CONTRABAND FOUND:\n';
    let totalYearsAdded = 0;

    contraband.forEach(item => {
        switch(item) {
            case 'cellphone':
                totalYearsAdded += 3;
                outcome += '• Cell phone: +3 years\n';
                delete this.player.inventory.cellphone;
                break;
            case 'weapon':
                totalYearsAdded += 10;
                outcome += '• Weapon: +10 years, 14 days solitary\n';
                this.addCondition('solitary', 14, 'No activities');
                delete this.player.inventory.weapon;
                break;
            case 'drugs':
                totalYearsAdded += 5;
                outcome += '• Drugs: +5 years, 7 days solitary\n';
                this.addCondition('solitary', 7, 'No activities');
                delete this.player.inventory.drugs;
                break;
            case 'banned_books':
                this.player.intelligence = Math.max(0, this.player.intelligence - 3);
                outcome += '• Banned books: Confiscated, -3 intelligence\n';
                this.player.inventory.bannedBooks = 0;
                break;
        }
    });

    this.player.sentence += totalYearsAdded;
    this.adjustReputation('guards', -30);

    outcome += `\nTotal sentence increase: +${totalYearsAdded} years`;
    outcome += `\nNew sentence: ${this.player.sentence} years`;
    outcome += '\nGuard reputation: -30';

    return outcome;
}

// ==================== END RANDOM EVENT SYSTEM ====================
```

---

## 2. UNIFIED REPUTATION SYSTEM (Copy to game.js after line 1100)

```javascript
// ==================== REPUTATION SYSTEM ====================

// Add to player initialization in constructor
initializeReputationSystem() {
    if (!this.player.reputation) {
        this.player.reputation = {
            guards: 0,      // -100 to +100
            inmates: 0,     // -100 to +100
            warden: 0,      // -100 to +100
            legend: 0       // 0 to 1000+
        };
    }

    // Initialize reputation effects
    this.updateReputationEffects();
}

adjustReputation(type, amount) {
    if (!this.player.reputation) this.initializeReputationSystem();

    const oldValue = this.player.reputation[type];

    if (type === 'legend') {
        this.player.reputation.legend = Math.max(0, this.player.reputation.legend + amount);
    } else {
        this.player.reputation[type] = Math.max(-100, Math.min(100,
            this.player.reputation[type] + amount));
    }

    const newValue = this.player.reputation[type];

    // Show reputation change message
    if (amount !== 0) {
        const direction = amount > 0 ? '+' : '';
        this.showMessage(`${this.capitalizeFirst(type)} reputation: ${direction}${amount} (${newValue})`, 2000);
    }

    this.updateReputationEffects();
    this.saveGame();
}

updateReputationEffects() {
    if (!this.player.reputation) return;

    const rep = this.player.reputation;

    // Guard reputation effects
    if (rep.guards > 50) {
        this.commissaryDiscount = 0.2; // 20% discount
        this.searchChance = 0.05; // 5% search chance
    } else if (rep.guards > 0) {
        this.commissaryDiscount = 0.1;
        this.searchChance = 0.15;
    } else if (rep.guards > -50) {
        this.commissaryDiscount = 0;
        this.searchChance = 0.25;
    } else {
        this.commissaryDiscount = -0.3; // 30% markup
        this.searchChance = 0.4; // 40% search chance
    }

    // Inmate reputation effects
    if (rep.inmates > 50) {
        this.tradeBonus = 1.2; // 20% better trades
        this.protectionChance = 0.9; // 90% protection
    } else if (rep.inmates > 0) {
        this.tradeBonus = 1.0;
        this.protectionChance = 0.5;
    } else if (rep.inmates > -50) {
        this.tradeBonus = 0.9;
        this.protectionChance = 0.3;
    } else {
        this.tradeBonus = 0.7; // 30% worse trades
        this.protectionChance = 0.1; // Likely attacked
    }

    // Warden reputation effects
    if (rep.warden > 50) {
        this.paroleChance = 0.3;
        this.earlyReleaseChance = 0.15;
    } else if (rep.warden > 0) {
        this.paroleChance = 0.1;
        this.earlyReleaseChance = 0.05;
    } else {
        this.paroleChance = 0;
        this.earlyReleaseChance = 0;
    }

    // Legend effects
    if (rep.legend > 500) {
        this.escapeBonus = (this.escapeBonus || 0) + 20;
        this.gangRecruitmentEase = 30;
    } else if (rep.legend > 200) {
        this.escapeBonus = (this.escapeBonus || 0) + 15;
        this.gangRecruitmentEase = 20;
    } else if (rep.legend > 100) {
        this.escapeBonus = (this.escapeBonus || 0) + 10;
        this.gangRecruitmentEase = 10;
    }
}

showReputationScreen() {
    if (!this.player.reputation) this.initializeReputationSystem();

    // Create reputation screen if it doesn't exist
    let repScreen = document.getElementById('reputationScreen');
    if (!repScreen) {
        repScreen = document.createElement('div');
        repScreen.id = 'reputationScreen';
        repScreen.className = 'screen';
        repScreen.innerHTML = `
            <div style="max-width: 900px; margin: 0 auto; padding: 40px;">
                <h1 style="color: #0f0; text-align: center; margin-bottom: 40px;">PRISON REPUTATION</h1>

                <div class="reputation-category" style="margin-bottom: 30px;">
                    <h2 style="color: #ff0;">GUARDS</h2>
                    <div style="display: flex; align-items: center; gap: 20px; margin: 15px 0;">
                        <div style="flex: 1; background: #222; height: 30px; border: 2px solid #0f0; position: relative;">
                            <div id="guardRepBar" style="background: #0f0; height: 100%; transition: width 0.3s;"></div>
                        </div>
                        <span id="guardRepValue" style="color: #0f0; min-width: 60px; text-align: right;"></span>
                    </div>
                    <p id="guardRepStatus" style="color: #ff0;"></p>
                    <p style="color: #888; font-size: 0.9em;">Effects: Commissary prices, search frequency, punishment severity</p>
                </div>

                <div class="reputation-category" style="margin-bottom: 30px;">
                    <h2 style="color: #ff0;">INMATES</h2>
                    <div style="display: flex; align-items: center; gap: 20px; margin: 15px 0;">
                        <div style="flex: 1; background: #222; height: 30px; border: 2px solid #0f0; position: relative;">
                            <div id="inmateRepBar" style="background: #0f0; height: 100%; transition: width 0.3s;"></div>
                        </div>
                        <span id="inmateRepValue" style="color: #0f0; min-width: 60px; text-align: right;"></span>
                    </div>
                    <p id="inmateRepStatus" style="color: #ff0;"></p>
                    <p style="color: #888; font-size: 0.9em;">Effects: Trade quality, protection from attacks, social opportunities</p>
                </div>

                <div class="reputation-category" style="margin-bottom: 30px;">
                    <h2 style="color: #ff0;">WARDEN</h2>
                    <div style="display: flex; align-items: center; gap: 20px; margin: 15px 0;">
                        <div style="flex: 1; background: #222; height: 30px; border: 2px solid #0f0; position: relative;">
                            <div id="wardenRepBar" style="background: #0f0; height: 100%; transition: width 0.3s;"></div>
                        </div>
                        <span id="wardenRepValue" style="color: #0f0; min-width: 60px; text-align: right;"></span>
                    </div>
                    <p id="wardenRepStatus" style="color: #ff0;"></p>
                    <p style="color: #888; font-size: 0.9em;">Effects: Library access, parole eligibility, early release chance</p>
                </div>

                <div class="reputation-category" style="margin-bottom: 30px; border-top: 2px solid #0f0; padding-top: 30px;">
                    <h2 style="color: #f0f;">LEGEND</h2>
                    <div style="display: flex; align-items: center; gap: 20px; margin: 15px 0;">
                        <span id="legendValue" style="color: #f0f; font-size: 2em;"></span>
                        <span id="legendStatus" style="color: #0f0; flex: 1;"></span>
                    </div>
                    <p style="color: #888; font-size: 0.9em;">Effects: Escape success bonus, gang recruitment ease, inmate stories</p>
                </div>

                <button onclick="game.showScreen('prisonMenu')" style="margin-top: 40px; width: 100%; padding: 15px;">RETURN TO CELL BLOCK</button>
            </div>
        `;
        document.getElementById('ui').appendChild(repScreen);
    }

    const rep = this.player.reputation;

    // Update guard reputation
    document.getElementById('guardRepValue').textContent = rep.guards;
    document.getElementById('guardRepBar').style.width = ((rep.guards + 100) / 2) + '%';
    document.getElementById('guardRepStatus').textContent = this.getRepStatus(rep.guards);

    // Update inmate reputation
    document.getElementById('inmateRepValue').textContent = rep.inmates;
    document.getElementById('inmateRepBar').style.width = ((rep.inmates + 100) / 2) + '%';
    document.getElementById('inmateRepStatus').textContent = this.getRepStatus(rep.inmates);

    // Update warden reputation
    document.getElementById('wardenRepValue').textContent = rep.warden;
    document.getElementById('wardenRepBar').style.width = ((rep.warden + 100) / 2) + '%';
    document.getElementById('wardenRepStatus').textContent = this.getRepStatus(rep.warden);

    // Update legend
    document.getElementById('legendValue').textContent = rep.legend;
    document.getElementById('legendStatus').textContent = this.getLegendStatus(rep.legend);

    this.showScreen('reputationScreen');
}

getRepStatus(rep) {
    if (rep > 75) return 'REVERED - They speak your name with respect';
    if (rep > 50) return 'RESPECTED - Your presence is acknowledged';
    if (rep > 25) return 'LIKED - They are friendly enough';
    if (rep > -25) return 'NEUTRAL - You are just another face';
    if (rep > -50) return 'DISLIKED - They watch you with suspicion';
    if (rep > -75) return 'HATED - They want you gone';
    return 'ENEMY - They want you dead';
}

getLegendStatus(legend) {
    if (legend > 500) return 'LEGENDARY - Your name is spoken in whispers across all cell blocks';
    if (legend > 200) return 'FAMOUS - Everyone knows who you are. Stories are told about you.';
    if (legend > 100) return 'KNOWN - You have a reputation. People recognize you.';
    if (legend > 50) return 'RECOGNIZED - Some inmates know your name.';
    return 'NOBODY - Just another prisoner serving time.';
}

capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==================== END REPUTATION SYSTEM ====================
```

---

## 3. CONDITION/CASCADE SYSTEM (Copy to game.js after line 1200)

```javascript
// ==================== CONDITION CASCADE SYSTEM ====================

// Initialize conditions tracking
initializeConditions() {
    if (!this.player.conditions) {
        this.player.conditions = [];
    }
}

addCondition(type, daysRemaining, effect) {
    if (!this.player.conditions) this.player.conditions = [];

    // Check if condition already exists
    const existing = this.player.conditions.find(c => c.type === type);
    if (existing) {
        existing.daysRemaining = Math.max(existing.daysRemaining, daysRemaining);
        return;
    }

    this.player.conditions.push({
        type: type,
        daysRemaining: daysRemaining,
        effect: effect,
        addedOn: this.player.prisonDays
    });

    this.showMessage(`NEW CONDITION: ${type} - ${effect}`, 4000);
    this.saveGame();
}

updateConditions() {
    if (!this.player.conditions || this.player.conditions.length === 0) return;

    // Decrease days remaining for all conditions
    this.player.conditions.forEach(condition => {
        condition.daysRemaining--;

        // Show condition reminder
        if (condition.daysRemaining > 0 && condition.daysRemaining <= 3) {
            this.showMessage(`${condition.type}: ${condition.daysRemaining} days remaining`, 2000);
        }
    });

    // Remove expired conditions
    const expired = this.player.conditions.filter(c => c.daysRemaining <= 0);
    expired.forEach(condition => {
        this.showMessage(`CONDITION ENDED: ${condition.type}`, 3000);
    });

    this.player.conditions = this.player.conditions.filter(c => c.daysRemaining > 0);

    this.saveGame();
}

hasCondition(type) {
    if (!this.player.conditions) return false;
    return this.player.conditions.some(c => c.type === type);
}

checkConditionRestrictions(activity) {
    if (!this.player.conditions) return { allowed: true };

    // Check for blocking conditions
    const blockingConditions = this.player.conditions.filter(c => {
        if (c.type === 'solitary') return true;
        if (c.type === 'lockdown' && activity !== 'cellmate') return true;
        if (c.type === 'sick_bay' && !['rest', 'cellmate'].includes(activity)) return true;
        return false;
    });

    if (blockingConditions.length > 0) {
        const reasons = blockingConditions.map(c => c.effect).join(', ');
        return {
            allowed: false,
            reason: `Cannot perform activity. Conditions: ${reasons}`
        };
    }

    return { allowed: true };
}

// ==================== END CONDITION CASCADE SYSTEM ====================
```

---

## 4. MODIFY EXISTING METHODS TO USE NEW SYSTEMS

```javascript
// ADD TO startPrison() method - around line 1942
// After showing prison menu, add:
startPrison() {
    // ... existing code ...

    // Initialize new systems
    this.initializeReputationSystem();
    this.initializeConditions();

    // Update conditions
    this.updateConditions();

    // Trigger random event (20% chance)
    setTimeout(() => {
        this.triggerRandomEvent();
    }, 1000);

    // ... rest of existing code ...
}

// MODIFY prisonActivity() method - around line 1950
// Add condition check at the beginning:
prisonActivity(activity) {
    // Check for condition restrictions
    const conditionCheck = this.checkConditionRestrictions(activity);
    if (!conditionCheck.allowed) {
        this.showMessage(conditionCheck.reason, 4000);
        return;
    }

    // ... rest of existing code ...
}

// ADD reputation adjustments to activities
// In prisonActivity(), add these lines for each activity:

// For weights:
if (activity === 'weights') {
    this.adjustReputation('inmates', 2); // Respect for strength
    // ... existing weights code ...
}

// For library:
if (activity === 'read') {
    this.adjustReputation('warden', 1); // Rehabilitation points
    // ... existing library code ...
}

// For eating:
if (activity === 'eating') {
    // Check hunger consequences
    if (this.player.hunger >= 100) {
        this.showMessage('You are too weak from hunger. Forced medical treatment.', 5000);
        this.player.prisonDays += 3;
        this.player.hunger = 50;
        this.player.strength = Math.max(0, (this.player.strength || 0) - 5);
        return;
    }
    // ... existing eating code ...
}
```

---

## 5. ADD REPUTATION BUTTON TO PRISON MENU

```html
<!-- Add to index.html prisonMenu section, after existing activities -->
<div class="prison-activity" onclick="game.showReputationScreen()">
    <h3>REPUTATION</h3>
    <p>Check your standing with guards, inmates, and warden. Legend status displayed.</p>
</div>
```

---

## 6. TESTING THE NEW SYSTEMS

```javascript
// TESTING COMMANDS (paste in browser console)

// Test random event
game.triggerRandomEvent();

// Test reputation
game.adjustReputation('guards', 20);
game.adjustReputation('inmates', -30);
game.adjustReputation('legend', 50);
game.showReputationScreen();

// Test conditions
game.addCondition('solitary', 3, 'No activities allowed');
game.addCondition('infected_tattoo', 7, '-2 strength per day');

// Check conditions
console.log(game.player.conditions);

// Test contraband
game.player.inventory = { cellphone: true, weapon: true };
game.triggerRandomEvent(); // Should trigger inspection eventually

// Force specific event
game.currentRandomEvent = game.getRandomEventsList()[0]; // Cafeteria riot
game.showRandomEventScreen(game.currentRandomEvent);
```

---

## INTEGRATION CHECKLIST

- [ ] Copy Random Event System code to game.js
- [ ] Copy Reputation System code to game.js
- [ ] Copy Condition System code to game.js
- [ ] Modify startPrison() method
- [ ] Modify prisonActivity() method
- [ ] Add reputation adjustments to activities
- [ ] Add Reputation button to HTML
- [ ] Test random events (20% chance)
- [ ] Test reputation changes
- [ ] Test conditions system
- [ ] Save game and reload to verify persistence

---

## EXPECTED BEHAVIOR AFTER INTEGRATION

1. **Random Events:** 20% chance of event each prison day
   - Events have choices
   - Choices affect reputation, stats, or conditions
   - Events show outcome message

2. **Reputation:** Affects all systems
   - Commissary prices adjust based on guard rep
   - Inmate rep affects trades and protection
   - Warden rep affects privileges
   - Legend grows with notable actions

3. **Conditions:** Temporary effects
   - Solitary: Cannot do activities
   - Food poisoning: Reduced strength
   - Rat chaos: Morale penalty
   - Conditions expire after X days

---

## QUICK REFERENCE: Key Function Names

```javascript
// Random Events
game.triggerRandomEvent()
game.rollRandomEvent()
game.getRandomEventsList()
game.showRandomEventScreen(event)
game.handleRandomEventChoice(choice)

// Reputation
game.initializeReputationSystem()
game.adjustReputation(type, amount)
game.updateReputationEffects()
game.showReputationScreen()
game.getRepStatus(rep)
game.getLegendStatus(legend)

// Conditions
game.initializeConditions()
game.addCondition(type, days, effect)
game.updateConditions()
game.hasCondition(type)
game.checkConditionRestrictions(activity)
```

---

**END OF IMPLEMENTATION GUIDE**
