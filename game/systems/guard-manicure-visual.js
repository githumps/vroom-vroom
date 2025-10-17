/**
 * VISUAL GUARD MANICURE MINI-GAME
 * Top-down view of guard's hands with interactive nail cleaning
 * Clean all 10 nails without poking the guard's skin
 * Injured guards go to clinic where you can exploit them on pain meds
 */

class VisualManicureSystem {
    constructor(game) {
        this.game = game;

        // Guard database (same personalities as before)
        this.guards = {
            jenkins: {
                name: "Guard Jenkins",
                skin: "#f4c8a8",
                nailColor: "#e8d4c0",
                nervousness: 0.7, // Higher = easier to hurt
                greeting: "Make it quick. I have a shift in 30 minutes.",
                success: "Hmph. Acceptable. You actually didn't mess up.",
                failure: "Too many mistakes! I'm done with this.",
                injury: "OW! You stabbed me! That's IT, I'm going to the medical bay!",
                personality: "strict"
            },
            martinez: {
                name: "Guard Martinez",
                skin: "#d4a574",
                nailColor: "#c99766",
                nervousness: 0.3, // Calm, hard to hurt
                greeting: "Ah, a manicure. Let's make this beautiful, shall we?",
                success: "Magnifico! Perfect work. You have talent.",
                failure: "These are all wrong. Did you even try?",
                injury: "AY! Mi dedo! You hurt me! I need medical attention!",
                personality: "perfectionist"
            },
            chen: {
                name: "Guard Chen",
                skin: "#f0d5be",
                nailColor: "#e8d0ba",
                nervousness: 0.9, // Very jumpy
                greeting: "Yeah yeah, let's get this over with. Quick.",
                success: "Finally. Took you long enough. They look good though.",
                failure: "This is taking FOREVER. Forget it. I'm out.",
                injury: "AH! YOU POKED ME! That's it, I'm going to see the nurse!",
                personality: "impatient"
            },
            thompson: {
                name: "Guard Thompson",
                skin: "#ffd7ba",
                nailColor: "#f5d8c4",
                nervousness: 0.5, // Average
                greeting: "Oh wonderful! I love manicures. Let me tell you about my day...",
                success: "These look AMAZING! You know, my sister does nails and...",
                failure: "Oh no, these didn't turn out right. It's okay though!",
                injury: "Ouch! That really hurt! I should probably get this checked out...",
                personality: "chatty"
            },
            rodriguez: {
                name: "Guard Rodriguez",
                skin: "#c88a5a",
                nailColor: "#b87d52",
                nervousness: 0.6,
                greeting: "A manicure, huh? What's your angle here? Don't try anything.",
                success: "Hm. These actually look... decent. You're not planning anything, are you?",
                failure: "I KNEW IT. You're trying to sabotage me. This is a setup!",
                injury: "I KNEW you'd try something! You stabbed me on purpose! Medical bay, NOW!",
                personality: "paranoid"
            }
        };

        // Game state
        this.currentGuard = null;
        this.canvas = null;
        this.ctx = null;
        this.hands = {
            left: { x: 100, y: 200, nails: [] },
            right: { x: 500, y: 200, nails: [] }
        };
        this.totalNails = 10;
        this.cleanedNails = 0;
        this.mistakes = 0;
        this.maxMistakes = 3;
        this.guardInjured = false;
        this.isAnimating = false;
        this.wincePulse = 0;
    }

    // Start a manicure session
    startManicure() {
        // Select random guard
        const guardKeys = Object.keys(this.guards);
        const randomKey = guardKeys[Math.floor(Math.random() * guardKeys.length)];
        this.currentGuard = this.guards[randomKey];

        // Reset state
        this.cleanedNails = 0;
        this.mistakes = 0;
        this.guardInjured = false;
        this.isAnimating = false;
        this.wincePulse = 0;

        // Show manicure screen
        this.game.showScreen('visualManicure');

        // Initialize canvas
        this.canvas = document.getElementById('manicureCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size - responsive for mobile
        const isMobile = window.innerWidth <= 768;
        const maxWidth = isMobile ? Math.min(window.innerWidth - 30, 400) : 800;
        this.canvas.width = maxWidth;
        this.canvas.height = maxWidth * 0.75; // Maintain 4:3 aspect ratio

        // Store scale factor for coordinate scaling
        this.scale = this.canvas.width / 800;

        // Generate hand positions with nails
        this.generateHands();

        // Show guard info
        document.getElementById('visualGuardName').textContent = this.currentGuard.name;
        document.getElementById('visualGuardGreeting').textContent = this.currentGuard.greeting;
        this.updateStats();

        // Add click listener
        this.canvas.onclick = (e) => this.handleClick(e);

        // Start rendering
        this.render();
    }

    // Generate hand and nail positions
    generateHands() {
        const s = this.scale; // Shorthand for scale factor

        // Left hand - 5 fingers (scaled for responsive canvas)
        this.hands.left.nails = [
            { x: 120 * s, y: 350 * s, size: 35 * s, angle: -15, cleaned: false, dirtSpots: this.generateDirtSpots(3) }, // Thumb
            { x: 150 * s, y: 270 * s, size: 40 * s, angle: -5, cleaned: false, dirtSpots: this.generateDirtSpots(3) },  // Index
            { x: 180 * s, y: 240 * s, size: 42 * s, angle: 0, cleaned: false, dirtSpots: this.generateDirtSpots(3) },   // Middle
            { x: 210 * s, y: 250 * s, size: 38 * s, angle: 5, cleaned: false, dirtSpots: this.generateDirtSpots(3) },   // Ring
            { x: 235 * s, y: 280 * s, size: 32 * s, angle: 10, cleaned: false, dirtSpots: this.generateDirtSpots(3) }   // Pinky
        ];

        // Right hand - 5 fingers (mirrored, scaled for responsive canvas)
        this.hands.right.nails = [
            { x: 680 * s, y: 350 * s, size: 35 * s, angle: 15, cleaned: false, dirtSpots: this.generateDirtSpots(3) },  // Thumb
            { x: 650 * s, y: 270 * s, size: 40 * s, angle: 5, cleaned: false, dirtSpots: this.generateDirtSpots(3) },   // Index
            { x: 620 * s, y: 240 * s, size: 42 * s, angle: 0, cleaned: false, dirtSpots: this.generateDirtSpots(3) },   // Middle
            { x: 590 * s, y: 250 * s, size: 38 * s, angle: -5, cleaned: false, dirtSpots: this.generateDirtSpots(3) },  // Ring
            { x: 565 * s, y: 280 * s, size: 32 * s, angle: -10, cleaned: false, dirtSpots: this.generateDirtSpots(3) }  // Pinky
        ];
    }

    // Generate random dirt spots on a nail
    generateDirtSpots(count) {
        const spots = [];
        for (let i = 0; i < count; i++) {
            spots.push({
                x: (Math.random() - 0.5) * 0.6, // Relative position -0.3 to 0.3
                y: (Math.random() - 0.5) * 0.6,
                size: 4 + Math.random() * 4,
                cleaned: false
            });
        }
        return spots;
    }

    // Render the hands and nails
    render() {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply wince effect if active
        if (this.wincePulse > 0) {
            this.ctx.save();
            this.ctx.translate(Math.sin(this.wincePulse * 20) * 5, 0);
            this.wincePulse -= 0.05;
        }

        // Draw title (scaled for responsive canvas)
        this.ctx.fillStyle = '#fff';
        this.ctx.font = `bold ${Math.floor(24 * this.scale)}px monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GUARD MANICURE - CLEAN ALL NAILS', this.canvas.width / 2, 40 * this.scale);

        // Draw instructions (scaled for responsive canvas)
        this.ctx.font = `${Math.floor(14 * this.scale)}px monospace`;
        this.ctx.fillStyle = '#ff0';
        const instructionText = this.scale < 0.6 ? 'Click dirt spots. Don\'t hit skin!' : 'Click on DIRTY SPOTS to clean nails. Don\'t click on skin or you\'ll hurt the guard!';
        this.ctx.fillText(instructionText, this.canvas.width / 2, 70 * this.scale);

        // Draw both hands
        this.drawHand('left');
        this.drawHand('right');

        // Restore after wince
        if (this.wincePulse > 0) {
            this.ctx.restore();
        }

        // Continue animation
        if (!this.guardInjured) {
            requestAnimationFrame(() => this.render());
        }
    }

    // Draw a single hand
    drawHand(side) {
        const hand = this.hands[side];
        const isLeft = side === 'left';

        // Draw palm (simplified shape)
        this.ctx.fillStyle = this.currentGuard.skin;
        this.ctx.beginPath();

        const s = this.scale; // Shorthand for scale factor

        if (isLeft) {
            // Left palm (scaled for responsive canvas)
            this.ctx.ellipse(180 * s, 360 * s, 60 * s, 80 * s, 0, 0, Math.PI * 2);
        } else {
            // Right palm (scaled for responsive canvas)
            this.ctx.ellipse(620 * s, 360 * s, 60 * s, 80 * s, 0, 0, Math.PI * 2);
        }
        this.ctx.fill();

        // Draw fingers
        hand.nails.forEach((nail, index) => {
            this.drawFinger(nail, isLeft);
        });
    }

    // Draw a single finger with nail
    drawFinger(nail, isLeft) {
        this.ctx.save();
        this.ctx.translate(nail.x, nail.y);
        this.ctx.rotate((nail.angle * Math.PI) / 180);

        // Finger (elongated shape)
        this.ctx.fillStyle = this.currentGuard.skin;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 20, nail.size * 0.4, nail.size * 1.2, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Nail base
        this.ctx.fillStyle = nail.cleaned ? '#ffe4e1' : this.currentGuard.nailColor;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, nail.size * 0.5, nail.size * 0.7, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#8B7355';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        // Draw dirt spots (if nail not cleaned)
        if (!nail.cleaned) {
            nail.dirtSpots.forEach(spot => {
                if (!spot.cleaned) {
                    this.ctx.fillStyle = 'rgba(80, 60, 40, 0.7)';
                    this.ctx.beginPath();
                    this.ctx.arc(
                        spot.x * nail.size,
                        spot.y * nail.size,
                        spot.size,
                        0,
                        Math.PI * 2
                    );
                    this.ctx.fill();
                }
            });
        }

        // Draw sparkle if cleaned
        if (nail.cleaned) {
            const time = Date.now() / 200;
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.beginPath();
            this.ctx.arc(
                Math.cos(time) * nail.size * 0.2,
                Math.sin(time) * nail.size * 0.3,
                3,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    // Handle canvas click
    handleClick(event) {
        if (this.guardInjured || this.isAnimating) return;

        const rect = this.canvas.getBoundingClientRect();
        // Account for canvas display size vs internal size
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        const clickX = (event.clientX - rect.left) * scaleX;
        const clickY = (event.clientY - rect.top) * scaleY;

        let hitSomething = false;

        // Check all nails in both hands
        ['left', 'right'].forEach(side => {
            this.hands[side].nails.forEach((nail, index) => {
                if (nail.cleaned) return; // Skip already cleaned nails

                // Transform click to nail space
                const dx = clickX - nail.x;
                const dy = clickY - nail.y;
                const angle = -(nail.angle * Math.PI) / 180;
                const rotX = dx * Math.cos(angle) - dy * Math.sin(angle);
                const rotY = dx * Math.sin(angle) + dy * Math.cos(angle);

                // Check if clicking on nail area
                const nailDist = Math.sqrt(
                    (rotX / (nail.size * 0.5)) ** 2 + (rotY / (nail.size * 0.7)) ** 2
                );

                if (nailDist <= 1.0) {
                    // Clicked on nail area
                    hitSomething = true;

                    // Check if clicked on a dirt spot
                    let hitDirt = false;
                    nail.dirtSpots.forEach(spot => {
                        if (spot.cleaned) return;

                        const spotX = spot.x * nail.size;
                        const spotY = spot.y * nail.size;
                        const dist = Math.sqrt((rotX - spotX) ** 2 + (rotY - spotY) ** 2);

                        if (dist <= spot.size + 5) {
                            // Hit a dirt spot!
                            spot.cleaned = true;
                            hitDirt = true;
                            this.game.soundSystem.playSound('click', 'high');
                        }
                    });

                    // Check if all dirt spots on this nail are cleaned
                    const allCleaned = nail.dirtSpots.every(s => s.cleaned);
                    if (allCleaned && !nail.cleaned) {
                        nail.cleaned = true;
                        this.cleanedNails++;
                        this.updateStats();
                        this.game.soundSystem.playSound('success', 'high');

                        // Check if all nails cleaned
                        if (this.cleanedNails >= this.totalNails) {
                            setTimeout(() => this.completeManicure(true), 500);
                        }
                    }

                    // If clicked on nail but not on dirt, chance to hurt guard
                    if (!hitDirt) {
                        const hurtChance = this.currentGuard.nervousness;
                        if (Math.random() < hurtChance) {
                            this.hurtGuard();
                        }
                    }
                }
            });
        });

        if (!hitSomething) {
            // Clicked on skin!
            this.hurtGuard();
        }
    }

    // Guard gets hurt
    hurtGuard() {
        this.mistakes++;
        this.wincePulse = 1.0;
        this.game.soundSystem.playSound('error', 'low');

        // Show wince message
        document.getElementById('visualGuardGreeting').textContent =
            `${this.currentGuard.name}: "OW! Be careful!"`;

        setTimeout(() => {
            if (!this.guardInjured) {
                document.getElementById('visualGuardGreeting').textContent =
                    `${this.currentGuard.name}: "...please continue, but MORE carefully!"`;
            }
        }, 1500);

        this.updateStats();

        // Check if too many mistakes
        if (this.mistakes >= this.maxMistakes) {
            this.guardInjured = true;
            this.sendGuardToClinic();
        }
    }

    // Update stats display
    updateStats() {
        document.getElementById('nailsCleaned').textContent = this.cleanedNails;
        document.getElementById('totalNails').textContent = this.totalNails;
        document.getElementById('mistakeCount').textContent = this.mistakes;
        document.getElementById('maxMistakes').textContent = this.maxMistakes;
    }

    // Send injured guard to clinic
    sendGuardToClinic() {
        this.isAnimating = true;

        // Show injury message
        document.getElementById('visualGuardGreeting').textContent = this.currentGuard.injury;

        setTimeout(() => {
            this.game.showScreen('clinicExploit');
            document.getElementById('injuredGuardName').textContent = this.currentGuard.name;
            this.setupClinicExploit();
        }, 2500);
    }

    // Setup clinic exploitation minigame
    setupClinicExploit() {
        const exploitOptions = [
            {
                id: 'keys',
                name: 'Steal Guard\'s Keys',
                risk: 0.7,
                reward: 'Master key (opens any door)',
                success: 'You slip the keys from their belt while they\'re dazed on morphine.',
                failure: 'The guard notices! They\'re not THAT drugged up!'
            },
            {
                id: 'favor',
                name: 'Get Future Favor',
                risk: 0.3,
                reward: '+2 Favor Tokens',
                success: 'The guard mumbles "I owe you one..." and passes out.',
                failure: 'The guard is too out of it to understand what you\'re asking.'
            },
            {
                id: 'intel',
                name: 'Extract Intel',
                risk: 0.5,
                reward: 'Security schedule (escape +20%)',
                success: 'The guard rambles about shift changes and weak points in security.',
                failure: 'The guard just keeps asking for more pain meds.'
            },
            {
                id: 'nothing',
                name: 'Leave Them Alone',
                risk: 0,
                reward: '+10 Good Behavior',
                success: 'You show mercy. The guard will remember this... maybe.',
                failure: ''
            }
        ];

        const container = document.getElementById('exploitOptions');
        container.innerHTML = '';

        exploitOptions.forEach(option => {
            const button = document.createElement('button');
            button.className = 'exploit-button';
            button.innerHTML = `
                <strong>${option.name}</strong><br>
                <span style="color: #ff0;">Risk: ${Math.floor(option.risk * 100)}%</span><br>
                <span style="color: #0f0;">${option.reward}</span>
            `;
            button.onclick = () => this.attemptExploit(option);
            container.appendChild(button);
        });
    }

    // Attempt to exploit injured guard
    attemptExploit(option) {
        const success = Math.random() > option.risk;
        const resultDiv = document.getElementById('exploitResult');

        if (success || option.id === 'nothing') {
            resultDiv.innerHTML = `<p style="color: #0f0;">${option.success}</p>`;

            // Apply rewards
            switch(option.id) {
                case 'keys':
                    if (!this.game.player.inventory) this.game.player.inventory = {};
                    this.game.player.inventory.masterKey = 1;
                    break;
                case 'favor':
                    this.game.player.favorTokens = (this.game.player.favorTokens || 0) + 2;
                    break;
                case 'intel':
                    if (this.game.player.escapeProgress) {
                        Object.keys(this.game.player.escapeProgress).forEach(route => {
                            this.game.player.escapeProgress[route].progress += 20;
                        });
                    }
                    break;
                case 'nothing':
                    this.game.player.goodBehavior = (this.game.player.goodBehavior || 100) + 10;
                    break;
            }

            // Manicure failed but you got something from exploitation
            setTimeout(() => {
                this.completeManicure(false, true); // false = failed, true = exploited
            }, 3000);

        } else {
            resultDiv.innerHTML = `<p style="color: #f00;">${option.failure}</p>`;

            // Lose good behavior
            this.game.player.goodBehavior = (this.game.player.goodBehavior || 100) - 15;

            setTimeout(() => {
                this.completeManicure(false, false); // Failed and caught
            }, 3000);
        }
    }

    // Complete the manicure session
    completeManicure(success, exploited = false) {
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

        // Calculate outcome
        if (success) {
            // Perfect manicure!
            this.game.player.favorTokens++;
            this.game.showMessage(`SUCCESS! ${this.currentGuard.success} +1 Favor Token!`, 4000);

            // Small good behavior decrease (guards think this is weird)
            this.game.player.goodBehavior = (this.game.player.goodBehavior || 100) - 2;
        } else if (exploited) {
            // Failed manicure but exploited injured guard
            this.game.showMessage(`Manicure failed, but you exploited the situation...`, 4000);
            this.game.player.goodBehavior = (this.game.player.goodBehavior || 100) - 20;
        } else {
            // Total failure
            this.game.showMessage(`${this.currentGuard.failure} -10 Good Behavior`, 4000);
            this.game.player.goodBehavior = (this.game.player.goodBehavior || 100) - 10;
        }

        // Add time
        this.game.player.prisonDays += 0.02; // 30 minutes

        // Save and return to prison
        this.game.saveGame();
        setTimeout(() => {
            this.game.showScreen('prisonMenu');
        }, 4000);
    }

    // Return to prison menu
    returnToPrison() {
        this.game.showScreen('prisonMenu');
    }
}
