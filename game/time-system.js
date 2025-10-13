// Real-Time Clock and Events System for VROOM VROOM
// Add these methods to the VroomVroomGame class

// ========================================
// REAL-TIME CLOCK AND EVENTS SYSTEM
// ========================================

// Get current real-world time info
getCurrentTime() {
    const now = new Date();
    return {
        hour: now.getHours(),
        minute: now.getMinutes(),
        timestamp: Date.now(),
        dayOfWeek: now.getDay(), // 0 = Sunday, 6 = Saturday
        date: now.toLocaleDateString()
    };
}

// Get prison schedule based on current time
getPrisonSchedule() {
    const time = this.getCurrentTime();
    const hour = time.hour;

    // Prison schedule (24-hour format)
    if (hour >= 6 && hour < 7) {
        return {
            activity: 'Wake Up Call',
            available: ['cellmate'],
            restricted: ['yard', 'commissary', 'eat', 'weights', 'gang', 'tattoo']
        };
    } else if (hour >= 7 && hour < 8) {
        return {
            activity: 'Breakfast',
            available: ['eat', 'cellmate'],
            restricted: ['yard', 'commissary', 'weights', 'gang', 'tattoo']
        };
    } else if (hour >= 8 && hour < 10) {
        return {
            activity: 'Morning Work Detail',
            available: ['read', 'letter', 'cellmate'],
            restricted: ['commissary', 'yard', 'weights', 'gang', 'tattoo']
        };
    } else if (hour >= 10 && hour < 12) {
        return {
            activity: 'Yard Time',
            available: ['weights', 'cellmate', 'gang'],
            restricted: ['commissary', 'read', 'eat', 'tattoo']
        };
    } else if (hour >= 12 && hour < 13) {
        return {
            activity: 'Lunch',
            available: ['eat', 'cellmate'],
            restricted: ['yard', 'commissary', 'weights', 'gang', 'tattoo']
        };
    } else if (hour >= 13 && hour < 14) {
        return {
            activity: 'Free Time',
            available: ['read', 'letter', 'tattoo', 'cellmate'],
            restricted: ['yard', 'commissary', 'weights', 'gang']
        };
    } else if (hour >= 14 && hour < 17) {
        return {
            activity: 'Afternoon Activities',
            available: ['weights', 'gang', 'cellmate', 'read'],
            restricted: ['commissary', 'eat', 'tattoo']
        };
    } else if (hour >= 17 && hour < 18) {
        return {
            activity: 'Commissary Hours',
            available: ['commissary', 'cellmate'],
            restricted: ['yard', 'weights', 'eat', 'gang', 'tattoo']
        };
    } else if (hour >= 18 && hour < 19) {
        return {
            activity: 'Dinner',
            available: ['eat', 'cellmate'],
            restricted: ['yard', 'commissary', 'weights', 'gang', 'tattoo']
        };
    } else if (hour >= 19 && hour < 22) {
        return {
            activity: 'Evening Recreation',
            available: ['read', 'letter', 'cellmate', 'tattoo'],
            restricted: ['commissary', 'weights', 'yard', 'gang', 'eat']
        };
    } else if (hour >= 22 || hour < 6) {
        return {
            activity: 'Lights Out',
            available: ['cellmate'],
            restricted: ['eat', 'weights', 'yard', 'commissary', 'gang', 'tattoo', 'read']
        };
    }

    return {
        activity: 'Free Time',
        available: ['cellmate', 'read', 'letter'],
        restricted: []
    };
}

// Generate events that happened in prison while player was away
generatePrisonTimeDigest(daysServed) {
    const events = [];
    const timeAway = this.getCurrentTime().timestamp - this.player.lastPlayed;
    const hoursAway = Math.floor(timeAway / (1000 * 60 * 60));

    // Generate 1-3 events per day served, with some randomness
    const numEvents = Math.min(15, Math.floor(daysServed * 1.5) + Math.floor(Math.random() * 3));

    const eventTypes = [
        // Mundane prison events
        {
            type: 'routine',
            text: 'You attended morning roll call. The guard mispronounced your name. Again.',
            chance: 0.3
        },
        {
            type: 'routine',
            text: 'Breakfast was served. The eggs were grey. They are always grey.',
            chance: 0.25
        },
        {
            type: 'routine',
            text: 'You spent time in the yard. The sky was visible. For exactly 47 minutes.',
            chance: 0.2
        },
        {
            type: 'routine',
            text: 'Lunch: mystery meat, wilted lettuce, despair. The usual.',
            chance: 0.25
        },
        {
            type: 'routine',
            text: 'You attended a mandatory life skills workshop. Topic: "The Dangers of Driving."',
            chance: 0.15
        },

        // Cellmate interactions
        {
            type: 'cellmate',
            text: 'Your cellmate told you about his driving conviction. Again. It\'s always the same story.',
            chance: 0.2
        },
        {
            type: 'cellmate',
            text: 'Your cellmate received a letter from home. He cried. You pretended not to notice.',
            chance: 0.1
        },
        {
            type: 'cellmate',
            text: 'You and your cellmate played cards. He won. He always wins. You suspect he cheats.',
            chance: 0.15
        },

        // Contraband and incidents
        {
            type: 'incident',
            text: 'Guards found contraband in Cell Block D. Everyone lost commissary privileges for a week.',
            chance: 0.08
        },
        {
            type: 'incident',
            text: 'Someone tried to escape through the ventilation shaft. They made it 6 feet before getting stuck.',
            chance: 0.05
        },
        {
            type: 'incident',
            text: 'A fight broke out in the cafeteria. Two inmates argued over which is worse: driving or parking.',
            chance: 0.1
        },
        {
            type: 'incident',
            text: 'The prison went on lockdown. Reason unknown. Duration: 8 hours. Explanation: none.',
            chance: 0.07
        },

        // Dropped soap jokes (because why not)
        {
            type: 'shower',
            text: 'You dropped the soap in the shower. Nothing happened. This isn\'t that kind of game.',
            chance: 0.03
        },
        {
            type: 'shower',
            text: 'Someone else dropped the soap. Everyone laughed. Prison humor is... limited.',
            chance: 0.02
        },

        // Gang/Safe Drivers Club
        {
            type: 'gang',
            text: 'The Safe Drivers Club held a meeting. Topic: "Proper Mirror Adjustment Techniques." Riveting.',
            chance: 0.12
        },
        {
            type: 'gang',
            text: 'You discussed turn signal etiquette with your gang. Everyone agreed: always signal. Even in prison.',
            chance: 0.1
        },

        // Letters and mail
        {
            type: 'mail',
            text: 'You received mail. It was an advertisement for car insurance. The irony is not lost on you.',
            chance: 0.08
        },
        {
            type: 'mail',
            text: 'A letter arrived for you. The guards opened it first. They read everything. Privacy is a memory.',
            chance: 0.1
        },

        // Philosophical moments
        {
            type: 'reflection',
            text: 'You stared at the ceiling. It stared back. Neither of you blinked.',
            chance: 0.15
        },
        {
            type: 'reflection',
            text: 'You thought about freedom. Then you thought about driving. Then you felt sad.',
            chance: 0.12
        },
        {
            type: 'reflection',
            text: 'You wondered what Judge Hardcastle is doing right now. Probably judging someone. Always judging.',
            chance: 0.08
        },

        // Work detail
        {
            type: 'work',
            text: 'You worked in the prison laundry. You folded 847 orange jumpsuits. You counted. Twice.',
            chance: 0.15
        },
        {
            type: 'work',
            text: 'Kitchen duty. You peeled potatoes for 4 hours. Your hands smell like potatoes. Everything smells like potatoes.',
            chance: 0.12
        },

        // Random absurd events
        {
            type: 'absurd',
            text: 'The warden gave a speech about traffic law reform. He cried. You\'re not sure why.',
            chance: 0.05
        },
        {
            type: 'absurd',
            text: 'An educational film was shown: "Crosswalks: The Pedestrian Alternative." It was 90 minutes long.',
            chance: 0.06
        },
        {
            type: 'absurd',
            text: 'You learned that prisoner #4422 is also here for driving. And prisoner #4423. And #4424. It\'s everyone. Everyone drove.',
            chance: 0.08
        }
    ];

    // Generate random events based on chances
    for (let i = 0; i < numEvents; i++) {
        const roll = Math.random();
        let cumulativeChance = 0;

        for (const eventType of eventTypes) {
            cumulativeChance += eventType.chance;
            if (roll <= cumulativeChance) {
                events.push({
                    type: eventType.type,
                    text: eventType.text,
                    day: Math.floor((i / numEvents) * daysServed) + 1
                });
                break;
            }
        }
    }

    // Add time-specific events
    if (daysServed >= 7) {
        events.push({
            type: 'milestone',
            text: 'You completed one full week. The guards gave you a certificate. It says "Exemplary Time-Serving." You hung it on your wall.',
            day: 7
        });
    }

    if (daysServed >= 30) {
        events.push({
            type: 'milestone',
            text: 'One month served. Your cellmate threw you a "party." It involved stale crackers and tap water. It was the thought that counted.',
            day: 30
        });
    }

    return {
        daysServed: daysServed,
        hoursAway: hoursAway,
        events: events.slice(0, 15), // Limit to 15 events max
        currentSchedule: this.getPrisonSchedule()
    };
}

// Generate events that happened while player was free (not in prison)
generateFreeTimeDigest(hoursAway) {
    const events = [];
    const daysAway = Math.floor(hoursAway / 24);

    // Generate 1-2 events per day away
    const numEvents = Math.min(10, Math.floor(daysAway * 1.2) + 1);

    const freeEvents = [
        {
            text: 'Life outside prison continued. Cars drove by your window. You watched. You yearned.',
            chance: 0.25
        },
        {
            text: 'You walked past a parking lot. So many cars. All of them judging you.',
            chance: 0.15
        },
        {
            text: 'A bus passed you on the street. You wondered what it feels like to drive again. Probably illegal.',
            chance: 0.2
        },
        {
            text: 'You saw a traffic cop giving someone a ticket. You felt a strange kinship with that stranger.',
            chance: 0.12
        },
        {
            text: 'The mail arrived. Nothing for you. Just bills and advertisements for auto insurance you cannot use.',
            chance: 0.15
        },
        {
            text: 'You dreamed about driving. You woke up in a cold sweat. Judge Hardcastle was in the dream. Always judging.',
            chance: 0.18
        },
        {
            text: 'A neighbor asked to borrow your car. You don\'t have a car anymore. They don\'t believe you.',
            chance: 0.1
        },
        {
            text: 'You took the bus to work. It was slow. You miss driving. You also miss freedom from prison.',
            chance: 0.15
        },
        {
            text: 'The seasons changed. You noticed because cars now have snow tires. Or maybe summer tires. You\'re not sure. You can\'t drive anymore.',
            chance: 0.08
        },
        {
            text: 'A police siren wailed in the distance. Your hands trembled. PTSD from your driving arrest. It never goes away.',
            chance: 0.12
        }
    ];

    for (let i = 0; i < numEvents; i++) {
        const roll = Math.random();
        let cumulativeChance = 0;

        for (const eventType of freeEvents) {
            cumulativeChance += eventType.chance;
            if (roll <= cumulativeChance) {
                events.push({
                    text: eventType.text,
                    day: Math.floor((i / numEvents) * daysAway) + 1
                });
                break;
            }
        }
    }

    return {
        hoursAway: hoursAway,
        daysAway: daysAway,
        events: events.slice(0, 10)
    };
}

// Show the time digest screen to player
showTimeDigestScreen(digest, isReleased = false, wasFree = false) {
    // Create digest screen dynamically if not exists
    let digestScreen = document.getElementById('timeDigestScreen');
    if (!digestScreen) {
        digestScreen = document.createElement('div');
        digestScreen.id = 'timeDigestScreen';
        digestScreen.className = 'screen';
        digestScreen.innerHTML = `
            <h2 id="digestTitle">WHILE YOU WERE AWAY...</h2>
            <div id="digestContent" style="max-height: 60vh; overflow-y: auto; padding: 20px;">
                <!-- Dynamic content goes here -->
            </div>
            <button onclick="game.closeTimeDigest()" style="margin-top: 20px;">Continue</button>
        `;
        document.body.appendChild(digestScreen);
    }

    // Update digest content
    const digestContent = document.getElementById('digestContent');
    const digestTitle = document.getElementById('digestTitle');

    if (wasFree) {
        // Free time digest
        digestTitle.textContent = 'WHILE YOU WERE AWAY...';
        digestContent.innerHTML = `
            <p style="color: #ff0; font-size: 1.2em; margin-bottom: 20px;">
                Time passed: ${digest.hoursAway} hours (${digest.daysAway} days)
            </p>
            <p style="color: #0f0; margin-bottom: 20px;">
                You were free. Technically. But were you really free if you can't drive?
            </p>
            <div style="margin-top: 20px; text-align: left;">
                ${digest.events.map(event => `
                    <p style="color: #ccc; margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.05); border-left: 3px solid #666;">
                        <span style="color: #888;">Day ${event.day}:</span> ${event.text}
                    </p>
                `).join('')}
            </div>
        `;
    } else if (isReleased) {
        // Released from prison
        digestTitle.textContent = 'YOUR SENTENCE IS COMPLETE';
        digestContent.innerHTML = `
            <p style="color: #0f0; font-size: 1.3em; margin-bottom: 20px;">
                YOU ARE FREE
            </p>
            <p style="color: #ff0; margin-bottom: 20px;">
                Time served: ${digest.daysServed} days (${Math.floor(digest.hoursAway)} hours in real time)
            </p>
            <p style="color: #ccc; margin-bottom: 20px;">
                While you were away, life in prison continued...
            </p>
            <div style="margin-top: 20px; text-align: left; max-height: 40vh; overflow-y: auto;">
                ${digest.events.map(event => `
                    <p style="color: #ccc; margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.05); border-left: 3px solid ${this.getEventColor(event.type)};">
                        <span style="color: #888;">Day ${event.day}:</span> ${event.text}
                    </p>
                `).join('')}
            </div>
            <p style="color: #0f0; margin-top: 30px; font-size: 1.1em;">
                The gates are opening. You are free to go. You know what you'll do next.
            </p>
        `;
    } else {
        // Still in prison
        digestTitle.textContent = 'WHILE YOU WERE AWAY...';
        digestContent.innerHTML = `
            <p style="color: #ff0; font-size: 1.2em; margin-bottom: 20px;">
                Time served: ${digest.daysServed} days (${Math.floor(digest.hoursAway)} hours real time)
            </p>
            <p style="color: #ccc; margin-bottom: 20px;">
                Sentence: ${this.player.sentence * 7} days | Remaining: ${(this.player.sentence * 7) - this.player.prisonDays} days
            </p>
            <div style="margin-top: 20px; text-align: left; max-height: 40vh; overflow-y: auto;">
                ${digest.events.map(event => `
                    <p style="color: #ccc; margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.05); border-left: 3px solid ${this.getEventColor(event.type)};">
                        <span style="color: #888;">Day ${event.day}:</span> ${event.text}
                    </p>
                `).join('')}
            </div>
            <div style="margin-top: 30px; padding: 15px; background: rgba(255,255,0,0.1); border: 2px solid #ff0;">
                <p style="color: #ff0; font-weight: bold; margin-bottom: 10px;">CURRENT TIME: ${digest.currentSchedule.activity}</p>
                <p style="color: #0f0;">Available activities: ${digest.currentSchedule.available.join(', ')}</p>
                ${digest.currentSchedule.restricted.length > 0 ? `<p style="color: #f00;">Restricted: ${digest.currentSchedule.restricted.join(', ')}</p>` : ''}
            </div>
        `;
    }

    this.showScreen('timeDigestScreen');
    this.storeTimeDigestState(isReleased, wasFree);
}

// Store digest state to handle close button
storeTimeDigestState(isReleased, wasFree) {
    this.timeDigestState = { isReleased, wasFree };
}

// Close time digest and continue game
closeTimeDigest() {
    const state = this.timeDigestState || {};

    if (state.isReleased) {
        // Player served full sentence, release them
        this.player.prisonStartTime = null;
        this.endPrison();
    } else if (state.wasFree) {
        // Player was free, continue driving
        this.startDriving();
    } else {
        // Player still in prison, show prison menu
        this.startPrison();
    }

    this.saveGame();
}

// Get color for event type
getEventColor(type) {
    const colors = {
        routine: '#666',
        cellmate: '#888',
        incident: '#f00',
        shower: '#0ff',
        gang: '#0f0',
        mail: '#ff0',
        reflection: '#88f',
        work: '#f80',
        absurd: '#f0f',
        milestone: '#0f0'
    };
    return colors[type] || '#666';
}

// Check if activity is available based on current time
isActivityAvailable(activity) {
    const schedule = this.getPrisonSchedule();
    return schedule.available.includes(activity) && !schedule.restricted.includes(activity);
}

// Show time-based restriction message
showTimeRestriction(activity) {
    const schedule = this.getPrisonSchedule();
    const messages = {
        yard: `It's ${schedule.activity}. Yard time is from 10:00 AM to 12:00 PM. Come back later.`,
        weights: `The gym is closed during ${schedule.activity}. Available during Yard Time (10 AM - 12 PM) and Afternoon Activities (2 PM - 5 PM).`,
        commissary: `Commissary hours are 5:00 PM to 6:00 PM. Current time block: ${schedule.activity}.`,
        eat: `The cafeteria is closed. Meals are served at: Breakfast (7 AM), Lunch (12 PM), Dinner (6 PM).`,
        gang: `Gang meetings happen during Yard Time (10 AM - 12 PM) and Afternoon Activities (2 PM - 5 PM). Current: ${schedule.activity}.`,
        tattoo: `The tattoo artist is only available during Free Time (1 PM - 2 PM) and Evening Recreation (7 PM - 10 PM). Current: ${schedule.activity}.`
    };

    const message = messages[activity] || `This activity is not available during ${schedule.activity}.`;
    this.showMessage(message, 5000);
}
