---
name: review
description: Review specifications, designs, and implementations for SDD features. Use this skill when reviewing specs, designs, or implementations. Produces structured review reports with severity-categorized findings.
version: 0.1.0
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
> - Every requirement is testable from outside — verifiable without reading code
> - Requirements are behaviors, not solutions (no architecture, libraries, or patterns prescribed)
> - Requirements use user/domain language, not internal system terminology — "when content is uploaded to a store" not "when a KV write succeeds"; "the system records the change" not "a StorageEvent is emitted". If a requirement names internal types, APIs, or data structures, it belongs in the design, not the spec.
> - Scope fits a single iteration
> - No conflicts with existing functionality or project conventions
> - No vague/unmeasurable language ("fast", "secure", "user-friendly")
> - No technology choices or implementation assumptions embedded in requirements
> - If research exists, check that it was used correctly — requirements should reflect problem context and constraints from the research, not technical approaches or architecture that belong in the design
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
> - Tests at right levels (unit/integration/e2e per project guidelines), not all at one level
> - Test scenarios have Given/When/Then structure with concrete assertions — "Then: event is emitted" is vague and must be flagged; "Then: event record retrievable from stream with field=value" is testable
> - No TBDs or unresolved ambiguities
> - Risk assessment present with mitigations
> - Design is concise (under 300 lines, Details sections 5-10 lines max)
> - If research exists, design should be grounded in its technical findings — existing patterns, integration points, and constraints identified in research should be reflected in the design. Flag designs that contradict or ignore research findings without justification.
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
> - Every component and requirement from design covered by tasks. No tasks for unchanged behavior already tested, no new tests for removed functionality — just remove the old tests.
> - Each task names exact files to read, modify, and create (including test files)
> - Tasks are concrete enough to implement without re-reading the full design
> - Dependencies explicit and ordering respects them
> - Tests part of the task that implements behavior, not separate tasks
> - Context budget: each task + its referenced files should fit in 30-40% of a context window
> - Details sections are prose only, 3-5 sentences max, no code blocks
> - Task descriptions follow project conventions
> - No overlapping tasks modifying same files without acknowledgment
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
> 1. Run `git diff main...HEAD` to understand scope
> 2. Verify all design tasks are represented in the diff
> 3. Check implementation matches design contracts and interfaces
> 4. For each test scenario in the design, find and read its test — verify it exercises the criterion and would fail if the requirement was removed
> 5. Search for stubs: `skip`, `todo`, `pending`, `pass` in test functions, placeholder assertions
> 6. Search for dead code: unused imports, variables, functions, commented-out code
> 7. Search for SDD leakage: `FR-`, `NFR-`, `TS-`, `ITS-`, `E2E-`, `REQ-` in code, comments, docstrings, or test names
> 8. Verify project conventions (use `handbook` skill): error handling, logging, naming, test structure, commit format
> 9. Run tests, linters, and build
>
> Stubs/dead code: forbidden unless tracked in the tasks document with a clear reason.
>
> **Severity:** P0=explicit violation, P1=implied discrepancy, P2=ambiguity, P3=consideration. Group by severity, P0 first. Reject if any P0.
>
> **Escalation:** If the diff is too large to review in one pass, review the most critical files first and report what you covered vs. what remains.
