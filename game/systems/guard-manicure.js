// GUARD MANICURE BRIBE SYSTEM
// Dark humor dystopian prison manicure mini-game
// Because even guards in a totalitarian driving prison need self-care

class GuardManicureSystem {
    constructor(game) {
        this.game = game;

        // Guard personality database
        this.guards = {
            jenkins: {
                name: "Guard Jenkins",
                preferredColor: "red",
                colorHex: "#8B0000",
                timerWindow: 2000, // milliseconds
                personality: "Strict and punctual. Values efficiency.",
                greeting: "Make it quick. I have a shift in 30 minutes.",
                success: "Hmph. Acceptable. You actually followed the timer.",
                failure: "Too slow! I don't have all day for this nonsense.",
                chatLines: [
                    "Red reminds me of stop signs. I miss enforcing traffic laws.",
                    "Hurry up. Time is literally everything to me.",
                    "You know what I hate? People who run yellow lights. And you."
                ]
            },
            martinez: {
                name: "Guard Martinez",
                preferredColor: "clear",
                colorHex: "#E8E8E8",
                patternDifficulty: "hard",
                personality: "Detail-oriented. Wants perfection.",
                greeting: "Ah, a manicure. Let's make this beautiful, shall we?",
                success: "Magnifico! Look at that pattern work. You have talent.",
                failure: "These patterns are all wrong. Did you even try?",
                chatLines: [
                    "I used to detail cars before this job. Everything must be perfect.",
                    "Clear polish shows the natural nail. It's elegant. Pure.",
                    "My mother was a nail technician. I know quality when I see it."
                ]
            },
            chen: {
                name: "Guard Chen",
                preferredColor: "black",
                colorHex: "#1A1A1A",
                patience: 0.5, // Very impatient
                personality: "Impatient and irritable. Rushes everything.",
                greeting: "Yeah yeah, let's get this over with. Black. Quick.",
                success: "Finally. Took you long enough. They look good though.",
                failure: "This is taking FOREVER. Forget it. I'm out.",
                chatLines: [
                    "Faster. FASTER. Come on!",
                    "Black is the only color. No arguments.",
                    "Every second you waste, I'm thinking of new violations to write you up for."
                ]
            },
            thompson: {
                name: "Guard Thompson",
                preferredColor: "pink",
                colorHex: "#FFB6C1",
                chattiness: "high",
                personality: "Friendly and chatty. Talks constantly.",
                greeting: "Oh wonderful! I love manicures. Pink please. Let me tell you about my day...",
                success: "These look AMAZING! You know, my sister does nails professionally and...",
                failure: "Oh no, these didn't turn out right. It's okay though, you tried your best!",
                chatLines: [
                    "Pink is such a happy color, don't you think? My daughter loves pink...",
                    "Did I tell you about the time I pulled over someone for having a dirty license plate?",
                    "You're pretty good at this! Ever considered a career in cosmetology? Oh wait...",
                    "I grew up in a small town where everyone drove everywhere. Wild times.",
                    "Between you and me, I think the driving laws are a bit excessive. Don't tell anyone."
                ]
            },
            rodriguez: {
                name: "Guard Rodriguez",
                preferredColor: "blue",
                colorHex: "#4169E1",
                suspicious: true,
                personality: "Paranoid and suspicious. Questions everything.",
                greeting: "A manicure, huh? What's your angle here? Blue. And don't try anything.",
                success: "Hm. These actually look... decent. You're not planning anything, are you?",
                failure: "I KNEW IT. You're trying to sabotage me. This is a setup!",
                chatLines: [
                    "Why are you really doing this? What do you want from me?",
                    "Blue is the color of authority. Like police lights. Wait, are you mocking me?",
                    "I know you want something. Everyone in here wants something.",
                    "You know what's suspicious? Being nice to guards. That's what."
                ]
            }
        };

        // Manicure state
        this.currentGuard = null;
        this.currentStep = 0;
        this.stepsCompleted = [];
        this.stepsPassed = 0;
        this.startTime = null;

        // Mini-game state
        this.soakTimer = null;
        this.trimTarget = null;
        this.filePattern = [];
        this.selectedColor = null;
        this.dryStartTime = null;
        this.hasMoved = false;
    }

    // Initialize manicure session with random guard
    startManicure() {
        const guardKeys = Object.keys(this.guards);
        const randomKey = guardKeys[Math.floor(Math.random() * guardKeys.length)];
        this.currentGuard = this.guards[randomKey];
        this.currentStep = 0;
        this.stepsCompleted = [false, false, false, false, false];
        this.stepsPassed = 0;
        this.startTime = Date.now();

        // Show manicure screen
        this.game.showScreen('guardManicure');
        this.renderManicureUI();
        this.startStep1_Soak();
    }

    // Render the manicure interface
    renderManicureUI() {
        const screen = document.getElementById('guardManicure');

        // Show guard info
        document.getElementById('guardName').textContent = this.currentGuard.name;
        document.getElementById('guardGreeting').textContent = this.currentGuard.greeting;
        document.getElementById('guardChatBox').textContent = this.getRandomChatLine();

        // Show progress
        this.updateProgressBar();
    }

    getRandomChatLine() {
        const lines = this.currentGuard.chatLines;
        return lines[Math.floor(Math.random() * lines.length)];
    }

    updateProgressBar() {
        const stepLabels = ['SOAK', 'TRIM', 'FILE', 'POLISH', 'DRY'];
        for (let i = 0; i < 5; i++) {
            const stepEl = document.getElementById(`step${i + 1}`);
            if (i < this.currentStep) {
                stepEl.className = this.stepsCompleted[i] ? 'step-complete' : 'step-failed';
            } else if (i === this.currentStep) {
                stepEl.className = 'step-active';
            } else {
                stepEl.className = 'step-pending';
            }
        }
    }

    // STEP 1: Soak nails - timing game
    startStep1_Soak() {
        this.currentStep = 0;
        document.getElementById('miniGameTitle').textContent = 'STEP 1: SOAK NAILS';
        document.getElementById('miniGameInstructions').textContent =
            `Soak ${this.currentGuard.name}'s nails in the solution. Click STOP when the timer hits the green zone!`;

        // Show soak mini-game
        document.getElementById('soakGame').style.display = 'block';
        document.getElementById('trimGame').style.display = 'none';
        document.getElementById('fileGame').style.display = 'none';
        document.getElementById('polishGame').style.display = 'none';
        document.getElementById('dryGame').style.display = 'none';

        // Start timer animation
        const timerBar = document.getElementById('soakTimerBar');
        const timerWindow = this.currentGuard.timerWindow || 3000;
        const totalTime = 5000;

        let elapsed = 0;
        this.soakTimer = setInterval(() => {
            elapsed += 50;
            const progress = (elapsed / totalTime) * 100;
            timerBar.style.width = progress + '%';

            // Green zone calculation
            const greenStart = 40; // 40% through
            const greenEnd = 60; // 60% through

            if (progress >= greenStart && progress <= greenEnd) {
                timerBar.style.background = '#0f0';
            } else {
                timerBar.style.background = '#f00';
            }

            // Auto-fail if timer completes
            if (elapsed >= totalTime) {
                clearInterval(this.soakTimer);
                this.failStep(1, "You missed the timing window completely!");
            }
        }, 50);

        // Chat line appears mid-soak
        setTimeout(() => {
            document.getElementById('guardChatBox').textContent = this.getRandomChatLine();
        }, 2000);
    }

    stopSoakTimer() {
        clearInterval(this.soakTimer);
        const timerBar = document.getElementById('soakTimerBar');
        const progress = parseInt(timerBar.style.width);

        // Check if in green zone (40-60%)
        if (progress >= 40 && progress <= 60) {
            this.passStep(1, "Perfect timing! The nails are properly soaked.");
            setTimeout(() => this.startStep2_Trim(), 1500);
        } else {
            this.failStep(1, "Wrong timing! The nails are either under-soaked or over-soaked.");
        }
    }

    // STEP 2: Trim nails - precision click game
    startStep2_Trim() {
        this.currentStep = 1;
        document.getElementById('miniGameTitle').textContent = 'STEP 2: TRIM NAILS';
        document.getElementById('miniGameInstructions').textContent =
            'Click on the white guideline to trim the nail precisely. 5 nails to trim!';

        document.getElementById('soakGame').style.display = 'none';
        document.getElementById('trimGame').style.display = 'block';

        // Initialize trim game
        this.trimNailsRemaining = 5;
        this.updateTrimDisplay();
        this.generateTrimTarget();

        // Chat
        setTimeout(() => {
            document.getElementById('guardChatBox').textContent = this.getRandomChatLine();
        }, 1000);
    }

    generateTrimTarget() {
        const canvas = document.getElementById('trimCanvas');
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw nail (gray rectangle)
        ctx.fillStyle = '#888';
        ctx.fillRect(50, 100, 300, 200);

        // Draw white guideline at random Y position
        this.trimTarget = 150 + Math.random() * 100;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(50, this.trimTarget);
        ctx.lineTo(350, this.trimTarget);
        ctx.stroke();
    }

    handleTrimClick(event) {
        const canvas = document.getElementById('trimCanvas');
        const rect = canvas.getBoundingClientRect();
        const y = event.clientY - rect.top;

        // Check if click is within 15 pixels of target
        const distance = Math.abs(y - this.trimTarget);

        if (distance <= 15) {
            this.trimNailsRemaining--;
            this.updateTrimDisplay();

            if (this.trimNailsRemaining === 0) {
                this.passStep(2, "Excellent precision! All nails trimmed perfectly.");
                setTimeout(() => this.startStep3_File(), 1500);
            } else {
                this.generateTrimTarget();
            }
        } else {
            this.failStep(2, "You cut the nail wrong! Precision is key!");
        }
    }

    updateTrimDisplay() {
        document.getElementById('nailsRemaining').textContent = this.trimNailsRemaining;
    }

    // STEP 3: File nails - rhythm/pattern matching game
    startStep3_File() {
        this.currentStep = 2;
        document.getElementById('miniGameTitle').textContent = 'STEP 3: FILE NAILS';
        document.getElementById('miniGameInstructions').textContent =
            'Match the filing pattern! Click the arrows in the correct sequence.';

        document.getElementById('trimGame').style.display = 'none';
        document.getElementById('fileGame').style.display = 'block';

        // Generate pattern based on guard difficulty
        const patternLength = this.currentGuard.patternDifficulty === 'hard' ? 6 : 4;
        const directions = ['⬅', '➡', '⬆', '⬇'];
        this.filePattern = [];

        for (let i = 0; i < patternLength; i++) {
            this.filePattern.push(directions[Math.floor(Math.random() * directions.length)]);
        }

        this.filePlayerPattern = [];
        document.getElementById('filePatternDisplay').textContent = this.filePattern.join(' ');
        document.getElementById('filePlayerInput').textContent = '';

        // Chat
        setTimeout(() => {
            document.getElementById('guardChatBox').textContent = this.getRandomChatLine();
        }, 1000);
    }

    fileInput(direction) {
        this.filePlayerPattern.push(direction);
        document.getElementById('filePlayerInput').textContent = this.filePlayerPattern.join(' ');

        // Check if pattern matches so far
        for (let i = 0; i < this.filePlayerPattern.length; i++) {
            if (this.filePlayerPattern[i] !== this.filePattern[i]) {
                this.failStep(3, "Wrong pattern! The filing is uneven.");
                return;
            }
        }

        // Check if complete
        if (this.filePlayerPattern.length === this.filePattern.length) {
            this.passStep(3, "Perfect filing technique! Smooth and even.");
            setTimeout(() => this.startStep4_Polish(), 1500);
        }
    }

    // STEP 4: Apply polish - color selection
    startStep4_Polish() {
        this.currentStep = 3;
        document.getElementById('miniGameTitle').textContent = 'STEP 4: APPLY POLISH';
        document.getElementById('miniGameInstructions').textContent =
            `Choose the polish color. ${this.currentGuard.name} prefers ${this.currentGuard.preferredColor}.`;

        document.getElementById('fileGame').style.display = 'none';
        document.getElementById('polishGame').style.display = 'block';

        // Show color options
        document.getElementById('guardPreferredColor').textContent =
            `(Hint: Prefers ${this.currentGuard.preferredColor})`;

        // Chat - guard hints at preference
        document.getElementById('guardChatBox').textContent =
            `${this.currentGuard.name}: "I hope you pick ${this.currentGuard.preferredColor}. It's my favorite."`;
    }

    selectPolishColor(color) {
        this.selectedColor = color;

        if (color === this.currentGuard.preferredColor) {
            this.passStep(4, `Perfect! ${this.currentGuard.name} loves ${color}!`);
            setTimeout(() => this.startStep5_Dry(), 1500);
        } else {
            this.failStep(4, `Wrong color! ${this.currentGuard.name} doesn't like ${color}.`);
        }
    }

    // STEP 5: Let dry - patience game
    startStep5_Dry() {
        this.currentStep = 4;
        document.getElementById('miniGameTitle').textContent = 'STEP 5: LET DRY';
        document.getElementById('miniGameInstructions').textContent =
            'DO NOT MOVE THE MOUSE for 5 seconds. Let the polish dry completely.';

        document.getElementById('polishGame').style.display = 'none';
        document.getElementById('dryGame').style.display = 'block';

        this.dryStartTime = Date.now();
        this.hasMoved = false;

        // Track mouse movement
        const dryArea = document.getElementById('dryGameArea');
        dryArea.addEventListener('mousemove', () => {
            if (!this.hasMoved && this.dryStartTime) {
                this.hasMoved = true;
                this.failStep(5, "You moved! The polish is smudged!");
            }
        });

        // Start countdown
        let countdown = 5;
        const countdownEl = document.getElementById('dryCountdown');
        countdownEl.textContent = countdown;

        const countdownTimer = setInterval(() => {
            countdown--;
            countdownEl.textContent = countdown;

            if (countdown === 0) {
                clearInterval(countdownTimer);
                if (!this.hasMoved) {
                    this.passStep(5, "Perfect patience! The polish is dry and beautiful.");
                    setTimeout(() => this.completeManicure(), 1500);
                }
            }
        }, 1000);

        // Chat - guard gets impatient
        setTimeout(() => {
            document.getElementById('guardChatBox').textContent =
                this.currentGuard.name === "Guard Chen" ?
                "Hurry up! Wait... don't move. But HURRY!" :
                "Stay still... almost there...";
        }, 2000);
    }

    passStep(step, message) {
        this.stepsCompleted[step - 1] = true;
        this.stepsPassed++;
        this.showStepResult(true, message);
        this.updateProgressBar();
    }

    failStep(step, message) {
        this.stepsCompleted[step - 1] = false;
        this.showStepResult(false, message);
        this.updateProgressBar();

        // Move to next step after failure
        setTimeout(() => {
            if (this.currentStep < 4) {
                this.advanceToNextStep();
            } else {
                this.completeManicure();
            }
        }, 2000);
    }

    advanceToNextStep() {
        switch(this.currentStep) {
            case 0: this.startStep2_Trim(); break;
            case 1: this.startStep3_File(); break;
            case 2: this.startStep4_Polish(); break;
            case 3: this.startStep5_Dry(); break;
        }
    }

    showStepResult(success, message) {
        const resultEl = document.getElementById('stepResult');
        resultEl.textContent = message;
        resultEl.style.color = success ? '#0f0' : '#f00';
        resultEl.style.display = 'block';

        setTimeout(() => {
            resultEl.style.display = 'none';
        }, 2000);
    }

    completeManicure() {
        // Calculate success (3+ steps passed = success)
        const success = this.stepsPassed >= 3;

        // Update player data
        if (!this.game.player.guardManicures) {
            this.game.player.guardManicures = {};
        }
        if (!this.game.player.favorTokens) {
            this.game.player.favorTokens = 0;
        }

        const guardKey = Object.keys(this.guards).find(
            key => this.guards[key].name === this.currentGuard.name
        );

        if (!this.game.player.guardManicures[guardKey]) {
            this.game.player.guardManicures[guardKey] = 0;
        }
        this.game.player.guardManicures[guardKey]++;

        // Show results
        document.getElementById('miniGameTitle').textContent = 'MANICURE COMPLETE';
        document.getElementById('soakGame').style.display = 'none';
        document.getElementById('trimGame').style.display = 'none';
        document.getElementById('fileGame').style.display = 'none';
        document.getElementById('polishGame').style.display = 'none';
        document.getElementById('dryGame').style.display = 'none';

        const resultDiv = document.getElementById('manicureResult');
        resultDiv.style.display = 'block';

        if (success) {
            this.game.player.favorTokens++;
            document.getElementById('guardFinalMessage').textContent = this.currentGuard.success;
            document.getElementById('manicureOutcome').innerHTML = `
                <p style="color: #0f0; font-size: 1.3em; font-weight: bold;">SUCCESS!</p>
                <p>Steps Passed: ${this.stepsPassed}/5</p>
                <p>You earned 1 FAVOR TOKEN!</p>
                <p>Total Favor Tokens: ${this.game.player.favorTokens}</p>
                <p style="margin-top: 20px; color: #ff0;">Time spent: 30 minutes</p>
            `;

            // Reduce good behavior slightly (guards remember this is weird)
            if (this.game.player.goodBehavior) {
                this.game.player.goodBehavior -= 2;
            }
        } else {
            document.getElementById('guardFinalMessage').textContent = this.currentGuard.failure;
            document.getElementById('manicureOutcome').innerHTML = `
                <p style="color: #f00; font-size: 1.3em; font-weight: bold;">FAILED</p>
                <p>Steps Passed: ${this.stepsPassed}/5 (need 3+)</p>
                <p>No favor token earned.</p>
                <p style="color: #f00; margin-top: 15px;">Good Behavior: -10</p>
                <p style="margin-top: 20px; color: #ff0;">Time spent: 30 minutes</p>
            `;

            if (!this.game.player.goodBehavior) {
                this.game.player.goodBehavior = 100;
            }
            this.game.player.goodBehavior -= 10;
        }

        // Add prison time
        this.game.player.prisonDays += 0.02; // 30 minutes = 0.02 days

        // Save game
        this.game.saveGame();
    }

    returnToPrison() {
        this.currentGuard = null;
        this.currentStep = 0;
        this.game.showScreen('prisonMenu');
    }
}
