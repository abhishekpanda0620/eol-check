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
  'gpt-3.5-turbo': [
    { cycle: '0301', releaseDate: '2023-03-01', eol: '2024-06-13', lts: false },
    { cycle: '0613', releaseDate: '2023-06-13', eol: '2024-09-13', lts: false },
    { cycle: '16k-0613', releaseDate: '2023-06-13', eol: '2024-09-13', lts: false },
    { cycle: '1106', releaseDate: '2023-11-06', eol: '2025-11-14', lts: false },
    { cycle: '0125', releaseDate: '2024-01-25', eol: '2025-11-14', lts: false },
    { cycle: 'latest', releaseDate: '2024-01-25', eol: false, lts: true },
  ],
  'gpt-4': [
    { cycle: '0314', releaseDate: '2023-03-14', eol: '2024-06-13', lts: false },
    { cycle: '0613', releaseDate: '2023-06-13', eol: '2024-06-13', lts: false },
    { cycle: '32k-0314', releaseDate: '2023-03-14', eol: '2025-06-06', lts: false },
    { cycle: '32k-0613', releaseDate: '2023-06-13', eol: '2025-06-06', lts: false },
    { cycle: 'turbo-2024-04-09', releaseDate: '2024-04-09', eol: '2025-11-14', lts: false },
    { cycle: 'turbo', releaseDate: '2024-04-09', eol: false, lts: true },
  ],
  'gpt-4o': [
    { cycle: '2024-05-13', releaseDate: '2024-05-13', eol: false, lts: true },
    { cycle: '2024-08-06', releaseDate: '2024-08-06', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2024-11-20', eol: false, lts: true },
  ],
  'gpt-4o-mini': [
    { cycle: '2024-07-18', releaseDate: '2024-07-18', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2024-07-18', eol: false, lts: true },
  ],
  'gpt-4.5-preview': [
    { cycle: 'preview', releaseDate: '2025-02-27', eol: '2025-07-14', lts: false },
  ],
  'o1': [
    { cycle: 'preview', releaseDate: '2024-09-12', eol: '2025-09-12', lts: false },
    { cycle: '2024-12-17', releaseDate: '2024-12-17', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2024-12-17', eol: false, lts: true },
  ],
  'o1-mini': [
    { cycle: '2024-09-12', releaseDate: '2024-09-12', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2024-09-12', eol: false, lts: true },
  ],
  'o3-mini': [
    { cycle: '2025-01-31', releaseDate: '2025-01-31', eol: false, lts: true },
    { cycle: 'latest', releaseDate: '2025-01-31', eol: false, lts: true },
  ],
  // Legacy models
  'davinci': [
    { cycle: '002', releaseDate: '2020-06-01', eol: '2024-01-04', lts: false },
  ],
  'curie': [
    { cycle: '001', releaseDate: '2020-06-01', eol: '2024-01-04', lts: false },
  ],
  'babbage': [
    { cycle: '001', releaseDate: '2020-06-01', eol: '2024-01-04', lts: false },
  ],
  'ada': [
    { cycle: '001', releaseDate: '2020-06-01', eol: '2024-01-04', lts: false },
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
 * Fetch latest deprecation data from provider documentation
 */
export async function refreshAIModelData(): Promise<void> {
  try {
    await Promise.all([
      fetchAnthropicDeprecations(),
      // Add other providers here when possible
    ]);
  } catch (error) {
    console.warn('Failed to refresh some AI model data:', error);
  }
}

/**
 * Crawl Anthropic documentation for deprecation dates
 */
async function fetchAnthropicDeprecations(): Promise<void> {
  try {
    const response = await axios.get(
      'https://docs.anthropic.com/en/docs/resources/model-deprecations',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; EOLCheck/1.0; +https://github.com/abhishekpanda0620/eol-check)',
        },
        timeout: 5000,
      }
    );
    
    const html = response.data as string;
    
    // Regex to find dates and models
    // Pattern: ### YYYY-MM-DD: Model Name ... ```model-id```
    const sectionRegex = /### (\d{4}-\d{2}-\d{2}): (.*?)[\s\S]*?```\n(.*?)\n```/g;
    
    let match;
    while ((match = sectionRegex.exec(html)) !== null) {
      const date = match[1];
      const title = match[2];
      const modelId = match[3].trim();
      
      // Determine if it's retirement or notification
      const isRetirement = title.toLowerCase().includes('retired') || 
                           html.substring(match.index, match.index + 200).toLowerCase().includes('retired');
      
      // Update the cache
      if (MODEL_CACHE.anthropic[modelId]) {
        const cycles = MODEL_CACHE.anthropic[modelId];
        // Find the cycle that matches or create a new one
        let cycle = cycles.find(c => c.cycle === modelId || c.cycle === 'latest');
        
        if (cycle) {
          cycle.eol = date;
          cycle.deprecated = true;
        } else {
          // Add new entry if we found a model ID we didn't know about
          cycles.push({
            cycle: modelId,
            releaseDate: 'unknown',
            eol: date,
            lts: false,
            deprecated: true
          });
        }
      }
    }
  } catch (error) {
    // Silent fail, fallback to static data
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
  
  
  // Google patterns
  'gemini-pro': { provider: 'google', model: 'gemini-pro' },
  'gemini-1.5-pro': { provider: 'google', model: 'gemini-1.5-pro' },
  'gemini-1.5-flash': { provider: 'google', model: 'gemini-1.5-flash' },
  'gemini-2.0-flash': { provider: 'google', model: 'gemini-2.0-flash' },
  'gemini-2.5-pro': { provider: 'google', model: 'gemini-2.5-pro' },
  
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
