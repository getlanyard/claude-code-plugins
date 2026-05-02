---
name: requirements
description: Create and refine specifications for features using the SDD methodology. Use this skill when writing, creating, or refining specs and specifications. Conducts discovery interviews and produces structured specification documents.
version: 0.3.1
---

# Requirements

## Practical Guidelines

### Project Structure

All SDD artifacts live in `.sdd/{feature}/` where `{feature}` is the kebab-case feature name (e.g., `user-authentication`).

### Templates

- Specification template: `templates/specification.template.md`
- Feature index template: `templates/index.template.md`

### Project Guidelines

Use the `handbook` skill to read and resolve project conventions. These conventions affect how specifications are structured.

### Domain Skills

After exploring the codebase with the Explore tool and understanding the task, identify which domain skills apply:

- **distributed-systems**: Multiple services, network coordination, eventual consistency
- **low-level-systems**: Memory management, performance-critical, OS interfaces
- **security**: Auth, untrusted input, sensitive data, compliance
- **infrastructure**: Cloud resources, IaC, networking, disaster recovery
- **devops-sre**: CI/CD, deployment, observability, SLOs
- **data-engineering**: Pipelines, ETL, schema evolution, data quality
- **api-design**: Public/internal APIs, versioning, contracts

Load relevant skills and apply their mindset and practices throughout specification, design, and review phases.

## Process

You **MUST** explore the codebase using the Explore tool before doing **ANY** of the below.
You **MUST** understand project guidelines by using the `handbook` skill

### Creating a Specification

Do this when a user asks to create a specification.

**Roadmap check:** If the parent directory contains a `roadmap.md`, this
spec is one deliverable from a roadmap. Confirm with the user which
D-XX is being specified, read the deliverable's Value/Scope from the
roadmap, and add a `**Linked Roadmap:** .sdd/{initiative}/roadmap.md
(D-XX)` field to the specification. Update the deliverable's Spec
status in the roadmap when this spec moves through Drafting → Approved
→ Implemented.

1. **Create a feature branch** from main named `feature/<feature-name>` (e.g., `feature/user-authentication`). For roadmap deliverables, name the branch `feature/<initiative>-<deliverable-slug>`.
2. **Create the spec folder.** Standalone: `.sdd/{FEATURE}/`. Roadmap deliverable: `.sdd/{initiative}/{deliverable-slug}/`.
3. **Copy** `templates/specification.template.md` to the new folder's `specification.md` if it doesn't already exist.
4. **Maintain the index:**
   - If `.sdd/index.md` doesn't exist, create it from `templates/index.template.md`
   - Add a row for the new feature (newest entries at top, ordered by date). Roadmap deliverables nest under their initiative row.
   - Update the status as the feature progresses through Draft → Approved → Implemented

### Specifying

Your **GOAL** is to complete all parts of the specification template for the feature.

**Scope:** A single specification should represent approximately 1 day of implementation work. If the feature is larger, break it into multiple specifications. During the discovery interview, sense check the scope and suggest splitting if necessary.

**Template guidance:**
- Follow the template structure as defined in templates/specification.template.md
- Sections marked "optional" or "if needed" can be omitted entirely if not applicable
- Do NOT add new sections that aren't in the template

#### Process

**Phase 1: Read existing context**

For a **standalone feature**, check if `.sdd/{FEATURE}/research.md` exists. If it does, read it — but extract only what helps write behavioral requirements: what users/operators need, what the system must do and why, constraints that shape scope (e.g., "identity unavailable on gRPC path"), and evidence for what's feasible. Skip technical approaches, architecture, data models, and code patterns — those inform the design, not the spec.

For a **roadmap deliverable**, research has been retired by the roadmap step. Read the deliverable's entry in `.sdd/{initiative}/roadmap.md` — the Outcome, In/Out scope, and Depends-on fields define the bounds. The roadmap's Problem and Motivation sections give the broader context. This is sufficient; do not seek out a research file that no longer exists.

**Phase 2: Discovery Interview**

Interview the user about their idea or brief. If research exists, you'll already have context — focus the interview on gaps the research didn't cover. If no research exists, start from scratch.

Keep asking questions until you can unambiguously fill out every section of the template. Don't ask about template sections directly - ask about their problem, users, and goals.

- What problem are they solving? Why does it matter?
- Who experiences this problem? How do they cope today?
- What does success look like? How will they know it's working?
- What are the boundaries? What's explicitly not included?
- What could go wrong? What are the edge cases?
- How will they validate the feature works? What steps will they take?
- What would they do in the UI/CLI to verify each requirement is met?

**Probe vague answers relentlessly** - Don't accept "fast", "secure", or "user-friendly" without measurable criteria. Keep questioning until requirements are specific and testable.

**Write requirements in user/domain language, not system internals** - "When content is uploaded to a store, the system must record the change" not "When a KV write succeeds, emit a StorageEvent." If you find yourself naming internal types, APIs, or data structures in a requirement, you're writing design, not specification. Requirements describe what the user does and what the system does in response, at the level a product person would understand.

**NFRs are optional** - Only include non-functional requirements when there are genuine, measurable quality constraints (e.g., specific latency targets, compliance requirements). Most features don't need them.

**Phase 3: Write the Specification**

Once you have enough information to fill out every section unambiguously, use the Task tool to launch a subagent that writes the specification. Do NOT write it yourself.

**Subagent prompt:**
> Write the specification for {FEATURE} at .sdd/{feature}/specification.md.
>
> **Read:**
> - Specification template: templates/specification.template.md
> - Research findings: `.sdd/{FEATURE}/research.md` (if it exists)
>
> **Context from discovery interview:**
> {paste the interview findings here}
>
> **Template guidance:**
> - Follow the template structure exactly
> - Sections marked "optional" or "if needed" can be omitted entirely if not applicable
> - Do NOT add new sections that aren't in the template
>
> **Acceptance Criteria:**
> - Every FR has at least one numbered AC, or sits in Deferred / Non-Verifiable Requirements with a stated blocker.
> - Name the system, the artifact, and the expected value in the Then clause. "users.password_hash row changes." Not "the password is updated."
> - Make the observable something a test can read directly — a row, a response field, a log line, a queue message.
> - Aim for 1–3 AC per FR. Stop when each remaining behaviour has its own observable.
> - Reject tautologies. If the Then restates the When ("when we store X, then X is stored"), drop the AC — it's plumbing covered transitively by another AC.
> - Reject white-box assertions. If the only observable lives inside a third party or past the public interface, move the FR to Deferred / Non-Verifiable and flag it for the stakeholder. Do not invent one.
> - If "Failure/edge cases" describes something worth verifying, promote it to its own AC.
>
> **Non-Functional Requirements:** Only include NFRs when there are genuine, measurable quality constraints. Skip the section for typical features.
>
> **QA Plan:** Linear instructions a human or agent QA pass can follow. Cover the happy path and the most important failure paths only — not every AC. Trust the automated tests for breadth; QA validates the experience. Mark each scenario `Path: happy | failure`.
>
> Write the complete specification in one pass. Fill in every section fully. Save the document when done.

**Phase 4: Review the Specification**

Use the `review` skill to perform a **Specification Review** of the specification at .sdd/{feature}/specification.md.

**Phase 5: Fix issues (if any)**

If the review finds P0 or P1 issues, use the Task tool to launch a subagent to fix them. Do NOT fix them yourself.

**Subagent prompt:**
> Fix the following issues in the specification at .sdd/{feature}/specification.md, using the template at templates/specification.template.md as reference:
>
> {paste review findings here}
>
> Save the document when done.

After the fix subagent completes, re-run Phase 4 (review). Repeat Phases 4-5 until the review passes.

### Refining a Specification

When asked to refine a specification:
1. Read existing specification thoroughly
2. Identify gaps, inconsistencies, or new requirements
3. Use the Explore tool to search the codebase for changed context or new patterns
4. Ask stakeholder about changed priorities or constraints
5. Update the specification while maintaining template structure
6. Verify all requirements are still testable and measurable
