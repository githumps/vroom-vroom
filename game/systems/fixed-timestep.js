// VROOM VROOM - Fixed Timestep Clock
// Turns wall-clock time into a fixed-step update + an interpolation alpha.
// One module, so the whole game stops being coupled to the display refresh rate.
//
// Interface (small):
//   const clock = new FixedTimestep({ step: 1/60, maxSteps: 5 });
//   clock.reset(now);
//   const { steps, alpha } = clock.sample(now);
//   // run your update() `steps` times with dt = clock.step, then render with `alpha`
//
// Behaviour (the depth behind it):
//   - accumulates real elapsed time and emits whole fixed steps
//   - clamps the number of steps per frame to avoid the "spiral of death"
//     (a slow frame asking for 200 catch-up steps that make the next frame slower)
//   - exposes `alpha` (0..1) = how far we are into the next step, for render interpolation

class FixedTimestep {
    constructor({ step = 1 / 60, maxSteps = 5 } = {}) {
        this.step = step;          // seconds per fixed update
        this.maxSteps = maxSteps;  // cap on catch-up steps per frame
        this.accumulator = 0;      // unspent real time, in seconds
        this.lastNow = null;       // ms timestamp of previous sample
    }

    // Call when (re)starting the loop so the first frame doesn't get a huge dt.
    reset(nowMs) {
        this.accumulator = 0;
        this.lastNow = nowMs;
    }

    // Given the current ms timestamp, return how many fixed updates to run and the
    // render interpolation alpha. Safe to call every animation frame.
    sample(nowMs) {
        if (this.lastNow === null) this.lastNow = nowMs;

        let frame = (nowMs - this.lastNow) / 1000; // seconds since last frame
        this.lastNow = nowMs;

        // Guard against tab-switch / breakpoint pauses dumping minutes of time in.
        if (frame > this.step * this.maxSteps) {
            frame = this.step * this.maxSteps;
        }
        if (frame < 0) frame = 0;

        this.accumulator += frame;

        let steps = 0;
        while (this.accumulator >= this.step && steps < this.maxSteps) {
            this.accumulator -= this.step;
            steps++;
        }

        const alpha = Math.min(1, this.accumulator / this.step);
        return { steps, alpha };
    }
}

// Export for tests / node
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FixedTimestep;
}
