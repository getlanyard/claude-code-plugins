---
name: implement
description: Implement SDD features task-by-task following the design document. Use this skill when implementing features or auto-implementing designs. One subagent per task, review at the end. Use the tasks skill for task breakdown.
version: 0.1.0
---

# Implement

## Practical Guidelines

### Project Structure

All SDD artifacts live in `.sdd/{feature}/` where `{feature}` is the kebab-case feature name (e.g., `user-authentication`).

### Project Guidelines

Use the `handbook` skill to read and resolve project conventions before implementing.

### Domain Skills

After exploring the codebase with the Explore tool and understanding the task, identify which domain skills apply:

- **distributed-systems**: Multiple services, network coordination, eventual consistency
- **low-level-systems**: Memory management, performance-critical, OS interfaces
- **security**: Auth, untrusted input, sensitive data, compliance
- **infrastructure**: Cloud resources, IaC, networking, disaster recovery
- **devops-sre**: CI/CD, deployment, observability, SLOs
- **data-engineering**: Pipelines, ETL, schema evolution, data quality
- **api-design**: Public/internal APIs, versioning, contracts

Load relevant skills and apply their mindset and practices throughout implementation.

## Process

### Orchestrator Discipline

You are a coordinator. Your context window must stay lean across all tasks.

- **Do NOT** read source code or test files yourself
- **Do NOT** run tests, linters, or builds yourself
- When reading SDD documents (tasks, design), extract only what the current subagent needs — do not load entire documents when a section suffices
- Your only jobs: extract context for subagents, launch them, track progress, relay review findings

### Implementing

Your **GOAL** is to implement all tasks from the task breakdown. One subagent per task. One commit per task. Review at the end.

**CRITICAL**: Execute ONE subagent at a time. NEVER launch multiple Task tool calls in a single message.

**Step 0: Preparation**

Read .sdd/{feature}/tasks.md to get the ordered task list. This is your roadmap.

**Step 1: Implement each task**

For each task in order:

**1a. Task subagent** (MUST use Task tool — one subagent per task)

Before launching, prepare the subagent's context:
1. Extract the single task from .sdd/{feature}/tasks.md (including subtasks, tests, details, and file lists)
2. Extract ONLY the component sections from .sdd/{feature}/design.md referenced by this task
3. Paste both into the subagent prompt below

Do NOT pass the specification — the design already incorporates it.

> Implement task {N} for {FEATURE}.
>
> **Task:**
> {paste the single task here — subtasks, tests, details, file lists}
>
> **Relevant design context:**
> {paste relevant design sections here}
>
> **Project guidelines:** Use the `handbook` skill to read and follow project conventions.
>
> **Testing (read this carefully):**
> - Before writing any test, explore the existing test suite to understand test patterns, fixtures, and helpers already in use. Use them. Do NOT build parallel mock infrastructure when integration test support already exists.
> - Write the test FIRST. Run it. It MUST fail. If it passes immediately, your test is wrong — fix it before writing any implementation code.
> - Every test must actually verify the behavior its name claims. A test called `emits_storage_event` that only checks a 204 status code is a lie — it must assert on the actual event. If you can delete the feature and the test still passes, the test is worthless.
> - Use real code paths, not mocks, unless the dependency is truly external and unavailable in test. Mocks that return canned responses test nothing.
> - After all tests pass, run the full test suite and include the output in your response. Do NOT claim "tests pass" without evidence.
>
> **Other rules:**
> - One commit per task
> - Check off completed subtask and test checkboxes in .sdd/{feature}/tasks.md, update status to "Done"
> - Only add comments where logic isn't self-evident
> - **NEVER** add SDD artifact references in code or tests (no FR-XXX, TS-XX, requirement IDs, scenario IDs)
> - Track any dead code in the Dead Code Tracking section of .sdd/{feature}/tasks.md
> - Track any stubs in the Stub Tracking section of .sdd/{feature}/tasks.md
>
> **Escalation:** If you need to understand code beyond what's provided, or the task is too large for your remaining context, STOP and report what you completed and what remains. Partial progress with a clear handoff is better than exhausting context.

**1b. Next task** — move to the next task, repeat Step 1a.

**Step 2: Review**

After all tasks are complete, use the `review` skill to perform an **Implementation Review**.

**Step 3: Fix issues (if any)**

If the review finds P0 or P1 issues, use the Task tool to launch a fix subagent:

> Fix the following issues in the implementation for {FEATURE}:
>
> {paste review findings here}
>
> **Project guidelines:** Use the `handbook` skill to read and follow project conventions.
>
> Commit each fix. Run tests and linting after each fix. Update checkboxes in .sdd/{feature}/tasks.md as needed.
>
> **Escalation:** If a fix requires changes beyond the scope of the review findings, STOP and report what needs broader attention.

After the fix subagent completes, re-run Step 2 (review). Repeat Steps 2-3 until the review passes.

**Step 4: Final validation**

Verify:
- All subtask and test checkboxes in .sdd/{feature}/tasks.md are checked
- All dead code has been resolved (used or removed)
- All stubs have been resolved (implemented or removed)
- All tests pass
- Code lints clean
