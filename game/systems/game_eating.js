// EATING SIMULATOR METHODS FOR game.js
// Add these methods to the VroomVroomGame class before the animate() method

    startEating() {
        this.gameState = 'eating';
        this.showScreen('eatingSimulator');

        // Initialize eating state
        this.eatingState = {
            bitesRemaining: 20,
            totalBites: 20,
            startTime: Date.now(),
            eatingStarted: false
        };

        // Initialize hunger if not exists
        if (this.player.hunger === undefined) {
            this.player.hunger = 100; // 100 = starving, 0 = full
        }

        // Reset UI
        document.getElementById('bitesRemaining').textContent = '20';
        document.getElementById('hungerLevel').textContent = this.player.hunger;
        document.getElementById('flavorText').textContent = 'Click a bite to eat. Take your time. You have nothing but time.';

        // Draw initial plate
        this.drawPlate();
    }

    drawPlate() {
        const container = document.getElementById('plateVisual');
        const bites = this.eatingState.bitesRemaining;

        // ASCII art plate with mashed potatoes
        let plateArt = '';

        if (bites === 20) {
            // Full plate
            plateArt = `
    ╔════════════════════╗
    ║                    ║
    ║   ████████████     ║
    ║  ██████████████    ║
    ║  ██████████████    ║
    ║  ██████████████    ║
    ║   ████████████     ║
    ║                    ║
    ╚════════════════════╝
     INSTITUTIONAL PLATE
            `;
        } else if (bites >= 16) {
            // Mostly full
            plateArt = `
    ╔════════════════════╗
    ║                    ║
    ║    ██████████      ║
    ║   ████████████     ║
    ║   ████████████     ║
    ║    ██████████      ║
    ║                    ║
    ╚════════════════════╝
     Still quite full...
            `;
        } else if (bites >= 12) {
            // Half eaten
            plateArt = `
    ╔════════════════════╗
    ║                    ║
    ║     ████████       ║
    ║    ██████████      ║
    ║     ████████       ║
    ║                    ║
    ╚════════════════════╝
    Making progress...
            `;
        } else if (bites >= 8) {
            // Quarter left
            plateArt = `
    ╔════════════════════╗
    ║                    ║
    ║      ██████        ║
    ║      ██████        ║
    ║                    ║
    ╚════════════════════╝
    Almost done...
            `;
        } else if (bites >= 4) {
            // Nearly empty
            plateArt = `
    ╔════════════════════╗
    ║                    ║
    ║       ████         ║
    ║                    ║
    ╚════════════════════╝
    Just a few bites...
            `;
        } else if (bites >= 1) {
            // Last few bites
            plateArt = `
    ╔════════════════════╗
    ║                    ║
    ║        ██          ║
    ║                    ║
    ╚════════════════════╝
    One last bite...
            `;
        } else {
            // Empty plate
            plateArt = `
    ╔════════════════════╗
    ║                    ║
    ║                    ║
    ║                    ║
    ║                    ║
    ╚════════════════════╝
    CLEAN PLATE
            `;
        }

        container.textContent = plateArt;
    }

    eatBite() {
        if (this.eatingState.bitesRemaining <= 0) {
            this.finishEating();
            return;
        }

        // Start timing on first bite
        if (!this.eatingState.eatingStarted) {
            this.eatingState.startTime = Date.now();
            this.eatingState.eatingStarted = true;
        }

        // Eat one bite
        this.eatingState.bitesRemaining--;

        // Update hunger stat (decrease hunger by 5 per bite)
        this.player.hunger = Math.max(0, this.player.hunger - 5);

        // Update UI
        document.getElementById('bitesRemaining').textContent = this.eatingState.bitesRemaining;
        document.getElementById('hungerLevel').textContent = this.player.hunger;

        // Draw updated plate
        this.drawPlate();

        // Random flavor text
        const flavorTexts = [
            "Tastes like sadness and regret.",
            "Lukewarm. Like your prospects.",
            "You detect notes of despair and institutional seasoning.",
            "It's gray. The potatoes, your future, everything.",
            "Somehow both mushy and dry at the same time.",
            "You remember the taste of freedom. This is not it.",
            "The texture reminds you of paperwork.",
            "At least it's not mystery meat.",
            "You chew slowly. What's the rush?",
            "Another bite. Another moment of your finite existence.",
            "Is this potato or paste? The question haunts you.",
            "It sticks to the roof of your mouth. Like your sentence.",
            "You taste salt. Are those tears? Or seasoning? Both?",
            "The other inmates watch. Everyone eats alone together.",
            "Bite after bite. Day after day. Year after year.",
            "You think about the cafeteria at your old job. This is worse.",
            "Cold mashed potatoes. A metaphor for life.",
            "Each bite takes you closer to done. Closer to nothing.",
            "You wonder what they put in this. You stop wondering.",
            "It's edible. That's the highest praise you can give it.",
            "You eat because you must. Not because you want to.",
            "The guard watches. You keep chewing.",
            "Someone at the next table sighs. You understand completely.",
            "This is sustenance. Not food. Sustenance.",
            "You miss the taste of anything else.",
            "The fluorescent lights hum. You chew.",
            "Another bite disappears into the void of your stomach.",
            "Is this chicken? No, definitely potato. Probably.",
            "You eat methodically, mechanically, meaninglessly.",
            "Your cellmate's words echo: 'The food is the punishment.'",
            "Ten years ago, you would have complained. Now you just eat.",
            "At least they can't take eating away from you. Wait. Can they?",
            "You taste nothing. You feel nothing. You continue.",
            "Bite. Chew. Swallow. Repeat until gone or until death.",
            "The potatoes are institutional. You are becoming institutional.",
            "You eat in silence. The silence eats you back.",
            "Each bite is exactly like the last. Like the days.",
            "You find a lump. You eat it anyway. What choice do you have?",
            "The taste of absolute mediocrity. Prison cuisine.",
            "You finish this bite and begin the next. The cycle continues."
        ];

        const randomText = flavorTexts[Math.floor(Math.random() * flavorTexts.length)];
        document.getElementById('flavorText').textContent = randomText;

        // Check if finished
        if (this.eatingState.bitesRemaining === 0) {
            setTimeout(() => this.finishEating(), 1500);
        }
    }

    finishEating() {
        // Calculate eating time
        const timeElapsed = Math.floor((Date.now() - this.eatingState.startTime) / 1000);

        // Update UI to show completion
        document.getElementById('eatButton').disabled = true;
        document.getElementById('eatButton').textContent = 'MEAL COMPLETE';

        // Final message
        let finalMessage = '';

        if (timeElapsed < 30) {
            finalMessage = 'You ate quickly. Too quickly. Did you even taste it? Not that it matters. The plate is clean. You are done. Return to your cell.';
        } else if (timeElapsed < 60) {
            finalMessage = 'You ate at a normal pace. Or what passes for normal in here. The plate is clean. Meal time is over. Back to your routine.';
        } else if (timeElapsed < 90) {
            finalMessage = 'You savored each bite. As much as one can savor institutional mashed potatoes. You made it last. The plate is clean. Nothing left to do.';
        } else {
            finalMessage = 'You ate slowly. Deliberately. Making the meal last as long as possible. Because after this, there is only waiting. The plate is clean. Time moves on.';
        }

        document.getElementById('flavorText').innerHTML = `
            <p style="color: #0f0; font-weight: bold; margin-bottom: 10px;">PLATE CLEAN</p>
            <p>${finalMessage}</p>
            <p style="color: #ff0; margin-top: 10px;">Time spent eating: ${timeElapsed} seconds</p>
            <p style="color: #0ff; margin-top: 5px;">Hunger decreased by ${this.eatingState.totalBites * 5}%</p>
        `;

        // Add return to prison button
        setTimeout(() => {
            document.getElementById('eatButton').textContent = 'RETURN TO CELL BLOCK';
            document.getElementById('eatButton').disabled = false;
            document.getElementById('eatButton').onclick = () => {
                // Reset button for next time
                document.getElementById('eatButton').onclick = () => game.eatBite();
                document.getElementById('eatButton').textContent = 'EAT ONE BITE';

                // Return to prison menu
                game.showScreen('prisonMenu');
            };
        }, 3000);

        this.saveGame();
    }
