// Prison Tattoo System
// Multi-step tattoo creation with infection risk

class TattooSystem {
    constructor(game) {
        this.game = game;
        this.currentDesign = Array(10).fill(0).map(() => Array(10).fill(0)); // 10x10 grid
        this.stencilCreated = false;
        this.inkApplied = false;
        this.careScore = 0;
        this.careSequence = ['clean', 'bandage', 'clean']; // Correct sequence
        this.currentCareStep = 0;
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
        this.careScore = 0;
        this.currentCareStep = 0;

        // Reset UI
        document.getElementById('tattooStep').textContent = 'DESIGN';
        document.getElementById('tattooInstructions').textContent = 'Click cells to draw your tattoo design (10x10 grid)';
        document.getElementById('stencilButton').style.display = 'inline-block';
        document.getElementById('inkButton').style.display = 'none';
        document.getElementById('careButton').style.display = 'none';
        document.getElementById('infectionStatus').style.display = 'none';
        document.getElementById('careGame').style.display = 'none';

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
        document.getElementById('tattooInstructions').textContent = 'Ink is permanent. Care for your tattoo to prevent infection.';
        document.getElementById('inkButton').style.display = 'none';
        document.getElementById('careButton').style.display = 'inline-block';

        this.game.showMessage('The needle bites. The ink seeps in. This is permanent. Forever.', 4000);
    }

    // Start care mini-game (step 3)
    startCareGame() {
        if (!this.inkApplied) {
            this.game.showMessage('Apply ink first!', 2000);
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
            infected: infected
        };

        this.game.player.tattoos.push(tattooData);

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
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <strong style="color: #0f0;">TATTOO #${index + 1}</strong>
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
        this.careScore = 0;
        this.currentCareStep = 0;

        // Reset UI
        document.getElementById('tattooStep').textContent = 'DESIGN';
        document.getElementById('tattooInstructions').textContent = 'Click cells to draw your tattoo design (10x10 grid)';
        document.getElementById('stencilButton').style.display = 'inline-block';
        document.getElementById('inkButton').style.display = 'none';
        document.getElementById('careButton').style.display = 'none';
        document.getElementById('infectionStatus').style.display = 'none';
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
