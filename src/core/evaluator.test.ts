import { evaluateVersion, Status } from './evaluator';
import { EolCycle } from './endoflifeApi';

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
});
