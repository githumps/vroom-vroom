// spec 0001 — Pursuit Cedar policy (default-deny).
// The police engine begins/ends pursuits; the driver may evade.

permit (
    principal in [Vroom::Police],
    action in [
        Vroom::Action::"BeginPursuit",
        Vroom::Action::"Catch"
    ],
    resource is Vroom::Pursuit
);

permit (
    principal is Vroom::Driver,
    action == Vroom::Action::"Evade",
    resource is Vroom::Pursuit
) when {
    resource.userId == principal.id
};

// Terminal-state lockout — IOA invariants Caught/EvadedIsTerminal are
// authoritative; this is defense-in-depth.
forbid (
    principal,
    action,
    resource is Vroom::Pursuit
) when {
    resource.status == "Evaded" || resource.status == "Caught"
};
