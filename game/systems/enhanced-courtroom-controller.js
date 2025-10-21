// ==================== ENHANCED ACE ATTORNEY COURTROOM CONTROLLER ====================
// VROOM VROOM - Complete pixel art courtroom with interactive forms
// Replaces HTML courtroom with fully integrated canvas-based system
// Judge Hardcastle reactions + dramatic effects + pixel art forms

class EnhancedCourtroomController {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Courtroom canvas not found:', canvasId);
            return;
        }

        // Set canvas size (full screen)
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext('2d');

        // Pixel art rendering
        this.ctx.imageSmoothingEnabled = false;

        // Components
        this.judgeRenderer = new PixelArtRenderer(this.canvas);
        this.formSystem = null;
        this.dialogueBox = null;

        // State
        this.isActive = false;
        this.showingForms = false;
        this.patience = 0;
        this.animationLoop = null;

        // Callbacks
        this.onFormSubmit = null;
        this.onFormError = null;
        this.onPatienceChanged = null;
    }

    start(initialPatience = 0) {
        this.isActive = true;
        this.patience = initialPatience;
        this.showingForms = false;

        // Start judge renderer
        this.judgeRenderer.update(initialPatience);
        this.canvas.style.display = 'block';

        this.startAnimation();
    }

    stop() {
        this.isActive = false;
        this.canvas.style.display = 'none';

        if (this.animationLoop) {
            cancelAnimationFrame(this.animationLoop);
        }

        if (this.formSystem) {
            this.formSystem.stop();
        }
    }

    startAnimation() {
        const animate = () => {
            if (!this.isActive) return;

            this.render();
            this.animationLoop = requestAnimationFrame(animate);
        };
        animate();
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1612';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.showingForms) {
            // Render forms only (judge is in background)
            if (this.formSystem) {
                this.formSystem.render();
            }
        } else {
            // Render judge + background (opening scene)
            this.judgeRenderer.draw();
        }
    }

    showOpeningDialogue(chargesText, judgeResponse, callback) {
        // Create temporary dialogue overlay
        this.showDialogue('JUDGE HARDCASTLE', judgeResponse, () => {
            // After judge speaks, show charges
            this.showDialogue('JUDGE HARDCASTLE', `Your charges are as follows:\n\n${chargesText}\n\nNow complete these forms. ALL of them. And don't waste my time.`, () => {
                // After charges, transition to forms
                if (callback) callback();
            });
        });
    }

    showDialogue(speaker, text, callback) {
        // Create dialogue box overlay
        const dialogueContainer = document.createElement('div');
        dialogueContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 700px;
            max-width: 90%;
            background: rgba(0, 0, 0, 0.95);
            border: 3px solid #0f0;
            padding: 20px;
            z-index: 100;
            font-family: 'Courier New', monospace;
        `;

        dialogueContainer.innerHTML = `
            <div style="color: #ff0; font-size: 1.2em; margin-bottom: 10px; font-weight: bold;">${speaker}</div>
            <div id="dialogueText" style="color: #0f0; font-size: 1.1em; min-height: 60px; line-height: 1.6;"></div>
            <div style="color: #888; font-size: 0.9em; margin-top: 10px; text-align: right;">▼ Click to continue</div>
        `;

        document.body.appendChild(dialogueContainer);

        // Typewriter effect
        const textElement = document.getElementById('dialogueText');
        let charIndex = 0;
        const typewriterSpeed = 30;

        const typewriter = setInterval(() => {
            if (charIndex < text.length) {
                textElement.textContent += text[charIndex];
                charIndex++;
            } else {
                clearInterval(typewriter);
            }
        }, typewriterSpeed);

        // Click to continue
        dialogueContainer.onclick = () => {
            if (charIndex < text.length) {
                // Skip to end
                clearInterval(typewriter);
                textElement.textContent = text;
                charIndex = text.length;
            } else {
                // Continue
                dialogueContainer.remove();
                if (callback) callback();
            }
        };

        this.currentDialogue = dialogueContainer;
    }

    hideDialogue() {
        if (this.currentDialogue) {
            this.currentDialogue.remove();
            this.currentDialogue = null;
        }
    }

    showForms() {
        this.showingForms = true;

        // Initialize form system
        this.formSystem = new InteractiveCourtForms(this.canvas, PAPERWORK_PALETTE);

        // Set up form callbacks
        this.formSystem.onFieldChange = (field) => {
            this.handleFieldChange(field);
        };

        this.formSystem.onSubmit = (formData) => {
            this.handleFormSubmit(formData);
        };

        this.formSystem.onValidationError = (errors) => {
            this.handleValidationError(errors);
        };

        this.formSystem.start();
    }

    hideForms() {
        this.showingForms = false;

        if (this.formSystem) {
            this.formSystem.stop();
            this.formSystem = null;
        }
    }

    handleFieldChange(field) {
        // Trigger judge commentary based on field
        const judgeComments = {
            'FORM 27-B: Reason for Driving': [
                "That's the worst excuse I've heard all day. And I've heard many.",
                "Oh, THAT'S your reason? Fascinating. Also, irrelevant.",
                "I'm sure that made sense in your head. It doesn't make sense here.",
                "Did you seriously just write that? On an official court document?"
            ],
            'FORM 42-A: Description of Vehicle': [
                "A car is a car. Your description changes nothing.",
                "Four wheels. An engine. Illegal. Moving on.",
                "I don't care if it was purple with racing stripes. You were DRIVING.",
                "You described it in great detail. Still illegal."
            ],
            'FORM 99-Z: Statement of Intent': {
                'grocery': "Groceries. You risked EVERYTHING for groceries. Brilliant.",
                'work': "There's no job worth the penalty of operating a vehicle. None.",
                'joy': "JOY? You experienced JOY while DRIVING? That's an additional charge.",
                'exist': "Simply existing... in a MOVING VEHICLE. On MY roads."
            }
        };

        // Increase patience slightly for each field filled
        this.patience = Math.min(100, this.patience + 5);
        this.judgeRenderer.update(this.patience);

        // Show random comment for this field
        let comment = null;
        if (field.label in judgeComments) {
            if (field.type === 'select' && field.value) {
                comment = judgeComments[field.label][field.value];
            } else if (Array.isArray(judgeComments[field.label])) {
                comment = judgeComments[field.label][Math.floor(Math.random() * judgeComments[field.label].length)];
            }
        }

        if (comment) {
            this.showTemporaryMessage(comment);

            // Trigger judge reaction animation
            if (this.patience >= 50) {
                this.triggerGavelStrike();
            }
        }
    }

    handleValidationError(errors) {
        // Judge gets VERY annoyed at incomplete paperwork
        this.patience = Math.min(100, this.patience + 30);
        this.judgeRenderer.update(this.patience);

        const incompleteComments = [
            "Form 27-B is blank. Were you DRIVING while you should have been WRITING?",
            "You initialed 13-C but not 13-D. Do you know what that means? Neither do I. Six more months.",
            "INCOMPLETE PAPERWORK? Do you think this is a JOKE?",
            "You can't even fill out BASIC FORMS? Unbelievable.",
            "I have 47 other cases today. Fill. Out. The. Forms.",
            "Incompetence is not a defense. Complete the paperwork. NOW.",
            "There are THREE initial fields. You filled TWO. That's 67% compliance. We require 100%.",
            "Every blank field on these forms is a personal insult to me and the justice system."
        ];

        const comment = incompleteComments[Math.floor(Math.random() * incompleteComments.length)];

        // Show OBJECTION effect
        this.triggerObjection(comment);

        // Gavel strike for emphasis
        this.triggerGavelStrike();

        // Notify callback
        if (this.onFormError) {
            this.onFormError(errors);
        }
    }

    handleFormSubmit(formData) {
        // Forms are complete! Judge delivers sentence
        this.hideForms();

        // Show judge dramatically
        this.showingForms = false;

        // Set patience to maximum dramatic
        this.patience = 100;
        this.judgeRenderer.update(100);

        // Callback to game for final sentencing
        if (this.onFormSubmit) {
            this.onFormSubmit(formData);
        }
    }

    triggerObjection(message) {
        // Create OBJECTION! overlay
        const objection = document.createElement('div');
        objection.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            height: 200px;
            background: #f00;
            border: 5px solid #000;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 200;
            animation: objectionPulse 0.5s;
        `;

        objection.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3em; font-weight: bold; color: #fff; text-shadow: 3px 3px #000;">OBJECTION!</div>
                <div style="font-size: 1.2em; color: #fff; margin-top: 20px;">${message}</div>
            </div>
        `;

        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes objectionPulse {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(objection);

        // Remove after 2 seconds
        setTimeout(() => {
            objection.remove();
            style.remove();
        }, 2000);

        // Play sound effect
        if (window.game && window.game.soundSystem) {
            window.game.soundSystem.playGavelStrike();
        }
    }

    triggerGavelStrike() {
        this.judgeRenderer.triggerGavelStrike();
    }

    triggerVerdict(sentenceText, callback) {
        // Set judge to maximum anger/drama
        this.patience = 100;
        this.judgeRenderer.update(100);

        // Show verdict dialogue
        this.showDialogue('JUDGE HARDCASTLE', sentenceText, () => {
            // Trigger massive gavel strike
            this.triggerGavelStrike();

            // Screen shake + flash
            this.triggerScreenShake();

            // Wait for effect, then callback
            setTimeout(() => {
                if (callback) callback();
            }, 1500);
        });
    }

    triggerScreenShake() {
        const duration = 1000;
        const intensity = 20;
        const startTime = Date.now();

        const shake = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed > duration) {
                this.canvas.style.transform = 'translate(0, 0)';
                return;
            }

            const progress = elapsed / duration;
            const currentIntensity = intensity * (1 - progress);

            const offsetX = (Math.random() - 0.5) * currentIntensity;
            const offsetY = (Math.random() - 0.5) * currentIntensity;

            this.canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

            requestAnimationFrame(shake);
        };

        shake();
    }

    showTemporaryMessage(message) {
        // Show message in dialogue style
        const msg = document.createElement('div');
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 0, 0, 0.95);
            color: #fff;
            padding: 15px 30px;
            border: 2px solid #000;
            font-family: 'Courier New', monospace;
            font-size: 1.1em;
            z-index: 150;
            animation: fadeInOut 3s;
        `;

        msg.textContent = message;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(msg);

        setTimeout(() => {
            msg.remove();
            style.remove();
        }, 3000);
    }

    updatePatience(patience) {
        this.patience = patience;
        this.judgeRenderer.update(patience);

        if (this.onPatienceChanged) {
            this.onPatienceChanged(patience);
        }
    }

    getPatience() {
        return this.patience;
    }
}

// ==================== EXPORT ====================

// Replace existing AceAttorneyCourtroom with enhanced version
if (typeof window !== 'undefined') {
    if (window.AceAttorneyCourtroom) {
        window.AceAttorneyCourtroom_Legacy = window.AceAttorneyCourtroom;
    }
    window.EnhancedCourtroomController = EnhancedCourtroomController;

    // Create compatibility wrapper
    window.AceAttorneyCourtroom = EnhancedCourtroomController;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EnhancedCourtroomController
    };
}
