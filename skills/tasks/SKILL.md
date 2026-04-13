---
name: tasks
description: Break down a design into implementation tasks. Use this skill when creating task breakdowns, populating the Task Breakdown section of a design document, or planning implementation phases. Ensures every requirement maps to tasks with test scenario references.
version: 0.1.0
---

# Tasks

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

### Project Guidelines

Use the `project-guidelines` skill to read and resolve project conventions before creating tasks.

### Domain Skills

After exploring the codebase with the Explore tool and understanding the task, identify which domain skills apply:

- **distributed-systems**: Multiple services, network coordination, eventual consistency
- **low-level-systems**: Memory management, performance-critical, OS interfaces
- **security**: Auth, untrusted input, sensitive data, compliance
- **infrastructure**: Cloud resources, IaC, networking, disaster recovery
- **devops-sre**: CI/CD, deployment, observability, SLOs
- **data-engineering**: Pipelines, ETL, schema evolution, data quality
- **api-design**: Public/internal APIs, versioning, contracts

Load relevant skills and apply their mindset and practices throughout task breakdown.

### Templates

- `SDD_TEMPLATE_TASKS` located in `templates/tasks.template.md` used for task breakdown documents
- `SDD_TASKS_DOCUMENT` is `.sdd/{FEATURE}/tasks.md`

## Process

### Task Breakdown

Your **GOAL** is to create a task breakdown document at {SDD_TASKS_DOCUMENT} for the feature.

**Step 1: Write the task breakdown**

You MUST use the Task tool to launch a subagent that writes the task breakdown. Do NOT write it yourself.

**Subagent prompt:**
> Create the task breakdown for {FEATURE} at {SDD_TASKS_DOCUMENT}.
>
> **Read these files:**
> - Design: {SDD_DESIGN_DOCUMENT}
> - Task template: {SDD_TEMPLATE_TASKS}
> - Project conventions: use the `project-guidelines` skill
> - Do NOT read the specification — the design already incorporates it
>
> **Follow the template structure exactly.** For each task:
> - Order tasks by dependencies — each task must produce code that compiles and passes tests independently
> - Each task must specify which requirements it fulfills using `{feature:REQ-ID}` format
> - Each task must list exact file paths to read and modify/create (including test files)
> - Each task must have implementation subtasks with checkboxes
> - Each task must have test checkboxes referencing specific scenario IDs (TS-XX, ITS-XX, E2E-XX) from the design, with a description specific enough to write the test from — what to set up, what to call, what to assert on, and what existing test fixtures or infrastructure to use
> - Each task must have a brief Details section (3-5 sentences, no code blocks) for key decisions and edge cases
> - Testing happens WITH implementation, not after - do NOT create separate "add tests" tasks
> - Every requirement must map to tasks (and vice versa)
> - Do NOT group tasks into phases — tasks are a flat ordered list
> - **Prerequisite check:** If early tasks are independently useful changes (e.g., trait signature changes, infrastructure additions, module refactors) that the rest of the feature builds on, flag them: *"Tasks 1-3 look like independent prerequisite work that could be split into a separate change. Should they be?"* Let the user decide — but surface it.
>
> **Context budget:** Each task plus the files it references should fit comfortably in 30-40% of a context window. If a task requires reading many files, split it. When in doubt, err smaller — a subagent finishing early is fine; running out of context wastes everything.
>
> **Escalation:** If the design is too large or ambiguous to break down fully, STOP and report what you completed and what needs clarification. Partial progress with clear gaps is better than exhausting context.
>
> Save the document when done.

**Step 2: Review the task breakdown**

Use the `review` skill to perform a **Task Breakdown Review** of the tasks at {SDD_TASKS_DOCUMENT}.

**Step 3: Fix issues (if any)**

If the review finds P0 or P1 issues, use the Task tool to launch a subagent to fix them. Do NOT fix them yourself.

**Subagent prompt:**
> Fix the following issues in the task breakdown at {SDD_TASKS_DOCUMENT}, using the design at {SDD_DESIGN_DOCUMENT} as reference:
>
> {paste review findings here}
>
> Save the document when done.

After the fix subagent completes, re-run Step 2 (review). Repeat Steps 2-3 until the review passes.
