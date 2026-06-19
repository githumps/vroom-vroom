// spec 0004 — PrisonTerm Cedar policy (default-deny).

permit (
    principal in [Vroom::Warden],
    action in [
        Vroom::Action::"BeginServing",
        Vroom::Action::"Release"
    ],
    resource is Vroom::PrisonTerm
);

permit (
    principal in [Vroom::DeployAttester],
    action == Vroom::Action::"AttestTermComplete",
    resource is Vroom::PrisonTerm
);

// Terminal-state lockout — IOA ReleasedIsTerminal is authoritative.
forbid (
    principal,
    action,
    resource is Vroom::PrisonTerm
) when {
    resource.status == "Released"
};
