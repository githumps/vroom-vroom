// ==================== RANDOM EVENTS MANAGER ====================
// VROOM VROOM - Prison Random Events System
// Triggers 10% chance per prison day, affects player stats, integrates with Gemini API

class RandomEventManager {
    constructor(game, geminiGenerator) {
        this.game = game;
        this.geminiGenerator = geminiGenerator;
        this.eventHistory = []; // Track last 7 days of events to prevent repeats
        this.triggerChance = 0.10; // 10% chance per prison day

        this.events = this.initializeEvents();
    }

    initializeEvents() {
        return [
            {
                id: 'cellmate_theft',
                title: 'CELLMATE STEALS CIGARETTES',
                description: 'You wake up to find your cellmate rummaging through your belongings. They\'ve got your cigarette stash!',
                choices: [
                    {
                        text: 'Confront them (Strength 40+)',
                        requirement: { stat: 'strength', value: 40 },
                        outcome: {
                            message: 'You stand your ground. Your cellmate backs down and returns your cigarettes. Respect earned.',
                            effects: { cigarettes: 0, goodBehaviorPoints: -5 }
                        }
                    },
                    {
                        text: 'Let it go',
                        requirement: null,
                        outcome: {
                            message: 'You say nothing. The cigarettes are gone. Sometimes discretion is survival.',
                            effects: { cigarettes: -5, goodBehaviorPoints: 2 }
                        }
                    },
                    {
                        text: 'Report to guard (Intelligence 30+)',
                        requirement: { stat: 'intelligence', value: 30 },
                        outcome: {
                            message: 'You cleverly negotiate with the guard. They retrieve your cigarettes. Your cellmate glares.',
                            effects: { cigarettes: 0, goodBehaviorPoints: 5 }
                        }
                    }
                ]
            },
            {
                id: 'guard_shakedown',
                title: 'GUARD SHAKEDOWN',
                description: 'Guards storm your cell for a random inspection. They\'re tearing everything apart.',
                choices: [
                    {
                        text: 'Stay calm and cooperate',
                        requirement: null,
                        outcome: {
                            message: 'You remain still. They find nothing suspicious. "Clean cell, prisoner. Good." The guards leave.',
                            effects: { goodBehaviorPoints: 10 }
                        }
                    },
                    {
                        text: 'Hide contraband (Intelligence 50+)',
                        requirement: { stat: 'intelligence', value: 50 },
                        outcome: {
                            message: 'You discreetly slide items under the mattress. The guards miss everything. You\'re clever.',
                            effects: { goodBehaviorPoints: 0 }
                        }
                    },
                    {
                        text: 'Argue with guards',
                        requirement: null,
                        outcome: {
                            message: '"This is harassment!" you shout. The guards don\'t appreciate your legal analysis. Solitary for you.',
                            effects: { goodBehaviorPoints: -20, prisonDays: 3 }
                        }
                    }
                ]
            },
            {
                id: 'food_poisoning',
                title: 'FOOD POISONING',
                description: 'The mystery meat from lunch was a mistake. Your stomach churns. The room spins.',
                choices: [
                    {
                        text: 'Visit infirmary',
                        requirement: null,
                        outcome: {
                            message: 'The nurse gives you crackers and water. "You\'ll live. Everyone gets it once." You feel slightly better.',
                            effects: { hunger: -30, prisonDays: 1 }
                        }
                    },
                    {
                        text: 'Tough it out (Strength 30+)',
                        requirement: { stat: 'strength', value: 30 },
                        outcome: {
                            message: 'You endure the pain. By evening, it passes. You\'ve survived worse bureaucratic nightmares.',
                            effects: { hunger: -20 }
                        }
                    },
                    {
                        text: 'Demand better food',
                        requirement: null,
                        outcome: {
                            message: 'You file a formal complaint about cafeteria standards. The warden laughs. Nothing changes.',
                            effects: { hunger: -30, goodBehaviorPoints: -5 }
                        }
                    }
                ]
            },
            {
                id: 'yard_riot',
                title: 'RIOT IN THE YARD',
                description: 'A fight breaks out during yard time. It\'s escalating fast. Guards are running. Choose wisely.',
                choices: [
                    {
                        text: 'Join the riot (Strength 60+)',
                        requirement: { stat: 'strength', value: 60 },
                        outcome: {
                            message: 'You jump into the fray. Chaos. Shouting. When it\'s over, you\'re breathing hard but standing. Respect +50.',
                            effects: { goodBehaviorPoints: -30, strength: 5, cigarettes: 10 }
                        }
                    },
                    {
                        text: 'Hide in your cell',
                        requirement: null,
                        outcome: {
                            message: 'You slip away unnoticed. Smart move. Lockdown lasts 3 days. You read a lot.',
                            effects: { prisonDays: 3, intelligence: 3 }
                        }
                    },
                    {
                        text: 'Mediate (Intelligence 70+)',
                        requirement: { stat: 'intelligence', value: 70 },
                        outcome: {
                            message: 'You talk both sides down. Guards are impressed. Warden notes "leadership potential." Sentence reduced.',
                            effects: { goodBehaviorPoints: 30, sentence: -5 }
                        }
                    }
                ]
            },
            {
                id: 'new_inmate',
                title: 'NEW INMATE ARRIVES',
                description: 'Fresh meat. Young kid, scared, first offense. "Drove to their mom\'s funeral," they whisper.',
                choices: [
                    {
                        text: 'Show them the ropes',
                        requirement: null,
                        outcome: {
                            message: 'You explain the rules. They\'re grateful. Having an ally might pay off later.',
                            effects: { goodBehaviorPoints: 5, intelligence: 2 }
                        }
                    },
                    {
                        text: 'Ignore them',
                        requirement: null,
                        outcome: {
                            message: 'Not your problem. They figure it out eventually. Or they don\'t. Prison is hard.',
                            effects: {}
                        }
                    },
                    {
                        text: 'Extort them (Strength 50+)',
                        requirement: { stat: 'strength', value: 50 },
                        outcome: {
                            message: '"Protection costs cigarettes," you say. They hand them over. You feel slightly worse as a person.',
                            effects: { cigarettes: 8, goodBehaviorPoints: -10 }
                        }
                    }
                ]
            },
            {
                id: 'library_recall',
                title: 'LIBRARY BOOK RECALL',
                description: 'The library is recalling all books for "content review." Your favorites are on the list.',
                choices: [
                    {
                        text: 'Return books',
                        requirement: null,
                        outcome: {
                            message: 'You comply. The shelves are emptier now. Reading options dwindle. Intelligence gains slower.',
                            effects: { goodBehaviorPoints: 5 }
                        }
                    },
                    {
                        text: 'Hide a book (Intelligence 40+)',
                        requirement: { stat: 'intelligence', value: 40 },
                        outcome: {
                            message: 'You smuggle one book under your mattress. Knowledge is power. And contraband.',
                            effects: { intelligence: 5, goodBehaviorPoints: -5 }
                        }
                    },
                    {
                        text: 'Protest the censorship',
                        requirement: null,
                        outcome: {
                            message: 'You write a strongly worded letter to the warden. It\'s ignored. But you tried.',
                            effects: { intelligence: 2, goodBehaviorPoints: -2 }
                        }
                    }
                ]
            },
            {
                id: 'conjugal_inspection',
                title: 'CONJUGAL VISIT INSPECTION',
                description: 'Your visitor is waiting. But guards search everyone today. They find... something suspicious.',
                choices: [
                    {
                        text: 'Take the blame',
                        requirement: null,
                        outcome: {
                            message: '"It\'s mine," you lie. Your visitor leaves safely. You get 5 more years. Chivalry isn\'t dead.',
                            effects: { sentence: 5, goodBehaviorPoints: -20 }
                        }
                    },
                    {
                        text: 'Blame the visitor',
                        requirement: null,
                        outcome: {
                            message: 'You point at them. Guards arrest your visitor. You won\'t see them again. Survival first.',
                            effects: { goodBehaviorPoints: 10 }
                        }
                    },
                    {
                        text: 'Lawyer up (Intelligence 80+)',
                        requirement: { stat: 'intelligence', value: 80 },
                        outcome: {
                            message: 'You cite prison visitation policy clause 7.3.2. Guards realize they have no evidence. Visit proceeds.',
                            effects: { intelligence: 3, cigarettes: 5 }
                        }
                    }
                ]
            },
            {
                id: 'tattoo_infection',
                title: 'TATTOO INFECTION SPREADS',
                description: 'That prison tattoo is looking... bad. Red. Swollen. Hot to the touch. This could be serious.',
                choices: [
                    {
                        text: 'Visit medical (50 credits)',
                        requirement: { stat: 'money', value: 50 },
                        outcome: {
                            message: 'The nurse cleans and bandages it. "You\'re lucky. I\'ve seen worse." Antibiotics administered.',
                            effects: { money: -50, prisonDays: 1 }
                        }
                    },
                    {
                        text: 'Home remedy (Intelligence 35+)',
                        requirement: { stat: 'intelligence', value: 35 },
                        outcome: {
                            message: 'You make a compress from commissary items. It works. Mostly. The swelling goes down.',
                            effects: { money: -10 }
                        }
                    },
                    {
                        text: 'Ignore it',
                        requirement: null,
                        outcome: {
                            message: 'It gets worse. Much worse. Mandatory medical intervention. You lose a week. And some tissue.',
                            effects: { prisonDays: 7, strength: -10 }
                        }
                    }
                ]
            },
            {
                id: 'mail_arrival',
                title: 'MAIL FROM OUTSIDE',
                description: 'Guard hands you a letter. The envelope is worn. You don\'t recognize the handwriting.',
                choices: [
                    {
                        text: 'Read it',
                        requirement: null,
                        outcome: {
                            message: 'It\'s from your family. They forgive you. "Come home soon." You feel something. Hope, maybe.',
                            effects: { intelligence: 5, goodBehaviorPoints: 5 }
                        }
                    },
                    {
                        text: 'Throw it away',
                        requirement: null,
                        outcome: {
                            message: 'The past is gone. You tear it up unread. Some connections are better severed.',
                            effects: {}
                        }
                    },
                    {
                        text: 'Trade it (cigarettes inside!)',
                        requirement: null,
                        outcome: {
                            message: 'Someone hid cigarettes in the envelope. Clever. You sell them for credits. Profit.',
                            effects: { money: 20, cigarettes: 10 }
                        }
                    }
                ]
            },
            {
                id: 'parole_hearing',
                title: 'PAROLE BOARD HEARING',
                description: 'You\'re called before the parole board. Three stern faces. Your file is thick. This could be freedom.',
                choices: [
                    {
                        text: 'Show remorse (Good Behavior 80+)',
                        requirement: { stat: 'goodBehaviorPoints', value: 80 },
                        outcome: {
                            message: '"You\'ve been a model prisoner," they say. "Sentence reduced by 50%." You can\'t believe it. Freedom is closer.',
                            effects: { sentence: -50, goodBehaviorPoints: 10 }
                        }
                    },
                    {
                        text: 'Argue your case (Intelligence 90+)',
                        requirement: { stat: 'intelligence', value: 90 },
                        outcome: {
                            message: 'You present a compelling legal argument. The board is impressed. "Granted. With conditions." Sentence halved.',
                            effects: { sentence: -50, intelligence: 5 }
                        }
                    },
                    {
                        text: 'Stay silent',
                        requirement: null,
                        outcome: {
                            message: 'You have nothing to say. They have nothing to offer. "Denied. See you next year." Guards escort you out.',
                            effects: { goodBehaviorPoints: -5 }
                        }
                    }
                ]
            },
            {
                id: 'solitary_confinement',
                title: 'SOLITARY CONFINEMENT',
                description: 'You broke a rule. Which one? Who knows. 72 hours in the hole. Just you. And the walls. And time.',
                choices: [
                    {
                        text: 'Meditate (Intelligence 60+)',
                        requirement: { stat: 'intelligence', value: 60 },
                        outcome: {
                            message: 'You use the silence. Think. Plan. Emerge sharper. "Solitary makes philosophers," you think.',
                            effects: { prisonDays: 3, intelligence: 10, strength: -5 }
                        }
                    },
                    {
                        text: 'Lose your mind',
                        requirement: null,
                        outcome: {
                            message: 'The walls talk. You answer. When they let you out, you\'re different. Quieter. Stranger.',
                            effects: { prisonDays: 3, intelligence: -10, strength: -10 }
                        }
                    },
                    {
                        text: 'Work out (Strength 40+)',
                        requirement: { stat: 'strength', value: 40 },
                        outcome: {
                            message: 'Push-ups. Sit-ups. Squats. No equipment needed. You emerge harder. Literally.',
                            effects: { prisonDays: 3, strength: 10, intelligence: -5 }
                        }
                    }
                ]
            },
            {
                id: 'work_detail',
                title: 'WORK DETAIL ASSIGNMENT',
                description: 'Mandatory work detail. Kitchen, laundry, or maintenance. Pick your poison.',
                choices: [
                    {
                        text: 'Kitchen duty',
                        requirement: null,
                        outcome: {
                            message: 'You peel potatoes for 8 hours. But you eat well. Hunger is defeated. Plus, you earned wages.',
                            effects: { hunger: 30, money: 15, prisonDays: 1 }
                        }
                    },
                    {
                        text: 'Laundry duty',
                        requirement: null,
                        outcome: {
                            message: 'Hot, humid, boring. But you meet people. Connections made. Cigarettes exchanged.',
                            effects: { cigarettes: 5, money: 10, prisonDays: 1 }
                        }
                    },
                    {
                        text: 'Maintenance (Strength 45+)',
                        requirement: { stat: 'strength', value: 45 },
                        outcome: {
                            message: 'You fix pipes, haul equipment. Hard work. Good pay. You\'re stronger for it.',
                            effects: { strength: 5, money: 25, prisonDays: 1 }
                        }
                    },
                    {
                        text: 'Refuse to work',
                        requirement: null,
                        outcome: {
                            message: '"I know my rights!" The guards don\'t care. Solitary. No pay. No food. Bad choice.',
                            effects: { prisonDays: 5, goodBehaviorPoints: -30, hunger: -50 }
                        }
                    }
                ]
            },
            {
                id: 'contraband_offer',
                title: 'CONTRABAND OFFER',
                description: 'Another inmate approaches. "I got something special. Interested?" They show you a smartphone.',
                choices: [
                    {
                        text: 'Buy it (100 cigarettes)',
                        requirement: { stat: 'cigarettes', value: 100 },
                        outcome: {
                            message: 'You make the trade. The phone works. You have access to... everything. Until guards find it.',
                            effects: { cigarettes: -100, intelligence: 20, goodBehaviorPoints: -40 }
                        }
                    },
                    {
                        text: 'Report them',
                        requirement: null,
                        outcome: {
                            message: 'You tell the guards. They confiscate it. You get a reward. And a reputation as a snitch.',
                            effects: { money: 50, goodBehaviorPoints: 20, cigarettes: -20 }
                        }
                    },
                    {
                        text: 'Walk away',
                        requirement: null,
                        outcome: {
                            message: 'Not worth the risk. You decline politely. They nod. "Smart," they say.',
                            effects: {}
                        }
                    }
                ]
            },
            {
                id: 'gang_initiation',
                title: 'GANG INITIATION DEMAND',
                description: 'The gang you joined wants proof of loyalty. "Beat up that snitch," they say. "Or you\'re out."',
                choices: [
                    {
                        text: 'Do it (Strength 55+)',
                        requirement: { stat: 'strength', value: 55 },
                        outcome: {
                            message: 'You corner the target. Quick, brutal. Gang cheers. You\'re in. Deeper than before.',
                            effects: { goodBehaviorPoints: -40, cigarettes: 30, prisonDays: 2 }
                        }
                    },
                    {
                        text: 'Refuse and leave gang',
                        requirement: null,
                        outcome: {
                            message: '"I\'m out." They don\'t argue. But you\'re alone now. No protection. No benefits.',
                            effects: { goodBehaviorPoints: 10 }
                        }
                    },
                    {
                        text: 'Fake it (Intelligence 65+)',
                        requirement: { stat: 'intelligence', value: 65 },
                        outcome: {
                            message: 'You stage a fake fight. The "victim" is in on it. Gang believes it. Everyone wins.',
                            effects: { cigarettes: 20, intelligence: 5 }
                        }
                    }
                ]
            },
            {
                id: 'guard_bribery',
                title: 'GUARD BRIBERY OPPORTUNITY',
                description: 'A guard whispers: "I can make things easier. For a price." They want 200 credits.',
                choices: [
                    {
                        text: 'Pay the bribe (200 credits)',
                        requirement: { stat: 'money', value: 200 },
                        outcome: {
                            message: 'You hand over the money. The guard smiles. "You won\'t regret this." Better treatment begins.',
                            effects: { money: -200, goodBehaviorPoints: 20 }
                        }
                    },
                    {
                        text: 'Report corruption',
                        requirement: null,
                        outcome: {
                            message: 'You file a complaint with the warden. The guard is reprimanded. They remember you. Badly.',
                            effects: { goodBehaviorPoints: 10, prisonDays: 3 }
                        }
                    },
                    {
                        text: 'Decline politely',
                        requirement: null,
                        outcome: {
                            message: '"Thanks, but no." The guard shrugs. "Your loss." Life continues normally.',
                            effects: {}
                        }
                    }
                ]
            },
            {
                id: 'cellmate_escape',
                title: 'CELLMATE ESCAPE ATTEMPT',
                description: 'Your cellmate wakes you at 3 AM. "I\'m going tonight. Through the vent. You in?"',
                choices: [
                    {
                        text: 'Join the escape (Intelligence 75+)',
                        requirement: { stat: 'intelligence', value: 75 },
                        outcome: {
                            message: 'You both squeeze through. You make it to the perimeter. Freedom! But the alarm sounds... (escape route unlocked)',
                            effects: { sentence: -20, goodBehaviorPoints: -50 }
                        }
                    },
                    {
                        text: 'Wish them luck',
                        requirement: null,
                        outcome: {
                            message: 'They go alone. You hear sirens 20 minutes later. They didn\'t make it. You have a cell to yourself now.',
                            effects: {}
                        }
                    },
                    {
                        text: 'Snitch to guards',
                        requirement: null,
                        outcome: {
                            message: 'You alert the guards. They stop the escape. Your cellmate is moved. You get a reward. And enemies.',
                            effects: { money: 100, goodBehaviorPoints: 30, cigarettes: -30 }
                        }
                    }
                ]
            },
            {
                id: 'visitor_gift',
                title: 'VISITOR BRINGS GIFT',
                description: 'Your visitor slips you something during the hug. Guards didn\'t notice. Do you take it?',
                choices: [
                    {
                        text: 'Take it',
                        requirement: null,
                        outcome: {
                            message: 'It\'s a small package. You hide it. Later: cigarettes, cash, and a note. "Stay strong." You smile.',
                            effects: { cigarettes: 20, money: 50 }
                        }
                    },
                    {
                        text: 'Refuse it',
                        requirement: null,
                        outcome: {
                            message: '"Too risky," you whisper. They understand. The visit ends peacefully. Your conscience is clear.',
                            effects: { goodBehaviorPoints: 10 }
                        }
                    },
                    {
                        text: 'Report to guard (Good Behavior 60+)',
                        requirement: { stat: 'goodBehaviorPoints', value: 60 },
                        outcome: {
                            message: 'You hand it to the guard immediately. They\'re impressed. "Model prisoner." Sentence reduced.',
                            effects: { goodBehaviorPoints: 25, sentence: -3 }
                        }
                    }
                ]
            },
            {
                id: 'kitchen_theft',
                title: 'KITCHEN WORK FOOD THEFT',
                description: 'You\'re on kitchen duty. Fresh bread. Real butter. Fruit. Nobody\'s watching. Steal it?',
                choices: [
                    {
                        text: 'Steal food',
                        requirement: null,
                        outcome: {
                            message: 'You pocket an apple and bread. Later, you feast. Best meal in months. Worth it.',
                            effects: { hunger: 40, goodBehaviorPoints: -10 }
                        }
                    },
                    {
                        text: 'Leave it',
                        requirement: null,
                        outcome: {
                            message: 'You resist temptation. The supervisor notices. "Good work ethic, prisoner." Small raise.',
                            effects: { goodBehaviorPoints: 5, money: 5 }
                        }
                    },
                    {
                        text: 'Share with others (Intelligence 40+)',
                        requirement: { stat: 'intelligence', value: 40 },
                        outcome: {
                            message: 'You distribute food to friends. Loyalty earned. Favors owed. Connections matter in prison.',
                            effects: { hunger: 20, cigarettes: 15, goodBehaviorPoints: -5 }
                        }
                    }
                ]
            },
            {
                id: 'gym_breakdown',
                title: 'GYM EQUIPMENT BREAKS',
                description: 'The weight bench snaps mid-rep. The bar crashes down. Your hand is underneath. Pain.',
                choices: [
                    {
                        text: 'Visit medical',
                        requirement: null,
                        outcome: {
                            message: 'Broken finger. Splint applied. "No lifting for 2 weeks," the nurse says. You rest reluctantly.',
                            effects: { prisonDays: 2, strength: -5 }
                        }
                    },
                    {
                        text: 'Tough it out (Strength 70+)',
                        requirement: { stat: 'strength', value: 70 },
                        outcome: {
                            message: 'You wrap it yourself. It hurts. You keep lifting with the other arm. "Pain is weakness leaving," you mutter.',
                            effects: { strength: 3 }
                        }
                    },
                    {
                        text: 'Sue the prison (Intelligence 85+)',
                        requirement: { stat: 'intelligence', value: 85 },
                        outcome: {
                            message: 'You file negligence paperwork. The prison settles quietly. Equipment replaced. You get compensation.',
                            effects: { money: 150, sentence: -5 }
                        }
                    }
                ]
            },
            {
                id: 'lights_out_early',
                title: 'LIGHTS OUT EARLY',
                description: 'Guards kill the lights at 7 PM. Power outage? Punishment? Who knows. Darkness. Hours of it.',
                choices: [
                    {
                        text: 'Sleep early',
                        requirement: null,
                        outcome: {
                            message: 'You close your eyes. Rest comes surprisingly easy. Morning feels less terrible than usual.',
                            effects: { strength: 5, hunger: 5 }
                        }
                    },
                    {
                        text: 'Talk with cellmate',
                        requirement: null,
                        outcome: {
                            message: 'In the darkness, your cellmate opens up. Real talk. Stories. Connection. Humanity remains.',
                            effects: { intelligence: 3 }
                        }
                    },
                    {
                        text: 'Plan your escape (Intelligence 55+)',
                        requirement: { stat: 'intelligence', value: 55 },
                        outcome: {
                            message: 'You use the darkness to think. Plot. Scheme. The pieces fall into place. Progress made.',
                            effects: { intelligence: 8 }
                        }
                    }
                ]
            }
        ];
    }

    // Check if event can trigger
    canTriggerEvent(eventId) {
        // Check if event happened in last 7 prison days
        const recentEvents = this.eventHistory.slice(-7);
        return !recentEvents.includes(eventId);
    }

    // Roll for random event (10% chance)
    shouldTriggerEvent() {
        return Math.random() < this.triggerChance;
    }

    // Get random event that hasn't happened recently
    getRandomEvent() {
        const availableEvents = this.events.filter(event => this.canTriggerEvent(event.id));

        if (availableEvents.length === 0) {
            // All events exhausted, reset history
            this.eventHistory = [];
            return this.events[Math.floor(Math.random() * this.events.length)];
        }

        return availableEvents[Math.floor(Math.random() * availableEvents.length)];
    }

    // Check if player meets requirement
    meetsRequirement(choice) {
        if (!choice.requirement) return true;

        const { stat, value } = choice.requirement;

        // Handle different stat types
        if (stat === 'strength' || stat === 'intelligence' || stat === 'hunger' ||
            stat === 'goodBehaviorPoints' || stat === 'money' || stat === 'cigarettes') {
            return this.game.player[stat] >= value;
        }

        return false;
    }

    // Apply event outcome to player
    applyOutcome(outcome) {
        const effects = outcome.effects;

        // Apply all stat changes
        for (let stat in effects) {
            if (this.game.player.hasOwnProperty(stat)) {
                // Handle percentage-based sentence reduction
                if (stat === 'sentence' && effects[stat] < 0) {
                    const reduction = Math.abs(effects[stat]);
                    this.game.player.sentence = Math.max(0, this.game.player.sentence - reduction);
                } else {
                    this.game.player[stat] += effects[stat];
                }

                // Clamp values
                if (stat === 'hunger' || stat === 'strength' || stat === 'intelligence') {
                    this.game.player[stat] = Math.max(0, Math.min(100, this.game.player[stat]));
                }
                if (stat === 'goodBehaviorPoints') {
                    this.game.player[stat] = Math.max(-100, Math.min(100, this.game.player[stat]));
                }
                if (stat === 'cigarettes' || stat === 'money') {
                    this.game.player[stat] = Math.max(0, this.game.player[stat]);
                }
            }
        }

        // Show outcome message
        this.game.showMessage(outcome.message, 5000);

        // Save game after event
        this.game.saveGame();
    }

    // Show event modal
    showEventModal(event) {
        const modal = document.getElementById('randomEventModal');
        const title = document.getElementById('eventTitle');
        const description = document.getElementById('eventDescription');
        const choicesContainer = document.getElementById('eventChoices');

        title.textContent = event.title;
        description.textContent = event.description;
        choicesContainer.innerHTML = '';

        // Create choice buttons
        event.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'event-choice-btn';

            const meetsReq = this.meetsRequirement(choice);

            if (!meetsReq) {
                button.classList.add('disabled');
                button.disabled = true;
            }

            // Format button text
            let buttonText = choice.text;
            if (!meetsReq && choice.requirement) {
                const req = choice.requirement;
                buttonText += ` [REQUIRES ${req.stat.toUpperCase()}: ${req.value}]`;
            }

            button.textContent = buttonText;

            button.addEventListener('click', () => {
                this.handleChoice(event, choice);
                this.closeEventModal();
            });

            choicesContainer.appendChild(button);
        });

        modal.style.display = 'flex';
    }

    // Close event modal
    closeEventModal() {
        const modal = document.getElementById('randomEventModal');
        modal.style.display = 'none';
    }

    // Handle player choice
    handleChoice(event, choice) {
        // Add event to history
        this.eventHistory.push(event.id);

        // Sync to player object
        this.game.player.randomEventHistory = this.eventHistory;

        // Apply outcome
        this.applyOutcome(choice.outcome);

        // Update UI
        this.game.updateUI();
    }

    // Trigger event (called from prisonActivity)
    triggerRandomEvent() {
        if (this.shouldTriggerEvent()) {
            const event = this.getRandomEvent();

            // Delay to allow prison activity message to show first
            setTimeout(() => {
                this.showEventModal(event);
            }, 2000);
        }
    }
}

// ==================== END RANDOM EVENTS MANAGER ====================
