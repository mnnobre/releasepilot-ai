# Architecture

ReleasePilot AI starts as a frontend-first product slice. The goal of this
version is to validate the release decision experience before introducing
infrastructure that the product does not need yet.

## Current boundaries

```text
UI components
    |
    v
Release analysis service
    |
    v
Typed release fixtures
```

- `src/types` defines the product language and contracts.
- `src/data` provides explicit demo fixtures.
- `src/services` owns release assessment rules independently from React.
- `src/App.tsx` composes the product experience and interactions.

The deterministic analysis service intentionally mirrors the future AI adapter
contract. This keeps the interface honest today and makes an LLM integration a
replaceable infrastructure concern later.

## Target architecture

```text
React dashboard
    |
    v
API / application layer
    |
    +--> Release and policy domain
    +--> Test evidence adapters
    +--> GitHub Actions adapter
    +--> AI analysis adapter
    |
    v
PostgreSQL + object storage
```

## Decisions

### Frontend-first MVP

The first milestone focuses on the workflow and information hierarchy. It
avoids a placeholder backend and keeps every displayed number traceable to a
fixture.

### Deterministic analysis before LLM integration

Release recommendations are high-impact decisions. The current rules make the
logic testable and transparent. A future LLM should summarize evidence and
explain risk, while policy enforcement remains deterministic.

### Typed domain contracts

Quality gates, executions, releases, and analyses are modeled explicitly.
These types will become API contracts when the backend is introduced.

## Next technical milestones

1. Extract reusable UI components and add Storybook.
2. Introduce an API with release and evidence endpoints.
3. Persist projects, policies, executions, and approvals in PostgreSQL.
4. Ingest GitHub Actions and Playwright artifacts.
5. Add an AI adapter with structured output, evaluation fixtures, and audit
   logs.
6. Add authentication, role-based access, and deployment environments.
