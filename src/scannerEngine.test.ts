import { scanEnvironment } from './scannerEngine';
import fs from 'fs';

jest.mock('fs');

describe('scannerEngine', () => {
  const originalPlatform = process.platform;

  afterEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
    });
  });

  it('should detect Node.js version', () => {
    const result = scanEnvironment();
    expect(result.nodeVersion).toBe(process.version);
  });

  it('should detect npm by default', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const result = scanEnvironment();
    expect(result.packageManager).toBe('npm');
  });

  it('should detect yarn if yarn.lock exists', () => {
    (fs.existsSync as jest.Mock).mockImplementation((path: string) => {
      return path.includes('yarn.lock');
    });
    const result = scanEnvironment();
    expect(result.packageManager).toBe('yarn');
  });

  it('should detect OS from /etc/os-release', () => {
    (fs.existsSync as jest.Mock).mockImplementation((path: string) => {
      return path === '/etc/os-release';
    });
    (fs.readFileSync as jest.Mock).mockReturnValue('PRETTY_NAME="Ubuntu 22.04.5 LTS"\nNAME="Ubuntu"');
    
    const result = scanEnvironment();
    expect(result.os).toBe('Ubuntu 22.04.5 LTS');
  });
});
