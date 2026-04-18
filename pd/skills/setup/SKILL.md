---
name: setup
description: Configure the product design environment for this project. Use this skill when setting up pd for the first time or updating project conventions.
version: 0.1.0
---

# Setup

Configure the product design environment so that all pd skills share consistent project context.

## Templates

- `templates/guide.template.md` — structure for the project guide
- `templates/index.template.md` — structure for the artifact index

## Process

### Phase 1: Check for Existing Guide

Check if `.product/guide.md` exists.

**If it exists:**
1. Read the file using the Read tool.
2. Present the current values to the user in a summary.
3. Ask: "Would you like to update the existing guide or start fresh?"
   - If **update**: proceed to Phase 2, pre-filling answers from the existing guide. Only ask about sections the user wants to change.
   - If **start fresh**: proceed to Phase 2 with no pre-filled values.

**If it does not exist:** proceed to Phase 2.

### Phase 2: Interview

Gather project context through a conversational interview. Ask these questions, adapting follow-ups based on answers:

1. **Project name and description**
   "What's the project or product name? Give me a one-line description of what it does."

2. **Documentation sources**
   "Where does your existing product documentation live? This could be anything — files in the repo, a wiki, Confluence, Notion, Google Docs, Jira, Linear, or something else. List whatever you have, even if it's scattered."

3. **Output destination**
   "Where should new product design artifacts be saved? The default is a `.product/` directory in the repo. Alternatives: chat only (nothing saved to disk), or a specific external tool. What works for your team?"

4. **Naming conventions**
   "How does your team name features and initiatives? Is there a naming pattern — kebab-case, ticket prefixes, something else? If you have existing ticket numbering (e.g., PROJ-123), mention that too."

5. **Team terminology**
   "Are there domain-specific terms your team uses that I should know? These could be internal jargon, product concepts, or acronyms. List as many as come to mind — I'll build a glossary."

6. **Additional context**
   "Anything else the product design skills should know about? For example: what methodology you use (OKRs, KPIs, North Star Metrics), what platform type this is (B2B SaaS, consumer app, internal tool), key constraints, primary personas, or how features flow from idea to shipping."

Accept partial answers. If the user doesn't have an answer for a section, note it and move on — the guide will mark those sections as unconfigured.

### Phase 3: Write the Guide

Use the Task tool to launch a subagent that writes `.product/guide.md`.

**Subagent prompt:**

> Write the product design guide at `.product/guide.md`.
>
> **Read:**
> - Guide template: `{skill_directory}/templates/guide.template.md`
>
> **Interview answers:**
> {paste the collected answers here}
>
> **Instructions:**
> - Follow the template structure exactly.
> - Fill in every section from the interview answers.
> - For sections the user had no answer for, write: "Not configured — run `pd:setup` to update."
> - If `.product/` does not exist, create the directory first.
> - If `.product/index.md` does not exist, create it from `{skill_directory}/templates/index.template.md`.
> - Save the file when done.

### Phase 4: Confirm

After the subagent completes:

1. Summarize what was configured — list each section and its value (or note it as unconfigured).
2. Let the user know that subsequent skills (`pd:product-spec`, `pd:feature-spec`, `pd:bug-report`) will reference this guide for project context and output destination.
3. If any sections were left unconfigured, mention they can re-run `pd:setup` at any time to fill them in.
