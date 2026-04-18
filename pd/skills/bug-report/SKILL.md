---
name: bug-report
description: Write a structured bug report. Use this skill when documenting a bug, reporting an issue, or writing a ticket for engineering with clear reproduction steps.
version: 0.1.0
---

# Bug Report

Create a structured bug report through a guided interview, self-review, and flexible output.

## Templates

- `templates/bug-report.template.md` — structure for the bug report

## Process

### Phase 1: Gather Context

1. Check if `.product/guide.md` exists. If it does, read it with the Read tool. Use it for team conventions, documentation locations, output preferences, and terminology throughout the process.
2. **If codebase access is available**: search for code paths related to the reported symptom. If the user mentions a feature area up front, search proactively for the code paths most likely involved. Focus on the specific area of the bug, not general feature discovery.
3. **If codebase access is NOT available**: proceed without codebase context — do not error or warn excessively. The skill works fine conversationally.
4. Check what MCP tools and resources are available (project management, documentation, analytics platforms). Look for existing related tickets, recent deployments, or known issues. Share relevant findings with the user.

### Phase 2: Discovery Interview

Interview the user to reconstruct what went wrong. Ask these questions, adapting based on what Phase 1 already answered:

1. What happened? Give me the one-sentence version.
2. What were you trying to do when you encountered this?
3. Walk me through exactly what you did, step by step from the beginning. Start from where you were before the bug occurred.
4. At which step did things go wrong? What did you expect to happen at that step?
5. What actually happened instead? Was there an error message? What exactly did it say?
6. What browser/OS/device/app version are you using?
7. Does this happen every time, or only sometimes? If sometimes, how often (roughly)?
8. Has this ever worked? When did it start failing? Were there any recent changes?
9. How many users are affected? Is there a workaround?
10. Do you have screenshots, recordings, or logs you can share?

**Reconstruction help**: If the user cannot provide exact reproduction steps, actively help reconstruct them:
- "Let's work backwards. What screen were you on when the bug appeared?"
- "What did you click or enter just before that?"
- "Can you try it again now and tell me what happens at each step?"
- Build the numbered steps collaboratively, starting from a neutral state (e.g., "1. Log in to the dashboard as an admin user").

**Probe vague descriptions.** "It broke" is not enough. Ask: "What specifically happened? Did you see an error? Did the page go blank? Did it show the wrong data?"

Ask all questions in a single message to keep the conversation efficient. Use follow-ups only when answers are vague or incomplete.

Be supportive in tone — bug reporters may be frustrated.

### Phase 3: Write the Draft

Once you have enough information, use the Task tool to launch a subagent that writes the bug report.

**Subagent prompt:**

> Write the bug report for {title}.
>
> **Read:**
> - Bug report template: `{skill_directory}/templates/bug-report.template.md`
>
> **Context from discovery interview:**
> {paste the collected answers here}
>
> **Codebase context:** {paste relevant findings from Phase 1, or "No codebase context available"}
>
> **Instructions:**
> - Follow the template structure exactly.
> - Fill in every section from the interview answers.
> - For sections the user had no answer for, write the section header followed by: "**Open question** — {what needs to be determined}". Do not leave any section blank.
> - Replace all `{placeholder}` values with real content.
> - Set Status to "Open" and Date to today's date.
> - If the user did not specify severity, assess one based on impact and frequency and note it was inferred.
> - If codebase context was gathered, include code path references in the Related Context section.
> - Save the document to a temporary location or return it inline.

### Phase 4: Self-Review

Before presenting the draft to the user, check the following:

1. **Steps to Reproduce start from a neutral state and are numbered** — the first step should establish the starting point (e.g., "Log in as an admin user on the dashboard"). Steps must be numbered, not bulleted.
2. **Expected and Actual Behavior are distinct and specific** — not just "it didn't work" or "it should work." Each section describes a concrete, observable outcome.
3. **Environment is filled with at least OS and browser/app version** — if the user did not provide these, flag them as open questions rather than leaving them blank.
4. **Severity is assessed** — if the user did not specify severity, suggest one based on the reported impact and frequency. Note that it was inferred.
5. **If codebase context was gathered, Related Context section includes code path references** — file paths, function names, or module references from Phase 1 research.

If any check fails, ask the user targeted follow-up questions to fill the gaps before finalizing. Do not present a draft that fails these checks without flagging what needs attention.

### Phase 5: Output

Ask the user: "Where would you like to save this bug report?"

Offer these options:

**Filesystem (default in Claude Code):**
- Save to `.product/bugs/{slug}/bug-report.md` where `{slug}` is a kebab-case slug derived from the bug title.
- Create the `.product/bugs/{slug}/` directory if it does not exist.
- If `.product/index.md` does not exist, create it using the index template from `pd/skills/setup/templates/index.template.md`.
- Append a row to `.product/index.md` with type "Bug Report", the bug title, today's date, and status "Open".
- If a file already exists at `.product/bugs/{slug}/bug-report.md`, ask the user: "A bug report already exists at this path. Would you like to overwrite it or create a versioned copy (`{slug}-2`)?"

**Chat:**
- Return the full document inline in the conversation. No files are written.

**External tool:**
- If MCP tools are available that can write to a project management or documentation platform, offer that as an option.
- If the MCP write fails, display the error message to the user, retain the full draft in the conversation, and re-offer the three output options.
