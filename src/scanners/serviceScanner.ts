import { execSync } from 'child_process';

export interface ServiceCheck {
  binary: string;
  productSlug: string;
  versionFlag: string;
  versionRegex: RegExp;
}

export interface DetectedService {
  name: string;
  product: string;
  version: string;
}

const SERVICES: ServiceCheck[] = [
  {
    binary: 'redis-server',
    productSlug: 'redis',
    versionFlag: '--version',
    versionRegex: /v=(\d+\.\d+\.\d+)/,
  },
  {
    binary: 'psql',
    productSlug: 'postgresql',
    versionFlag: '--version',
    versionRegex: /psql \(PostgreSQL\) (\d+\.\d+(\.\d+)?)/,
  },
  {
    binary: 'mysql',
    productSlug: 'mysql',
    versionFlag: '--version',
    versionRegex: /Ver (\d+\.\d+\.\d+)/,
  },
  {
    binary: 'mongod',
    productSlug: 'mongodb',
    versionFlag: '--version',
    versionRegex: /db version v(\d+\.\d+\.\d+)/,
  },
  {
    binary: 'docker',
    productSlug: 'docker-engine',
    versionFlag: '--version',
    versionRegex: /version (\d+\.\d+\.\d+)/,
  },
  {
    binary: 'git',
    productSlug: 'git',
    versionFlag: '--version',
    versionRegex: /version (\d+\.\d+\.\d+)/,
  },
  {
    binary: 'python3',
    productSlug: 'python',
    versionFlag: '--version',
    versionRegex: /Python (\d+\.\d+\.\d+)/,
  },
  {
    binary: 'java',
    productSlug: 'java',
    versionFlag: '--version',
    versionRegex: /version "(\d+\.\d+\.\d+(_\d+)?)"/, // Matches "1.8.0_292" or "11.0.11"
  },
  {
    binary: 'go',
    productSlug: 'go',
    versionFlag: 'version',
    versionRegex: /go version go(\d+\.\d+(\.\d+)?)/,
  },
];

export function scanLocalServices(): DetectedService[] {
  const detected: DetectedService[] = [];

  for (const service of SERVICES) {
    try {
      const output = execSync(`${service.binary} ${service.versionFlag}`, {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'], // Ignore stdin/stderr
        timeout: 1000, // 1s timeout to avoid hanging
      });

      const match = output.match(service.versionRegex);
      if (match && match[1]) {
        detected.push({
          name: service.binary,
          product: service.productSlug,
          version: match[1],
        });
      }
    } catch {
      // Binary not found or failed to run - ignore
      continue;
    }
  }

  return detected;
}
