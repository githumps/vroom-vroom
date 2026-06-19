// spec 0003 — CourtCase Cedar policy (default-deny).

permit (
    principal in [Vroom::Clerk],
    action == Vroom::Action::"FilePaperwork",
    resource is Vroom::CourtCase
);

permit (
    principal in [Vroom::Judge],
    action == Vroom::Action::"Sentence",
    resource is Vroom::CourtCase
);

// Terminal-state lockout — IOA SentencedIsTerminal is authoritative (no re-sentencing).
forbid (
    principal,
    action,
    resource is Vroom::CourtCase
) when {
    resource.status == "Sentenced"
};
