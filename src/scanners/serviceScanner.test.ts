import { scanLocalServices } from './serviceScanner';
import * as child_process from 'child_process';

jest.mock('child_process');

describe('Service Scanner', () => {
  const mockExecSync = child_process.execSync as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should detect Redis version', () => {
    mockExecSync.mockImplementation((cmd: string) => {
      if (cmd.includes('redis-server')) return 'Redis server v=7.0.11 sha=00000000:0 malloc=jemalloc-5.2.1 bits=64 build=...';
      throw new Error('Command not found');
    });

    const services = scanLocalServices();
    expect(services).toContainEqual({
      name: 'redis-server',
      product: 'redis',
      version: '7.0.11',
    });
  });

  it('should detect PostgreSQL version', () => {
    mockExecSync.mockImplementation((cmd: string) => {
      if (cmd.includes('psql')) return 'psql (PostgreSQL) 14.8 (Ubuntu 14.8-0ubuntu0.22.04.1)';
      throw new Error('Command not found');
    });

    const services = scanLocalServices();
    expect(services).toContainEqual({
      name: 'psql',
      product: 'postgresql',
      version: '14.8',
    });
  });

  it('should detect Docker version', () => {
    mockExecSync.mockImplementation((cmd: string) => {
      if (cmd.includes('docker')) return 'Docker version 24.0.2, build cb74dfc';
      throw new Error('Command not found');
    });

    const services = scanLocalServices();
    expect(services).toContainEqual({
      name: 'docker',
      product: 'docker-engine',
      version: '24.0.2',
    });
  });

  it('should detect Java version', () => {
    mockExecSync.mockImplementation((cmd: string) => {
      if (cmd.includes('java')) return 'openjdk version "11.0.19" 2023-04-18\nOpenJDK Runtime Environment...';
      throw new Error('Command not found');
    });

    const services = scanLocalServices();
    expect(services).toContainEqual({
      name: 'java',
      product: 'java',
      version: '11.0.19',
    });
  });

  it('should handle missing binaries gracefully', () => {
    mockExecSync.mockImplementation(() => {
      throw new Error('Command not found');
    });

    const services = scanLocalServices();
    expect(services).toHaveLength(0);
  });

  it('should handle unexpected output format', () => {
    mockExecSync.mockImplementation(() => {
      return 'Some unexpected output string';
    });

    const services = scanLocalServices();
    expect(services).toHaveLength(0);
  });
});
