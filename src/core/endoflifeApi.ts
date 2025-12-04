
import axios from 'axios';
import { Cache } from './cache';

export interface EolCycle {
  cycle: string;
  releaseDate: string;
  eol: string | boolean;
  latest: string;
  link?: string;
  lts: boolean | string;
  support: string | boolean;
  discontinued: boolean | string;
}

const cache = new Cache();

export async function fetchEolData(
  product: string,
  refreshCache = false,
): Promise<EolCycle[]> {
  // Check cache first (unless refreshCache is requested)
  if (!refreshCache) {
    const cached = cache.get(product);
    if (cached) {
      return cached as EolCycle[];
    }
  }

  // Fetch from API
  try {
    const response = await axios.get<EolCycle[]>(
      `https://endoflife.date/api/${product}.json`,
    );
    // Save to cache
    cache.set(product, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`Product "${product}" not found on endoflife.date (404)`);
      }
      throw new Error(`Failed to fetch EOL data for ${product}: HTTP ${error.response?.status || 'Error'}`);
    }
    throw new Error(`Failed to fetch EOL data for ${product}: ${error}`);
  }
}
