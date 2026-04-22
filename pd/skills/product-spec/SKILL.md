---
name: product-spec
description: Create a structured product design spec. Use this skill when starting a new product initiative, writing a PRD, or documenting product strategy before engineering handover.
version: 0.1.0
---

# Product Spec

Create a product design specification through a guided interview, self-review, and flexible output.

## Templates

- `templates/product-spec.template.md` — structure for the product design spec

## Process

### Phase 1: Gather Context

1. Check if `.product/guide.md` exists. If it does, read it with the Read tool. Use it for team conventions, documentation locations, output preferences, and terminology throughout the process.
2. Check what MCP tools and resources are available (project management, documentation, analytics platforms). Look for existing tickets, prior product documents, user feedback, or analytics data related to the initiative. Share relevant findings with the user.
3. Do **NOT** search the codebase by default. Product specs focus on market, users, and strategy. Only search the codebase if the user explicitly asks about current product capabilities.

### Phase 2: Discovery Interview

Interview the user to gather enough information to fill every section of the template. Ask these questions, adapting based on what Phase 1 already answered:

1. What product or initiative is this for?
2. Who are the target users? Can you describe a typical day for them?
3. What problem are they experiencing? How did you learn about it?
4. How do they solve it today? What's painful about the workaround?
5. What does success look like? If this shipped perfectly, what would change?
6. How would you measure that change? What metric would move?
7. Have you looked at how competitors handle this? What do they do well or poorly?
8. What's the timeline or urgency?
9. What's explicitly NOT in scope?
10. What are the biggest risks or unknowns?

**Probe vague answers relentlessly.** Do not accept "intuitive", "fast", "better UX", or "improved performance" without asking what specifically that means in measurable terms. Push for numbers, timeframes, or observable behaviors.

If the user says "I don't know", accept it and flag it as an open question rather than fabricating specifics.

Ask all questions in a single message to keep the conversation efficient. Use follow-ups only when answers are vague or incomplete.

### Phase 3: Write the Draft

Once you have enough information, use the Task tool to launch a subagent that writes the product spec.

**Subagent prompt:**

> Write the product design spec for {product name}.
>
> **Read:**
> - Product spec template: `templates/product-spec.template.md`
>
> **Context from discovery interview:**
> {paste the collected answers here}
>
> **Instructions:**
> - Follow the template structure exactly.
> - Fill in every section from the interview answers.
> - For sections the user had no answer for, write the section header followed by: "**Open question** — {what needs to be determined}". Do not leave any section blank.
> - Replace all `{placeholder}` values with real content.
> - Set Status to "Draft" and Date to today's date.
> - Save the document to a temporary location or return it inline.

### Phase 4: Self-Review

Before presenting the draft to the user, check the following:

1. **Completeness** — every template section is filled or explicitly flagged as an open question.
2. **Measurable goals** — the Goals & Success Metrics table includes at least one goal with a concrete, measurable metric (not just "improve" or "increase").
3. **Bounded scope** — the Scope & Boundaries section has explicit "In Scope" AND "Out of Scope" lists, each with at least one item.
4. **No vague language** — scan the entire draft for "intuitive", "fast", "better", "improved", "user-friendly", "seamless", "robust", or "performant" used without measurable criteria attached. If found, replace with specifics from the interview or flag as an open question.
5. **Clear problem statement** — the Problem Statement is specific enough that someone unfamiliar with the project can understand the problem and why it matters.

If any check fails, ask the user targeted follow-up questions to fill the gaps before finalizing. Do not present a draft that fails these checks without flagging what needs attention.

### Phase 5: Output

Ask the user: "Where would you like to save this product spec?"

Offer these options:

**Filesystem (default in Claude Code):**
- Save to `.product/{name}/product-spec.md` where `{name}` is a kebab-case slug derived from the product name.
- Create the `.product/{name}/` directory if it does not exist.
- If `.product/index.md` does not exist, create it using the index template from `pd/skills/setup/templates/index.template.md`.
- Append a row to `.product/index.md` with type "Product Spec", the product name, today's date, and status "Draft".
- If a file already exists at `.product/{name}/product-spec.md`, ask the user: "A product spec already exists at this path. Would you like to overwrite it or create a versioned copy (`{name}-2`)?"

**Chat:**
- Return the full document inline in the conversation. No files are written.

**External tool:**
- If MCP tools are available that can write to a project management or documentation platform, offer that as an option.
- If the MCP write fails, display the error message to the user, retain the full draft in the conversation, and re-offer the three output options.
