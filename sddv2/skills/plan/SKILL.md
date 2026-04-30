---
name: plan
description: Create and refine design documents for features using the SDD methodology. Use this skill when designing, creating designs, or refining designs. Produces structured design documents with architecture, components, test scenarios, and quality standards. Does NOT include task breakdown - use the tasks skill for that.
version: 0.2.0
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

**Step 1: Write the design document**

You MUST use the Task tool to launch a subagent that writes the design. Do NOT write it yourself.

**Subagent prompt:**
> Write a design document for {FEATURE} at .sdd/{feature}/design.md.
>
> **Read these files:**
> - Specification: .sdd/{feature}/specification.md
> - Research: `.sdd/{FEATURE}/research.md` (if it exists) — focus on the technical side: existing code patterns, integration points, available infrastructure, prior art, and constraints that affect the architecture. Use it to sanity-check your design approach.
> - Design template: templates/design.template.md
> - Project conventions: use the `handbook` skill
>
> **Template guidance:**
> - Follow the template structure exactly
> - Sections marked "optional" or "if needed" can be omitted entirely if not applicable
> - Do NOT add new sections that aren't in the template
> - Leave the Task Breakdown section empty
>
> **Components:**
> - Group as Modified, Added, or Used.
> - Every component carries a Rationale that names the AC or FR it serves. If you cannot, cut the component or fold it into its caller.
> - Plumbing components (their behaviour is only meaningful via a caller) must say so in the Rationale and name the AC that exercises them transitively. Do not invent a standalone scenario.
> - Keep Details to 5–10 lines of pseudo-code or type signatures. No implementation.
> - Do not write TS-XX, ITS-XX, or E2E-XX scenario blocks — they are removed from the template. AC live on requirements; components reference them in prose.
> - Every AC from the specification must be named in at least one component's Rationale.
>
> **QA Feasibility:** For each QA-XX in the specification, confirm a stakeholder can run it against this design without white-box manipulation. If not, name the setup required and decide: automate it, narrow QA scope, or escalate.
>
> **Feasibility Review:** Resolve each Deferred / Non-Verifiable Requirement from the specification — drop, narrow, or escalate. Record the decision. Also list anything else that blocks the design: missing infrastructure, prerequisite features, decisions waiting on a human.
>
> **Instrumentation:** Only include when an NFR demands observability.
>
> **Process:**
>
> 1. **Map requirements to components** - Create a checklist of every FR and NFR from the specification. For each, identify which component(s) will address it. Every requirement MUST map to at least one component. If it cannot, document it in Feasibility Review with justification.
>
> 2. **Categorize components:**
>    - **Modified**: Existing component that needs changes. Document current behaviour, the delta, dependants, and a Rationale linking it to AC or FR.
>    - **Added**: New component. Document single responsibility, consumers, location, and a Rationale linking it to AC or FR.
>    - **Used**: Existing component needed as-is. Document what it provides, which Modified/Added components depend on it, and a one-line Rationale (name a reusable test fixture if one exists).
>
>    Keep components focused (single responsibility, minimal coupling, explicit dependencies). Define public interfaces and error handling. Avoid over-engineering.
>
> 3. **Write the design document** following the template exactly. Fill in every section except Task Breakdown. Each component's Rationale must name at least one AC or FR. Plumbing components state their transitive coverage explicitly — they name the AC that exercises them through a caller, and do not get their own scenario. **Keep the document concise** — component Details sections must be 5-10 lines of pseudo-code max, not full implementation code. Aim for under 300 lines total.
>
> 4. **API Design** (when the feature has public interfaces): Describe operations conceptually (what they do, inputs, outputs, errors). Define data shapes in prose or simple schemas. Do NOT include function implementations or language-specific syntax. No exceptions — detailed code belongs in the task breakdown, not the design.
>
> 5. **QA Feasibility Analysis** - For each QA scenario in the specification: can the user complete all steps with functionality in this design? If not, document white-box setup required (what manual manipulation, why, and whether scope should change).
>
> 6. **Save the document.** Never skip this step.
>
> **Escalation:** If the specification is too large or ambiguous to design fully, STOP and report what you completed and what needs clarification.

**Step 2: Review the design**

Use the `review` skill to perform a **Design Review** of the design at .sdd/{feature}/design.md.

**Step 3: Fix issues (if any)**

If the review finds P0 or P1 issues, use the Task tool to launch a subagent to fix them. Do NOT fix them yourself.

**Subagent prompt:**
> Fix the following issues in the design at .sdd/{feature}/design.md, using the specification at .sdd/{feature}/specification.md as reference:
>
> {paste review findings here}
>
> Save the document when done.

After the fix subagent completes, re-run Step 2 (review). Repeat Steps 2-3 until the review passes.

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
