import fs from 'fs';
import path from 'path';

export interface ScanResult {
  nodeVersion: string;
  packageManager: string;
  os: string;
}

export const scanEnvironment = (): ScanResult => {
  const nodeVersion = process.version;
  let packageManager = 'npm'; // Default
  let os = 'Unknown';

  // Detect Package Manager
  if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) {
    packageManager = 'yarn';
  } else if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) {
    packageManager = 'pnpm';
  }

  // Detect OS (Linux specific for now, as per spec)
  try {
    if (fs.existsSync('/etc/os-release')) {
      const osRelease = fs.readFileSync('/etc/os-release', 'utf-8');
      const lines = osRelease.split('\n');
      const nameLine = lines.find((line) => line.startsWith('PRETTY_NAME='));
      if (nameLine) {
        os = nameLine.split('=')[1].replace(/"/g, '');
      }
    } else {
        os = process.platform;
    }
  } catch (error) {
    console.warn('Failed to detect OS details', error);
    os = process.platform;
  }

  return {
    nodeVersion,
    packageManager,
    os,
  };
};
