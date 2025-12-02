import fs from 'fs';
import path from 'path';

export interface Dependency {
  name: string;
  version: string;
  type: 'npm' | 'composer' | 'python' | 'go' | 'ruby';
  file: string;
}

export function scanDependencies(dir: string): Dependency[] {
  const dependencies: Dependency[] = [];

  // Scan package.json
  const packageJsonPath = path.join(dir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const content = fs.readFileSync(packageJsonPath, 'utf-8');
      const pkg = JSON.parse(content);
      
      const allDeps = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      };

      for (const [name, version] of Object.entries(allDeps)) {
        dependencies.push({
          name,
          version: String(version),
          type: 'npm',
          file: 'package.json',
        });
      }
    } catch (error) {
      console.warn('Failed to parse package.json:', error);
    }
  }

  // Scan composer.json
  const composerJsonPath = path.join(dir, 'composer.json');
  if (fs.existsSync(composerJsonPath)) {
    try {
      const content = fs.readFileSync(composerJsonPath, 'utf-8');
      const pkg = JSON.parse(content);
      
      const allDeps = {
        ...(pkg.require || {}),
        ...(pkg['require-dev'] || {}),
      };

      for (const [name, version] of Object.entries(allDeps)) {
        dependencies.push({
          name,
          version: String(version),
          type: 'composer',
          file: 'composer.json',
        });
      }
    } catch (error) {
      console.warn('Failed to parse composer.json:', error);
    }
  }

  // Scan requirements.txt (Python)
  const requirementsPath = path.join(dir, 'requirements.txt');
  if (fs.existsSync(requirementsPath)) {
    try {
      const content = fs.readFileSync(requirementsPath, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          // Simple parse: "package==version" or "package>=version"
          const match = trimmed.match(/^([a-zA-Z0-9-_]+)[=<>!~]+([0-9a-zA-Z.]+)/);
          if (match) {
            dependencies.push({
              name: match[1],
              version: match[2],
              type: 'python',
              file: 'requirements.txt',
            });
          }
        }
      }
    } catch (error) {
      console.warn('Failed to parse requirements.txt:', error);
    }
  }

  // Scan go.mod (Go)
  const goModPath = path.join(dir, 'go.mod');
  if (fs.existsSync(goModPath)) {
    try {
      const content = fs.readFileSync(goModPath, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        // Look for "go 1.24" or "require ( ... )"
        if (trimmed.startsWith('go ')) {
           dependencies.push({
            name: 'go',
            version: trimmed.split(' ')[1],
            type: 'go',
            file: 'go.mod',
          });
        }
        // Simple require line: "github.com/gin-gonic/gin v1.9.1"
        // Note: This is very basic parsing
        if (trimmed.includes(' v')) {
           const parts = trimmed.split(' ');
           if (parts.length >= 2 && parts[1].startsWith('v')) {
             dependencies.push({
               name: parts[0],
               version: parts[1].substring(1), // remove 'v'
               type: 'go',
               file: 'go.mod',
             });
           }
        }
      }
    } catch (error) {
      console.warn('Failed to parse go.mod:', error);
    }
  }

  // Scan Gemfile (Ruby)
  const gemfilePath = path.join(dir, 'Gemfile');
  if (fs.existsSync(gemfilePath)) {
    try {
      const content = fs.readFileSync(gemfilePath, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        // gem 'rails', '~> 8.0'
        if (trimmed.startsWith('gem ')) {
          const parts = trimmed.split(',');
          const namePart = parts[0].match(/'([^']+)'| "([^"]+)"/);
          const versionPart = parts[1] ? parts[1].match(/'([^']+)'| "([^"]+)"/) : null;
          
          if (namePart) {
             const name = namePart[1] || namePart[2];
             const version = versionPart ? (versionPart[1] || versionPart[2]) : 'latest';
             dependencies.push({
               name,
               version,
               type: 'ruby',
               file: 'Gemfile',
             });
          }
        }
        // ruby '3.2.0'
        if (trimmed.startsWith('ruby ')) {
           const match = trimmed.match(/'([^']+)'| "([^"]+)"/);
           if (match) {
             dependencies.push({
               name: 'ruby',
               version: match[1] || match[2],
               type: 'ruby',
               file: 'Gemfile',
             });
           }
        }
      }
    } catch (error) {
      console.warn('Failed to parse Gemfile:', error);
    }
  }

  return dependencies;
}

export function cleanVersion(version: string): string {
  // Remove range characters: ^, ~, >=, <=, >, <, =
  // Also handle "v" prefix if present
  // Examples: "^1.2.3" -> "1.2.3", "~1.2" -> "1.2", ">=1.0.0" -> "1.0.0"
  
  // Simple regex to find the first valid version number part
  const match = version.match(/(\d+(\.\d+)*)/);
  return match ? match[0] : version;
}
