---
name: setup
description: Set up SDD for a project. Registers context monitoring hooks and discovers project conventions for .sdd/handbook.md. Run once per project.
version: 0.1.0
---

# Setup

Set up SDD for the current project. This skill does two things:

1. **Registers context monitoring hooks** — statusline + agent-facing warnings when context runs low
2. **Creates project guidelines** — discovers conventions and writes `.sdd/handbook.md`

Run this once when starting to use SDD in a new project.

## Process

### Step 1: Register Context Monitoring Hooks

The SDD plugin includes two hooks that prevent context exhaustion:
- **sdd-statusline.js** — shows context usage in the status bar and writes metrics to a bridge file
- **sdd-context-monitor.js** — reads the bridge file after tool uses and warns the agent when context is running low

**1a. Find the hooks**

Use Glob to find `**/sddv2/hooks/sdd-statusline.js`. Resolve the absolute path to the `hooks/` directory. Both `sdd-statusline.js` and `sdd-context-monitor.js` are in that directory.

If the hooks cannot be found, tell the user the sddv2 plugin hooks directory could not be located and skip to Step 2.

**1b. Register the hooks**

Use the `update-config` skill to add the following to the user's settings:

1. **statusLine** setting:
   ```json
   {
     "type": "command",
     "command": "node {HOOKS_DIR}/sdd-statusline.js"
   }
   ```

2. **PostToolUse hook** (add to hooks array, don't replace existing hooks):
   ```json
   {
     "matcher": "Bash|Edit|Write|Agent|Task",
     "hooks": [
       {
         "type": "command",
         "command": "node {HOOKS_DIR}/sdd-context-monitor.js",
         "timeout": 10000
       }
     ]
   }
   ```

Where `{HOOKS_DIR}` is the absolute path found in step 1a.

**Important:** If the user already has a statusLine or PostToolUse hooks configured, ask before overwriting. Append the context monitor alongside existing PostToolUse hooks rather than replacing them.

### Step 2: Create Project Guidelines

Create `.sdd/handbook.md` with discovered project conventions. This file is read by every SDD skill so agents follow consistent patterns.

**2a. Check for existing guidelines**

If `.sdd/handbook.md` already exists, read it and ask the user if they want to update it or skip this step.

**2b. Discover conventions**

Use the Explore tool to search the codebase and discover conventions for:

- **Error handling** — error types, propagation patterns, error content, custom error classes
- **Logging** — framework, log levels, structured logging patterns
- **Naming** — file naming, function/class/variable naming patterns, module structure
- **Testing** — test file locations, framework, assertion style, mocking patterns, what to test vs skip
- **Commits** — message format, conventional commits, scope conventions
- **Pre-commit validation** — linting commands, formatting, type checking, test commands to run before committing
- **Dependencies** — package manager, how dependencies are managed
- **Project structure** — how code is organized, where new files should go

Look at:
- Existing config files (eslint, prettier, tsconfig, pyproject.toml, Cargo.toml, Makefile, etc.)
- CI/CD configuration (.github/workflows/, .gitlab-ci.yml, etc.)
- Existing test files for patterns
- Recent git commits for message format
- README and CONTRIBUTING files
- Pre-commit hook configurations (.husky/, .pre-commit-config.yaml, etc.)

**2c. Write the guidelines file**

Create `.sdd/handbook.md` with the discovered conventions. Structure it as:

```markdown
# Project Guidelines

## Referenced Documentation
- {paths to existing docs that agents should read}

## Error Handling
{discovered patterns}

## Logging
{discovered patterns}

## Naming Conventions
{discovered patterns}

## Testing Conventions
{discovered patterns — framework, file locations, what to test, how to run}

## Pre-commit Validation
{commands to run before committing — lint, format, test, type check}

## Project Structure
{where new files go, module organization}
```

Only include sections where conventions were actually discovered. Don't add placeholder sections with questions — if a convention wasn't found, omit the section.

**2d. Present to user**

Show the user a summary of what was discovered and written. Ask if anything needs correction or addition.
