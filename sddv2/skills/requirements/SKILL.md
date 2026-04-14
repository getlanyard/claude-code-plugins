---
name: requirements
description: Create and refine specifications for features using the SDD methodology. Use this skill when writing, creating, or refining specs and specifications. Conducts discovery interviews and produces structured specification documents.
version: 0.1.0
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

1. **Create a feature branch** from main named `feature/<feature-name>` (e.g., `feature/user-authentication`)
2. **Create the `.sdd/{FEATURE}/` folder** at the root of the project
3. **Copy** `templates/specification.template.md` to `.sdd/{FEATURE}/specification.md` if it doesn't already exist
4. **Maintain the index:**
   - If `.sdd/index.md` doesn't exist, create it from `templates/index.template.md`
   - Add a row for the new feature (newest entries at top, ordered by date)
   - Update the status as the feature progresses through Draft → Approved → Implemented

### Specifying

Your **GOAL** is to complete all parts of the specification template for the feature.

**Scope:** A single specification should represent approximately 1 day of implementation work. If the feature is larger, break it into multiple specifications. During the discovery interview, sense check the scope and suggest splitting if necessary.

**Template guidance:**
- Follow the template structure as defined in templates/specification.template.md
- Sections marked "optional" or "if needed" can be omitted entirely if not applicable
- Do NOT add new sections that aren't in the template

#### Process

**Phase 1: Read existing research**

Check if `.sdd/{FEATURE}/research.md` exists. If it does, read it — but extract only what helps write behavioral requirements: what users/operators need, what the system must do and why, constraints that shape scope (e.g., "identity unavailable on gRPC path"), and evidence for what's feasible. Skip technical approaches, architecture, data models, and code patterns — those inform the design, not the spec. The research helps you understand the problem deeply enough to write precise requirements without importing implementation details into them.

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
