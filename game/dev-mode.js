// VROOM VROOM - Developer Mode System
// Comprehensive dev overlay, debugging tools, and testing utilities

class DevMode {
    constructor() {
        this.enabled = false;
        this.overlayVisible = false;
        this.overlayExpanded = true;
        this.updateInterval = null;

        // Initialize from localStorage
        this.checkDevMode();

        // Listen for log events
        if (typeof window !== 'undefined') {
            window.addEventListener('vroomLog', (e) => this.onLog(e.detail));
            window.addEventListener('apiCallComplete', (e) => this.onApiCall(e.detail));
        }
    }

    // Check if dev mode is enabled
    checkDevMode() {
        this.enabled = localStorage.getItem('vroomVroomDevMode') === 'true';
        if (this.enabled) {
            this.activate();
        }
    }

    // Enable dev mode
    enable() {
        localStorage.setItem('vroomVroomDevMode', 'true');
        this.enabled = true;

        // Enable logger
        if (window.vroomLogger) {
            window.vroomLogger.enableDevMode();
        }

        this.activate();

        if (window.vroomLogger) {
            window.vroomLogger.info('SYSTEM', 'Dev Mode Enabled');
        }
    }

    // Disable dev mode
    disable() {
        localStorage.removeItem('vroomVroomDevMode');
        this.enabled = false;
        this.deactivate();

        // Disable logger
        if (window.vroomLogger) {
            window.vroomLogger.disableDevMode();
        }
    }

    // Toggle dev mode
    toggle() {
        if (this.enabled) {
            this.disable();
        } else {
            this.enable();
        }
    }

    // Activate dev mode UI
    activate() {
        if (!this.overlayVisible) {
            this.createOverlay();
            this.overlayVisible = true;
        }

        // Start update interval
        if (!this.updateInterval) {
            this.updateInterval = setInterval(() => this.updateOverlay(), 1000);
        }
    }

    // Deactivate dev mode UI
    deactivate() {
        const overlay = document.getElementById('devModeOverlay');
        if (overlay) {
            overlay.remove();
        }
        this.overlayVisible = false;

        // Stop update interval
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Create the dev mode overlay
    createOverlay() {
        // Remove existing overlay if present
        const existing = document.getElementById('devModeOverlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'devModeOverlay';
        overlay.innerHTML = `
            <div id="devModeContent">
                <div class="dev-header">
                    <span class="dev-title">DEV MODE</span>
                    <button class="dev-btn-small" onclick="window.devMode.toggleExpanded()">
                        <span id="devToggleIcon">−</span>
                    </button>
                    <button class="dev-btn-small" onclick="window.devMode.disable()">×</button>
                </div>

                <div id="devExpandableContent">
                    <!-- Current Screen -->
                    <div class="dev-section">
                        <div class="dev-label">Screen:</div>
                        <div class="dev-value" id="devCurrentScreen">-</div>
                    </div>

                    <!-- Player Stats -->
                    <div class="dev-section">
                        <div class="dev-label">Player Stats:</div>
                        <div class="dev-value dev-stats" id="devPlayerStats">-</div>
                    </div>

                    <!-- API Counter -->
                    <div class="dev-section dev-section-api">
                        <div class="dev-label">API Calls:</div>
                        <div class="dev-value" id="devApiStats">
                            Total: 0 | Success: 0 | Failed: 0
                        </div>
                        <div class="dev-sub-value" id="devApiDetails">
                            Last: Never | Avg: 0ms
                        </div>
                        <div class="dev-sub-value" id="devApiStatus">
                            Key: Not Set
                        </div>
                    </div>

                    <!-- Recent Logs -->
                    <div class="dev-section">
                        <div class="dev-label">Recent Logs:</div>
                        <div class="dev-logs" id="devRecentLogs">
                            <div class="dev-log-entry">Waiting for logs...</div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="dev-section">
                        <div class="dev-label">Quick Actions:</div>
                        <div class="dev-actions">
                            <button class="dev-btn" onclick="window.devMode.testApiCall()">Test API</button>
                            <button class="dev-btn" onclick="window.devMode.triggerEvent()">Random Event</button>
                            <button class="dev-btn" onclick="window.devMode.showLogViewer()">View Logs</button>
                            <button class="dev-btn" onclick="window.devMode.resetApiStats()">Reset API</button>
                        </div>
                    </div>

                    <!-- Jump To Screen -->
                    <div class="dev-section">
                        <div class="dev-label">Jump To:</div>
                        <select class="dev-select" id="devScreenSelect" onchange="window.devMode.jumpToScreen(this.value)">
                            <option value="">Select Screen...</option>
                            <option value="mainMenu">Main Menu</option>
                            <option value="characterCreation">Character Creation</option>
                            <option value="drivingMode">Driving</option>
                            <option value="courtroom">Courtroom</option>
                            <option value="prisonMenu">Prison</option>
                            <option value="tattooStudio">Tattoo Studio</option>
                            <option value="gangSystem">Gang System</option>
                            <option value="escapeMenu">Escape Menu</option>
                            <option value="commissaryShop">Commissary</option>
                            <option value="prisonLibrary">Library</option>
                            <option value="weightLifting">Weight Lifting</option>
                            <option value="eatingSimulator">Eating</option>
                        </select>
                    </div>

                    <!-- Modify Stats -->
                    <div class="dev-section">
                        <div class="dev-label">Modify:</div>
                        <div class="dev-actions">
                            <button class="dev-btn" onclick="window.devMode.addCredits(100)">+100 Credits</button>
                            <button class="dev-btn" onclick="window.devMode.addCigs(20)">+20 Cigs</button>
                            <button class="dev-btn" onclick="window.devMode.maxStats()">Max Stats</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.updateOverlay();
    }

    // Toggle expanded/collapsed state
    toggleExpanded() {
        this.overlayExpanded = !this.overlayExpanded;
        const content = document.getElementById('devExpandableContent');
        const icon = document.getElementById('devToggleIcon');

        if (content) {
            content.style.display = this.overlayExpanded ? 'block' : 'none';
        }
        if (icon) {
            icon.textContent = this.overlayExpanded ? '−' : '+';
        }
    }

    // Update overlay with current data
    updateOverlay() {
        if (!this.overlayVisible) return;

        // Update current screen
        const screenEl = document.getElementById('devCurrentScreen');
        if (screenEl && window.game) {
            const activeScreen = document.querySelector('.screen.active');
            screenEl.textContent = activeScreen?.id || 'Unknown';
        }

        // Update player stats
        const statsEl = document.getElementById('devPlayerStats');
        if (statsEl && window.game && window.game.player) {
            const p = window.game.player;
            statsEl.innerHTML = `
                Credits: ${p.money || 0} |
                Cigs: ${p.cigarettes || 0} |
                Days: ${p.prisonDays || 0} |
                Strength: ${p.strength || 0}
            `;
        }

        // Update API stats
        if (window.apiMonitor) {
            const stats = window.apiMonitor.getStats();
            const apiStatsEl = document.getElementById('devApiStats');
            const apiDetailsEl = document.getElementById('devApiDetails');
            const apiStatusEl = document.getElementById('devApiStatus');

            if (apiStatsEl) {
                apiStatsEl.textContent = `Total: ${stats.totalCalls} | Success: ${stats.successfulCalls} | Failed: ${stats.failedCalls}`;
            }

            if (apiDetailsEl) {
                const lastTime = stats.lastCallTime
                    ? new Date(stats.lastCallTime).toLocaleTimeString()
                    : 'Never';
                apiDetailsEl.textContent = `Last: ${lastTime} | Avg: ${stats.averageResponseTime}ms`;
            }

            if (apiStatusEl) {
                const keyStatus = window.apiMonitor.getApiKeyStatus();
                const statusText = keyStatus.present ? 'Key: Set ✓' : 'Key: Not Set ✗';
                apiStatusEl.textContent = statusText;
                apiStatusEl.style.color = keyStatus.present ? '#0f0' : '#f00';
            }
        }

        // Update recent logs
        if (window.vroomLogger) {
            const logsEl = document.getElementById('devRecentLogs');
            if (logsEl) {
                const recent = window.vroomLogger.getRecentLogs(5);
                if (recent.length === 0) {
                    logsEl.innerHTML = '<div class="dev-log-entry">No logs yet</div>';
                } else {
                    logsEl.innerHTML = recent.map(log => {
                        const time = new Date(log.timestamp).toLocaleTimeString();
                        const levelClass = `dev-log-${log.level.toLowerCase()}`;
                        return `<div class="dev-log-entry ${levelClass}">[${time}] [${log.system}] ${log.message}</div>`;
                    }).join('');
                }
            }
        }
    }

    // Event handlers
    onLog(logEntry) {
        this.updateOverlay();
    }

    onApiCall(callData) {
        this.updateOverlay();
    }

    // Quick actions
    async testApiCall() {
        if (!window.game || !window.game.apiKeyManager) {
            alert('Game not loaded yet');
            return;
        }

        if (window.vroomLogger) {
            window.vroomLogger.info('USER', 'Testing API key...');
        }

        const result = await window.game.apiKeyManager.testApiKey();

        alert(result.success
            ? 'API Key Test: SUCCESS\n\nThe API is responding correctly.'
            : `API Key Test: FAILED\n\n${result.message}`
        );
    }

    triggerEvent() {
        if (window.vroomLogger) {
            window.vroomLogger.info('USER', 'Triggered random event (placeholder)');
        }
        alert('Random event system not yet implemented');
    }

    showLogViewer() {
        if (!window.vroomLogger) return;

        const logs = window.vroomLogger.getLogs();
        const formatted = logs.map(log => window.vroomLogger.formatLog(log)).join('\n');

        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;';
        modal.innerHTML = `
            <div style="background: #000; border: 2px solid #0f0; padding: 20px; max-width: 900px; width: 100%; max-height: 80vh; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <h3 style="color: #0f0; margin: 0;">Log Viewer (${logs.length} entries)</h3>
                    <button onclick="this.closest('div[style*=fixed]').remove()" style="background: #f00; color: #000; border: none; padding: 5px 15px; cursor: pointer;">CLOSE</button>
                </div>
                <textarea readonly style="flex: 1; background: #000; color: #0f0; border: 1px solid #0f0; padding: 10px; font-family: monospace; font-size: 0.9em; resize: none;">${formatted}</textarea>
                <div style="margin-top: 10px; display: flex; gap: 10px;">
                    <button onclick="navigator.clipboard.writeText(this.parentElement.previousElementSibling.value); alert('Logs copied to clipboard!');" style="background: #000; color: #0f0; border: 2px solid #0f0; padding: 8px 15px; cursor: pointer;">COPY TO CLIPBOARD</button>
                    <button onclick="if(confirm('Clear all logs?')) { window.vroomLogger.clearLogs(); this.closest('div[style*=fixed]').remove(); }" style="background: #000; color: #ff0; border: 2px solid #ff0; padding: 8px 15px; cursor: pointer;">CLEAR LOGS</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    resetApiStats() {
        if (confirm('Reset API statistics?')) {
            if (window.apiMonitor) {
                window.apiMonitor.reset();
                this.updateOverlay();
            }
        }
    }

    jumpToScreen(screenId) {
        if (!screenId || !window.game) return;

        if (window.vroomLogger) {
            window.vroomLogger.info('USER', `Jumping to screen: ${screenId}`);
        }

        if (screenId === 'drivingMode') {
            window.game.startDriving();
        } else {
            window.game.showScreen(screenId);
        }

        // Reset select
        const select = document.getElementById('devScreenSelect');
        if (select) select.value = '';
    }

    addCredits(amount) {
        if (window.game && window.game.player) {
            window.game.player.money = (window.game.player.money || 0) + amount;
            window.game.saveGame();
            this.updateOverlay();

            if (window.vroomLogger) {
                window.vroomLogger.info('USER', `Added ${amount} credits`, { newTotal: window.game.player.money });
            }
        }
    }

    addCigs(amount) {
        if (window.game && window.game.player) {
            window.game.player.cigarettes = (window.game.player.cigarettes || 0) + amount;
            window.game.saveGame();
            this.updateOverlay();

            if (window.vroomLogger) {
                window.vroomLogger.info('USER', `Added ${amount} cigarettes`, { newTotal: window.game.player.cigarettes });
            }
        }
    }

    maxStats() {
        if (window.game && window.game.player) {
            const p = window.game.player;
            p.money = 9999;
            p.cigarettes = 999;
            p.strength = 100;
            p.intelligence = 100;
            window.game.saveGame();
            this.updateOverlay();

            if (window.vroomLogger) {
                window.vroomLogger.info('USER', 'Maxed all player stats');
            }
        }
    }
}

// Initialize global dev mode instance
if (typeof window !== 'undefined') {
    window.devMode = window.devMode || new DevMode();
}
