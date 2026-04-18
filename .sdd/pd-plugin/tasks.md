# Tasks: pd Plugin (Product Design)

**Linked Design:** `.sdd/pd-plugin/design.md`
**Linked Specification:** `.sdd/pd-plugin/specification.md`

> **NOTE: This is a markdown-only plugin — no code, no runtime, no build.**
> Every "implementation" task produces markdown files (SKILL.md, templates, JSON configs, README).
> "Testing" means manually running the skill in Claude Code or Claude Desktop and verifying the output.
> Test checkboxes reference design test scenarios (TS-XX) and are verified manually, not via automation.
>
> Each task produces files that are complete and usable on their own.
> Tasks are ordered by dependencies — later tasks may depend on earlier ones, never the reverse.

---

### Task 1: Plugin scaffold and marketplace registration

- **Status:** Done
- **Requirements:** (structural scaffold — actual FR-01..04 satisfaction is in Tasks 3-6)
- **Files to read:** `.claude-plugin/marketplace.json`, `sddv2/.claude-plugin/plugin.json`
- **Files to modify/create:** `pd/.claude-plugin/plugin.json`, `pd/README.md` (stub), `.claude-plugin/marketplace.json`, `pd/skills/setup/` (empty dir), `pd/skills/product-spec/` (empty dir), `pd/skills/feature-spec/` (empty dir), `pd/skills/bug-report/` (empty dir)

**Subtasks:**
- [x] Create `pd/.claude-plugin/plugin.json` with name "pd", version "0.1.0", and description matching the design
- [x] Create skeleton directories for all four skills: `pd/skills/setup/templates/`, `pd/skills/product-spec/templates/`, `pd/skills/feature-spec/templates/`, `pd/skills/bug-report/templates/`
- [x] Add the `pd` entry to `.claude-plugin/marketplace.json` with name, description, and source fields
- [x] Create `pd/README.md` as a stub with a single heading and placeholder noting it will be expanded in Task 7

**Tests:**
- [x] pd-plugin:TS-01 - Marketplace entry is valid: `pd` appears in marketplace.json with correct name, description, and source
- [x] pd-plugin:TS-02 - Plugin installs correctly: `pd` is discoverable and lists four skill directories
- [x] pd-plugin:TS-03 - README exists and is a valid markdown file (stub content acceptable at this stage)

**Details:**

This task establishes the plugin's identity and directory structure so all subsequent tasks have a home. The `plugin.json` format must match the conventions used by `sddv2/.claude-plugin/plugin.json`. The marketplace entry uses `source: "./pd"` to point at the plugin root. The README is intentionally a stub here — Task 7 expands it with full content after all skills are written. Skeleton directories include the `templates/` subdirectory under each skill so later tasks can write directly into them.

---

### Task 2: Index template for .product/ directory

- **Status:** Done
- **Requirements:** pd-plugin:FR-06
- **Files to read:** `.sdd/pd-plugin/design.md` (Artifact directory layout + index template section)
- **Files to modify/create:** `pd/skills/setup/templates/index.template.md`

**Subtasks:**
- [x] Create `index.template.md` with columns for artifact type, name, date, and status
- [x] Include placeholder rows showing the expected entry format for product specs, feature specs, and bug reports
- [x] Add a header comment explaining that content skills append to this index when saving artifacts

**Tests:**
- [x] pd-plugin:TS-15 - Index template includes columns for type, name, date, and status so that each artifact can be tracked

**Details:**

The index template defines the format of `.product/index.md`, which is created or updated whenever a content skill saves an artifact to the filesystem. It lives under the setup skill's templates because setup is responsible for initializing the `.product/` directory. Each content skill's SKILL.md will reference this template format when appending entries. The template uses `{placeholder}` syntax consistent with sddv2 conventions.

---

### Task 3: Setup skill

- **Status:** Done
- **Requirements:** pd-plugin:FR-01
- **Files to read:** `sddv2/skills/requirements/SKILL.md` (pattern reference), `pd/skills/setup/templates/index.template.md`
- **Files to modify/create:** `pd/skills/setup/SKILL.md`, `pd/skills/setup/templates/guide.template.md`

**Subtasks:**
- [x] Create `guide.template.md` with sections: Project, Documentation Sources, Output Destination, Naming Conventions, Team Terminology & Glossary, Project Context
- [x] Create `SKILL.md` with YAML frontmatter (name, description starting with "Use this skill when...", version)
- [x] Write Phase 1 instructions: check if `.product/guide.md` exists, offer update vs replace if it does
- [x] Write Phase 2 instructions: interview about documentation locations, output destination, naming conventions, team terminology, product glossary
- [x] Write Phase 3 instructions: write guide.md via subagent using guide.template.md
- [x] Write Phase 4 instructions: confirm guide was saved, summarize what was configured

**Tests:**
- [x] pd-plugin:TS-04 - Setup creates guide file: running `pd:setup` in a project with no `.product/` directory results in `.product/guide.md` being created
- [x] pd-plugin:TS-05 - Setup handles existing configuration: running `pd:setup` when `.product/guide.md` exists prompts the user to update or replace

**Details:**

The setup skill is the entry point for new projects. Its SKILL.md must be fully self-contained with all instructions for the four-phase process. The update-vs-replace flow in Phase 1 should read the existing guide and present its current values so the user can confirm or change them. The interview in Phase 2 covers project context that all content skills will reference, so questions should be broad enough to cover B2B SaaS, consumer, and platform projects. The guide.template.md uses `{placeholder}` syntax for all variable sections.

---

### Task 4: Product-spec skill

- **Status:** Done
- **Requirements:** pd-plugin:FR-02, pd-plugin:FR-05, pd-plugin:FR-07, pd-plugin:FR-08, pd-plugin:FR-09, pd-plugin:FR-10
- **Files to read:** `pd/skills/setup/SKILL.md` (for guide.md reference pattern), `sddv2/skills/requirements/SKILL.md` (interview pattern reference), `pd/skills/setup/templates/index.template.md` (index format for filesystem output)
- **Files to modify/create:** `pd/skills/product-spec/SKILL.md`, `pd/skills/product-spec/templates/product-spec.template.md`

**Subtasks:**
- [x] Create `product-spec.template.md` with sections: Metadata table, Problem Statement, Target Users, Current State, Goals & Success Metrics, Proposed Solution, Competitive Landscape (optional), Scope & Boundaries, Risks & Open Questions, Appendix
- [x] Create `SKILL.md` with YAML frontmatter
- [x] Write Phase 1 instructions: read `.product/guide.md` if it exists; check available MCP tools for context; do NOT search codebase unless user requests it
- [x] Write Phase 2 instructions: interview about problem, target users, current state, goals/metrics, solution shape, competitive landscape, scope, risks; probe vague answers with follow-ups
- [x] Write Phase 3 instructions: write draft via subagent using product-spec.template.md
- [x] Write Phase 4 instructions: self-review checklist — all sections filled, goals measurable, scope bounded, no vague language; fix gaps or flag as open questions
- [x] Write Phase 5 instructions: output mode prompt (filesystem to `.product/{name}/product-spec.md`, chat, or MCP), including directory creation, index update, overwrite/version handling, and MCP failure fallback

**Tests:**
- [x] pd-plugin:TS-06 - Product spec interview probes vague answers: giving a vague answer like "we want it to be fast" results in a follow-up question and the final draft contains a measurable metric or flags it as an open question
- [x] pd-plugin:TS-07 - Product spec covers all sections: every template section is filled or explicitly flagged as an open question
- [x] pd-plugin:TS-12 - Filesystem output creates directory and updates index when saving to `.product/`
- [x] pd-plugin:TS-13 - Run pd:product-spec in Claude Desktop (or an environment without filesystem access) and verify the full draft is returned inline in the conversation without errors
- [x] pd-plugin:TS-16 - Name collision prompts user to overwrite or create a versioned copy

**Details:**

This is the first content skill and establishes the shared patterns that feature-spec and bug-report will follow. The no-codebase-by-default behavior (FR-10) must be explicitly stated in Phase 1 instructions. The self-review checklist in Phase 4 is a numbered list of checks the LLM performs on its own draft before presenting it. Output mode logic in Phase 5 must handle all three destinations and include MCP failure recovery (display error, retain draft, re-offer options). The template's optional Competitive Landscape section should be marked with an "(optional)" indicator.

---

### Task 5: Feature-spec skill

- **Status:** Backlog
- **Requirements:** pd-plugin:FR-03, pd-plugin:FR-05, pd-plugin:FR-07, pd-plugin:FR-08, pd-plugin:FR-09, pd-plugin:FR-10
- **Files to read:** `pd/skills/product-spec/SKILL.md` (shared pattern reference), `pd/skills/product-spec/templates/product-spec.template.md` (template pattern reference), `pd/skills/setup/templates/index.template.md` (index format for filesystem output)
- **Files to modify/create:** `pd/skills/feature-spec/SKILL.md`, `pd/skills/feature-spec/templates/feature-spec.template.md`

**Subtasks:**
- [ ] Create `feature-spec.template.md` with sections: Metadata table (including Parent Product Spec field), Problem & Context, User Stories, Acceptance Criteria, UX Flow, Edge Cases & Error States, Dependencies, Success Metrics, Out of Scope, Open Questions, Appendix
- [ ] Create `SKILL.md` with YAML frontmatter
- [ ] Write Phase 1 instructions: read `.product/guide.md`; if codebase access is available, search for related existing functionality; check available MCP tools for context
- [ ] Write Phase 2 instructions: interview about user need, step-by-step UX flow, error states, empty states, permissions, dependencies, success metrics, scope; probe vague answers
- [ ] Write Phase 3 instructions: write draft via subagent using feature-spec.template.md; include parent product spec linkage in frontmatter and prose if provided
- [ ] Write Phase 4 instructions: self-review checklist — acceptance criteria testable (Given/When/Then or equivalent), UX flow complete step-by-step, edge cases cover empty/error/permissions, no vague language
- [ ] Write Phase 5 instructions: output mode prompt with same three destinations, directory creation, index update, overwrite/version handling, and MCP failure fallback

**Tests:**
- [ ] pd-plugin:TS-08 - Feature spec includes codebase context: draft's Problem & Context section includes at least one file or function reference from the codebase when running in Claude Code
- [ ] pd-plugin:TS-09 - Feature spec acceptance criteria are testable: all acceptance criteria use Given/When/Then or equivalent testable format after self-review
- [ ] pd-plugin:TS-17 - No-codebase graceful skip: in Claude Desktop with no codebase access, the skill completes without errors and produces a draft without codebase references
- [ ] pd-plugin:TS-12 - Filesystem output creates directory and updates index
- [ ] pd-plugin:TS-16 - Name collision prompts user to overwrite or create a versioned copy

**Details:**

Output mode behavior (TS-12, TS-16) follows the same pattern as Task 4; verified here for this skill's specific directory convention.

The feature-spec skill searches the codebase by default (opposite of product-spec), so Phase 1 must include explicit instructions to look for related files, functions, and patterns. The parent product spec linkage is optional — if the user provides one, it appears in both the metadata table and the Problem & Context prose. The no-codebase graceful skip (TS-17) means Phase 1 must detect whether codebase tools are available and skip search without erroring. The template's Metadata table must include a "Parent Product Spec" row that can be "N/A" if no parent is specified.

---

### Task 6: Bug-report skill

- **Status:** Backlog
- **Requirements:** pd-plugin:FR-04, pd-plugin:FR-05, pd-plugin:FR-06, pd-plugin:FR-07, pd-plugin:FR-08, pd-plugin:FR-09, pd-plugin:FR-10
- **Files to read:** `pd/skills/product-spec/SKILL.md` (shared pattern reference), `pd/skills/feature-spec/SKILL.md` (codebase search pattern), `pd/skills/setup/templates/index.template.md` (index format for filesystem output)
- **Files to modify/create:** `pd/skills/bug-report/SKILL.md`, `pd/skills/bug-report/templates/bug-report.template.md`

**Subtasks:**
- [ ] Create `bug-report.template.md` with sections: Metadata table, Summary, Steps to Reproduce, Expected Behavior, Actual Behavior, Environment, Impact, Frequency, Supporting Evidence, Related Context (optional), Appendix
- [ ] Create `SKILL.md` with YAML frontmatter
- [ ] Write Phase 1 instructions: read `.product/guide.md`; if codebase access, search for relevant code paths; check available MCP tools for related tickets
- [ ] Write Phase 2 instructions: interview about what happened, help reconstruct reproduction steps from a neutral starting state, expected vs actual, environment, severity, frequency, evidence; probe vague answers
- [ ] Write Phase 3 instructions: write draft via subagent using bug-report.template.md
- [ ] Write Phase 4 instructions: self-review checklist — steps reproducible from neutral state, environment specified, expected vs actual distinct, severity assessed
- [ ] Write Phase 5 instructions: output mode prompt saving to `.product/bugs/{slug}/bug-report.md` (note the bugs/ subdirectory convention), with directory creation, index update, overwrite/version handling, and MCP failure fallback

**Tests:**
- [ ] pd-plugin:TS-10 - Bug report helps reconstruct reproduction steps: when user cannot provide exact steps, the skill helps reconstruct numbered steps from a neutral starting state
- [ ] pd-plugin:TS-11 - Bug report includes code path references: Related Context section includes relevant code paths from the codebase
- [ ] pd-plugin:TS-14 - Bug reports use separate directory: artifact is saved at `.product/bugs/{slug}/bug-report.md`
- [ ] pd-plugin:TS-12 - Filesystem output creates directory and updates index
- [ ] pd-plugin:TS-16 - Name collision prompts user to overwrite or create a versioned copy

**Details:**

Output mode behavior (TS-12, TS-16) follows the same pattern as Task 4; verified here for this skill's specific directory convention.

The bug-report skill differs from product-spec and feature-spec in two ways: it uses the `bugs/` subdirectory convention under `.product/` (FR-06), and its interview includes a reproduction-step reconstruction flow where the skill actively helps the user walk back from the symptom to a reproducible sequence from a neutral state. The Phase 5 output path must default to `.product/bugs/{slug}/bug-report.md` rather than `.product/{name}/`. The codebase search in Phase 1 should focus on code paths related to the reported symptom, not general feature discovery.

---

### Task 7: README expansion and final polish

- **Status:** Backlog
- **Requirements:** pd-plugin:FR-01, pd-plugin:FR-02, pd-plugin:FR-03, pd-plugin:FR-04, pd-plugin:FR-05, pd-plugin:FR-06
- **Files to read:** `pd/.claude-plugin/plugin.json`, `pd/skills/setup/SKILL.md`, `pd/skills/product-spec/SKILL.md`, `pd/skills/feature-spec/SKILL.md`, `pd/skills/bug-report/SKILL.md`
- **Files to modify/create:** `pd/README.md`

**Subtasks:**
- [ ] Write Overview section explaining the plugin's purpose and audience
- [ ] Write Skills section with a subsection for each skill (setup, product-spec, feature-spec, bug-report) including a one-line description and usage trigger
- [ ] Write Output Modes section explaining filesystem, chat, and MCP destinations
- [ ] Write Getting Started section with installation and first-run instructions
- [ ] Write Directory Layout section showing the `.product/` structure
- [ ] Verify all cross-references between README content and actual skill names, triggers, and directory paths

**Tests:**
- [ ] pd-plugin:TS-03 - README accurately describes plugin: lists all four skills with one-line descriptions and usage triggers matching the actual SKILL.md files
- [ ] Verify README accurately describes the filesystem output mode and .product/ directory layout (documentation accuracy for TS-12 behavior)
- [ ] Verify README documents the chat-only output mode (documentation accuracy for TS-13 behavior)
- [ ] Verify README accurately describes the bugs/ subdirectory convention (documentation accuracy for TS-14 behavior)
- [ ] Verify README documents index.md tracking with type, name, date, and status columns (documentation accuracy for TS-15 behavior)
- [ ] Verify README documents the name collision / overwrite-or-version prompt (documentation accuracy for TS-16 behavior)

**Details:**

This final task replaces the stub README from Task 1 with complete documentation. Every skill must be described with its actual trigger name (e.g., `pd:setup`) matching the SKILL.md frontmatter. The Output Modes section should explain all three destinations and when each is the default. The Directory Layout section should show the full `.product/` tree including the `bugs/` subdirectory. All cross-references must be verified against the actual files created in Tasks 1-6 to catch any naming inconsistencies.

---

## Dead Code Tracking

None.

---

## Stub Tracking

```
ST-01: pd/README.md stub
- Reason: Task 1 creates a minimal placeholder; full content written in Task 7
- Status: Pending (resolved by Task 7)
```
