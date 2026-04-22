# pd — Product Design Plugin

Template-driven skills for product specs, feature specs, and structured bug reports. The `pd` plugin guides you through discovery interviews, writes structured drafts using templates, runs a self-review checklist, and saves artifacts to the filesystem, chat, or an external tool.

Built for product managers, product owners, and solutions consultants who need to produce clear, consistent product documentation. Works in both Claude Code and Claude Desktop.

## Skills

### `pd:setup`

**Description:** Configure the product design environment for this project. Use this skill when setting up pd for the first time or updating project conventions.

**What it produces:** `.product/guide.md` (project guide) and `.product/index.md` (artifact index). All other skills reference the guide for team conventions, terminology, and output preferences.

### `pd:product-spec`

**Description:** Create a structured product design spec. Use this skill when starting a new product initiative, writing a PRD, or documenting product strategy before engineering handover.

**What it produces:** A product design spec saved to `.product/{name}/product-spec.md`. Covers problem statement, target users, goals and success metrics, proposed solution, scope, and risks.

### `pd:feature-spec`

**Description:** Create a structured feature design spec. Use this skill when specifying a single feature before engineering handover, writing acceptance criteria, or documenting UX flows.

**What it produces:** A feature design spec saved to `.product/{name}/feature-spec.md`. Covers user stories, acceptance criteria (Given/When/Then), UX flow walkthrough, edge cases, and dependencies. Can link to a parent product spec.

### `pd:bug-report`

**Description:** Write a structured bug report. Use this skill when documenting a bug, reporting an issue, or writing a ticket for engineering with clear reproduction steps.

**What it produces:** A bug report saved to `.product/bugs/{slug}/bug-report.md`. Covers reproduction steps from a neutral starting state, expected vs. actual behavior, environment, severity, and supporting evidence.

## Output Modes

Each content skill (`product-spec`, `feature-spec`, `bug-report`) supports three output destinations:

1. **Filesystem** (default in Claude Code) — Saves the artifact to the `.product/` directory and appends a row to `.product/index.md` with the artifact type, name, date, and status. If a file already exists at the target path, the skill prompts you to overwrite or create a versioned copy.

2. **Chat** (default in Claude Desktop) — Returns the full document inline in the conversation. No files are written to disk.

3. **External tool** — If MCP tools are available that can write to a project management or documentation platform (Jira, Confluence, Linear, etc.), the skill offers that as an option. If the write fails, the draft is retained in the conversation and all three options are re-offered.

## Getting Started

1. Install the plugin.
2. Run `pd:setup` to configure your project. This creates the `.product/` directory with a project guide and artifact index.
3. Run any content skill (`pd:product-spec`, `pd:feature-spec`, or `pd:bug-report`) to create your first artifact.

## Directory Layout

```
.product/
├── guide.md              <- Created by pd:setup
├── index.md              <- Tracks all artifacts (type, name, date, status)
├── {name}/
│   ├── product-spec.md
│   └── feature-spec.md
└── bugs/
    └── {slug}/
        └── bug-report.md
```

## Relationship to SDD

`pd` is independent of `sddv2`. A feature spec produced by `pd:feature-spec` can optionally feed into `sddv2:requirements` as input for engineering handover, but there is no hard dependency between the two plugins.
