---
name: tasks
description: Break down a design into implementation tasks. Use this skill when creating task breakdowns, populating the Task Breakdown section of a design document, or planning implementation phases. Ensures every requirement maps to tasks with test scenario references.
version: 0.2.0
---

# Tasks

## Practical Guidelines

### Project Structure

All SDD artifacts live in `.sdd/{feature}/` where `{feature}` is the kebab-case feature name (e.g., `user-authentication`).

### Project Guidelines

Use the `handbook` skill to read and resolve project conventions before creating tasks.

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

- Task template: `templates/tasks.template.md`

## Process

### Task Breakdown

Your **GOAL** is to create a task breakdown document at .sdd/{feature}/tasks.md for the feature.

**Step 1: Write the task breakdown**

You MUST use the Task tool to launch a subagent that writes the task breakdown. Do NOT write it yourself.

**Subagent prompt:**
> Create the task breakdown for {FEATURE} at .sdd/{feature}/tasks.md.
>
> **Read these files:**
> - Design: .sdd/{feature}/design.md
> - Task template: templates/tasks.template.md
> - Project conventions: use the `handbook` skill
> - Do NOT read the specification — the design already incorporates it
>
> **Follow the template structure exactly.** For each task:
> - Decompose by **vertical AC slice**, not by component layer. A task delivers one or more AC end-to-end. Plumbing components arrive alongside the first AC that uses them.
> - Each task must list the AC it satisfies in its `Satisfies:` field, plus the components it touches in `Components touched:`.
> - Order tasks by AC dependency — each task must produce code that compiles and passes tests independently. Every task ends green.
> - Each task lists exact file paths to read and modify/create (including test files).
> - Each task has implementation subtasks with checkboxes.
> - Each task has a single Tests bullet referencing AC IDs from `Satisfies:`. Do not enumerate one checkbox per AC; the implementer chooses test count and boundary under TDD.
> - Each task has a brief Notes section (3–5 sentences, no code blocks) for key decisions, edge cases, and fixture pointers.
> - Testing happens WITH implementation, not after — do NOT create separate "add tests" tasks.
> - **No sub-AC tasks.** Don't split a single AC across tasks. If an AC is too big for one task's context budget, the AC is too coarse — escalate to spec.
> - **No pure-plumbing tasks.** A task with no AC is a smell. The only exception is a contract change consumed by other code (e.g., trait signature update); flag it as a candidate for a separate prior PR via the prerequisite check below.
> - **Vertical slicing means partial components are expected.** A component's design may be realised across multiple tasks — each task implements only what its AC need. The component is fully delivered by the final task that satisfies its last AC. This is partial implementation, not dead code.
> - Every AC in the specification must appear in at least one task's `Satisfies:` field. Every Modified/Added component in the design must appear in at least one task's `Components touched:` field.
> - Do NOT group tasks into phases — tasks are a flat ordered list.
> - Do NOT use TS-XX, ITS-XX, or E2E-XX IDs — they no longer exist.
> - **Prerequisite check:** If early tasks are independently useful changes (e.g., trait signature changes, infrastructure additions, module refactors) that the rest of the feature builds on, flag them: *"Tasks 1-3 look like independent prerequisite work that could be split into a separate change. Should they be?"* Let the user decide — but surface it.
>
> **Context budget:** Each task plus the files it references should fit comfortably in 30-40% of a context window. If a task requires reading many files, split it. When in doubt, err smaller — a subagent finishing early is fine; running out of context wastes everything.
>
> **Escalation:** If the design is too large or ambiguous to break down fully, STOP and report what you completed and what needs clarification. Partial progress with clear gaps is better than exhausting context.
>
> Save the document when done.

**Step 2: Review the task breakdown**

Use the `review` skill to perform a **Task Breakdown Review** of the tasks at .sdd/{feature}/tasks.md.

**Step 3: Fix issues (if any)**

If the review finds P0 or P1 issues, use the Task tool to launch a subagent to fix them. Do NOT fix them yourself.

**Subagent prompt:**
> Fix the following issues in the task breakdown at .sdd/{feature}/tasks.md, using the design at .sdd/{feature}/design.md as reference:
>
> {paste review findings here}
>
> Save the document when done.

After the fix subagent completes, re-run Step 2 (review). Repeat Steps 2-3 until the review passes.
