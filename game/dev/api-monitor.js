// VROOM VROOM - API Monitoring and Counter System
// Tracks all Gemini API calls with detailed metrics

class ApiMonitor {
    constructor() {
        this.stats = {
            totalCalls: 0,
            successfulCalls: 0,
            failedCalls: 0,
            lastCallTime: null,
            lastCallDuration: 0,
            rateLimitHit: false,
            callHistory: []
        };

        this.maxHistory = 20; // Keep last 20 API calls
        this.rateLimitWindow = 60000; // 1 minute window
        this.maxCallsPerMinute = 60; // Gemini free tier limit

        // Load stats from session
        this.loadStats();
    }

    // Load stats from sessionStorage
    loadStats() {
        const saved = sessionStorage.getItem('vroomApiStats');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.stats = { ...this.stats, ...parsed };
            } catch (e) {
                console.warn('Failed to load API stats:', e);
            }
        }
    }

    // Save stats to sessionStorage
    saveStats() {
        try {
            sessionStorage.setItem('vroomApiStats', JSON.stringify(this.stats));
        } catch (e) {
            console.warn('Failed to save API stats:', e);
        }
    }

    // Start tracking an API call
    startCall(callData) {
        const callId = Date.now() + Math.random();
        const call = {
            id: callId,
            startTime: Date.now(),
            endTime: null,
            duration: null,
            success: null,
            request: callData,
            response: null,
            error: null
        };

        this.stats.callHistory.push(call);
        if (this.stats.callHistory.length > this.maxHistory) {
            this.stats.callHistory.shift();
        }

        // Check rate limiting
        this.checkRateLimit();

        // Log the call
        if (window.vroomLogger) {
            window.vroomLogger.debug('API', `Starting API call #${this.stats.totalCalls + 1}`, {
                prompt: callData.prompt?.substring(0, 100) + '...',
                model: callData.model || 'gemma-3-27b-it'
            });
        }

        return callId;
    }

    // End tracking an API call
    endCall(callId, success, responseData = null, error = null) {
        const call = this.stats.callHistory.find(c => c.id === callId);
        if (!call) return;

        call.endTime = Date.now();
        call.duration = call.endTime - call.startTime;
        call.success = success;
        call.response = responseData;
        call.error = error;

        // Update stats
        this.stats.totalCalls++;
        if (success) {
            this.stats.successfulCalls++;
        } else {
            this.stats.failedCalls++;
        }
        this.stats.lastCallTime = call.endTime;
        this.stats.lastCallDuration = call.duration;

        // Log the result
        if (window.vroomLogger) {
            const level = success ? 'INFO' : 'ERROR';
            const message = success
                ? `API call completed in ${call.duration}ms`
                : `API call failed: ${error?.message || 'Unknown error'}`;

            window.vroomLogger.log(level, 'API', message, {
                callId,
                duration: call.duration,
                success,
                response: responseData ? JSON.stringify(responseData).substring(0, 200) : null,
                error: error?.message
            });
        }

        this.saveStats();

        // Emit event for UI updates
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('apiCallComplete', {
                detail: { callId, success, duration: call.duration }
            }));
        }
    }

    // Check rate limiting
    checkRateLimit() {
        const now = Date.now();
        const recentCalls = this.stats.callHistory.filter(
            call => call.startTime > now - this.rateLimitWindow
        );

        this.stats.rateLimitHit = recentCalls.length >= this.maxCallsPerMinute;

        if (this.stats.rateLimitHit && window.vroomLogger) {
            window.vroomLogger.warn('API', 'Rate limit threshold reached', {
                callsInLastMinute: recentCalls.length,
                maxAllowed: this.maxCallsPerMinute
            });
        }
    }

    // Get current statistics
    getStats() {
        return {
            ...this.stats,
            successRate: this.stats.totalCalls > 0
                ? ((this.stats.successfulCalls / this.stats.totalCalls) * 100).toFixed(1) + '%'
                : 'N/A',
            averageResponseTime: this.calculateAverageResponseTime(),
            callsInLastMinute: this.getRecentCallCount()
        };
    }

    // Calculate average response time
    calculateAverageResponseTime() {
        const successfulCalls = this.stats.callHistory.filter(c => c.success && c.duration);
        if (successfulCalls.length === 0) return 0;

        const total = successfulCalls.reduce((sum, call) => sum + call.duration, 0);
        return Math.round(total / successfulCalls.length);
    }

    // Get number of calls in last minute
    getRecentCallCount() {
        const now = Date.now();
        return this.stats.callHistory.filter(
            call => call.startTime > now - this.rateLimitWindow
        ).length;
    }

    // Get call history
    getHistory(limit = 10) {
        return this.stats.callHistory.slice(-limit);
    }

    // Reset statistics
    reset() {
        this.stats = {
            totalCalls: 0,
            successfulCalls: 0,
            failedCalls: 0,
            lastCallTime: null,
            lastCallDuration: 0,
            rateLimitHit: false,
            callHistory: []
        };
        this.saveStats();

        if (window.vroomLogger) {
            window.vroomLogger.info('API', 'API statistics reset');
        }
    }

    // Format timestamp
    formatTime(timestamp) {
        if (!timestamp) return 'Never';
        return new Date(timestamp).toLocaleTimeString();
    }

    // Get API key status
    getApiKeyStatus() {
        if (typeof window === 'undefined' || !window.game) {
            return { present: false, valid: null };
        }

        const hasKey = window.game.apiKeyManager?.hasApiKey() || false;
        return {
            present: hasKey,
            valid: hasKey ? 'Unknown (test to verify)' : null,
            source: hasKey ? 'sessionStorage' : null
        };
    }
}

// Global API monitor instance
if (typeof window !== 'undefined') {
    window.apiMonitor = window.apiMonitor || new ApiMonitor();
}
