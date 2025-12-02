# EOL Check GitHub Action

Automatically check the End-of-Life (EOL) status of your dependencies and environment in GitHub Actions workflows.

## Features

- 🔍 Automatically scans Node.js, OS, and project dependencies
- 📊 Generates beautiful HTML reports as artifacts
- ⚠️ Configurable failure on EOL components
- 📝 Adds summary to GitHub Actions job output
- 🚀 Zero configuration required

## Usage

### Basic Example

```yaml
name: EOL Check

on: [push, pull_request]

jobs:
  eol-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run EOL Check
        uses: abhishekpanda0620/eol-check@v1
```

### With HTML Report

```yaml
- name: Run EOL Check with HTML Report
  uses: abhishekpanda0620/eol-check@v1
  with:
    generate-html: true
    html-filename: eol-report.html

- name: Upload HTML Report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: eol-report
    path: eol-report.html
```

### Advanced Configuration

```yaml
- name: Run EOL Check
  uses: abhishekpanda0620/eol-check@v1
  with:
    fail-on-eol: true           # Fail workflow if EOL found (default: true)
    generate-html: true          # Generate HTML report (default: false)
    html-filename: report.html   # Custom filename (default: eol-report.html)
    verbose: true                # Enable verbose logging (default: false)
    working-directory: ./backend # Run in specific directory (default: .)
```

### Use Outputs in Next Steps

```yaml
- name: Run EOL Check
  id: eol
  uses: abhishekpanda0620/eol-check@v1
  with:
    fail-on-eol: false

- name: Process Results
  run: |
    echo "Has EOL: ${{ steps.eol.outputs.has-eol }}"
    echo "Summary: ${{ steps.eol.outputs.summary }}"
    echo "${{ steps.eol.outputs.results }}" | jq .
```

### Monorepo Support

```yaml
strategy:
  matrix:
    project: [frontend, backend, api]

steps:
  - uses: actions/checkout@v4
  
  - name: Check ${{ matrix.project }}
    uses: abhishekpanda0620/eol-check@v1
    with:
      working-directory: ./${{ matrix.project }}
      generate-html: true
      html-filename: eol-${{ matrix.project }}.html
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `fail-on-eol` | Exit with error code if EOL components found | No | `true` |
| `generate-html` | Generate HTML report as artifact | No | `false` |
| `html-filename` | Filename for HTML report | No | `eol-report.html` |
| `verbose` | Enable verbose output | No | `false` |
| `working-directory` | Directory to run check in | No | `.` |

## Outputs

| Output | Description |
|--------|-------------|
| `results` | JSON array of all check results |
| `has-eol` | Boolean indicating if EOL components found |
| `summary` | JSON object with counts (total, ok, warn, err) |

## Supported Technologies

- **Languages**: Node.js, PHP, Python, Go, Ruby
- **Frameworks**: React, Vue, Angular, Next.js, Laravel, Django, Rails, and more
- **Databases**: PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch, and more
- **Testing**: Jest, Mocha, Cypress, Playwright, Pytest
- **Build Tools**: Webpack, Vite, Rollup, Gradle, Maven

See full list in [product mapping](https://github.com/abhishekpanda0620/eol-check/blob/main/src/productMapper.ts).

## Example Workflow with Badge

```yaml
name: EOL Check

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  push:
    branches: [main]
  pull_request:

jobs:
  eol-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: EOL Check
        uses: abhishekpanda0620/eol-check@v1
        with:
          generate-html: true
      
      - name: Upload Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: eol-report
          path: eol-report.html
```

Add badge to README:
```markdown
![EOL Check](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/eol-check.yml/badge.svg)
```

## License

MIT © Abhishek Panda
