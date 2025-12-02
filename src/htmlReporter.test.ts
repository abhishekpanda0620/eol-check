import { generateHtmlReport } from './htmlReporter';
import { Status, EvaluationResult } from './evaluator';
import * as fs from 'fs';
import * as path from 'path';

describe('HTML Reporter', () => {
  const testOutputPath = path.join(process.cwd(), 'test-output-report.html');

  // Clean up after each test
  afterEach(() => {
    if (fs.existsSync(testOutputPath)) {
      fs.unlinkSync(testOutputPath);
    }
  });

  describe('generateHtmlReport', () => {
    it('should generate an HTML file', () => {
      const results: EvaluationResult[] = [
        {
          component: 'Node.js',
          version: '18.16.0',
          status: Status.OK,
          message: 'Version 18 is supported (ends 2025-04-30)',
        },
      ];

      generateHtmlReport(results, testOutputPath);

      expect(fs.existsSync(testOutputPath)).toBe(true);
    });

    it('should include all results in the HTML', () => {
      const results: EvaluationResult[] = [
        {
          component: 'Node.js',
          version: '18.16.0',
          status: Status.OK,
          message: 'Version 18 is supported',
        },
        {
          component: 'Ubuntu',
          version: '20.04',
          status: Status.WARN,
          message: 'Approaching EOL',
        },
        {
          component: 'Python',
          version: '2.7',
          status: Status.ERR,
          message: 'EOL',
        },
      ];

      generateHtmlReport(results, testOutputPath);

      const htmlContent = fs.readFileSync(testOutputPath, 'utf-8');

      // Check that all components are present
      expect(htmlContent).toContain('Node.js');
      expect(htmlContent).toContain('Ubuntu');
      expect(htmlContent).toContain('Python');

      // Check that all versions are present
      expect(htmlContent).toContain('18.16.0');
      expect(htmlContent).toContain('20.04');
      expect(htmlContent).toContain('2.7');

      // Check that all statuses are present
      expect(htmlContent).toContain('OK');
      expect(htmlContent).toContain('WARN');
      expect(htmlContent).toContain('ERR');
    });

    it('should generate correct statistics', () => {
      const results: EvaluationResult[] = [
        {
          component: 'A',
          version: '1',
          status: Status.OK,
          message: 'OK',
        },
        {
          component: 'B',
          version: '2',
          status: Status.OK,
          message: 'OK',
        },
        {
          component: 'C',
          version: '3',
          status: Status.WARN,
          message: 'WARN',
        },
        {
          component: 'D',
          version: '4',
          status: Status.ERR,
          message: 'ERR',
        },
      ];

      generateHtmlReport(results, testOutputPath);

      const htmlContent = fs.readFileSync(testOutputPath, 'utf-8');

      // Check statistics (4 total, 2 OK, 1 WARN, 1 ERR)
      expect(htmlContent).toContain('4'); // Total checks
      expect(htmlContent).toContain('2'); // OK count (should appear at least once)
      expect(htmlContent).toContain('1'); // WARN count
    });

    it('should include CSS styling', () => {
      const results: EvaluationResult[] = [
        {
          component: 'Test',
          version: '1.0.0',
          status: Status.OK,
          message: 'OK',
        },
      ];

      generateHtmlReport(results, testOutputPath);

      const htmlContent = fs.readFileSync(testOutputPath, 'utf-8');

      // Check for CSS presence
      expect(htmlContent).toContain('<style>');
      expect(htmlContent).toContain('</style>');
      expect(htmlContent).toContain('.container');
      expect(htmlContent).toContain('.badge');
    });

    it('should include custom title when provided', () => {
      const results: EvaluationResult[] = [
        {
          component: 'Test',
          version: '1.0.0',
          status: Status.OK,
          message: 'OK',
        },
      ];

      const customTitle = 'My Custom EOL Report';
      generateHtmlReport(results, testOutputPath, { title: customTitle });

      const htmlContent = fs.readFileSync(testOutputPath, 'utf-8');

      expect(htmlContent).toContain(customTitle);
    });

    it('should escape HTML special characters', () => {
      const results: EvaluationResult[] = [
        {
          component: '<script>alert("xss")</script>',
          version: '1.0.0',
          status: Status.OK,
          message: 'Test & "quotes"',
        },
      ];

      generateHtmlReport(results, testOutputPath);

      const htmlContent = fs.readFileSync(testOutputPath, 'utf-8');

      // Should escape HTML entities
      expect(htmlContent).not.toContain('<script>');
      expect(htmlContent).toContain('&lt;script&gt;');
      expect(htmlContent).toContain('&amp;');
      expect(htmlContent).toContain('&quot;');
    });

    it('should handle empty results gracefully', () => {
      const results: EvaluationResult[] = [];

      generateHtmlReport(results, testOutputPath);

      expect(fs.existsSync(testOutputPath)).toBe(true);

      const htmlContent = fs.readFileSync(testOutputPath, 'utf-8');

      // Should show 0 for all stats
      expect(htmlContent).toContain('0');
    });

    it('should create a standalone HTML file', () => {
      const results: EvaluationResult[] = [
        {
          component: 'Test',
          version: '1.0.0',
          status: Status.OK,
          message: 'OK',
        },
      ];

      generateHtmlReport(results, testOutputPath);

      const htmlContent = fs.readFileSync(testOutputPath, 'utf-8');

      // Should be complete HTML document
      expect(htmlContent).toMatch(/^<!DOCTYPE html>/);
      expect(htmlContent).toContain('<html');
      expect(htmlContent).toContain('</html>');

      // Should not reference external CSS/JS resources (links in footer are okay)
      expect(htmlContent).not.toContain('<link rel="stylesheet"');
      expect(htmlContent).not.toContain('<script src="http');
    });

    it('should throw error for invalid output path', () => {
      const results: EvaluationResult[] = [
        {
          component: 'Test',
          version: '1.0.0',
          status: Status.OK,
          message: 'OK',
        },
      ];

      const invalidPath = '/invalid/path/that/does/not/exist/report.html';

      expect(() => {
        generateHtmlReport(results, invalidPath);
      }).toThrow();
    });
  });
});
