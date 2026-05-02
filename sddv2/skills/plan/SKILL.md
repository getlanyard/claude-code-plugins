---
name: plan
description: Create and refine design documents for features using the SDD methodology. Use this skill when designing, creating designs, or refining designs. Produces structured design documents with architecture, components, test scenarios, and quality standards. Does NOT include task breakdown - use the tasks skill for that.
version: 0.2.3
---

# Plan

## Practical Guidelines

### Project Structure

All SDD artifacts live in `.sdd/{feature}/` where `{feature}` is the kebab-case feature name (e.g., `user-authentication`).

### Templates

- Design template: `templates/design.template.md`

### Project Guidelines

Use the `handbook` skill to read and resolve project conventions before designing.

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

### Creating a Design

Do this when a user asks to create a design.

You MUST create the required document in the relevant feature specific folder in the `.sdd/` folder at the root of the project.

**Maintain the index:**
1. If `.sdd/index.md` doesn't exist, create it from the requirements skill's `templates/index.template.md`
2. Add a row for the new feature (newest entries at top, ordered by date)
3. Update the status as the feature progresses through Draft → Approved → Implemented

**Example:**

**If** the user asks to create a **design** for user authentication **then** copy `templates/design.template.md` to `.sdd/user-authentication/design.md` if it doesn't already exist.

### Designing

Your **GOAL** is to complete the design template for the feature, **excluding** the Task Breakdown section (use the `tasks` skill for task breakdown).

**Purpose:** The design document is a complete handover document. Anyone on the team should be able to pick it up and carry out the implementation without needing to ask clarifying questions.

**Level of detail:** Include enough detail to enable handover to another team member, but not so much that you replicate the implementation in the document. Describe *what* and *why*, not *how* at the code level.

#### Process

**Step 1: Build the Design Brief**

Read `.sdd/{feature}/specification.md` and `.sdd/{feature}/research.md`
(if present). For roadmap deliverables, research will not exist —
the roadmap retired it after approval. In that case, the design
subagent will rediscover technical context via Explore (capped); do
not fabricate research highlights.

Distil into a compact brief that the writer subagent can work from
without opening either source file. Keep the brief under ~80 lines.

```
## Design Brief

**Problem:** {1 short paragraph from spec}

**Functional Requirements:**
- FR-01 ({title}): AC-01.1 {Given/When/Then summary}; AC-01.2 ...
- FR-02 ({title}): AC-02.1 ...

**Deferred / Non-Verifiable:**
- FR-03 — Blocker: {reason}; Proposed: {drop/narrow/escalate}

**NFRs:** {if any, with thresholds}

**QA scenarios:** QA-01 (happy), QA-02 (failure: {short})

**Research highlights (technical only):**
- Existing pattern: {1 line}
- Integration point: {1 line}
- Constraint: {1 line}
- Prior art: {1 line}
{Omit this block entirely for roadmap deliverables — research is gone.}
```

Skip research's Observe / Orient / Diverge / Evaluate narrative — only the synthesised technical findings belong in the brief.

**Step 2: Write the design document**

You MUST use the Task tool to launch a subagent that writes the design. Do NOT write it yourself.

**Subagent prompt:**
> Write the design document for {FEATURE} at `.sdd/{feature}/design.md`.
>
> **Read:**
> - Design template: `templates/design.template.md`
> - Project conventions: use the `handbook` skill
>
> Do NOT read the specification or research — the brief below is your source of truth. Fall back to those files only if the brief is silent on something you need.
>
> **Design Brief:**
> {paste brief from Step 1}
>
> **Components:**
> - Group as Modified, Added, or Used.
> - Every component carries a Rationale naming the AC or FR it serves. If you cannot, cut it or fold it into its caller.
> - Plumbing components (behaviour only meaningful via a caller) say so in the Rationale and name the AC that exercises them transitively. No standalone scenario.
> - Details: 5–10 lines of pseudo-code or type signatures. No implementation.
> - No TS-XX, ITS-XX, or E2E-XX blocks. AC live on requirements; components reference them in prose.
> - Every AC in the brief must appear in at least one component's Rationale.
>
> **API Design:** Operations conceptually (what they do, inputs, outputs, errors). Data shapes in prose. No language syntax.
>
> **QA Feasibility:** For each QA-XX, can the stakeholder run it without white-box manipulation? If not, name the setup and decide: automate, narrow, or escalate.
>
> **Feasibility Review:** Resolve each Deferred FR — drop, narrow, or escalate. List any other design blocker. If the feature requires provisioning or imperative-script execution to be verifiable, note which AC depends on which user-executed action. The feature still ships through one task breakdown — execution gating is a runtime concern, not a scoping one.
>
> **Instrumentation:** Include only when an NFR demands observability.
>
> **Output rules:**
> - Follow the template exactly. Skip optional sections that don't apply.
> - Leave Task Breakdown empty (the `tasks` skill owns it).
> - Aim under 300 lines total.
> - Save the document. Never skip this.
>
> **Codebase exploration:** If the brief includes Research highlights, trust them and cap Explore at 3 targeted reads when something is silent. If the brief omits Research highlights (roadmap deliverable — research has been retired), you must Explore to discover existing patterns, integration points, and constraints. Cap at 8 targeted reads; prefer reading the design template's required sections first to know what to look for.
>
> **Escalation:** If the brief is too ambiguous to design fully, STOP and report what you completed and what needs clarification.

**Step 3: Review the design**

Use the `review` skill to perform a **Design Review** of the design at .sdd/{feature}/design.md.

**Step 4: Fix issues (if any)**

If the review finds P0 or P1 issues, use the Task tool to launch a subagent to fix them. Do NOT fix them yourself.

**Subagent prompt:**
> Fix the following issues in the design at .sdd/{feature}/design.md, using the specification at .sdd/{feature}/specification.md as reference:
>
> {paste review findings here}
>
> Save the document when done.

After the fix subagent completes, re-run Step 3 (review). Repeat Steps 3-4 until the review passes.

#### Design Quality Checklist

A complete design document must have:
- **Link to specification** via the Linked Specification field
- **Architecture overview** explaining current context and proposed changes
- **Components defined** (Modified/Added/Used), each with a Rationale naming at least one AC or FR
- **Every AC from the specification** named in at least one component's Rationale
- **Deferred / Non-Verifiable FRs** from the specification each resolved in Feasibility Review
- **Risks identified** with mitigation strategies
- **No TBDs or ambiguities** in the final design
- **QA feasibility analyzed** — white-box setup documented for each scenario

Optional sections (include only if applicable):
- Instrumentation (if NFRs require observability)

### Refining a Design

When asked to refine a design:
1. Read existing design and linked specification thoroughly
2. Identify gaps, inconsistencies, or new requirements
3. Use the Explore tool to search the codebase for changed context or new patterns
4. Ask stakeholder about changed priorities or constraints
5. Update the design while maintaining template structure
6. Verify all requirements still map to components
