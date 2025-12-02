# eol-check

[![npm version](https://badge.fury.io/js/eol-check.svg)](https://www.npmjs.com/package/eol-check)
[![CI](https://github.com/abhishekpanda0620/eol-check/actions/workflows/ci.yml/badge.svg)](https://github.com/abhishekpanda0620/eol-check/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/abhishekpanda0620/eol-check/branch/main/graph/badge.svg)](https://codecov.io/gh/abhishekpanda0620/eol-check)


A CLI tool to check the End-Of-Life (EOL) status of your development environment and project dependencies.

## Features

-   **Automated Detection**: Detects Node.js version, package manager (npm/yarn/pnpm), and OS (Ubuntu/Alpine/Debian).
-   **Real-time Data**: Fetches the latest EOL data from [endoflife.date](https://endoflife.date).
-   **Actionable Feedback**: clearly indicates if a component is supported, approaching EOL, or EOL.

## Installation

### From npm (Global)

```bash
npm install -g eol-check
```

## Usage

Run the tool in any project directory:

```bash
eol-check
```

### Options

- `--json`: Output results in JSON format (great for CI pipelines).
- `--verbose`: Show detailed logs of what is being scanned.
- `--refresh-cache`: Force refresh of cached EOL data.
- `--help`: Show help information.

## Supported Scanners

| Language | File | Supported Frameworks/Tools |
|----------|------|----------------------------|
| Node.js | `package.json` | React, Vue, Angular, Next.js, Nuxt, NestJS, Ember, Svelte, TypeScript, jQuery, Bootstrap, TailwindCSS, Electron |
| PHP | `composer.json` | Laravel, Symfony, Drupal, Magento, Typo3, PHP |
| Python | `requirements.txt` | Django, Flask, Python, Ansible, Kubernetes |
| Go | `go.mod` | Go, Gin, Fiber |
| Ruby | `Gemfile` | Ruby, Rails, Jekyll |

### Example Output

```text
Scanning environment...

EOL Check Results:
[OK] Node.js v18.16.0 - Version 18 is supported (ends 2025-04-30)
[WARN] Ubuntu 20.04 - Version 20 is approaching EOL (ends 2025-04-02)
```

## CI/CD Integration

You can use `eol-check` in your CI pipelines to fail builds if an EOL component is detected.

```bash
# In your CI script
eol-check || exit 1
```

The tool exits with code `1` if any component is found to be EOL (Status: ERR).
