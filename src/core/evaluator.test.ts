import { evaluateVersion, evaluateAIModel, Status, Category } from './evaluator';
import { EolCycle } from './endoflifeApi';
import { AIModelCycle } from '../providers/aiModels';

describe('evaluator', () => {
  const mockEolData: EolCycle[] = [
    {
      cycle: '18',
      releaseDate: '2022-04-19',
      eol: '2026-10-30', // Future date relative to Dec 2025 (> 6 months)6
      latest: '18.16.0',
      link: '',
      lts: true,
      support: '2023-10-18',
      discontinued: false,
    },
    {
      cycle: '16',
      releaseDate: '2021-04-20',
      eol: '2023-09-11',
      latest: '16.20.0',
      link: '',
      lts: true,
      support: '2022-10-18',
      discontinued: false,
    },
    {
      cycle: '22.04',
      releaseDate: '2022-04-21',
      eol: '2027-04-01',
      latest: '22.04.2',
      link: '',
      lts: true,
      support: '2027-04-01',
      discontinued: false,
    },
    {
      cycle: '20',
      releaseDate: '2023-04-18',
      eol: '2026-02-01', // Approaching EOL (within 6 months of Dec 2025)
      latest: '20.0.0',
      link: '',
      lts: true,
      support: '2024-04-01',
      discontinued: false,
    },
  ];

  describe('evaluateVersion', () => {
    it('should return OK for supported version', () => {
      const result = evaluateVersion('Node.js', 'v18.16.0', mockEolData);
      expect(result.status).toBe(Status.OK);
    });

    it('should return ERR for EOL version', () => {
      const result = evaluateVersion('Node.js', 'v16.20.0', mockEolData);
      expect(result.status).toBe(Status.ERR);
    });

    it('should return WARN for approaching EOL version', () => {
      const result = evaluateVersion('Node.js', 'v20.0.0', mockEolData);
      expect(result.status).toBe(Status.WARN);
      expect(result.message).toContain('approaching EOL');
    });

    it('should return WARN if version not found', () => {
      const result = evaluateVersion('Node.js', 'v99.0.0', mockEolData);
      expect(result.status).toBe(Status.WARN);
      expect(result.message).toContain('not found');
      expect(result.message).toContain('Available versions include');
    });

    it('should handle multi-part cycles (Ubuntu 22.04)', () => {
      const result = evaluateVersion('Ubuntu', '22.04', mockEolData);
      expect(result.status).toBe(Status.OK);
    });

    it('should handle boolean EOL (true)', () => {
      const dataWithBoolEol: EolCycle[] = [
        {
          cycle: '15',
          releaseDate: '2020-04-19',
          eol: true, // Boolean EOL
          latest: '15.0.0',
          link: '',
          lts: false,
          support: '2021-04-01',
          discontinued: true,
        },
      ];
      const result = evaluateVersion('Node.js', '15', dataWithBoolEol);
      expect(result.status).toBe(Status.ERR);
      expect(result.message).toContain('is EOL');
    });

    it('should match major-only input against major.minor cycle (e.g., input "4" matches EOL "4.0")', () => {
      const dataWithMajorMinor: EolCycle[] = [
        {
          cycle: '4.0',
          releaseDate: '2022-01-01',
          eol: '2028-01-01',
          latest: '4.0.5',
          link: '',
          lts: true,
          support: '2026-01-01',
          discontinued: false,
        },
      ];
      const result = evaluateVersion('TestProduct', '4', dataWithMajorMinor);
      expect(result.status).toBe(Status.OK);
      expect(result.message).toContain('supported');
    });

    it('should match major.minor.patch input against major-only cycle (e.g., input "4.0.1" matches EOL "4")', () => {
      const dataWithMajorOnly: EolCycle[] = [
        {
          cycle: '4',
          releaseDate: '2022-01-01',
          eol: '2028-01-01',
          latest: '4.0.5',
          link: '',
          lts: true,
          support: '2026-01-01',
          discontinued: false,
        },
      ];
      const result = evaluateVersion('TestProduct', '4.0.1', dataWithMajorOnly);
      expect(result.status).toBe(Status.OK);
      expect(result.message).toContain('supported');
    });

    it('should match major.minor input against major-only cycle via prefix (e.g., input "4.2" matches EOL "4")', () => {
      const dataWithMajorOnly: EolCycle[] = [
        {
          cycle: '4',
          releaseDate: '2022-01-01',
          eol: '2028-01-01',
          latest: '4.2.0',
          link: '',
          lts: true,
          support: '2026-01-01',
          discontinued: false,
        },
      ];
      const result = evaluateVersion('TestProduct', '4.2', dataWithMajorOnly);
      expect(result.status).toBe(Status.OK);
      expect(result.message).toContain('supported');
    });
  });

  describe('evaluateAIModel', () => {
    const mockAIData: AIModelCycle[] = [
      { cycle: 'latest', releaseDate: '2024-06-20', eol: false, lts: true },
      { cycle: '20240620', releaseDate: '2024-06-20', eol: '2025-10-22', lts: false },
      { cycle: '20241022', releaseDate: '2024-10-22', eol: false, lts: true, deprecated: true, replacement: 'claude-sonnet-4' },
    ];

    it('should return OK for supported model', () => {
      const result = evaluateAIModel('Anthropic', 'claude-3.5-sonnet', 'latest', mockAIData);
      expect(result.status).toBe(Status.OK);
      expect(result.category).toBe(Category.AI_MODEL);
      expect(result.message).toContain('supported');
    });

    it('should return OK with LTS indicator', () => {
      const result = evaluateAIModel('Anthropic', 'claude-3.5-sonnet', 'latest', mockAIData);
      expect(result.message).toContain('LTS');
    });

    it('should return WARN for deprecated model with replacement', () => {
      const result = evaluateAIModel('Anthropic', 'claude-3.5-sonnet', '20241022', mockAIData);
      expect(result.status).toBe(Status.WARN);
      expect(result.message).toContain('deprecated');
      expect(result.message).toContain('claude-sonnet-4');
    });

    it('should return WARN for approaching EOL model', () => {
      const approachingEolData: AIModelCycle[] = [
        { cycle: '0613', releaseDate: '2024-06-13', eol: '2026-02-15', lts: false }, // Within 6 months of Dec 2025
      ];
      const result = evaluateAIModel('OpenAI', 'gpt-4', '0613', approachingEolData);
      expect(result.status).toBe(Status.WARN);
      expect(result.message).toContain('approaching EOL');
    });

    it('should return ERR for EOL model', () => {
      const eolData: AIModelCycle[] = [
        { cycle: 'v1', releaseDate: '2023-03-14', eol: '2024-03-01', lts: false },
      ];
      const result = evaluateAIModel('Anthropic', 'claude-1', 'v1', eolData);
      expect(result.status).toBe(Status.ERR);
      expect(result.message).toContain('EOL');
    });

    it('should return ERR for boolean EOL model', () => {
      const boolEolData: AIModelCycle[] = [
        { cycle: 'old', releaseDate: '2022-01-01', eol: true, lts: false, replacement: 'gpt-4' },
      ];
      const result = evaluateAIModel('OpenAI', 'gpt-3', 'old', boolEolData);
      expect(result.status).toBe(Status.ERR);
      expect(result.message).toContain('Upgrade to gpt-4');
    });

    it('should return WARN for unknown model version', () => {
      const result = evaluateAIModel('OpenAI', 'gpt-4', 'unknown-version', mockAIData);
      expect(result.status).toBe(Status.WARN);
      expect(result.message).toContain('not found');
    });

    it('should handle version starting with cycle name', () => {
      const data: AIModelCycle[] = [
        { cycle: '2024', releaseDate: '2024-01-01', eol: false, lts: true },
      ];
      const result = evaluateAIModel('Test', 'model', '2024-preview', data);
      expect(result.status).toBe(Status.OK);
    });

    it('should handle deprecated model without replacement', () => {
      const data: AIModelCycle[] = [
        { cycle: 'old', releaseDate: '2023-01-01', eol: '2025-01-01', lts: false, deprecated: true },
      ];
      const result = evaluateAIModel('Test', 'model', 'old', data);
      expect(result.status).toBe(Status.WARN);
      expect(result.message).toContain('deprecated');
    });

    it('should show EOL date for deprecated model', () => {
      const data: AIModelCycle[] = [
        { cycle: 'dep', releaseDate: '2023-01-01', eol: '2025-06-01', lts: false, deprecated: true },
      ];
      const result = evaluateAIModel('Test', 'model', 'dep', data);
      expect(result.message).toContain('EOL 2025-06-01');
    });
  });
});
