# Tasks: {Feature Name}

**Linked Design:** `.sdd/{feature}/design.md`
**Linked Specification:** `.sdd/{feature}/specification.md`

> **CRITICAL: Tests are written WITH implementation, not after.**
> Each task that adds or modifies functionality MUST include writing tests as part of that task.
> Do NOT create separate "Add tests" tasks or defer testing to later.
> TDD approach: Write failing test → Implement → Verify test passes → Refactor.
>
> Each task must produce code that compiles, passes tests, and can be reviewed independently.
> Tasks are ordered by dependencies — later tasks may depend on earlier ones, never the reverse.

---

### Task {N}: {Short description of the task}

- **Status:** Backlog | In Progress | Done
- **Requirements:** {feature-name:FR-XXX}, {feature-name:NFR-XXX}
- **Files to read:** {Exact file paths the subagent needs for context}
- **Files to modify/create:** {Exact paths to change or create, including test files}

**Subtasks:**
- [ ] {Implementation subtask description}
- [ ] {Another implementation subtask}

**Tests:**
- [ ] {feature-name:ComponentName/TS-XX} - {Brief description of what the test verifies}
- [ ] {feature-name:ITS-XX} - {Brief description of what the test verifies}
- [ ] {feature-name:E2E-XX} - {Brief description of what the test verifies}

**Details:**

{Brief prose only. The implementation agent reads ONLY this task, not the design. Do NOT copy code blocks from the design. Focus on: key decisions, edge cases, and anything the subtasks don't make obvious. Keep to 3-5 sentences max per task.}

---

## Dead Code Tracking

> Code introduced in earlier tasks that will be used in later tasks must be tracked here.
> All entries must be resolved (code used or removed) by the final task.

**DC-XX: {Component or code name}**
- Reason: {Why this dead code exists}
- Status: {Pending | Resolved}

---

## Stub Tracking

> **CRITICAL: Stubs are NOT acceptable without explicit tracking.**
> All stubs MUST be fully implemented as part of the task that introduces the code they test.
> If a stub is absolutely necessary (e.g., external dependency not yet available), it MUST be tracked here.
> All entries must be resolved (stub implemented or removed) by the final task.
> A "stub" includes: `skip`, `todo`, `pass`, `pytest.mark.skip`, `@unittest.skip`, `it.skip`, `xit`, `pending`, empty test bodies, or `assert True` placeholders.

**ST-XX: {Test name}**
- Reason: {Why this stub exists}
- Status: {Pending | Resolved}
