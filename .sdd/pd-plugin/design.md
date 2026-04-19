# Design: pd Plugin (Product Design)

**Version:** 1.2
**Date:** 2026-04-12
**Status:** Draft
**Linked Specification:** `.sdd/pd-plugin/specification.md`

---

# Design Document

---

## Architecture Overview

### Current Architecture Context

The `cc-plugins` marketplace contains plugin directories (`sdd/`, `sddv2/`, `flow/`) each following a common structure: `.claude-plugin/plugin.json`, `skills/{name}/SKILL.md`, and `skills/{name}/templates/`. The marketplace root `.claude-plugin/marketplace.json` registers each plugin. The `pd` plugin adds a new top-level directory following the same conventions.

### Proposed Architecture

The `pd` plugin is a set of markdown files -- no runtime, no dependencies, no build. It contains four skills (setup, product-spec, feature-spec, bug-report) that follow the same SKILL.md + template pattern as sddv2. Each content skill uses a four-phase process: gather context, interview, write draft, self-review. Output goes to `.product/` on the filesystem, inline in chat, or to external tools via MCP.

### Technology Decisions

- Markdown-only plugin; no runtime dependencies or build steps
- YAML frontmatter matching sddv2 conventions (`name`, `description` starting with "Use this skill when...", `version`)
- Template placeholders use `{curly braces}` consistent with sddv2 templates
- Interview structure follows sddv2's `requirements` skill pattern (gather context, interview, write via subagent, self-review)
- Output mode logic is text instructions baked into each SKILL.md, not code
- Artifacts use kebab-case naming

### Quality Attributes

- Consistency with existing marketplace plugin conventions
- Self-contained skills -- each SKILL.md is fully readable without cross-references

---

## Modified Components

### `.claude-plugin/marketplace.json`

**Change Description:** Currently lists existing plugins (sdd, sddv2, flow). Add a `pd` entry with name, description, and path.

**Dependants:** None

**Kind:** JSON config file

**Details**
```json
{
  "name": "pd",
  "description": "Product Design — skills for product specs, feature specs, and bug reports",
  "source": "./pd"
}
```

**Requirements References**
- pd-plugin:FR-01 through FR-10: Plugin must be discoverable in the marketplace

**Test Scenarios**

**TS-01: Marketplace entry is valid**
- Given: The `cc-plugins` repo with the updated `marketplace.json`
- When: A user browses available plugins
- Then: The `pd` plugin appears with its name and description

---

## Added Components

### plugin.json

**Description:** Plugin identity file declaring name, version, and description for the pd plugin.

**Users:** Claude Code plugin discovery system

**Kind:** JSON config file

**Location:** `pd/.claude-plugin/plugin.json`

**Details**
```json
{
  "name": "pd",
  "version": "0.1.0",
  "description": "Product Design — template-driven skills for product specs, feature specs, and structured bug reports."
}
```

**Requirements References**
- pd-plugin:FR-01 through FR-10: All skills require the plugin to be installable

**Test Scenarios**

**TS-02: Plugin installs correctly**
- Given: A user adds `pd` to their Claude Code plugins
- When: They check installed plugins
- Then: `pd` appears with four skills: setup, product-spec, feature-spec, bug-report

---

### README.md

**Description:** User-facing overview explaining what the plugin does, its four skills, output modes, and how to get started. Not traced to a specific FR — included as standard plugin packaging practice per marketplace conventions.

**Users:** PMs, POs, solutions consultants evaluating or onboarding to the plugin

**Kind:** Markdown documentation

**Location:** `pd/README.md`

**Details**
```
Sections: Overview, Skills (setup, product-spec, feature-spec, bug-report),
Output Modes (.product/ filesystem, chat, MCP external tools),
Getting Started, Directory Layout
```

**Requirements References**
- pd-plugin:FR-01 through FR-06: README documents all user-facing capabilities

**Test Scenarios**

**TS-03: README accurately describes plugin**
- Given: A user reads the README
- When: They follow the Getting Started instructions
- Then: The README lists all four skills (setup, product-spec, feature-spec, bug-report) with a one-line description and usage trigger for each

---

### setup SKILL.md + guide.template.md

**Description:** The setup skill interviews the user about their product environment and persists the configuration to `.product/guide.md`. Covers: documentation locations, output preferences, naming conventions, team terminology, product glossary, and project context. Subsequent content skills reference this guide for context and output destination.

**Users:** PMs running `pd:setup` to configure their project

**Kind:** Skill definition + template

**Location:** `pd/skills/setup/SKILL.md`, `pd/skills/setup/templates/guide.template.md`

**Details**
```
SKILL.md process:
  Phase 1: Check if .product/guide.md exists (offer update vs replace)
  Phase 2: Interview about documentation locations, output destination,
           naming conventions, team terminology, product glossary
  Phase 3: Write guide.md via subagent using guide.template.md
  Phase 4: Confirm guide was saved, summarize what was configured

guide.template.md sections:
  Project, Documentation Sources, Output Destination, Naming Conventions,
  Team Terminology & Glossary, Project Context
```

**Requirements References**
- pd-plugin:FR-01: Setup skill configures project environment

**Test Scenarios**

**TS-04: Setup creates guide file**
- Given: A project with no `.product/` directory
- When: The user runs `pd:setup` and answers interview questions
- Then: `.product/guide.md` is created with the provided information

**TS-05: Setup handles existing configuration**
- Given: A project with an existing `.product/guide.md`
- When: The user runs `pd:setup`
- Then: The skill asks whether to update or replace the existing guide

---

### product-spec SKILL.md + product-spec.template.md

**Description:** Conducts an interview about a product initiative, then produces a structured product spec. Does not search the codebase by default. Uses available MCP tools to gather context. Probes vague answers. Performs self-review before finalizing.

**Users:** PMs creating product design specs

**Kind:** Skill definition + template

**Location:** `pd/skills/product-spec/SKILL.md`, `pd/skills/product-spec/templates/product-spec.template.md`

**Details**
```
SKILL.md process:
  Phase 1: Read .product/guide.md if it exists; check available tools for
           context (existing docs, tickets, feedback) — do NOT search codebase
           unless user requests it
  Phase 2: Interview about problem, target users, current state, goals/metrics,
           solution shape, competitive landscape, scope, risks
  Phase 3: Write draft via subagent using product-spec.template.md
  Phase 4: Self-review checklist — all sections filled, goals measurable,
           scope bounded, no vague language; fix gaps or flag as open questions
  Phase 5: Offer output mode (filesystem / chat / MCP)

product-spec.template.md sections:
  Metadata table, Problem Statement, Target Users, Current State,
  Goals & Success Metrics, Proposed Solution, Competitive Landscape (optional),
  Scope & Boundaries, Risks & Open Questions, Appendix
```

**Requirements References**
- pd-plugin:FR-02: Product spec skill produces structured spec
- pd-plugin:FR-07: Probes vague answers
- pd-plugin:FR-08: Tool-agnostic context gathering
- pd-plugin:FR-09: Inline self-review
- pd-plugin:FR-10: Does not search codebase by default

**Test Scenarios**

**TS-06: Product spec interview probes vague answers**
- Given: A user running `pd:product-spec`
- When: They answer "we want it to be fast"
- Then: The skill asks for a measurable definition before proceeding, and the final draft either contains a measurable metric replacing the vague term, or flags it explicitly as an open question

**TS-07: Product spec covers all sections**
- Given: A completed product-spec interview
- When: The draft is generated
- Then: Every template section is filled or explicitly flagged as an open question

---

### feature-spec SKILL.md + feature-spec.template.md

**Description:** Conducts an interview about a single feature, then produces a structured feature spec. Searches the codebase by default in Claude Code. Optionally links to a parent product spec. Probes vague answers. Performs self-review.

**Users:** PMs and POs specifying individual features

**Kind:** Skill definition + template

**Location:** `pd/skills/feature-spec/SKILL.md`, `pd/skills/feature-spec/templates/feature-spec.template.md`

**Details**
```
SKILL.md process:
  Phase 1: Read .product/guide.md; if codebase access, search for related
           existing functionality; check available tools for context
  Phase 2: Interview about user need, step-by-step UX flow, error states,
           empty states, permissions, dependencies, success metrics, scope
  Phase 3: Write draft via subagent using feature-spec.template.md
  Phase 4: Self-review checklist — acceptance criteria testable, UX flow
           complete step-by-step, edge cases cover empty/error/permissions,
           no vague language; fix gaps or flag as open questions
  Phase 5: Offer output mode

feature-spec.template.md sections:
  Metadata table (incl. Parent Product Spec), Problem & Context,
  User Stories, Acceptance Criteria, UX Flow, Edge Cases & Error States,
  Dependencies, Success Metrics, Out of Scope, Open Questions, Appendix
```

**Requirements References**
- pd-plugin:FR-03: Feature spec skill produces structured spec
- pd-plugin:FR-07: Probes vague answers
- pd-plugin:FR-08: Tool-agnostic context gathering
- pd-plugin:FR-09: Inline self-review
- pd-plugin:FR-10: Searches codebase by default

**Test Scenarios**

**TS-08: Feature spec includes codebase context**
- Given: A user running `pd:feature-spec` in Claude Code with existing code
- When: The feature relates to existing functionality
- Then: The draft's Problem & Context section includes at least one file or function reference from the codebase

**TS-09: Feature spec acceptance criteria are testable**
- Given: A completed feature-spec draft
- When: The self-review runs
- Then: All acceptance criteria are in Given/When/Then or equivalent testable format

**TS-17: No-codebase graceful skip**
- Given: Claude Desktop with no codebase access
- When: The user runs feature-spec
- Then: The skill completes the interview and produces a draft without codebase references and without errors

**Requirements References:** pd-plugin:FR-10

---

### bug-report SKILL.md + bug-report.template.md

**Description:** Conducts an interview about a bug, then produces a structured bug report. Searches the codebase by default in Claude Code to find relevant code paths. Helps reconstruct reproduction steps. Performs self-review.

**Users:** PMs and QA reporting bugs

**Kind:** Skill definition + template

**Location:** `pd/skills/bug-report/SKILL.md`, `pd/skills/bug-report/templates/bug-report.template.md`

**Details**
```
SKILL.md process:
  Phase 1: Read .product/guide.md; if codebase access, search for relevant
           code paths; check available tools for related tickets
  Phase 2: Interview about what happened, reproduction steps from neutral
           state, expected vs actual, environment, severity, frequency,
           evidence
  Phase 3: Write draft via subagent using bug-report.template.md
  Phase 4: Self-review checklist — steps reproducible from neutral state,
           environment specified, expected vs actual distinct, severity
           assessed; fix gaps or flag as open questions
  Phase 5: Offer output mode

bug-report.template.md sections:
  Metadata table, Summary, Steps to Reproduce, Expected Behavior,
  Actual Behavior, Environment, Impact, Frequency, Supporting Evidence,
  Related Context (optional), Appendix
```

**Requirements References**
- pd-plugin:FR-04: Bug report skill produces structured report
- pd-plugin:FR-07: Probes vague answers
- pd-plugin:FR-08: Tool-agnostic context gathering
- pd-plugin:FR-09: Inline self-review
- pd-plugin:FR-10: Searches codebase by default

**Test Scenarios**

**TS-10: Bug report helps reconstruct reproduction steps**
- Given: A user who cannot provide exact reproduction steps
- When: They describe what they were doing before the bug
- Then: The skill helps reconstruct numbered steps from a neutral starting state

**TS-11: Bug report includes code path references**
- Given: A user running `pd:bug-report` in Claude Code
- When: The draft is generated
- Then: A Related Context section includes relevant code paths found in the codebase

---

### Output mode logic (shared pattern)

**Description:** Each content skill (product-spec, feature-spec, bug-report) includes output mode instructions after the draft is finalized. This is a shared pattern baked into each SKILL.md, not a separate file.

**Users:** All content skills internally

**Kind:** Text instructions within each SKILL.md

**Location:** Embedded in each content skill's SKILL.md (Phase 5)

**Details**
```
After finalizing the draft, prompt:
  "Where would you like to save this?"
  - .product/ directory (default when filesystem available)
  - Inline in conversation (default when no filesystem)
  - External tool via MCP (only if MCP tools detected)
If saving to filesystem: follow directory layout (FR-06), update index
If file exists: ask overwrite or versioned copy
If .product/ doesn't exist: create it
If an MCP write fails (network error, auth failure, tool rejects payload),
  the skill displays the error, retains the draft in the conversation,
  and re-offers the output options so the user can choose an alternative
  (e.g., filesystem or chat)
```

**Requirements References**
- pd-plugin:FR-05: Three output modes for all content skills

**Test Scenarios**

**TS-12: Filesystem output creates directory and updates index**
- Given: A user saves a product spec to `.product/`
- When: The file is written
- Then: The artifact is at `.product/{name}/product-spec.md` and `.product/index.md` is updated

**TS-13: Chat-only output in Claude Desktop**
- Given: A user running a content skill in Claude Desktop (no filesystem)
- When: The draft is complete
- Then: The full draft is returned inline in the conversation

---

### Artifact directory layout + index template

**Description:** Defines the `.product/` directory structure and the `index.md` template that tracks all artifacts.

**Users:** All content skills when saving to filesystem

**Kind:** Directory convention + index template

**Location:** Convention enforced by each SKILL.md; index template embedded in skill instructions

**Details**
```
.product/
  index.md              — inventory: type, name, date, status per artifact
  {name}/
    product-spec.md
    feature-spec.md
  bugs/{slug}/
    bug-report.md
```

**Requirements References**
- pd-plugin:FR-06: Artifact directory layout and index

**Test Scenarios**

**TS-14: Bug reports use separate directory**
- Given: A user saves a bug report
- When: The file is written
- Then: It is saved at `.product/bugs/{slug}/bug-report.md`

**TS-15: Index lists all artifact types**
- Given: Multiple artifacts saved to `.product/`
- When: The user checks `.product/index.md`
- Then: Each artifact appears with type, name, date, and status

**TS-16: Name collision prompts user**
- Given: `.product/user-onboarding/product-spec.md` already exists
- When: The user runs product-spec and names it 'user-onboarding'
- Then: The skill asks whether to overwrite or create a versioned copy (e.g., `user-onboarding-2`)

**Requirements References:** pd-plugin:FR-06

---

## Used Components

### sddv2 plugin

**Location:** `sddv2/`

**Provides:** Pattern reference for SKILL.md conventions (YAML frontmatter format, path tables, interview structure, subagent delegation, review phases), template conventions (`{placeholder}` syntax, optional-section markers)

**Used By:** All added SKILL.md and template components (as structural reference, not runtime dependency)

### Claude Code plugin system

**Location:** Built into Claude Code runtime

**Provides:** Discovery of plugins via `.claude-plugin/plugin.json` and skills via `skills/` directory structure

**Used By:** plugin.json, all SKILL.md files

---

## Documentation Considerations

- `pd/README.md` is part of the deliverable and covers all user-facing documentation
- No API docs needed (no API)
- No separate developer docs needed

---

## Test Data

- A test project directory for running QA scenarios
- Sample interview answers covering both complete and deliberately vague inputs

---

## Test Feasibility

- All test scenarios are manual QA: install the plugin, run the skill, verify output
- No test infrastructure required beyond a Claude Code or Claude Desktop environment
- QA-01 through QA-08 from the spec are all feasible as described; each requires only running a skill and inspecting the output

---

## Risks and Dependencies

- **Risk:** Interview questions may not cover all domains (B2B SaaS vs consumer mobile vs platform). **Mitigation:** Keep questions general; domain context comes from the setup guide.
- **Risk:** Self-review without a dedicated review skill may miss gaps. **Mitigation:** v1 is scoped this way; a dedicated review skill can be added in v2 if self-review proves insufficient.
- **Dependency:** Claude Code plugin system must discover skills via the `skills/` directory convention.
- **Dependency:** `.claude-plugin/marketplace.json` format must remain stable.
- **Note:** The research document's codebase orientation tree predates the setup skill decision and omits `pd/skills/setup/`; this is stale context but does not affect the design.

---

## Feasibility Review

- No missing features or infrastructure. The plugin system and SKILL.md conventions are proven by sddv2.
- All deliverables are markdown files that can be authored in a single iteration.

---

## Task Breakdown

<!-- populated during task planning -->

---

## Dead Code Tracking

<!-- populated during implementation -->

---

## Stub Tracking

<!-- populated during implementation -->

---

## Appendix

### Glossary
- **pd:** Product design. The plugin abbreviation, parallel to `sdd`.
- **SKILL.md:** Markdown file defining a skill's behavior via YAML frontmatter and LLM instructions.
- **MCP:** Model Context Protocol. Mechanism for Claude to connect to external tools.
- **Artifact:** A product design document produced by a skill.

### References
- [Specification](/home/pete/dev/cc-plugins/.sdd/pd-plugin/specification.md)
- [Research](/home/pete/dev/cc-plugins/.sdd/pd-plugin/research.md)
- [sddv2 requirements SKILL.md](/home/pete/dev/cc-plugins/sddv2/skills/requirements/SKILL.md) (pattern reference)

### Change History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-12 | Pete | Initial design |
| 1.1 | 2026-04-18 | Pete | Address review findings: MCP failure handling, concrete test assertions, stale research note, name collision and no-codebase test scenarios, README traceability |
| 1.2 | 2026-04-18 | Pete | Fix marketplace.json key (path→source), align TS-16 with spec's versioned-copy language, fix Feasibility typo |
