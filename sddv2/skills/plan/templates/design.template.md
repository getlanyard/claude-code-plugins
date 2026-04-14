# Design: {Feature Name}

**Version:** 1.0
**Date:** YYYY-MM-DD
**Status:** Draft | Under Review | Approved | Implemented
**Linked Specification** `.sdd/{feature}/specification.md`

---

# Design Document

---

## Architecture Overview

### Current Architecture Context
- {How does this fit into existing system?}

### Proposed Architecture
- {Diagram or description}
- {Key patterns and rationale}
- {Sequence diagram if necessary}

### Technology Decisions
- {Choices and justification}

### Quality Attributes
- {Scalability approach}
- {Maintainability considerations}

---

## API Design (optional)
- {Public interface definitions}
- {Data models and schemas}
- {Error handling strategy}
- {Versioning approach}

---

## Modified Components

### {Modified Component 1}
**Change Description** {Short description of what it currently does and what it needs to do. Describe the delta}

**Dependants** {Any dependants that need to be modified as a result}

**Kind** {Function | Struct | Module | Crate | Database etc}

**Details**
> Brief pseudo-code or type signatures only (5-10 lines max). Do NOT include full implementation code.

```
{details}
```

**Requirements References**
- {feature-name:FR-001}: {Why this requirement necessitates this change}
- {feature-name:NFR-001}: {Why this requirement necessitates this change}

**Test Scenarios**

**TS-XX: {Scenario name}**
- Given: {Initial state/context}
- When: {Action performed}
- Then: {Expected outcome}

---

## Added Components

### {Added Component 1}
**Description** {Short description of what the new component should do}

**Users** {Who/what will call/use this component?}

**Kind** {Function | Struct | Module | Crate | Database etc}

**Location** {Which file/class/module/crate will this new component be located in?}

**Details**
> Brief pseudo-code or type signatures only (5-10 lines max). Do NOT include full implementation code.

```
{details}
```

**Requirements References**
- {feature-name:FR-001}: {Why this requirement necessitates this component}
- {feature-name:NFR-001}: {Why this requirement necessitates this component}

**Test Scenarios**

**TS-XX: {Scenario name}**
- Given: {Initial state/context}
- When: {Action performed}
- Then: {Expected outcome}

---

## Used Components

> Existing components required as-is for implementation. Document what each provides and why it's needed.

### {Used Component 1}
**Location** {Path to component}

**Provides** {What functionality/interface this component offers that we depend on}

**Used By** {Which Modified/Added components depend on this}

---

## Documentation Considerations
- {Developer docs that need to be created/updated}
- {API docs that need to be created/updated}
- {Readme's docs that need to be created/updated}
- {Any other documentation considerations?}

---

## Instrumentation (optional)

> Only include if there are NFRs requiring observability. Skip for typical features.

- {Metric/log/trace to implement and which component}

---

## Integration Test Scenarios (if needed)

> Define scenarios that test interactions between multiple components. Each scenario should verify a complete user journey or system interaction.

**ITS-XX: {Scenario name}**
- Given: {Initial system state}
- When: {User action or trigger}
- Then: {Expected system behavior}
- Components Involved: {List of components}

---

## E2E Test Scenarios (if needed)

> Define end-to-end scenarios that test complete user workflows through the entire system. Each scenario should simulate real user behavior from start to finish.

**E2E-XX: {Scenario name}**
- Given: {Initial user/system state}
- When: {Complete user workflow}
- Then: {Final expected state}
- User Journey: {Steps in the journey}

---

## Test Data
- {Requirements and sources}

---

## Test Feasibility
- {Missing test infrastructure that should be built first}
- {Missing test data that should be acquired first}

---

## Risks and Dependencies
- {Technical risks and mitigation}
- {External dependencies}
- {Assumptions and constraints}

---

## Feasability Review
- {Large missing feature that needs to be built first as separate iteration}
- {Large missing infrastructure that needs to be available first as separate iteration}

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
| 1.0 | YYYY-MM-DD | {Name} | Initial design |

---
