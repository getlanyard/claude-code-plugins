---
name: feature-spec
description: Create a structured feature design spec. Use this skill when specifying a single feature before engineering handover, writing acceptance criteria, or documenting UX flows.
version: 0.1.0
---

# Feature Spec

Create a feature design specification through a guided interview, self-review, and flexible output.

## Templates

- `templates/feature-spec.template.md` — structure for the feature design spec

## Process

### Phase 1: Gather Context

1. Check if `.product/guide.md` exists. If it does, read it with the Read tool. Use it for team conventions, documentation locations, output preferences, and terminology throughout the process.
2. **If codebase access is available**: search for files, functions, and patterns related to the feature area. Share relevant findings with the user (e.g., "I found that the product currently handles X in `src/foo/bar.ts`"). Include these references in the Problem & Context section of the draft.
3. **If codebase access is NOT available**: proceed without codebase context — do not error or warn excessively. The skill works fine conversationally.
4. Check what MCP tools and resources are available (project management, documentation, analytics platforms). Look for existing tickets, prior documents, user feedback, or analytics data related to this feature. Share relevant findings with the user.

### Phase 2: Discovery Interview

Interview the user to gather enough information to fill every section of the template. Ask these questions, adapting based on what Phase 1 already answered:

1. What product does this feature belong to? (If a product spec exists at `.product/{name}/product-spec.md`, reference it.)
2. What user need does this feature address?
3. Walk me through what the user would do, step by step — from the moment they start using this feature to the moment they're done.
4. What happens if they make a mistake? What error messages would they see?
5. What does the screen look like before any data exists (empty state)?
6. Are there permission or access considerations? Who can and can't use this?
7. Does this depend on any other features, services, or teams?
8. How will you validate this works? What would you check in the UI/product?
9. What does success look like for this specific feature? What metric would move?
10. What have you explicitly decided NOT to include?

**Probe vague answers relentlessly.** Do not accept "intuitive", "fast", "better UX", or "improved performance" without asking what specifically that means in measurable terms. Push for numbers, timeframes, or observable behaviors.

If the user says "I don't know", accept it and flag it as an open question rather than fabricating specifics.

Ask all questions in a single message to keep the conversation efficient. Use follow-ups only when answers are vague or incomplete.

### Phase 3: Write the Draft

Once you have enough information, use the Task tool to launch a subagent that writes the feature spec.

**Subagent prompt:**

> Write the feature design spec for {feature name}.
>
> **Read:**
> - Feature spec template: `templates/feature-spec.template.md`
>
> **Context from discovery interview:**
> {paste the collected answers here}
>
> **Parent product spec:** {link or "N/A"}
>
> **Codebase context:** {paste relevant findings from Phase 1, or "No codebase context available"}
>
> **Instructions:**
> - Follow the template structure exactly.
> - Fill in every section from the interview answers.
> - For sections the user had no answer for, write the section header followed by: "**Open question** — {what needs to be determined}". Do not leave any section blank.
> - Replace all `{placeholder}` values with real content.
> - If a parent product spec was provided, include it in the metadata AND reference it in the Problem & Context prose.
> - If no parent product spec, set Parent Product Spec to "N/A".
> - Acceptance criteria MUST be in Given/When/Then format with concrete, testable outcomes.
> - Set Status to "Draft" and Date to today's date.
> - Save the document to a temporary location or return it inline.

### Phase 4: Self-Review

Before presenting the draft to the user, check the following:

1. **Acceptance criteria are testable** — every row in the Acceptance Criteria table uses Given/When/Then format with concrete outcomes. No vague "should work correctly" or "handles gracefully" without specifying what that means.
2. **UX flow is a complete step-by-step walkthrough** — the happy path covers the entire user journey from entry point to completion, not just a fragment.
3. **Edge cases cover minimum required scenarios** — at minimum: empty state, error state, and permission boundary. If fewer than three edge cases are listed, add the missing ones or flag them as open questions.
4. **No vague language without measurable criteria** — scan the entire draft for "intuitive", "fast", "better", "improved", "user-friendly", "seamless", "robust", or "performant" used without measurable criteria attached. If found, replace with specifics from the interview or flag as an open question.
5. **Parent product spec is linked if provided** — if the user provided a parent product spec, verify it appears in the metadata table AND is referenced in the Problem & Context prose.

If any check fails, ask the user targeted follow-up questions to fill the gaps before finalizing. Do not present a draft that fails these checks without flagging what needs attention.

### Phase 5: Output

Ask the user: "Where would you like to save this feature spec?"

Offer these options:

**Filesystem (default in Claude Code):**
- Save to `.product/{name}/feature-spec.md` where `{name}` is a kebab-case slug derived from the feature name.
- Create the `.product/{name}/` directory if it does not exist.
- If `.product/index.md` does not exist, create it using the index template from `pd/skills/setup/templates/index.template.md`.
- Append a row to `.product/index.md` with type "Feature Spec", the feature name, today's date, and status "Draft".
- If a file already exists at `.product/{name}/feature-spec.md`, ask the user: "A feature spec already exists at this path. Would you like to overwrite it or create a versioned copy (`{name}-2`)?"

**Chat:**
- Return the full document inline in the conversation. No files are written.

**External tool:**
- If MCP tools are available that can write to a project management or documentation platform, offer that as an option.
- If the MCP write fails, display the error message to the user, retain the full draft in the conversation, and re-offer the three output options.
