---
name: roadmap
description: Break a too-large initiative into a sequence of vertical deliverables, each sized to one spec. Use this skill when research reveals more work than a single specification can hold, or when the user knows up-front the work is multi-spec. Produces a roadmap document that drives subsequent requirements/plan/tasks/implement loops, one deliverable at a time.
version: 0.1.0
---

# Roadmap

Use this skill when research has surfaced more work than a single
specification can hold, or when the user already knows the work is
multi-spec. The roadmap turns a large initiative into a sequence of
**vertical deliverables** — each one a user/operator outcome that ships
end-to-end on its own and fits one spec.

## When to invoke

- Triggered by `research`: research synthesis concludes the work
  exceeds one spec's scope (~1 day of implementation).
- Invoked directly: the user knows up-front the initiative is
  multi-spec and skips straight here after research.

If a roadmap already exists for the initiative, do NOT create a new
one — refine the existing roadmap instead.

## Practical Guidelines

### Project Structure

Roadmaps live at `.sdd/{initiative}/roadmap.md`, with each deliverable's
spec nested at `.sdd/{initiative}/{deliverable-slug}/specification.md`.
This co-locates an initiative's documents and keeps `.sdd/index.md`
showing initiatives at the top level.

### Templates

- Roadmap template: `templates/roadmap.template.md`

### Project Guidelines

Use the `handbook` skill to read and resolve project conventions before
writing the roadmap.

### Domain Skills

After reading the research synthesis, identify which domain skills apply
to the initiative as a whole. Load relevant skills and apply their
mindset to deliverable shaping and sequencing.

- **distributed-systems**, **low-level-systems**, **security**,
  **infrastructure**, **devops-sre**, **data-engineering**,
  **api-design** — same set the other workflow skills use.

## Process

You **MUST** read the research synthesis before drafting the roadmap.
You **MUST** understand project guidelines via the `handbook` skill.

### Creating a Roadmap

**Step 1: Build the Roadmap Brief**

Read `.sdd/{initiative}/research.md`. Distil the synthesis into a
compact brief the writer subagent can work from without opening the
research file. Keep under ~80 lines.

```
## Roadmap Brief

**Problem:** {1 short paragraph}

**Synthesised direction:** {the chosen approach from research's
Synthesize phase, in 2–3 sentences}

**Scope axes:** {the dimensions along which the work naturally splits
— e.g., user persona, data domain, surface area, risk tier. These
inform deliverable boundaries.}

**Constraints:** {hard constraints from research — compliance,
infrastructure, deadlines}

**Open questions left from research:** {bullets}
```

Skip research's Observe / Orient / Diverge / Evaluate narrative — only
the synthesised direction and constraints belong in the brief.

**Step 2: Write the roadmap**

You MUST use the Task tool to launch a subagent that writes the roadmap.
Do NOT write it yourself.

**Subagent prompt:**
> Write the roadmap for {INITIATIVE} at `.sdd/{initiative}/roadmap.md`.
>
> **Read:**
> - Roadmap template: `templates/roadmap.template.md`
> - Project conventions: use the `handbook` skill
>
> Do NOT read the research file — the brief below is your source of
> truth.
>
> **Roadmap Brief:**
> {paste brief from Step 1}
>
> **Deliverables:**
> - Each deliverable is a **vertical slice**: it ships an end-to-end
>   user/operator outcome on its own. Not a layer (no "build the API
>   layer"), not a tech component (no "set up the database"), not a
>   phase (no "Phase 1 / Phase 2"). If a deliverable's value can only
>   be realised when paired with another, merge them.
> - Each deliverable must fit **one spec** (~1 day of implementation
>   work). If a candidate deliverable is too big, split it along one
>   of the brief's scope axes. If you cannot split without losing the
>   end-to-end property, surface this as an open question — do not
>   ship a roadmap with oversized deliverables.
> - Each deliverable's **Value** field names a user/operator and what
>   they can do after this deliverable that they couldn't before. "We
>   refactor X" is not a value statement; "operators can replay failed
>   webhooks" is.
> - **Scope (out)** is load-bearing. State what is deliberately
>   excluded so reviewers understand the cut.
> - Most deliverables should be **standalone**. If you find every
>   deliverable depends on D-01, that's a sign D-01 is plumbing
>   masquerading as a deliverable. Reshape so D-01 ships value too.
> - Order deliverables by what each one **unlocks** — feedback,
>   learning, risk reduction, or dependent work. The sequencing
>   rationale must explain why this order, not just list the order.
>
> **Output rules:**
> - Follow the template exactly. Skip optional sections that don't apply.
> - Keep the roadmap under 200 lines. If it grows past that, the
>   deliverables are too granular or the strategy is too detailed —
>   tighten.
> - Save the document. Never skip this.
>
> **Codebase exploration:** Trust the brief. Do NOT Explore unless the
> brief is silent on a constraint that affects deliverable shaping —
> and even then, cap at 3 targeted reads.
>
> **Escalation:** If the brief is too ambiguous to shape deliverables,
> or if you cannot split the work without losing the end-to-end
> property, STOP and report what you have plus the specific blocker.

**Step 3: Review the roadmap**

Use the `review` skill to perform a **Roadmap Review** of the roadmap
at `.sdd/{initiative}/roadmap.md`.

**Step 4: Fix issues (if any)**

If the review finds P0 or P1 issues, use the Task tool to launch a
subagent to fix them. Do NOT fix them yourself.

**Subagent prompt:**
> Fix the following issues in the roadmap at
> `.sdd/{initiative}/roadmap.md`, using the research at
> `.sdd/{initiative}/research.md` as reference:
>
> {paste review findings here}
>
> Save the document when done.

After the fix subagent completes, re-run Step 3 (review). Repeat Steps
3–4 until the review passes.

**Step 5: Maintain the index**

Add the initiative to `.sdd/index.md` (create from
`requirements/templates/index.template.md` if it doesn't exist). The
index entry points at the roadmap. Each deliverable's spec, once
created, gets its own row indented under the initiative.

### Refining a Roadmap

Refine when learning from a completed deliverable changes the shape of
what comes next.

1. Read existing roadmap and the research it links to.
2. Read the spec/design/implementation of any completed deliverables —
   what shipped and what was learned.
3. Re-evaluate remaining deliverables: still valuable? still vertical?
   still in the right order? Anything to add, drop, or merge?
4. Update the roadmap. Bump version in Change History.
5. Do NOT retroactively edit completed deliverable entries; they are
   the historical record.

## Interaction with other skills

- **research**: precedes roadmap. Research's synthesis is the input.
- **requirements**: each deliverable becomes one specification. The
  spec links back to the roadmap via a `Linked Roadmap` field.
- **express**: refuses to run if a roadmap exists. The user must pick
  a specific deliverable to express.
- **adr**: roadmap-level decisions (sequencing, what was deferred,
  what was deliberately cut from scope) sometimes warrant an ADR.
  Apply the same gate the `adr` skill uses — ADR only if meaningful
  alternatives were considered.
