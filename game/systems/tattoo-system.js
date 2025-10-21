// Prison Tattoo System
// Multi-step tattoo creation with infection risk

class TattooSystem {
    constructor(game) {
        this.game = game;
        this.currentDesign = Array(10).fill(0).map(() => Array(10).fill(0)); // 10x10 grid
        this.stencilCreated = false;
        this.inkApplied = false;
        this.placementSelected = false;
        this.selectedPlacement = null;
        this.careScore = 0;
        this.careSequence = ['clean', 'bandage', 'clean']; // Correct sequence
        this.currentCareStep = 0;

        // Body placement options
        this.bodyParts = {
            'left-arm': { name: 'Left Arm', description: 'Visible. Bold.' },
            'right-arm': { name: 'Right Arm', description: 'Mirror the left.' },
            'chest': { name: 'Chest', description: 'Over your heart.' },
            'back': { name: 'Back', description: 'What you leave behind.' },
            'left-shoulder': { name: 'Left Shoulder', description: 'Carry the weight.' },
            'right-shoulder': { name: 'Right Shoulder', description: 'Balance it out.' },
            'neck': { name: 'Neck', description: 'Can\'t hide this.' },
            'left-hand': { name: 'Left Hand', description: 'Every gesture shows it.' },
            'right-hand': { name: 'Right Hand', description: 'Your working hand.' }
        };
    }

    // Initialize tattoo studio
    initializeTattooStudio() {
        // Create grid cells
        const canvas = document.getElementById('tattooCanvas');
        canvas.innerHTML = '';

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = document.createElement('div');
                cell.style.width = '30px';
                cell.style.height = '30px';
                cell.style.background = '#000';
                cell.style.border = '1px solid #0f0';
                cell.style.cursor = 'pointer';
                cell.dataset.row = row;
                cell.dataset.col = col;

                cell.addEventListener('click', () => this.toggleCell(row, col, cell));

                canvas.appendChild(cell);
            }
        }

        // Reset state
        this.stencilCreated = false;
        this.inkApplied = false;
        this.placementSelected = false;
        this.selectedPlacement = null;
        this.careScore = 0;
        this.currentCareStep = 0;

        // Reset UI
        document.getElementById('tattooStep').textContent = 'DESIGN';
        document.getElementById('tattooInstructions').textContent = 'Click cells to draw your tattoo design (10x10 grid)';
        document.getElementById('stencilButton').style.display = 'inline-block';
        document.getElementById('inkButton').style.display = 'none';
        document.getElementById('placementButton').style.display = 'none';
        document.getElementById('careButton').style.display = 'none';
        document.getElementById('infectionStatus').style.display = 'none';
        document.getElementById('careGame').style.display = 'none';
        document.getElementById('placementSelection').style.display = 'none';

        // Display existing tattoos
        this.displayTattooCollection();

        // Update preview
        this.updatePreview();
    }

    // Toggle cell on/off
    toggleCell(row, col, cell) {
        if (this.stencilCreated) {
            this.game.showMessage('Stencil is locked! Start a new tattoo to change design.', 2000);
            return;
        }

        this.currentDesign[row][col] = this.currentDesign[row][col] ? 0 : 1;
        cell.style.background = this.currentDesign[row][col] ? '#0f0' : '#000';
        this.updatePreview();
    }

    // Clear tattoo design
    clearDesign() {
        if (this.stencilCreated) {
            this.game.showMessage('Cannot clear - stencil already created! Cancel and start new tattoo.', 3000);
            return;
        }

        this.currentDesign = Array(10).fill(0).map(() => Array(10).fill(0));

        // Reset all cells
        const cells = document.querySelectorAll('#tattooCanvas div');
        cells.forEach(cell => cell.style.background = '#000');

        this.updatePreview();
        this.game.showMessage('Design cleared.', 2000);
    }

    // Update ASCII preview
    updatePreview() {
        const preview = document.getElementById('tattooPreview');
        let ascii = '';

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                ascii += this.currentDesign[row][col] ? '█' : ' ';
            }
            ascii += '\n';
        }

        preview.textContent = ascii;
    }

    // Create stencil (step 1)
    createStencil() {
        // Check if design is empty
        const hasDesign = this.currentDesign.some(row => row.some(cell => cell === 1));

        if (!hasDesign) {
            this.game.showMessage('Draw a design first! Click cells to create your tattoo.', 3000);
            return;
        }

        this.stencilCreated = true;

        // Update UI
        document.getElementById('tattooStep').textContent = 'STENCIL CREATED';
        document.getElementById('tattooInstructions').textContent = 'Stencil is ready. Apply ink to make it permanent.';
        document.getElementById('stencilButton').style.display = 'none';
        document.getElementById('inkButton').style.display = 'inline-block';
        document.getElementById('clearButton').disabled = true;

        this.game.showMessage('Stencil created. The design is traced on your skin. Ready for ink.', 4000);
    }

    // Apply ink (step 2)
    applyInk() {
        if (!this.stencilCreated) {
            this.game.showMessage('Create stencil first!', 2000);
            return;
        }

        this.inkApplied = true;

        // Update UI
        document.getElementById('tattooStep').textContent = 'INK APPLIED';
        document.getElementById('tattooInstructions').textContent = 'Ink is permanent. Now choose where to place it on your body.';
        document.getElementById('inkButton').style.display = 'none';
        document.getElementById('placementButton').style.display = 'inline-block';

        this.game.showMessage('The needle bites. The ink seeps in. This is permanent. Forever.', 4000);
    }

    // Select body placement (step 3)
    selectBodyPlacement() {
        if (!this.inkApplied) {
            this.game.showMessage('Apply ink first!', 2000);
            return;
        }

        // Show placement selection UI
        document.getElementById('tattooStep').textContent = 'PLACEMENT';
        document.getElementById('tattooInstructions').textContent = 'Choose where this tattoo will mark your body. This choice is permanent.';
        document.getElementById('placementButton').style.display = 'none';
        document.getElementById('placementSelection').style.display = 'block';

        // Generate body part buttons
        const container = document.getElementById('bodyPartButtons');
        container.innerHTML = '';

        Object.keys(this.bodyParts).forEach(partId => {
            const part = this.bodyParts[partId];
            const button = document.createElement('button');
            button.className = 'body-part-btn';
            button.onclick = () => this.choosePlacement(partId);
            button.innerHTML = `
                <strong>${part.name}</strong><br>
                <span style="font-size: 0.8em; color: #888;">${part.description}</span>
            `;
            container.appendChild(button);
        });

        this.game.showMessage('Select where to place your tattoo. Each location tells a different story.', 4000);
    }

    // Choose specific placement
    choosePlacement(partId) {
        this.selectedPlacement = partId;
        this.placementSelected = true;

        const part = this.bodyParts[partId];

        // Highlight selected button
        document.querySelectorAll('.body-part-btn').forEach(btn => {
            btn.style.border = '2px solid #444';
            btn.style.background = '#000';
        });
        event.target.closest('.body-part-btn').style.border = '2px solid #0f0';
        event.target.closest('.body-part-btn').style.background = 'rgba(0, 255, 0, 0.1)';

        // Update UI to show care button
        document.getElementById('tattooInstructions').textContent = `Placement: ${part.name}. Now care for your tattoo to prevent infection.`;
        document.getElementById('careButton').style.display = 'inline-block';

        this.game.showMessage(`${part.name}. ${part.description} This mark will stay here forever.`, 4000);
    }

    // Start care mini-game (step 4)
    startCareGame() {
        if (!this.placementSelected) {
            this.game.showMessage('Select body placement first!', 2000);
            return;
        }

        // Update UI
        document.getElementById('tattooStep').textContent = 'AFTERCARE';
        document.getElementById('tattooInstructions').textContent = 'Follow the correct care sequence: Clean, Bandage, Clean';
        document.getElementById('careButton').style.display = 'none';
        document.getElementById('careGame').style.display = 'block';

        this.careScore = 0;
        this.currentCareStep = 0;
        document.getElementById('careScore').textContent = this.careScore;

        this.game.showMessage('Care for your tattoo. The wrong choice could mean infection.', 4000);
    }

    // Handle care action
    careAction(action) {
        const correctAction = this.careSequence[this.currentCareStep];

        if (action === correctAction) {
            // Correct action
            this.careScore++;
            this.currentCareStep++;
            document.getElementById('careScore').textContent = this.careScore;

            if (this.currentCareStep >= this.careSequence.length) {
                // Care complete
                this.completeTattoo();
            } else {
                this.game.showMessage('Good. Continue caring for the tattoo.', 2000);
            }
        } else {
            // Wrong action
            this.game.showMessage('Wrong action! Start over.', 2000);
            this.careScore = 0;
            this.currentCareStep = 0;
            document.getElementById('careScore').textContent = this.careScore;
        }
    }

    // Complete tattoo and check for infection
    completeTattoo() {
        // 25% chance of infection
        const infected = Math.random() < 0.25;

        // Save tattoo design to player profile
        const tattooData = {
            design: this.currentDesign.map(row => [...row]), // Deep copy
            timestamp: Date.now(),
            infected: infected,
            placement: this.selectedPlacement,
            placementName: this.bodyParts[this.selectedPlacement].name
        };

        this.game.player.tattoos.push(tattooData);

        // Achievement tracking: Ink addict (10 tattoos) - v4.0.0
        if (this.game.achievementTracker && this.game.player.tattoos.length >= 10) {
            this.game.achievementTracker.unlockAchievement('ink_addict');
        }

        // Track for completionist
        if (!this.game.player.activitiesCompleted) {
            this.game.player.activitiesCompleted = [];
        }
        if (!this.game.player.activitiesCompleted.includes('tattoo')) {
            this.game.player.activitiesCompleted.push('tattoo');
        }

        // Hide care game
        document.getElementById('careGame').style.display = 'none';

        if (infected) {
            // Show infection status
            document.getElementById('infectionStatus').style.display = 'block';
            document.getElementById('tattooStep').textContent = 'INFECTED!';
            document.getElementById('tattooInstructions').textContent = 'Your tattoo is infected. This is permanent scarring.';

            this.game.showMessage('INFECTION! The tattoo festers. You feel sick. This was a mistake.', 5000);
        } else {
            // Success
            document.getElementById('tattooStep').textContent = 'COMPLETE';
            document.getElementById('tattooInstructions').textContent = 'Tattoo complete. This mark is yours forever.';

            this.game.showMessage('Tattoo complete. Clean. Permanent. A mark of your time inside.', 5000);
        }

        // Update tattoo collection display
        this.displayTattooCollection();

        // Reset for new tattoo
        setTimeout(() => {
            this.resetForNewTattoo();
        }, 5000);

        this.game.saveGame();
    }

    // Display tattoo collection
    displayTattooCollection() {
        const tattooList = document.getElementById('tattooList');

        if (this.game.player.tattoos.length === 0) {
            tattooList.innerHTML = 'No tattoos yet. Design your first one below.';
            tattooList.style.color = '#0f0';
            return;
        }

        let html = '';
        this.game.player.tattoos.forEach((tattoo, index) => {
            const date = new Date(tattoo.timestamp).toLocaleDateString();
            const status = tattoo.infected ? '<span style="color: #f00;">[INFECTED]</span>' : '<span style="color: #0f0;">[CLEAN]</span>';
            const placement = tattoo.placementName || 'Unknown Location';

            // Generate ASCII preview
            let preview = '';
            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 10; col++) {
                    preview += tattoo.design[row][col] ? '█' : ' ';
                }
                preview += '\n';
            }

            html += `
                <div style="margin: 15px 0; padding: 15px; border: 1px solid #0f0; background: rgba(0, 255, 0, 0.05);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap;">
                        <strong style="color: #0f0;">TATTOO #${index + 1}</strong>
                        <span style="color: #ff0;">📍 ${placement}</span>
                        <span style="color: #0f0;">${date}</span>
                        ${status}
                    </div>
                    <pre style="font-size: 0.8em; line-height: 1em; color: #0f0;">${preview}</pre>
                </div>
            `;
        });

        tattooList.innerHTML = html;
    }

    // Reset for new tattoo
    resetForNewTattoo() {
        this.currentDesign = Array(10).fill(0).map(() => Array(10).fill(0));
        this.stencilCreated = false;
        this.inkApplied = false;
        this.placementSelected = false;
        this.selectedPlacement = null;
        this.careScore = 0;
        this.currentCareStep = 0;

        // Reset UI
        document.getElementById('tattooStep').textContent = 'DESIGN';
        document.getElementById('tattooInstructions').textContent = 'Click cells to draw your tattoo design (10x10 grid)';
        document.getElementById('stencilButton').style.display = 'inline-block';
        document.getElementById('inkButton').style.display = 'none';
        document.getElementById('placementButton').style.display = 'none';
        document.getElementById('careButton').style.display = 'none';
        document.getElementById('infectionStatus').style.display = 'none';
        document.getElementById('placementSelection').style.display = 'none';
        document.getElementById('clearButton').disabled = false;

        // Reset grid
        const cells = document.querySelectorAll('#tattooCanvas div');
        cells.forEach(cell => cell.style.background = '#000');

        this.updatePreview();

        this.game.showMessage('Ready for another tattoo. Design something new.', 3000);
    }

    // Cancel and return to menu
    cancel() {
        if (this.stencilCreated || this.inkApplied) {
            if (!confirm('Tattoo in progress will be lost. Are you sure?')) {
                return;
            }
        }

        this.game.showScreen('prisonMenu');
    }
}
