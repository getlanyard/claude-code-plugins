# SDD v2 — Spec Driven Development for Claude Code

A Claude Code plugin for structured feature development. Research the problem, specify requirements, design the solution, break it into tasks, implement with TDD, review, and record decisions.

## Workflow

```
research → requirements → plan → tasks → implement → review → adr
```

Each step is a skill you can invoke independently or chain via `express`.

## Skills

| Skill | Purpose | Artifact |
|-------|---------|----------|
| `research` | Guided problem exploration (Observe → Orient → Diverge → Evaluate → Synthesize) | `.sdd/{feature}/research.md` |
| `requirements` | Discovery interview → behavioral specification | `.sdd/{feature}/specification.md` |
| `plan` | Design document with components, test scenarios, traceability | `.sdd/{feature}/design.md` |
| `tasks` | Flat ordered task list sized for subagent execution | `.sdd/{feature}/tasks.md` |
| `implement` | One subagent per task, TDD, review at the end | commits |
| `review` | Spec / design / task / implementation review with P0-P3 severity | report |
| `adr` | Architecture Decision Record for key choices | `.sdd/{feature}/adr.md` |
| `express` | Chains requirements → plan → tasks → implement end-to-end | all of the above |
| `setup` | Registers context monitoring hooks + discovers project conventions | `.sdd/handbook.md` |
| `handbook` | Reads and resolves project conventions for all skills | — |

## The Handbook

The single most impactful thing you can do for output quality is write a good `.sdd/handbook.md`. Every skill reads it. Every subagent follows it. Without it, agents guess at conventions and get things wrong — test locations, error handling patterns, naming, commit format, how to run linters.

Run the `setup` skill to auto-discover conventions from your codebase, then refine the result. A good handbook covers:

- **Error handling** — error types, propagation patterns
- **Testing** — framework, file locations, fixtures, what to test vs skip, how to run the suite
- **Naming** — files, functions, modules
- **Pre-commit validation** — lint, format, type check commands
- **Project structure** — where new code goes

The handbook doesn't need to be exhaustive — it needs to capture what an agent would get wrong without it.

### Domain Skills

Specialized review lenses loaded when relevant:

`security` · `api-design` · `distributed-systems` · `data-engineering` · `devops-sre` · `infrastructure` · `low-level-systems`

## Context Management

The plugin includes two hooks (registered via `setup`) that prevent context exhaustion:

- **sdd-statusline.js** — shows context usage in the status bar, writes metrics to a bridge file
- **sdd-context-monitor.js** — reads the bridge file after tool uses, warns the agent at 35% remaining, stops it at 25%

Run the `setup` skill once per project to register these hooks and discover project guidelines.

## Usage

```
Use research to explore the problem space for {feature}
Use requirements to write a spec for {feature}
Use plan to design {feature}
Use tasks to break down {feature}
Use implement to build {feature}
Use review to review the implementation of {feature}
Use adr to record decisions for {feature}
Use express to run the full workflow for {feature}
```

## License

0BSD
