// spec 0007 — GameLoop Cedar policy (default-deny).
// The game engine advances the macro phase. The loop is cyclic (no terminal
// state); the IOA ordering invariants are the authoritative "can't skip a phase" rule.

permit (
    principal in [Vroom::GameEngine],
    action in [
        Vroom::Action::"GetCaught",
        Vroom::Action::"ProceedToCourt",
        Vroom::Action::"DeliverVerdict",
        Vroom::Action::"ReleaseToStreets"
    ],
    resource is Vroom::GameLoop
);
