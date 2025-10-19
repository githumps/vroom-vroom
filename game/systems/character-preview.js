// CHARACTER PREVIEW SYSTEM - BG3/Cyberpunk-style character renderer
// Canvas-based procedural character sprite rendering

class CharacterPreviewRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas not found:', canvasId);
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Default character properties
        this.character = {
            faceShape: 'oval',
            skinTone: 2, // 0-5 scale
            hairStyle: 'short',
            hairColor: '#3d2f1f',
            eyeColor: '#4a5a6b',
            facialFeature: 'clean-shaven',
            scar: 'none',
            bodyType: 'average'
        };

        // Skin tone palette (from light to dark)
        this.skinTones = [
            '#f5dcc4', // Very light
            '#e8c4a3', // Light
            '#d4a88e', // Medium-light
            '#b8876b', // Medium
            '#8b6f47', // Medium-dark
            '#6b5639'  // Dark
        ];

        this.animationFrame = 0;
        this.breathing = 0;
        this.blinking = false;
        this.animationLoop = null;

        this.startAnimation();
    }

    updateCharacter(properties) {
        Object.assign(this.character, properties);
        this.draw();
    }

    startAnimation() {
        const animate = () => {
            this.animationFrame++;
            this.breathing = Math.sin(this.animationFrame * 0.03) * 3;

            // Random blinking
            if (Math.random() < 0.005) {
                this.blinking = true;
                setTimeout(() => this.blinking = false, 150);
            }

            this.draw();
            this.animationLoop = requestAnimationFrame(animate);
        };
        animate();
    }

    draw() {
        // Clear canvas with dark background
        this.ctx.fillStyle = '#1a1612';
        this.ctx.fillRect(0, 0, this.width, this.height);

        const centerX = this.width / 2;
        const baseY = this.height * 0.4 + this.breathing;

        // Draw character from bottom to top
        this.drawBody(centerX, baseY);
        this.drawHead(centerX, baseY);
        this.drawHair(centerX, baseY);
        this.drawFacialFeatures(centerX, baseY);
        this.drawScar(centerX, baseY);

        // Vignette effect
        this.drawVignette();
    }

    drawBody(x, y) {
        const skinColor = this.skinTones[this.character.skinTone];

        // Neck
        this.ctx.fillStyle = skinColor;
        this.ctx.fillRect(x - 20, y + 70, 40, 60);

        // Shoulders (based on body type)
        let shoulderWidth = 120;
        if (this.character.bodyType === 'thin') shoulderWidth = 100;
        if (this.character.bodyType === 'muscular') shoulderWidth = 140;
        if (this.character.bodyType === 'heavy') shoulderWidth = 150;

        // Generic prison jumpsuit
        this.ctx.fillStyle = '#ff6600'; // Orange jumpsuit
        this.ctx.fillRect(x - shoulderWidth/2, y + 120, shoulderWidth, 180);

        // Collar
        this.ctx.fillStyle = '#cc5500';
        this.ctx.fillRect(x - 40, y + 120, 80, 15);
    }

    drawHead(x, y) {
        const skinColor = this.skinTones[this.character.skinTone];
        const headSize = 80;

        this.ctx.fillStyle = skinColor;

        // Draw head based on face shape
        this.ctx.beginPath();
        switch (this.character.faceShape) {
            case 'angular':
                // Angular/sharp features
                this.ctx.moveTo(x, y - headSize);
                this.ctx.lineTo(x + headSize * 0.6, y - headSize * 0.3);
                this.ctx.lineTo(x + headSize * 0.5, y + headSize * 0.4);
                this.ctx.lineTo(x, y + headSize * 0.7);
                this.ctx.lineTo(x - headSize * 0.5, y + headSize * 0.4);
                this.ctx.lineTo(x - headSize * 0.6, y - headSize * 0.3);
                this.ctx.closePath();
                break;

            case 'round':
                // Round face
                this.ctx.arc(x, y, headSize, 0, Math.PI * 2);
                break;

            case 'square':
                // Square/blocky
                this.ctx.rect(x - headSize * 0.7, y - headSize, headSize * 1.4, headSize * 1.8);
                break;

            case 'oval':
            default:
                // Oval (default)
                this.ctx.ellipse(x, y, headSize * 0.7, headSize, 0, 0, Math.PI * 2);
                break;
        }
        this.ctx.fill();

        // Draw eyes
        this.drawEyes(x, y);

        // Draw nose (simple line)
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - 10);
        this.ctx.lineTo(x - 5, y + 10);
        this.ctx.stroke();

        // Draw mouth
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x - 20, y + 30);
        this.ctx.quadraticCurveTo(x, y + 35, x + 20, y + 30);
        this.ctx.stroke();
    }

    drawEyes(x, y) {
        const eyeY = y - 15;
        const eyeSpacing = 25;
        const eyeSize = this.blinking ? 2 : 10;

        // Eye whites
        if (!this.blinking) {
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.ellipse(x - eyeSpacing, eyeY, 12, 8, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.ellipse(x + eyeSpacing, eyeY, 12, 8, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Irises
        this.ctx.fillStyle = this.character.eyeColor;
        this.ctx.beginPath();
        this.ctx.ellipse(x - eyeSpacing, eyeY, 8, eyeSize, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(x + eyeSpacing, eyeY, 8, eyeSize, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Pupils
        if (!this.blinking) {
            this.ctx.fillStyle = '#000';
            this.ctx.beginPath();
            this.ctx.arc(x - eyeSpacing, eyeY, 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(x + eyeSpacing, eyeY, 4, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawHair(x, y) {
        this.ctx.fillStyle = this.character.hairColor;

        switch (this.character.hairStyle) {
            case 'bald':
                // No hair
                break;

            case 'buzzcut':
                // Very short hair
                this.ctx.beginPath();
                this.ctx.ellipse(x, y - 80, 60, 20, 0, Math.PI, 0, true);
                this.ctx.fill();
                break;

            case 'short':
                // Short hair
                this.ctx.beginPath();
                this.ctx.ellipse(x, y - 75, 70, 40, 0, Math.PI, 0, true);
                this.ctx.fill();
                break;

            case 'medium':
                // Medium length hair
                this.ctx.beginPath();
                this.ctx.ellipse(x, y - 70, 75, 60, 0, Math.PI, 0, true);
                this.ctx.fill();
                // Side hair
                this.ctx.fillRect(x - 75, y - 40, 15, 80);
                this.ctx.fillRect(x + 60, y - 40, 15, 80);
                break;

            case 'long':
                // Long hair
                this.ctx.beginPath();
                this.ctx.ellipse(x, y - 70, 80, 70, 0, Math.PI, 0, true);
                this.ctx.fill();
                // Long side hair
                this.ctx.fillRect(x - 80, y - 40, 20, 140);
                this.ctx.fillRect(x + 60, y - 40, 20, 140);
                break;
        }
    }

    drawFacialFeatures(x, y) {
        const skinColor = this.skinTones[this.character.skinTone];
        const facialHairColor = this.character.hairColor;

        switch (this.character.facialFeature) {
            case 'stubble':
                // Light stubble (dots pattern)
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                for (let i = 0; i < 50; i++) {
                    const px = x - 40 + Math.random() * 80;
                    const py = y + 20 + Math.random() * 40;
                    this.ctx.fillRect(px, py, 1, 1);
                }
                break;

            case 'goatee':
                // Goatee
                this.ctx.fillStyle = facialHairColor;
                this.ctx.beginPath();
                this.ctx.ellipse(x, y + 45, 15, 20, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillRect(x - 8, y + 60, 16, 15);
                break;

            case 'full-beard':
                // Full beard
                this.ctx.fillStyle = facialHairColor;
                this.ctx.beginPath();
                this.ctx.ellipse(x, y + 40, 50, 35, 0, 0, Math.PI);
                this.ctx.fill();
                break;

            case 'makeup':
                // Simple eye makeup
                this.ctx.strokeStyle = '#8b4a8b';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(x - 40, y - 20);
                this.ctx.lineTo(x - 15, y - 18);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(x + 15, y - 18);
                this.ctx.lineTo(x + 40, y - 20);
                this.ctx.stroke();
                break;

            case 'clean-shaven':
            default:
                // No facial features
                break;
        }
    }

    drawScar(x, y) {
        if (this.character.scar === 'none') return;

        this.ctx.strokeStyle = 'rgba(139, 69, 69, 0.6)';
        this.ctx.lineWidth = 2;

        switch (this.character.scar) {
            case 'eye-scar':
                // Scar across left eye
                this.ctx.beginPath();
                this.ctx.moveTo(x - 35, y - 35);
                this.ctx.lineTo(x - 15, y + 5);
                this.ctx.stroke();
                break;

            case 'cheek-scar':
                // Scar on right cheek
                this.ctx.beginPath();
                this.ctx.moveTo(x + 30, y + 10);
                this.ctx.lineTo(x + 45, y + 25);
                this.ctx.stroke();
                break;

            case 'forehead-scar':
                // Horizontal scar on forehead
                this.ctx.beginPath();
                this.ctx.moveTo(x - 25, y - 50);
                this.ctx.lineTo(x + 25, y - 48);
                this.ctx.stroke();
                break;
        }
    }

    drawVignette() {
        const gradient = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, this.width * 0.6
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    destroy() {
        if (this.animationLoop) {
            cancelAnimationFrame(this.animationLoop);
            this.animationLoop = null;
        }
    }
}

// Character origin/background data
class CharacterOrigins {
    static getOrigins() {
        return {
            'taxi-driver': {
                name: 'Former Taxi Driver',
                desc: 'You know the streets. You know the shortcuts. You know which cops are lazy.',
                stats: { intelligence: +5, money: +20 },
                perk: 'Street Knowledge: -10% arrest chance during driving'
            },
            'street-racer': {
                name: 'Underground Racer',
                desc: 'Speed is life. Rules are suggestions. Prison is inevitable.',
                stats: { strength: +3, goodBehavior: -10 },
                perk: 'Hot Start: +20% acceleration, +5% wanted level'
            },
            'delivery-driver': {
                name: 'Corporate Delivery Driver',
                desc: 'You followed every rule. They fired you anyway. Time for payback.',
                stats: { intelligence: +3, goodBehavior: +10 },
                perk: 'Timely Escape: +15% escape planning efficiency'
            },
            'bureaucrat': {
                name: 'Failed Bureaucrat',
                desc: 'You filed forms. So many forms. Now you file paperwork in court. Circle of life.',
                stats: { intelligence: +7, patience: +5 },
                perk: 'Form Expert: -20% courtroom form errors'
            },
            'rebel': {
                name: 'Born Rebel',
                desc: 'You never fit in. Never wanted to. Driving was illegal, so you drove.',
                stats: { strength: +5, goodBehavior: -5 },
                perk: 'Defiant: +10% prison activity success, +10% guard suspicion'
            }
        };
    }
}

// Character archetype data
class CharacterArchetypes {
    static getArchetypes() {
        return {
            'cautious': {
                name: 'The Cautious One',
                desc: 'You think before you act. Sometimes too much.',
                effect: '+15% escape success, -10% driving speed'
            },
            'reckless': {
                name: 'The Reckless One',
                desc: 'Consequences are for people who hesitate.',
                effect: '+25% driving speed, +20% arrest chance'
            },
            'calculated': {
                name: 'The Calculated One',
                desc: 'Every risk analyzed. Every outcome predicted. Mostly.',
                effect: '+20% intelligence gains, -5% strength gains'
            },
            'desperate': {
                name: 'The Desperate One',
                desc: 'You have nothing left to lose. That makes you dangerous.',
                effect: '+10% all prison activities, +15% corruption gain'
            }
        };
    }
}
