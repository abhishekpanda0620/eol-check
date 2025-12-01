import { Cache } from './cache';

export interface EolCycle {
  cycle: string;
  releaseDate: string;
  eol: string | boolean;
  latest: string;
  link: string;
  lts: string | boolean;
  support: string | boolean;
  discontinued: string | boolean;
}

const BASE_URL = 'https://endoflife.date/api';
const cache = new Cache();

export const fetchEolData = async (
  product: string,
  forceRefresh = false,
): Promise<EolCycle[]> => {
  // Check cache first (unless force refresh is requested)
  if (!forceRefresh) {
    const cached = cache.get(product);
    if (cached) {
      return cached;
    }
  }

  // Fetch from API
  try {
    const response = await fetch(`${BASE_URL}/${product}.json`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch EOL data for ${product}: ${response.statusText}`,
      );
    }
    const data = (await response.json()) as EolCycle[];

    // Save to cache
    cache.set(product, data);

    return data;
  } catch (error) {
    console.error(`Error fetching EOL data for ${product}:`, error);
    return [];
  }
};
