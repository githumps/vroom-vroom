// VROOM VROOM - Driving Engine (Pursuit + Track)
// A real lane-weaving police-pursuit driver, drawn in Canvas 2D pixel art.
//
// What makes it a game (vs the old "press W, get arrested on a timer"):
//   - Throttle / brake / steer that actually move the car and matter.
//   - A Track of traffic + obstacles you weave through; hitting them costs you.
//   - A Pursuit whose gap you OPEN by driving fast and clean and the police CLOSE
//     with pressure that scales with Heat. Two real outcomes: EVADE or CAUGHT.
//   - Juice: render interpolation (smooth at any refresh), screen shake, exhaust,
//     motion streaks, near-miss feedback.
//
// Public interface (unchanged for game.js):
//   new SidescrollerEngine(canvasId, game)
//   reset(), start(), stop(), update(dt), render(alpha), spawnPolice(),
//   despawnPolice(), resize(), and the readable `playerCar.speed`.
//
// Callbacks game.js may assign (all optional):
//   onCaught(info)      - police reached you / hit a roadblock -> arrest
//   onEvade(info)       - you lost the police -> stay free, heat banked
//   onCrash(info)       - you hit traffic/obstacle (juice + audio hook)
//   onNearMiss(info)    - you threaded a gap (style feedback)
//   onPoliceSpawn()     - sirens start (audio hook)
//   onHeatChange(level) - wanted level (0..5) changed (HUD/audio hook)

class SidescrollerEngine {
    constructor(canvasId = 'gameCanvas', game) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.game = game;

        // Tunables (the "feel" lives here) -------------------------------------
        this.tune = {
            maxSpeed: 240,        // display units (km/h-ish)
            accel: 95,            // units/s while throttling
            brake: 200,           // units/s while braking
            drag: 34,             // units/s coasting
            crashSpeedKeep: 0.42, // speed retained after a crash
            scrollK: 2.6,         // px of world travel per (unit * second)
            steerAccel: 1400,     // px/s^2 vertical steering force
            steerMax: 520,        // px/s max vertical speed
            steerFriction: 8,     // how quickly steering settles
            // Pursuit
            policeBaseSpeed: 150, // police effective speed at heat 0
            heatSpeed: 1.4,       // + police speed per heat point (0..100)
            gapStart: 520,        // px gap when police spawn
            gapCaught: 40,        // px gap that means arrest
            gapEvade: 1600,       // px gap sustained that means escape
            evadeHold: 2.2,       // seconds at >evade gap to lose them
            gapK: 2.4,            // how strongly speed delta moves the gap
            // Heat
            heatRise: 1.3,        // heat/s while police active
            heatRiseIdle: 0.45,   // heat/s before police, just driving dirty
            heatFall: 4.0,        // heat/s recovered right after an evade
            heatPerCrash: 9,      // heat added by a crash
            // Track
            laneCount: 3,
            spawnEveryPx: 520,    // base distance between obstacle spawns
        };

        this.callbacks = {};
        ['onCaught','onEvade','onCrash','onNearMiss','onPoliceSpawn','onHeatChange']
            .forEach(k => { this[k] = null; });

        this.resize(true);

        // Parallax skyline
        this.buildings = [];
        this._buildSkyline();

        this.particles = [];
        this.streaks = [];   // motion streaks
        this.floaters = [];  // floating "NEAR MISS!" text

        this.running = false;
        this.outcomeFired = false;
        this.animationTime = 0;

        this._initState();
        console.log('[DrivingEngine] ready - lane-weaving pursuit driver');
    }

    // === GEOMETRY =========================================================
    resize(initial = false) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Road band occupies the lower ~42% of the screen.
        this.road = {
            top: this.height * 0.58,
            bottom: this.height * 0.92,
        };
        this.road.height = this.road.bottom - this.road.top;
        this.playerScreenX = this.width * 0.26;
        if (!initial && this.playerCar) {
            this.playerCar.y = this._laneY(this.playerCar.lane);
        }
    }

    _laneY(laneFrac) {
        // laneFrac in [0,1] across the road band; keep car fully on the road.
        const margin = 26;
        return this.road.top + margin + laneFrac * (this.road.height - margin * 2);
    }

    _buildSkyline() {
        this.buildings = [];
        // 3 parallax layers, far -> near
        const layers = [
            { count: 14, speed: 0.15, hue: '#3c4a5e', min: 70,  max: 150 },
            { count: 12, speed: 0.32, hue: '#33404f', min: 110, max: 240 },
            { count: 10, speed: 0.55, hue: '#2a3340', min: 160, max: 320 },
        ];
        layers.forEach((L, li) => {
            for (let i = 0; i < L.count; i++) {
                this.buildings.push({
                    layer: li,
                    speed: L.speed,
                    color: L.hue,
                    x: Math.random() * this.width * 2.2,
                    w: 40 + Math.random() * 70,
                    h: L.min + Math.random() * (L.max - L.min),
                });
            }
        });
    }

    // === STATE ============================================================
    _initState() {
        this.playerCar = {
            lane: 0.5,            // 0..1 across the band
            y: this._laneY(0.5),
            prevY: this._laneY(0.5),
            steerVel: 0,
            worldX: 0,
            prevWorldX: 0,
            speed: 0,
            width: 64,
            height: 30,
            tilt: 0,
            stun: 0,              // seconds of reduced control after a crash
            color: '#c43a3a',
        };
        this.police = {
            active: false,
            gap: this.tune.gapStart,  // px behind the player
            prevGap: this.tune.gapStart,
            flash: 0,
            evadeTimer: 0,
        };
        this.heat = 0;            // 0..100
        this.wantedLevel = 0;
        this.distance = 0;        // px traveled this run
        this.obstacles = [];
        this.nextSpawnAt = this.tune.spawnEveryPx;
        this.spawnTimer = 0;
        this.policeSpawnAt = 6 + Math.random() * 6; // seconds until first patrol
        this.flashOverlay = 0;    // white flash on crash
    }

    reset() {
        this._initState();
        this.particles = [];
        this.streaks = [];
        this.floaters = [];
        this.outcomeFired = false;
        this.animationTime = 0;
        this._buildSkyline();
    }

    start() { this.running = true; }
    stop() { this.running = false; }

    _fire(name, info) {
        const cb = this[name] || this.callbacks[name];
        if (typeof cb === 'function') cb(info);
    }

    // === INPUT ============================================================
    _input() {
        const k = (this.game && this.game.keys) || {};
        return {
            throttle: !!(k['w'] || k['arrowup']),
            brake: !!(k['s'] || k['arrowdown']),
            steerUp: !!(k['a'] || k['arrowleft']),
            steerDown: !!(k['d'] || k['arrowright']),
        };
    }

    // === UPDATE (fixed dt) ================================================
    update(dt) {
        if (!this.running) return;
        this.animationTime += dt;

        const p = this.playerCar;
        p.prevWorldX = p.worldX;
        p.prevY = p.y;
        this.police.prevGap = this.police.gap;

        const inp = this._input();
        if (p.stun > 0) p.stun = Math.max(0, p.stun - dt);
        const control = p.stun > 0 ? 0.25 : 1;

        // Longitudinal speed
        const T = this.tune;
        if (inp.throttle) p.speed += T.accel * dt * control;
        else if (inp.brake) p.speed -= T.brake * dt;
        else p.speed -= T.drag * dt;
        p.speed = Math.max(0, Math.min(T.maxSpeed, p.speed));

        // Distance / world scroll
        const travel = p.speed * T.scrollK * dt;
        p.worldX += travel;
        this.distance += travel;

        // Steering (continuous, with friction settling)
        let steerInput = 0;
        if (inp.steerUp) steerInput -= 1;
        if (inp.steerDown) steerInput += 1;
        p.steerVel += steerInput * T.steerAccel * dt * control;
        p.steerVel *= Math.max(0, 1 - T.steerFriction * dt);
        p.steerVel = Math.max(-T.steerMax, Math.min(T.steerMax, p.steerVel));
        p.y += p.steerVel * dt;
        // Clamp to road band
        const topY = this._laneY(0), botY = this._laneY(1);
        if (p.y < topY) { p.y = topY; p.steerVel = 0; }
        if (p.y > botY) { p.y = botY; p.steerVel = 0; }
        p.lane = (p.y - topY) / (botY - topY);
        // Visual tilt from steering + speed
        const targetTilt = (p.steerVel / T.steerMax) * 0.18;
        p.tilt += (targetTilt - p.tilt) * Math.min(1, 12 * dt);

        // Exhaust when throttling
        if (inp.throttle && Math.random() < 0.6) {
            this._spawnParticle(this.playerScreenX - 30, p.y + 8, 'exhaust');
        }
        // Tire smoke when braking hard at speed
        if (inp.brake && p.speed > 60 && Math.random() < 0.7) {
            this._spawnParticle(this.playerScreenX - 18, p.y + 12, 'smoke');
        }

        this._updateHeat(dt, inp);
        this._updateTrack(dt, travel);
        this._updatePursuit(dt);
        this._updateParticles(dt);

        if (this.flashOverlay > 0) this.flashOverlay = Math.max(0, this.flashOverlay - dt * 3);
    }

    _updateHeat(dt, inp) {
        const T = this.tune;
        const before = this.wantedLevel;
        if (this.police.active) {
            this.heat += T.heatRise * dt;
        } else {
            this.heat += T.heatRiseIdle * dt;
            // First patrol appears on a heat/time trigger
            if (this.animationTime > this.policeSpawnAt) this.spawnPolice();
        }
        this.heat = Math.max(0, Math.min(100, this.heat));
        this.wantedLevel = Math.min(5, Math.floor(this.heat / 20) + (this.police.active ? 1 : 0));
        this.wantedLevel = Math.min(5, this.wantedLevel);
        if (this.wantedLevel !== before) this._fire('onHeatChange', this.wantedLevel);
    }

    _updatePursuit(dt) {
        const pol = this.police;
        if (!pol.active) return;
        const T = this.tune;

        // Police effective speed scales with heat. If you're faster, the gap opens.
        const policeSpeed = T.policeBaseSpeed + this.heat * T.heatSpeed;
        const delta = this.playerCar.speed - policeSpeed; // +ve = pulling away
        pol.gap += delta * T.gapK * dt;
        pol.gap = Math.max(0, pol.gap);

        // Light bar flash
        pol.flash += dt;

        // Outcomes
        if (pol.gap <= T.gapCaught) {
            this._caught('chase');
            return;
        }
        if (pol.gap >= T.gapEvade) {
            pol.evadeTimer += dt;
            if (pol.evadeTimer >= T.evadeHold) this._evade();
        } else {
            pol.evadeTimer = 0;
        }
    }

    // === TRACK (traffic + obstacles) ======================================
    _updateTrack(dt, travel) {
        const T = this.tune;
        // Spawn on distance, denser at higher heat.
        this.spawnTimer += travel;
        const interval = T.spawnEveryPx * (this.police.active ? 0.7 : 1) * (1 - Math.min(0.4, this.heat / 250));
        if (this.spawnTimer >= interval) {
            this.spawnTimer = 0;
            this._spawnObstacle();
        }

        const px = this.playerScreenX;
        const p = this.playerCar;
        for (const o of this.obstacles) {
            // Obstacles sit in world space; their screen X = own worldX - player worldX + playerScreenX
            o.screenX = px + (o.worldX - p.worldX);
            if (!o.passed && o.screenX < px - 60) {
                o.passed = true;
                // Near miss if we slipped by close without colliding
                const dy = Math.abs(o.y - p.y);
                if (!o.hit && dy < (p.height / 2 + o.h / 2) + 26) {
                    this._fire('onNearMiss', { distance: dy });
                    this._floater('NEAR MISS!', px, p.y - 40, '#ffd34a');
                    this.heat = Math.max(0, this.heat - 1.5);
                }
            }
            // Collision test (only near the player column)
            if (!o.hit && Math.abs(o.screenX - px) < (p.width / 2 + o.w / 2) &&
                Math.abs(o.y - p.y) < (p.height / 2 + o.h / 2)) {
                o.hit = true;
                this._collide(o);
            }
        }
        // Cull off-screen-left
        this.obstacles = this.obstacles.filter(o => o.screenX > -120);
    }

    _spawnObstacle() {
        const T = this.tune;
        const lane = Math.floor(Math.random() * T.laneCount);
        const laneFrac = T.laneCount === 1 ? 0.5 : lane / (T.laneCount - 1);
        const y = this._laneY(laneFrac);
        // Roadblocks only at high heat; they are the "instant caught" hazard.
        let type = 'traffic';
        const r = Math.random();
        if (this.heat > 60 && r < 0.12) type = 'roadblock';
        else if (r < 0.30) type = 'cone';
        else if (r < 0.45) type = 'oil';
        const sizes = {
            traffic:   { w: 60, h: 28, color: '#5b6e7d' },
            cone:      { w: 18, h: 22, color: '#e08a2c' },
            oil:       { w: 46, h: 14, color: '#23232a' },
            roadblock: { w: 30, h: 60, color: '#c0392b' },
        };
        const s = sizes[type];
        this.obstacles.push({
            type, y, worldX: this.playerCar.worldX + this.width + 120,
            screenX: this.width + 120, w: s.w, h: s.h, color: s.color,
            hit: false, passed: false,
        });
    }

    _collide(o) {
        const p = this.playerCar;
        if (o.type === 'roadblock') {
            this.flashOverlay = 1;
            this.screenShake(18, 0.5);
            this._fire('onCrash', { type: 'roadblock' });
            this._caught('roadblock');
            return;
        }
        if (o.type === 'oil') {
            // Spin out: lose steering, mild slow
            p.stun = Math.max(p.stun, 0.9);
            p.steerVel = (Math.random() < 0.5 ? -1 : 1) * this.tune.steerMax;
            p.speed *= 0.8;
            this._fire('onCrash', { type: 'oil' });
            this._floater('SPIN OUT!', this.playerScreenX, p.y - 40, '#9ad');
        } else {
            // Traffic / cone: hard crash
            p.speed *= this.tune.crashSpeedKeep;
            p.stun = Math.max(p.stun, 0.6);
            this.heat = Math.min(100, this.heat + this.tune.heatPerCrash);
            this.flashOverlay = 0.6;
            this.screenShake(7, 0.22);
            for (let i = 0; i < 10; i++) this._spawnParticle(this.playerScreenX, p.y, 'debris');
            this._fire('onCrash', { type: o.type });
            // Police close in when you crash
            if (this.police.active) this.police.gap = Math.max(this.tune.gapCaught + 30, this.police.gap - 140);
        }
    }

    // === OUTCOMES =========================================================
    _caught(reason) {
        if (this.outcomeFired) return;
        this.outcomeFired = true;
        this.stop();
        this.screenShake(16, 0.6);
        const info = { reason, distance: Math.floor(this.distance), heat: this.wantedLevel, speed: Math.floor(this.playerCar.speed) };
        // Fall back to the legacy pullOver if no explicit handler is wired.
        if (this.onCaught) this.onCaught(info);
        else if (this.game && this.game.pullOver) setTimeout(() => this.game.pullOver(), 500);
    }

    _evade() {
        if (this.outcomeFired) return;
        this.outcomeFired = true;
        this.heat = Math.max(0, this.heat - 30);
        this.police.active = false;
        const info = { distance: Math.floor(this.distance), heat: this.wantedLevel };
        this._floater('LOST THEM!', this.width * 0.5, this.height * 0.4, '#5fd38a');
        if (this.onEvade) this.onEvade(info);
        // If no handler, just keep driving (reopen the patrol timer).
        else { this.outcomeFired = false; this.policeSpawnAt = this.animationTime + 8 + Math.random() * 6; }
    }

    spawnPolice() {
        if (this.police.active) return;
        this.police.active = true;
        this.police.gap = this.tune.gapStart;
        this.police.evadeTimer = 0;
        this.police.flash = 0;
        this._fire('onPoliceSpawn');
    }

    despawnPolice() { this.police.active = false; }

    screenShake(intensity = 6, duration = 0.25) {
        this._shake = { intensity, duration, t: duration };
    }

    // === PARTICLES / FLOATERS ============================================
    _spawnParticle(x, y, type) {
        const defs = {
            exhaust: { vx: -60 - Math.random() * 40, vy: -10 + Math.random() * 20, life: 0.5, size: 4, color: '#6a6a72' },
            smoke:   { vx: -40 - Math.random() * 30, vy: -20 - Math.random() * 20, life: 0.8, size: 6, color: '#8a8a90' },
            debris:  { vx: -120 - Math.random() * 120, vy: -120 + Math.random() * 240, life: 0.6, size: 4, color: '#caa24a' },
            dust:    { vx: -80 - Math.random() * 40, vy: -Math.random() * 30, life: 0.5, size: 3, color: '#8a7a6a' },
        }[type];
        this.particles.push({ x, y, vx: defs.vx, vy: defs.vy, life: defs.life, maxLife: defs.life, size: defs.size, color: defs.color });
    }

    _floater(text, x, y, color) {
        this.floaters.push({ text, x, y, vy: -40, life: 1.1, maxLife: 1.1, color });
    }

    _updateParticles(dt) {
        for (const p of this.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 120 * dt; p.life -= dt; }
        this.particles = this.particles.filter(p => p.life > 0);
        for (const f of this.floaters) { f.y += f.vy * dt; f.life -= dt; }
        this.floaters = this.floaters.filter(f => f.life > 0);
        if (this._shake) { this._shake.t -= dt; if (this._shake.t <= 0) this._shake = null; }
    }

    // === RENDER (with interpolation alpha) ================================
    render(alpha = 1) {
        const ctx = this.ctx, W = this.width, H = this.height;
        const p = this.playerCar;
        // Interpolated values for buttery scroll
        const viewWorldX = p.prevWorldX + (p.worldX - p.prevWorldX) * alpha;
        const playerY = p.prevY + (p.y - p.prevY) * alpha;
        const polGap = this.police.prevGap + (this.police.gap - this.police.prevGap) * alpha;

        // Sky gradient (dusk dystopia)
        const sky = ctx.createLinearGradient(0, 0, 0, this.road.top);
        sky.addColorStop(0, '#26344a');
        sky.addColorStop(1, '#c98a6a');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, this.road.top);

        ctx.save();
        // Event-driven shake only (crashes / arrest). No constant ambient jitter -
        // speed is conveyed by motion streaks, not by shaking the whole frame.
        if (this._shake) {
            const m = this._shake.intensity * (this._shake.t / this._shake.duration);
            ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
        }
        const sp = p.speed / this.tune.maxSpeed;

        this._renderSkyline(viewWorldX);
        this._renderRoad(viewWorldX, sp);
        this._renderObstacles(viewWorldX);
        if (this.police.active) this._renderPolice(polGap, playerY);
        this._renderPlayer(playerY);
        this._renderParticles();
        this._renderStreaks(sp);
        this._renderFloaters();
        ctx.restore();

        this._renderHud(polGap);

        if (this.flashOverlay > 0) {
            ctx.fillStyle = `rgba(255,255,255,${this.flashOverlay * 0.6})`;
            ctx.fillRect(0, 0, W, H);
        }
    }

    _renderSkyline(viewWorldX) {
        const ctx = this.ctx;
        for (const b of this.buildings) {
            let x = (b.x - viewWorldX * b.speed) % (this.width * 2.2);
            if (x < -b.w) x += this.width * 2.2;
            const baseY = this.road.top;
            ctx.fillStyle = b.color;
            ctx.fillRect(x, baseY - b.h, b.w, b.h);
            // lit windows
            ctx.fillStyle = 'rgba(255,210,120,0.15)';
            for (let wy = baseY - b.h + 8; wy < baseY - 6; wy += 14) {
                for (let wx = x + 6; wx < x + b.w - 6; wx += 12) {
                    if ((wx + wy) % 3 === 0) ctx.fillRect(wx, wy, 5, 7);
                }
            }
        }
    }

    _renderRoad(viewWorldX, sp) {
        const ctx = this.ctx, W = this.width;
        // Asphalt
        ctx.fillStyle = '#2c2c32';
        ctx.fillRect(0, this.road.top, W, this.height - this.road.top);
        // Shoulder lines
        ctx.fillStyle = '#5a5a44';
        ctx.fillRect(0, this.road.top - 3, W, 3);
        ctx.fillRect(0, this.road.bottom, W, 3);
        // Lane dashes scrolling with the world
        ctx.strokeStyle = 'rgba(220,210,140,0.7)';
        ctx.lineWidth = 3;
        const dash = 40, gap = 34;
        const offset = (viewWorldX * 0.6) % (dash + gap);
        for (let lane = 1; lane < this.tune.laneCount; lane++) {
            const ly = this._laneY(lane / this.tune.laneCount);
            ctx.beginPath();
            for (let x = -offset; x < W; x += dash + gap) {
                ctx.moveTo(x, ly); ctx.lineTo(x + dash, ly);
            }
            ctx.stroke();
        }
    }

    _renderCarShape(x, y, w, h, color, tilt, isPolice) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(tilt || 0);
        // shadow
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath(); ctx.ellipse(0, h / 2 + 6, w / 2, 6, 0, 0, Math.PI * 2); ctx.fill();
        // body
        ctx.fillStyle = color;
        this._roundRect(-w / 2, -h / 2, w, h, 6); ctx.fill();
        // cabin
        ctx.fillStyle = this._shade(color, 0.8);
        this._roundRect(-w * 0.18, -h / 2 - 10, w * 0.5, 12, 4); ctx.fill();
        // windows
        ctx.fillStyle = '#1c2530';
        ctx.fillRect(-w * 0.12, -h / 2 - 8, w * 0.18, 9);
        ctx.fillRect(w * 0.10, -h / 2 - 8, w * 0.16, 9);
        // wheels
        ctx.fillStyle = '#15151a';
        ctx.fillRect(-w / 2 + 6, h / 2 - 3, 14, 8);
        ctx.fillRect(w / 2 - 20, h / 2 - 3, 14, 8);
        // headlight
        ctx.fillStyle = '#ffe9a8';
        ctx.fillRect(w / 2 - 4, -4, 4, 8);
        if (isPolice) {
            const red = this.police.flash % 0.4 < 0.2;
            ctx.fillStyle = red ? '#ff2a2a' : '#3a3a55';
            ctx.fillRect(-8, -h / 2 - 16, 7, 5);
            ctx.fillStyle = red ? '#2a2a55' : '#2a6aff';
            ctx.fillRect(1, -h / 2 - 16, 7, 5);
            if (red) { ctx.fillStyle = 'rgba(255,40,40,0.25)'; ctx.fillRect(-30, -h, 60, h * 2); }
        }
        ctx.restore();
    }

    _renderPlayer(playerY) {
        const p = this.playerCar;
        this._renderCarShape(this.playerScreenX, playerY, p.width, p.height, this._playerColor(), p.tilt, false);
    }

    _playerColor() {
        const sc = this.game.player && this.game.player.selectedCar;
        if (sc) {
            if (typeof sc.colorHex === 'string') return sc.colorHex;
            if (typeof sc.color === 'number') return '#' + sc.color.toString(16).padStart(6, '0');
            if (typeof sc.color === 'string') return sc.color;
        }
        return this.playerCar.color;
    }

    _renderPolice(polGap, playerY) {
        const x = this.playerScreenX - polGap;
        // keep it visible even when far back
        const drawX = Math.max(-40, x);
        this._renderCarShape(drawX, playerY + Math.sin(this.animationTime * 4) * 4, 64, 30, '#2f3a6a', 0, true);
    }

    _renderObstacles(viewWorldX) {
        const ctx = this.ctx;
        for (const o of this.obstacles) {
            const x = this.playerScreenX + (o.worldX - this.playerCar.worldX);
            if (x < -120 || x > this.width + 120) continue;
            ctx.save(); ctx.translate(x, o.y);
            if (o.type === 'traffic') {
                this._renderCarShape(0, 0, o.w, o.h, o.color, 0, false);
            } else if (o.type === 'cone') {
                ctx.fillStyle = '#e08a2c'; ctx.beginPath();
                ctx.moveTo(0, -o.h / 2); ctx.lineTo(o.w / 2, o.h / 2); ctx.lineTo(-o.w / 2, o.h / 2); ctx.closePath(); ctx.fill();
                ctx.fillStyle = '#fff'; ctx.fillRect(-o.w / 3, 0, o.w * 0.66, 4);
            } else if (o.type === 'oil') {
                ctx.fillStyle = 'rgba(20,20,26,0.85)'; ctx.beginPath();
                ctx.ellipse(0, 0, o.w / 2, o.h / 2, 0, 0, Math.PI * 2); ctx.fill();
            } else if (o.type === 'roadblock') {
                ctx.fillStyle = '#c0392b'; ctx.fillRect(-o.w / 2, -o.h / 2, o.w, o.h);
                ctx.fillStyle = '#fff';
                for (let i = -o.h / 2; i < o.h / 2; i += 16) ctx.fillRect(-o.w / 2, i, o.w, 8);
            }
            ctx.restore();
        }
    }

    _renderParticles() {
        const ctx = this.ctx;
        for (const p of this.particles) {
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
    }

    _renderStreaks(sp) {
        if (sp < 0.55) return;
        const ctx = this.ctx;
        ctx.strokeStyle = `rgba(255,255,255,${(sp - 0.55) * 0.4})`;
        ctx.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
            const y = this.road.top - 60 + Math.random() * (this.height - this.road.top + 40);
            const len = 40 + sp * 120;
            const x = Math.random() * this.width;
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - len, y); ctx.stroke();
        }
    }

    _renderFloaters() {
        const ctx = this.ctx;
        ctx.textAlign = 'center';
        ctx.font = 'bold 22px monospace';
        for (const f of this.floaters) {
            ctx.globalAlpha = Math.max(0, f.life / f.maxLife);
            ctx.fillStyle = f.color;
            ctx.fillText(f.text, f.x, f.y);
        }
        ctx.globalAlpha = 1;
        ctx.textAlign = 'left';
    }

    _renderHud(polGap) {
        const ctx = this.ctx, W = this.width;
        // Pursuit pressure bar (only while chased)
        if (this.police.active) {
            const frac = 1 - Math.min(1, polGap / this.tune.gapStart); // 1 = about to be caught
            const bw = 220, bx = W / 2 - bw / 2, by = 18;
            ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(bx - 2, by - 2, bw + 4, 14);
            ctx.fillStyle = frac > 0.7 ? '#ff3a3a' : '#ffb33a';
            ctx.fillRect(bx, by, bw * frac, 10);
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, 10);
            ctx.fillStyle = '#fff'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
            ctx.fillText(frac > 0.7 ? 'THEY ARE ON YOU' : 'POLICE PURSUIT', W / 2, by + 26);
            ctx.textAlign = 'left';
        }
    }

    // === small canvas helpers ============================================
    _roundRect(x, y, w, h, r) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }
    _shade(hex, f) {
        if (typeof hex !== 'string' || hex[0] !== '#') return hex;
        const n = parseInt(hex.slice(1), 16);
        const r = Math.floor(((n >> 16) & 255) * f);
        const g = Math.floor(((n >> 8) & 255) * f);
        const b = Math.floor((n & 255) * f);
        return `rgb(${r},${g},${b})`;
    }

    // Back-compat for game.js HUD which reads engine speed directly.
    get speedKmh() { return Math.floor(this.playerCar.speed); }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SidescrollerEngine;
}
