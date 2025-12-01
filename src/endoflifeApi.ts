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

export const fetchEolData = async (product: string): Promise<EolCycle[]> => {
  try {
    const response = await fetch(`${BASE_URL}/${product}.json`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch EOL data for ${product}: ${response.statusText}`,
      );
    }
    const data = (await response.json()) as EolCycle[];
    return data;
  } catch (error) {
    console.error(`Error fetching EOL data for ${product}:`, error);
    return [];
  }
};
