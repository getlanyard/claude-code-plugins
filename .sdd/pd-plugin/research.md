# Research: pd Plugin (Product Design)

## Feature Summary

A new Claude Code plugin called `pd` (product design) for the `cc-plugins` marketplace. It covers product design phases prior to engineering handover: product design spec, feature design spec, and structured bug reports. It follows the same principles as the existing `sddv2` plugin — template-driven, interview-based discovery, consistent artifacts — but targets PMs, POs, solutions consultants, and other non-engineering roles.

The plugin works in both Claude Desktop and Claude Code. In Claude Code, skills that benefit from codebase context use it by default. In Claude Desktop (or any environment without codebase access), the same skills work purely conversationally plus whatever tools/MCP servers the user has available.

---

## Decisions

### Plugin identity and location

**Decision:** Plugin name is `pd`. It lives at `pd/` in the `cc-plugins` marketplace repo, alongside `sdd/`, `sddv2/`, `flow/`.

**Rationale:** Short, memorable, parallel to `sdd`. "Product design" is the domain; `pd` is the abbreviation. Keeping it at the top level of the marketplace matches the existing plugin layout.

### Plugin structure

**Decision:** Follow the same plugin conventions as sddv2:
- `pd/.claude-plugin/plugin.json` (name, version, description)
- `pd/skills/{skill-name}/SKILL.md` with YAML frontmatter
- `pd/skills/{skill-name}/templates/*.template.md`

**Rationale:** Consistency with the marketplace. Users and tooling already understand this layout. The sddv2 pattern of YAML frontmatter (`name`, `description` starting with "Use this skill when...", `version`) is proven and should be reused exactly.

### Three skills

**Decision:** The plugin ships with three skills:

1. **`product-spec`** — product-level design spec (PRD equivalent): vision, personas, problem, goals, success metrics, competitive landscape, scope boundaries.
2. **`feature-spec`** — single-feature design spec: user stories, acceptance criteria, UX flows, edge cases, dependencies, success metrics. More granular than product-spec; optionally links to a parent product spec.
3. **`bug-report`** — structured bug report: summary, reproduction steps, expected vs actual, environment, severity, supporting evidence.

**Rationale:** These are the three most common pre-engineering artifacts that PMs and POs produce. Each has a distinct shape and interview flow. A product spec is strategic (why are we building this?), a feature spec is tactical (what exactly does it do?), and a bug report is reactive (what went wrong?). Combining them would muddle the interview.

### Artifact location and output modes

**Decision:** Default local output goes to `.product/` at the repository or project root. Three output modes are supported:

| Mode | When | Behavior |
|------|------|----------|
| **`.product/` filesystem** | Claude Code (default) | Write to `.product/{name}/product-spec.md`, `.product/{name}/feature-spec.md`, `.product/{name}/bug-report.md` |
| **Chat only** | Claude Desktop or no filesystem | Return finished document in conversation |
| **External via MCP** | User has Jira/Confluence/Linear/GitHub Issues tools | Offer to write artifact via available MCP tools |

Directory layout:
```
.product/
├── index.md                              # inventory of all product design artifacts
├── {name}/
│   ├── product-spec.md
│   ├── feature-spec.md
│   └── bug-report.md
```

`{name}` is kebab-case. The skill offers the user a choice of output mode after the draft is complete.

**Rationale:** `.product/` keeps product-owned artifacts separate from engineering-owned `.sdd/` artifacts. The output mode flexibility is essential because the plugin must work in Claude Desktop (no filesystem), Claude Code (filesystem), and environments with external project-management tools. The skill text is tool-agnostic for external mode — it describes intent ("save this as a Jira ticket") and lets the LLM resolve to available tools.

### Interview model: per-skill, not shared

**Decision:** Each skill has its own baked-in interview flow. There is no shared "discovery" skill.

**Rationale:** This mirrors how sddv2's `requirements` skill bakes in its own Phase 2 interview. Each artifact type asks fundamentally different questions. A product spec interview asks about personas and competitive landscape; a bug report interview asks about reproduction steps and environment. A shared interview would require awkward conditional branching. Keeping interviews co-located with their skill makes the SKILL.md self-contained and easier to maintain.

### Interview principles

**Decision:** Import and adapt from sddv2:
- Keep asking questions until you can unambiguously fill out every section of the template.
- Don't ask about template sections directly — ask about the user's problem, users, and goals.
- Probe vague answers relentlessly — don't accept "intuitive", "fast", "better UX" without specific criteria.
- Write in user/domain language, not technical internals.
- Accept uncertainty — "I don't know" tells you where to focus tool-assisted research.

**Rationale:** These principles are battle-tested in sddv2 and produce higher-quality artifacts. The adaptation for `pd` is mainly about audience — PMs are the interviewee, not engineers — but the underlying rigor is identical.

### Tool-agnostic data gathering

**Decision:** Skill text says "gather context from available tools" and lists the *kinds* of information to look for without naming specific tools. Example phrasing:

> "Before starting the interview, check what context sources are available to you. Look for: existing tickets or issues related to this feature, prior product documents, user feedback or analytics, documentation or wikis. Use whatever tools you have access to — file search, project management tools, documentation platforms — to gather relevant context. Share what you find with the user before proceeding."

**Rationale:** This keeps skill text portable across environments. A user with Jira MCP, a user with Linear MCP, and a user with no external tools all get the same skill — the LLM adapts to what's available. Naming specific tools would make the skill brittle and environment-dependent.

### Codebase reference policy

**Decision:** Different defaults per skill:

| Skill | Codebase by default? | Rationale |
|-------|---------------------|-----------|
| `feature-spec` | Yes (in Claude Code) | Understanding current product behavior is directly valuable when speccing a feature |
| `bug-report` | Yes (in Claude Code) | Identifying likely code paths helps engineers reproduce and fix |
| `product-spec` | No | Product-level specs are about market, users, and strategy — code structure is rarely relevant |

Implementation: each skill's SKILL.md includes conditional guidance like "if you have codebase access, search for how the current product handles related functionality and share relevant findings with the user."

**Rationale:** Codebase context is valuable when the artifact directly relates to existing product behavior (features and bugs). Product specs are strategic and rarely benefit from code-level detail. If a user explicitly asks about current capabilities during a product spec, the skill can reach for the codebase then.

### Relationship to SDD

**Decision:** Fully independent plugin. No hard dependency in either direction.

**Rationale:** A PM can use `pd` without SDD installed; an engineer can use SDD without `pd`. The output of `pd:feature-spec` can optionally serve as input to `sddv2:requirements` or `sddv2:research`, but this integration is a future concern. If both plugins are installed and a feature spec exists at `.product/{feature}/feature-spec.md`, the SDD requirements skill could read it as context — similar to how it reads `.sdd/{feature}/research.md` — but wiring that up is not part of `pd` v1.

---

## Template Sketches

These are not final — they inform the spec phase. Templates will be saved as `templates/*.template.md` within each skill directory.

### Product Spec Template

Path: `.product/{name}/product-spec.md`

```markdown
# Product Design Spec: {Name}

| Field | Value |
|-------|-------|
| Version | {version} |
| Date | {date} |
| Status | Draft / Under Review / Approved |
| Author | {author} |

## Problem Statement

What problem are we solving? Why does it matter? Who told us about it?

## Target Users

**Primary persona(s)** — who they are, what they care about, how they work today.

**Secondary** — who else is affected?

## Current State

How do users solve this today? What are the workarounds? What's the pain?

## Goals & Success Metrics

What does success look like? How will we measure it? (Specific, measurable KPIs)

## Proposed Solution (high level)

What are we building? Not how — just the shape of the solution.

## Competitive Landscape (optional)

How do others solve this? What can we learn?

## Scope & Boundaries

**In scope:**

**Out of scope:**

## Risks & Open Questions

What could go wrong? What don't we know yet?

## Appendix

Glossary, references, change history.
```

### Feature Spec Template

Path: `.product/{name}/feature-spec.md`

```markdown
# Feature Design Spec: {Name}

| Field | Value |
|-------|-------|
| Version | {version} |
| Date | {date} |
| Status | Draft / Under Review / Approved |
| Author | {author} |
| Parent Product Spec | {link or "N/A"} |

## Problem & Context

What user need does this feature address? Brief context.

## User Stories

As a [persona], I want [action], so that [outcome].

## Acceptance Criteria

Given [context], when [action], then [result]. (User-facing, testable)

## UX Flow

Step-by-step happy path. Reference wireframes/mockups if they exist.

## Edge Cases & Error States

What happens when things go wrong? Empty states, permissions, limits?

## Dependencies

Other features, services, or teams this depends on.

## Success Metrics

How do we know this feature worked? What moves?

## Out of Scope

What this feature does NOT do.

## Open Questions

## Appendix
```

### Bug Report Template

Path: `.product/{name}/bug-report.md`

```markdown
# Bug Report: {Title}

| Field | Value |
|-------|-------|
| Date | {date} |
| Reporter | {reporter} |
| Severity | Critical / High / Medium / Low |
| Status | Open / Investigating / Resolved |

## Summary

One-sentence description of the bug.

## Steps to Reproduce

Numbered steps from a neutral starting state.

1. Go to...
2. Click...
3. Enter...

## Expected Behavior

What should have happened.

## Actual Behavior

What actually happened. Include exact error messages if any.

## Environment

OS, browser/app version, device, account type, feature flags, etc.

## Impact

How many users affected? Business impact? Workaround available?

## Frequency

Always | Sometimes (x/y attempts) | Once | Unknown

## Supporting Evidence

Screenshots, recordings, console logs, network traces.

## Related Context (optional)

Links to related tickets, recent deployments, similar past bugs.
Code paths (if codebase access is available).

## Appendix
```

---

## Interview Question Sketches

These are starting points for each skill's baked-in interview flow. The actual SKILL.md will describe the interview as principles and guidance, not a rigid script.

### product-spec interview

- What product or initiative is this for?
- Who are the target users? Can you describe a typical day for them?
- What problem are they experiencing? How did you learn about it?
- How do they solve it today? What's painful about the workaround?
- What does success look like? If we shipped this and it worked perfectly, what would change?
- How would you measure that change? What metric would move?
- Have you looked at how competitors handle this? What do they do well/poorly?
- What's the timeline or urgency?
- What's explicitly NOT in scope?
- What are the biggest risks or unknowns?

### feature-spec interview

- What product does this feature belong to? (If a product spec exists, reference it)
- What user need does this feature address?
- Can you walk me through what the user would do, step by step?
- What happens if they make a mistake? What error states are possible?
- Are there permission or access considerations?
- What should the empty state look like (before any data exists)?
- Does this depend on any other features or services?
- How will you validate this works? What would you check in the UI/product?
- What does success look like for this specific feature?
- What have you explicitly decided NOT to include?

### bug-report interview

- What happened? Give me the one-sentence version.
- What were you trying to do when you encountered it?
- Walk me through exactly what you did, step by step from the beginning.
- What did you expect to happen at step N?
- What actually happened instead? Any error messages?
- What browser/OS/device/app version are you on?
- Does this happen every time, or only sometimes?
- Has this ever worked? When did it start failing?
- How many users are affected? Is there a workaround?
- Do you have screenshots, recordings, or logs?

---

## Conventions to Follow from the Marketplace

Based on the existing sddv2 plugin structure:

### Plugin config

`pd/.claude-plugin/plugin.json` with `name`, `version`, `description` fields. Example:

```json
{
  "name": "pd",
  "version": "0.1.0",
  "description": "Product Design — template-driven skills for product specs, feature specs, and structured bug reports. Covers product design phases prior to engineering handover with interview-based discovery and consistent artifacts."
}
```

### SKILL.md format

YAML frontmatter with `name`, `description` (starting with "Use this skill when..."), `version`. Body contains practical guidelines, path tables, and process instructions. Example frontmatter:

```yaml
---
name: product-spec
description: Use this skill when creating a product design spec (PRD). Conducts a discovery interview and produces a structured product spec covering problem, users, goals, success metrics, and scope.
version: 0.1.0
---
```

### Path tables

Skills reference artifact paths via table variables, following sddv2's pattern:

```markdown
| Variable | Path |
|----------|------|
| `PD_FOLDER` | `.product/` |
| `PD_INDEX` | `.product/index.md` |
| `PD_PROJECT_FOLDER` | `.product/{NAME}/` |
| `PD_PRODUCT_SPEC` | `.product/{NAME}/product-spec.md` |
| `PD_FEATURE_SPEC` | `.product/{NAME}/feature-spec.md` |
| `PD_BUG_REPORT` | `.product/{NAME}/bug-report.md` |
```

### Other conventions

- Templates are markdown skeletons with `{placeholder}` text, optional-section markers, and guidance comments
- Skills delegate document writing to subagents via the Task tool
- Skills include a review phase (self-review or review skill invocation)
- Artifacts are kebab-case named
- The marketplace root `.claude-plugin/marketplace.json` needs an entry for `pd`

---

## Codebase Orientation

The plugin will live at `/home/pete/dev/cc-plugins/pd/` alongside the existing plugins:

```
cc-plugins/
├── .claude-plugin/marketplace.json   # add pd entry here
├── sdd/                              # legacy SDD
├── sddv2/                            # current SDD
├── flow/                             # RFC workflow
├── pd/                               # NEW — product design
│   ├── .claude-plugin/plugin.json
│   ├── README.md
│   └── skills/
│       ├── product-spec/
│       │   ├── SKILL.md
│       │   └── templates/product-spec.template.md
│       ├── feature-spec/
│       │   ├── SKILL.md
│       │   └── templates/feature-spec.template.md
│       └── bug-report/
│           ├── SKILL.md
│           └── templates/bug-report.template.md
```

---

## Open Questions for Spec/Design Phase

1. **Review skill or self-review?** Should `pd` include its own review skill, or is self-review (inline in each skill) sufficient for v1? SDD has a dedicated review skill because design and implementation reviews are complex; product specs may not need that level of rigor.

2. **Single index or per-type indexes?** Should `.product/index.md` track all three artifact types in one index, or use separate indexes per type?

3. **Bug report directory model.** Bug reports don't naturally fit the `.product/{feature}/` directory model — they're often about existing features, not new ones. Should bug reports use a different naming scheme like `.product/bugs/{slug}/bug-report.md`?

4. **Parent spec linkage.** How should the feature spec link to a parent product spec? Frontmatter field? Prose reference? The template sketch uses a metadata table row, which seems sufficient.

5. **Setup skill.** Does the plugin need a `setup` skill (like sddv2's) to discover project conventions, or is that overkill for product-design artifacts that don't depend on code conventions?
