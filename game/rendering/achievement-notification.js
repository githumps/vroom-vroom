// VROOM VROOM - Achievement Notification Renderer
// Beautiful pixel art notifications for achievement unlocks

/**
 * Achievement Notification System
 *
 * Features:
 * - Slide-in animation from top-right
 * - Pixel art styling with rarity colors
 * - Auto-dismiss after 5 seconds
 * - Click to dismiss
 * - Queue system for multiple achievements
 * - Share button integration
 */

class AchievementNotificationRenderer {
    constructor() {
        this.container = null;
        this.currentNotification = null;
        this.isShowing = false;
        this.initialized = false;
    }

    /**
     * Initialize notification container
     */
    init() {
        if (this.initialized) return;

        // Create container if it doesn't exist
        if (!document.getElementById('achievement-notification-container')) {
            const container = document.createElement('div');
            container.id = 'achievement-notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        this.container = document.getElementById('achievement-notification-container');
        this.initialized = true;
    }

    /**
     * Show achievement notification
     */
    show(achievement, onComplete) {
        if (!this.initialized) this.init();

        // Remove any existing notification first
        if (this.currentNotification) {
            this.hide(true);
        }

        this.isShowing = true;

        // Get rarity config
        const rarityConfig = ACHIEVEMENT_RARITIES[achievement.rarity] || ACHIEVEMENT_RARITIES.common;

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.style.cssText = `
            pointer-events: all;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border: 3px solid ${rarityConfig.color};
            border-radius: 8px;
            padding: 16px;
            min-width: 320px;
            max-width: 400px;
            box-shadow:
                0 8px 24px rgba(0, 0, 0, 0.6),
                0 0 20px ${rarityConfig.glowColor}40,
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            cursor: pointer;
            transform: translateX(450px);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            font-family: 'Press Start 2P', 'Courier New', monospace;
            animation: notificationGlow 2s ease-in-out infinite;
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            border-bottom: 2px solid ${rarityConfig.color};
            padding-bottom: 8px;
        `;

        const title = document.createElement('div');
        title.textContent = 'ACHIEVEMENT UNLOCKED!';
        title.style.cssText = `
            font-size: 10px;
            color: ${rarityConfig.color};
            letter-spacing: 1px;
            text-shadow: 0 0 10px ${rarityConfig.glowColor};
        `;

        const rarity = document.createElement('div');
        rarity.textContent = rarityConfig.name.toUpperCase();
        rarity.style.cssText = `
            font-size: 8px;
            color: ${rarityConfig.color};
            opacity: 0.8;
        `;

        header.appendChild(title);
        header.appendChild(rarity);

        // Content area
        const content = document.createElement('div');
        content.style.cssText = `
            display: flex;
            gap: 16px;
            align-items: center;
        `;

        // Icon badge (pixel art style)
        const iconBadge = document.createElement('div');
        iconBadge.style.cssText = `
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, ${rarityConfig.color}20 0%, ${rarityConfig.color}40 100%);
            border: 2px solid ${rarityConfig.color};
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            flex-shrink: 0;
            box-shadow: 0 0 15px ${rarityConfig.glowColor}60;
        `;
        iconBadge.textContent = achievement.icon;

        // Text content
        const textContent = document.createElement('div');
        textContent.style.cssText = `
            flex: 1;
            min-width: 0;
        `;

        const name = document.createElement('div');
        name.textContent = achievement.name;
        name.style.cssText = `
            font-size: 12px;
            color: #ffffff;
            margin-bottom: 6px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
            word-wrap: break-word;
        `;

        const desc = document.createElement('div');
        desc.textContent = achievement.desc;
        desc.style.cssText = `
            font-size: 9px;
            color: #cccccc;
            line-height: 1.4;
            word-wrap: break-word;
        `;

        const points = document.createElement('div');
        points.textContent = `+${achievement.points} points`;
        points.style.cssText = `
            font-size: 8px;
            color: ${rarityConfig.color};
            margin-top: 6px;
        `;

        textContent.appendChild(name);
        textContent.appendChild(desc);
        textContent.appendChild(points);

        content.appendChild(iconBadge);
        content.appendChild(textContent);

        // Share button
        const shareButton = document.createElement('button');
        shareButton.textContent = 'SHARE';
        shareButton.style.cssText = `
            margin-top: 12px;
            width: 100%;
            padding: 8px;
            background: ${rarityConfig.color}20;
            border: 2px solid ${rarityConfig.color};
            color: ${rarityConfig.color};
            font-family: 'Press Start 2P', 'Courier New', monospace;
            font-size: 8px;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s;
        `;
        shareButton.onmouseover = () => {
            shareButton.style.background = rarityConfig.color;
            shareButton.style.color = '#000000';
        };
        shareButton.onmouseout = () => {
            shareButton.style.background = `${rarityConfig.color}20`;
            shareButton.style.color = rarityConfig.color;
        };
        shareButton.onclick = (e) => {
            e.stopPropagation();
            this.shareAchievement(achievement);
        };

        // Assemble notification
        notification.appendChild(header);
        notification.appendChild(content);
        notification.appendChild(shareButton);

        // Add to container
        this.container.appendChild(notification);
        this.currentNotification = notification;

        // Trigger slide-in animation
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Click to dismiss
        notification.onclick = () => {
            this.hide(false);
            if (onComplete) onComplete();
        };

        // Auto-dismiss after 5 seconds
        this.dismissTimer = setTimeout(() => {
            this.hide(false);
            if (onComplete) onComplete();
        }, 5000);
    }

    /**
     * Hide notification
     */
    hide(immediate = false) {
        if (!this.currentNotification) return;

        clearTimeout(this.dismissTimer);

        if (immediate) {
            this.currentNotification.remove();
            this.currentNotification = null;
            this.isShowing = false;
        } else {
            this.currentNotification.style.transform = 'translateX(450px)';
            setTimeout(() => {
                if (this.currentNotification) {
                    this.currentNotification.remove();
                    this.currentNotification = null;
                }
                this.isShowing = false;
            }, 400);
        }
    }

    /**
     * Share achievement
     */
    shareAchievement(achievement) {
        const shareText = getAchievementShareText(achievement);
        const url = window.location.href;

        // Try native share first (mobile)
        if (navigator.share) {
            navigator.share({
                title: 'VROOM VROOM Achievement',
                text: shareText,
                url: url
            }).catch(err => {
                console.log('[Achievements] Share cancelled or failed:', err);
            });
        } else {
            // Fallback: copy to clipboard
            const fullText = `${shareText}\n\nPlay now: ${url}`;
            navigator.clipboard.writeText(fullText).then(() => {
                // Show copied feedback
                this.showCopiedFeedback();
            }).catch(err => {
                console.error('[Achievements] Failed to copy:', err);
            });
        }
    }

    /**
     * Show "Copied!" feedback
     */
    showCopiedFeedback() {
        const feedback = document.createElement('div');
        feedback.textContent = 'COPIED TO CLIPBOARD!';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4CAF50;
            color: white;
            padding: 16px 32px;
            border-radius: 8px;
            font-family: 'Press Start 2P', 'Courier New', monospace;
            font-size: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
            z-index: 10001;
            animation: fadeInOut 2s ease-in-out;
        `;
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes notificationGlow {
        0%, 100% {
            box-shadow:
                0 8px 24px rgba(0, 0, 0, 0.6),
                0 0 20px var(--glow-color, #FFD700)40,
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        50% {
            box-shadow:
                0 8px 24px rgba(0, 0, 0, 0.6),
                0 0 30px var(--glow-color, #FFD700)60,
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
    }

    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }

    @media (max-width: 768px) {
        .achievement-notification {
            min-width: 280px !important;
            max-width: calc(100vw - 40px) !important;
        }
    }
`;
document.head.appendChild(style);

// Create singleton instance
const AchievementNotification = new AchievementNotificationRenderer();

// Export for use in game
if (typeof window !== 'undefined') {
    window.AchievementNotification = AchievementNotification;
}
