# Specification: pd Plugin (Product Design)

**Version:** 1.1
**Date:** 2026-04-18
**Status:** Draft

---

## Problem Statement

Product managers, product owners, and solutions consultants working in Claude Code and Claude Desktop have no structured way to produce consistent product design artifacts (product specs, feature specs, bug reports) before engineering handover. They either start from scratch each time or rely on ad-hoc templates that vary across teams and miss critical sections.

## Beneficiaries

**Primary:**
- Product managers and product owners who need to create product specs, feature specs, and bug reports
- Solutions consultants who document customer-facing product requirements

**Secondary:**
- Engineers who receive these artifacts as input for design and implementation
- Stakeholders who review and approve product decisions

---

## Outcomes

**Must Haves**
- A PM can install the `pd` plugin and run any of its four skills (setup, product-spec, feature-spec, bug-report) without additional configuration
- The setup skill configures the project environment so that subsequent content skills know where to find context and where to save output
- Each content skill conducts a guided interview that asks about the user's problem, users, and goals rather than asking about template sections
- Each content skill produces a structured, complete draft that covers all critical sections for its artifact type
- The user can save the draft to the local `.product/` directory, return it inline in chat, or write it to an external tool via MCP
- The plugin works in both Claude Code (with codebase access) and Claude Desktop (conversational only)

**Nice-to-haves**
- Feature specs can link to a parent product spec via frontmatter and prose reference
- Skills use available MCP tools (Jira, Confluence, Linear, GitHub Issues) to gather context without being hard-coded to any specific tool
- Bug reports in Claude Code include relevant code path references to help engineers

---

## Explicitly Out of Scope

- Runtime code, dependencies, or build steps: this is a markdown-only plugin
- A dedicated review skill: v1 uses inline self-review within each content skill
- Integration wiring between `pd:feature-spec` output and `sddv2:requirements` input: that is a future concern
- Analytics dashboards, reporting, or artifact status tracking beyond the `.product/index.md` inventory
- Custom template authoring or user-defined template overrides
- Multi-language support for artifact output

---

## Functional Requirements

**FR-01: Setup skill configures the project environment**
- Description: The `pd:setup` skill interviews the user about their product environment. After setup, the user has configured where existing product documentation lives, where new artifacts should be saved, and any project-specific naming or terminology conventions. Subsequent skills (product-spec, feature-spec, bug-report) use the setup configuration to find context sources and save output to the configured destination.
- Implementation hint: Store the configuration in `.product/guide.md` covering paths, URLs, tool references, default output destination, naming conventions, team terminology, product glossary, and project-specific context.
- Acceptance criteria: After running `pd:setup` and answering the interview questions, the user's documented conventions are persisted and available to subsequent skill runs. Running a content skill after setup shows that the skill uses the configured context sources and output destination.
- Failure/edge cases: If a configuration already exists, the skill asks whether to update or replace it. If the user has no existing documentation or conventions, the configuration is created with sensible defaults and notes that sections are unconfigured.

**FR-02: Product spec skill produces a structured product design spec**
- Description: The `pd:product-spec` skill conducts an interview about the product or initiative, then produces a structured spec covering: problem statement, target users (primary and secondary personas), current state and workarounds, goals with measurable success metrics, proposed solution shape, competitive landscape (optional), scope boundaries, and risks/open questions.
- Acceptance criteria: The finished draft covers every required section. Goals include at least one measurable metric. Scope has explicit "in scope" and "out of scope" lists. The interview probes vague answers until they are specific.
- Failure/edge cases: If the user cannot articulate measurable goals, the skill flags this as an open question in the draft rather than accepting vague language. If available MCP tools provide relevant context (existing docs, tickets, user feedback), the skill uses them before or during the interview.

**FR-03: Feature spec skill produces a structured feature design spec**
- Description: The `pd:feature-spec` skill conducts an interview about a single feature, then produces a spec covering: problem and context, user stories, acceptance criteria (testable, in Given/When/Then or equivalent format), step-by-step UX flow, edge cases and error states, dependencies, success metrics, and out-of-scope items. Optionally links to a parent product spec.
- Acceptance criteria: Acceptance criteria are testable from a user's perspective. The UX flow is a complete step-by-step walkthrough of the happy path. Edge cases address at least empty states, error states, and permission boundaries. In Claude Code, the skill searches the codebase for how the product currently handles related functionality and shares findings with the user.
- Failure/edge cases: If a parent product spec exists, the skill references it. If none exists, the Parent Product Spec field reads "N/A". If the user skips edge cases, the skill prompts specifically about empty states, errors, and permissions before accepting.

**FR-04: Bug report skill produces a structured bug report**
- Description: The `pd:bug-report` skill conducts an interview about a bug, then produces a report covering: summary, numbered steps to reproduce from a neutral starting state, expected behavior, actual behavior (with exact error messages), environment details, severity and impact assessment, reproduction frequency, and supporting evidence.
- Acceptance criteria: Steps to reproduce start from a neutral state and are numbered. Expected and actual behavior are distinct and specific. Environment is specified (OS, browser/app version, device, account type). In Claude Code, the skill searches the codebase for relevant code paths and includes them in a "Related Context" section.
- Failure/edge cases: If the user cannot provide exact reproduction steps, the skill helps reconstruct them by asking what they were doing before the bug appeared. If the user has screenshots or logs, the skill references them in the Supporting Evidence section.

**FR-05: Three output modes for all content skills**
- Description: After producing a draft, each content skill offers the user three output options: save to the local `.product/` directory (default in Claude Code), return inline in the conversation (default when no filesystem is available), or write to an external tool via available MCP tools.
- Acceptance criteria: The skill prompts "Where would you like to save this?" and lists the available options based on the environment. Filesystem output follows the directory layout defined in FR-06 and the index is updated when saving to the filesystem.
- Failure/edge cases: If the `.product/` directory does not exist, the skill creates it. If an artifact with the same name already exists, the skill asks whether to overwrite or create a versioned copy. If no MCP tools are available, the external option is not offered.

**FR-06: Artifact directory layout and index**
- Description: Saved artifacts are organized by project and type, discoverable via an index file, and follow consistent naming. Bug reports are organized separately because they relate to existing features rather than new ones, and accumulate independently of the product/feature spec lifecycle.
- Implementation hint: Store product specs and feature specs at `.product/{name}/`, where `{name}` is kebab-case. Store bug reports at `.product/bugs/{slug}/bug-report.md`. Use `.product/index.md` to track all artifact types.
- Acceptance criteria: The user can find any saved artifact by checking the index. Each artifact's location reflects its type. Names use a consistent casing convention. The index lists each artifact with its type, name, date, and status.
- Failure/edge cases: If two artifacts would have the same name, the skill appends a disambiguating suffix or asks the user to choose a different name.

**FR-07: Interview probes vague answers**
- Description: All three content skills treat vague language ("intuitive", "fast", "better UX", "improved performance") as incomplete answers and ask follow-up questions until the user provides specific, concrete criteria.
- Acceptance criteria: The skill does not accept adjectives without measurable definitions. For example, "fast" becomes "page loads in under 2 seconds" or similar. If the user says "I don't know", the skill accepts that and flags it as an open question rather than fabricating specifics.
- Failure/edge cases: If the user explicitly says a vague term is intentional (e.g., "we haven't defined the metric yet"), the skill records it as an open question with a note that it needs refinement.

**FR-08: Tool-agnostic context gathering**
- Description: Each content skill checks what tools and MCP servers are available and uses them to gather relevant context before and during the interview. The skill describes the kind of information to look for (existing tickets, prior documents, user feedback, analytics, documentation) without naming specific tools.
- Acceptance criteria: The skill text uses phrasing like "check what context sources are available" and "use whatever tools you have access to" rather than referencing specific platforms. If tools are available, the skill gathers context and shares findings with the user before proceeding with the interview.
- Failure/edge cases: If no external tools are available, the skill proceeds with the interview using only the user's input and (where applicable) codebase context.

**FR-09: Inline self-review before finalizing**
- Description: Each content skill performs a self-review check before presenting the final draft. Product-spec review checks that all sections are filled, goals are measurable, and scope is bounded. Feature-spec review checks that acceptance criteria are testable, UX flow is step-by-step complete, and edge cases are addressed. Bug-report review checks that steps are reproducible from a neutral state, environment is specified, and expected vs actual are distinct.
- Acceptance criteria: The skill runs through its review checklist and fixes any gaps before presenting the draft. If a gap cannot be fixed (missing information from the user), it is flagged as an open question in the draft.
- Failure/edge cases: If the self-review reveals multiple gaps, the skill asks the user targeted follow-up questions rather than presenting an incomplete draft.

**FR-10: Codebase context used selectively by skill type**
- Description: When running feature-spec or bug-report in an environment with codebase access, the skill searches for related existing code and shares findings with the user as context before or during the interview. When running product-spec, the skill does not search the codebase unless the user explicitly requests it, because product-level specs focus on market, users, and strategy.
- Acceptance criteria: Running feature-spec in a project with existing code surfaces references to how the product currently handles related functionality. Running bug-report in a project with existing code surfaces relevant code paths. Running product-spec does not trigger codebase searches unless the user asks. All three skills complete successfully when codebase access is unavailable (e.g., Claude Desktop).
- Failure/edge cases: If codebase access is not available, the skill proceeds without codebase context and does not error.

---

## QA Plan

**QA-01: Install plugin and verify structure**
- Goal: Confirm the plugin installs correctly and all files are in place
- Steps:
  1. Clone or navigate to the `cc-plugins` repo
  2. Verify `pd/.claude-plugin/plugin.json` exists with correct name, version, and description
  3. Verify each skill directory (`setup`, `product-spec`, `feature-spec`, `bug-report`) contains a SKILL.md and templates
  4. Verify the marketplace.json includes the `pd` entry
- Expected: All files exist, JSON is valid, YAML frontmatter parses correctly

**QA-02: Run setup skill**
- Goal: Confirm setup creates a usable guide file
- Steps:
  1. Open Claude Code in a test project
  2. Run `pd:setup`
  3. Answer the interview questions about documentation locations, output preferences, and team conventions
  4. Check that `.product/guide.md` was created
- Expected: `.product/guide.md` contains the information provided during the interview, organized into clear sections

**QA-03: Run product-spec skill end-to-end**
- Goal: Confirm the product spec interview and output work correctly
- Steps:
  1. Run `pd:product-spec` in Claude Code
  2. Answer the interview questions about a product initiative
  3. Provide at least one vague answer (e.g., "we want it to be fast") and verify the skill probes for specifics
  4. Complete the interview and review the draft
  5. Choose to save to `.product/`
- Expected: The draft covers all template sections. The vague answer was replaced with a specific metric or flagged as an open question. The file is saved at `.product/{name}/product-spec.md` and `.product/index.md` is updated.

**QA-04: Run feature-spec skill with codebase context**
- Goal: Confirm the feature spec uses codebase context and produces testable acceptance criteria
- Steps:
  1. Run `pd:feature-spec` in Claude Code in a project with existing code
  2. Describe a feature related to existing functionality
  3. Complete the interview
  4. Review the draft for codebase references, acceptance criteria format, and UX flow completeness
- Expected: The draft includes references to how the product currently handles related functionality. Acceptance criteria are in testable format. UX flow is a complete step-by-step walkthrough.

**QA-05: Run bug-report skill with codebase context**
- Goal: Confirm the bug report uses codebase context and produces reproducible steps
- Steps:
  1. Run `pd:bug-report` in Claude Code
  2. Describe a bug, including vague reproduction steps
  3. Verify the skill helps reconstruct precise steps from a neutral state
  4. Review the draft for code path references and environment details
- Expected: Steps to reproduce are numbered and start from a neutral state. A Related Context section includes relevant code paths. Environment is specified.

**QA-06: Run a skill in Claude Desktop (chat-only output)**
- Goal: Confirm skills work without filesystem access
- Steps:
  1. Open Claude Desktop with the `pd` plugin installed
  2. Run `pd:feature-spec`
  3. Complete the interview
  4. Observe that the draft is returned inline in the conversation
- Expected: The full draft is returned in the chat. No filesystem operations are attempted. The skill does not error about missing filesystem access.

**QA-07: Run a skill with MCP tools available**
- Goal: Confirm skills use available external tools for context gathering
- Steps:
  1. Open Claude Code with at least one project-management MCP tool configured (the specific tool does not matter; Linear, Jira, or GitHub Issues are examples for test setup)
  2. Run `pd:feature-spec`
  3. Observe whether the skill checks for and uses available tools to gather context
  4. After the draft is complete, verify the external output option is offered
- Expected: The skill gathers context from available tools before or during the interview. The output prompt includes the option to write to the detected external tool.

**QA-08: Verify self-review catches gaps**
- Goal: Confirm the inline self-review identifies and addresses missing sections
- Steps:
  1. Run `pd:product-spec`
  2. Deliberately skip questions about success metrics and scope
  3. Observe whether the skill asks follow-up questions before finalizing
- Expected: The skill identifies missing metrics and scope boundaries during self-review and asks targeted follow-up questions before presenting the final draft.

---

## Open Questions

None. The discovery conversation resolved all open questions from the research phase: setup skill is included, bug reports use `.product/bugs/{slug}/` layout, a single index tracks all artifact types, feature specs link to parent specs via frontmatter and prose, and v1 uses inline self-review rather than a dedicated review skill.

---

## Appendix

### Glossary
- **pd:** Product design. The plugin abbreviation, parallel to `sdd` (spec-driven development).
- **SKILL.md:** The markdown file that defines a skill's behavior, including YAML frontmatter and the instructions the LLM follows when the skill is invoked.
- **MCP:** Model Context Protocol. The mechanism by which Claude connects to external tools like Jira, Linear, Confluence, and others.
- **Artifact:** A product design document produced by a skill (product spec, feature spec, or bug report).
- **kebab-case:** Lowercase words separated by hyphens (e.g., `user-onboarding`, `search-improvements`).

### References
- [Research findings](/home/pete/dev/cc-plugins/.sdd/pd-plugin/research.md)

### Change History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-18 | Pete | Initial specification |
| 1.1 | 2026-04-18 | Pete | Addressed specification-review P1/P2 findings: reframed FR-01/FR-06/FR-11 as observable behavior with implementation hints; removed FR-10 (packaging → design concern); separated setup outcome; added bug-report directory rationale; clarified QA-07 tool examples. |
