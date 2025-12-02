import fs from 'fs';
import { EvaluationResult, Status } from './evaluator';

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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2.5rem 2rem;
      text-align: center;
    }
    
    header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }
    
    header .timestamp {
      font-size: 0.95rem;
      opacity: 0.9;
      font-weight: 400;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      padding: 2rem;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
    }
    
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s;
    }
    
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
    
    .stat-card .number {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .stat-card .label {
      font-size: 0.9rem;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    
    .stat-card.total .number { color: #495057; }
    .stat-card.ok .number { color: #28a745; }
    .stat-card.warn .number { color: #ffc107; }
    .stat-card.err .number { color: #dc3545; }
    
    .results {
      padding: 2rem;
    }
    
    .results h2 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      color: #212529;
    }
    
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      overflow: hidden;
    }
    
    thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
    }
    
    tbody tr {
      background: white;
      border-bottom: 1px solid #e9ecef;
      transition: background-color 0.2s;
    }
    
    tbody tr:last-child {
      border-bottom: none;
    }
    
    tbody tr:hover {
      background: #f8f9fa;
    }
    
    td {
      padding: 1rem;
      color: #495057;
    }
    
    .badge {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      min-width: 60px;
      text-align: center;
    }
    
    .badge.ok {
      background: #d4edda;
      color: #155724;
    }
    
    .badge.warn {
      background: #fff3cd;
      color: #856404;
    }
    
    .badge.err {
      background: #f8d7da;
      color: #721c24;
    }
    
    .version-badge {
      font-family: 'Courier New', monospace;
      background: #e9ecef;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #495057;
    }
    
    footer {
      padding: 1.5rem 2rem;
      background: #f8f9fa;
      text-align: center;
      color: #6c757d;
      font-size: 0.85rem;
      border-top: 1px solid #e9ecef;
    }
    
    footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
    
    footer a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }
      
      header h1 {
        font-size: 1.75rem;
      }
      
      .stats {
        grid-template-columns: 1fr;
        padding: 1rem;
      }
      
      .results {
        padding: 1rem;
      }
      
      table {
        font-size: 0.85rem;
      }
      
      th, td {
        padding: 0.75rem 0.5rem;
      }
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .container {
        box-shadow: none;
      }
      
      .stat-card:hover,
      tbody tr:hover {
        transform: none;
        background: white;
      }
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
