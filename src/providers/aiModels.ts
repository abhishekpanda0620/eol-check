/**
 * AI/ML Models EOL Provider
 * 
 * This module provides End of Life (EOL) and deprecation information for 
 * generative AI models from major providers like OpenAI, Anthropic, Google, 
 * Meta, Mistral, and Cohere.
 * 
 * Data Sources:
 * - OpenAI: https://platform.openai.com/docs/deprecations
 * - Anthropic: https://docs.anthropic.com/en/docs/resources/model-deprecations
 * - Google: https://ai.google.dev/gemini-api/docs/deprecations
 * - Meta: Community tracking (open source models)
 * - Mistral: https://docs.mistral.ai
 * - Cohere: https://docs.cohere.com
 * 
 * Note: Since AI providers don't offer public APIs for deprecation data,
 * this module maintains curated data based on official announcements.
 * The data is updated regularly. Contributions welcome!
 * 
 * Last updated: December 2025
 */

/**
 * AI Model Cycle - simplified version of EolCycle for AI models
 * Only contains the fields relevant to AI model deprecation tracking
 */
export interface AIModelCycle {
  cycle: string;           // Version/variant identifier (e.g., '0613', 'latest', '8b')
  releaseDate: string;     // Release date in YYYY-MM-DD format
  eol: string | boolean;   // EOL date string, false if not EOL, true if already EOL
  lts: boolean;            // Whether this is a recommended/stable version
  deprecated?: boolean;    // Whether officially deprecated (still works but not recommended)
  replacement?: string;    // Recommended replacement model
}

export interface AIModelInfo {
  provider: string;
  model: string;
  version: string;
  eolData: AIModelCycle[];
}

export interface DetectedAIModel {
  provider: string;
  model: string;
  version: string;
  source: string; // Where it was detected (e.g., 'package.json', '.env', 'code')
}

/**
 * OpenAI GPT Models EOL Data
 * Based on official OpenAI deprecation announcements
 * Source: https://platform.openai.com/docs/deprecations
 */
export const OPENAI_MODELS: Record<string, AIModelCycle[]> = {
  // Frontier Models (Active)
  'gpt-5.1': [
    { cycle: 'latest', releaseDate: '2025-11-18', eol: false, lts: true },
  ],
  'gpt-5-mini': [
    { cycle: 'latest', releaseDate: '2025-11-18', eol: false, lts: true },
  ],
  'gpt-5-nano': [
    { cycle: 'latest', releaseDate: '2025-11-18', eol: false, lts: true },
  ],
  'gpt-5-pro': [
    { cycle: 'latest', releaseDate: '2025-11-18', eol: false, lts: true },
  ],
  'gpt-5': [
    { cycle: 'latest', releaseDate: '2025-08-07', eol: false, lts: true },
  ],
  'gpt-4.1': [
    { cycle: 'latest', releaseDate: '2025-04-14', eol: false, lts: true },
  ],
  
  // GPT-4 Series
  'gpt-4': [
    { cycle: '0314', releaseDate: '2023-03-14', eol: '2026-03-26', lts: false },
    { cycle: '0613', releaseDate: '2023-06-13', eol: '2024-06-13', lts: false },
    { cycle: '1106-preview', releaseDate: '2023-11-06', eol: '2026-03-26', lts: false },
    { cycle: '0125-preview', releaseDate: '2024-01-25', eol: '2026-03-26', lts: false },
    { cycle: 'turbo-2024-04-09', releaseDate: '2024-04-09', eol: '2025-11-14', lts: false },
    { cycle: 'turbo', releaseDate: '2024-04-09', eol: false, lts: true },
  ],
  'gpt-4-32k': [
    { cycle: '0314', releaseDate: '2023-03-14', eol: '2025-06-06', lts: false },
    { cycle: '0613', releaseDate: '2023-06-13', eol: '2025-06-06', lts: false },
  ],
  'gpt-4o': [
    { cycle: '2024-05-13', releaseDate: '2024-05-13', eol: false, lts: true },
    { cycle: '2024-08-06', releaseDate: '2024-08-06', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2024-11-20', eol: false, lts: true },
  ],
  'chatgpt-4o-latest': [
    { cycle: 'latest', releaseDate: '2024-08-06', eol: '2026-02-17', lts: false },
  ],
  'gpt-4o-mini': [
    { cycle: '2024-07-18', releaseDate: '2024-07-18', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2024-07-18', eol: false, lts: true },
  ],
  'gpt-4.5-preview': [
    { cycle: 'preview', releaseDate: '2025-02-27', eol: '2025-07-14', lts: false },
  ],
  
  // O-Series
  'o1': [
    { cycle: 'preview', releaseDate: '2024-09-12', eol: '2025-07-28', lts: false },
    { cycle: '2024-12-17', releaseDate: '2024-12-17', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2024-12-17', eol: false, lts: true },
  ],
  'o1-mini': [
    { cycle: '2024-09-12', releaseDate: '2024-09-12', eol: '2025-10-27', lts: false },
    { cycle: 'latest', releaseDate: '2024-09-12', eol: false, lts: true },
  ],
  'o3-mini': [
    { cycle: '2025-01-31', releaseDate: '2025-01-31', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2025-01-31', eol: false, lts: true },
  ],

  // Realtime & Audio
  'gpt-4o-realtime-preview': [
    { cycle: '2024-10-01', releaseDate: '2024-10-01', eol: '2025-10-10', lts: false },
    { cycle: '2024-12-17', releaseDate: '2024-12-17', eol: '2026-02-27', lts: false },
    { cycle: '2025-06-03', releaseDate: '2025-06-03', eol: '2026-02-27', lts: false },
    { cycle: 'latest', releaseDate: '2024-10-01', eol: '2026-02-27', lts: false },
  ],
  'gpt-4o-audio-preview': [
    { cycle: '2024-10-01', releaseDate: '2024-10-01', eol: '2025-10-10', lts: false },
  ],

  // GPT-3.5 Series
  'gpt-3.5-turbo': [
    { cycle: '0301', releaseDate: '2023-03-01', eol: '2024-09-13', lts: false },
    { cycle: '0613', releaseDate: '2023-06-13', eol: '2024-09-13', lts: false },
    { cycle: '16k-0613', releaseDate: '2023-06-13', eol: '2024-09-13', lts: false },
    { cycle: '1106', releaseDate: '2023-11-06', eol: '2026-09-28', lts: false },
    { cycle: '0125', releaseDate: '2024-01-25', eol: '2025-11-14', lts: false },
    { cycle: 'latest', releaseDate: '2024-01-25', eol: false, lts: true },
  ],
  'gpt-3.5-turbo-instruct': [
    { cycle: 'latest', releaseDate: '2023-09-14', eol: '2026-09-28', lts: false },
  ],

  // DALL-E
  'dall-e-2': [
    { cycle: 'latest', releaseDate: '2022-04-06', eol: '2026-05-12', lts: false },
  ],
  'dall-e-3': [
    { cycle: 'latest', releaseDate: '2023-11-06', eol: '2026-05-12', lts: false },
  ],

  // Legacy / Deprecated
  'codex-mini-latest': [
    { cycle: 'latest', releaseDate: '2023-03-20', eol: '2026-01-16', lts: false },
  ],
  'babbage-002': [
    { cycle: 'latest', releaseDate: '2023-08-22', eol: '2026-09-28', lts: false },
  ],
  'davinci-002': [
    { cycle: 'latest', releaseDate: '2023-08-22', eol: '2026-09-28', lts: false },
  ],
  'text-moderation': [
    { cycle: '007', releaseDate: '2023-09-26', eol: '2025-10-27', lts: false },
    { cycle: 'stable', releaseDate: '2023-09-26', eol: '2025-10-27', lts: false },
    { cycle: 'latest', releaseDate: '2023-09-26', eol: '2025-10-27', lts: false },
  ],
};

/**
 * Anthropic Claude Models EOL Data
 * Based on official Anthropic deprecation announcements
 * Source: https://docs.anthropic.com/en/docs/resources/model-deprecations
 */
export const ANTHROPIC_MODELS: Record<string, AIModelCycle[]> = {
  'claude-1': [
    { cycle: '1.0', releaseDate: '2023-03-14', eol: '2024-03-01', lts: false },
    { cycle: '1.3', releaseDate: '2023-05-01', eol: '2024-03-01', lts: false },
    { cycle: 'instant-1.2', releaseDate: '2023-05-01', eol: '2024-03-01', lts: false },
  ],
  'claude-2': [
    { cycle: '2.0', releaseDate: '2023-07-11', eol: '2025-07-21', lts: false },
    { cycle: '2.1', releaseDate: '2023-11-21', eol: '2025-07-21', lts: false },
  ],
  'claude-3-opus': [
    { cycle: '20240229', releaseDate: '2024-02-29', eol: '2026-01-01', lts: true },
    { cycle: 'latest', releaseDate: '2024-02-29', eol: false, lts: true },
  ],
  'claude-3-sonnet': [
    { cycle: '20240229', releaseDate: '2024-02-29', eol: '2025-07-21', lts: false },
  ],
  'claude-3-haiku': [
    { cycle: '20240307', releaseDate: '2024-03-07', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2024-03-07', eol: false, lts: true },
  ],
  'claude-3.5-sonnet': [
    { cycle: '20240620', releaseDate: '2024-06-20', eol: '2025-10-22', lts: false },
    { cycle: '20241022', releaseDate: '2024-10-22', eol: '2025-10-22', lts: false },
  ],
  'claude-3.5-haiku': [
    { cycle: '20241022', releaseDate: '2024-10-22', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2024-10-22', eol: false, lts: true },
  ],
  'claude-sonnet-4': [
    { cycle: '20250514', releaseDate: '2025-05-14', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2025-05-14', eol: false, lts: true },
  ],
  'claude-opus-4': [
    { cycle: '20250514', releaseDate: '2025-05-14', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2025-05-14', eol: false, lts: true },
  ],
  // Claude 4.5 models (via AWS Bedrock: claude-sonnet-4-5, claude-opus-4-1)
  'claude-sonnet-4.5': [
    { cycle: '20250929', releaseDate: '2025-09-29', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2025-09-29', eol: false, lts: true },
  ],
  'claude-opus-4.1': [
    { cycle: '20250805', releaseDate: '2025-08-05', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2025-08-05', eol: false, lts: true },
  ],
};

/**
 * Google Gemini/PaLM Models EOL Data
 * Based on official Google AI deprecation announcements
 * Source: https://ai.google.dev/gemini-api/docs/deprecations
 */
export const GOOGLE_MODELS: Record<string, AIModelCycle[]> = {
  // PaLM 2 is deprecated in favor of Gemini
  'palm-2': [
    { cycle: 'text-bison-001', releaseDate: '2023-05-10', eol: '2024-10-01', lts: false },
    { cycle: 'text-bison-002', releaseDate: '2023-08-01', eol: '2024-10-01', lts: false },
    { cycle: 'chat-bison-001', releaseDate: '2023-05-10', eol: '2024-10-01', lts: false },
  ],
  'gemini-pro': [
    { cycle: '1.0', releaseDate: '2023-12-06', eol: '2025-02-15', lts: false },
  ],
  'gemini-1.0-pro': [
    { cycle: '001', releaseDate: '2024-02-15', eol: '2025-02-15', lts: false },
    { cycle: '002', releaseDate: '2024-04-01', eol: '2025-02-15', lts: false },
  ],
  'gemini-1.5-pro': [
    { cycle: 'preview-0514', releaseDate: '2024-05-14', eol: '2025-05-24', lts: false },
    { cycle: '001', releaseDate: '2024-05-24', eol: false, lts: true },
    { cycle: '002', releaseDate: '2024-09-24', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2024-09-24', eol: false, lts: true },
  ],
  'gemini-1.5-flash': [
    { cycle: 'preview-0514', releaseDate: '2024-05-14', eol: '2025-05-24', lts: false },
    { cycle: '001', releaseDate: '2024-05-24', eol: false, lts: true },
    { cycle: '002', releaseDate: '2024-09-24', eol: false, lts: true },
    { cycle: '8b', releaseDate: '2024-10-03', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2024-09-24', eol: false, lts: true },
  ],
  'gemini-2.0-flash': [
    { cycle: 'exp', releaseDate: '2024-12-11', eol: '2025-09-01', lts: false },
    { cycle: 'thinking-exp', releaseDate: '2025-01-21', eol: '2025-10-01', lts: false },
    { cycle: '001', releaseDate: '2025-02-05', eol: false, lts: true },
  ],
  'gemini-2.5-pro': [
    { cycle: 'preview-0325', releaseDate: '2025-03-25', eol: '2025-10-01', lts: false },
    { cycle: 'latest', releaseDate: '2025-03-25', eol: false, lts: true },
  ],
  'gemini-2.5-flash': [
    { cycle: 'preview-0520', releaseDate: '2025-05-20', eol: '2025-12-01', lts: false },
    { cycle: 'latest', releaseDate: '2025-05-20', eol: false, lts: true },
  ],
  'gemini-3-pro': [
    { cycle: 'preview', releaseDate: '2025-11-18', eol: false, lts: false },
    { cycle: 'latest', releaseDate: '2025-11-18', eol: false, lts: true },
  ],
};

/**
 * Meta Llama Models EOL Data
 * Note: Llama models are open-source and don't have traditional EOL dates,
 * but we track when newer versions supersede older ones
 */
export const META_MODELS: Record<string, AIModelCycle[]> = {
  'llama-2': [
    { cycle: '7b', releaseDate: '2023-07-18', eol: false, lts: false },
    { cycle: '13b', releaseDate: '2023-07-18', eol: false, lts: false },
    { cycle: '70b', releaseDate: '2023-07-18', eol: false, lts: true },
  ],
  'llama-3': [
    { cycle: '8b', releaseDate: '2024-04-18', eol: false, lts: true },
    { cycle: '70b', releaseDate: '2024-04-18', eol: false, lts: true },
  ],
  'llama-3.1': [
    { cycle: '8b', releaseDate: '2024-07-23', eol: false, lts: true },
    { cycle: '70b', releaseDate: '2024-07-23', eol: false, lts: true },
    { cycle: '405b', releaseDate: '2024-07-23', eol: false, lts: true },
  ],
  'llama-3.2': [
    { cycle: '1b', releaseDate: '2024-09-25', eol: false, lts: true },
    { cycle: '3b', releaseDate: '2024-09-25', eol: false, lts: true },
    { cycle: '11b', releaseDate: '2024-09-25', eol: false, lts: true },
    { cycle: '90b', releaseDate: '2024-09-25', eol: false, lts: true },
  ],
  'llama-3.3': [
    { cycle: '70b', releaseDate: '2024-12-06', eol: false, lts: true },
  ],
  'llama-4': [
    { cycle: 'scout', releaseDate: '2025-04-05', eol: false, lts: true },
    { cycle: 'maverick', releaseDate: '2025-04-05', eol: false, lts: true },
  ],
};

/**
 * Mistral AI Models EOL Data
 */
export const MISTRAL_MODELS: Record<string, AIModelCycle[]> = {
  'mistral-7b': [
    { cycle: 'v0.1', releaseDate: '2023-09-27', eol: false, lts: false },
    { cycle: 'v0.2', releaseDate: '2024-01-01', eol: false, lts: true },
    { cycle: 'v0.3', releaseDate: '2024-05-22', eol: false, lts: true },
  ],
  'mixtral-8x7b': [
    { cycle: 'v0.1', releaseDate: '2023-12-11', eol: false, lts: true },
  ],
  'mixtral-8x22b': [
    { cycle: 'v0.1', releaseDate: '2024-04-17', eol: false, lts: true },
  ],
  'mistral-large': [
    { cycle: '2402', releaseDate: '2024-02-26', eol: false, lts: false },
    { cycle: '2407', releaseDate: '2024-07-24', eol: false, lts: true },
    { cycle: '2411', releaseDate: '2024-11-18', eol: false, lts: true },
  ],
  'mistral-small': [
    { cycle: '2402', releaseDate: '2024-02-26', eol: false, lts: false },
    { cycle: '2409', releaseDate: '2024-09-18', eol: false, lts: true },
  ],
  'codestral': [
    { cycle: '2405', releaseDate: '2024-05-29', eol: false, lts: true },
  ],
  'pixtral': [
    { cycle: '12b-2409', releaseDate: '2024-09-17', eol: false, lts: true },
    { cycle: 'large-2411', releaseDate: '2024-11-18', eol: false, lts: true },
  ],
};

/**
 * Cohere Models EOL Data
 */
export const COHERE_MODELS: Record<string, AIModelCycle[]> = {
  'command': [
    { cycle: 'command', releaseDate: '2023-03-01', eol: false, lts: false },
    { cycle: 'command-light', releaseDate: '2023-03-01', eol: false, lts: false },
    { cycle: 'command-nightly', releaseDate: '2023-03-01', eol: false, lts: false },
  ],
  'command-r': [
    { cycle: 'command-r', releaseDate: '2024-03-11', eol: false, lts: true },
    { cycle: 'command-r-plus', releaseDate: '2024-04-04', eol: false, lts: true },
    { cycle: 'command-r-08-2024', releaseDate: '2024-08-01', eol: false, lts: true },
    { cycle: 'command-r-plus-08-2024', releaseDate: '2024-08-01', eol: false, lts: true },
  ],
  'command-a': [
    { cycle: 'command-a-03-2025', releaseDate: '2025-03-01', eol: false, lts: true },
  ],
};


import axios from 'axios';

// Internal cache for model data
const MODEL_CACHE: Record<string, Record<string, AIModelCycle[]>> = {
  openai: OPENAI_MODELS,
  anthropic: ANTHROPIC_MODELS,
  google: GOOGLE_MODELS,
  meta: META_MODELS,
  mistral: MISTRAL_MODELS,
  cohere: COHERE_MODELS,
};

/**
 * Refresh AI model data from official sources
 * 
 * Sources:
 * - AWS Bedrock: https://docs.aws.amazon.com/bedrock/latest/userguide/model-lifecycle.html
 * - Google AI: https://ai.google.dev/gemini-api/docs/deprecations
 */
export async function refreshAIModelData(): Promise<void> {
  console.log('Fetching AI model data from official sources...');
  
  const results = await Promise.allSettled([
    fetchAWSBedrockData(),
    fetchGoogleAIData(),
  ]);
  
  let successCount = 0;
  for (const result of results) {
    if (result.status === 'fulfilled') {
      successCount++;
    } else {
      console.warn('Failed to fetch from one source:', result.reason?.message || result.reason);
    }
  }
  
  console.log(`AI model data refreshed from ${successCount}/${results.length} sources`);
}

/**
 * Safely strip HTML tags from a string
 * Uses iterative approach to handle nested/malformed tags and removes orphaned angle brackets
 * 
 * SECURITY: This function handles untrusted HTML input from external sources.
 * It must prevent HTML injection by removing all tags and angle brackets.
 * @exported for security testing
 */
export function stripHtmlTags(html: string): string {
  let result = html;
  let previous = '';
  
  // Iteratively remove HTML tags until no more are found
  while (result !== previous) {
    previous = result;
    result = result.replace(/<[^>]*>/g, ' ');
  }
  
  // Remove any remaining angle brackets that could cause injection
  result = result.replace(/[<>]/g, '');
  
  return result;
}

/**
 * Parse date strings in various formats
 * 
 * SECURITY: Handles untrusted date strings from external sources.
 * Returns null for invalid formats rather than throwing.
 * @exported for security testing
 */
export function parseDate(dateStr: string): string | null {
  if (!dateStr || dateStr === 'N/A') return null;
  
  // Handle "No sooner than MM/DD/YYYY" format
  const noSoonerMatch = dateStr.match(/no sooner than (\d+)\/(\d+)\/(\d+)/i);
  if (noSoonerMatch) {
    const [, month, day, year] = noSoonerMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Handle "Month DD, YYYY" format
  const monthDayYear = dateStr.match(/(\w+) (\d+), (\d{4})/);
  if (monthDayYear) {
    const [, monthName, day, year] = monthDayYear;
    const months: Record<string, string> = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    const month = months[monthName];
    if (month) {
      return `${year}-${month}-${day.padStart(2, '0')}`;
    }
  }
  
  // Handle "Earliest Month YYYY" format
  const earliestMatch = dateStr.match(/earliest (\w+) (\d{4})/i);
  if (earliestMatch) {
    const [, monthName, year] = earliestMatch;
    const months: Record<string, string> = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    const month = months[monthName];
    if (month) {
      return `${year}-${month}-01`;
    }
  }
  
  // Already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  return null;
}

/**
 * Fetch Anthropic Claude models from AWS Bedrock lifecycle page
 */
async function fetchAWSBedrockData(): Promise<void> {
  const url = 'https://docs.aws.amazon.com/bedrock/latest/userguide/model-lifecycle.html';
  console.log(`  Fetching: ${url}`);
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EOLCheck/1.5)',
      },
      timeout: 15000,
    });
    
    const html = response.data as string;
    
    // Find Claude models in tables
    // AWS Bedrock uses: claude-sonnet-4-5, claude-opus-4-1, etc.
    const claudePatterns = [
      { pattern: /claude-sonnet-4-5|claude sonnet 4\.5/gi, model: 'claude-sonnet-4.5' },
      { pattern: /claude-opus-4-1|claude opus 4\.1/gi, model: 'claude-opus-4.1' },
      { pattern: /claude-sonnet-4(?!-5)|claude sonnet 4(?!\.)/gi, model: 'claude-sonnet-4' },
      { pattern: /claude-opus-4(?!-1)|claude opus 4(?!\.)/gi, model: 'claude-opus-4' },
      { pattern: /claude-3-5-sonnet|claude 3\.5 sonnet/gi, model: 'claude-3.5-sonnet' },
      { pattern: /claude-3-5-haiku|claude 3\.5 haiku/gi, model: 'claude-3.5-haiku' },
      { pattern: /claude-3-opus|claude 3 opus/gi, model: 'claude-3-opus' },
      { pattern: /claude-3-sonnet|claude 3 sonnet/gi, model: 'claude-3-sonnet' },
      { pattern: /claude-3-haiku|claude 3 haiku/gi, model: 'claude-3-haiku' },
    ];
    
    // Extract table rows - simple regex approach
    const tableRowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;
    
    while ((rowMatch = tableRowRegex.exec(html)) !== null) {
      const rowContent = rowMatch[1];
      const rowText = stripHtmlTags(rowContent).toLowerCase();
      
      for (const { pattern, model } of claudePatterns) {
        if (pattern.test(rowText)) {
          // Extract dates from row
          const dateMatches = rowContent.match(/(\d+\/\d+\/\d{4})/g);
          const noSoonerMatch = rowText.match(/no sooner than (\d+\/\d+\/\d{4})/i);
          
          let eolDate: string | null = null;
          if (noSoonerMatch) {
            eolDate = parseDate(`No sooner than ${noSoonerMatch[1]}`);
          } else if (dateMatches && dateMatches.length > 0) {
            eolDate = parseDate(`No sooner than ${dateMatches[dateMatches.length - 1]}`);
          }
          
          // Update cache
          if (MODEL_CACHE.anthropic[model]) {
            const cycles = MODEL_CACHE.anthropic[model];
            const latestCycle = cycles.find(c => c.cycle === 'latest');
            if (latestCycle && eolDate) {
              latestCycle.eol = eolDate;
              console.log(`    ✓ Updated ${model}: EOL ${eolDate}`);
            }
          }
          
          pattern.lastIndex = 0; // Reset regex
          break;
        }
        pattern.lastIndex = 0; // Reset regex
      }
    }
  } catch (error) {
    throw new Error(`AWS Bedrock fetch failed: ${(error as Error).message}`);
  }
}

/**
 * Fetch Google Gemini models from AI Studio deprecations page
 */
async function fetchGoogleAIData(): Promise<void> {
  const url = 'https://ai.google.dev/gemini-api/docs/deprecations';
  console.log(`  Fetching: ${url}`);
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EOLCheck/1.5)',
      },
      timeout: 15000,
    });
    
    const html = response.data as string;
    
    // Target Gemini models
    const geminiPatterns = [
      { pattern: /gemini-3-pro|gemini 3 pro|gemini 3\.0 pro/gi, model: 'gemini-3-pro' },
      { pattern: /gemini-2\.5-pro|gemini 2\.5 pro/gi, model: 'gemini-2.5-pro' },
      { pattern: /gemini-2\.5-flash|gemini 2\.5 flash/gi, model: 'gemini-2.5-flash' },
      { pattern: /gemini-2\.0-flash|gemini 2\.0 flash/gi, model: 'gemini-2.0-flash' },
      { pattern: /gemini-1\.5-pro|gemini 1\.5 pro/gi, model: 'gemini-1.5-pro' },
      { pattern: /gemini-1\.5-flash|gemini 1\.5 flash/gi, model: 'gemini-1.5-flash' },
    ];
    
    // Extract table rows
    const tableRowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;
    
    while ((rowMatch = tableRowRegex.exec(html)) !== null) {
      const rowContent = rowMatch[1];
      const rowText = stripHtmlTags(rowContent).toLowerCase();
      
      for (const { pattern, model } of geminiPatterns) {
        if (pattern.test(rowText)) {
          // Extract cells
          const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
          const cells: string[] = [];
          let cellMatch;
          while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
            cells.push(stripHtmlTags(cellMatch[1]).trim());
          }
          
          // Cells: [Model, Release Date, Deprecation Date, Notes]
          if (cells.length >= 3) {
            const deprecationText = cells[2] || '';
            let eolDate: string | null = null;
            
            // Check for "Earliest Month YYYY" format
            const earliestMatch = deprecationText.match(/earliest (\w+ \d{4})/i);
            if (earliestMatch) {
              eolDate = parseDate(earliestMatch[0]);
            } else {
              // Regular date format
              const dateMatch = deprecationText.match(/(\w+ \d+, \d{4})/);
              if (dateMatch) {
                eolDate = parseDate(dateMatch[1]);
              }
            }
            
            // Update cache
            if (MODEL_CACHE.google[model] && eolDate) {
              const cycles = MODEL_CACHE.google[model];
              const latestCycle = cycles.find(c => c.cycle === 'latest');
              if (latestCycle) {
                latestCycle.eol = eolDate;
                console.log(`    ✓ Updated ${model}: EOL ${eolDate}`);
              }
            }
          }
          
          pattern.lastIndex = 0;
          break;
        }
        pattern.lastIndex = 0;
      }
    }
  } catch (error) {
    throw new Error(`Google AI fetch failed: ${(error as Error).message}`);
  }
}

/**
 * Provider to display name mapping
 */
export const PROVIDER_NAMES: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google',
  meta: 'Meta',
  mistral: 'Mistral AI',
  cohere: 'Cohere',
};

/**
 * Get EOL data for a specific AI model
 */
export function getAIModelEolData(
  provider: string,
  model: string,
): AIModelCycle[] | null {
  const providerLower = provider.toLowerCase();
  const providerModels = MODEL_CACHE[providerLower];
  
  if (!providerModels) {
    return null;
  }

  // Try exact match first
  if (providerModels[model]) {
    return providerModels[model];
  }

  // Try normalized model name (lowercase, remove version suffix)
  const normalizedModel = model.toLowerCase().replace(/-\d{8}$/, '');
  for (const [key, data] of Object.entries(providerModels)) {
    if (key.toLowerCase() === normalizedModel) {
      return data as AIModelCycle[];
    }
  }

  return null;
}

/**
 * Get all available models for a provider
 */
export function getProviderModels(provider: string): string[] {
  const providerLower = provider.toLowerCase();
  const providerModels = MODEL_CACHE[providerLower];
  
  if (!providerModels) {
    return [];
  }
  
  return Object.keys(providerModels);
}

/**
 * Get all available AI providers
 */
export function getAllProviders(): string[] {
  return Object.keys(MODEL_CACHE);
}

/**
 * SDK to Provider mapping for detection
 */
export const SDK_TO_PROVIDER: Record<string, string> = {
  // OpenAI SDKs
  'openai': 'openai',
  '@azure/openai': 'openai',
  
  // Anthropic SDKs
  '@anthropic-ai/sdk': 'anthropic',
  'anthropic': 'anthropic',
  
  // Google SDKs
  '@google/generative-ai': 'google',
  '@google-cloud/vertexai': 'google',
  'google-generativeai': 'google',  // Python
  
  // LangChain (multiple providers)
  'langchain': 'multiple',
  '@langchain/openai': 'openai',
  '@langchain/anthropic': 'anthropic',
  '@langchain/google-genai': 'google',
  '@langchain/cohere': 'cohere',
  '@langchain/mistralai': 'mistral',
  
  // Cohere
  'cohere-ai': 'cohere',
  'cohere': 'cohere',
  
  // Mistral
  '@mistralai/mistralai': 'mistral',
  'mistralai': 'mistral',
  
  // Llamaindex
  'llamaindex': 'multiple',
  
  // Vercel AI SDK
  'ai': 'multiple',
  '@ai-sdk/openai': 'openai',
  '@ai-sdk/anthropic': 'anthropic',
  '@ai-sdk/google': 'google',
  '@ai-sdk/mistral': 'mistral',
  '@ai-sdk/cohere': 'cohere',
  
  // Hugging Face
  '@huggingface/inference': 'huggingface',
  'huggingface_hub': 'huggingface',  // Python
  
  // Replicate
  'replicate': 'replicate',
  
  // Together AI
  'together-ai': 'together',
  
  // Ollama
  'ollama': 'ollama',
  'ollama-ai-provider': 'ollama',
};

/**
 * Common model usage patterns to detect in code
 */
export const MODEL_PATTERNS: Record<string, { provider: string; model: string }> = {
  // OpenAI patterns
  'gpt-4o': { provider: 'openai', model: 'gpt-4o' },
  'gpt-4o-mini': { provider: 'openai', model: 'gpt-4o-mini' },
  'gpt-4-turbo': { provider: 'openai', model: 'gpt-4' },
  'gpt-4': { provider: 'openai', model: 'gpt-4' },
  'gpt-3.5-turbo': { provider: 'openai', model: 'gpt-3.5-turbo' },
  'o1': { provider: 'openai', model: 'o1' },
  'o1-mini': { provider: 'openai', model: 'o1-mini' },
  'o1-preview': { provider: 'openai', model: 'o1' },
  'o3-mini': { provider: 'openai', model: 'o3-mini' },
  'gpt-5': { provider: 'openai', model: 'gpt-5' },
  'gpt-5.1': { provider: 'openai', model: 'gpt-5.1' },
  'gpt-5-mini': { provider: 'openai', model: 'gpt-5-mini' },
  'gpt-5-nano': { provider: 'openai', model: 'gpt-5-nano' },
  'gpt-5-pro': { provider: 'openai', model: 'gpt-5-pro' },
  'gpt-4.1': { provider: 'openai', model: 'gpt-4.1' },
  
  // Anthropic patterns
  'claude-3-opus': { provider: 'anthropic', model: 'claude-3-opus' },
  'claude-3-sonnet': { provider: 'anthropic', model: 'claude-3-sonnet' },
  'claude-3-haiku': { provider: 'anthropic', model: 'claude-3-haiku' },
  'claude-3-5-sonnet': { provider: 'anthropic', model: 'claude-3.5-sonnet' },
  'claude-3.5-sonnet': { provider: 'anthropic', model: 'claude-3.5-sonnet' },
  'claude-3-5-haiku': { provider: 'anthropic', model: 'claude-3.5-haiku' },
  'claude-3.5-haiku': { provider: 'anthropic', model: 'claude-3.5-haiku' },
  'claude-sonnet-4': { provider: 'anthropic', model: 'claude-sonnet-4' },
  'claude-opus-4': { provider: 'anthropic', model: 'claude-opus-4' },
  'claude-sonnet-4.5': { provider: 'anthropic', model: 'claude-sonnet-4.5' },
  'claude-opus-4.5': { provider: 'anthropic', model: 'claude-opus-4.5' },
  
  
  // Google patterns
  'gemini-pro': { provider: 'google', model: 'gemini-pro' },
  'gemini-1.5-pro': { provider: 'google', model: 'gemini-1.5-pro' },
  'gemini-1.5-flash': { provider: 'google', model: 'gemini-1.5-flash' },
  'gemini-2.0-flash': { provider: 'google', model: 'gemini-2.0-flash' },
  'gemini-2.5-pro': { provider: 'google', model: 'gemini-2.5-pro' },
  'gemini-2.5-flash': { provider: 'google', model: 'gemini-2.5-flash' },
  'gemini-3-pro': { provider: 'google', model: 'gemini-3-pro' },
  
  // Mistral patterns
  'mistral-large': { provider: 'mistral', model: 'mistral-large' },
  'mistral-small': { provider: 'mistral', model: 'mistral-small' },
  'codestral': { provider: 'mistral', model: 'codestral' },
  
  // Meta patterns (for ollama/huggingface usage)
  'llama-3': { provider: 'meta', model: 'llama-3' },
  'llama-3.1': { provider: 'meta', model: 'llama-3.1' },
  'llama-3.2': { provider: 'meta', model: 'llama-3.2' },
  'llama3': { provider: 'meta', model: 'llama-3' },
  'llama3.1': { provider: 'meta', model: 'llama-3.1' },
  'llama3.2': { provider: 'meta', model: 'llama-3.2' },
};
