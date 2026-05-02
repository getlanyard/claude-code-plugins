# Specification: {Feature Name}

**Version:** 1.0
**Date:** YYYY-MM-DD
**Status:** Draft | Under Review | Approved | Implemented

---

## Problem Statement

{Clear, concise description of the problem this feature solves. 2-3 sentences maximum. Focus on the pain point, not the solution.}

## Beneficiaries

**Primary:**
- {Who benefits most from this feature}

**Secondary:**
- {Who else benefits indirectly}

---

## Outcomes
{Intended outcomes of this work, written from the user/consumer's perspective}

**Must Haves**
- {Must have goal 1}
- {Must have goal 2}

**Nice-to-haves**
- {Nice to have goal 1}
- {Nice to have goal 2}

---

## Explicitly Out of Scope

{List what is NOT included in this specification to prevent scope creep}

- {Feature/capability that won't be included}
- {Future enhancement to be addressed separately}
- {Alternative approach explicitly rejected}

---

## Functional Requirements

**FR-XXX: {Requirement Title}**
- **Description:** {What the system does, in user/behavior terms. Not
  implementation.}
- **Acceptance Criteria:**
  - **AC-XXX.1:** Given {precondition}, when {action}, then {observable}.
    *Observable:* {system, artifact, expected value}
  - **AC-XXX.2:** ...
- **Failure/edge cases:** {Boundaries that don't merit their own AC —
  brief prose only.}

> **Example:**
>
> **FR-EX: Mark notification as read**
> - Description: A user marks an unread notification as read.
> - Acceptance Criteria:
>   - **AC-EX.1:** Given an unread notification owned by user U, when U
>     marks it read, then read_at is set.
>     *Observable:* `SELECT read_at FROM notifications WHERE id=N`
>     returns a non-null timestamp.
>   - **AC-EX.2:** Given a notification owned by another user, when U
>     marks it read, then the request is rejected.
>     *Observable:* response status is 403; `read_at` remains null.
> - Failure/edge cases: repeated marks are idempotent — AC-EX.1's
>   observable already covers this (read_at stays non-null).

---

## Deferred / Non-Verifiable Requirements (optional)

**FR-XXX: {Title}**
- **Blocker:** {Why no AC — e.g., "verification requires SMTP provider
  internals."}
- **Proposed handling:** {Drop, monitor in production, or narrow scope.}

---

## Non-Functional Requirements (optional)

**NFR-XX: {Requirement Title}**
- **Target:** {measurable threshold, e.g., p99 latency < 200ms at 1k rps}
- **Verification:** app-instrumented | platform-observed | architectural-only
- **Observable (if app-instrumented):** {metric name and where to read it}

---

## QA Plan

**QA-XX: {Scenario name}**
- Goal: {What this validates from the user's perspective.}
- Path: happy | failure
- Steps:
  1. {User action in browser/frontend/CLI.}
  2. {Next action.}
  3. ...
- Expected: {What the user should see or experience.}

---

## Open Questions

{List any Open Questions (if any)}

- {Open question about user facing problem}
- {Open question about ambiguous requirement}

---

## Appendix

### Glossary
- **Term 1:** Definition
- **Term 2:** Definition

### References
- {Link to related documents, research, or external specifications}

### Change History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | {Name} | Initial specification |
