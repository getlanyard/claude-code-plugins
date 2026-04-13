---
name: express
description: Run the full SDD workflow end-to-end after research is prepared. Chains requirements, plan, tasks, and implement without stopping unless user input is required. Use this skill when the user wants to go from research straight through to implementation in one shot.
version: 0.1.0
---

# Express

Run the full SDD workflow end-to-end. Assumes research has already been completed. Chains requirements, plan, tasks, and implement sequentially, continuing automatically unless user input is required.

## Prerequisites

- Research must already exist at `.sdd/{FEATURE}/research.md`
- If research does not exist, tell the user to run the `research` skill first and stop

## Orchestrator Discipline

You are a coordinator across the full workflow. Keep your context lean:
- Do NOT read source code, test files, or SDD documents yourself except when a skill step explicitly requires it
- Each skill you invoke manages its own subagents — trust the delegation
- Your only jobs: invoke skills in sequence, relay user input when needed, report results

## Process

**CRITICAL**: Execute ONE step at a time. NEVER launch multiple Task tool calls in a single message. Wait for each step to complete before starting the next.

**CRITICAL**: Do NOT stop between steps unless user input is genuinely required (e.g., the `requirements` skill needs a discovery interview answer, or a review finds P0 issues that need user decision). If a step completes successfully, move immediately to the next step.

### Step 1: Requirements

Use the `requirements` skill to create the specification for {FEATURE}.

The requirements skill conducts a discovery interview. Answer what you can from the research findings. When the skill requires input only the user can provide, pause and ask the user. Once the user responds, continue.

### Step 2: Plan

Use the `plan` skill to create the design for {FEATURE}.

Continue automatically once the specification from Step 1 is complete.

### Step 3: Tasks

Use the `tasks` skill to create the task breakdown for {FEATURE}.

Continue automatically once the design from Step 2 is complete.

### Step 4: Implement

Use the `implement` skill to implement {FEATURE}.

Continue automatically once the task breakdown from Step 3 is complete.

### Completion

When all steps are done, report:
- What was implemented
- How many tasks/phases were completed
- Any review findings that were resolved along the way
- Any outstanding P2/P3 observations from reviews
