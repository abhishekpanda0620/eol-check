/**
 * AI Model Scanner
 * 
 * Scans project files to detect AI/ML SDK usage and model references.
 */

import fs from 'fs';
import path from 'path';
import { 
  SDK_TO_PROVIDER, 
  MODEL_PATTERNS, 
  DetectedAIModel,
} from '../providers/aiModels';

export interface AISDKDetection {
  sdk: string;
  provider: string;
  version: string;
  file: string;
}

export interface AIScanResult {
  sdks: AISDKDetection[];
  models: DetectedAIModel[];
}

/**
 * Scan project for AI SDK dependencies
 */
export function scanAISDKs(dir: string): AISDKDetection[] {
  const sdks: AISDKDetection[] = [];

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
        if (SDK_TO_PROVIDER[name]) {
          sdks.push({
            sdk: name,
            provider: SDK_TO_PROVIDER[name],
            version: String(version),
            file: 'package.json',
          });
        }
      }
    } catch (error) {
      console.warn('Failed to parse package.json for AI SDKs:', error);
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
          const match = trimmed.match(/^([a-zA-Z0-9-_]+)[=<>!~]*(.*)$/);
          if (match) {
            const pkgName = match[1].toLowerCase();
            const version = match[2] || 'unknown';
            
            // Check against Python SDK names
            const pythonSDKs: Record<string, string> = {
              'openai': 'openai',
              'anthropic': 'anthropic',
              'google-generativeai': 'google',
              'cohere': 'cohere',
              'mistralai': 'mistral',
              'langchain': 'multiple',
              'langchain-openai': 'openai',
              'langchain-anthropic': 'anthropic',
              'langchain-google-genai': 'google',
              'huggingface-hub': 'huggingface',
              'transformers': 'huggingface',
              'replicate': 'replicate',
              'ollama': 'ollama',
            };
            
            if (pythonSDKs[pkgName]) {
              sdks.push({
                sdk: pkgName,
                provider: pythonSDKs[pkgName],
                version: version.replace(/[=<>!~]+/, ''),
                file: 'requirements.txt',
              });
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to parse requirements.txt for AI SDKs:', error);
    }
  }

  // Scan pyproject.toml (Python)
  const pyprojectPath = path.join(dir, 'pyproject.toml');
  if (fs.existsSync(pyprojectPath)) {
    try {
      const content = fs.readFileSync(pyprojectPath, 'utf-8');
      
      // Simple regex to find dependencies
      const depMatch = content.match(/\[project\.dependencies\]([\s\S]*?)(?=\[|$)/);
      const optionalMatch = content.match(/\[project\.optional-dependencies\]([\s\S]*?)(?=\[|$)/);
      
      const pythonSDKs: Record<string, string> = {
        'openai': 'openai',
        'anthropic': 'anthropic',
        'google-generativeai': 'google',
        'cohere': 'cohere',
        'mistralai': 'mistral',
        'langchain': 'multiple',
      };
      
      const checkSection = (section: string | undefined) => {
        if (!section) return;
        for (const [sdk, provider] of Object.entries(pythonSDKs)) {
          const regex = new RegExp(`['"]${sdk}[^'"]*['"]`, 'i');
          if (regex.test(section)) {
            sdks.push({
              sdk,
              provider,
              version: 'unknown',
              file: 'pyproject.toml',
            });
          }
        }
      };
      
      checkSection(depMatch?.[1]);
      checkSection(optionalMatch?.[1]);
    } catch (error) {
      console.warn('Failed to parse pyproject.toml for AI SDKs:', error);
    }
  }

  return sdks;
}

/**
 * Scan code files for model usage patterns
 */
export function scanForModelUsage(dir: string): DetectedAIModel[] {
  const models: DetectedAIModel[] = [];
  const seenModels = new Set<string>();

  // Files to scan for model patterns
  const filesToScan: string[] = [];
  
  // Collect relevant files
  const scanDir = (currentDir: string, depth: number = 0) => {
    if (depth > 3) return; // Limit depth
    
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip node_modules, .git, etc.
          if (!['node_modules', '.git', 'dist', 'build', '__pycache__', '.next', 'venv'].includes(entry.name)) {
            scanDir(fullPath, depth + 1);
          }
        } else if (entry.isFile()) {
          // Include relevant file types
          const ext = path.extname(entry.name).toLowerCase();
          if (['.ts', '.tsx', '.js', '.jsx', '.py', '.env', '.yaml', '.yml', '.json'].includes(ext)) {
            filesToScan.push(fullPath);
          }
        }
      }
    } catch {
      // Ignore permission errors
    }
  };

  scanDir(dir);

  // Scan each file for model patterns
  for (const filePath of filesToScan) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relativePath = path.relative(dir, filePath);
      
      // Skip large files
      if (content.length > 500000) continue;
      
      for (const [pattern, info] of Object.entries(MODEL_PATTERNS)) {
        // Check for model string in various contexts
        const patterns = [
          new RegExp(`['"\`]${escapeRegex(pattern)}['"\`]`, 'gi'),
          new RegExp(`model['":= \t]+['"\`]?${escapeRegex(pattern)}`, 'gi'),
          new RegExp(`MODEL['":= \t]+['"\`]?${escapeRegex(pattern)}`, 'gi'),
        ];
        
        for (const regex of patterns) {
          if (regex.test(content)) {
            const key = `${info.provider}:${info.model}`;
            if (!seenModels.has(key)) {
              seenModels.add(key);
              
              // Try to extract version from the pattern match
              const versionMatch = content.match(new RegExp(`${escapeRegex(pattern)}[-_]?(\\d{8}|latest|preview)?`, 'i'));
              const version = versionMatch?.[1] || 'latest';
              
              models.push({
                provider: info.provider,
                model: info.model,
                version,
                source: relativePath,
              });
            }
            break;
          }
        }
      }
      
      // Also check for environment variables with model names
      if (filePath.endsWith('.env') || filePath.includes('.env.')) {
        const envPattern = /(?:MODEL|OPENAI_MODEL|ANTHROPIC_MODEL|GOOGLE_MODEL)=['"]?([^'"=\n]+)/gi;
        let match;
        while ((match = envPattern.exec(content)) !== null) {
          const modelValue = match[1].trim();
          
          // Try to identify the model
          for (const [pattern, info] of Object.entries(MODEL_PATTERNS)) {
            if (modelValue.toLowerCase().includes(pattern.toLowerCase())) {
              const key = `${info.provider}:${info.model}`;
              if (!seenModels.has(key)) {
                seenModels.add(key);
                models.push({
                  provider: info.provider,
                  model: info.model,
                  version: 'latest',
                  source: relativePath,
                });
              }
              break;
            }
          }
        }
      }
    } catch {
      // Ignore read errors
    }
  }

  return models;
}

/**
 * Full AI scan combining SDK and model detection
 */
export function scanAIModels(dir: string): AIScanResult {
  return {
    sdks: scanAISDKs(dir),
    models: scanForModelUsage(dir),
  };
}

/**
 * Helper to escape regex special characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
