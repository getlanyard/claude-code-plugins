---
name: plan
description: Create and refine design documents for features using the SDD methodology. Use this skill when designing, creating designs, or refining designs. Produces structured design documents with architecture, components, test scenarios, and quality standards. Does NOT include task breakdown - use the tasks skill for that.
version: 0.1.0
---

# Plan

## Practical Guidelines

### Project Structure and Paths

All SDD artifacts live in the `.sdd/` folder at the repository root. Use these exact paths:

| Variable | Path |
|----------|------|
| `SDD_FOLDER` | `.sdd/` |
| `SDD_INDEX` | `.sdd/index.md` |
| `SDD_PROJECT_FOLDER` | `.sdd/{FEATURE}/` |
| `SDD_SPECIFICATION_DOCUMENT` | `.sdd/{FEATURE}/specification.md` |
| `SDD_DESIGN_DOCUMENT` | `.sdd/{FEATURE}/design.md` |
Where `{FEATURE}` is the kebab-case name of the feature (e.g., `user-authentication`, `shopping-cart`).

### Templates

- `SDD_TEMPLATE_DESIGN` located in `templates/design.template.md` used for design documents

### Project Guidelines

Use the `project-guidelines` skill to read and resolve project conventions before designing.

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
> Write a design document for {FEATURE} at {SDD_DESIGN_DOCUMENT}.
>
> **Read these files:**
> - Specification: {SDD_SPECIFICATION_DOCUMENT}
> - Research: `.sdd/{FEATURE}/research.md` (if it exists) — focus on the technical side: existing code patterns, integration points, available infrastructure, prior art, and constraints that affect the architecture. Use it to sanity-check your design approach.
> - Design template: {SDD_TEMPLATE_DESIGN}
> - Project conventions: use the `project-guidelines` skill
>
> **Template guidance:**
> - Follow the template structure exactly
> - Sections marked "optional" or "if needed" can be omitted entirely if not applicable
> - Do NOT add new sections that aren't in the template
> - Leave the Task Breakdown, Dead Code Tracking, and Stub Tracking sections empty
>
> **Process:**
>
> 1. **Map requirements to components** - Create a checklist of every FR and NFR from the specification. For each, identify which component(s) will address it. Every requirement MUST map to at least one component. If it cannot, document it in Feasibility Review with justification.
>
> 2. **Categorize components:**
>    - **Modified**: Existing component that needs changes. Document current behavior, what changes, dependants, and test scenarios (Given/When/Then)
>    - **Added**: New component. Document single responsibility, consumers, location, requirements satisfied, and test scenarios (Given/When/Then)
>    - **Used**: Existing component needed as-is. Document what it provides and which Modified/Added components depend on it
>
>    Keep components focused (single responsibility, minimal coupling, explicit dependencies). Define public interfaces and error handling. Avoid over-engineering.
>
> 3. **Write the design document** following the template exactly. Fill in every section except Task Breakdown, Dead Code Tracking, and Stub Tracking. For each component, include Requirements References linking to FR/NFR IDs and test scenarios in Given/When/Then format tracing to acceptance criteria. The **Then** clause must specify a concrete, observable assertion — what state to check, in what system, with what expected value. "Then: event is emitted" is too vague; "Then: a StorageEvent record is retrievable from the Kinesis stream with tenant_id=X and new_value_size=100" is testable. If the test cannot be verified without specific infrastructure (mock endpoint, fixture, wrapper), name that infrastructure in the scenario. **Keep the document concise** — component Details sections must be 5-10 lines of pseudo-code max, not full implementation code. Aim for under 300 lines total.
>
> 4. **API Design** (when the feature has public interfaces): Describe operations conceptually (what they do, inputs, outputs, errors). Define data shapes in prose or simple schemas. Do NOT include function implementations or language-specific syntax. No exceptions — detailed code belongs in the task breakdown, not the design.
>
> 5. **QA Feasibility Analysis** - For each QA scenario in the specification: can the user complete all steps with functionality in this design? If not, document white-box setup required (what manual manipulation, why, and whether scope should change).
>
> 6. **Save the document.** Never skip this step.
>
> **Escalation:** If the specification is too large or ambiguous to design fully, STOP and report what you completed and what needs clarification.

**Step 2: Review the design**

Use the `review` skill to perform a **Design Review** of the design at {SDD_DESIGN_DOCUMENT}.

**Step 3: Fix issues (if any)**

If the review finds P0 or P1 issues, use the Task tool to launch a subagent to fix them. Do NOT fix them yourself.

**Subagent prompt:**
> Fix the following issues in the design at {SDD_DESIGN_DOCUMENT}, using the specification at {SDD_SPECIFICATION_DOCUMENT} as reference:
>
> {paste review findings here}
>
> Save the document when done.

After the fix subagent completes, re-run Step 2 (review). Repeat Steps 2-3 until the review passes.

#### Design Quality Checklist

A complete design document must have:
- **Link to specification** via the Linked Specification field
- **Architecture overview** explaining current context and proposed changes
- **Components defined** (Modified/Added) with requirements references and test scenarios
- **Risks identified** with mitigation strategies
- **No TBDs or ambiguities** in the final design
- **QA feasibility analyzed** - white-box setup documented for each scenario

Optional sections (include only if applicable):
- Integration Test Scenarios (if multi-component interactions)
- E2E Test Scenarios (if complete user workflows need testing)
- Instrumentation (if NFRs require observability)

### Refining a Design

When asked to refine a design:
1. Read existing design and linked specification thoroughly
2. Identify gaps, inconsistencies, or new requirements
3. Use the Explore tool to search the codebase for changed context or new patterns
4. Ask stakeholder about changed priorities or constraints
5. Update the design while maintaining template structure
6. Verify all requirements still map to components
