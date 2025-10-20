/**
 * ATMOSPHERIC EFFECTS - PARTICLES AND VISUAL POLISH
 *
 * Vibey atmospheric effects for the dystopian driving scene
 * Dust, pollution, light rays, motion blur, impact effects
 *
 * FEATURES:
 * - Dust particle systems (floating, kicked up by cars)
 * - Pollution/smog layers
 * - Light ray beams (oppressive sunlight)
 * - Motion blur trails
 * - Collision/impact effects
 * - Weather effects (optional: rain, fog)
 * - Screen shake
 *
 * STYLE: Subtle, moody, enhances atmosphere without distraction
 *
 * @version 1.0.0
 * @artist isometric-pixel-artist agent
 * @date 2025-10-19
 */

const AtmosphericEffects = {
    metadata: {
        particle_budget: 200,
        update_rate: 60, // fps
        palette: "disco-elysium-atmosphere"
    },

    // MUTED ATMOSPHERIC PALETTE
    palette: {
        // Dust and particles
        dust_light: "#c8c8c8",
        dust_mid: "#a8a8a8",
        dust_dark: "#8a8a8a",

        // Pollution/smog
        smog_light: "#b8b8b8",
        smog_mid: "#9a9a9a",
        smog_dark: "#7a7a7a",

        // Light effects
        sunray_light: "#ffe8c8",
        sunray_mid: "#ffd8b8",
        sunray_glow: "#ffc8a8",

        // Motion effects
        motion_trail: "#d8d8d8",
        speed_line: "#a8a8a8",

        // Impact/collision
        impact_flash: "#ffffff",
        impact_spark: "#ffd8a8",
        debris_dark: "#4a4a4a",
        debris_light: "#6a6a6a",

        // Weather
        rain_drop: "#8ab8d8",
        fog_layer: "#b8b8c8"
    },

    // ==================== DUST PARTICLES ====================
    dust: {
        // AMBIENT FLOATING DUST
        ambient: {
            name: "Floating Dust Motes",
            count: 80,
            spawn_area: { x: 0, y: 0, width: 800, height: 600 },

            particle: {
                size_range: [1, 3],
                opacity_range: [0.1, 0.3],
                colors: ["dust_light", "dust_mid", "dust_dark"],
                lifetime: Infinity, // Persistent
                fade_in: 0.5,
                fade_out: 0.5
            },

            behavior: {
                velocity: { x: [-0.5, 0.5], y: [-0.2, 0.2] },
                drift: true,
                sway_amplitude: 2,
                sway_frequency: 0.3,
                wind_affected: true
            },

            rendering: {
                blend_mode: "screen",
                glow: false,
                pixel_perfect: true
            }
        },

        // KICKED UP BY CAR WHEELS
        kicked_up: {
            name: "Dust Kicked by Wheels",
            trigger: "car_moving",
            spawn_rate: 10, // particles per second
            spawn_position: "behind_wheels",

            particle: {
                size_range: [2, 6],
                opacity_range: [0.3, 0.6],
                colors: ["dust_mid", "dust_dark"],
                lifetime: 1.5, // seconds
                fade_in: 0.1,
                fade_out: 0.8
            },

            behavior: {
                initial_velocity: { x: [-2, -1], y: [-1, 0.5] },
                acceleration: { x: 0, y: 0.1 }, // Gravity
                drag: 0.95,
                size_decay: 0.98 // Shrinks over time
            },

            rendering: {
                blend_mode: "normal",
                alpha_fade: true
            }
        },

        // DUST CLOUD (when car brakes/skids)
        cloud: {
            name: "Dust Cloud",
            trigger: "car_brake",
            burst_count: 20,

            particle: {
                size_range: [4, 12],
                opacity_range: [0.4, 0.7],
                colors: ["dust_light", "dust_mid"],
                lifetime: 2.0,
                fade_in: 0.2,
                fade_out: 1.0
            },

            behavior: {
                initial_velocity: { x: [-3, 3], y: [-2, 1] },
                spread_angle: 180,
                expansion_rate: 1.2,
                drag: 0.92
            }
        }
    },

    // ==================== POLLUTION / SMOG ====================
    pollution: {
        // BACKGROUND SMOG LAYER
        smog_layer: {
            name: "Atmospheric Smog",
            type: "gradient_layer",
            layer_count: 3,

            layers: [
                {
                    height: { from: 0, to: 200 },
                    opacity: 0.15,
                    color: "smog_light",
                    scroll_speed: 0.1,
                    parallax: 0.3
                },
                {
                    height: { from: 150, to: 400 },
                    opacity: 0.25,
                    color: "smog_mid",
                    scroll_speed: 0.15,
                    parallax: 0.5
                },
                {
                    height: { from: 350, to: 600 },
                    opacity: 0.35,
                    color: "smog_dark",
                    scroll_speed: 0.2,
                    parallax: 0.7
                }
            ],

            animation: {
                wave: true,
                wave_amplitude: 5,
                wave_frequency: 0.05
            }
        },

        // FACTORY SMOKE PLUMES
        smoke_plume: {
            name: "Factory Chimney Smoke",
            source: "factory_smokestack",
            spawn_rate: 5,

            particle: {
                size_range: [8, 24],
                opacity_range: [0.2, 0.5],
                colors: ["smog_mid", "smog_dark"],
                lifetime: 8.0,
                fade_in: 1.0,
                fade_out: 2.0
            },

            behavior: {
                initial_velocity: { x: [0.2, 0.5], y: [-1.5, -1.0] },
                wind_drift: 0.3,
                expansion_rate: 1.05,
                turbulence: 0.2
            }
        }
    },

    // ==================== LIGHT RAYS ====================
    light_rays: {
        // GOD RAYS (oppressive sunlight)
        god_rays: {
            name: "Oppressive Light Beams",
            count: 5,
            time_based: true,

            ray: {
                width_range: [40, 80],
                length: 600,
                opacity_range: [0.1, 0.2],
                color: "sunray_light",
                angle_range: [-60, -30] // From upper left/right
            },

            behavior: {
                static: false,
                sway_amplitude: 3,
                sway_frequency: 0.02,
                fade_with_time: true
            },

            time_of_day: {
                morning: { opacity: 0.25, angle: -60, tint: "sunray_light" },
                noon: { opacity: 0.3, angle: -45, tint: "sunray_mid" },
                afternoon: { opacity: 0.2, angle: -30, tint: "sunray_glow" },
                evening: { opacity: 0.15, angle: -20, tint: "#ff9a6a" },
                night: { opacity: 0, angle: 0, tint: "#000000" }
            },

            rendering: {
                blend_mode: "screen",
                gradient: true,
                gradient_stops: [
                    { position: 0, opacity: 0 },
                    { position: 0.3, opacity: 0.8 },
                    { position: 1.0, opacity: 0 }
                ]
            }
        },

        // STREET LAMP GLOW
        lamp_glow: {
            name: "Street Lamp Aura",
            source: "lamppost",
            active_time: "evening_night",

            glow: {
                radius_range: [60, 80],
                opacity: 0.4,
                color: "#d8c8a8",
                falloff: "exponential"
            },

            rendering: {
                blend_mode: "screen",
                radial_gradient: true,
                flicker: true,
                flicker_intensity: 0.1,
                flicker_speed: 0.3
            }
        }
    },

    // ==================== MOTION EFFECTS ====================
    motion: {
        // MOTION BLUR TRAIL (behind moving cars)
        car_trail: {
            name: "Vehicle Motion Trail",
            trigger: "car_speed > 5",
            fade_length: 5, // frames

            trail: {
                opacity_range: [0.2, 0.05],
                color: "motion_trail",
                sample_rate: 3 // samples per frame
            },

            behavior: {
                decay_rate: 0.85,
                stretch_with_speed: true,
                max_length: 40
            },

            rendering: {
                blend_mode: "multiply",
                blur_amount: 2
            }
        },

        // SPEED LINES (Japanese manga style, subtle)
        speed_lines: {
            name: "Speed Lines",
            trigger: "car_speed > 10",
            count: 15,

            line: {
                length_range: [20, 60],
                width: 2,
                opacity_range: [0.15, 0.3],
                color: "speed_line",
                angle: 180 // Opposite of movement
            },

            behavior: {
                spawn_rate: 30, // per second
                lifetime: 0.3,
                velocity: { x: [-15, -10], y: 0 },
                fade_out: 0.2
            },

            rendering: {
                blend_mode: "multiply",
                horizontal_only: true
            }
        },

        // BACKGROUND PARALLAX BLUR
        parallax_blur: {
            name: "Background Motion Blur",
            layers: ["far_background", "mid_background"],

            effect: {
                blur_amount: { min: 1, max: 3 },
                scales_with_speed: true,
                max_speed_threshold: 15
            }
        }
    },

    // ==================== IMPACT / COLLISION EFFECTS ====================
    impact: {
        // COLLISION FLASH
        collision_flash: {
            name: "Impact Flash",
            trigger: "collision_event",

            flash: {
                size: { width: 64, height: 64 },
                color: "impact_flash",
                opacity: 0.8,
                duration: 0.15,
                fade_out: 0.1
            },

            particles: {
                count: 12,
                type: "spark",
                size_range: [2, 6],
                colors: ["impact_spark", "#ffffff"],
                lifetime: 0.4,
                velocity_range: { x: [-5, 5], y: [-8, -2] }
            }
        },

        // DEBRIS PARTICLES
        debris: {
            name: "Collision Debris",
            trigger: "collision_event",
            burst_count: 20,

            particle: {
                size_range: [2, 8],
                shapes: ["square", "rectangle"],
                colors: ["debris_dark", "debris_light", "#8a5a3a"],
                lifetime: 1.5,
                opacity_range: [0.8, 1.0],
                fade_out: 0.5
            },

            behavior: {
                initial_velocity: { x: [-6, 6], y: [-10, -4] },
                acceleration: { x: 0, y: 9.8 }, // Gravity
                rotation_speed: [-180, 180],
                bounce: 0.4,
                ground_level: 480
            }
        },

        // SCREEN SHAKE
        screen_shake: {
            name: "Camera Shake",
            trigger: "collision_event",

            shake: {
                duration: 0.3,
                intensity: { x: 4, y: 4 },
                frequency: 30,
                decay: "exponential"
            },

            scaling: {
                light_collision: { intensity: 2, duration: 0.2 },
                medium_collision: { intensity: 4, duration: 0.3 },
                heavy_collision: { intensity: 8, duration: 0.5 }
            }
        }
    },

    // ==================== WEATHER EFFECTS (OPTIONAL) ====================
    weather: {
        // RAIN
        rain: {
            name: "Dystopian Rain",
            enabled: false, // Toggle in game settings

            droplet: {
                count: 150,
                size: { width: 2, height: 8 },
                color: "rain_drop",
                opacity: 0.6,
                angle: -75, // Slightly angled
                speed_range: [8, 12]
            },

            behavior: {
                wind_drift: 0.5,
                splash_on_impact: true,
                splash_particle_count: 3,
                splash_lifetime: 0.2
            },

            atmosphere: {
                sky_darkening: 0.3,
                smog_increase: 0.2,
                visibility_reduction: 0.85
            }
        },

        // FOG
        fog: {
            name: "Dense Fog",
            enabled: false,

            layer: {
                opacity: 0.6,
                color: "fog_layer",
                height: { from: 300, to: 600 },
                density: 0.8
            },

            behavior: {
                scroll_speed: 0.05,
                wave_motion: true,
                depth_fade: true
            },

            atmosphere: {
                visibility_range: 400,
                light_scattering: 0.5
            }
        }
    },

    // ==================== PARTICLE SYSTEM MANAGER ====================
    particleSystem: {
        // Global particle pool
        pool: {
            max_particles: 200,
            recycling: true,
            culling: true,
            cull_distance: 1000
        },

        // Update loop
        update(deltaTime) {
            // Update all active particle systems
            // Apply physics, decay, culling
            // (Implementation would go here)
        },

        // Rendering
        render(context, camera) {
            // Render particles in sorted layers
            // Apply blend modes
            // (Implementation would go here)
        },

        // Spawn particle
        spawn(type, position, config) {
            // Create new particle from pool
            // Initialize with config
            // (Implementation would go here)
        }
    },

    // ==================== HELPERS ====================
    helpers: {
        // Interpolate color
        lerpColor(color1, color2, t) {
            // Linear interpolation between two colors
            // (Implementation would go here)
        },

        // Random in range
        random(min, max) {
            return Math.random() * (max - min) + min;
        },

        // Random from array
        randomChoice(array) {
            return array[Math.floor(Math.random() * array.length)];
        },

        // Easing functions
        easing: {
            linear: t => t,
            easeOut: t => 1 - Math.pow(1 - t, 3),
            easeIn: t => Math.pow(t, 3),
            easeInOut: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
        }
    }
};

// Export for game integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AtmosphericEffects;
}
