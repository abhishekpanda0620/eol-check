# eol-check

[![npm version](https://img.shields.io/npm/v/eol-check.svg)](https://www.npmjs.com/package/eol-check)
[![CI](https://github.com/abhishekpanda0620/eol-check/actions/workflows/ci.yml/badge.svg)](https://github.com/abhishekpanda0620/eol-check/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/abhishekpanda0620/eol-check/branch/main/graph/badge.svg)](https://codecov.io/gh/abhishekpanda0620/eol-check)


A CLI tool to check the End-Of-Life (EOL) status of your development environment and project dependencies.

## Features

-   **Automated Detection**: Detects Node.js version, package manager (npm/yarn/pnpm), and OS (Ubuntu/Alpine/Debian).
-   **System Service Scanning**: Detects and checks EOL status of local system services (Redis, PostgreSQL, Docker, etc.).
-   **Real-time Data**: Fetches the latest EOL data from [endoflife.date](https://endoflife.date).
-   **Actionable Feedback**: clearly indicates if a component is supported, approaching EOL, or EOL.

## Installation

### Global Installation

```bash
npm install -g eol-check
```

### Local/Project Installation

```bash
npm install --save-dev eol-check
```

**Option 1: Run with npx (Recommended)**
```bash
npx eol-check
```

**Option 2: Add to package.json**
Add the following to your `package.json` scripts:
```json
{
  "scripts": {
    "check": "eol-check"
  }
}
```

Then you can run:
```bash
npm run check
```

## Usage

### Basic Scan

Run the tool in any project directory:

```bash
eol-check
```

### Query Specific Products

Query EOL status for specific products/services:

```bash
# Query all versions of a product
eol-check query nodejs

# Query specific version
eol-check query nodejs 18
eol-check query python 3.9
eol-check query postgresql 14
```

### Options

**Main Command Options:**
- `--json`: Output results in JSON format (great for CI pipelines).
- `--html <filename>`: Generate a beautiful HTML report with visualizations.
- `--no-browser`: Don't automatically open HTML report in browser (v1.4.0+).
- `--verbose`: Show detailed logs of what is being scanned.
- `--refresh-cache`: Force refresh of cached EOL data.
- `--help`: Show help information.

**Query Command Options:**
- `--refresh-cache`: Force refresh of cached EOL data for the queried product.

## Supported Scanners

| Language | File | Supported Frameworks/Tools |
|----------|------|-------------------------------|
| Node.js | `package.json` | React, Vue, Angular, Next.js, Nuxt, Ember, Svelte, jQuery, Bootstrap, TailwindCSS, Electron, React Native, Express, ESLint, Protractor, Grunt |
| PHP | `composer.json` | Laravel, Symfony, Drupal, Magento, Typo3, PHP, Composer |
| Python | `requirements.txt` | Django, Python, Ansible, Kubernetes |
| Go | `go.mod` | Go |
| Ruby | `Gemfile` | Ruby, Rails, Jekyll |
| Databases | Various | PostgreSQL, MySQL, MongoDB, Redis, MariaDB, Elasticsearch, Memcached, Cassandra, Neo4j, SQLite, CouchDB |
| Build Tools | Various | Gradle, Maven, Ant, Bazel |
| Container/DevOps | Binary Check | Docker, Containerd, Podman |
| System Services | Binary Check | Redis, PostgreSQL, MySQL, MongoDB, Docker, Git, Python, Java, Go |

### Example Output

```text
Scanning environment...

EOL Check Results:
[OK] Node.js v18.16.0 - Version 18 is supported (ends 2025-04-30)
[WARN] Ubuntu 20.04 - Version 20 is approaching EOL (ends 2025-04-02)
```

## HTML Reports

Generate beautiful, shareable HTML reports with visualizations:

```bash
eol-check --html report.html
```

Features:
- 📊 Summary statistics dashboard
- 🎨 Color-coded severity indicators  
- 📱 Responsive design (mobile-friendly)
- 📤 Exportable standalone HTML (no external dependencies)
- 🖨️ Print-friendly styling

## GitHub Action

Automate EOL checks in your CI/CD pipeline:

```yaml
name: EOL Check
on: [push, pull_request]

jobs:
  eol-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: abhishekpanda0620/eol-check@v1.4.1
        with:
          generate-html: true
```

**See [GitHub Action Documentation](.github/ACTION-README.md) for:**
- HTML report artifacts
- Configuration options
- Advanced usage examples
- Monorepo support

## CI/CD Integration

You can use `eol-check` in your CI pipelines to fail builds if an EOL component is detected.

```bash
# In your CI script
eol-check || exit 1
```

The tool exits with code `1` if any component is found to be EOL (Status: ERR).
