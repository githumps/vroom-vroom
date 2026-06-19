// spec 0006 — SaveState Cedar policy (default-deny).

permit (
    principal in [Vroom::GameEngine],
    action in [
        Vroom::Action::"MigrateSave",
        Vroom::Action::"LoadSave"
    ],
    resource is Vroom::SaveState
);

// Terminal-state lockout — IOA LoadedIsTerminal is authoritative.
forbid (
    principal,
    action,
    resource is Vroom::SaveState
) when {
    resource.status == "Loaded"
};
