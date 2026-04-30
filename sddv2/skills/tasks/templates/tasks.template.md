# Tasks: {Feature Name}

**Linked Design:** `.sdd/{feature}/design.md`
**Linked Specification:** `.sdd/{feature}/specification.md`

### Task {N}: {Short description of the task}

- **Status:** Backlog | In Progress | Done
- **Satisfies:** AC-XX.1, AC-XX.2 (FR-XX)
- **Components touched:** {Component name (kind)}, {Component name (kind)}
- **Files to read:** {Exact file paths the subagent needs for context}
- **Files to modify/create:** {Exact paths to change or create, including test files}

**Subtasks:**
- [ ] {Implementation subtask description}
- [ ] {Another implementation subtask}

**Tests (TDD — write first, must fail):**
- [ ] At least one failing-then-passing test per AC listed above. Each test asserts on the AC's named observable. Choose the boundary; reuse existing fixtures.

**Notes:**

{Brief prose only. The implementation agent reads ONLY this task, not the design. Do NOT copy code blocks from the design. Focus on: key decisions, edge cases, fixture pointers, anything the subtasks don't make obvious. 3–5 sentences max.}

