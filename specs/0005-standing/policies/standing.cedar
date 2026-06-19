// spec 0005 — Standing Cedar policy (default-deny).

permit (
    principal in [Vroom::GameEngine],
    action in [
        Vroom::Action::"EstablishStanding",
        Vroom::Action::"AdjustStanding"
    ],
    resource is Vroom::Standing
);

// Standing has no terminal state (it is adjusted for the life of the inmate),
// so there is no terminal-lockout forbid here. The IOA guard on EstablishStanding
// (is_false established_once) is the authoritative "never re-initialise" rule (§6.2).
