# EOL-Check Roadmap

This document outlines the planned features and improvements for `eol-check`. Community feedback and contributions are welcome!

## ✅ v1.4 - Enhanced User Experience (Released)

### Auto-Open HTML Reports
**Status:** ✅ Completed  
**Released:** v1.4.0

Automatically open generated HTML reports in the default browser instead of just saving them to disk.

```bash
eol-check --html report.html  # Opens in browser automatically
eol-check --html report.html --no-browser  # Opt-out option
```

**Implementation:**
- ✅ Added `open` package dependency
- ✅ Added `--no-browser` flag to disable auto-open
- ✅ Platform-aware browser detection (Windows, macOS, Linux)

---

### Query Specific Services
**Status:** ✅ Completed  
**Released:** v1.4.0

Allow users to query specific services/versions without auto-detection.

```bash
# Query specific service
eol-check query nodejs 18.0.0
eol-check query python 3.9

# Query AI models
eol-check query anthropic claude-3-opus
eol-check query openai gpt-4
```

**Use Cases:**
- ✅ Quick EOL lookups without project context
- ✅ CI/CD planning and migration planning
- ✅ Documentation and research

---

## ✅ v1.5 - AI/ML Model EOL Tracking (Released)

### AI/ML Models Provider
**Status:** ✅ Completed  
**Released:** v1.5.0

Track deprecation and EOL for generative AI models from major providers.

**Supported Providers:**

- ✅ **OpenAI**: GPT-3.5-turbo, GPT-4, GPT-4o, GPT-5, o1/o3, DALL-E
- ✅ **Anthropic**: Claude 1-4, Claude 3.5/4.5 Sonnet/Opus/Haiku
- ✅ **Google**: PaLM 2, Gemini 1.0/1.5/2.0/2.5/3.0 Pro/Flash
- ✅ **Meta**: Llama 2, 3, 3.1, 3.2, 3.3, 4
- ✅ **Mistral AI**: Mistral 7B, Mixtral, Mistral Large/Small, Codestral, Pixtral
- ✅ **Cohere**: Command, Command-R, Command-A

**Features:**
- Automatic detection of AI SDKs in package.json
- Code scanning for model references in source files
- Web crawlers for AWS Bedrock and Google AI deprecation data
- Query command integration for AI models

```bash
# Scan project for AI model usage
eol-check  # Auto-detects AI SDKs and model usage

# Query specific AI models
eol-check query openai gpt-4
eol-check query anthropic claude-3-opus
eol-check query google gemini-1.5-pro
```

---

## 🔮 v1.6 - Infrastructure & Custom Data (Planned)

### Cloud Infrastructure Scanners
**Status:** Planned  
**Priority:** High

Add scanners for cloud infrastructure configuration files. Note: EOL data for cloud services already exists in endoflife.date (aws-lambda, amazon-eks, amazon-rds-*, azure-kubernetes-service, google-kubernetes-engine, etc.).

**Scanners to Add:**

#### 1. Infrastructure File Detection
- **Serverless Framework**: Scan `serverless.yml` for runtime versions
- **AWS SAM**: Scan `template.yaml` for Lambda runtimes
- **Terraform**: Scan `.tf` files for EKS/RDS/Lambda versions
- **CloudFormation**: Scan templates for AWS resource versions
- **Kubernetes**: Scan manifests for deprecated API versions

```bash
eol-check --scan-infra  # Scan infrastructure files
```

---

### Custom Data Provider
Allow users to define custom EOL data via JSON/YAML files:

```yaml
# .eol-check.yml
custom-products:
  - name: internal-service-v1
    version: 1.0.0
    eol: 2025-12-31
    support: 2025-06-30
    
  - name: legacy-api
    version: 2.0.0
    eol: 2024-12-31
    lts: false
```

**Architecture:**
```typescript
interface DataProvider {
  name: string;
  fetchEOL(product: string): Promise<EOLData[]>;
  supports(product: string): boolean;
  priority: number; // For provider ordering
}

class DataProviderRegistry {
  registerProvider(provider: DataProvider): void;
  getProviders(product: string): DataProvider[];
  query(product: string, version: string): Promise<EOLResult>;
}
```

---

## 🔮 v1.7 - CI/CD & Export Integrations (Planned)

### SBOM Export
**Status:** Planned  
**Priority:** High

Generate Software Bill of Materials (SBOM) with EOL annotations in standard formats.

```bash
eol-check --sbom cyclonedx > sbom.json
eol-check --sbom spdx > sbom.spdx.json
```

**Formats:**
- CycloneDX (JSON/XML)
- SPDX (JSON/Tag-Value)

---

### CI/CD Enhancements
**Status:** Planned  
**Priority:** High

Improved integrations for CI/CD pipelines.

- **Exit codes**: Configurable failure thresholds (`--fail-on eol`, `--fail-on deprecated`)
- **SARIF output**: For GitHub Code Scanning integration
- **JUnit XML**: For CI test result parsing
- **GitLab CI integration**: Native `.gitlab-ci.yml` template

```bash
eol-check --output sarif > results.sarif
eol-check --fail-on eol --warn-on deprecated
```

---

### Pre-commit Hook
**Status:** Planned  
**Priority:** Medium

Native pre-commit hook support for blocking commits with EOL dependencies.

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/abhishekpanda0620/eol-check
    rev: v1.7.0
    hooks:
      - id: eol-check
```

---

## 🔮 v1.8 - Developer Experience (Planned)

### VSCode Extension
**Status:** Planned  
**Priority:** High

Visual Studio Code extension with inline EOL warnings.

**Features:**
- Inline decorations for EOL dependencies in `package.json`, `requirements.txt`, etc.
- Hover tooltips with EOL dates and upgrade suggestions
- Problems panel integration
- Quick fix actions for version upgrades

---

### Watch Mode
**Status:** Planned  
**Priority:** Medium

Continuous monitoring mode for development.

```bash
eol-check --watch
# Re-scans on file changes, shows desktop notifications
```

---

### Notification Webhooks
**Status:** Planned  
**Priority:** Medium

Send EOL alerts to external services.

```bash
eol-check --webhook slack:https://hooks.slack.com/...
eol-check --webhook discord:https://discord.com/api/webhooks/...
eol-check --webhook email:team@example.com
```

---

## 🔮 v1.9 - Stability & Performance (Planned)

### Test Coverage & Quality
**Status:** Planned  
**Priority:** Critical

Ensure production-ready stability before v2.0.

- Increase test coverage to 90%+
- Add end-to-end integration tests
- Performance benchmarking suite
- Fuzz testing for parsers

---

### Performance Optimization
**Status:** Planned  
**Priority:** High

- Parallel scanning for large monorepos
- Caching layer for API responses
- Incremental scanning (only changed files)
- Memory optimization for large projects

```bash
eol-check --cache --parallel 4
```

---

### Documentation & Polish
**Status:** Planned  
**Priority:** High

- Complete API documentation
- Architecture Decision Records (ADRs)
- Video tutorials and walkthroughs
- Improved error messages and troubleshooting guide

---

## 🌟 v2.0 - Advanced Features

### Interactive Dashboard
**Status:** Idea  
**Priority:** Medium

Web-based interactive dashboard for visualizing EOL status across projects.

- Real-time EOL monitoring
- Historical trend analysis
- Team/organization-wide visibility
- Slack/Teams notifications for approaching EOL
- Integration with project management tools

---

### AI-Powered Recommendations
**Status:** Idea  
**Priority:** Medium

Use AI to provide intelligent upgrade recommendations:
- Suggest migration paths for EOL software
- Estimate upgrade effort based on breaking changes
- Generate upgrade scripts/guides
- Compatibility matrix for version combinations

```bash
eol-check --recommend
# Output:
# Recommendation: Upgrade Node.js 16 → 20 (LTS)
# Estimated effort: Medium
# Breaking changes: 3 detected
# Migration guide: https://nodejs.org/en/blog/release/v20.0.0
```

---

### Registry/Database Support
**Status:** Idea  
**Priority:** Low

Check EOL status for database schemas, container images, and package registries:
- Docker images (FROM base images)
- Database migrations and schema versions
- Internal package registries
- Kubernetes manifests (apiVersion deprecations)

---

## 🤝 Community Ideas

> Have an idea? [Open an issue](https://github.com/abhishekpanda0620/eol-check/issues/new) or submit a PR!

### Potential Features
- [ ] Plugin system for custom scanners
- [x] ~~VSCode extension with inline warnings~~ → **Planned for v1.8**
- [x] ~~Pre-commit hooks for EOL detection~~ → **Planned for v1.7**
- [x] ~~SBOM (Software Bill of Materials) export~~ → **Planned for v1.7**
- [ ] Integration with Dependabot/Renovate
- [x] ~~Notification webhooks (email, Slack, Discord)~~ → **Planned for v1.8**
- [ ] Multi-language support for reports
- [ ] Historical EOL analytics and trends
- [x] ~~Terraform/IaC version scanning~~ → **Planned for v1.6**
- [ ] API endpoint for programmatic access



## 🚧 Technical Debt & Improvements

### Code Quality
- [ ] Increase test coverage to 90%+ → **Planned for v1.9**
- [ ] Add integration tests → **Planned for v1.9**
- [ ] Performance benchmarking → **Planned for v1.9**
- [ ] Refactor scanner engine for better modularity

### Documentation
- [ ] API documentation → **Planned for v1.9**
- [ ] Plugin development guide
- [ ] Architecture decision records (ADRs) → **Planned for v1.9**
- [ ] Video tutorials → **Planned for v1.9**

### DevOps
- [x] ~~Automated release workflow~~ ✅ Completed
- [ ] Canary releases for npm
- [ ] Performance monitoring
- [ ] Usage analytics (opt-in)

---

## 💡 Contributing

Want to help build these features? Check out our [Contributing Guide](CONTRIBUTING.md) and pick an item from this roadmap!

For major features, please open a discussion issue first to align on design and approach.

---

**Last Updated:** December 5, 2025  
**Maintainer:** [@abhishekpanda0620](https://github.com/abhishekpanda0620)
