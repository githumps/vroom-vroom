// VROOM VROOM - Debug Logging System
// Comprehensive logging utility with levels, filtering, and history

class VroomLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 100; // Keep last 100 logs
        this.enabled = false;
        this.logLevels = {
            INFO: { color: '#0ff', prefix: 'INFO' },
            DEBUG: { color: '#0f0', prefix: 'DEBUG' },
            WARN: { color: '#ff0', prefix: 'WARN' },
            ERROR: { color: '#f00', prefix: 'ERROR' }
        };

        // System categories for filtering
        this.systems = [
            'API', 'SAVE', 'PRISON', 'TATTOO', 'GANG',
            'DRIVING', 'COURT', 'USER', 'EATING', 'WEIGHTS',
            'LIBRARY', 'COMMISSARY', 'ESCAPE', 'CINEMATIC', 'SOUND'
        ];

        // Check if dev mode is enabled
        this.checkDevMode();
    }

    // Check if dev mode is active
    checkDevMode() {
        this.enabled = localStorage.getItem('vroomVroomDevMode') === 'true';
        if (this.enabled) {
            console.log('%c[VROOM] Dev Mode Active - Logging Enabled', 'color: #0f0; font-weight: bold;');
        }
    }

    // Enable dev mode
    enableDevMode() {
        localStorage.setItem('vroomVroomDevMode', 'true');
        this.enabled = true;
        this.log('INFO', 'SYSTEM', 'Dev Mode Enabled');
    }

    // Disable dev mode
    disableDevMode() {
        localStorage.removeItem('vroomVroomDevMode');
        this.enabled = false;
        console.log('%c[VROOM] Dev Mode Disabled', 'color: #888;');
    }

    // Main logging method
    log(level, system, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            system,
            message,
            data,
            id: Date.now() + Math.random()
        };

        // Add to history
        this.logs.push(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Console output if dev mode enabled
        if (this.enabled) {
            const levelConfig = this.logLevels[level] || this.logLevels.INFO;
            const style = `color: ${levelConfig.color}; font-weight: bold;`;
            const systemStyle = 'color: #888;';

            console.log(
                `%c[VROOM] %c[${levelConfig.prefix}] %c[${system}]%c ${message}`,
                'color: #0f0;',
                style,
                systemStyle,
                'color: inherit;'
            );

            if (data) {
                console.log('%cData:', 'color: #888; font-style: italic;', data);
            }
        }

        // Emit event for UI updates
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('vroomLog', { detail: logEntry }));
        }
    }

    // Convenience methods
    info(system, message, data) {
        this.log('INFO', system, message, data);
    }

    debug(system, message, data) {
        this.log('DEBUG', system, message, data);
    }

    warn(system, message, data) {
        this.log('WARN', system, message, data);
    }

    error(system, message, data) {
        this.log('ERROR', system, message, data);
    }

    // Get logs with optional filtering
    getLogs(filter = {}) {
        let filtered = [...this.logs];

        if (filter.level) {
            filtered = filtered.filter(log => log.level === filter.level);
        }

        if (filter.system) {
            filtered = filtered.filter(log => log.system === filter.system);
        }

        if (filter.limit) {
            filtered = filtered.slice(-filter.limit);
        }

        return filtered;
    }

    // Get recent logs for overlay display
    getRecentLogs(count = 5) {
        return this.logs.slice(-count);
    }

    // Clear log history
    clearLogs() {
        this.logs = [];
        this.info('SYSTEM', 'Log history cleared');
    }

    // Export logs as JSON
    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }

    // Format log for display
    formatLog(log) {
        const time = new Date(log.timestamp).toLocaleTimeString();
        return `[${time}] [${log.level}] [${log.system}] ${log.message}`;
    }
}

// Global logger instance
if (typeof window !== 'undefined') {
    window.vroomLogger = window.vroomLogger || new VroomLogger();
}
