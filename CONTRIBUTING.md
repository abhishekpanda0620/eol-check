# Contributing to eol-check

We welcome contributions from everyone! By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🗺️ Roadmap & Planning

Before starting work on a major feature, please check our [ROADMAP.md](ROADMAP.md) and [GitHub Issues](https://github.com/abhishekpanda0620/eol-check/issues).

- **v1.4**: Enhanced UX (auto-open reports, query commands)
- **v1.5**: Multi-Provider Support (AI models, cloud services)
- **v2.0**: Advanced Features (Dashboard, AI recommendations)

If you want to work on an item, please comment on the relevant issue to avoid duplication of effort.

## 🛠️ Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/eol-check.git
   cd eol-check
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```
   *Note: The project uses TypeScript. The build command compiles `src/` to `dist/`.*

4. **Run Locally**
   You can test your changes using the local check script:
   ```bash
   npm run check
   # or with arguments
   npm run check -- --verbose
   ```

## 🧪 Testing

We use Jest for testing. Please ensure all tests pass before submitting a PR.

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/core/productMapper.test.ts
```

**Requirement:** All new features must include unit tests.

## 📦 Pull Request Process

1. **Create a Branch**
   Use a descriptive branch name:
   ```bash
   git checkout -b feature/add-openai-provider
   # or
   git checkout -b fix/resolve-issue-123
   ```

2. **Commit Changes**
   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: add new feature`
   - `fix: resolve bug`
   - `docs: update documentation`
   - `test: add tests`

3. **Verify Build**
   Ensure the project builds correctly. The `prepublishOnly` script ensures `dist/` is built before publishing, but you should verify it locally:
   ```bash
   npm run build
   ```

4. **Submit PR**
   - Push your branch to your fork.
   - Open a Pull Request against the `main` branch.
   - **Fill out the PR Template**: Our template will automatically load. Please fill out all sections, including the testing checklist.

## 🐛 Reporting Bugs

Please open an issue with:
- Version of `eol-check` used
- Node.js version
- OS details
- Steps to reproduce

## 💡 Suggesting Enhancements

Check the [ROADMAP.md](ROADMAP.md) first. If your idea isn't there, open an issue with the "enhancement" label.
