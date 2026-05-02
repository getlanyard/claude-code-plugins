---
name: implement
description: Implement SDD features task-by-task following the design document. Use this skill when implementing features or auto-implementing designs. One subagent per task, review at the end. Use the tasks skill for task breakdown.
version: 0.2.3
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
> - **Scope of TDD:** application business logic and reusable IaC modules. Provisioning configs (root modules, env-specific stacks) and imperative scripts (migrations, runbooks) may be created and linted in a task, but NEVER executed during implementation. Their execution mutates real state and belongs to the user.
> - **NFRs are exempt from TDD.** Architectural choices satisfy them; instrumentation observes them where possible. If a task implements an app-instrumented NFR, add the named metric or log; do not write a test asserting the threshold. Platform-observed and architectural-only NFRs need no code.
> - If an AC can only be verified after such execution (e.g., a queue must exist for the feature to receive messages), implement and lint the artefact, then pause and ask the user to apply or run it. Resume verification once they confirm.
> - Before writing any test, explore the existing test suite for patterns, fixtures, and helpers. Reuse them. Do NOT build parallel mock infrastructure when integration test support already exists.
> - For each AC listed in this task's `Satisfies:` field, write at least one test whose failure would mean the AC is unmet. Write it FIRST. Run it. It MUST fail. If it passes immediately, the test is wrong — fix it before writing any implementation code.
> - Each test must assert on the AC's named observable — the system, artifact, and value the spec stated. A test whose Then paraphrases the When ("when reset is requested, then it was requested") is a tautology. Delete and replace.
> - Do NOT write standalone tests for components that have no AC of their own (plumbing). They're covered transitively. If you feel a plumbing test is needed, the AC test isn't reaching the real path — fix the AC test instead.
> - Use real code paths, not mocks, unless the dependency is truly external and unavailable in test. Mocks that return canned responses test nothing.
> - You choose test count and boundary (unit/integration). The Tests bullet in the task lists AC IDs, not a fixed number of tests.
> - **Test code is production code.** Apply the same engineering standards: DRY, clear names, shared fixtures and helpers reused across tests, no copy-pasted setup. If the same arrange block appears in three tests, extract a helper. If two tests differ only in input data, parameterise. Tests are read more often than they're written.
> - After all tests pass, run the full test suite and include the output in your response. Do NOT claim "tests pass" without evidence.
>
> **Other rules:**
> - Implement only what this task's AC require. A component's full design may not be reached until a later task — that's expected. Do not pre-build methods, branches, or error paths for AC owned by other tasks. If you find yourself adding code with no test in this task that exercises it, stop — it belongs in the task that needs it.
> - One commit per task
> - Check off completed subtask and test checkboxes in .sdd/{feature}/tasks.md, update status to "Done"
> - Only add comments where logic isn't self-evident
> - **NEVER** add SDD artifact references in code or tests (no FR-XXX, NFR-XXX, AC-XXX, REQ-XXX)
> - Stubs (`skip`, `todo`, `pending`, empty test bodies, `assert True`) and dead code are forbidden. If a genuine external blocker forces one, note it in the task's Notes section and resolve before the final task.
> - Never run `terraform apply`, `kubectl apply`, `ansible-playbook`, database migrations, or any imperative script that mutates live state. Linting and validation (`terraform validate`, `kubectl diff`, `shellcheck`, etc.) are fine. If execution is required to verify an AC, ask the user — they perform it, you wait.
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
