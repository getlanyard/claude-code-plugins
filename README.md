# SDD v2 (Spec Driven Development v2) Plugin

A Claude Code plugin implementing Spec Driven Development methodology, decomposed into 6 focused skills for better maintainability and composability.

## Overview

SDD v2 provides the same methodology as the original SDD plugin but split into focused, independently usable skills. Each skill handles a specific phase of the development workflow.

**Core Principle:** Write the specification first. Design with traceability. Implement with tests.

## Skills

### 1. `requirements` - Specification
Define what needs to be built with clarity and precision.
- Discovery interview to gather requirements
- Structured specification writing
- Specification refinement
- Artifact: `.sdd/[feature]/specification.md`

### 2. `research` - Codebase Exploration
Explore the codebase and capture findings before designing.
- Read specification and project guidelines
- Identify existing patterns, conventions, and integration points
- Freeform research document (ephemeral)
- Artifact: `.sdd/[feature]/research.md`

### 3. `plan` - Design
Plan how to implement the specification with full traceability.
- Architecture overview and technology decisions
- Component identification (Modified, Added, Used)
- Test scenarios in Given/When/Then format
- QA feasibility analysis
- Design refinement
- Artifact: `.sdd/[feature]/design.md`

### 4. `tasks` - Task Breakdown
Break down designs into implementation tasks.
- Tasks grouped under phases, ordered by dependencies
- Each task has implementation subtasks with checkboxes
- Each task has test checkboxes referencing design test scenarios
- Every requirement maps to tasks (and vice versa)
- Artifact: `.sdd/[feature]/tasks.md`

### 5. `implement` - Implementation
Implement features task-by-task following the design document.
- Task-by-task TDD implementation
- Dead code and stub tracking
- Auto-implement with stacked PRs and subagents

### 6. `review` - Quality Assurance
Validate documents and implementation at any stage.
- Specification review: achievability, testability, no implementation details
- Design review: traceability, no orphan scenarios, task coverage
- Implementation review: matches design, code quality, test coverage
- Severity-categorized findings (P0-P3)

## Example Usage

**Note:** Prefix prompts with the skill name to target a specific skill.

```
Use requirements to create a specification for user-authentication
Use research to explore the codebase for the shopping-cart feature
Use plan to design the password-reset feature
Use tasks to break down the design for password-reset
Use implement to implement phase 1 of user-authentication
Use review to review the specification for shopping-cart
```

## Domain Skills

Domain-specific skills (api-design, security, distributed-systems, etc.) remain in the original `sdd` plugin. Install both plugins if you need domain skills alongside SDD v2.

## Project Structure

```
.sdd/
  index.md                    # Feature index
  guide.md       # Project-specific conventions
  [feature-name]/
    specification.md          # What to build (requirements skill)
    research.md               # Codebase findings (research skill)
    tasks.md                  # Task breakdown with checkboxes (tasks skill)
    design.md                 # How to build it (plan skill)
```

## Plugin Structure

```
sddv2/
├── .claude-plugin/
│   └── plugin.json
├── .gitignore
├── README.md
└── skills/
    ├── requirements/
    │   ├── SKILL.md
    │   └── templates/
    │       ├── specification.template.md
    │       └── index.template.md
    ├── research/
    │   └── SKILL.md
    ├── plan/
    │   ├── SKILL.md
    │   └── templates/
    │       ├── design.template.md
    │       └── project-guidelines.template.md
    ├── tasks/
    │   ├── SKILL.md
    │   └── templates/
    │       └── tasks.template.md
    ├── implement/
    │   └── SKILL.md
    └── review/
        └── SKILL.md
```

## Key Principles

1. **Specification as Contract** - The spec defines success and guides all decisions
2. **Full Traceability** - Requirements and scenarios traced through design documents (not code)
3. **Test Scenarios First** - Define Given/When/Then before implementation
4. **Tests WITH Implementation** - No separate "add tests" phases
5. **No Orphan Scenarios** - Every scenario must be assigned to a task
6. **No Test Stubs** - All tests fully implemented (tracked if unavoidable)
7. **No Dead Code** - Track intermediate code, resolve by final phase

## Version

0.1.0
