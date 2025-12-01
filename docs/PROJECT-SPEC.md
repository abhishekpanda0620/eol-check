# Project Specification: eol-check

## Overview
`eol-check` is a CLI tool designed to scan a development environment or project and verify the End-Of-Life (EOL) status of its core components. It helps developers and DevOps engineers ensure they are not using unsupported versions of software, reducing security risks and compatibility issues.

## Goals
1.  **Automated Detection**: Automatically detect versions of key tools (Node.js, Package Managers, OS).
2.  **Accurate Data**: Use the `endoflife.date` API to get the latest EOL information.
3.  **Actionable Output**: Provide clear warnings and errors when a component is EOL or approaching EOL.
4.  **CI/CD Integration**: Support non-interactive modes and exit codes for use in CI pipelines.

## Scope
### Phase 1: Core Support
-   **Runtime**: Node.js
-   **Package Managers**: npm, yarn, pnpm
-   **OS**: Alpine, Ubuntu, Debian (detected via `/etc/os-release` or similar)

### Future Scope
-   Language support: Python, Ruby, Go, Java
-   Framework support: React, Angular, Vue (via `package.json`)
-   Database support: Postgres, Redis (via `docker-compose.yml` or connection checks)

## Architecture
-   **Scanner Engine**: Probes the system/project to find versions.
-   **API Layer**: Caches and fetches data from `endoflife.date`.
-   **Evaluation Engine**: Compares current version vs. EOL dates.
-   **CLI**: User interface for running checks and configuring output (JSON, table, etc.).

## User Experience
```bash
$ eol-check
Scanning environment...

[OK] Node.js v18.16.0 (LTS, ends 2025-04-30)
[WARN] npm v8.19.2 (Maintenance, ends 2023-12-31)
[ERR] Ubuntu 18.04 (EOL since 2023-05-31)

Found 1 EOL component.
```
