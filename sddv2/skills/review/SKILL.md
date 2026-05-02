---
name: review
description: Review specifications, designs, and implementations for SDD features. Use this skill when reviewing specs, designs, or implementations. Produces structured review reports with severity-categorized findings.
version: 0.3.2
---

# Review

## Practical Guidelines

### Project Structure

All SDD artifacts live in `.sdd/{feature}/` where `{feature}` is the kebab-case feature name (e.g., `user-authentication`).

### Project Guidelines

Use the `handbook` skill to read and resolve project conventions before reviewing.

### Domain Skills

After exploring the codebase with the Explore tool and understanding the task, identify which domain skills apply:

- **distributed-systems**: Multiple services, network coordination, eventual consistency
- **low-level-systems**: Memory management, performance-critical, OS interfaces
- **security**: Auth, untrusted input, sensitive data, compliance
- **infrastructure**: Cloud resources, IaC, networking, disaster recovery
- **devops-sre**: CI/CD, deployment, observability, SLOs
- **data-engineering**: Pipelines, ETL, schema evolution, data quality
- **api-design**: Public/internal APIs, versioning, contracts

Load relevant skills and apply their mindset and practices throughout review.

## Process

Identify the review type requested, then follow ONLY that type's section below. Each section has preparation steps and a subagent prompt template.

**CRITICAL**: Use the Task tool to create a subagent for the review. The subagent reads files directly — do NOT paste full documents into the prompt.

### Severity Levels

All findings use: **P0** (explicit violation of stated requirement/guideline/contract), **P1** (spirit not met), **P2** (ambiguous/unclear), **P3** (gap worth noting). Report grouped by severity, P0 first. Recommend rejection if any P0.

---

### Roadmap Review

**Subagent prompt:**
> Review the roadmap for {INITIATIVE}.
>
> **Read these files:**
> - Roadmap: `.sdd/{initiative}/roadmap.md`
> - Research: `.sdd/{initiative}/research.md`
> - Project conventions: use the `handbook` skill
>
> **Check for:**
> - **Outcomes only.** No architecture, components, libraries, code, file paths, or data shapes anywhere in the document. Flag any implementation detail. The roadmap's job is what users/operators can do after each step, not how it's built.
> - **Problem and Motivation** are present at the top. Problem in user/business terms (not technical). Motivation explains why now. Flag missing or generic versions.
> - Every deliverable is a vertical outcome — a user/operator can do something after that they couldn't before. Flag any deliverable that's a layer ("build the API"), a tech component ("set up the queue"), or a phase ("Phase 1").
> - Every deliverable's Outcome field names a specific user/operator/business actor and what they can do after. Flag generic outcomes ("improves the system", "enables future work").
> - In scope / Out of scope describe outcomes, not work items. Flag entries that name internal subsystems or services.
> - Every deliverable fits one spec (~1 day). Flag any that look multi-day or multi-subsystem — these need splitting along a scope axis.
> - Out of scope is present and load-bearing. Flag deliverables that don't state what's deliberately excluded.
> - Most deliverables are standalone. If every deliverable depends on D-01, D-01 is plumbing — flag for reshape.
> - Sequencing rationale explains *why* this order in outcome terms, not just lists the order. Flag missing or trivial rationale.
> - No leakage of research narrative (Observe/Orient/Diverge/Evaluate prose) — the roadmap is a forward plan, not a synthesis.
> - Roadmap is concise (under 200 lines). Flag if longer.
>
> **Severity:** P0=explicit violation, P1=implied discrepancy, P2=ambiguity, P3=consideration. Group by severity, P0 first. Reject if any P0.

---

### Specification Review

**Subagent prompt:**
> Review the specification for {FEATURE}.
>
> **Read these files:**
> - Specification: .sdd/{feature}/specification.md
> - Research: `.sdd/{FEATURE}/research.md` (if it exists)
> - Project conventions: use the `handbook` skill
>
> **Check for:**
> - Every requirement describes WHAT and WHY, never HOW
> - Requirements are behaviors, not solutions (no architecture, libraries, or patterns prescribed)
> - Requirements use user/domain language, not internal system terminology — "when content is uploaded to a store" not "when a KV write succeeds"; "the system records the change" not "a StorageEvent is emitted". If a requirement names internal types, APIs, or data structures, it belongs in the design, not the spec.
> - Scope fits a single iteration
> - No conflicts with existing functionality or project conventions
> - No vague/unmeasurable language ("fast", "secure", "user-friendly")
> - No technology choices or implementation assumptions embedded in requirements
> - If research exists, check that it was used correctly — requirements should reflect problem context and constraints from the research, not technical approaches or architecture that belong in the design
>
> **Acceptance Criteria checks:**
> - Every FR has at least one AC, or sits in Deferred / Non-Verifiable Requirements with a stated blocker.
> - Every AC's Then clause names a concrete observable: system, artifact, expected value. Flag any Then that paraphrases the When or describes intent ("password is updated", "event is emitted").
> - Flag tautologies — Then clauses that restate the When in different words. These should be deleted, not refined.
> - Flag white-box AC — observables that require reaching past the public interface or into a third party. These belong in Deferred, not in active FRs.
> - Failure/edge cases prose that describes verifiable behaviour should be promoted to its own AC. Flag any.
>
> **Severity:** P0=explicit violation, P1=implied discrepancy, P2=ambiguity, P3=consideration. Group by severity, P0 first. Reject if any P0.

---

### Design Review

**Subagent prompt:**
> Review the design for {FEATURE}.
>
> **Read these files:**
> - Specification: .sdd/{feature}/specification.md
> - Design: .sdd/{feature}/design.md
> - Research: `.sdd/{FEATURE}/research.md` (if it exists)
> - Project conventions: use the `handbook` skill
>
> **Check for:**
> - Every requirement addressed by design — no orphan requirements. Unchanged behavior covered by existing tests is not an orphan. Removed functionality needs its tests removed, not new tests added.
> - No gold-plating beyond requirements
> - Follows project conventions (error handling, logging, naming, architecture)
> - Clear component boundaries with explicit interfaces (inputs, outputs, errors)
> - Dependencies between components stated, not implied
> - Failure cases handled (dependencies unavailable, invalid inputs, partial completion)
> - No TBDs or unresolved ambiguities
> - Risk assessment present with mitigations
> - Design is concise (under 300 lines, Details sections 5-10 lines max)
> - If research exists, design should be grounded in its technical findings — existing patterns, integration points, and constraints identified in research should be reflected in the design. Flag designs that contradict or ignore research findings without justification.
>
> **Component Rationale checks:**
> - Every Modified and Added component has a Rationale that names a specific AC or FR. Flag components whose Rationale is generic ("supports the feature") or absent.
> - Every AC from the specification is named in at least one component's Rationale. List any uncovered AC.
> - Plumbing components state their transitive coverage explicitly — they name the AC that exercises them through a caller. Flag components whose Rationale tries to assert standalone behaviour that just restates their implementation.
> - Deferred / Non-Verifiable FRs from the specification each have a resolution in the Feasibility Review section (drop, narrow, or escalate). Flag any left dangling.
> - No TS-XX / ITS-XX / E2E-XX scenario blocks in the design. If present, the design is on the old template — flag for migration.
>
> **Severity:** P0=explicit violation, P1=implied discrepancy, P2=ambiguity, P3=consideration. Group by severity, P0 first. Reject if any P0.

---

### Task Breakdown Review

**Subagent prompt:**
> Review the task breakdown for {FEATURE}.
>
> **Read these files:**
> - Design: .sdd/{feature}/design.md
> - Tasks: .sdd/{feature}/tasks.md
> - Project conventions: use the `handbook` skill
>
> **Check for:**
> - Every AC in the specification appears in at least one task's `Satisfies:` field. List any uncovered AC.
> - Every Modified and Added component from the design appears in at least one task's `Components touched:` field. List any uncovered components.
> - Every task has at least one AC in `Satisfies:`, or is explicitly justified plumbing (contract change consumed by other code) flagged via the prerequisite check. A task with no AC and no justification is a P0.
> - No `TS-XX`, `ITS-XX`, or `E2E-XX` references — those IDs no longer exist. Flag any.
> - The Tests bullet references AC IDs from `Satisfies:` and does not enumerate one checkbox per AC. The implementer chooses test count under TDD.
> - No sub-AC tasks — a single AC is not split across multiple tasks. If it appears to be, the AC may be too coarse; flag for spec review.
> - No tasks for unchanged behavior already tested, no new tests for removed functionality — just remove the old tests.
> - Each task names exact files to read, modify, and create (including test files).
> - Tasks are concrete enough to implement without re-reading the full design.
> - Dependencies explicit and ordering respects them — each task ends green.
> - Tests part of the task that implements behavior, not separate tasks.
> - Context budget: each task + its referenced files should fit in 30–40% of a context window.
> - Notes sections are prose only, 3–5 sentences max, no code blocks.
> - Task descriptions follow project conventions.
> - No overlapping tasks modifying same files without acknowledgment.
>
> **Severity:** P0=explicit violation, P1=implied discrepancy, P2=ambiguity, P3=consideration. Group by severity, P0 first. Reject if any P0.

---

### Implementation Review

**Subagent prompt:**
> Review the implementation of {FEATURE}.
>
> **Read these files:**
> - Tasks: .sdd/{feature}/tasks.md
> - Design: .sdd/{feature}/design.md
> - Do NOT read the specification — the design already incorporates it
>
> **Steps:**
> 1. Read .sdd/{feature}/specification.md and list every AC. Confirm each appears in tasks.md's `Satisfies:` fields. Any AC not delivered is a P0.
> 2. Run `git diff main...HEAD` to understand scope
> 3. Verify all design tasks are represented in the diff
> 4. Check implementation matches design contracts and interfaces by the final task. Mid-stream tasks may implement only the slice their AC need; missing methods or branches in earlier tasks are not gaps if a later task delivers them.
> 5. For each AC in the specification, find at least one test whose failure would mean the AC is unmet. Read it. Verify it asserts on the named observable, not a paraphrase. A test that would pass if the implementation were deleted is a P0. Spot-check 2–3 AC by mentally deleting the satisfying implementation — if the test would still pass, P0.
> 6. Search for stubs: `skip`, `todo`, `pending`, `pass` in test functions, placeholder assertions
> 7. Test code quality: tests are held to the same standards as production code. Flag duplicated arrange blocks (extract a helper), copy-pasted assertions across tests that differ only in inputs (parameterise), inline fixtures that belong in shared helpers, unclear test names that don't state the behaviour under test, and ad-hoc mocks where a project fixture exists.
> 8. Provisioning configs and imperative scripts (root IaC modules, env stacks, migrations, runbooks) created in a task should be linted and validated, not executed. If the diff shows an AC test passing against an applied environment, confirm via tasks.md or commit messages that the user performed the apply/run — not the implement subagent. Reusable IaC modules ARE expected to have AC tests via plan-time or policy assertions.
> 9. Search for dead code: unused imports, variables, functions, commented-out code
> 10. Search for SDD leakage: `FR-`, `NFR-`, `AC-`, `REQ-` in code, comments, docstrings, or test names
> 11. Verify project conventions (use `handbook` skill): error handling, logging, naming, test structure, commit format
> 12. Run tests, linters, and build
>
> Stubs/dead code: forbidden unless tracked in the tasks document with a clear reason.
>
> **Severity:** P0=explicit violation, P1=implied discrepancy, P2=ambiguity, P3=consideration. Group by severity, P0 first. Reject if any P0.
>
> **Escalation:** If the diff is too large to review in one pass, review the most critical files first and report what you covered vs. what remains.
