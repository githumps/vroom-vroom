# VROOM VROOM - Source-of-Truth Design Spec

Authoritative product/visual contract for the verified spec layer. Each
`specs/NNNN-*/` cites a section here by number in its action `hint`s. When a
spec bool and the code disagree, this doc decides which one is wrong.

Companion docs: repo-root `CONTEXT.md` (vocabulary), `docs/ARCHITECTURE.md`
(implementation map). This file governs the *contracts*; those describe the code.

---

## §1 Macro game loop (GameLoop)

The game is one closed cycle with no win screen:

> Driving -> (caught) -> Arrest -> Courtroom -> Prison -> (sentence served) -> released -> Driving

- §1.1 You cannot enter Courtroom without first being arrested while Driving.
- §1.2 You cannot enter Prison without a Courtroom verdict.
- §1.3 Release returns to Driving; the loop never terminates (credits roll, then drive again).
- §1.4 At most one phase is active at a time.

## §2 Driving / Pursuit

- §2.1 Driving begins clean: no police, zero heat.
- §2.2 A patrol may begin a Pursuit. Once pursued, the chase resolves to exactly one of Evaded or Caught.
- §2.3 Evaded and Caught are mutually exclusive end states; you cannot be both.
- §2.4 You cannot be Caught before a Pursuit has begun.
- §2.5 Skilled driving (speed kept above police pressure) opens the gap toward Evade; failing closes it toward Caught.
- §2.6 Being Caught is the only driving outcome that advances the loop (Evade stays in Driving).

## §3 Arrest sequence

Ordered cinematic beats; none may be skipped, intake gates the courtroom:

> Busted -> CopWindow -> Cuffs -> BackSeat -> Intake -> Defender -> (hand off to Courtroom)

- §3.1 The sequence plays strictly in order; a later beat cannot show before its predecessor.
- §3.2 The Intake booking must complete before the Defender beat.
- §3.3 The courtroom hand-off happens only after the Defender beat (the sequence is terminal w.r.t. itself).

## §4 Court case

- §4.1 Every case is arraigned, has its paperwork completed, then is sentenced.
- §4.2 The verdict is ALWAYS guilty - there is no acquittal path.
- §4.3 A sentence is assigned exactly once per case (no re-sentencing).
- §4.4 Paperwork must be completed before sentencing.

## §5 Prison term

- §5.1 A term is Admitted, then Serving, then Released.
- §5.2 Release happens only when days served reaches the required term (sentence years x 7 days).
- §5.3 You cannot be Released before being Admitted and Serving.
- §5.4 Released is terminal for the term (the next offense opens a new term).

## §6 Standing (morality axis)

Single canonical 0-100 axis replacing the legacy trio
(`goodBehaviorPoints` / `goodBehavior` / `corruption`).

- §6.1 Standing is one source of truth; "good behaviour" and "corruption" are views of it.
- §6.2 Standing is established once at intake, then only adjusted (never re-initialised).
- §6.3 Standing stays within bounds [0, 100] at all times.

## §7 Save state

- §7.1 A save is created, may be migrated to the current version, then loaded.
- §7.2 A save must be migrated to the current schema version before it is loaded.
- §7.3 A loaded save is validated exactly once.
