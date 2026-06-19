// spec 0002 — ArrestSequence Cedar policy (default-deny).
// The game engine drives the cinematic beats on the player's behalf.

permit (
    principal in [Vroom::GameEngine],
    action in [
        Vroom::Action::"ApproachCopWindow",
        Vroom::Action::"ApplyCuffs",
        Vroom::Action::"LoadIntoBackSeat",
        Vroom::Action::"ArriveAtIntake",
        Vroom::Action::"CompleteIntake",
        Vroom::Action::"ConsultDefender",
        Vroom::Action::"HandOffToCourtroom"
    ],
    resource is Vroom::ArrestSequence
);

// Terminal-state lockout — IOA HandedOffIsTerminal is authoritative.
forbid (
    principal,
    action,
    resource is Vroom::ArrestSequence
) when {
    resource.status == "HandedOff"
};
