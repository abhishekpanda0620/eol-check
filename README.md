# eol-check

A CLI tool to check the End-Of-Life (EOL) status of your development environment and project dependencies.

## Features

-   **Automated Detection**: Detects Node.js version, package manager (npm/yarn/pnpm), and OS (Ubuntu/Alpine/Debian).
-   **Real-time Data**: Fetches the latest EOL data from [endoflife.date](https://endoflife.date).
-   **Actionable Feedback**: clearly indicates if a component is supported, approaching EOL, or EOL.

## Installation

### From npm (Global)

Once published, you can install it globally:

```bash
npm install -g eol-check
```

### From Source (Local Development)

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build the project:
    ```bash
    npm run build
    ```
4.  Link the package globally:
    ```bash
    npm link
    ```

## Usage

Run the tool in any directory:

```bash
eol-check
```

### Options

-   `--json`: Output results in JSON format (useful for CI/CD pipelines).
-   `--verbose`: Show verbose logging during the scan.
-   `--help`: Show help information.

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
