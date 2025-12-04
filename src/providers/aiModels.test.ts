import {
  OPENAI_MODELS,
  ANTHROPIC_MODELS,
  GOOGLE_MODELS,
  META_MODELS,
  MISTRAL_MODELS,
  COHERE_MODELS,
  getAIModelEolData,
  getProviderModels,
  getAllProviders,
  PROVIDER_NAMES,
  SDK_TO_PROVIDER,
  MODEL_PATTERNS,
  AIModelCycle,
} from './aiModels';

describe('AI Models Provider', () => {
  describe('Model Data Constants', () => {
    describe('OpenAI Models', () => {
      it('should have GPT-4o model data', () => {
        expect(OPENAI_MODELS['gpt-4o']).toBeDefined();
        expect(OPENAI_MODELS['gpt-4o'].length).toBeGreaterThan(0);
      });

      it('should have GPT-4 model data', () => {
        expect(OPENAI_MODELS['gpt-4']).toBeDefined();
        expect(OPENAI_MODELS['gpt-4'].length).toBeGreaterThan(0);
      });

      it('should have GPT-3.5-turbo model data', () => {
        expect(OPENAI_MODELS['gpt-3.5-turbo']).toBeDefined();
        expect(OPENAI_MODELS['gpt-3.5-turbo'].length).toBeGreaterThan(0);
      });

      it('should have GPT-5 model data', () => {
        expect(OPENAI_MODELS['gpt-5']).toBeDefined();
        expect(OPENAI_MODELS['gpt-5'].length).toBeGreaterThan(0);
      });

      it('should have GPT-5.1 model data', () => {
        expect(OPENAI_MODELS['gpt-5.1']).toBeDefined();
        expect(OPENAI_MODELS['gpt-5.1'].length).toBeGreaterThan(0);
      });

      it('should have o1 and o3 model data', () => {
        expect(OPENAI_MODELS['o1']).toBeDefined();
        expect(OPENAI_MODELS['o3-mini']).toBeDefined();
      });

      it('should have valid cycle structure for OpenAI models', () => {
        const cycle = OPENAI_MODELS['gpt-4o'][0];
        expect(cycle).toHaveProperty('cycle');
        expect(cycle).toHaveProperty('releaseDate');
        expect(cycle).toHaveProperty('eol');
        expect(cycle).toHaveProperty('lts');
      });
    });

    describe('Anthropic Models', () => {
      it('should have Claude 3.5 Sonnet model data', () => {
        expect(ANTHROPIC_MODELS['claude-3.5-sonnet']).toBeDefined();
        expect(ANTHROPIC_MODELS['claude-3.5-sonnet'].length).toBeGreaterThan(0);
      });

      it('should have Claude 3 Opus model data', () => {
        expect(ANTHROPIC_MODELS['claude-3-opus']).toBeDefined();
      });

      it('should have Claude Sonnet 4 model data', () => {
        expect(ANTHROPIC_MODELS['claude-sonnet-4']).toBeDefined();
      });

      it('should have Claude Opus 4 model data', () => {
        expect(ANTHROPIC_MODELS['claude-opus-4']).toBeDefined();
      });

      it('should have Claude Sonnet 4.5 model data', () => {
        expect(ANTHROPIC_MODELS['claude-sonnet-4.5']).toBeDefined();
        const cycles = ANTHROPIC_MODELS['claude-sonnet-4.5'];
        expect(cycles.some((c: AIModelCycle) => c.cycle === 'latest')).toBe(true);
      });

      it('should have Claude Opus 4.1 model data', () => {
        expect(ANTHROPIC_MODELS['claude-opus-4.1']).toBeDefined();
        const cycles = ANTHROPIC_MODELS['claude-opus-4.1'];
        expect(cycles.some((c: AIModelCycle) => c.cycle === 'latest')).toBe(true);
      });

      it('should have valid cycle structure for Anthropic models', () => {
        const cycle = ANTHROPIC_MODELS['claude-3.5-sonnet'][0];
        expect(cycle).toHaveProperty('cycle');
        expect(cycle).toHaveProperty('releaseDate');
        expect(cycle).toHaveProperty('eol');
        expect(cycle).toHaveProperty('lts');
      });
    });

    describe('Google Models', () => {
      it('should have Gemini 1.5 Pro model data', () => {
        expect(GOOGLE_MODELS['gemini-1.5-pro']).toBeDefined();
      });

      it('should have Gemini 2.0 Flash model data', () => {
        expect(GOOGLE_MODELS['gemini-2.0-flash']).toBeDefined();
      });

      it('should have Gemini 2.5 Pro model data', () => {
        expect(GOOGLE_MODELS['gemini-2.5-pro']).toBeDefined();
      });

      it('should have Gemini 2.5 Flash model data', () => {
        expect(GOOGLE_MODELS['gemini-2.5-flash']).toBeDefined();
      });

      it('should have Gemini 3 Pro model data', () => {
        expect(GOOGLE_MODELS['gemini-3-pro']).toBeDefined();
        const cycles = GOOGLE_MODELS['gemini-3-pro'];
        expect(cycles.some((c: AIModelCycle) => c.cycle === 'preview')).toBe(true);
        expect(cycles.some((c: AIModelCycle) => c.cycle === 'latest')).toBe(true);
      });

      it('should have deprecated PaLM 2 data', () => {
        expect(GOOGLE_MODELS['palm-2']).toBeDefined();
        const cycle = GOOGLE_MODELS['palm-2'][0];
        expect(typeof cycle.eol).toBe('string'); // Should have EOL date
      });
    });

    describe('Meta Models', () => {
      it('should have Llama 3.1 model data', () => {
        expect(META_MODELS['llama-3.1']).toBeDefined();
      });

      it('should have Llama 3.2 model data', () => {
        expect(META_MODELS['llama-3.2']).toBeDefined();
      });

      it('should have Llama 4 model data', () => {
        expect(META_MODELS['llama-4']).toBeDefined();
      });
    });

    describe('Mistral Models', () => {
      it('should have Mistral Large model data', () => {
        expect(MISTRAL_MODELS['mistral-large']).toBeDefined();
      });

      it('should have Codestral model data', () => {
        expect(MISTRAL_MODELS['codestral']).toBeDefined();
      });
    });

    describe('Cohere Models', () => {
      it('should have Command-R model data', () => {
        expect(COHERE_MODELS['command-r']).toBeDefined();
      });

      it('should have Command-A model data', () => {
        expect(COHERE_MODELS['command-a']).toBeDefined();
      });
    });
  });

  describe('getAIModelEolData', () => {
    it('should return data for valid provider and model', () => {
      const data = getAIModelEolData('openai', 'gpt-4o');
      expect(data).not.toBeNull();
      expect(data!.length).toBeGreaterThan(0);
    });

    it('should return data for Claude Sonnet 4.5', () => {
      const data = getAIModelEolData('anthropic', 'claude-sonnet-4.5');
      expect(data).not.toBeNull();
      expect(data!.length).toBeGreaterThan(0);
    });

    it('should return data for GPT-5', () => {
      const data = getAIModelEolData('openai', 'gpt-5');
      expect(data).not.toBeNull();
    });

    it('should return data for Gemini 3 Pro', () => {
      const data = getAIModelEolData('google', 'gemini-3-pro');
      expect(data).not.toBeNull();
    });

    it('should return null for unknown provider', () => {
      const data = getAIModelEolData('unknown-provider', 'gpt-4');
      expect(data).toBeNull();
    });

    it('should return null for unknown model', () => {
      const data = getAIModelEolData('openai', 'unknown-model');
      expect(data).toBeNull();
    });

    it('should handle case-insensitive provider names', () => {
      const data1 = getAIModelEolData('OpenAI', 'gpt-4o');
      const data2 = getAIModelEolData('OPENAI', 'gpt-4o');
      expect(data1).not.toBeNull();
      expect(data2).not.toBeNull();
    });
  });

  describe('getProviderModels', () => {
    it('should return all models for OpenAI', () => {
      const models = getProviderModels('openai');
      expect(models).toContain('gpt-4o');
      expect(models).toContain('gpt-4');
      expect(models).toContain('gpt-5');
      expect(models).toContain('gpt-5.1');
    });

    it('should return all models for Anthropic', () => {
      const models = getProviderModels('anthropic');
      expect(models).toContain('claude-3.5-sonnet');
      expect(models).toContain('claude-sonnet-4');
      expect(models).toContain('claude-sonnet-4.5');
      expect(models).toContain('claude-opus-4.1');
    });

    it('should return all models for Google', () => {
      const models = getProviderModels('google');
      expect(models).toContain('gemini-1.5-pro');
      expect(models).toContain('gemini-3-pro');
    });

    it('should return empty array for unknown provider', () => {
      const models = getProviderModels('unknown');
      expect(models).toEqual([]);
    });
  });

  describe('getAllProviders', () => {
    it('should return all provider names', () => {
      const providers = getAllProviders();
      expect(providers).toContain('openai');
      expect(providers).toContain('anthropic');
      expect(providers).toContain('google');
      expect(providers).toContain('meta');
      expect(providers).toContain('mistral');
      expect(providers).toContain('cohere');
    });

    it('should return at least 6 providers', () => {
      const providers = getAllProviders();
      expect(providers.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('PROVIDER_NAMES', () => {
    it('should have display names for all providers', () => {
      expect(PROVIDER_NAMES['openai']).toBe('OpenAI');
      expect(PROVIDER_NAMES['anthropic']).toBe('Anthropic');
      expect(PROVIDER_NAMES['google']).toBe('Google');
      expect(PROVIDER_NAMES['meta']).toBe('Meta');
      expect(PROVIDER_NAMES['mistral']).toBe('Mistral AI');
      expect(PROVIDER_NAMES['cohere']).toBe('Cohere');
    });
  });

  describe('SDK_TO_PROVIDER', () => {
    it('should map OpenAI SDKs correctly', () => {
      expect(SDK_TO_PROVIDER['openai']).toBe('openai');
      expect(SDK_TO_PROVIDER['@azure/openai']).toBe('openai');
    });

    it('should map Anthropic SDKs correctly', () => {
      expect(SDK_TO_PROVIDER['@anthropic-ai/sdk']).toBe('anthropic');
      expect(SDK_TO_PROVIDER['anthropic']).toBe('anthropic');
    });

    it('should map Google SDKs correctly', () => {
      expect(SDK_TO_PROVIDER['@google/generative-ai']).toBe('google');
      expect(SDK_TO_PROVIDER['@google-cloud/vertexai']).toBe('google');
    });

    it('should map LangChain SDKs correctly', () => {
      expect(SDK_TO_PROVIDER['langchain']).toBe('multiple');
      expect(SDK_TO_PROVIDER['@langchain/openai']).toBe('openai');
      expect(SDK_TO_PROVIDER['@langchain/anthropic']).toBe('anthropic');
    });

    it('should map Vercel AI SDK correctly', () => {
      expect(SDK_TO_PROVIDER['ai']).toBe('multiple');
      expect(SDK_TO_PROVIDER['@ai-sdk/openai']).toBe('openai');
      expect(SDK_TO_PROVIDER['@ai-sdk/anthropic']).toBe('anthropic');
    });
  });

  describe('MODEL_PATTERNS', () => {
    it('should have patterns for GPT models', () => {
      expect(MODEL_PATTERNS['gpt-4o']).toEqual({ provider: 'openai', model: 'gpt-4o' });
      expect(MODEL_PATTERNS['gpt-4']).toEqual({ provider: 'openai', model: 'gpt-4' });
      expect(MODEL_PATTERNS['gpt-5']).toEqual({ provider: 'openai', model: 'gpt-5' });
      expect(MODEL_PATTERNS['gpt-5.1']).toEqual({ provider: 'openai', model: 'gpt-5.1' });
    });

    it('should have patterns for Claude models', () => {
      expect(MODEL_PATTERNS['claude-3.5-sonnet']).toEqual({ provider: 'anthropic', model: 'claude-3.5-sonnet' });
      expect(MODEL_PATTERNS['claude-sonnet-4']).toEqual({ provider: 'anthropic', model: 'claude-sonnet-4' });
      expect(MODEL_PATTERNS['claude-sonnet-4.5']).toEqual({ provider: 'anthropic', model: 'claude-sonnet-4.5' });
    });

    it('should have patterns for Gemini models', () => {
      expect(MODEL_PATTERNS['gemini-1.5-pro']).toEqual({ provider: 'google', model: 'gemini-1.5-pro' });
      expect(MODEL_PATTERNS['gemini-2.0-flash']).toEqual({ provider: 'google', model: 'gemini-2.0-flash' });
      expect(MODEL_PATTERNS['gemini-3-pro']).toEqual({ provider: 'google', model: 'gemini-3-pro' });
    });

    it('should have patterns for Llama models', () => {
      expect(MODEL_PATTERNS['llama-3.1']).toEqual({ provider: 'meta', model: 'llama-3.1' });
      expect(MODEL_PATTERNS['llama3.2']).toEqual({ provider: 'meta', model: 'llama-3.2' });
    });
  });

  describe('Model Cycle Data Validation', () => {
    it('should have valid date format for release dates', () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      
      for (const model of Object.values(OPENAI_MODELS)) {
        for (const cycle of model) {
          expect(cycle.releaseDate).toMatch(dateRegex);
        }
      }
    });

    it('should have valid EOL format (date string, true, or false)', () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      
      for (const model of Object.values(ANTHROPIC_MODELS)) {
        for (const cycle of model) {
          expect(
            typeof cycle.eol === 'boolean' || dateRegex.test(cycle.eol as string)
          ).toBe(true);
        }
      }
    });

    it('should have at least one LTS cycle for major models', () => {
      const majorModels = [
        { models: OPENAI_MODELS, key: 'gpt-4o' },
        { models: ANTHROPIC_MODELS, key: 'claude-3-opus' },
        { models: GOOGLE_MODELS, key: 'gemini-1.5-pro' },
      ];

      for (const { models, key } of majorModels) {
        const cycles = models[key];
        const hasLTS = cycles.some((c: AIModelCycle) => c.lts === true);
        expect(hasLTS).toBe(true);
      }
    });
  });
});
