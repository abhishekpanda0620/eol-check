import fs from 'fs';
import { EvaluationResult, Status } from '../core/evaluator';

export interface HtmlReportOptions {
  title?: string;
  includeTimestamp?: boolean;
}

export function generateHtmlReport(
  results: EvaluationResult[],
  outputPath: string,
  options: HtmlReportOptions = {},
): void {
  const { title = 'EOL Check Report', includeTimestamp = true } = options;

  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  // Calculate statistics
  const stats = {
    total: results.length,
    ok: results.filter((r) => r.status === Status.OK).length,
    warn: results.filter((r) => r.status === Status.WARN).length,
    err: results.filter((r) => r.status === Status.ERR).length,
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
      min-height: 100vh;
      padding: 2rem;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }
    
    header {
      background: white;
      color: #1f2937;
      padding: 2rem 2rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }
    
    header .timestamp {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      padding: 1.5rem 2rem;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .stat-card {
      background: white;
      padding: 1rem;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      text-align: left;
    }
    
    .stat-card:hover {
      transform: none;
      box-shadow: none;
      border-color: #d1d5db;
    }
    
    .stat-card .number {
      font-size: 1.875rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
      line-height: 1;
    }
    
    .stat-card .label {
      font-size: 0.75rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }
    
    .stat-card.total .number { color: #374151; }
    .stat-card.ok .number { color: #059669; }
    .stat-card.warn .number { color: #d97706; }
    .stat-card.err .number { color: #dc2626; }
    
    .results {
      padding: 0;
    }
    
    .results h2 {
      display: none;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      box-shadow: none;
      border-radius: 0;
    }
    
    thead {
      background: #f9fafb;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
    }
    
    th {
      padding: 0.75rem 1.5rem;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      color: #6b7280;
    }
    
    tbody tr {
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }
    
    tbody tr:hover {
      background: #f9fafb;
    }
    
    td {
      padding: 1rem 1.5rem;
      color: #374151;
      font-size: 0.875rem;
    }
    
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.125rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
      letter-spacing: 0;
      min-width: auto;
    }
    
    .badge.ok {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    
    .badge.warn {
      background: #fffbeb;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    
    .badge.err {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }
    
    .version-badge {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      background: #f3f4f6;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-size: 0.8125rem;
      font-weight: 400;
      color: #374151;
      border: 1px solid #e5e7eb;
    }
    
    footer {
      padding: 1.5rem 2rem;
      background: white;
      text-align: center;
      color: #9ca3af;
      font-size: 0.8125rem;
      border-top: 1px solid #e5e7eb;
    }
    
    footer a {
      color: #6b7280;
      text-decoration: none;
      font-weight: 500;
    }
    
    footer a:hover {
      color: #374151;
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      body { padding: 1rem; }
      header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
      .stats { grid-template-columns: 1fr 1fr; }
      th, td { padding: 0.75rem 1rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${title}</h1>
      ${includeTimestamp ? `<p class="timestamp">Generated on ${timestamp}</p>` : ''}
    </header>
    
    <div class="stats">
      <div class="stat-card total">
        <div class="number">${stats.total}</div>
        <div class="label">Total Checks</div>
      </div>
      <div class="stat-card ok">
        <div class="number">${stats.ok}</div>
        <div class="label">Supported</div>
      </div>
      <div class="stat-card warn">
        <div class="number">${stats.warn}</div>
        <div class="label">Warnings</div>
      </div>
      <div class="stat-card err">
        <div class="number">${stats.err}</div>
        <div class="label">EOL / Errors</div>
      </div>
    </div>
    
    <div class="results">
      <h2>Detailed Results</h2>
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Component</th>
            <th>Version</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          ${results
            .map(
              (result) => `
            <tr>
              <td><span class="badge ${result.status.toLowerCase()}">${result.status}</span></td>
              <td><strong>${escapeHtml(result.component)}</strong></td>
              <td><span class="version-badge">${escapeHtml(result.version)}</span></td>
              <td>${escapeHtml(result.message)}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
    
    <footer>
      <p>
        Generated by <a href="https://github.com/abhishekpanda0620/eol-check" target="_blank">eol-check</a> 
        | Data from <a href="https://endoflife.date" target="_blank">endoflife.date</a>
      </p>
    </footer>
  </div>
</body>
</html>`;

  try {
    fs.writeFileSync(outputPath, html, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write HTML report to ${outputPath}: ${error}`);
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
