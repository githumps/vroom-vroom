/**
 * VROOM VROOM - PRISON UI HELPERS
 * JavaScript utilities for pixel art UI system
 *
 * Version: 1.5.0
 * Created: 2025-10-19
 * Agent: isometric-pixel-artist
 *
 * USAGE:
 * Include this file after game.js:
 * <script src="assets/ui/prison-ui-helpers.js"></script>
 */

class PrisonUI {
    constructor() {
        this.toastTimeout = null;
        this.statChangeTimeouts = new Map();
    }

    /**
     * Update stats panel with current player data
     * @param {Object} player - Player object from game
     */
    updateStatsPanel(player) {
        // Update player name
        this.updateElement('prisonPlayerName', player.name || 'PRISONER');

        // Update currency
        this.updateElement('prisonMoney', player.money || 0);
        this.updateElement('prisonCigs', player.cigarettes || 0);

        // Update stat bars
        this.updateStatBar('prisonHunger', player.hunger || 0, 100);
        this.updateStatBar('prisonStrength', player.strength || 0, 100);
        this.updateStatBar('prisonIntelligence', player.intelligence || 0, 100);
    }

    /**
     * Update time display
     * @param {number} day - Current prison day
     * @param {number} sentence - Total sentence length
     */
    updateTimeDisplay(day, sentence) {
        this.updateElement('prisonDayDisplay', day || 0);

        const remaining = (sentence || 0) - (day || 0);
        this.updateElement('prisonSentenceDisplay', `${Math.max(0, remaining)}d`);
    }

    /**
     * Update stat bar with animation
     * @param {string} statName - Stat identifier (e.g., 'prisonHunger')
     * @param {number} value - Current value
     * @param {number} maxValue - Maximum value (default 100)
     * @param {boolean} showChange - Show floating change indicator
     */
    updateStatBar(statName, value, maxValue = 100, showChange = false) {
        const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));

        // Update bar width
        const bar = document.getElementById(`${statName}Bar`);
        if (bar) {
            bar.style.width = `${percentage}%`;
        }

        // Update value display
        const valueDisplay = document.getElementById(`${statName}Value`);
        if (valueDisplay) {
            const oldValue = parseInt(valueDisplay.textContent) || 0;
            const newValue = Math.floor(value);
            valueDisplay.textContent = newValue;

            // Show change indicator if requested
            if (showChange && oldValue !== newValue) {
                this.showStatChange(statName, newValue - oldValue);
            }
        }
    }

    /**
     * Show floating stat change indicator
     * @param {string} statName - Stat identifier
     * @param {number} change - Amount changed (+/-)
     */
    showStatChange(statName, change) {
        const valueDisplay = document.getElementById(`${statName}Value`);
        if (!valueDisplay) return;

        // Clear existing timeout for this stat
        if (this.statChangeTimeouts.has(statName)) {
            clearTimeout(this.statChangeTimeouts.get(statName));
        }

        // Remove existing indicator
        const existingIndicator = valueDisplay.parentElement.querySelector('.stat-change');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Create new indicator
        const indicator = document.createElement('div');
        indicator.className = `stat-change ${change > 0 ? 'positive' : 'negative'}`;
        indicator.textContent = change > 0 ? `+${change}` : change;

        // Position relative to value display
        indicator.style.position = 'absolute';
        indicator.style.right = '0';
        indicator.style.top = '-24px';

        valueDisplay.parentElement.style.position = 'relative';
        valueDisplay.parentElement.appendChild(indicator);

        // Remove after animation completes
        const timeout = setTimeout(() => {
            indicator.remove();
            this.statChangeTimeouts.delete(statName);
        }, 1000);

        this.statChangeTimeouts.set(statName, timeout);
    }

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Toast type: 'default', 'success', 'warning', 'error'
     * @param {number} duration - Duration in milliseconds (default 3000)
     */
    showToast(message, type = 'default', duration = 3000) {
        let toast = document.getElementById('gameToast');
        let messageEl = document.getElementById('toastMessage');

        // Create toast elements if they don't exist
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'gameToast';
            toast.className = 'pixel-toast';
            toast.style.display = 'none';

            messageEl = document.createElement('div');
            messageEl.id = 'toastMessage';
            messageEl.className = 'toast-message';

            toast.appendChild(messageEl);
            document.body.appendChild(toast);
        }

        // Clear existing timeout
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
        }

        // Set message and type
        messageEl.textContent = message;
        toast.className = `pixel-toast ${type}`;

        // Show toast
        toast.style.display = 'block';

        // Auto-hide after duration
        this.toastTimeout = setTimeout(() => {
            toast.style.display = 'none';
        }, duration);
    }

    /**
     * Show modal dialog
     * @param {string} modalId - Modal element ID
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById(`${modalId}Overlay`);

        if (modal) modal.style.display = 'block';
        if (overlay) overlay.style.display = 'block';

        // Add close on ESC key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modalId);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    /**
     * Close modal dialog
     * @param {string} modalId - Modal element ID
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById(`${modalId}Overlay`);

        if (modal) modal.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
    }

    /**
     * Update any element's text content
     * @param {string} elementId - Element ID
     * @param {string|number} value - New value
     */
    updateElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * Create and show a custom modal
     * @param {Object} config - Modal configuration
     * @param {string} config.title - Modal title
     * @param {string} config.body - Modal body HTML
     * @param {Array} config.buttons - Array of button configs
     */
    createCustomModal(config) {
        const modalId = `customModal${Date.now()}`;
        const overlayId = `${modalId}Overlay`;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = overlayId;
        overlay.className = 'modal-overlay';
        overlay.onclick = () => this.closeModal(modalId);

        // Create modal
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'pixel-modal';

        // Create header
        const header = document.createElement('div');
        header.className = 'modal-header';
        const title = document.createElement('h2');
        title.className = 'modal-title';
        title.textContent = config.title || 'Modal';
        header.appendChild(title);

        // Create body
        const body = document.createElement('div');
        body.className = 'modal-body';
        body.innerHTML = config.body || '';

        // Create footer with buttons
        const footer = document.createElement('div');
        footer.className = 'modal-footer';

        if (config.buttons && config.buttons.length > 0) {
            config.buttons.forEach(btnConfig => {
                const button = document.createElement('button');
                button.className = `pixel-button ${btnConfig.class || ''}`;
                button.textContent = btnConfig.text || 'Button';
                button.onclick = () => {
                    if (btnConfig.onClick) btnConfig.onClick();
                    this.closeModal(modalId);
                };
                footer.appendChild(button);
            });
        } else {
            // Default close button
            const button = document.createElement('button');
            button.className = 'pixel-button';
            button.textContent = 'Close';
            button.onclick = () => this.closeModal(modalId);
            footer.appendChild(button);
        }

        // Assemble modal
        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);

        // Add to document
        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        // Show modal
        this.showModal(modalId);

        // Return cleanup function
        return () => {
            overlay.remove();
            modal.remove();
        };
    }

    /**
     * Update prisoner info card
     * @param {Object} player - Player object
     */
    updatePrisonerCard(player) {
        this.updateElement('cardName', player.name || 'UNKNOWN DRIVER');
        this.updateElement('cardNumber', player.prisonerId || '???');
        this.updateElement('cardArrests', player.arrests || 0);
        this.updateElement('cardGang', player.currentGang || 'None');

        // Calculate behavior status
        const behavior = (player.goodBehaviorPoints || 0) >= 50 ? 'Good' :
                        (player.goodBehaviorPoints || 0) >= 25 ? 'Fair' : 'Poor';
        this.updateElement('cardBehavior', behavior);
    }

    /**
     * Animate stat change with visual feedback
     * @param {string} statName - Stat identifier
     * @param {number} oldValue - Previous value
     * @param {number} newValue - New value
     * @param {number} maxValue - Maximum value
     */
    animateStatChange(statName, oldValue, newValue, maxValue = 100) {
        const steps = 20;
        const stepDuration = 20; // ms
        const increment = (newValue - oldValue) / steps;

        let currentStep = 0;

        const animate = () => {
            currentStep++;
            const currentValue = oldValue + (increment * currentStep);

            this.updateStatBar(statName, currentValue, maxValue, false);

            if (currentStep < steps) {
                setTimeout(animate, stepDuration);
            } else {
                // Final update with exact value
                this.updateStatBar(statName, newValue, maxValue, true);
            }
        };

        animate();
    }

    /**
     * Disable/enable activity card
     * @param {HTMLElement|string} cardElement - Card element or ID
     * @param {boolean} disabled - Whether to disable
     * @param {string} reason - Reason for disabling (optional)
     */
    setCardDisabled(cardElement, disabled, reason = '') {
        const card = typeof cardElement === 'string' ?
            document.getElementById(cardElement) : cardElement;

        if (!card) return;

        if (disabled) {
            card.style.opacity = '0.5';
            card.style.cursor = 'not-allowed';
            card.style.pointerEvents = 'none';

            if (reason) {
                const existingReason = card.querySelector('.disabled-reason');
                if (existingReason) existingReason.remove();

                const reasonEl = document.createElement('div');
                reasonEl.className = 'disabled-reason';
                reasonEl.style.color = 'var(--text-disabled)';
                reasonEl.style.fontSize = '12px';
                reasonEl.style.marginTop = '8px';
                reasonEl.textContent = `Locked: ${reason}`;
                card.appendChild(reasonEl);
            }
        } else {
            card.style.opacity = '1';
            card.style.cursor = 'pointer';
            card.style.pointerEvents = 'all';

            const reasonEl = card.querySelector('.disabled-reason');
            if (reasonEl) reasonEl.remove();
        }
    }

    /**
     * Add badge/indicator to activity card
     * @param {HTMLElement|string} cardElement - Card element or ID
     * @param {string} text - Badge text
     * @param {string} type - Badge type: 'new', 'locked', 'available'
     */
    addCardBadge(cardElement, text, type = 'new') {
        const card = typeof cardElement === 'string' ?
            document.getElementById(cardElement) : cardElement;

        if (!card) return;

        // Remove existing badge
        const existingBadge = card.querySelector('.card-badge');
        if (existingBadge) existingBadge.remove();

        // Create new badge
        const badge = document.createElement('div');
        badge.className = 'card-badge';
        badge.textContent = text;

        // Style based on type
        const colors = {
            new: 'var(--text-success)',
            locked: 'var(--text-disabled)',
            available: 'var(--warm-yellow)'
        };

        badge.style.position = 'absolute';
        badge.style.top = '10px';
        badge.style.right = '10px';
        badge.style.padding = '4px 8px';
        badge.style.fontSize = '10px';
        badge.style.fontWeight = 'bold';
        badge.style.color = colors[type] || colors.new;
        badge.style.background = 'var(--ui-bg-dark)';
        badge.style.border = `1px solid ${colors[type] || colors.new}`;
        badge.style.textTransform = 'uppercase';
        badge.style.letterSpacing = '1px';

        card.style.position = 'relative';
        card.appendChild(badge);
    }

    /**
     * Update all UI elements at once
     * @param {Object} player - Player object
     * @param {number} day - Current day
     * @param {number} sentence - Total sentence
     */
    updateAllUI(player, day, sentence) {
        this.updateStatsPanel(player);
        this.updateTimeDisplay(day, sentence);
        this.updatePrisonerCard(player);
    }
}

// Create global instance
window.prisonUI = new PrisonUI();

/**
 * USAGE EXAMPLES:
 *
 * // Update stats panel
 * prisonUI.updateStatsPanel(game.player);
 *
 * // Update specific stat with animation
 * prisonUI.updateStatBar('prisonHunger', 75, 100, true);
 *
 * // Show toast notification
 * prisonUI.showToast('Strength increased!', 'success');
 * prisonUI.showToast('You are hungry', 'warning');
 * prisonUI.showToast('Invalid action', 'error');
 *
 * // Update time display
 * prisonUI.updateTimeDisplay(game.player.prisonDays, game.player.sentence);
 *
 * // Show custom modal
 * prisonUI.createCustomModal({
 *     title: 'Confirm Action',
 *     body: '<p>Are you sure you want to do this?</p>',
 *     buttons: [
 *         { text: 'Cancel', class: '', onClick: () => console.log('Cancelled') },
 *         { text: 'Confirm', class: 'primary', onClick: () => console.log('Confirmed') }
 *     ]
 * });
 *
 * // Disable activity card
 * prisonUI.setCardDisabled('tattooCard', true, 'Not enough credits');
 *
 * // Add badge to card
 * prisonUI.addCardBadge('clinicCard', 'NEW', 'new');
 *
 * // Animate stat change
 * prisonUI.animateStatChange('prisonStrength', 50, 60, 100);
 *
 * // Update all UI at once
 * prisonUI.updateAllUI(game.player, game.player.prisonDays, game.player.sentence);
 */
