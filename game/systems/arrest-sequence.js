// VROOM VROOM - Arrest Sequence
// The cinematic beat between "caught while driving" and the courtroom:
//   busted -> angry cop at the window -> cuffs -> back-seat ride ->
//   jail intake (booking + absurd form) -> a deeply unhelpful public defender.
//
// Self-contained: builds its own full-screen overlay (canvas + dialogue box),
// runs a data-driven list of BEATS, and calls onComplete() at the end. It does
// not touch the god class beyond the handle game.js passes in.
//
// Interface:
//   const seq = new ArrestSequence(game);
//   seq.play(info, onComplete);   // info = { reason, distance, heat, speed }

class ArrestSequence {
    constructor(game) {
        this.game = game;
        this.root = null;
        this.canvas = null;
        this.ctx = null;
        this.beats = [];
        this.beatIndex = 0;
        this.line = 0;
        this.typed = '';
        this.typeTimer = null;
        this.rafId = null;
        this.t = 0;
        this.onComplete = null;
    }

    play(info = {}, onComplete = null) {
        this.info = info;
        this.onComplete = onComplete;
        this.beats = this._buildBeats(info);
        this.beatIndex = 0;
        this._buildDom();
        this._startLoop();
        this._enterBeat();
    }

    // === BEATS (the script) ==============================================
    _buildBeats(info) {
        const speedTxt = `${Math.floor(info.speed || 0)} km/h`;
        return [
            {
                id: 'busted', scene: 'street', speaker: 'NARRATOR', shake: true,
                lines: [
                    'Tires scream. The world stops.',
                    `You were doing ${speedTxt}. In a car. On a road.`,
                    'There is no greater crime.',
                ],
            },
            {
                id: 'cop', scene: 'cop_window', speaker: 'OFFICER KOWALSKI',
                lines: [
                    'LICENSE. REGISTRATION. CONFESSION.',
                    "Do you have ANY idea how fast you were existing?",
                    "Step out of the vehicle. Slowly. Bureaucratically.",
                ],
            },
            {
                id: 'cuffs', scene: 'cuffs', speaker: 'OFFICER KOWALSKI', shake: true,
                lines: [
                    '*CLICK*  *CLICK*',
                    'You have the right to remain compliant.',
                    'Anything you say will be filed in triplicate.',
                ],
            },
            {
                id: 'backseat', scene: 'backseat', speaker: 'OFFICER KOWALSKI',
                lines: [
                    'Mind the upholstery. It is the only thing we respect here.',
                    "Twelve years on the force. I've seen joggers. I've seen cyclists.",
                    'But a DRIVER? In MY city? You make me sick.',
                    'We are going somewhere you can think about what you did.',
                ],
            },
            {
                id: 'intake', scene: 'intake', speaker: 'INTAKE CLERK', isForm: true,
                lines: [
                    'Welcome to Intake. Fill this out. Or don\'t. It changes nothing.',
                ],
            },
            {
                id: 'defender', scene: 'defender', speaker: 'PUBLIC DEFENDER (DALE)',
                lines: [
                    'Hi! Dale. Public defender. This is my first day. Or my last. Unclear.',
                    "I read your file on the way in. Well, I read A file. On the way in.",
                    "Our strategy? We plead... let me check... 'extremely guilty'? That can't be right.",
                    "Don't worry. I have a great feeling about Judge Hardcastle. We golf. Badly.",
                    'Just nod a lot. Juries love a nodder. There is no jury. Nod anyway.',
                ],
            },
        ];
    }

    // === DOM =============================================================
    _buildDom() {
        const existing = document.getElementById('arrestSequenceScreen');
        if (existing) existing.remove();

        const root = document.createElement('div');
        root.id = 'arrestSequenceScreen';
        root.style.cssText = [
            'position:fixed', 'inset:0', 'z-index:9000', 'background:#05050a',
            'display:flex', 'flex-direction:column', 'cursor:pointer',
        ].join(';');

        const canvas = document.createElement('canvas');
        canvas.id = 'arrestCanvas';
        canvas.style.cssText = 'flex:1;width:100%;display:block;image-rendering:pixelated;';
        root.appendChild(canvas);

        // Dialogue box
        const box = document.createElement('div');
        box.id = 'arrestDialogue';
        box.style.cssText = [
            'position:absolute', 'left:5%', 'right:5%', 'bottom:6%',
            'background:rgba(8,10,18,0.92)', 'border:3px solid #0f0',
            'box-shadow:0 0 24px rgba(0,255,0,0.25)', 'padding:18px 22px',
            'font-family:"Courier New",monospace', 'color:#d6ffd6', 'min-height:90px',
        ].join(';');
        box.innerHTML = `
            <div id="arrestSpeaker" style="color:#ffd34a;font-weight:bold;letter-spacing:1px;margin-bottom:8px;"></div>
            <div id="arrestText" style="font-size:1.15em;line-height:1.5;min-height:48px;"></div>
            <div id="arrestPrompt" style="text-align:right;color:#7aff7a;margin-top:8px;opacity:0.8;">click / tap to continue &#9654;</div>
            <div id="arrestForm" style="display:none;margin-top:6px;"></div>`;
        root.appendChild(box);

        (document.getElementById('ui') || document.body).appendChild(root);

        this.root = root;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this._resize();
        this._onResize = () => this._resize();
        window.addEventListener('resize', this._onResize);

        this._onClick = () => this._advance();
        root.addEventListener('click', this._onClick);
    }

    _resize() {
        if (!this.canvas) return;
        this.canvas.width = this.root.clientWidth;
        this.canvas.height = this.root.clientHeight;
    }

    // === BEAT FLOW =======================================================
    _enterBeat() {
        const beat = this.beats[this.beatIndex];
        if (!beat) return this._finish();
        this.line = 0;
        document.getElementById('arrestSpeaker').textContent = beat.speaker;
        const form = document.getElementById('arrestForm');
        form.style.display = 'none';
        form.innerHTML = '';
        if (beat.shake) this._shake = 0.6;
        this._typeLine(beat.lines[0]);
    }

    _advance() {
        const beat = this.beats[this.beatIndex];
        if (!beat) return;
        // If still typing, fast-forward to full line.
        if (this.typed.length < (beat.lines[this.line] || '').length) {
            clearInterval(this.typeTimer);
            this.typed = beat.lines[this.line];
            this._renderText();
            return;
        }
        // Next line in this beat?
        if (this.line < beat.lines.length - 1) {
            this.line++;
            this._typeLine(beat.lines[this.line]);
            return;
        }
        // Beat finished. If it's the intake form, show it and wait for submit.
        if (beat.isForm && !beat._formShown) {
            beat._formShown = true;
            this._showIntakeForm();
            return;
        }
        // Next beat.
        this.beatIndex++;
        if (this.beatIndex >= this.beats.length) return this._finish();
        this._enterBeat();
    }

    _typeLine(text) {
        clearInterval(this.typeTimer);
        this.typed = '';
        const full = text || '';
        let i = 0;
        document.getElementById('arrestPrompt').style.visibility = 'hidden';
        this.typeTimer = setInterval(() => {
            this.typed = full.slice(0, ++i);
            this._renderText();
            if (i >= full.length) {
                clearInterval(this.typeTimer);
                document.getElementById('arrestPrompt').style.visibility = 'visible';
            }
        }, 22);
    }

    _renderText() {
        const el = document.getElementById('arrestText');
        if (el) el.textContent = this.typed;
    }

    // The intake form: absurd, pointless, mandatory.
    _showIntakeForm() {
        const form = document.getElementById('arrestForm');
        document.getElementById('arrestPrompt').style.visibility = 'hidden';
        form.style.display = 'block';
        form.innerHTML = `
            <div style="display:grid;gap:8px;">
              <label style="color:#9aff9a;">Form 7Q-Driver: Why did you possess legs near a vehicle?</label>
              <select id="intakeQ1" style="padding:8px;background:#0a0a12;color:#d6ffd6;border:2px solid #0f0;">
                <option>I panicked and commuted</option>
                <option>The bus is also illegal now</option>
                <option>I wished to feel the wind of crime</option>
                <option>No comment (counts as confession)</option>
              </select>
              <label style="color:#9aff9a;">Initial here to waive rights you never had:</label>
              <input id="intakeQ2" maxlength="3" placeholder="XYZ" style="padding:8px;width:90px;background:#0a0a12;color:#d6ffd6;border:2px solid #0f0;text-transform:uppercase;">
              <button id="intakeSubmit" style="margin-top:6px;padding:10px 18px;background:#0f0;color:#000;border:none;font-weight:bold;cursor:pointer;">SUBMIT (MANDATORY)</button>
            </div>`;
        const submit = document.getElementById('intakeSubmit');
        submit.addEventListener('click', (e) => {
            e.stopPropagation();
            form.style.display = 'none';
            // It changes nothing, as promised. Advance to the next beat.
            this.beatIndex++;
            if (this.beatIndex >= this.beats.length) return this._finish();
            this._enterBeat();
        });
    }

    // === RENDER LOOP =====================================================
    _startLoop() {
        const loop = () => {
            this.rafId = requestAnimationFrame(loop);
            this.t += 0.016;
            if (this._shake > 0) this._shake = Math.max(0, this._shake - 0.016);
            this._draw();
        };
        loop();
    }

    _draw() {
        const ctx = this.ctx; if (!ctx) return;
        const W = this.canvas.width, H = this.canvas.height;
        const beat = this.beats[this.beatIndex] || {};
        ctx.save();
        if (this._shake > 0) {
            const m = this._shake * 16;
            ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
        }
        const drawer = this['_scene_' + (beat.scene || 'street')];
        if (drawer) drawer.call(this, ctx, W, H); else this._scene_street(ctx, W, H);
        ctx.restore();
    }

    // === SCENES (pixel-art, drawn) =======================================
    _bg(ctx, W, H, top, bottom) {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, top); g.addColorStop(1, bottom);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    _redBlue(ctx, W, H) {
        const on = (this.t % 0.6) < 0.3;
        ctx.fillStyle = on ? 'rgba(255,40,40,0.18)' : 'rgba(40,80,255,0.18)';
        ctx.fillRect(0, 0, W, H);
    }

    _scene_street(ctx, W, H) {
        this._bg(ctx, W, H, '#1a2238', '#b5704a');
        this._redBlue(ctx, W, H);
        // road
        ctx.fillStyle = '#26262c'; ctx.fillRect(0, H * 0.7, W, H * 0.3);
        // skid marks
        ctx.strokeStyle = '#111'; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(W * 0.3, H * 0.85); ctx.lineTo(W * 0.55, H * 0.8); ctx.stroke();
        // stopped car
        this._car(ctx, W * 0.6, H * 0.78, this._playerColor(), 1.6);
        // big BUSTED stamp
        ctx.save(); ctx.translate(W / 2, H * 0.32); ctx.rotate(-0.12);
        ctx.font = `bold ${Math.floor(W * 0.09)}px monospace`; ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,40,40,0.9)'; ctx.fillText('BUSTED', 0, 0);
        ctx.restore();
    }

    _scene_cop_window(ctx, W, H) {
        this._bg(ctx, W, H, '#101622', '#2a3247');
        this._redBlue(ctx, W, H);
        // car interior frame
        ctx.fillStyle = '#0a0a10'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#1a2030'; ctx.fillRect(W * 0.08, H * 0.08, W * 0.84, H * 0.78);
        // angry cop leaning in
        const cx = W * 0.5, cy = H * 0.5;
        this._cop(ctx, cx, cy, 2.2, true);
    }

    _scene_cuffs(ctx, W, H) {
        this._bg(ctx, W, H, '#05060a', '#161a26');
        this._redBlue(ctx, W, H);
        // two wrists + cuffs, centered
        const cx = W / 2, cy = H * 0.55, s = Math.min(W, H) * 0.0016;
        ctx.lineWidth = 14 * s; ctx.strokeStyle = '#c9ccd6';
        ctx.beginPath(); ctx.arc(cx - 70 * s, cy, 40 * s, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + 70 * s, cy, 40 * s, 0, Math.PI * 2); ctx.stroke();
        ctx.lineWidth = 10 * s; ctx.beginPath(); ctx.moveTo(cx - 30 * s, cy); ctx.lineTo(cx + 30 * s, cy); ctx.stroke();
        // wrists
        ctx.fillStyle = '#caa07a';
        ctx.fillRect(cx - 86 * s, cy - 14 * s, 32 * s, 60 * s);
        ctx.fillRect(cx + 54 * s, cy - 14 * s, 32 * s, 60 * s);
    }

    _scene_backseat(ctx, W, H) {
        this._bg(ctx, W, H, '#0a0e18', '#10131c');
        // passing city through the window (parallax dusk)
        ctx.save(); ctx.beginPath(); ctx.rect(W * 0.12, H * 0.12, W * 0.76, H * 0.5); ctx.clip();
        this._bg(ctx, W, H, '#243152', '#9a6a4a');
        const off = (this.t * 120) % 160;
        ctx.fillStyle = '#1c2334';
        for (let x = -off; x < W; x += 160) {
            const bh = 80 + ((x | 0) % 120);
            ctx.fillRect(x, H * 0.62 - bh, 70, bh);
        }
        this._redBlue(ctx, W, H);
        ctx.restore();
        // cage bars (back of cop car)
        ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = 8;
        for (let x = W * 0.12; x <= W * 0.88; x += 38) { ctx.beginPath(); ctx.moveTo(x, H * 0.12); ctx.lineTo(x, H * 0.62); ctx.stroke(); }
        for (let y = H * 0.12; y <= H * 0.62; y += 38) { ctx.beginPath(); ctx.moveTo(W * 0.12, y); ctx.lineTo(W * 0.88, y); ctx.stroke(); }
        // seat
        ctx.fillStyle = '#1b1b22'; ctx.fillRect(0, H * 0.66, W, H * 0.34);
        // cop in front seat (silhouette + flashing)
        this._cop(ctx, W * 0.3, H * 0.55, 1.2, false);
    }

    _scene_intake(ctx, W, H) {
        this._bg(ctx, W, H, '#15171d', '#0c0d12');
        // fluorescent desk
        ctx.fillStyle = '#23252e'; ctx.fillRect(0, H * 0.6, W, H * 0.4);
        ctx.fillStyle = '#2e3340'; ctx.fillRect(W * 0.1, H * 0.55, W * 0.8, H * 0.1);
        // height chart wall
        ctx.strokeStyle = '#3a3f4a'; ctx.lineWidth = 2;
        for (let y = H * 0.15; y < H * 0.6; y += 28) { ctx.beginPath(); ctx.moveTo(W * 0.66, y); ctx.lineTo(W * 0.78, y); ctx.stroke(); }
        // mugshot you
        this._person(ctx, W * 0.72, H * 0.45, 1.4);
        // bored clerk
        this._person(ctx, W * 0.28, H * 0.45, 1.2, '#4a5160');
        ctx.fillStyle = '#9aa'; ctx.font = `bold ${Math.floor(W*0.02)}px monospace`; ctx.textAlign='center';
        ctx.fillText('CENTRAL BOOKING - DEPT. OF VEHICULAR SHAME', W/2, H*0.1);
    }

    _scene_defender(ctx, W, H) {
        this._bg(ctx, W, H, '#181c24', '#0d0f14');
        // holding room table
        ctx.fillStyle = '#2a2e38'; ctx.fillRect(W * 0.15, H * 0.62, W * 0.7, H * 0.12);
        // Dale, sweating, briefcase
        this._person(ctx, W * 0.5, H * 0.45, 1.7, '#7a6a55');
        // tiny nervous sweat
        ctx.fillStyle = '#bcd'; const sy = H * 0.36 + (this.t * 30 % 40);
        ctx.fillRect(W * 0.5 + 36, sy, 3, 6);
        // upside-down "case file"
        ctx.save(); ctx.translate(W * 0.5, H * 0.7); ctx.rotate(Math.PI);
        ctx.fillStyle = '#cdc9b8'; ctx.fillRect(-30, -20, 60, 40);
        ctx.fillStyle = '#888'; ctx.fillRect(-22, -12, 44, 4); ctx.fillRect(-22, -2, 44, 4);
        ctx.restore();
    }

    // === sprite primitives ===============================================
    _car(ctx, x, y, color, s = 1) {
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
        ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(0, 20, 50, 8, 0, 0, 7); ctx.fill();
        ctx.fillStyle = color; ctx.fillRect(-50, -14, 100, 30);
        ctx.fillStyle = this._shade(color, 0.8); ctx.fillRect(-26, -28, 52, 16);
        ctx.fillStyle = '#1c2530'; ctx.fillRect(-20, -25, 18, 11); ctx.fillRect(4, -25, 18, 11);
        ctx.fillStyle = '#111'; ctx.fillRect(-44, 14, 22, 10); ctx.fillRect(22, 14, 22, 10);
        ctx.restore();
    }
    _cop(ctx, x, y, s, angry) {
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
        // body (uniform)
        ctx.fillStyle = '#2b3a5c'; ctx.fillRect(-26, -4, 52, 70);
        ctx.fillStyle = '#22304d'; ctx.fillRect(-26, 18, 52, 6);
        // badge
        ctx.fillStyle = '#e8c84a'; ctx.fillRect(-16, 6, 8, 8);
        // head
        ctx.fillStyle = '#caa07a'; ctx.fillRect(-18, -36, 36, 34);
        // cap
        ctx.fillStyle = '#1d2740'; ctx.fillRect(-22, -44, 44, 12); ctx.fillRect(-26, -34, 52, 5);
        // shades / angry eyes
        if (angry) { ctx.fillStyle = '#101010'; ctx.fillRect(-15, -26, 12, 7); ctx.fillRect(3, -26, 12, 7);
            ctx.strokeStyle = '#101010'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-15,-29); ctx.lineTo(-3,-25); ctx.moveTo(15,-29); ctx.lineTo(3,-25); ctx.stroke();
            // shouting mouth
            ctx.fillStyle = '#3a1414'; ctx.fillRect(-8, -12, 16, 9);
        } else { ctx.fillStyle = '#101010'; ctx.fillRect(-12, -24, 6, 6); ctx.fillRect(6, -24, 6, 6); }
        ctx.restore();
    }
    _person(ctx, x, y, s, shirt = '#7a3a3a') {
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
        ctx.fillStyle = shirt; ctx.fillRect(-24, 0, 48, 60);
        ctx.fillStyle = '#caa07a'; ctx.fillRect(-16, -32, 32, 32);
        ctx.fillStyle = '#3a2f24'; ctx.fillRect(-18, -38, 36, 10);
        ctx.fillStyle = '#101010'; ctx.fillRect(-10, -20, 5, 5); ctx.fillRect(5, -20, 5, 5);
        ctx.fillStyle = '#5a3a3a'; ctx.fillRect(-6, -8, 12, 3);
        ctx.restore();
    }

    _playerColor() {
        const sc = this.game.player && this.game.player.selectedCar;
        if (sc) {
            if (typeof sc.colorHex === 'string') return sc.colorHex;
            if (typeof sc.color === 'number') return '#' + sc.color.toString(16).padStart(6, '0');
            if (typeof sc.color === 'string') return sc.color;
        }
        return '#c43a3a';
    }
    _shade(hex, f) {
        if (typeof hex !== 'string' || hex[0] !== '#') return hex;
        const n = parseInt(hex.slice(1), 16);
        return `rgb(${Math.floor(((n>>16)&255)*f)},${Math.floor(((n>>8)&255)*f)},${Math.floor((n&255)*f)})`;
    }

    // === TEARDOWN ========================================================
    _finish() {
        this._cleanup();
        if (typeof this.onComplete === 'function') this.onComplete(this.info);
    }
    _cleanup() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        clearInterval(this.typeTimer);
        if (this._onResize) window.removeEventListener('resize', this._onResize);
        if (this.root) { this.root.remove(); this.root = null; }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArrestSequence;
}
