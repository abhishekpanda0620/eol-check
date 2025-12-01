import fs from 'fs';
import path from 'path';
import os from 'os';
import { EolCycle } from './endoflifeApi';

interface CacheEntry {
  product: string;
  timestamp: number;
  data: EolCycle[];
}

export class Cache {
  private cacheDir: string;
  private ttl: number; // milliseconds

  constructor(ttl = 24 * 60 * 60 * 1000) {
    // Default: 24 hours
    this.cacheDir = path.join(os.homedir(), '.eol-check', 'cache');
    this.ttl = ttl;
    this.ensureCacheDir();
  }

  private ensureCacheDir(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private getCacheFilePath(product: string): string {
    return path.join(this.cacheDir, `${product}.json`);
  }

  get(product: string): EolCycle[] | null {
    const filePath = this.getCacheFilePath(product);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const entry: CacheEntry = JSON.parse(content);

      // Check if cache is still valid
      const now = Date.now();
      if (now - entry.timestamp > this.ttl) {
        // Cache expired
        return null;
      }

      return entry.data;
    } catch (error) {
      // Corrupted cache file, return null to trigger refresh
      console.warn(`Failed to read cache for ${product}:`, error);
      return null;
    }
  }

  set(product: string, data: EolCycle[]): void {
    const filePath = this.getCacheFilePath(product);
    const entry: CacheEntry = {
      product,
      timestamp: Date.now(),
      data,
    };

    try {
      fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), 'utf-8');
    } catch (error) {
      console.warn(`Failed to write cache for ${product}:`, error);
    }
  }

  invalidate(product: string): void {
    const filePath = this.getCacheFilePath(product);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  clear(): void {
    if (!fs.existsSync(this.cacheDir)) {
      return;
    }

    const files = fs.readdirSync(this.cacheDir);
    for (const file of files) {
      fs.unlinkSync(path.join(this.cacheDir, file));
    }
  }
}
